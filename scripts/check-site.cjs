#!/usr/bin/env node
/**
 * Site integrity gate — kidtoycn.com (kidtoy-site)
 *
 * Runs AFTER `astro build`, BEFORE deploy. Cloudflare Pages runs `npm run build`;
 * if this exits non-zero the deploy fails and the previous good version stays live.
 *
 * Why it exists: a build can succeed while the OUTPUT is wrong. On 2026-07-28 a
 * batch image script corrupted text (destroying a dash AND the next character),
 * the build stayed green, and broken content shipped for 2.5 months. Separately,
 * a slash-less sitemap made 42 URLs 308-redirect on a sibling site — also green
 * at build time. Nothing was checking the rendered result.
 *
 * URL style: this site uses directory output, so pages are served WITH a trailing
 * slash (dist/products/foo/index.html -> /products/foo/). Canonical tags, the
 * sitemap and the on-disk layout must all agree exactly.
 *
 * ASCII-only output: no console-encoding surprises.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');
const SITE_ORIGIN = 'https://kidtoycn.com';
const CF_MAX = 25 * 1024 * 1024; // Cloudflare Pages per-file limit

// Pages that are not part of the crawl graph: excluded from canonical/sitemap rules.
const SPECIAL_PAGES = new Set(['404.html']);
const SITEMAP_EXCLUDE = new Set([
  '/404',
  // Shopify-export artifact: handle "frontpage", <title> is the Chinese string
  // "主页 | Kidtoy Factory", and no page links to it. Deliberately kept out of the
  // sitemap — ideally delete the collection or give it a noindex.
  '/collections/frontpage/',
]);

const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

/* ------------------------------------------------------------------ helpers */

function walk(dir, out = [], errs = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    errs.push(`${dir} -> ${e.code}`);
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out, errs);
    else out.push(p);
  }
  return out;
}

function readText(file) {
  // Node replaces undecodable bytes with U+FFFD rather than throwing.
  const text = fs.readFileSync(file, 'utf8');
  return { text, hasInvalid: text.includes('\uFFFD') };
}

const stripSlash = (u) => (u.length > 1 ? u.replace(/\/+$/, '') : u);
const toUrlPath = (u) => {
  try {
    return new URL(u).pathname;
  } catch {
    return u;
  }
};

// dist/products/foo/index.html -> /products/foo/   (trailing slash preserved)
function expectedPathFromFile(file) {
  const rel = path.relative(DIST, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  if (rel.endsWith('.html')) return '/' + rel.slice(0, -'.html'.length);
  return null;
}

/* ------------------------------------------------- 1. encoding / mojibake */

const MOJIBAKE = [
  ['U+FFFD replacement char', /\uFFFD/],
  ['UTF-8-read-as-GBK run', /(锟|鈥|鉁|馃|锛|鐨)/],
  ['latin1-as-UTF8 artifact', /(â€|ï»¿|Â£)/],
  ['dash followed by stray "?"', /[\u2013\u2014]\?/],
  ['closing tag broken by an eaten char', /\?\s*\/\s*(span|a|p|div|strong|em|li|h[1-6])\s*>/],
];

function checkEncoding() {
  const targets = [
    ...walk(path.join(ROOT, 'src')).filter((f) => /\.(astro|json|ts|js|mjs|cjs|css|md)$/i.test(f)),
    ...walk(PUBLIC).filter((f) => /\.(html|xml|txt|json|css|js)$/i.test(f)),
    ...walk(DIST).filter((f) => /\.(html|xml|txt|json|css|js)$/i.test(f)),
  ].filter((f) => !f.includes('node_modules'));

  for (const file of targets) {
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    let text;
    try {
      ({ text } = readText(file));
    } catch (e) {
      fail(`ENCODING cannot read ${rel}: ${e.code || e.message}`);
      continue;
    }
    for (const [label, re] of MOJIBAKE) {
      const m = re.exec(text);
      if (m) {
        const line = text.slice(0, m.index).split('\n').length;
        const ctx = text.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, ' ');
        fail(`ENCODING [${label}] ${rel}:${line}  ...${ctx}...`);
      }
    }
  }
}

/* --------------------------------- 2. canonical == the path actually served */

function checkCanonical(pages) {
  for (const file of pages) {
    const rel = path.relative(DIST, file).split(path.sep).join('/');
    if (SPECIAL_PAGES.has(rel)) continue;

    const expected = expectedPathFromFile(file);
    const { text } = readText(file);

    const canon = text.match(/<link[^>]+rel="canonical"[^>]*href="([^"]+)"/);
    if (!canon) {
      fail(`CANONICAL missing in ${rel} (page is served at ${expected})`);
      continue;
    }
    const canonPath = toUrlPath(canon[1]);
    if (canonPath !== expected) {
      fail(`CANONICAL mismatch ${rel}: tag says "${canonPath}" but the page is served at "${expected}"`);
    }

    const og = text.match(/property="og:url"[^>]*content="([^"]+)"/);
    if (!og) warn(`OG-URL missing in ${rel}`);
    else if (toUrlPath(og[1]) !== canonPath) {
      warn(`OG-URL differs from canonical in ${rel}: og="${toUrlPath(og[1])}" canonical="${canonPath}"`);
    }
  }
}

