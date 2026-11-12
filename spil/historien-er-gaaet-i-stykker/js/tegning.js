'use strict';
/* =====================================================================
   tegning.js - kollegaens spilmotor fra "Jesper Boss Edition"
   Tegnehjælpere til lærredet, arkivrummet i niveau 1 og Jespers portræt.
   Koden er flyttet uændret fra originalen. Kun teksterne på skærmen er
   modereret: færre versaler og udråbstegn uden for lærredet, ingen
   emojier, og "Jeg smadrer dig med fravær" er blevet til "Nu får du
   fravær". Jespers øvrige replikker er hans egne.
   ===================================================================== */
// Canvas illustration helpers.
function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function line(c,x,y,x2,y2,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke()}
function textDraw(c,s,x,y,color='#fff',size=14,align='left'){c.fillStyle=color;c.textAlign=align;c.font=`900 ${size}px monospace`;c.fillText(s,x,y);c.textAlign='left'}
function drawArchive(){let canvas=$('#archiveCanvas');if(!canvas)return;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;rect(c,0,0,1000,560,'#292b32');
 // wall stripes, brick details
 for(let j=0;j<14;j++){rect(c,0,j*34,1000,2,j%2?'#34333a':'#37333a');for(let i=0;i<18;i++)rect(c,(i*71+(j%2)*36)%1000,j*34+2,2,31,'#343037')}
 rect(c,0,0,1000,52,'#171f2c');rect(c,0,45,1000,8,'#a86c43');rect(c,0,410,1000,150,'#4a3331');for(let j=0;j<8;j++)rect(c,0,416+j*19,1000,2,'#69473a');
 // grand window, atmospheric
 rect(c,48,74,181,276,'#9f7950');rect(c,60,86,157,254,'#172e40');rect(c,67,91,143,247,'#628499');rect(c,70,94,140,160,'#4c7d8c');for(let k=0;k<12;k++){line(c,70,262-k*7,210,220-k*5,'#90aebb',2)}rect(c,127,88,10,250,'#9f7950');rect(c,60,213,157,10,'#a17e54');rect(c,40,354,196,14,'#5e423a');
 // bookshelf x780
 rect(c,775,69,192,359,'#422a2c');rect(c,785,79,174,339,'#654433');for(let row=0;row<4;row++){rect(c,790,86+row*82,166,7,'#c29159');for(let i=0;i<11;i++){let x=794+i*14+((i*row)%3);let h=39+(i*7+row*9)%31;rect(c,x,89+row*82+65-h,10,h,['#9c6857','#516675','#cfa66d','#7b6462','#536d5e'][((i+row)%5)]);rect(c,x+3,96+row*82+65-h,2,h-12,'#e2bd84')}}rect(c,768,62,204,17,'#a1764b');
 // map wooden frame and geography
 rect(c,342,92,387,240,'#8b5c3f');rect(c,354,104,363,216,'#cdbb88');for(let i=0;i<9;i++)line(c,354+i*44,104,354+i*44,320,'#afaa80',1);for(let i=0;i<5;i++)line(c,354,104+i*51,717,104+i*51,'#afaa80',1);
 c.fillStyle='#7a9471';c.beginPath();c.moveTo(380,160);c.lineTo(416,133);c.lineTo(454,159);c.lineTo(437,201);c.lineTo(471,239);c.lineTo(442,269);c.lineTo(406,250);c.closePath();c.fill();c.beginPath();c.moveTo(513,147);c.lineTo(567,131);c.lineTo(639,152);c.lineTo(694,188);c.lineTo(640,214);c.lineTo(602,198);c.lineTo(570,239);c.lineTo(538,232);c.closePath();c.fill();textDraw(c,'THE BRITISH EMPIRE',533,306,'#573d2e',14,'center');
 // paintings / hanging banners
 rect(c,261,103,48,114,'#7f5841');rect(c,270,112,30,96,'#303a46');rect(c,275,129,20,50,'#bdab77');
 // fireplace / vault door center bottom
 rect(c,442,367,182,178,'#292b32');rect(c,452,377,160,166,'#6c6357');rect(c,465,386,135,156,'#2c3038');for(let i=0;i<7;i++)line(c,468,395+i*19,599,395+i*19,'#536271',2);rect(c,570,460,18,18,'#d2ae66');rect(c,559,468,9,3,'#4e442e');
 // desk big
 rect(c,107,391,254,29,'#c28b4f');rect(c,125,420,215,99,'#49312e');rect(c,125,445,217,5,'#7d533a');rect(c,141,464,67,50,'#614038');rect(c,225,464,98,50,'#614038');rect(c,275,485,9,8,'#cbaa67');
 // lamp, paper, quill
 rect(c,172,379,12,14,'#c5a15c');line(c,178,379,197,325,'#d6b66f',7);line(c,197,325,229,357,'#d6b66f',7);rect(c,218,346,43,15,'#aa793e');rect(c,238,361,3,11,'#fff1bb');rect(c,272,372,53,17,'#e5d4ab');rect(c,285,365,41,4,'#f7e8c6');
 // scattered letters
 for(let i=0;i<5;i++){let x=378+i*37;rect(c,x,354+(i%2)*12,27,6,'#c59c6b')}rect(c,0,522,1000,38,'#35282a');rect(c,0,520,1000,7,'#b78e59');
 textDraw(c,'LONDON · CA. 1900',26,30,'#e6c38d',16);
 // rays lighting
 c.fillStyle='#ffdb9d14';c.beginPath();c.moveTo(68,90);c.lineTo(219,102);c.lineTo(364,410);c.lineTo(124,410);c.fill()}
// Mini-boss: selvstændigt pixelportræt baseret på den uploadede reference. Data er indlejret til offline brug.
const bossPortrait=new Image();bossPortrait.src='billeder/jesper.png';
