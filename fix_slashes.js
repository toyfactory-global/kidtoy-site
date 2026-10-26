const fs=require('fs'),path=require('path');
function walk(d,o=[]){for(const f of fs.readdirSync(d)){const p=path.join(d,f);const s=fs.statSync(p);if(s.isDirectory())walk(p,o);else if(/\.(astro|md)$/.test(f))o.push(p);}return o;}
const files=walk('src');
const ok = (u)=> u!=='/' && !u.endsWith('/') && !/[#?]/.test(u) && !/\.[a-z0-9]{2,5}$/i.test(u);
let changes=0; const report=[];
for(const f of files){
 let t=fs.readFileSync(f,'utf8'), orig=t, hits=[];
 // 1 static href
 t=t.replace(/href="(\/[^"]*)"/g,(m,p)=>{ if(!ok(p))return m; hits.push('href="'+p+'"'); return 'href="'+p+'/"'; });
 // 2 template href
 t=t.replace(/href=\{`(\/[^`]*)`\}/g,(m,p)=>{ if(!ok(p))return m; hits.push('href=`'+p+'`'); return 'href={`'+p+'/`}'; });
 // 3 backtick literals for site sections inside expressions
 t=t.replace(/`(\/(?:collections|products|blog)\/[^`]*)`/g,(m,p)=>{ if(!ok(p))return m; hits.push('`'+p+'`'); return '`'+p+'/`'; });
 // 4 single-quoted site-section literals
 t=t.replace(/'(\/(?:collections|products|blog)\/[a-z0-9\-\/]*)'/g,(m,p)=>{ if(!ok(p))return m; hits.push("'"+p+"'"); return "'"+p+"/'"; });
 // 5 markdown links
 t=t.replace(/\]\((\/[^)\s]*)\)/g,(m,p)=>{ if(!ok(p))return m; hits.push(']('+p+')'); return ']('+p+'/)'; });
 if(t!==orig){
  changes++;
  report.push(f+'  ->  '+hits.length+' replacement(s)');
  fs.writeFileSync(f,t,'utf8');
 }
}
console.log('FILES CHANGED:',changes);
report.forEach(r=>console.log('  '+r));