/* ------------------------------------------------- 3. sitemap consistency */

function checkSitemap(pages) {
  const smPath = path.join(DIST, 'sitemap.xml');
  if (!fs.existsSync(smPath)) {
    fail('SITEMAP dist/sitemap.xml is missing');
    return;
  }
  const { text } = readText(smPath);
  const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const inSitemap = new Set();
  for (const loc of locs) {
    if (!loc.startsWith(SITE_ORIGIN)) {
      fail(`SITEMAP wrong origin: ${loc} (expected prefix ${SITE_ORIGIN})`);
      continue;
    }
    const p = loc.slice(SITE_ORIGIN.length) || '/';
    if (p !== '/' && !p.endsWith('/')) {
      fail(`SITEMAP "${loc}" has no trailing slash — that URL 308-redirects and Google reports "Page with redirect"`);
    }
    inSitemap.add(p);
  }

  const built = new Set();
  for (const file of pages) {
    const rel = path.relative(DIST, file).split(path.sep).join('/');
    if (SPECIAL_PAGES.has(rel)) continue;
    const p = expectedPathFromFile(file);
    if (p) built.add(p);
  }

  for (const p of inSitemap) {
    if (!built.has(p) && !SITEMAP_EXCLUDE.has(p)) {
      fail(`SITEMAP lists ${p} but no such page was built`);
    }
  }
  for (const p of built) {
    if (!inSitemap.has(p) && !SITEMAP_EXCLUDE.has(p)) {
      fail(`Page ${p} was built but is MISSING from sitemap.xml`);
    }
  }
}

/* ----------------------------------------------------- 4. internal links */

