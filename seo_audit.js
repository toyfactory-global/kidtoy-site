const fs=require('fs'),path=require('path');
function walk(d,o=[]){for(const f of fs.readdirSync(d)){const p=path.join(d,f);const s=fs.statSync(p);if(s.isDirectory())walk(p,o);else if(f.endsWith('.html'))o.push(p);}return o;}
const files=walk('dist');
const types={}, titles={}, descs={};
let noDesc=0, dupTitle=0, dupDesc=0;
for(const f of files){
  const h=fs.readFileSync(f,'utf8');
  const t=(h.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||'';
  const dm=h.match(/<meta name="description" content="([\s\S]*?)"/);
  if(!dm||!dm[1].trim())noDesc++;
  titles[t]=(titles[t]||0)+1;
  if(dm)descs[dm[1]]=(descs[dm[1]]||0)+1;
  const lds=[...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for(const m of lds){try{const j=JSON.parse(m[1]);const tp=j['@type'];types[tp]=(types[tp]||0)+1;}catch(e){}}
}
console.log('html pages:',files.length);
console.log('JSON-LD types:',JSON.stringify(types));
console.log('pages missing description:',noDesc);
dupTitle=Object.entries(titles).filter(([k,v])=>v>1);
dupDesc=Object.entries(descs).filter(([k,v])=>v>1);
console.log('duplicate titles:',dupTitle.length, dupTitle.slice(0,3).map(x=>x[1]+'x '+x[0].slice(0,60)));
console.log('duplicate descriptions:',dupDesc.length, dupDesc.slice(0,3).map(x=>x[1]+'x '+x[0].slice(0,60)));
