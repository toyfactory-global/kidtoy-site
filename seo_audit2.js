const fs=require('fs'),path=require('path');
function walk(d,o=[]){for(const f of fs.readdirSync(d)){const p=path.join(d,f);const s=fs.statSync(p);if(s.isDirectory())walk(p,o);else if(f.endsWith('.html'))o.push(p);}return o;}
const files=walk('dist');
const inv={};
files.forEach(f=>{const rel=path.relative('dist',f).replace(/\\/g,'/');const seg=rel.split('/')[0];inv[seg]=(inv[seg]||0)+1;});
console.log('page groups:',JSON.stringify(inv));
const p='dist/products/4-mode-dual-function-electric-bubble-water-gun-combo/index.html';
const h=fs.readFileSync(p,'utf8');
const uniq=[...new Set([...h.matchAll(/href="(\/[^"]*)"/g)].map(m=>m[1]))];
const prodLinks=uniq.filter(x=>x.startsWith('/products/'));
const collLinks=uniq.filter(x=>x.startsWith('/collections/'));
console.log('\nproduct page links: total',uniq.length,'| other products:',prodLinks.length,'| collections:',collLinks.length);
console.log('  products:',prodLinks.join(', ')||'NONE');
function size(d){let t=0;for(const f of fs.readdirSync(d)){const q=path.join(d,f);const s=fs.statSync(q);t+= s.isDirectory()?size(q):s.size;}return t;}
console.log('\ndist total:',(size('dist')/1048576).toFixed(1),'MB');
const imgs=fs.readdirSync('dist/images').filter(f=>/\.(webp|jpg|png)$/i.test(f)).map(f=>[f,fs.statSync('dist/images/'+f).size]);
imgs.sort((a,b)=>b[1]-a[1]);
console.log('images:',imgs.length,'| top5:'); imgs.slice(0,5).forEach(i=>console.log('  ',i[0],Math.round(i[1]/1024)+'KB'));
console.log('images >150KB:',imgs.filter(i=>i[1]>153600).length);
