/* Settings for the shared engine (walk-engine): ことばのむら, a Japanese village on the engine of the Korean games.
   The engine's own Korean text comes out in Japanese through ui (keyed by the Korean); lines are split into words at build time
   (build.py, MeCab via fugashi → window.SEG), so every word can be tapped, with furigana over its kanji. */
var FURI=(()=>{
 const kata=s=>s.replace(/[ァ-ン]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
 const hasKanji=s=>/[一-龯々]/.test(s);
 /* 飲みます (のみます) → <ruby>飲<rt>の</rt></ruby>みます: the kana a word starts and ends with stay as they are */
 const ruby=(w,r)=>{if(!r||!hasKanji(w))return w;r=kata(r);let a=0,b=0;
  while(a<w.length&&a<r.length&&w[a]===r[a]&&!hasKanji(w[a]))a++;
  while(b<w.length-a&&b<r.length-a&&w[w.length-1-b]===r[r.length-1-b]&&!hasKanji(w[w.length-1-b]))b++;
  const mid=w.slice(a,w.length-b),rm=r.slice(a,r.length-b);
  return w.slice(0,a)+(rm?`<ruby>${mid}<rt>${rm}</rt></ruby>`:mid)+w.slice(w.length-b)};
 const key=t=>t.replace(/ /g,' ').replace(/⁠/g,'');
 /* a stretch of a line → its words: tappable spans (data-w: the word as written, looked up in LEX) with furigana */
 const html=(x,esc)=>{const seg=(window.SEG||{})[key(x)];
  if(!seg)return esc(x);
  return seg.map(([w,r,l])=>l?`<span class="w" data-w="${esc(w)}">${ruby(esc(w),r)}</span>`:ruby(esc(w),r)).join('')};
 return {ruby,html,kata};
})();
var GAME={prefix:'kotoba-mura',title:'ことばのむら',log:'ことばのむら',hud:'バッジ',gotToast:'バッジ ゲット',
 lang:'ja-JP',voice:/google|kyoko|otoya|haruka|nanami|neural/i,noWrite:1,
 wordsHTML:(x,esc)=>FURI.html(x,esc),
 choiceHTML:t=>FURI.html(t,x=>x.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))).replace(/class="w"/g,'class="cw"'),
 term:{allWords:()=>[]},  // the chapter's own celebration (DONE) says it when the last badge is in
 ui:{'나':'わたし','이야기':'おはなし','분':'ふん','시간':'じかん','일':'にち','뭐':'なに',
  '사전에 없는 말이에요.':'じしょに ない ことばです。','받았어요: ':'もらいました: ','잘 들어 보세요. 무슨 단어예요?':'よく きいて ください。 どの ことばですか。',
  '아직 없어요.':'まだ ありません。','방금':'いま',' 전':' まえ','어제':'きのう','업데이트':'こうしん','.':'。','듣기 문제를 껐어요.':'ききとり もんだいを けしました。',
  '아직 찾아본 말이 없어요.':'まだ しらべた ことばが ありません。','복사':'コピー','문장':'ぶん','아직 영어로 본 문장이 없어요.':'まだ えいごで みた ぶんが ありません。','복사했어요!':'コピーしました！','아직 대화가 없어요.':'まだ かいわが ありません。',
  '맞아!':'せいかい！','맞아요!':'せいかい！','다시 해 봐요.':'もう一度 どうぞ。','아니에요. 보기에서 골라 봐요.':'ちがいます。 えらんで ください。',
  '일지에 추가':'バッジ ゲット','아직 단어가 없어요.':'まだ ことばが ありません。','사람들한테 말을 걸면 일지에 단어가 생겨요.':'むらの 人と はなすと、 ことばが ふえます。',
  '반가워요! 👋':'よろしく！ 👋','고마워요!':'ありがとう！','영어 자막':'えいごの じまく','문제 알리기':'もんだいを しらせる','디버그':'デバッグ','음악':'おんがく',
  '처음부터':'さいしょから','한 번 더 누르면 지워져요':'もう一度 おすと きえます','이 기기에는 한국어 음성이 없어요.':'この きかいには にほんごの こえが ありません。',
  '대사를 소리 내서 읽어요.':'こえに だして よみます。','읽기를 껐어요.':'よみあげを けしました。','복습에 듣기 문제가 나와요.':'ふくしゅうに ききとり もんだいが でます。',
  '지금 복습할 수 있어요':'いま ふくしゅう できます','다음 복습: ':'つぎの ふくしゅう: ',' 후':' ご','기억 레벨':'きおく レベル',
  '영어 자막을 켰어요.':'えいごの じまくを つけました。','영어 자막을 껐어요.':'えいごの じまくを けしました。','아직이요':'まだです',
  ' 기억했어요!':' おぼえました！','다시 연습해요':'もう一度 れんしゅう','다시 연습해요. 곧 또 나와요.':'もう一度 れんしゅうです。 また すぐ でます。',
  '복습':'ふくしゅう','예':'れい','비어 있어요.':'なにも ありません。','짧은 머리':'みじかい かみ','긴 머리':'ながい かみ','단발':'ボブ','올림머리':'おだんご','삐죽 머리':'つんつん','민머리':'ぼうず',
  /* 3ぷん, 1じかん, 2にち, 5かい, 4こ: the number in digits, the unit in kana (ふん after 2 5 7 9, ぷん after 1 3 4 6 8 0) */
  unit:(n,k)=>n+({'분':/[134680]$/.test(String(n))?'ぷん':'ふん','시간':'じかん','일':'にち','번':'かい','개':'こ'}[k]||k),
  quote:w=>`「${w}」`,
  awardPerfect:(nw,L)=>`一回も まちがえませんでした！ 「${nw.join('」「')}」 きおく レベル ${L}/5。`,
  awardMissed:()=>'バッジを もらいました！ まちがえた ことばは また すぐ でます。 あたまの うえの ? を さがして ください。'},
 player:{hair:'#2A2F4A',skin:'#F1C9A5',shirt:'#D9544B',pants:'#2E3548',cap:'#D9544B',draw:VILLAGE.drawChar},
 marker:VILLAGE.marker,
 onBoot:(CH,C)=>{const $=id=>document.getElementById(id);
  $('tips').innerHTML=(C.TIPS||[]).map(t=>`<li>${t}</li>`).join('');$('tipsH').hidden=!(C.TIPS||[]).length;
  $('srcH').hidden=true;
  /* ふりがな on/off (on by default), in the menu */
  const on=()=>{try{return localStorage.getItem('kotoba-mura-furi')!=='0'}catch(e){return true}};
  document.body.classList.toggle('nofuri',!on());
  if(!$('furiBtn')){const b=document.createElement('button');b.className='mi toggle';b.id='furiBtn';b.textContent='ふりがな';
   const upd=()=>b.setAttribute('aria-pressed',String(on()));upd();
   b.addEventListener('click',()=>{try{localStorage.setItem('kotoba-mura-furi',on()?'0':'1')}catch(e){}document.body.classList.toggle('nofuri',!on());upd()});
   const g=document.querySelector('#startPanel .mgrid');if(g)g.prepend(b)}
  /* someone who'll teach you later and turns you away for now shows … , not ! */
  for(const n of Object.values(C.NPC))if(n.badge&&!n.status)n.status=()=>{if(n.badge.every(has))return undefined;
   const s=n.script&&n.script();return s&&!s.some(x=>x&&(x.award||x.ask||x.build||x.choose))?'wait':undefined}}};
