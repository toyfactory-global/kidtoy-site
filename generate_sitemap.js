const fs = require('fs');
const path = require('path');
const dist = 'dist';

function walk(dir, base) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      files.push(...walk(path.join(dir, entry.name), base + entry.name + '/'));
    } else if (entry.name === 'index.html') {
      const url = 'https://kidtoycn.com/' + base;
      const stat = fs.statSync(path.join(dir, entry.name));
      files.push({ url, lastmod: stat.mtime.toISOString().substring(0, 10) });
    }
  }
  return files;
}

const pages = walk(dist, '');
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
pages.forEach(p => {
  const priority = p.url === 'https://kidtoycn.com/' ? '1.0' : p.url.includes('/products/') ? '0.8' : '0.6';
  xml += `  <url><loc>${p.url}</loc><lastmod>${p.lastmod}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>\n`;
});
xml += '</urlset>';
fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml);
console.log('Sitemap generated with ' + pages.length + ' URLs');
