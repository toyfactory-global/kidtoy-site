const fs = require('fs');
const path = require('path');

const RE = /href="\/blog\/[a-z0-9-]+\/"/g;

function scan(dir) {
  let pages = 0;
  let linking = 0;
  const perPost = new Map();
  for (const d of fs.readdirSync(dir)) {
    const p = path.join(dir, d, 'index.html');
    if (!fs.existsSync(p)) continue;
    pages++;
    const hits = (fs.readFileSync(p, 'utf8').match(RE) || []).map((h) => h.replace(/href="|"/g, ''));
    if (hits.length) linking++;
    for (const h of hits) perPost.set(h, (perPost.get(h) || 0) + 1);
  }
  return { pages, linking, perPost };
}

const prod = scan('dist/products');
const col = scan('dist/collections');
console.log(`product pages: ${prod.pages}, linking to a post: ${prod.linking}`);
console.log(`collection pages: ${col.pages}, linking to a post: ${col.linking}`);

const total = new Map();
for (const m of [prod.perPost, col.perPost]) {
  for (const [k, v] of m) total.set(k, (total.get(k) || 0) + v);
}
console.log('\nposts receiving at least one link from a product/collection page:');
[...total.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${v}x ${k}`));

// which blog posts are never linked from anywhere except the index
const allPosts = fs.readdirSync('src/pages/blog').filter((f) => f.endsWith('.md')).map((f) => '/blog/' + f.replace('.md', '') + '/');
const never = allPosts.filter((u) => !total.has(u));
console.log(`\nposts with zero inlinks from products/collections: ${never.length} of ${allPosts.length}`);
never.slice(0, 10).forEach((u) => console.log('  ' + u));
