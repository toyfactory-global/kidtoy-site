const https = require('https');

function head(u) {
  return new Promise((res) => {
    const req = https.get(
      u,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; site-check)' }, timeout: 20000 },
      (r) => {
        let n = 0;
        r.on('data', (d) => (n += d.length));
        r.on('end', () => res({ code: r.statusCode, bytes: n, cache: r.headers['cf-cache-status'] || '-' }));
      }
    );
    req.on('error', () => res({ code: 0, bytes: 0, cache: 'err' }));
    req.on('timeout', () => { req.destroy(); res({ code: 0, bytes: 0, cache: 'timeout' }); });
  });
}

const paths = [
  '/',
  '/tools/',
  '/tools/container-loading-calculator/',
  '/tools/landed-cost-calculator/',
  '/tools/wholesale-price-break-calculator/',
  '/tools/toy-certification-matrix/',
  '/industries/',
  '/industries/pharmacy-drugstore-chains/',
  '/factory/',
  '/certifications/',
  '/case-studies/',
  '/case-studies/mixed-container-first-order/',
  '/blog/toy-sample-approval-checklist/',
  '/sitemap.xml',
  '/llms.txt',
];

(async () => {
  for (const p of paths) {
    const r = await head('https://kidtoycn.com' + p);
    console.log(String(r.code).padEnd(4), String(r.bytes).padStart(7), r.cache.padEnd(10), p);
  }
})();
