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
  const h = await get('https://kidtoycn.com/');
  const checks = [
    ['hero poster gradient', /linear-gradient\(90deg, #EDF4FF/],
    ['hero makeup png', /Af8923c1f621547b6ab6869248b119717w\.png/],
    ['hero water gun png', /Aacb85bc4dfdb40438c391ee78e83a560B\.png/],
    ['poster h1', /WHOLESALE GIFT &amp; TOY/],
    ['quote band anchor', /id="quote"/],
    ['inquiry form', /hero-inquiry-form/],
    ['factory section heading', /Trusted manufacturing/],
    ['factory photo 1', /H428b51622ec946f4932ed35bc5920addu\.png/],
    ['factory photo 4', /H713c066d3f76416b92eedacf7add641eM\.png/],
    ['factory page link', /href="\/factory\/"/],
    ['certifications link', /href="\/certifications\/"/],
  ];
  for (const [label, re] of checks) {
    console.log((re.test(h) ? 'OK   ' : 'MISS ') + label);
  }
  const h1 = (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '';
  console.log('\nH1:', h1.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
})();
