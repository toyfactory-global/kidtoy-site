const fs=require('fs'),path=require('path');
function walk(d,o=[]){for(const f of fs.readdirSync(d)){const p=path.join(d,f);const s=fs.statSync(p);if(s.isDirectory())walk(p,o);else if(f.endsWith('.html'))o.push(p);}return o;}
const files=walk('dist');
const counter={};
let total=0;
for(const f of files){
 const h=fs.readFileSync(f,'utf8');
 for(const m of h.matchAll(/href="(\/[^"#?]*?)"/g)){
  let u=m[1];
  if(!u.startsWith('/')) continue;
  if(u.startsWith('//')) continue;
  if(/\.(jpg|png|webp|svg|xml|txt|css|js|ico|pdf)$/i.test(u)) continue;
  if(u==='/') continue;
  if(u.endsWith('/')) continue;          // correct form
  total++;
  const seg=u.split('/')[1]||'(root)';
  counter[seg]=(counter[seg]||0)+1;
 }
}
console.log('internal links WITHOUT trailing slash:',total);
console.log(counter);
