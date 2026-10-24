// How many object tiles say something when inspected (spots or things), per cartridge: node tests/coverage.mjs [cN]
import fs from 'node:fs';import vm from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(x=>!x.includes('window.LEX='));
const ctx={state:{f:{},items:[],badges:[],lv:{}},ZID:'',console,window:{LEX:{map:{},defs:{}}}};vm.createContext(ctx);
vm.runInContext(scripts[0].replace('const CHAPTERS','var CHAPTERS'),ctx);
for(const s of scripts.slice(1,-1))vm.runInContext(s,ctx);
for(const CH of ctx.CHAPTERS){if(process.argv[2]&&CH.id!==process.argv[2])continue;
 ctx.state={f:{},items:[],badges:[],lv:{}};const C=CH.make();let tot=0,cov=0;const silent={};
 for(const [id,Z] of Object.entries(C.ZONES)){const sp=new Set(Object.keys(Z.spots||{}));
  Z.map.forEach((r,y)=>[...r].forEach((c,x)=>{const L=Z.legend[c];if(!L||L.walk||L.tile==='terminal'||L.term)return;tot++;
   if(sp.has(x+','+y)||(Z.things&&Z.things[c]))cov++;else{const k=`${id}:${c}(${L.tile})`;silent[k]=(silent[k]||0)+1}}))}
 console.log(`${CH.id}: ${cov}/${tot} object tiles say something`+(Object.keys(silent).length?' · silent: '+Object.entries(silent).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+'×'+v).join(' '):''))}
