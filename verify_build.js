const fs=require('fs');
const p='dist/products/4-mode-dual-function-electric-bubble-water-gun-combo/index.html';
const h=fs.readFileSync(p,'utf8');
const uniq=[...new Set([...h.matchAll(/href="(\/[^"]*)"/g)].map(m=>m[1]))];
const prod=uniq.filter(x=>x.startsWith('/products/'));
console.log('=== product page ===');
console.log('links to other products:',prod.length);
console.log('links to blog:',uniq.filter(x=>x.startsWith('/blog')).length);
const lds=[...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
lds.forEach(j=>{
 if(j['@type']==='Product'){
  console.log('Product schema keys:',Object.keys(j).join(','));
  console.log('  sku:',j.sku,'| category:',j.category,'| price:',j.offers.price,'| priceValidUntil:',j.offers.priceValidUntil);
  console.log('  images:',j.image.length,'| additionalProperty:',j.additionalProperty.length);
  console.log('  description:',(j.description||'').slice(0,120));
 }
});
console.log('\n=== collection page ===');
const c=fs.readFileSync('dist/collections/bubble-toys/index.html','utf8');
const clds=[...c.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
console.log('schema types:',clds.map(j=>j['@type']).join(', '));
const il=clds.find(j=>j['@type']==='CollectionPage');
console.log('ItemList items:',il?.mainEntity?.numberOfItems);
const faq=clds.find(j=>j['@type']==='FAQPage');
console.log('FAQ questions:',faq?.mainEntity?.length);
console.log('FAQ <details> blocks in HTML:',(c.match(/<details/g)||[]).length);
console.log('\n=== blog ===');
['dist/blog/index.html','dist/blog/hs-code-9503-toy-import-duty/index.html','dist/blog/oem-vs-odm-toys/index.html'].forEach(f=>{
 const b=fs.readFileSync(f,'utf8');
 const bl=[...b.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 console.log(' ',f.replace('dist',''),'| bytes',b.length,'| schema:',bl.map(j=>j['@type']).join(','));
});
