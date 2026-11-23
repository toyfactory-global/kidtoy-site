const https = require('https');
const get = (u) =>
  new Promise((res, rej) => {
    const r = https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 25000 }, (x) => {
      let c = '';
      x.on('data', (d) => (c += d));
      x.on('end', () => res(c));
    });
    r.on('error', rej);
    r.on('timeout', () => { r.destroy(); rej(new Error('timeout')); });
  });

(async () => {
  const b = await get('https://kidtoycn.com/blog/');
  const links = [...b.matchAll(/href="\/blog\/([a-z0-9-]+)\/"/g)].map((m) => m[1]);
  console.log('blog index unique links:', new Set(links).size);

  const posts = ['toy-testing-budget-and-timeline', 'first-container-checklist', 'margin-math-for-toy-importers'];
  for (const s of posts) {
    const p = await get('https://kidtoycn.com/blog/' + s + '/');
    const t = (p.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
    const h1 = (p.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1].replace(/<[^>]+>/g, '').trim();
    console.log('OK', s, '| title:', t, '| h1:', h1.slice(0, 50));
  }
})();
