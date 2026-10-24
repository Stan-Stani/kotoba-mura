// Static checks for every chapter: node tests/validate.mjs → exits 1 on problems.
import fs from 'node:fs';import vm from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(x=>!x.includes('window.LEX=')&&!x.includes('window.SEG=')&&!x.includes('window.LINES_EN='));  // data scripts: SEG and LINES_EN (ことばのむら) are only data
const ctx={state:{f:{},items:[],badges:[],lv:{}},ZID:'',console,window:{LEX:{map:{},defs:{}}},has:w=>ctx.state.badges.includes(w),NPCS:[],player:{x:0,y:0,dir:'down'}};vm.createContext(ctx);
{const lexS=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(x=>x.includes('window.LEX='));if(lexS)vm.runInContext(lexS,ctx)}  /* the dictionary, as the page loads it first */
vm.runInContext(scripts[0].replace('const CHAPTERS','var CHAPTERS'),ctx);
for(const s of scripts.slice(1,-1))vm.runInContext(s,ctx);
const errs=[];const allWords=new Map();
for(const CH of ctx.CHAPTERS){
 const E=m=>errs.push(`${CH.id}: ${m}`);
 for(const k of ['id','n','title','save','start','make','words','color','place'])if(CH[k]==null)E('missing '+k);
 ctx.state={f:{},items:[],badges:[],lv:{}};const C=CH.make();
 if(C.WORDS.length!==CH.words)E(`words count ${C.WORDS.length} ≠ ${CH.words}`);
 for(const w of C.WORDS)if(!allWords.has(w))allWords.set(w,CH.id);  /* 단어 마을: each cartridge stands alone (6편 is a review school), so a word may come back */
 const walk=(Z,x,y)=>{const c=Z.map[y]&&Z.map[y][x];return !!(c&&Z.legend[c]&&Z.legend[c].walk)};
 const st=CH.start;if(!C.ZONES[st.zone]||!walk(C.ZONES[st.zone],st.x,st.y))E('start not walkable');
 for(const [id,Z] of Object.entries(C.ZONES)){
  const W=Z.map[0].length;Z.map.forEach((r,i)=>{if(r.length!==W)E(`${id} row ${i} len ${r.length}≠${W}`);[...r].forEach(c=>{if(!Z.legend[c])E(`${id} unknown tile char "${c}"`)})});
  if(Z.map.length<10||W<11)E(`${id} map smaller than the 11x10 view`);
  for(const L of Object.values(Z.legend))if(!(L.tile in (C.TILES||{}))&&!['hull','deck','grate','window','console','hydro','bunk','terminal','pipes','engine','airlock','ring','plate','planetWin','crate','stall','lift','tree','lawn','stone','dome','cable','police','cafe','flowers','pond','bench'].includes(L.tile))E(`${id} tile fn missing: ${L.tile}`);
  for(const [k,w] of Object.entries(Z.warps||{})){const [x,y]=k.split(',').map(Number);if(!walk(Z,x,y))E(`${id} warp ${k} not walkable`);const T=C.ZONES[w.to];if(!T){E(`${id} warp to unknown ${w.to}`);continue}if(!walk(T,w.x,w.y)||(T.warps||{})[w.x+','+w.y])E(`${id} warp ${k} lands on bad tile ${w.to} ${w.x},${w.y}`)}
  for(const [c,th] of Object.entries(Z.things||{})){ // a line for every tile of a kind
   if(!Z.legend[c])E(`${id} things key "${c}" is not a tile in its legend`);/* walkable tiles may have a line (flowers, a mat): the old engine allowed it */
   if(!Z.map.some(r=>r.includes(c)))E(`${id} things "${c}" is not on the map`);
   const r0=typeof th==='function'?th(0,0):th,vs=[].concat(r0&&r0.steps?r0.steps:r0).filter(Boolean).map(v=>v&&typeof v==='object'?v.say||'':v);  /* cartridges answer {steps:[{say}…]} */
   for(const v of vs){if(typeof v!=='string')E(`${id} things "${c}" gives a non-string`);else if(/[A-Za-z]/.test(v)||v.length>60)E(`${id} things "${c}" line is English or too long: ${v}`)}}
  for(const k of Object.keys(Z.spots||{})){const [x,y]=k.split(',').map(Number);if(walk(Z,x,y))E(`${id} spot ${k} is on a walkable tile`)}
  for(const k of Z.npcs){const n=C.NPC[k];if(!n){E('no npc '+k);continue}if(n.zone!==id)E(`npc ${k} zone ${n.zone}≠${id}`);if(!walk(Z,n.x,n.y)&&!n.proxy&&![[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>walk(Z,n.x+dx,n.y+dy)))E(`npc ${k} on unwalkable ${n.x},${n.y} with no square to talk from`);/* 단어 마을's spectators sit in the stands */if(n.chat&&(!C.NPC[n.chat]||C.NPC[n.chat].zone!==id))E(`npc ${k} chats with ${n.chat}, who isn't in ${id}`)}  // a proxy (e.g. a table) may stand on furniture
 }
 // no review computer needed: 단어 마을 reviews at the people (their ? marker)
 // review asks a word's own questions; gram:1 ones (척, -대, -다 보니 asked under some word) don't count, so each word needs one that isn't
 {const qs=[...(C.BANK||[]),...Object.entries(C.Q).filter(([k])=>k!=='cafe').flatMap(([,v])=>v)];
  for(const w of C.WORDS)if(!qs.some(q=>q.w===w&&!q.gram))E(`word "${w}" has no question of its own (all gram:1 or none): review can't ask it`)}
 // one tileset: a 교시 draws a school tile its own way only as a declared story variant (VARIANTS), never by redefining it
 if(ctx.SCHOOL_TILES){const S=ctx.SCHOOL_TILES,V=C.VARIANTS||{};
  for(const k of Object.keys(V))if(!(k in S))E(`VARIANTS.${k} is not a school tile: give it its own name in TILES`);
  for(const k of Object.keys(S))if(C.TILES[k]!==S[k]&&C.TILES[k]!==V[k])E(`TILES.${k} redraws the school's tile: declare it in VARIANTS, or give it its own name`)}
 for(const [id,Z] of Object.entries(C.ZONES)){if(Z.floor&&!(Z.floor in C.TILES))E(`${id} floor "${Z.floor}" is not a tile`);
  for(const [c,L] of Object.entries(Z.legend))if(L.floor&&!(L.floor in C.TILES))E(`${id} "${c}" floor "${L.floor}" is not a tile`)}
 // one school (src/school.js): every 교시 has every school zone, same walls, doors and warps; it may only paint props onto floor or wall
 if(ctx.SCHOOL_BASE){const B=ctx.SCHOOL_BASE(),STRUCT=new Set([...ctx.SCHOOL_WALLISH,'building','fence','gymBldg','clock']);
  for(const [id,S] of Object.entries(B)){const Z=C.ZONES[id];if(!Z){E(`school zone ${id} missing`);continue}
   if(Z.map.length!==S.map.length||Z.map[0].length!==S.map[0].length){E(`school ${id} size changed`);continue}
   const painted=new Set(Z.painted||[]);
   Z.map.forEach((row,y)=>[...row].forEach((c,x)=>{const b=S.map[y][x],k=x+','+y;
    if(c===b&&Z.legend[c].tile===S.legend[b].tile)return;
    if(!painted.has(k))E(`school ${id} ${k} is "${c}" but the school has "${b}" (paint it, or change src/school.js)`);
    else if(S.warps[k])E(`school ${id} ${k}: a door can't be painted over`);
    else if(STRUCT.has(S.legend[b].tile)&&Z.legend[c].walk)E(`school ${id} ${k}: a wall can't be painted walkable`)}));
   for(const k of Object.keys(S.warps)){const w=Z.warps[k],s=S.warps[k];if(!w||w.to!==s.to||w.x!==s.x||w.y!==s.y)E(`school ${id} warp ${k} differs from the school's`)}
   for(const k of Object.keys(Z.warps))if(!S.warps[k]&&!(id==='yard'&&/^1[12],13$/.test(k)))E(`school ${id} has an extra warp ${k}`)}}
 const qs=[...Object.values(C.Q).flat(),...(C.BANK||[])];const hasQ=new Set(qs.map(q=>q.w).filter(Boolean));
 for(const q of qs){if(q.w&&!C.WORDS.includes(q.w))E(`question w "${q.w}" not a chapter word`);if(q.opts&&!q.opts.some(o=>o[1]))E('question without a right answer: '+q.ask);if(q.opts)q.opts.filter(o=>!o[1]).forEach(o=>{if(!o[2])E('wrong option without explanation: '+o[0])})}
 const badge=new Set(Object.values(C.NPC).flatMap(n=>n.badge||[]));
 for(const w of C.WORDS){if(!hasQ.has(w))E('no question for '+w);if(!C.DICT[w])E('no DICT for '+w);else for(const k of ['k','e','ex'])if(!C.DICT[w][k])E(`DICT ${w} missing ${k}`);if(C.DICT[w]&&!/[ぁ-んァ-ン一-龯]/.test(C.DICT[w].k||''))E(`DICT ${w}: no Korean definition (add it to lexicon/defs.json)`);if(!badge.has(w))E('no NPC teaches '+w)}
 const src=CH.make.toString();for(const m of src.matchAll(/\{([^|{}'"`]+)\|([^}'"`]+)\}/g))if(/[ぁ-んァ-ン一-龯]/.test(m[1])&&!C.DICT[m[2]])E('gloss key missing: '+m[2]);
 if(typeof C.questText()!=='string')E('questText must return a string');
}
// the engine is generated from the shared walk-engine: the copy here must match it
{const shared=new URL('../../walk-engine/engine.js',import.meta.url);if(fs.existsSync(shared)){const mine=fs.readFileSync(new URL('../src/engine.js',import.meta.url),'utf8').replace(/^\/\*[^\n]*\*\/\n/,'');
 if(mine!==fs.readFileSync(shared,'utf8')){errs.push('src/engine.js differs from walk-engine/engine.js — edit walk-engine and run its sync.sh')}}}
// the page's stylesheet: one <style> block, and nothing CSS-like after it in the head (a stray </style> once printed CSS as page text)
{const sh=fs.readFileSync('src/shell.html','utf8'),o=(sh.match(/<style/g)||[]).length,c=(sh.match(/<\/style>/g)||[]).length;
 if(o!==c)errs.push(`src/shell.html: ${o} <style> but ${c} </style>`);
 const head=sh.slice(sh.lastIndexOf('</style>')+8,sh.indexOf('</head>'));if(/[{}]/.test(head.replace(/<[^>]*>/g,'')))errs.push('src/shell.html: CSS-looking text after the last </style> (it would show on the page)')}
// 문화 노트: every line cites real sources (numbers into src), every source is a link, every culture:'id' a chapter uses exists
{const N=ctx.CULTURE_NOTES||{};
 for(const [k,n] of Object.entries(N)){
  if(!n.t||!Array.isArray(n.lines)||!n.lines.length)errs.push(`culture ${k}: needs a title and lines`);
  if(!Array.isArray(n.src)||!n.src.length)errs.push(`culture ${k}: no sources`);
  (n.src||[]).forEach(([t,u],i)=>{if(!t||!/^https:\/\//.test(u||''))errs.push(`culture ${k}: source ${i+1} needs a title and an https link`)});
  (n.lines||[]).forEach(([ko,en,s],i)=>{if(!ko||!en)errs.push(`culture ${k} line ${i+1}: needs Korean and English`);
   if(!Array.isArray(s)||!s.length||s.some(x=>!(x>=1&&x<=(n.src||[]).length)))errs.push(`culture ${k} line ${i+1}: must cite sources 1–${(n.src||[]).length}`)})}
 for(const f of fs.readdirSync('src/chapters'))for(const m of fs.readFileSync('src/chapters/'+f,'utf8').matchAll(/culture:'([^']+)'/g))if(!N[m[1]])errs.push(`${f}: culture:'${m[1]}' has no note in src/culture.js`)}
console.log(errs.length?errs.join('\n'):`ok · ${ctx.CHAPTERS.length} chapter(s), ${allWords.size} words`);process.exit(errs.length?1:0);
