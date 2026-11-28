const fs = require('fs');

// the 7 posts older than 30 days with zero impressions, plus a few recent ones
const OLD = [
  'toy-moq-landed-cost-calculation',
  'private-label-kids-makeup-moq-labelling',
  'shipping-bubble-toys-batteries-liquids',
  'electric-water-gun-specs-that-matter',
  'kids-makeup-case-formats-buying-guide',
  'wholesale-bubble-toys-buyers-guide',
  'wholesale-kids-beauty-sets-build-a-range',
];

for (const slug of OLD) {
  const p = `dist/blog/${slug}/index.html`;
  const s = fs.readFileSync(p, 'utf8');
  const body = s.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
  const words = body.split(/\s+/).filter((w) => w.length > 2).length;
  const title = ((s.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '').trim();
  const h1 = ((s.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, '').trim();
  const h2 = [...s.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
  const qh2 = h2.filter((h) => h.includes('?'));
  const tables = (s.match(/<table/g) || []).length;
  const blogLinks = new Set((s.match(/href="\/blog\/[a-z0-9-]+\/"/g) || [])).size;
  console.log(`\n${slug}`);
  console.log(`  words ${words} | H2 ${h2.length} | question H2 ${qh2.length} | tables ${tables} | blog links out ${blogLinks}`);
  console.log(`  title: ${title}`);
  console.log(`  h1   : ${h1}`);
}
