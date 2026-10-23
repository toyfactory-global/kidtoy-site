const fs=require('fs'),path=require('path');
const sharp=require('./node_modules/sharp');
const dir='public/images';
const files=fs.readdirSync(dir).filter(f=>/\.webp$/i.test(f));
let total=0, changed=0, saved=0;
(async()=>{
 for(const f of files){
  const p=path.join(dir,f);
  const before=fs.statSync(p).size;
  total+=before;
  if(before<=150*1024) continue;
  const buf=fs.readFileSync(p);
  const out=await sharp(buf).resize({width:1200,withoutEnlargement:true}).webp({quality:78,effort:5}).toBuffer();
  if(out.length < before*0.92){
   fs.writeFileSync(p,out);
   saved += before-out.length; changed++;
   console.log('  shrunk',f,Math.round(before/1024)+'KB ->',Math.round(out.length/1024)+'KB');
  }
 }
 console.log('---');
 console.log('candidates scanned:',files.length,'| rewritten:',changed,'| saved:',(saved/1048576).toFixed(2),'MB');
 console.log('total image bytes now:',(fs.readdirSync(dir).reduce((s,f)=>s+fs.statSync(path.join(dir,f)).size,0)/1048576).toFixed(2),'MB');
})();
