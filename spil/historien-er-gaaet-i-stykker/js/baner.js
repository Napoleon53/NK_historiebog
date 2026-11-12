'use strict';
/* =====================================================================
   baner.js - kollegaens spilmotor fra "Jesper Boss Edition"
   De tre ekstra baner (Dokumentflugten, Inflationshelvedet og
   Tidsmaskinens kollaps) og deres bosskampe mod Jesper.
   Koden er flyttet uændret fra originalen. Kun teksterne på skærmen er
   modereret: færre versaler og udråbstegn uden for lærredet, ingen
   emojier, og "Jeg smadrer dig med fravær" er blevet til "Nu får du
   fravær". Jespers øvrige replikker er hans egne.
   ===================================================================== */
class ExtraRunner{
 constructor(canvas,mode){this.canvas=canvas;this.c=canvas.getContext('2d');this.mode=mode;this.running=true;this.paused=true;this.keys={};this.frame=0;this.camera=0;this.health=3;this.invuln=1.3;this.victory=false;this.p={x:80,y:430,w:30,h:42,vx:0,vy:0,ground:false};this.data=extraSave(mode);this.checkpoint=this.data.checkpoint||0;this.coins=new Set(this.data.coins||[]);this.freeze=0;this.freezeCooldown=0;this.hazardTimer=0;this.rubble=[];this.chase=0;this.jumpLock=false;this.moving=[{x:850,base:850,dir:1},{x:1730,base:1730,dir:1},{x:2250,base:2250,dir:1}];this.message=''}
 init(){this.spawn();this.draw();this.hud()}
 stop(){this.running=false}
 spawn(){this.p.x=this.checkpoint?1450:80;this.p.y=430;this.p.vy=0;this.p.vx=0;this.p.ground=false;this.camera=Math.max(0,this.p.x-230);this.invuln=1.6;this.chase=this.p.x-430}
 resetCheckpoint(){this.health=3;this.rubble=[];this.spawn();this.paused=false;$('#gameOverlay').classList.add('hide');this.hud()}
 togglePause(){this.paused=!this.paused;const overlay=$('#gameOverlay');if(this.paused){overlay.classList.remove('hide');overlay.innerHTML=`<div class="game-panel"><h2>Pause</h2><p>Du kan fortsætte fra dit gemmepunkt.</p><button type="button" class="primary" id="resumeAction">Fortsæt</button> <button type="button" class="secondary" id="retryAction">Fra checkpoint (+1 mistet liv)</button></div>`;$('#resumeAction').onclick=()=>this.togglePause();$('#retryAction').onclick=()=>{state.lostLives++;save();this.resetCheckpoint()}}else{overlay.classList.add('hide');this.canvas.focus()}}
 damage(reason){if(this.invuln>0)return;state.lostLives++;save();this.health--;this.hud();tone('bad');if(this.health<=0){this.health=3;this.resetCheckpoint();toast(reason+' Tilbage ved checkpoint.',true)}else{this.spawn();toast(reason+' Prøv igen.',true)}}
 hud(){if($('#healthText'))$('#healthText').textContent='♥ '.repeat(this.health);if($('#stampsText'))$('#stampsText').textContent=this.coins.size+' / 3';if($('#checkpointText'))$('#checkpointText').textContent=this.checkpoint?'Midtvejs':'Start';if($('#mistakeText'))$('#mistakeText').textContent=totalMistakes()}
 useTelegraph(){if(this.mode!=='clock'||this.paused)return;if(this.freezeCooldown>0){toast('Tidsfrysningen skal genoplades.',true);return}this.freeze=2.8;this.freezeCooldown=8.5;tone('stamp');toast('Tiden fryser i 2,8 sekunder.')}
 update(dt){if(!this.running)return;this.frame+=dt;if(this.paused){this.draw();return}const p=this.p;this.invuln=Math.max(0,this.invuln-dt);this.freeze=Math.max(0,this.freeze-dt);this.freezeCooldown=Math.max(0,this.freezeCooldown-dt);const speed=EXTRAS[this.mode].speed;const left=this.keys.ArrowLeft||this.keys.KeyA,right=this.keys.ArrowRight||this.keys.KeyD,jump=this.keys.Space||this.keys.ArrowUp||this.keys.KeyW;let convey=this.mode==='inflation'&&(Math.floor(p.x/380)%2===0)?75:0;p.vx=(right?speed+convey:0)-(left?speed-convey:0);if(jump&&p.ground&&!this.jumpLock){p.vy=-625;p.ground=false;this.jumpLock=true;tone('ok')}if(!jump)this.jumpLock=false;let old=p.y;p.x=Math.min(2715,Math.max(0,p.x+p.vx*dt));p.vy=Math.min(1000,p.vy+1530*dt);p.y+=p.vy*dt;p.ground=false;
 const floors=[[0,540],[665,1180],[1310,1880],[2015,2750]],ledges=[{x:485,y:421,w:155},{x:1140,y:411,w:205},{x:1810,y:416,w:230}],blocks=floors.map(([a,b])=>({x:a,y:500,w:b-a})).concat(ledges.filter((x,i)=>this.mode!=='clock'||this.freeze>0||Math.floor(this.frame*1.2+i)%3!==0));for(const b of blocks){if(p.vy>=0&&p.x+p.w>b.x+5&&p.x<b.x+b.w-5&&old+p.h<=b.y+10&&p.y+p.h>=b.y){p.y=b.y-p.h;p.vy=0;p.ground=true;break}}
 if(p.y>590){this.invuln=0;this.damage('Du faldt ned i tidsbruddet!');return}
 const locs=[{x:310,y:448},{x:1000,y:448},{x:2240,y:448}];locs.forEach((v,i)=>{if(!this.coins.has(i)&&Math.abs(p.x+15-v.x)<34&&Math.abs(p.y+20-v.y)<49){this.coins.add(i);this.data.coins=[...this.coins];save();tone('stamp');this.hud();toast('Tidsfragment samlet op.')}});
 if(p.x>1410&&this.coins.size>=2&&!this.checkpoint){this.checkpoint=1;this.data.checkpoint=1;save();this.hud();toast('Gemmepunkt nået.')}
 if(this.mode==='paper'){this.chase+=Math.max(122,speed*.56)*dt;if(p.x<this.chase+42){this.invuln=0;this.damage('Dokumentbølgen indhentede dig!');return}}
 if(this.freeze<=0){this.moving.forEach((h,i)=>{h.x=h.base+Math.sin(this.frame*1.8+i)*85;if(Math.abs(p.x+15-h.x)<26&&p.y+p.h>458&&p.y<500)this.damage(this.mode==='inflation'?'Et prisskilt ramte dig!':'En tidsfælde ramte dig!')})}
 if(p.x>2660){if(this.coins.size<2){if(this.frame-this.hazardTimer>2){toast('Portalen kræver mindst to tidsfragmenter. Vend tilbage.',true);this.hazardTimer=this.frame}}else{this.victory=true;this.running=false;state.stage=EXTRAS[this.mode].next;save();setTimeout(()=>{if(state.stage===EXTRAS[this.mode].next)render()},350);return}}
 this.camera=Math.max(0,Math.min(1750,p.x-250));this.draw()}
 draw(){const c=this.c,cam=this.camera,mode=this.mode,t=this.frame;c.clearRect(0,0,1000,560);const grad=c.createLinearGradient(0,0,0,560);grad.addColorStop(0,EXTRAS[mode].background);grad.addColorStop(1,'#111d2c');c.fillStyle=grad;c.fillRect(0,0,1000,560);
 for(let i=0;i<20;i++){const x=(i*170-cam*.22)%1160;rect(c,x,125+(i%5)*30,65,275,'#1d2a3d');rect(c,x+8,150+(i%5)*30,10,20,'#c39d6866')}
 if(mode==='clock'){for(let i=0;i<13;i++){const x=(i*113-cam*.3)%1200;const yy=55+(i*43)%260;c.strokeStyle='#91cad18a';c.lineWidth=3;c.beginPath();c.arc(x,yy,18,0,Math.PI*2);c.stroke();line(c,x,yy,x+Math.sin(t+i)*10,yy-12,'#d9ddbe',2)}}else if(mode==='inflation'){for(let i=0;i<9;i++){const x=(i*150-cam*.3)%1200;textDraw(c,['100 MARK','1.000 M','MILLIARDEN'][i%3],x,200+(i%3)*50,'#b2a98b',14)}}else{for(let i=0;i<18;i++){let x=(i*97-cam*.35)%1200;rect(c,x,150+Math.sin(t*.7+i)*60,56,32,'#ead3a9');line(c,x+5,160,x+50,160,'#9a7458',2)}}
 c.save();c.translate(-Math.round(cam),0);[[0,540],[665,1180],[1310,1880],[2015,2750]].forEach(([a,b])=>{rect(c,a,500,b-a,60,'#304357');for(let x=a;x<b;x+=45){rect(c,x,500,42,10,mode==='inflation'?'#d1a671':'#8ea5a5');rect(c,x+12,522,5,30,'#192e3d')}});[{x:485,y:421,w:155},{x:1140,y:411,w:205},{x:1810,y:416,w:230}].forEach((b,i)=>{let visible=mode!=='clock'||this.freeze>0||Math.floor(t*1.2+i)%3!==0;if(visible){rect(c,b.x,b.y,b.w,19,'#d3b680');rect(c,b.x+8,b.y+12,b.w-16,12,'#46556a')}else{c.globalAlpha=.18;rect(c,b.x,b.y,b.w,20,'#b6d9e3');c.globalAlpha=1}});
 this.moving.forEach((h,i)=>{rect(c,h.x-15,466,30,33,mode==='inflation'?'#cd9f52':'#b85b6b');textDraw(c,mode==='inflation'?'$':'!',h.x,490,'#fff7d1',23,'center')});[{x:310,y:448},{x:1000,y:448},{x:2240,y:448}].forEach((p,i)=>{if(!this.coins.has(i)){c.save();c.translate(p.x,p.y);c.rotate(Math.sin(t*4+i)*.2);rect(c,-12,-12,24,24,'#ffe18e');textDraw(c,'✦',0,8,'#774d42',23,'center');c.restore()}});
 if(mode==='paper'){rect(c,this.chase-28,290,38,210,'#c6b08b');for(let i=0;i<7;i++)rect(c,this.chase-26+i*4,288-i*12,55,6,'#f2d8b0')}
 rect(c,2670,369,55,131,'#b48d5b');rect(c,2678,383,40,115,'#1a4d58');textDraw(c,'↗',2700,450,'#f7d992',29,'center');const p=this.p;if(this.invuln<=0||Math.floor(t*13)%2===0){rect(c,p.x+4,p.y+10,24,28,'#4c8fb1');rect(c,p.x+7,p.y+1,18,17,'#e7b98e');rect(c,p.x+6,p.y-3,21,7,'#59442b');rect(c,p.x+5,p.y+33,10,9,'#253447');rect(c,p.x+19,p.y+33,10,9,'#253447')}
 c.restore();rect(c,0,0,1000,52,'#132b3dbb');textDraw(c,EXTRAS[mode].name.toUpperCase(),22,33,EXTRAS[mode].accent,23);textDraw(c,`FRAGMENTER ${this.coins.size}/3`,590,33,'#f0ebdc',16);textDraw(c,`LIV ${this.health}/3`,846,33,'#f0a7a2',17);if(mode==='clock'){textDraw(c,this.freeze>0?'TIDEN ER FROSSET':this.freezeCooldown>0?'E GENOPLADER':'E = FRYS TID',420,83,'#d0f7ed',17,'center')};if(this.paused)rect(c,0,0,1000,560,'#07172544')}
}

