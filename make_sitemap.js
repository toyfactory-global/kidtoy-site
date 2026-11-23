/**
 * Sitemap generator.
 *
 * Rewritten to DISCOVER pages from src/pages instead of listing them by hand.
 * The hand list is why the tool, industry, factory, certification and
 * case-study pages added in the LuxoPack comparison pass would have shipped
 * without a sitemap entry — and check-site.cjs blocks the deploy on exactly
 * that mismatch. Discovery means a new page cannot be forgotten.
 *
 * Excluded: dynamic routes ([handle].astro — expanded from products.json
 * instead), the blog directory (its .md files are the source of truth), the
 * blog index (added explicitly), and 404.
 */
const fs = require('fs');
const path = require('path');
const d = require('./data/products.json');

const PAGES_DIR = path.join('src', 'pages');
const SITE = 'https://kidtoycn.com';

// lastmod = build date: the site is only rebuilt when content actually changes,
// so this stays honest while no longer being frozen at a stale date.
const LASTMOD = new Date().toISOString().slice(0, 10);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function toRoute(file) {
  let rel = path.relative(PAGES_DIR, file).split(path.sep).join('/');
  rel = rel.replace(/\.astro$/, '').replace(/\/index$/, '');
  if (rel === 'index') return '/';
  return '/' + rel + '/';
}

const entries = new Map(); // route -> priority

const files = walk(PAGES_DIR);

for (const f of files) {
  const rel = path.relative(PAGES_DIR, f).split(path.sep).join('/');
  if (!rel.endsWith('.astro')) continue;          // .md handled below
  if (rel === '404.astro') continue;
  if (rel.includes('[')) continue;                 // dynamic routes expanded later
  if (rel.startsWith('blog/') && rel !== 'blog/index.astro') continue;

  const route = toRoute(f);
  let prio = '0.6';
  if (route === '/') prio = '1.0';
  else if (route === '/collections/all/') prio = '0.8';
  else if (route.startsWith('/collections/')) prio = '0.8';
  else if (route.startsWith('/tools/')) prio = '0.8';
  else if (route.startsWith('/industries/')) prio = '0.7';
  else if (route === '/factory/' || route === '/certifications/') prio = '0.7';
  else if (route.startsWith('/case-studies/')) prio = '0.6';
  else if (route === '/privacy/' || route === '/terms/') prio = '0.3';
  entries.set(route, prio);
}

// Collections: one page per collection plus the synthetic "all" page.
d.collections
  .filter((c) => c.handle !== 'frontpage')
  .forEach((c) => entries.set(`/collections/${c.handle}/`, '0.8'));
entries.set('/collections/all/', '0.8');

// Buyer guides: one entry per markdown file in src/pages/blog/
const BLOG_DIR = path.join(PAGES_DIR, 'blog');
if (fs.existsSync(BLOG_DIR)) {
  const posts = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  if (posts.length) entries.set('/blog/', '0.8');
  posts.forEach((f) => entries.set(`/blog/${f.replace(/\.md$/, '')}/`, '0.7'));
}

// Products
d.products.forEach((p) => entries.set(`/products/${p.handle}/`, '0.8'));

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
for (const [route, prio] of entries) {
  xml += `  <url><loc>${SITE}${route}</loc><lastmod>${LASTMOD}</lastmod><changefreq>weekly</changefreq><priority>${prio}</priority></url>\n`;
}
xml += '</urlset>\n';

fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/sitemap.xml', xml);
console.log('Sitemap written to public/, URLs:', entries.size);
