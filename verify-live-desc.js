const https = require('https');
const get = (u) =>
  new Promise((r) => {
    const req = https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (x) => {
      let d = '';
      x.on('data', (c) => (d += c));
      x.on('end', () => r({ code: x.statusCode, body: d }));
    });
    req.on('error', (e) => r({ code: 0, body: String(e) }));
  });
const pick = (s, re) => ((s.match(re) || [])[1] || '').replace(/\s+/g, ' ').trim();

const URLS = [
  '/products/high-powered-electric-ice-burst-water-gun-with-led/',
  '/products/wholesale-jelly-building-blocks-60-pcs-soft-rubber-sensory-building-blocks-set-with-flexible-soft-tpe-material-for-toddlers-stem-educational-toy/',
  '/products/wholesale-christmas-themed-bubble-stick-6-hole-electric-bubble-wand-with-light-kids-holiday-party-toy/',
  '/products/high-volume-cartoon-bubble-blower-gun-12000-per-min/',
  '/products/girls-premium-complete-makeup-jewelry-toy-set/',
];

(async () => {
  for (const u of URLS) {
    const r = await get('https://kidtoycn.com' + u);
    const d = pick(r.body, /<meta name="description" content="([^"]*)"/);
    const junk = /Full Product Specification|Item Detailed Parameters/.test(d);
    console.log(`${r.code} ${junk ? 'JUNK' : 'ok  '} ${d.slice(0, 110)}`);
  }
})();
