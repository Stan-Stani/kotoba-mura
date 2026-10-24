/* 1 · えきと カフェ — you get off the train at ことばのむら, say hello, ask the way, and order tea and sushi. Ten first words from a
   beginner course (greetings, food and drink, asking for things and prices); our own lines and story. Each word's dictionary
   entry: r = reading, k = a simple Japanese explanation in hiragana, e = English, ex = an example. */
CHAPTERS.push({id:'c1',n:'1',title:'えきと カフェ',place:'こんにちは · ありがとう · すみません · 水 · お茶 · ごはん · すし · ください · おいしい · いくら',words:10,save:'kotoba-mura-v1',color:'#B5654A',
 start:{zone:'village',x:4,y:7,dir:'down'},introWho:'ことばのむら',
 migrate:KIT.migrate(),
 make:()=>{
const P=KIT.person;
const WORDS=['こんにちは','ありがとう','すみません','水','お茶','ごはん','すし','ください','おいしい','いくら'];
const DICT={
 'こんにちは':{r:'こんにちは',k:'ひるの あいさつ。 ひとに あった とき いいます。',e:'hello (in the daytime)',ex:'こんにちは、 はなこです。'},
 'ありがとう':{r:'ありがとう',k:'ひとが なにか して くれた とき いいます。',e:'thank you',ex:'ちずを ありがとう。'},
 'すみません':{r:'すみません',k:'ひとに はなしかける とき、 あやまる とき いいます。',e:'excuse me; sorry',ex:'すみません、 カフェは どこですか。'},
 '水':{r:'みず',k:'のむ もの。 いろが ありません。',e:'water',ex:'水を ください。'},
 'お茶':{r:'おちゃ',k:'のみもの。 にほんでは みどりの おちゃを よく のみます。',e:'(green) tea',ex:'あたたかい お茶を のみます。'},
 'ごはん':{r:'ごはん',k:'たいた しろい おこめ。 それから、 あさ・ひる・よるの しょくじ。',e:'rice; a meal',ex:'ごはんを たべます。'},
 'すし':{r:'すし',k:'ごはんの うえに さかなが あります。',e:'sushi',ex:'すしは おいしいです。'},
 'ください':{r:'ください',k:'ほしい ものを たのむ とき いいます。 「〜て ください」： して ほしい とき。',e:'please (give me)',ex:'お茶を ください。'},
 'おいしい':{r:'おいしい',k:'たべて 「いい あじ！」 と おもう とき。',e:'delicious',ex:'この すしは おいしいです。'},
 'いくら':{r:'いくら',k:'ねだん（おかね）を きく ことば。 「いくらですか」。',e:'how much',ex:'これは いくらですか。'},
};
const CONFUSE={};
const Q={
 hanako:[
  {w:'こんにちは',who:'나',ask:'(いまは ひるです。) ___！',opts:[['こんにちは',1],['おはよう',0,'「おはよう」は あさです。 ひるは 「こんにちは」。'],['こんばんは',0,'「こんばんは」は よるです。 ひるは 「こんにちは」。']]},
  {w:'こんにちは',gram:1,who:'나',ask:'___。 はじめまして。',opts:[['こんにちは',1],['ありがとう',0,'はじめて あった 人には まず あいさつ。 「こんにちは」。']]}],
 ken:[
  {w:'ありがとう',who:'나',ask:'(ちずを もらいました。) ___！',opts:[['ありがとう',1],['いくら',0,'「いくら」は おかねの ことです。 もらったら 「ありがとう」。'],['こんにちは',0,'もう あいさつは しました。 もらったら 「ありがとう」。']]}],
 obaa:[
  {w:'すみません',who:'나',ask:'___。 カフェは どこですか。',opts:[['すみません',1],['ありがとう',0,'「ありがとう」は あとで。 はじめに 「すみません」と はなしかけます。']]},
  {w:'すみません',who:'나',ask:'あっ、 足を ふみました。 ___！',opts:[['すみません',1],['こんにちは',0,'あやまる ときは 「すみません」。']]}],
 yuki:[
  {w:'水',ask:'あついですね。 つめたい ___を のみますか。',opts:[['水',1],['ごはん',0,'ごはんは たべます。 のむのは 「水」。'],['すし',0,'すしは たべます。 のむのは 「水」。']]},
  {w:'お茶',ask:'みどりの のみもの。 にほんの ___です。',opts:[['お茶',1],['水',0,'水は いろが ありません。 みどりは 「お茶」。']]},
  {w:'ください',who:'나',ask:'じゃあ、 お茶を ___。',opts:[['ください',1],['いくら',0,'おかねの ことでは ありません。 ほしい ときは 「ください」。']]}],
 taro:[
  {w:'すし',ask:'ごはんの 上に さかな。 これは ___です。',opts:[['すし',1],['お茶',0,'お茶は のみもの。 さかなと ごはんは 「すし」。']]},
  {w:'ごはん',ask:'さかなの 下の しろい ものは ___です。',opts:[['ごはん',1],['水',0,'水は のみもの。 たいた おこめは 「ごはん」。']]},
  {w:'おいしい',who:'나',ask:'(すしを たべました。) うーん、 ___！',opts:[['おいしい',1],['いくら',0,'たべて、 あじが いい とき 「おいしい」！']]}],
 momo:[
  {w:'いくら',who:'나',ask:'(かいたいです。) この りんごは ___ですか。',opts:[['いくら',1],['どこ',0,'りんごは ここに あります。 ねだんは 「いくらですか」と ききます。'],['ください',0,'まず ねだんを ききます。 「いくらですか」。']]}],
};
const NPC={
 ekiin:{name:'えきいん',zone:'village',x:3,y:5,dir:'down',look:P({hair:'#2B2B2B',skin:'#E8B98F',shirt:'#2E4A7A',pants:'#2E3548',cap:'#2E4A7A'}),
  talk:()=>[{say:'ことばのむらへ ようこそ。'},{say:'カフェは みちの さきです。 すしやも ありますよ。'}]},
 hanako:{name:'はなこ',zone:'village',x:7,y:7,dir:'left',look:P({hair:'#3B2A22',skin:'#F3D0B0',shirt:'#E07A5F',pants:'#3D5A80',long:1}),badge:['こんにちは'],
  after:'こんにちは！ また はなしましょう。',
  talk:()=>[{say:'あっ、 あたらしい 人ですね。'},Q.hanako[0],{say:'こんにちは！ わたしは はなこです。'},Q.hanako[1],
   {say:'はじめまして！ ことばのむらへ ようこそ。',award:['こんにちは']}]},
 ken:{name:'けん',zone:'village',x:12,y:10,dir:'down',look:P({hair:'#1E1E24',skin:'#E8B98F',shirt:'#3FA86B',pants:'#2E3548'}),badge:['ありがとう'],
  after:'ちず、 つかって くださいね。',
  talk:()=>[{say:'こんにちは！ むらは はじめてですか。'},(state.items.includes('ちず')?{say:'これ、 むらの ちずです。 どうぞ。'}:{say:'これ、 むらの ちずです。 どうぞ。',give:'ちず'}),Q.ken[0],
   {say:'どういたしまして！',award:['ありがとう']}]},
 obaa:{name:'おばあさん',zone:'village',x:16,y:7,dir:'left',look:P({hair:'#C9C9CF',skin:'#E6B892',shirt:'#8E7CC3',pants:'#4A4F6A'}),badge:['すみません'],
  after:'カフェの お茶は おいしいですよ。',
  talk:()=>[Q.obaa[0],{say:'カフェですか。 すぐ そこですよ。 この みちの さきです。'},{who:'나',say:'あっ…'},Q.obaa[1],
   {say:'だいじょうぶですよ。 いってらっしゃい。',award:['すみません']}]},
 yuki:{name:'カフェの ゆき',zone:'village',x:16,y:5,dir:'down',look:P({hair:'#7A3E22',skin:'#F1C9A5',shirt:'#F4F4F4',pants:'#5A3A22',long:1}),badge:['水','お茶','ください'],
  after:'お茶、 もう一ぱい いかがですか。',
  talk:()=>[{say:'いらっしゃいませ！'},Q.yuki[0],{who:'나',say:'はい、 水を ください。'},Q.yuki[1],{say:'あたたかい お茶も ありますよ。'},Q.yuki[2],
   {say:'はい、 お茶です。 どうぞ。',award:['水','お茶','ください']}]},
 taro:{name:'すしやの たろう',zone:'village',x:4,y:15,dir:'down',look:P({hair:'#1A1A1A',skin:'#D9A47A',shirt:'#F4F4F4',pants:'#2B2B2B',cap:'#F4F4F4'}),badge:['すし','ごはん','おいしい'],
  after:'また たべに きて ください！',
  talk:()=>[{say:'へい、 いらっしゃい！'},Q.taro[0],Q.taro[1],{say:'はい、 どうぞ。 たべて ください。'},Q.taro[2],
   {say:'ありがとう！ うちの すしは いちばんです。',award:['すし','ごはん','おいしい']}]},
 momo:{name:'やおやの もも',zone:'village',x:17,y:15,dir:'up',look:P({hair:'#C0582E',skin:'#F3D0B0',shirt:'#F2C94C',pants:'#3D5A80',long:1}),badge:['いくら'],
  after:'りんご、 おいしいですよ！',
  talk:()=>[{say:'いらっしゃい！ あかい りんごですよ。'},Q.momo[0],{say:'百円です。'},{who:'나',say:'じゃあ、 一つ ください。'},
   {say:'まいど！ ありがとうございます。',award:['いくら']}]},
 kid:{name:'こども',zone:'village',x:20,y:9,dir:'left',look:P({hair:'#5A3A22',skin:'#F1C9A5',shirt:'#5B8BD9',pants:'#333'}),
  talk:()=>[{say:'いけに さかなが います！ すしに しないでね！'}]},
};
const sign=t=>KIT.sign('かんばん',t);
const ZONES={
 village:{name:'ことばのむら',reg:'KOTOBA VILLAGE',outdoor:true,
  legend:{'.':{tile:'grass',walk:1},',':{tile:'path',walk:1},'*':{tile:'flowers',walk:1},'T':{tile:'tree'},
   'E':{tile:'stationWall'},'C':{tile:'cafeWall'},'S':{tile:'shopWall'},'k':{tile:'counter'},'a':{tile:'tableOut'},
   'n':{tile:'tent'},'~':{tile:'pond'},'b':{tile:'bench'},'p':{tile:'sign'}},
  map:[
"TTTTTTTTTTTTTTTTTTTTTTTT",
"T......................T",
"T.EEEEEE.......CCCCCC..T",
"T.EEEEEE.......CCCCCC..T",
"T.EEEEEE.......CCkCCC..T",
"T...,p.........,.a.a...T",
"T...,,,,,,,,,,,,,,,,,..T",
"T...,.....b.......,....T",
"T...,..~~~~~......,....T",
"T...,..~~~~~......,....T",
"T...,.............,....T",
"T...,,,,,,,,,,,,,,,....T",
"T.SSSSS..,......nnn....T",
"T.SSSSS..,......nnn....T",
"T.SSkSS..p......nnn....T",
"T....,...,..**.........T",
"T....,,,,,.............T",
"T......................T",
"TTTTTTTTTTTTTTTTTTTTTTTT"],
  npcs:['ekiin','hanako','ken','obaa','yuki','taro','momo','kid'],
  spots:{'5,5':sign('えき · ことばのむら'),'9,14':sign('すしや · おいしい すし'),'4,14':'すしやの カウンターです。 いい におい！','17,4':'カフェの カウンターです。 お茶の いい におい。',
   '17,5':'テーブルです。 お茶が あります。','19,5':'テーブルです。 だれも いません。','10,7':'ベンチです。 すわりたいです。'},
  things:{
   T:VILLAGE.TREES,
   E:['えきです。 でんしゃが きました。 🚃','えきの かべです。 とけいが あります。'],
   C:['カフェです。 中から いい におい。 ☕','カフェの まどです。 中に 人が います。'],
   S:['すしやです。 「すし」と かいて あります。 🍣','すしやの かべです。 中から いい におい。'],
   n:['やおやの テントです。 りんごが たくさん あります。 🍎','くだものが いっぱいです。'],
   '~':['いけです。 さかなが います。 🐟','水が きれいです。'],
  }},
};
const INTRO=['ことばのむらへ ようこそ！','むらの 人に A ボタンで はなしかけて ください。','あたまの 上に ! が ある 人は ことばを おしえて くれます。 バッジを 十こ あつめましょう！'].map(say=>({say}));
const DONE=['おめでとう！ バッジを 十こ ぜんぶ あつめました！','こんにちは、 ありがとう、 すみません、 水、 お茶、 ごはん、 すし、 ください、 おいしい、 いくら。','? が ある 人に もう一度 はなして ください。 一回で わかったら ★ です。'];
const PERFECT=['★ 十こ！ すごい！','じゃあ、 お茶でも のみましょう。'];
const TIPS=['<b>おはよう</b> あさ · <b>こんにちは</b> ひる · <b>こんばんは</b> よる','〜を <b>ください</b>：ほしい ものを たのむ','<b>すみません</b>：はなしかける とき、 あやまる とき','これは <b>いくら</b>ですか：ねだんを きく'];
const questText=()=>'';
return {WORDS,DICT,CONFUSE,Q,ITEMS:{'ちず':'むらの ちず。 えきは ひだりの うえ、 カフェは みぎの うえ。 すしやは ひだりの した、 やおやは みぎの した。'},ZONES,NPC,FOLLOW:null,INTRO,DONE,TIPS,questText,afterTalk:KIT.ending({perfect:PERFECT}),TILES:VILLAGE.TILES};
}});
