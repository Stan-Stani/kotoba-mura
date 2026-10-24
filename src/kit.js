/* ことばのむら's chapter kit: the few things every ことばのむら chapter needs on top of the shared walk engine (see docs/CHAPTER_GUIDE.md).
   Loaded after src/village.js (the art) and before the chapters. */
var KIT={
 /* looks: villagers and dogs are drawn in ことばのむら's own style (VILLAGE), not with the engine's sprites */
 person:look=>({...look,draw:VILLAGE.drawChar}),
 dog:look=>({...look,draw:VILLAGE.drawDog}),
 /* a dog that walks one square behind you (a chapter's FOLLOW); hurt() makes it look unwell */
 follower:({name,look,when,talk,hurt})=>({name,when,talk,look:{...look,draw:(L,X,Y,d,s)=>VILLAGE.drawDog(L,X,Y+1,d,s,!!(hurt&&hurt()))}}),
 /* a signpost (zone spots): its title is the speaker */
 sign:(title,text)=>({steps:[{who:title,say:text}]}),
 /* a chapter's migrate: its own state (stage, book…) where a save has none, on every load; and once, for a save from the old
    engine (badges + perfect): a ★ badge becomes memory level 3 (the engine's ★), a ✓ badge level 0 and due now, and a finished
    cartridge stays finished */
 migrate:(fresh={})=>st=>{const F=st.f||(st.f={});st.lv=st.lv||{};
  for(const k in fresh)if(st[k]===undefined)st[k]=JSON.parse(JSON.stringify(fresh[k]));
  if(F.ported)return;F.ported=1;
  const b=st.badges||[],pf=st.perfect||[];
  b.forEach(w=>{if(!st.lv[w])st.lv[w]=pf.includes(w)?{b:3,due:now()+GAP[3]}:{b:0,due:now()}});
  if(st.celebrated){F.allWords=1;F.done=1}
  if(st.celebratedPerfect)F.allStar=1},
 /* a chapter's afterTalk: every badge in and no task left (quest() gives nothing) → the chapter's DONE, then the next chapter;
    every word ★ (memory level 3) → the chapter's perfect lines */
 ending:({quest,perfect})=>function(){
  const words=C.WORDS;
  if(!state.f.done&&words.every(has)&&!(quest&&quest())){state.f.done=1;state.f.allWords=1;save();finish();return}
  if(perfect&&!state.f.allStar&&words.every(w=>lv(w).b>=3)){state.f.allStar=1;save();setTimeout(()=>{if(!dlg)openDialog('ことばのむら',says(perfect))},500)}
 },
};
