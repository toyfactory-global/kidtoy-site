const fs=require('fs');
const h=fs.readFileSync('dist/products/wholesale-dinosaur-egg-bubble-machine-toy-automatic-electric-bubble-blower-with-dynamic-music-cool-led-lights-for-kids-outdoor-play/index.html','utf8');
const u=[...new Set([...h.matchAll(/href="(\/[^"]*)"/g)].map(m=>m[1]))];
console.log('--- link check ---');
console.log('other product links:',u.filter(x=>x.startsWith('/products/')).length);
console.log('blog links:',u.filter(x=>x.startsWith('/blog')).join(' | '));
