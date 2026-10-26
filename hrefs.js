const fs=require('fs'),path=require('path');
function walk(d,o=[]){for(const f of fs.readdirSync(d)){const p=path.join(d,f);const s=fs.statSync(p);if(s.isDirectory())walk(p,o);else if(/\.(astro|md)$/.test(f))o.push(p);}return o;}
const files=walk('src');
const seen=new Map();
for(const f of files){
 const t=fs.readFileSync(f,'utf8');
 for(const m of t.matchAll(/href="(\/[^"]*)"/g)){
  const key=f+' :: '+m[1];
  seen.set(key,(seen.get(key)||0)+1);
 }
 for(const m of t.matchAll(/href=\{`(\/[^`]*)`\}/g)){
  const key=f+' :: `'+m[1]+'`';
  seen.set(key,(seen.get(key)||0)+1);
 }
}
[...seen.keys()].sort().forEach(k=>console.log(k));
console.log('distinct href patterns:',seen.size);
