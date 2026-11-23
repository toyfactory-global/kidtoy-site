const https = require('https');

function get(u) {
  return new Promise((res, rej) => {
    const req = https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 25000 }, (r) => {
      let c = '';
      r.on('data', (d) => (c += d));
      r.on('end', () => res(c));
    });
    req.on('error', rej);
    req.on('timeout', () => { req.destroy(); rej(new Error('timeout')); });
  });
}

const strip = (h) =>
  h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();

(async () => {
  const home = await get('https://kidtoycn.com/');
  console.log('HOME words:', strip(home).split(' ').filter(Boolean).length);
  console.log('HOME title:', (home.match(/<title>(.*?)<\/title>/s) || [])[1]);
  console.log('HOME h1:', strip((home.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || ''));
  console.log('HOME form:', /hero-inquiry-form/.test(home) ? 'yes' : 'NO');
  console.log('HOME MOQ stat present:', /54\+/.test(home) ? 'yes' : 'no');
  console.log('HOME old wrong copy "MOQ 50+":', /MOQ 50\+/.test(home) ? 'STILL THERE' : 'gone');

  const blog = await get('https://kidtoycn.com/blog/toy-sample-approval-checklist/');
  console.log('\nBLOG title:', (blog.match(/<title>(.*?)<\/title>/s) || [])[1]);
  console.log('BLOG h1:', strip((blog.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || ''));
  console.log('BLOG published:', (blog.match(/Published ([^<]{0,30})/) || [])[1] || 'MISSING');

  const pb = await get('https://kidtoycn.com/tools/wholesale-price-break-calculator/');
  const m = pb.match(/id="pb-data"[^>]*>([\s\S]*?)<\/script>/);
  if (m) {
    try { console.log('\nLIVE pb-data items:', JSON.parse(m[1]).length); }
    catch (e) { console.log('\nLIVE pb-data INVALID:', e.message); }
  } else console.log('\nLIVE pb-data not found');

  const sm = await get('https://kidtoycn.com/sitemap.xml');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
  console.log('\nSITEMAP urls:', locs.length);
  const bad = locs.filter((u) => u !== 'https://kidtoycn.com/' && !u.endsWith('/'));
  console.log('SITEMAP without trailing slash:', bad.length, bad.slice(0, 3));
})();