function checkLinks(pages) {
  const allFiles = new Set(
    walk(DIST).map((f) => path.relative(DIST, f).split(path.sep).join('/'))
  );
  const broken = new Map();

  for (const file of pages) {
    const rel = path.relative(DIST, file).split(path.sep).join('/');
    const { text } = readText(file);
    for (const m of text.matchAll(/href="(\/[^"#?]*)"/g)) {
      const target = m[1];
      if (target.startsWith('//')) continue;
      const clean = target.split('?')[0].split('#')[0];
      const trimmed = stripSlash(clean);
      const bare = trimmed.replace(/^\//, '');
      const candidates = [bare || 'index.html', bare + '.html', path.posix.join(bare, 'index.html')];
      if (candidates.some((c) => allFiles.has(c))) continue;
      if (!broken.has(target)) broken.set(target, new Set());
      broken.get(target).add(rel);
    }
  }
  for (const [target, sources] of broken) {
    fail(`LINK ${target} does not resolve (found on: ${[...sources].slice(0, 3).join(', ')})`);
  }
}

/* --------------------------------------------------- 5. JSON-LD validity */

function checkJsonLd(pages) {
  for (const file of pages) {
    const rel = path.relative(DIST, file).split(path.sep).join('/');
    const { text } = readText(file);
    const blocks = [...text.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
    blocks.forEach((b, i) => {
      const raw = b[1].trim();
      if (raw.includes('JSON.stringify')) {
        fail(`JSON-LD ${rel} (block ${i + 1}) shipped as literal template text — Astro does not interpolate inside <script>; use set:html`);
        return;
      }
      try {
        JSON.parse(raw);
      } catch (e) {
        fail(`JSON-LD invalid in ${rel} (block ${i + 1}): ${e.message}`);
      }
    });
  }
}

/* -------------------------------------------- 6. product & collection data */

function checkData(pages) {
  const dataFile = path.join(ROOT, 'data', 'products.json');
  if (!fs.existsSync(dataFile)) {
    fail('DATA data/products.json is missing');
    return;
  }
  let dump;
  try {
    dump = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (e) {
    fail(`DATA data/products.json is not valid JSON: ${e.message}`);
    return;
  }
  const products = dump.products || [];
  const collections = dump.collections || [];
  if (products.length === 0) fail('DATA data/products.json has no products');

  const built = new Set(
    pages
      .map((f) => expectedPathFromFile(f))
      .filter(Boolean)
  );

  for (const p of products) {
    const id = p.handle || p.id || '(no handle)';
    for (const field of ['handle', 'title', 'price', 'moq', 'images']) {
      if (p[field] === undefined || p[field] === null || p[field] === '') {
        fail(`DATA ${id}: missing required field "${field}"`);
      }
    }
    if (typeof p.moq !== 'number' || p.moq <= 0) {
      fail(`DATA ${id}: moq must be a positive number (got ${JSON.stringify(p.moq)})`);
    }
    if (typeof p.price !== 'number' || p.price <= 0) {
      warn(`DATA ${id}: price is ${JSON.stringify(p.price)} — a non-positive price breaks Product rich results`);
    }

    const imgs = p.images || [];
    if (imgs.length < 3) warn(`DATA ${id}: only ${imgs.length} image(s)`);
    const external = [];
    for (const img of imgs) {
      const src = typeof img === 'string' ? img : img.src;
      if (!src) {
        fail(`DATA ${id}: image entry has no src`);
        continue;
      }
      // External hosts load fine, so this is not a broken page — but they cost us
      // caching and LCP control, and can be hotlink-blocked. Warn, don't block.
      if (!src.startsWith('/')) {
        external.push(src);
        continue;
      }
      const f = path.join(PUBLIC, src.replace(/^\//, ''));
      if (!fs.existsSync(f)) fail(`DATA ${id}: image missing on disk: ${src}`);
      else {
        const size = fs.statSync(f).size;
        if (size === 0) fail(`DATA ${id}: image is 0 bytes: ${src}`);
        else if (size > CF_MAX) fail(`DATA ${id}: image exceeds Cloudflare's 25MB limit: ${src}`);
      }
    }

    if (external.length) {
      warn(
        `DATA ${id}: ${external.length}/${imgs.length} image(s) served from an external host — no local caching or LCP control. First: ${external[0]}`
      );
    }

    if (p.handle && !built.has(`/products/${p.handle}/`)) {
      fail(`DATA ${id}: no page built at /products/${p.handle}/`);
    }
  }

  for (const c of collections) {
    const h = c.handle;
    if (!h) {
      fail(`DATA collection "${c.title || '(untitled)'}" has no handle`);
      continue;
    }
    if (!built.has(`/collections/${h}/`)) fail(`DATA collection ${h}: no page built at /collections/${h}/`);
    if (!products.some((p) => (p.collections || []).includes(h))) {
      warn(`DATA collection ${h}: no product references this collection (empty category page)`);
    }
  }

  console.log(`  products: ${products.length}   collections: ${collections.length}`);
}

/* --------------------------------------- 7. zero-byte / oversized assets */

function loadIgnorePatterns() {
  const gi = path.join(ROOT, '.gitignore');
  if (!fs.existsSync(gi)) return [];
  return fs
    .readFileSync(gi, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('!'));
}

function isIgnored(rel, patterns) {
  return patterns.some((raw) => {
    const pat = raw.replace(/^\//, '').replace(/\/$/, '');
    if (!pat) return false;
    if (pat.startsWith('*.')) return rel.endsWith(pat.slice(1));
    if (pat.includes('*')) {
      const re = new RegExp('^' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
      return re.test(rel);
    }
    return rel === pat || rel.startsWith(pat + '/') || rel.split('/').includes(pat);
  });
}

function checkAssets() {
  const ignore = loadIgnorePatterns();
  const files = walk(PUBLIC);
  let zero = 0;
  let skipped = 0;
  for (const f of files) {
    const rel = path.relative(PUBLIC, f).split(path.sep).join('/');
    if (isIgnored(rel, ignore)) {
      skipped++;
      continue;
    }
    const size = fs.statSync(f).size;
    if (size === 0) {
      fail(`ASSET 0 bytes: public/${rel}`);
      zero++;
    } else if (size > CF_MAX) {
      fail(`ASSET ${(size / 1048576).toFixed(1)}MB exceeds Cloudflare's 25MB limit: public/${rel}`);
    }
  }
  console.log(`  public assets: ${files.length} (${zero} empty, ${skipped} gitignored/skipped)`);
}

/* -------------------------------------------------------------- runner */

console.log('Site integrity check — kidtoycn.com');
console.log('====================================');

if (!fs.existsSync(DIST)) {
  console.log('FAILED: dist/ not found — run `astro build` first.');
  process.exit(1);
}

const walkErrors = [];
const allFiles = walk(DIST, [], walkErrors);
for (const e of walkErrors) fail(`WALK cannot read ${e}`);

const pages = allFiles.filter((f) => f.endsWith('.html'));
console.log(`  pages built: ${pages.length}`);

checkCanonical(pages);
checkEncoding();
checkSitemap(pages);
checkLinks(pages);
checkJsonLd(pages);
checkData(pages);
checkAssets();

console.log('');
if (warnings.length) {
  console.log(`WARNINGS (${warnings.length}) — not blocking:`);
  for (const w of warnings) console.log('  ~ ' + w);
  console.log('');
}
if (errors.length) {
  console.log(`FAILED: ${errors.length} problem(s) — deploy blocked:`);
  for (const e of errors) console.log('  x ' + e);
  process.exit(1);
}
console.log('PASS: site is clean.');
