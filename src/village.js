/* 단어 마을's own art, kept exactly as it was drawn before the move to the shared walk engine: the tile library, the villagers,
   the dog and the ! ? ★ markers. GENERATED from src/daneo-maul.html by tools/village.py during the trial port; don't edit here.
   Tiles use the engine's r, g and hash; `at` here answers 'T' (a tree) off the map, as the old engine did, so edge tiles look the same. */
var VILLAGE=(()=>{
const at=(x,y)=>(x<0||y<0||x>=MW||y>=MH)?'T':MAP[y][x];
const front=(x,y)=>at(x,y+1)!==at(x,y); // bottom edge of a building wall
const walkable=(x,y)=>!!(Z.legend[at(x,y)]||{}).walk;
function grass(X,Y,x,y){r(X,Y,16,16,'#6FBF5A');const h=hash(x,y);if(h<60){r(X+(h%11)+2,Y+(h%7)+3,1,2,'#58A548');r(X+(h%11)+4,Y+(h%7)+4,1,1,'#58A548')}if(h%5===0)r(X+(h*3%12)+2,Y+(h*7%12)+2,1,1,'#8ED474')}
function wood(X,Y,x,y){r(X,Y,16,16,'#D8B383');r(X,Y+7,16,1,'#C09A6A');r(X,Y+15,16,1,'#C09A6A');r(X+((x+y)%2?4:11),Y,1,7,'#C09A6A');r(X+((x+y)%2?10:3),Y+8,1,7,'#C09A6A')}
function sand(X,Y,x,y){r(X,Y,16,16,'#E3CFA0');const h=hash(x,y);r(X+h%14,Y+(h>>1)%14,1,1,'#CDB583');r(X+(h*5)%14,Y+(h*11)%14,1,1,'#CDB583')}
function floorTile(X,Y){r(X,Y,16,16,'#EEF2F5');r(X,Y,16,1,'#D5DCE3');r(X,Y,1,16,'#D5DCE3');r(X+8,Y,1,16,'#E1E7EC');r(X,Y+8,16,1,'#E1E7EC')}
function table(X,Y){r(X+1,Y+4,14,7,'#9A6A3C');r(X+1,Y+4,14,2,'#B68350');r(X+2,Y+11,2,4,'#6E4A28');r(X+12,Y+11,2,4,'#6E4A28')}

const TILES={
 grass:(X,Y,x,y)=>grass(X,Y,x,y),
 flowers:(X,Y,x,y)=>{grass(X,Y,x,y);[[3,4,'#F26D6D'],[10,3,'#F7D154'],[6,10,'#FFFFFF'],[12,11,'#F26D6D']].forEach(([a,b,c])=>{r(X+a,Y+b,2,2,c);r(X+a,Y+b+2,1,2,'#3E8E3A')})},
 path:(X,Y,x,y)=>{r(X,Y,16,16,'#DCC48E');const h=hash(x,y);r(X+h%13+1,Y+(h>>2)%13+1,2,1,'#C2A96F');r(X+(h*7)%13+1,Y+(h*3)%13+1,1,1,'#C2A96F')},
 tree:(X,Y,x,y)=>{grass(X,Y,x,y);r(X+6,Y+11,4,5,'#6B4A2B');r(X+2,Y+1,12,11,'#2E7A3A');r(X+1,Y+3,14,7,'#2E7A3A');r(X+4,Y+2,5,3,'#44A04E');r(X+3,Y+5,2,2,'#44A04E');r(X+2,Y+10,12,1,'#236330')},
 wood:(X,Y,x,y)=>wood(X,Y,x,y),
 sand:(X,Y,x,y)=>sand(X,Y,x,y),
 floor:(X,Y)=>floorTile(X,Y),
 sign:(X,Y,x,y)=>{grass(X,Y,x,y);r(X+7,Y+9,2,6,'#6B4A2B');r(X+2,Y+2,12,8,'#6B4A2B');r(X+3,Y+3,10,6,'#D2AE74');r(X+5,Y+5,6,1,'#8E6A3A');r(X+5,Y+7,4,1,'#8E6A3A')},
 pond:(X,Y,x,y,t)=>{r(X,Y,16,16,'#4A9BE0');const o=Math.floor(t/400+x)%4;r(X+o*3,Y+4,5,1,'#8CCBF5');r(X+((o+2)%4)*3,Y+10,5,1,'#8CCBF5');if(at(x,y-1)!==at(x,y))r(X,Y,16,2,'#3A83C4')},
 bench:(X,Y,x,y)=>{grass(X,Y,x,y);r(X+1,Y+5,14,2,'#9A6A3C');r(X+1,Y+8,14,3,'#B68350');r(X+2,Y+11,2,4,'#6E4A28');r(X+12,Y+11,2,4,'#6E4A28')},
 /* 1편 */
 brick:(X,Y)=>{r(X,Y,16,16,'#B5654A');for(let i=0;i<4;i++){r(X,Y+i*4+3,16,1,'#8E4B36');r(X+((i%2)?4:12),Y+i*4,1,3,'#8E4B36')}},
 dojoWall:(X,Y)=>{r(X,Y,16,16,'#8A6A45');for(let i=0;i<4;i++)r(X,Y+i*4+3,16,1,'#6E5234');r(X+5,Y,1,16,'#7A5C3B')},
 mat:(X,Y)=>{r(X,Y,16,16,'#6FA7C8');r(X,Y,16,1,'#4F86A8');r(X,Y+15,16,1,'#4F86A8');r(X,Y,1,16,'#4F86A8');r(X+15,Y,1,16,'#4F86A8')},
 ring:(X,Y,x,y)=>{const me=at(x,y);r(X,Y,16,16,'#4B79C9');if(at(x,y-1)!==me)r(X,Y,16,2,'#F4F4F4');if(at(x,y+1)!==me)r(X,Y+14,16,2,'#F4F4F4');if(at(x-1,y)!==me)r(X,Y,2,16,'#F4F4F4');if(at(x+1,y)!==me)r(X+14,Y,2,16,'#F4F4F4')},
 stands:(X,Y)=>{r(X,Y,16,16,'#9AA3B5');r(X,Y+5,16,1,'#7B8497');r(X,Y+11,16,1,'#7B8497');r(X,Y+6,16,2,'#B4BCCC');r(X,Y+12,16,2,'#B4BCCC')},
 bed:(X,Y,x,y)=>{wood(X,Y,x,y);r(X+2,Y+1,12,14,'#7A4E2E');r(X+3,Y+2,10,4,'#FFFFFF');r(X+3,Y+6,10,8,'#D95B5B');r(X+3,Y+6,10,1,'#F2F2F2')},
 tableIn:(X,Y,x,y)=>{wood(X,Y,x,y);table(X,Y)},
 tableOut:(X,Y,x,y)=>{grass(X,Y,x,y);table(X,Y);r(X+5,Y+6,2,1,'#6E4A28');r(X+9,Y+6,2,1,'#6E4A28')},
 /* 2편 */
 libWall:(X,Y,x,y)=>{r(X,Y,16,16,'#8C9BB5');for(let i=0;i<4;i++){r(X,Y+i*4+3,16,1,'#6F7E99');r(X+((i%2)?3:11),Y+i*4,1,3,'#6F7E99')}
   if(front(x,y)&&x%3===1){r(X+4,Y+3,8,8,'#3E4A63');r(X+5,Y+4,6,6,'#CFE3F5');r(X+7,Y+4,1,6,'#3E4A63')}},
 cafeWall:(X,Y,x,y)=>{r(X,Y,16,16,'#F3E3C3');r(X,Y+15,16,1,'#D6C19A');
   if(front(x,y)){for(let i=0;i<4;i++)r(X+i*4,Y,4,6,i%2?'#FFFFFF':'#D9544B');r(X,Y+6,16,1,'#A83A33');if(x%2===0){r(X+4,Y+8,8,6,'#6B4A2B');r(X+5,Y+9,6,4,'#F7D98C')}}},
 laundryWall:(X,Y,x,y)=>{r(X,Y,16,16,'#A9D6D2');for(let i=0;i<4;i++)r(X,Y+i*4+3,16,1,'#86B8B4');
   if(front(x,y)&&x%2===1){r(X+3,Y+2,10,9,'#3E6B68');r(X+4,Y+3,8,7,'#D8F0EE')}},
 shelf:(X,Y,x,y)=>{wood(X,Y,x,y);r(X+1,Y+1,14,14,'#6B4424');r(X+2,Y+2,12,12,'#8A5A33');r(X+2,Y+7,12,1,'#6B4424');
   const cs=['#D9544B','#4F7BD6','#F2C94C','#3FA86B','#8E7CC3','#E07A5F'];for(let i=0;i<5;i++){const h=hash(x+i,y);r(X+3+i*2,Y+3+(h%2),2,4-(h%2),cs[(h+i)%6]);r(X+3+i*2,Y+9+(h%2),2,4-(h%2),cs[(h+i+3)%6])}},
 desk:(X,Y,x,y)=>{wood(X,Y,x,y);r(X+1,Y+5,14,6,'#A8743F');r(X+1,Y+5,14,2,'#C08A52');r(X+2,Y+11,2,4,'#6E4A28');r(X+12,Y+11,2,4,'#6E4A28');r(X+5,Y+6,3,2,'#FFFFFF');r(X+8,Y+6,3,2,'#F2F2F2')},
 counter:(X,Y,x,y)=>{wood(X,Y,x,y);r(X,Y+3,16,12,'#6B4A2B');r(X,Y+3,16,3,'#9A6A3C');r(X+10,Y+1,4,3,'#FFFFFF');r(X+14,Y+2,1,1,'#FFFFFF');r(X+11,Y+1,2,1,'#6B4A2B')},
 cakeTable:(X,Y,x,y)=>{wood(X,Y,x,y);table(X,Y);r(X+5,Y+2,6,3,'#F7E7C8');r(X+5,Y+2,6,1,'#F26D6D');r(X+7,Y+1,1,1,'#D9544B')},
 laptopTable:(X,Y,x,y)=>{wood(X,Y,x,y);table(X,Y);r(X+3,Y+2,6,3,'#2A2F4A');r(X+4,Y+3,4,1,'#8CCBF5');r(X+10,Y+2,3,2,'#FFFFFF')},
 washer:(X,Y,x,y,t)=>{floorTile(X,Y);r(X+1,Y+1,14,14,'#9AA3B5');r(X+2,Y+2,12,12,'#F8F8F8');r(X+2,Y+2,12,2,'#D5DCE3');r(X+4,Y+5,8,8,'#9AA3B5');r(X+5,Y+6,6,6,'#6FA7C8');
   const o=Math.floor(t/150)%4;r(X+5+(o%2)*3,Y+6+(o>1?3:0),3,3,'#A9D6F2')},
 frame:(X,Y,x,y)=>{sand(X,Y,x,y);r(X+1,Y+2,2,14,'#B68350');r(X+13,Y+2,2,14,'#B68350');r(X,Y+2,16,2,'#9A6A3C');r(X,Y+9,16,1,'#B68350')},
 /* 3편 */
 labWall:(X,Y,x,y)=>{const me=at(x,y);r(X,Y,16,16,'#E8ECF2');r(X,Y+15,16,1,'#B9C2D0');if(at(x,y-1)!==me){r(X,Y,16,4,'#4F7BD6');r(X,Y+4,16,1,'#3A5FAF')}
   if(front(x,y)&&x%2===0){r(X+4,Y+5,8,7,'#3E4A63');r(X+5,Y+6,6,5,'#BFE3F5');r(X+8,Y+6,1,5,'#3E4A63')}},
 centerWall:(X,Y,x,y)=>{const me=at(x,y);r(X,Y,16,16,'#FBF3F3');r(X,Y+15,16,1,'#D8C6C6');if(at(x,y-1)!==me){r(X,Y,16,5,'#D9544B');r(X,Y+5,16,1,'#A83A33')}
   if(front(x,y)&&x%2===1){r(X+3,Y+5,10,7,'#7A3A3A');r(X+4,Y+6,8,5,'#FFE3E3')}if(front(x,y)&&x===16){r(X+6,Y+5,4,8,'#D9544B');r(X+4,Y+7,8,4,'#D9544B');r(X+7,Y+6,2,6,'#fff');r(X+5,Y+8,6,2,'#fff')}},
 healer:(X,Y,x,y,t)=>{floorTile(X,Y);r(X+1,Y+2,14,12,'#7B8497');r(X+2,Y+3,12,10,'#F4F4F4');const o=Math.floor(t/250)%3;for(let i=0;i<3;i++){r(X+3+i*4,Y+6,3,3,i===o?'#F26D6D':'#F7C3C3')}},
 field:(X,Y,x,y)=>{const me=at(x,y);r(X,Y,16,16,x%2?'#7CC46A':'#74BC62');if(at(x,y-1)!==me)r(X,Y,16,2,'#F4F4F4');if(at(x,y+1)!==me)r(X,Y+14,16,2,'#F4F4F4');if(at(x-1,y)!==me)r(X,Y,2,16,'#F4F4F4');if(at(x+1,y)!==me)r(X+14,Y,2,16,'#F4F4F4');if(x===17)r(X+15,Y,1,16,'#F4F4F4')},
 bricks:(X,Y,x,y)=>{sand(X,Y,x,y);for(let j=0;j<3;j++)for(let i=0;i<2;i++)r(X+2+i*6+(j%2?3:0)-(j%2&&i?6:0),Y+5+j*3,5,2,'#C0583E');r(X+2,Y+14,12,1,'#8E4B36')},
 /* 4편 */
 gymWall:(X,Y,x,y)=>{const me=at(x,y);r(X,Y,16,16,'#B7A6D9');for(let i=0;i<4;i++)r(X,Y+i*4+3,16,1,'#9A88C2');if(at(x,y-1)!==me){r(X,Y,16,4,'#5B4A8A');r(X,Y+4,16,1,'#43356B')}
   if(front(x,y)&&at(x,y+1)!=='g'&&x%2===1){r(X+4,Y+5,8,7,'#3E3A5A');r(X+5,Y+6,6,5,'#D9D2F2');r(X+8,Y+6,1,5,'#3E3A5A')}
   if(front(x,y)&&at(x,y+1)!=='g'&&x===4){r(X+4,Y+4,8,8,'#F2C94C');r(X+5,Y+5,6,6,'#E0A82E');r(X+7,Y+6,2,4,'#FFF3B0')}},
 gymFloor:(X,Y,x,y)=>{r(X,Y,16,16,(x+y)%2?'#E7C79A':'#E1BF90');r(X,Y,16,1,'#CFAE7E');r(X,Y,1,16,'#CFAE7E')},
 shopWall:(X,Y,x,y)=>{const me=at(x,y);r(X,Y,16,16,'#9CCFC6');r(X,Y+15,16,1,'#6FA79E');if(at(x,y-1)!==me){r(X,Y,16,5,'#3E7F78');r(X,Y+5,16,1,'#2C5F59')}
   if(front(x,y)&&at(x,y+1)!=='q'&&x%2===0){r(X+3,Y+6,10,7,'#2C5F59');r(X+4,Y+7,8,5,'#DDF3EF')}
   if(front(x,y)&&at(x,y+1)!=='q'&&x===15){r(X+3,Y+7,10,3,'#7B8497');r(X+2,Y+6,3,5,'#7B8497');r(X+11,Y+6,3,5,'#7B8497');r(X+3,Y+7,1,3,'#9CCFC6');r(X+12,Y+7,1,3,'#9CCFC6')}},
 workbench:(X,Y)=>{floorTile(X,Y);r(X+1,Y+5,14,7,'#7A5A3A');r(X+1,Y+5,14,2,'#9A7450');r(X+2,Y+12,2,3,'#5A4028');r(X+12,Y+12,2,3,'#5A4028');r(X+3,Y+3,6,2,'#9AA3B5');r(X+3,Y+2,2,4,'#9AA3B5');r(X+11,Y+1,2,5,'#D9544B');r(X+11,Y+6,2,1,'#5A4028')},
 dirt:(X,Y,x,y)=>{r(X,Y,16,16,'#8A5E3B');const h=hash(x,y);r(X+h%12+2,Y+(h>>2)%12+2,2,1,'#6E4A2C');r(X+(h*3)%12+2,Y+(h*7)%12+2,1,1,'#A87A52');r(X+(h*5)%12+2,Y+(h*3)%12+2,1,1,'#6E4A2C')},
 sapling:(X,Y,x,y)=>{TILES.dirt(X,Y,x,y);r(X+7,Y+8,2,6,'#6B4A2B');r(X+4,Y+3,8,6,'#3FA86B');r(X+5,Y+2,6,1,'#5CC47F');r(X+5,Y+4,2,2,'#5CC47F');r(X+5,Y+13,6,1,'#6E4A2C')},
 /* 5편 */
 stationWall:(X,Y,x,y)=>{const me=at(x,y);r(X,Y,16,16,'#3D5A80');for(let i=0;i<4;i++)r(X,Y+i*4+3,16,1,'#324B6B');if(at(x,y-1)!==me){r(X,Y,16,4,'#D9544B');r(X,Y+4,16,1,'#A83A33');if(x===8){r(X+7,Y,2,4,'#E8ECF2');r(X+5,Y,6,1,'#E8ECF2')}}
   if(front(x,y)&&at(x,y+1)!=='='&&x%2===1){r(X+3,Y+5,10,7,'#22324A');r(X+4,Y+6,8,5,'#BFE3F5')}
   if(front(x,y)&&at(x,y+1)!=='='&&x===3){r(X+2,Y+5,12,7,'#F4F4F4');r(X+3,Y+6,10,5,'#D9544B');r(X+5,Y+7,6,3,'#F4F4F4');r(X+7,Y+8,2,1,'#D9544B')}},
 tvcam:(X,Y,x,y)=>{wood(X,Y,x,y);r(X+3,Y+3,9,6,'#2A2F4A');r(X+11,Y+4,3,4,'#3E4A63');r(X+4,Y+4,3,3,'#8CCBF5');r(X+7,Y+9,2,4,'#3E4A63');r(X+4,Y+13,2,2,'#3E4A63');r(X+10,Y+13,2,2,'#3E4A63');r(X+5,Y+12,6,1,'#3E4A63')},
 domeWall:(X,Y,x,y)=>{const me=at(x,y);
   if(at(x,y-1)!==me&&at(x,y-1)!=='v'){grass(X,Y,x,y);const o=Math.min(12,Math.abs(x-18)*3);r(X,Y+o,16,16-o,'#D9DEE7');r(X,Y+o,16,2,'#F4F6FA')}
   else{r(X,Y,16,16,'#D9DEE7');r(X+3,Y,1,16,'#BFC6D3');r(X+11,Y,1,16,'#BFC6D3');r(X,Y+8,16,1,'#BFC6D3')}
   if(y===3&&x>=15&&x<=21)r(X,Y+10,16,3,'#3E7F4A')},
 /* 6편 */
 schoolWall:(X,Y,x,y)=>{const me=at(x,y);r(X,Y,16,16,'#F3E3C3');for(let i=0;i<4;i++)r(X,Y+i*4+3,16,1,'#E2CDA4');if(at(x,y-1)!==me){r(X,Y,16,4,'#3E7F4A');r(X,Y+4,16,1,'#2C5F36')}
   if(front(x,y)&&!walkable(x,y+1)&&x%2===1){r(X+3,Y+5,10,7,'#6B4A2B');r(X+4,Y+6,8,5,'#CFE3F5');r(X+8,Y+6,1,5,'#6B4A2B')}
   if(at(x,y-1)!==me&&(x===6||x===19)){r(X+4,Y+1,8,8,'#FFFFFF');r(X+4,Y+1,8,1,'#1B1E2B');r(X+4,Y+8,8,1,'#1B1E2B');r(X+4,Y+1,1,8,'#1B1E2B');r(X+11,Y+1,1,8,'#1B1E2B');r(X+8,Y+2,1,3,'#1B1E2B');r(X+8,Y+4,3,1,'#D9544B')}},
 board:(X,Y,x,y)=>{wood(X,Y,x,y);r(X,Y+1,16,10,'#6B4A2B');r(X,Y+2,16,8,'#2F5D4A');const h=hash(x,y);r(X+2,Y+4,5+h%5,1,'#E8ECF2');r(X+3,Y+7,7-h%4,1,'#E8ECF2');r(X,Y+11,16,1,'#9A6A3C');r(X+12,Y+10,3,1,'#FFFFFF')},
 easel:(X,Y,x,y)=>{grass(X,Y,x,y);r(X+4,Y+10,1,6,'#6B4A2B');r(X+11,Y+10,1,6,'#6B4A2B');r(X+7,Y+11,2,5,'#6B4A2B');r(X+2,Y+1,12,10,'#6B4A2B');r(X+3,Y+2,10,8,'#FFFFFF');r(X+4,Y+3,4,5,'#D9544B');r(X+8,Y+4,4,5,'#4F7BD6')},
 /* 7편 */
 bankWall:(X,Y,x,y)=>{const me=at(x,y);r(X,Y,16,16,'#C9CED8');r(X+2,Y,2,16,'#B3B9C6');r(X+12,Y,2,16,'#B3B9C6');if(at(x,y-1)!==me){r(X,Y,16,5,'#2E3548');r(X,Y+5,16,1,'#1B1E2B');if(x===19){r(X+5,Y+1,6,3,'#F2C94C');r(X+7,Y+2,2,1,'#2E3548')}}
   if(front(x,y)){if(x===17){r(X+3,Y+4,10,12,'#2E3548');r(X+4,Y+5,8,11,'#8CCBF5');r(X+8,Y+5,1,11,'#2E3548')}else if(x%2===0){r(X+4,Y+5,8,7,'#2E3548');r(X+5,Y+6,6,5,'#BFE3F5')}}},
 bigScreen:(X,Y,x,y,t)=>{const me=at(x,y);r(X,Y,16,16,'#1B1E2B');const top=at(x,y-1)!==me,bot=at(x,y+1)!==me;
   if(top)r(X,Y,16,2,'#3E4A63');if(bot){r(X,Y+13,16,3,'#3E4A63');if(x===5||x===6)r(X+6,Y+13,4,3,'#6B7390')}
   const f=Math.floor(t/600)%2;r(X+1,Y+(top?2:0),14,bot?13-(top?2:0):16-(top?2:0),f?'#3FA86B':'#2F8A57');
   if(x===4&&top){r(X+2,Y+3,12,12,'#FFFFFF');r(X+3,Y+4,10,10,'#1B1E2B');r(X+4,Y+5,8,8,'#4F7BD6');r(X+5,Y+6,6,6,'#D9544B');r(X+6,Y+7,4,4,'#F2C94C')}if(x===5&&top){r(X,Y+9,12,1,'#E8ECF2');r(X+11,Y+8,3,3,'#D9544B')}if(x===8&&top){r(X+3,Y+3,10,4,'#D9544B');r(X+4,Y+4,1,2,'#fff');r(X+6,Y+4,1,2,'#fff');r(X+8,Y+4,2,2,'#fff');r(X+11,Y+4,1,2,'#fff')}if(x===3&&!top){r(X+4,Y+2,1,8,'#F4F4F4');r(X+3,Y+5,8,1,'#F4F4F4')}if(x===7&&top){for(let i=0;i<3;i++)r(X+3+i*4,Y+9,2,2,'#FFFFFF')}},
 museumWall:(X,Y,x,y)=>{const me=at(x,y);r(X,Y,16,16,'#EDE3D0');r(X,Y+15,16,1,'#CDBF9F');if(at(x,y-1)!==me){r(X-1,Y,18,4,'#5A3A22');r(X,Y+4,16,2,'#8A5A33');r(X+2,Y+1,12,1,'#7A4E2E')}
   if(front(x,y)){r(X+2,Y+3,2,13,'#D8C9A8');r(X+12,Y+3,2,13,'#D8C9A8');if(x===19){r(X+5,Y+5,6,11,'#5A3A22')}else if(x%2===0){r(X+5,Y+6,6,6,'#5A3A22');r(X+6,Y+7,4,4,'#F7E7C8');r(X+7,Y+8,2,1,'#5A3A22');r(X+7,Y+9,1,2,'#5A3A22')}}},
 statue:(X,Y,x,y)=>{grass(X,Y,x,y);r(X+2,Y+12,12,4,'#9AA3B5');r(X+3,Y+11,10,1,'#B4BCCC');r(X+4,Y+4,8,7,'#7A6A3A');r(X+5,Y+5,6,5,'#9A8A4A');r(X+5,Y+0,6,5,'#7A6A3A');r(X+6,Y+1,4,3,'#B8A458');r(X+4,Y+0,8,1,'#5A4A2A');r(X+10,Y+6,3,2,'#E8ECF2')},
 mark:(X,Y,x,y)=>{wood(X,Y,x,y);for(let i=0;i<10;i++){r(X+3+i,Y+3+i,2,2,'#D9544B');r(X+12-i,Y+3+i,2,2,'#D9544B')}},
 domeDoor:(X,Y)=>{r(X,Y,16,16,'#D9DEE7');r(X+2,Y+3,12,13,'#3E4A63');r(X+7,Y+3,2,13,'#9AA3B5');r(X+2,Y+3,12,1,'#2A2F4A')},
 candyWall:(X,Y,x,y)=>{const me=at(x,y);r(X,Y,16,16,'#F6C3D0');r(X,Y+15,16,1,'#D99AAD');if(at(x,y-1)!==me){r(X,Y,16,4,'#8A4B5E');r(X,Y+4,16,1,'#6E3A4A')}
   if(front(x,y)){for(let i=0;i<4;i++)r(X+i*4,Y,4,5,i%2?'#FFFFFF':'#E07A9B');r(X,Y+5,16,1,'#B85A78');
     if(x===4){r(X+4,Y+7,8,9,'#6B4A2B');r(X+10,Y+11,1,1,'#F2C94C')}else{r(X+3,Y+7,10,6,'#6B4A2B');r(X+4,Y+8,8,4,'#FFF3E8');r(X+5,Y+10,2,2,'#6B3A22');r(X+9,Y+10,2,2,'#6B3A22')}}},
 chickenWall:(X,Y,x,y)=>{const me=at(x,y);r(X,Y,16,16,'#F7F3EE');r(X,Y+15,16,1,'#D8D0C4');if(at(x,y-1)!==me){r(X,Y,16,5,'#C8332C');r(X,Y+5,16,1,'#8E231E')}
   if(front(x,y)){r(X,Y,16,4,'#C8332C');r(X,Y+4,16,1,'#8E231E');
     if(x===12){r(X+3,Y+6,10,10,'#5A3A22');r(X+4,Y+7,8,9,'#BFE3F5');r(X+8,Y+7,1,9,'#5A3A22')}else{r(X+3,Y+6,10,7,'#5A3A22');r(X+4,Y+7,8,5,'#FFF6D8')}}
   else if(y===13&&x===11){r(X+4,Y+3,8,9,'#C8332C');r(X+6,Y+5,4,5,'#FFFFFF')}},
 /* 8편 */
 appleTree:(X,Y,x,y)=>{grass(X,Y,x,y);r(X+6,Y+11,4,5,'#6B4A2B');r(X+2,Y+1,12,11,'#3E8E3A');r(X+1,Y+3,14,7,'#3E8E3A');r(X+4,Y+2,5,3,'#5CB85A');r(X+2,Y+10,12,1,'#2E7A3A');
   [[3,4],[9,3],[6,7],[11,7],[4,9]].forEach(([a,b],i)=>{if((hash(x,y)+i)%4)return;r(X+a,Y+b,2,2,'#D9544B');r(X+a,Y+b,1,1,'#F28C7A')});r(X+9,Y+3,2,2,'#D9544B');r(X+4,Y+8,2,2,'#D9544B')},
 fallen:(X,Y,x,y)=>{grass(X,Y,x,y);const h=hash(x,y);[[3+h%4,9],[9,4+h%5],[11-h%3,12]].forEach(([a,b])=>{r(X+a,Y+b,3,3,'#D9544B');r(X+a,Y+b,1,1,'#F28C7A');r(X+a+1,Y+b-1,1,1,'#6B4A2B')})},
 tent:(X,Y,x,y)=>{const me=at(x,y);const top=at(x,y-1)!==me;
   if(top){grass(X,Y,x,y);for(let i=0;i<4;i++)r(X+i*4,Y+4,4,12,(x*4+i)%2?'#FFFFFF':'#D97B2B');r(X,Y+4,16,1,'#A85A1E');if(x%2===0){r(X+7,Y,1,5,'#6B4A2B');r(X+8,Y,4,3,'#F2C94C')}}
   else{r(X,Y,16,16,'#F7E7C8');for(let i=0;i<4;i++)r(X+i*4,Y,4,4,(x*4+i)%2?'#FFFFFF':'#D97B2B');r(X,Y+4,16,1,'#A85A1E');r(X,Y+9,16,7,'#9A6A3C');r(X,Y+9,16,2,'#B68350');
     if(x%2){r(X+3,Y+6,4,3,'#F2C94C');r(X+9,Y+6,4,3,'#D9544B')}else{r(X+5,Y+5,6,4,'#E8B98F');r(X+6,Y+6,4,1,'#C98D78')}}},
 speaker:(X,Y,x,y)=>{wood(X,Y,x,y);r(X+3,Y+1,10,14,'#1B1E2B');r(X+4,Y+2,8,12,'#2A2F4A');r(X+6,Y+3,4,3,'#6B7390');r(X+5,Y+8,6,5,'#6B7390');r(X+7,Y+9,2,3,'#1B1E2B')},
 target:(X,Y,x,y)=>{sand(X,Y,x,y);r(X+3,Y+12,2,4,'#6B4A2B');r(X+11,Y+12,2,4,'#6B4A2B');r(X+2,Y+1,12,12,'#1B1E2B');r(X+3,Y+2,10,10,'#F4F4F4');r(X+4,Y+3,8,8,'#4F7BD6');r(X+5,Y+4,6,6,'#D9544B');r(X+6,Y+5,4,4,'#F2C94C');r(X+7,Y+6,2,2,'#E0A82E')},
};
/* bigTree: one 32×32 tree over a 2×2 block of 'bigTree' tiles; each tile draws its quarter */
TILES.bigTree=(X,Y,x,y)=>{
  grass(X,Y,x,y);
  const me=at(x,y),qx=at(x-1,y)===me?1:0,qy=at(x,y-1)===me?1:0,ox=X-qx*16,oy=Y-qy*16;
  g.save();g.beginPath();g.rect(X,Y,16,16);g.clip();
  const R=(a,b,w,hh,c)=>r(ox+a,oy+b,w,hh,c);
  R(4,29,24,3,'rgba(0,0,0,.22)');
  R(12,17,8,13,'#5A3D24');R(13,17,6,13,'#6B4A2B');R(14,18,2,11,'#8A6440');R(9,27,4,3,'#5A3D24');R(19,27,4,3,'#5A3D24');R(17,22,2,2,'#4A3220');
  R(6,0,20,22,'#1F5A2A');R(3,3,26,17,'#1F5A2A');R(1,6,30,11,'#1F5A2A');
  R(7,1,18,20,'#2E7A3A');R(4,4,24,15,'#2E7A3A');R(2,7,28,9,'#2E7A3A');
  R(4,17,24,2,'#236330');R(8,20,16,1,'#236330');
  R(8,3,9,4,'#44A04E');R(5,8,5,3,'#44A04E');R(19,6,6,3,'#44A04E');R(12,10,5,3,'#44A04E');R(22,12,4,2,'#44A04E');
  R(10,4,4,2,'#5CC47F');R(6,9,2,1,'#5CC47F');R(20,7,3,1,'#5CC47F');R(13,11,2,1,'#5CC47F');
  g.restore();
};

/* people: drawChar(look, …) is the old drawChar(c, …) with c.look passed in directly (the engine calls look.draw(look,X,Y,dir,step)) */
function drawChar(L,X,Y,dir,step){
  const ol='#1B1E2B';
  g.fillStyle='rgba(0,0,0,.22)';g.fillRect(X+3,Y+14,10,2);
  const lg=step?1:0;
  r(X+5,Y+11,6,4,ol);r(X+6,Y+11,2,3+(step===1?0:lg),L.pants);r(X+9,Y+11,2,3+(step===2?0:lg),L.pants);
  r(X+3,Y+7,10,6,ol);
  if(L.shirt==='stripe'){r(X+4,Y+8,8,4,'#F4F4F4');for(let i=0;i<4;i++)r(X+4+i*2,Y+8,1,4,'#1F1F1F')}else r(X+4,Y+8,8,4,L.shirt);
  if(L.belt)r(X+4,Y+11,8,1,L.belt);
  r(X+3,Y+1,10,8,ol);r(X+4,Y+2,8,6,L.skin);
  const hair=L.hair;
  if(dir==='up'){r(X+4,Y+2,8,6,hair)}
  else{
    r(X+4,Y+1,8,3,hair);
    if(dir==='left'){r(X+10,Y+2,2,4,hair);r(X+5,Y+5,1,1,ol)}
    else if(dir==='right'){r(X+4,Y+2,2,4,hair);r(X+10,Y+5,1,1,ol)}
    else{r(X+6,Y+5,1,1,ol);r(X+9,Y+5,1,1,ol);r(X+7,Y+7,2,1,'#C98D78')}
    if(L.long){r(X+3,Y+3,1,6,hair);r(X+12,Y+3,1,6,hair)}
  }
  if(L.cap){r(X+3,Y+0,10,3,ol);r(X+4,Y+1,8,2,L.cap);if(dir==='down')r(X+4,Y+3,8,1,'#A83A33');if(dir==='left')r(X+2,Y+3,4,1,'#A83A33');if(dir==='right')r(X+10,Y+3,4,1,'#A83A33')}
}

function drawDog(L,X,Y,dir,step,hurt){
  const ol='#1B1E2B';
  g.fillStyle='rgba(0,0,0,.22)';g.fillRect(X+3,Y+14,10,2);
  const s=step?1:0;
  if(dir==='left'||dir==='right'){
    const R=(x,y,w,h,c)=>r(dir==='left'?X+x:X+16-x-w,Y+y,w,h,c);
    R(4,8,10,5,ol);R(5,9,8,3,L.fur);
    R(5,12,2,3-s,ol);R(11,12,2,2+s,ol);
    R(13,5,2,4,ol);R(13,6,1,2,L.fur);
    R(1,4,7,6,ol);R(2,5,5,4,L.fur);
    R(0,7,2,2,ol);R(3,6,1,1,ol);
    R(5,3,3,4,L.ear);
  }else{
    r(X+4,Y+8,8,5,ol);r(X+5,Y+9,6,3,L.fur);
    r(X+5,Y+12,2,step===1?2:3,ol);r(X+9,Y+12,2,step===2?2:3,ol);
    r(X+4,Y+2,8,7,ol);r(X+5,Y+3,6,5,L.fur);
    r(X+3,Y+2,2,5,L.ear);r(X+11,Y+2,2,5,L.ear);
    if(dir==='down'){r(X+6,Y+5,1,1,ol);r(X+9,Y+5,1,1,ol);r(X+7,Y+6,2,1,ol)}
    else{r(X+5,Y+3,6,2,L.ear);r(X+7,Y+11,2,3,ol)}
  }
  if(hurt){const y=Y-4+Math.round(Math.sin(performance.now()/200));r(X+10,y,5,5,'#1B1E2B');r(X+11,y+1,3,3,'#8E7CC3');r(X+12,y+2,1,1,'#E6DCFF')}
}
function marker(X,Y,t,st){
  if(!st)return;
  const bob=Math.round(Math.sin(t/220)*1.5);
  if(st==='todo'){r(X+6,Y-9+bob,4,8,'#1B1E2B');r(X+7,Y-8+bob,2,4,'#F2C94C');r(X+7,Y-3+bob,2,1,'#F2C94C')}
  else if(st==='review'){const y=Y-10+bob;r(X+5,y,6,9,'#1B1E2B');r(X+6,y+1,4,7,'#4F7BD6');r(X+7,y+2,2,1,'#fff');r(X+8,y+3,1,1,'#fff');r(X+7,y+4,1,1,'#fff');r(X+7,y+6,1,1,'#fff')}
  else if(st==='wait'){const y=Y-5+bob;[5,7,9].forEach((dx,i)=>r(X+dx,y,1,1,Math.floor(t/300)%3===i?'#FFFFFF':'#A5AEC4'))}
  else{const y=Y-9+bob;r(X+7,y,2,2,'#F2C94C');r(X+4,y+2,8,2,'#F2C94C');r(X+5,y+4,6,1,'#F2C94C');r(X+5,y+5,2,2,'#F2C94C');r(X+9,y+5,2,2,'#F2C94C');r(X+7,y+2,2,2,'#FFF3B0')}
}
const sayAt=(...lines)=>(x=0,y=0)=>[{say:lines[(x*7+y*13)%lines.length]}];
const TREES=['大きい 木です。 すずしいです。 🌳','木の 上で 鳥が うたって います。 🐦','はっぱが ゆれて います。 🍃','とても 高い 木です。 リスが います！ 🐿️'];
return {TILES,drawChar,drawDog,marker,sayAt,TREES};
})();