// JESPER BOSS EDITION: Tre ekstra bosskampe. Hver har sin egen mekanik,
// og kampene bruger den eksisterende offline-score og checkpoint-state.
const extraBase={init:ExtraRunner.prototype.init,draw:ExtraRunner.prototype.draw,update:ExtraRunner.prototype.update,hud:ExtraRunner.prototype.hud,resetCheckpoint:ExtraRunner.prototype.resetCheckpoint,useTelegraph:ExtraRunner.prototype.useTelegraph,damage:ExtraRunner.prototype.damage};
ExtraRunner.prototype.init=function(){
 extraBase.init.call(this);
 this.arena=!!this.data.bossActive;this.bossHp=this.data.bossHp===undefined?3:Math.max(0,Number(this.data.bossHp));
 this.bossProjectiles=[];this.bossTimer=0;this.bossSpawnTime=1.0;this.bossMessage='';this.bossMessageTime=0;this.bossFlash=0;this.bossCompleteTimer=0;this.bossCool=0;this.bossOrb=null;this.bossOrbDelay=.75;
 if(this.arena){this.spawnArena();this.showBossIntro();this.draw();this.hud()}
};
ExtraRunner.prototype.spawnArena=function(){this.p.x=140;this.p.y=455;this.p.vx=0;this.p.vy=0;this.p.ground=false;this.invuln=2.1;this.camera=0;this.jumpLock=false;this.keys={}};
ExtraRunner.prototype.enterArena=function(fromSave=false){
 this.arena=true;this.bossHp=fromSave?(this.data.bossHp??3):3;this.data.bossHp=this.bossHp;this.data.bossActive=true;this.data.checkpoint=1;this.checkpoint=1;
 this.health=3;this.spawnArena();this.bossProjectiles=[];this.bossTimer=0;this.bossSpawnTime=1.0;this.bossMessageTime=4;this.bossMessage='JESPER BEGRAVER DIG I KILDER!';this.bossFlash=0;this.bossCompleteTimer=0;this.bossCool=0;this.bossOrb=null;this.bossOrbDelay=.75;
 save();this.showBossIntro();this.draw();this.hud();
};
ExtraRunner.prototype.showBossIntro=function(){
 this.paused=true;this.keys={};const spec=XBOSS[this.mode],o=$('#gameOverlay');o.classList.remove('hide');
 o.innerHTML=`<div class="boss-intro-panel"><div class="warning">The GOAT strikes again</div><img class="boss-avatar" src="${bossPortrait.src}" alt="Pixelportræt af Jesper"><div class="boss-name">Jesper</div><div class="boss-goat">${spec.title}</div><p><strong>»I am Jesper, the GOAT of History!«</strong><br>${spec.intro}</p><div class="boss-actions"><span>← → eller A D: løb</span><span>Mellemrum: hop</span><span>${spec.tip}</span></div><p>Tre træffere besejrer Jesper. Mistede liv tæller med, men de liv, Jesper allerede har tabt, er gemt.</p><button type="button" id="startExtraBoss" class="primary">Udfordr Jesper</button></div>`;
 $('#startExtraBoss').onclick=()=>{this.paused=false;o.classList.add('hide');this.canvas.focus()};
};
ExtraRunner.prototype.resetCheckpoint=function(){
 if(!this.arena){extraBase.resetCheckpoint.call(this);return}
 this.health=3;this.spawnArena();this.bossProjectiles=[];this.bossCool=0;this.bossTimer=0;this.bossSpawnTime=1.1;this.paused=false;$('#gameOverlay').classList.add('hide');this.hud();this.draw();
};
ExtraRunner.prototype.hud=function(){
 extraBase.hud.call(this);let b=$('#extraBossHud'),s=$('#extraBossHP');if(b)b.classList.toggle('hide',!this.arena);if(s)s.textContent='♥ '.repeat(this.bossHp||0);
};
ExtraRunner.prototype.damage=function(reason){
 if(!this.arena){extraBase.damage.call(this,reason);return}
 if(this.invuln>0||this.bossCompleteTimer>0)return;
 state.lostLives++;save();this.health--;this.hud();tone('bad');
 if(this.health<=0){this.health=3;this.spawnArena();this.bossProjectiles=[];this.bossTimer=0;this.bossSpawnTime=1;this.sayBoss('NU FÅR DU FRAVÆR!');toast('Jesper sendte dig til omprøve. Bossens tabte liv er gemt.',true)}
 else{this.p.vy=-220;this.invuln=2;this.sayBoss('DET KOSTER FRAVÆR!');toast(reason+' '+this.health+' liv tilbage.',true)}this.hud();
};
ExtraRunner.prototype.sayBoss=function(text){this.bossMessage=text;this.bossMessageTime=3.0};
ExtraRunner.prototype.hitExtraBoss=function(){
 if(this.bossCompleteTimer>0||this.bossHp<=0)return;
 this.bossHp--;this.data.bossHp=this.bossHp;save();tone('stamp');this.bossFlash=.7;this.bossProjectiles=[];this.bossTimer=0;this.bossSpawnTime=1.3;this.bossOrb=null;this.bossOrbDelay=1.1;
 this.sayBoss(this.bossHp===2?'DET DÉR VAR METODISK TVIVLSOMT!':this.bossHp===1?'DET KAN DU IKKE GØRE MOD JESPER!':'NEEEEJ! THE GOAT HAS FALLEN!');
 if(this.bossHp<=0){this.bossCompleteTimer=2.4;this.sayBoss('NEEEEJ! THE GOAT HAS FALLEN!');toast('Jesper er besejret. Tidsportalen åbner.')}
 else toast('Et velplaceret angreb. Jesper har '+this.bossHp+' liv tilbage.');this.hud()
};
ExtraRunner.prototype.finishExtraBoss=function(){
 if(this.victory)return;this.victory=true;this.running=false;this.data.bossActive=false;this.data.defeated=true;state.stage=EXTRAS[this.mode].next;save();setTimeout(()=>{if(state.stage===EXTRAS[this.mode].next)render()},400)
};
ExtraRunner.prototype.useTelegraph=function(){
 if(!this.arena){extraBase.useTelegraph.call(this);return}
 if(this.paused||this.bossCompleteTimer>0)return;
 if(this.mode==='paper'){
  if(this.bossCool>0)return;
  const p=this.p;let ix=this.bossProjectiles.findIndex(q=>q.kind==='gold'&&Math.abs(q.x-(p.x+15))<108&&Math.abs(q.y-(p.y+20))<88);
  if(ix<0){this.bossCool=.24;toast('Vent på et gyldent bilag, og tryk E tæt på det.',true);return}
  this.bossProjectiles.splice(ix,1);this.bossCool=.7;this.sayBoss('HVAD?! DU RETURNERER MINE KILDER?!');this.hitExtraBoss();return;
 }
 if(this.mode==='clock'){
  if(this.freeze>0)return;if(this.freezeCooldown>0){toast('Tidsfrysningen lader op.',true);return}
  this.freeze=3.7;this.freezeCooldown=5.5;this.sayBoss('NEJ! JESPER HAR JO STYR PÅ TIDEN!');tone('stamp');toast('Tiden er frosset. Rør det lysende tandhjul.');return;
 }
 if(this.mode==='inflation')toast('Hop op på den store prisboble ovenfra.',true);
};
ExtraRunner.prototype.update=function(dt){
 if(!this.running)return;
 if(this.arena){this.updateExtraBoss(dt);return}
 // Lige inden den gamle portalsluse skifter bane, starter i stedet en bossarena.
 if(this.p.x>=2580&&this.coins.size>=2){this.enterArena();return}
 extraBase.update.call(this,dt);
};
ExtraRunner.prototype.updateExtraBoss=function(dt){
 this.frame+=dt;
 if(this.paused){this.draw();return}
 this.invuln=Math.max(0,this.invuln-dt);this.bossFlash=Math.max(0,this.bossFlash-dt);this.bossMessageTime=Math.max(0,this.bossMessageTime-dt);this.bossCool=Math.max(0,this.bossCool-dt);this.freeze=Math.max(0,this.freeze-dt);this.freezeCooldown=Math.max(0,this.freezeCooldown-dt);
 if(this.bossCompleteTimer>0){this.bossCompleteTimer-=dt;if(this.bossCompleteTimer<=0)this.finishExtraBoss();else this.draw();return}
 const p=this.p,left=this.keys.ArrowLeft||this.keys.KeyA,right=this.keys.ArrowRight||this.keys.KeyD,jump=this.keys.Space||this.keys.ArrowUp||this.keys.KeyW;
 p.vx=(right?270:0)-(left?270:0);
 if(jump&&p.ground&&!this.jumpLock){p.vy=-680;p.ground=false;this.jumpLock=true;tone('ok')}
 if(!jump)this.jumpLock=false;
 const oldFoot=p.y+p.h;
 p.x=Math.max(30,Math.min(702,p.x+p.vx*dt));p.vy=Math.min(1000,p.vy+1600*dt);p.y+=p.vy*dt;p.ground=false;
 const platforms=this.mode==='clock'?[{x:240,y:416,w:135},{x:415,y:348,w:135},{x:598,y:414,w:128}]:this.mode==='inflation'?[{x:245,y:432,w:123},{x:539,y:434,w:125}]:[{x:182,y:412,w:153},{x:505,y:410,w:144}];
 const floors=[{x:0,y:500,w:749},...platforms];
 for(const b of floors){if(p.vy>=0&&p.x+p.w>b.x+4&&p.x<b.x+b.w-4&&oldFoot<=b.y+10&&p.y+p.h>=b.y){p.y=b.y-p.h;p.vy=0;p.ground=true;break}}
 if(p.y>585){this.invuln=0;this.damage('Du faldt ned i arkivkælderen!');this.draw();return}
 this.bossTimer+=dt;
 if(this.mode==='paper')this.updatePaperBoss(dt);
 if(this.mode==='inflation')this.updateInflationBoss(dt,oldFoot);
 if(this.mode==='clock')this.updateClockBoss(dt);
 this.draw();
};
ExtraRunner.prototype.updatePaperBoss=function(dt){
 if(this.bossTimer>=this.bossSpawnTime){
  const num=Math.floor(this.bossTimer/1.3);const gold=(num%3!==1);
  const y=gold?445:[434,472,388][num%3];
  this.bossProjectiles.push({x:775,y,vx:-205-(3-this.bossHp)*12,vy:0,kind:gold?'gold':'normal'});
  this.bossSpawnTime=this.bossTimer+2.3;
  this.sayBoss(gold?'JEG BEGRAVER DIG I KILDER!':'JEG SMADRER DIG MED FRAVÆR!');
 }
 const p=this.p;
 this.bossProjectiles=this.bossProjectiles.filter(z=>{
  z.x+=z.vx*dt;
  if(!this.invuln&&z.x>p.x-25&&z.x<p.x+p.w+25&&Math.abs(z.y-(p.y+20))<34){this.damage(z.kind==='gold'?'Du blev ramt af et gyldent kildehæfte!':'Et flyvende opgaveark ramte dig!');return false}
  return z.x>-40;
 });
};
ExtraRunner.prototype.updateInflationBoss=function(dt,oldFoot){
 this.bossOrbDelay=Math.max(0,this.bossOrbDelay-dt);
 if(!this.bossOrb&&this.bossOrbDelay<=0){let idx=3-this.bossHp;this.bossOrb={baseX:[352,488,405][idx%3],x:350,y:[409,405,413][idx%3],r:36,phase:this.frame};this.sayBoss('JESPER HÆVER PRISERNE IGEN!')}
 if(this.bossOrb){let b=this.bossOrb;b.x=b.baseX+Math.sin(this.frame*2.0)*24;b.y+=Math.sin(this.frame*1.6)*.24;
  const p=this.p,feet=p.y+p.h,near=Math.abs(p.x+p.w/2-b.x)<b.r+10;
  if(near&&p.vy>55&&oldFoot<=b.y-b.r+16&&feet>=b.y-b.r-5){p.y=b.y-b.r-p.h;p.vy=-480;p.ground=false;this.bossOrb=null;this.sayBoss('MINE PRISBOBLER! NEJ!');this.hitExtraBoss();return}
  if(near&&Math.abs(p.y+20-b.y)<b.r+10&&!this.invuln&&p.vy>=-20){this.damage('Du blev ramt af en voksende prisboble!')}
 }
 if(this.bossTimer>=this.bossSpawnTime){this.bossProjectiles.push({x:810,y:459,vx:-215,vy:0,kind:'tag'});this.bossSpawnTime=this.bossTimer+3.5;this.sayBoss('DIN KARAKTER KOSTER NU EN MILLIARD MARK!')}
 const p=this.p;this.bossProjectiles=this.bossProjectiles.filter(z=>{z.x+=z.vx*dt;if(!this.invuln&&z.x>p.x-20&&z.x<p.x+p.w+20&&Math.abs(z.y-(p.y+19))<25){this.damage('Et prisskilt ramte dig!');return false}return z.x>-40});
};
ExtraRunner.prototype.updateClockBoss=function(dt){
 const target=[{x:316,y:369},{x:488,y:301},{x:655,y:370}][3-this.bossHp];
 if(this.freeze>0){const p=this.p;if(Math.abs(p.x+p.w/2-target.x)<55&&Math.abs(p.y+19-target.y)<63){this.freeze=0;this.freezeCooldown=1.4;this.sayBoss('NEJ! NU ER JESPERS TID LØBET UD!');this.hitExtraBoss();return}}
 if(this.freeze<=0&&this.bossTimer>=this.bossSpawnTime){this.bossProjectiles.push({x:795,y:[440,390,470][(3-this.bossHp)%3],vx:-250,vy:0,kind:'clock'});this.bossSpawnTime=this.bossTimer+3.1;this.sayBoss('DU KAN IKKE STOPPE HISTORIEN!')}
 if(this.freeze>0)return;
 const p=this.p;this.bossProjectiles=this.bossProjectiles.filter(z=>{z.x+=z.vx*dt;if(!this.invuln&&z.x>p.x-24&&z.x<p.x+p.w+24&&Math.abs(z.y-(p.y+18))<29){this.damage('Tidsmaskinens urværk ramte dig!');return false}return z.x>-40});
};
ExtraRunner.prototype.draw=function(){if(this.arena){this.drawExtraBoss();return}extraBase.draw.call(this)};
ExtraRunner.prototype.drawExtraBoss=function(){
 const c=this.c,t=this.frame,mode=this.mode,s=EXTRAS[mode];c.clearRect(0,0,1000,560);
 let grd=c.createLinearGradient(0,0,0,560);grd.addColorStop(0,mode==='paper'?'#1a2d48':mode==='inflation'?'#624331':'#1c2052');grd.addColorStop(1,mode==='paper'?'#526275':mode==='inflation'?'#9b7253':'#48578a');c.fillStyle=grd;c.fillRect(0,0,1000,560);
 for(let i=0;i<11;i++){let x=i*113;rect(c,x,66,7,395,'#1b293c99');rect(c,x+14,94,74,12,'#42546a66')}
 if(mode==='paper'){for(let i=0;i<9;i++){let x=30+i*108;rect(c,x,286+(i%3)*16,82,175,'#3b4b5e');for(let k=0;k<4;k++)rect(c,x+8,309+k*29,66,12,'#cfab7b');textDraw(c,'BILAG '+(i+1),x+34,279+(i%3)*16,'#d8b986',10,'center')}}
 if(mode==='inflation'){for(let i=0;i<7;i++){let x=i*145;rect(c,x,278+(i%3)*23,92,185,'#554a42');rect(c,x+9,295,72,18,'#bca06a');textDraw(c,['100 MARK','1.000 M','1 MILLIARD'][i%3],x+45,333,'#efd18c',11,'center')}}
 if(mode==='clock'){for(let i=0;i<9;i++){let x=60+i*116;const yy=220+(i%3)*35;c.strokeStyle='#a6cfe59a';c.lineWidth=4;c.beginPath();c.arc(x,yy,42,0,6.283);c.stroke();line(c,x,yy,x+Math.sin(t*2+i)*26,yy-18,'#cbd8ba',3)}}
 rect(c,0,500,1000,60,'#253746');for(let x=0;x<1000;x+=45){rect(c,x,500,42,9,'#b89770');rect(c,x+14,530,5,24,'#1b2a39')}
 const platforms=mode==='clock'?[{x:240,y:416,w:135},{x:415,y:348,w:135},{x:598,y:414,w:128}]:mode==='inflation'?[{x:245,y:432,w:123},{x:539,y:434,w:125}]:[{x:182,y:412,w:153},{x:505,y:410,w:144}];
 for(let b of platforms){rect(c,b.x,b.y,b.w,16,'#cba56e');rect(c,b.x+8,b.y+10,b.w-16,12,'#3e5166')}
 // A consistent recognizable portrait of Jesper in each different boss-arena.
 let sh=this.bossFlash>0?Math.sin(t*42)*8:0;rect(c,773+sh,337,191,165,'#434055');rect(c,792+sh,365,151,117,'#6a5970');rect(c,822+sh,382,75,97,'#ceb488');rect(c,848+sh,382,19,106,'#aa5950');
 if(bossPortrait.complete&&bossPortrait.naturalWidth)c.drawImage(bossPortrait,807+sh,204+Math.sin(t*2)*3,136,165);
 rect(c,762,471,230,27,'#987452');rect(c,770,471,212,7,'#e3b983');rect(c,781,500,17,60,'#4e4152');rect(c,955,500,17,60,'#4e4152');
 for(let i=0;i<4;i++){rect(c,759+i*38,454-i*7,33,11,'#d9bd8d');rect(c,763+i*38,457-i*7,27,4,'#775b65')}
 rect(c,708,142,284,56,'#182536');rect(c,720,157,258,17,'#3a3040');rect(c,722,159,(254*this.bossHp/3),13,this.bossHp===1?'#f7b064':'#f47778');textDraw(c,'JESPER · THE GOAT',717,131,'#ffe2a4',17);
 if(this.bossMessageTime>0){rect(c,354,69,630,67,'#eddfbf');rect(c,358,73,622,59,'#533f43');textDraw(c,this.bossMessage,669,109,'#f9e7bc',Math.max(14,Math.min(18,520/this.bossMessage.length*2.8)),'center')}
 this.bossProjectiles.forEach(z=>{
  if(z.kind==='gold'){rect(c,z.x-20,z.y-23,40,46,'#ffdc77');rect(c,z.x-14,z.y-19,28,37,'#fff2bb');textDraw(c,'KILDE',z.x,z.y+1,'#693d36',13,'center');textDraw(c,'E!',z.x,z.y-27,'#9cffa0',16,'center')}
  else if(z.kind==='normal'){rect(c,z.x-23,z.y-21,46,43,'#b44e56');rect(c,z.x-17,z.y-15,32,32,'#f7d7af');textDraw(c,'F',z.x,z.y+7,'#973e45',18,'center')}
  else if(z.kind==='tag'){rect(c,z.x-24,z.y-22,48,45,'#f2c86c');textDraw(c,'1 MIL.',z.x,z.y+6,'#59483c',13,'center')}
  else{c.beginPath();c.fillStyle='#c0e5f5';c.arc(z.x,z.y,19,0,6.283);c.fill();textDraw(c,'⏱',z.x,z.y+8,'#26345a',25,'center')}
 });
 if(mode==='inflation'&&this.bossOrb){const b=this.bossOrb;c.beginPath();c.fillStyle='#f3b75e';c.arc(b.x,b.y,b.r+3,0,6.283);c.fill();c.strokeStyle='#ffe39e';c.lineWidth=5;c.stroke();textDraw(c,['1000 MARK','1 MIO.','1 MILLIARD'][3-this.bossHp],b.x,b.y+4,'#553d4b',13,'center');textDraw(c,'HOP!',b.x,b.y-48,'#fff4cb',18,'center')}
 if(mode==='clock'){const tar=[{x:316,y:369},{x:488,y:301},{x:655,y:370}][Math.max(0,Math.min(2,3-this.bossHp))];for(let i=0;i<3;i++){const gg=[{x:316,y:369},{x:488,y:301},{x:655,y:370}][i];const active=i===3-this.bossHp;c.beginPath();c.strokeStyle=active?(this.freeze>0?'#9fffd0':'#f9d489'):'#567b8f';c.lineWidth=active?7:3;c.arc(gg.x,gg.y,active?28:21,0,6.283);c.stroke();textDraw(c,active?'✦':'✕',gg.x,gg.y+8,active?'#fef4bc':'#627687',24,'center')}
  if(this.freeze>0){rect(c,258,57,472,40,'#164d59db');textDraw(c,'TIDEN ER FROSSET · RØR DET LYSENDE GEAR!',490,83,'#b4ffe7',17,'center')}
  else textDraw(c,this.freezeCooldown>0?'E GENOPLADER ...':'TRYK E FOR AT FRYSE TIDEN',489,84,'#d5ecff',18,'center');
 }
 if(mode==='paper')textDraw(c,'GULD = E · RØD = UNDVIG',305,84,'#f9dc9c',19,'center');
 if(mode==='inflation')textDraw(c,'HOP PÅ PRISBOBLEN OVENFRA!',334,84,'#f9dc9c',19,'center');
 const p=this.p;if(this.invuln<=0||Math.floor(t*13)%2===0){rect(c,p.x+4,p.y+12,22,26,'#397b9d');rect(c,p.x+7,p.y,17,18,'#e9b58d');rect(c,p.x+4,p.y-5,24,8,'#ac4c4a');rect(c,p.x+3,p.y+35,10,8,'#263d56');rect(c,p.x+18,p.y+35,11,8,'#263d56')}
 rect(c,0,0,1000,53,'#17283be9');textDraw(c,XBOSS[mode].subtitle,20,34,'#ffda99',18);textDraw(c,`LIV ${this.health}/3`,705,33,'#f5aaa6',18);textDraw(c,`JESPER ${this.bossHp}/3`,831,33,'#f3deae',18);
 if(this.bossCompleteTimer>0){rect(c,151,238,710,95,'#142a3df2');rect(c,159,246,694,77,'#293949');textDraw(c,'THE GOAT HAS FALLEN!',500,283,'#ffe0a0',30,'center');textDraw(c,'»JEG SAVNER STADIG EN PERSPEKTIVERING!«',500,312,'#d2ebdf',17,'center')}
 if(this.paused)rect(c,0,0,1000,560,'#07162044')
};

