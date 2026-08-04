const fs = require('fs');
const d = require('./data/products.json');

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
function add(url, prio) {
  xml += '  <url><loc>' + url + '</loc><lastmod>2026-08-04</lastmod><changefreq>weekly</changefreq><priority>' + prio + '</priority></url>\n';
}

add('https://kidtoycn.com/', '1.0');
['about', 'contact', 'faq', 'shipping', 'refund'].forEach(p => add('https://kidtoycn.com/' + p + '/', '0.6'));
d.collections.filter(c => c.handle !== 'frontpage').forEach(c => add('https://kidtoycn.com/collections/' + c.handle + '/', '0.8'));
add('https://kidtoycn.com/collections/all/', '0.8');
d.products.forEach(p => add('https://kidtoycn.com/products/' + p.handle + '/', '0.8'));
xml += '</urlset>';

fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/sitemap.xml', xml);
console.log('Sitemap written to public/, URLs:', xml.split('<url>').length - 1);
