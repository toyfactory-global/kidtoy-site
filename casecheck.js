const fs=require('fs'),path=require('path');
const d=require('./data/products.json');
const actual=new Set(fs.readdirSync('public/images'));
let bad=0;
for(const p of d.products){
 for(const im of (p.images||[])){
  const src=typeof im==='string'?im:im.src;
  if(!src.startsWith('/images/')) continue;
  const base=src.replace('/images/','');
  if(!actual.has(base)){ console.log('CASE/MISSING:',p.variants?.[0]?.sku,src); bad++; }
 }
}
console.log('image case mismatches:',bad);

// BOM / encoding audit on sources
function walk(dir,out=[]){for(const f of fs.readdirSync(dir)){const p=path.join(dir,f);const s=fs.statSync(p);if(s.isDirectory())walk(p,out);else out.push(p);}return out;}
let bom=0;
for(const f of walk('src')){
 const b=fs.readFileSync(f);
 if(b[0]===0xEF&&b[1]===0xBB&&b[2]===0xBF){console.log('BOM:',f);bom++;}
}
console.log('files with BOM:',bom);

// referenced layout paths exist with exact case?
for(const f of walk('src/pages/blog').filter(x=>x.endsWith('.md'))){
 const t=fs.readFileSync(f,'utf8');
 const m=t.match(/^layout:\s*(.+)$/m);
 if(m){
  const rel=path.resolve(path.dirname(f),m[1].trim());
  if(!fs.existsSync(rel)) console.log('MISSING LAYOUT in',f,'->',m[1]);
 }
}
console.log('layout check done');
