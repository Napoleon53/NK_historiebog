'use strict';
/* =====================================================================
   bane.js - kollegaens spilmotor fra "Jesper Boss Edition"
   Platformbanen Telegramkaos (niveau 2) og bosskampene mod Jesper i
   niveau 2 og i finalen (niveau 10). state.finalBoss skifter til finalen.
   Koden er flyttet uændret fra originalen. Kun teksterne på skærmen er
   modereret: færre versaler og udråbstegn uden for lærredet, ingen
   emojier, og "Jeg smadrer dig med fravær" er blevet til "Nu får du
   fravær". Jespers øvrige replikker er hans egne.
   ===================================================================== */
// Platformer
const worldW=3620;const floors=[[0,700],[800,1370],[1480,2070],[2160,2780],[2870,3620]];
const staticPlatforms=[{x:490,y:417,w:158,h:19},{x:722,y:425,w:118,h:19},{x:1100,y:412,w:150,h:19},{x:1312,y:416,w:190,h:19},{x:1725,y:419,w:155,h:19},{x:2018,y:416,w:173,h:19},{x:2470,y:420,w:145,h:19},{x:2720,y:413,w:177,h:19},{x:3160,y:416,w:180,h:19}];
const stampPoints=[{x:385,y:456},{x:1000,y:456},{x:1700,y:456},{x:2450,y:455},{x:3210,y:456}];
const coinPoints=[240,270,302,565,600,748,834,916,1190,1235,1393,1550,1590,1830,1870,2120,2240,2300,2510,2670,2800,3060,3100,3390].map((x,i)=>({x,y:i%4===0?375:455}));
const hazards=[{x:1120,min:1035,max:1225,speed:95},{x:1852,min:1760,max:1975,speed:115},{x:2620,min:2520,max:2695,speed:125},{x:3320,min:3240,max:3450,speed:150}];
class Platformer{
 constructor(canvas){this.canvas=canvas;this.c=canvas.getContext('2d');this.c.imageSmoothingEnabled=false;this.running=true;this.paused=true;this.keys={};this.camera=0;this.health=3;this.invincible=0;this.victory=false;this.frame=0;this.p={x:82,y:440,w:28,h:42,vx:0,vy:0,ground:false};this.stamps=new Set(state.actionStamps||[]);this.coins=new Set(state.actionCoins||[]);this.hazards=hazards.map(h=>({...h,dir:1}));this.checkpoint=state.actionCheckpoint||0;this.exitNoticeCooldown=0;this.jumpLock=false;this.resizeCount=0;this.mode=state.actionBoss?'boss':'run';this.bossHp=Math.max(1,Number(state.actionBossHp)||3);this.bossCycle=0;this.bossAttackFlags=new Set();this.bossProjectiles=[];this.bossShot=null;this.bossMessage='';this.bossMessageTime=0;this.bossFlash=0;this.bossWinCountdown=0;this.leverCooldown=0;this.bossFightPhase=1;this.bossPhaseBanner=0;this.bossPhaseMessage='';this.bossParticles=[]}
 init(){if(this.mode==='boss')this.enterBoss(true);else this.spawn(this.checkpoint);this.draw();this.updateHud()}
 stop(){this.running=false}
 spawn(n){this.p.x=n===2?2185:n===1?1498:80;this.p.y=440;this.p.vx=0;this.p.vy=0;this.p.ground=false;this.invincible=1.15;this.camera=Math.max(0,this.p.x-240)}
 resetCheckpoint(){this.health=3;if(this.mode==='boss'){this.bossResetPosition();this.bossProjectiles=[];this.bossCycle=0;this.bossAttackFlags.clear();this.bossShot=null;this.leverCooldown=0;this.bossMessage='Nyt forsøg! Tænk på dine kilder!';this.bossMessageTime=2.4;}else this.spawn(this.checkpoint);this.paused=false;$('#gameOverlay').classList.add('hide');this.updateHud();toast('Tilbage ved seneste checkpoint. Prøv igen.')}
 togglePause(){if(!this.running||this.victory)return;this.paused=!this.paused;const o=$('#gameOverlay');if(this.paused){o.classList.remove('hide');o.innerHTML=`<div class="game-panel"><h2>Pause</h2><p>Historien holder lige et øjeblik inde.</p><button type="button" id="resumeAction" class="primary">Fortsæt</button> <button type="button" id="retryAction" class="secondary">Fra checkpoint (+1 mistet liv)</button></div>`;$('#resumeAction').onclick=()=>this.togglePause();$('#retryAction').onclick=()=>{state.lostLives++;save();this.resetCheckpoint()}}else{o.classList.add('hide');$('#actionCanvas').focus()}}
 update(dt){if(!this.running)return;this.frame+=dt;if(this.paused){this.draw();return}if(this.mode==='boss'){this.updateBoss(dt);return}this.invincible=Math.max(0,this.invincible-dt);this.exitNoticeCooldown=Math.max(0,this.exitNoticeCooldown-dt);
 const p=this.p;const left=this.keys.ArrowLeft||this.keys.KeyA,right=this.keys.ArrowRight||this.keys.KeyD;const jump=this.keys.Space||this.keys.ArrowUp||this.keys.KeyW;p.vx=(right?264:0)-(left?264:0);
 if(jump&&p.ground&&!this.jumpLock){p.vy=-590;p.ground=false;this.jumpLock=true;tone('ok')}if(!jump)this.jumpLock=false;
 let beforeY=p.y;p.x=Math.max(2,Math.min(worldW-p.w-8,p.x+p.vx*dt));p.vy=Math.min(970,p.vy+1420*dt);p.y+=p.vy*dt;p.ground=false;
 const colliders=[...floors.map(([a,b])=>({x:a,y:500,w:b-a,h:60})),...staticPlatforms];
 for(const b of colliders){if(p.vy>=0&&p.x+p.w>b.x+4&&p.x<b.x+b.w-4&&beforeY+p.h<=b.y+8&&p.y+p.h>=b.y){p.y=b.y-p.h;p.vy=0;p.ground=true;break}}
 if(p.y>595){this.damage('Du faldt ned mellem telegrampolerne!');return}
 this.hazards.forEach(h=>{h.x+=h.speed*h.dir*dt;if(h.x<h.min){h.x=h.min;h.dir=1}if(h.x>h.max){h.x=h.max;h.dir=-1}if(!this.invincible&&p.x+p.w>h.x-16&&p.x<h.x+16&&p.y+p.h>470&&p.y<500)this.damage('AV! En elektrisk censor ramte dig.')});
 stampPoints.forEach((s,i)=>{if(!this.stamps.has(i)&&Math.abs(p.x+p.w/2-s.x)<30&&Math.abs(p.y+p.h/2-s.y)<50){this.stamps.add(i);state.actionStamps=[...this.stamps];this.updateHud();toast('Gyldent telegramstempel samlet op.');tone('stamp')}});
 coinPoints.forEach((s,i)=>{if(!this.coins.has(i)&&Math.abs(p.x+p.w/2-s.x)<23&&Math.abs(p.y+p.h/2-s.y)<33){this.coins.add(i);state.actionCoins=[...this.coins];this.updateHud();tone('ok')}});
 if(p.x>1490&&this.checkpoint<1){this.checkpoint=1;state.actionCheckpoint=1;save();toast('Checkpoint: Telegrafcentralen.');this.updateHud()}
 if(p.x>2190&&this.checkpoint<2){this.checkpoint=2;state.actionCheckpoint=2;save();toast('Checkpoint: Nødudgangen.');this.updateHud()}
 if(p.x>3470&&this.stamps.size<3&&this.exitNoticeCooldown===0){toast(`Du mangler ${3-this.stamps.size===1?'1 telegramstempel':(3-this.stamps.size)+' telegramstempler'}. Vend om, og hent ${3-this.stamps.size===1?'det':'dem'}.`,true);this.exitNoticeCooldown=3.5}
 if(p.x>3530&&this.stamps.size>=3){this.enterBoss(false);return}
 this.camera=Math.max(0,Math.min(worldW-1000,p.x-250));this.draw()}
 damage(msg){if(this.invincible)return;state.lostLives++;save();this.health--;this.invincible=1.5;this.p.vy=-220;this.p.vx=0;this.updateHud();tone('bad');if(this.health<=0){this.resetCheckpoint()}else{toast(`${msg} ${this.health} liv tilbage.`,true);this.spawn(this.checkpoint)}}
 win(){this.victory=true;this.paused=true;this.running=false;if(state.finalBoss){finishRun();return}state.actionCheckpoint=2;state.stage='commandIntro';save();this.draw();setTimeout(()=>{if(state.stage==='commandIntro')render()},650)}
 updateHud(){if($('#bossHealthInfo'))$('#bossHealthInfo').classList.toggle('hide',this.mode!=='boss');if($('#bossHealthText'))$('#bossHealthText').textContent='♥ '.repeat(this.bossHp);if($('#healthText'))$('#healthText').textContent='♥ '.repeat(this.health);if($('#stampsText'))$('#stampsText').textContent=`${this.stamps.size} / 3`;if($('#coinsText'))$('#coinsText').textContent=this.coins.size;if($('#checkpointText'))$('#checkpointText').textContent=['Start','Midt','Slut'][this.checkpoint]}
 

 // Jesper er et humoristisk bossmøde efter den faglige del; ingen spoken dialogue eller netadgang.
 enterBoss(fromSave=false){
  this.mode='boss';this.paused=true;this.keys={};this.camera=0;this.health=3;
  this.bossHp=Math.max(1,Math.min(3,Number(state.actionBossHp)||3));
  this.bossFightPhase=4-this.bossHp;this.bossPhaseBanner=2.7;
  this.bossPhaseMessage=['','FASE 1 · THE GOAT','FASE 2 · FRAVÆRSANGREB','FASE 3 · HELE PENSUM'][this.bossFightPhase];
  this.bossCycle=0;this.bossAttackFlags.clear();this.bossProjectiles=[];this.bossShot=null;this.bossParticles=[];
  this.leverCooldown=0;this.bossMessage=state.finalBoss?'I AM JESPER – THE FINAL GOAT OF HISTORY!':'I AM JESPER – THE GOAT OF HISTORY!';this.bossMessageTime=5;this.bossFlash=0;this.bossWinCountdown=0;
  this.bossResetPosition();state.actionBoss=true;state.actionBossHp=this.bossHp;save();this.updateHud();this.draw();
  {const overlay=$('#gameOverlay');overlay.classList.remove('hide');overlay.innerHTML=`<div class="boss-intro-panel"><div class="warning">${state.finalBoss?'The final exam':'Warning: boss approaching'}</div><img class="boss-avatar" src="${bossPortrait.src}" alt="Pixelportræt af historielæreren Jesper"><div class="boss-name">Jesper</div><div class="boss-goat">${state.finalBoss?'The GOAT of History · final exam':'The GOAT of History'}</div><p><b>»I am Jesper, the GOAT of History!«</b><br>Historielæreren vogter tidsportalen og angriber med bøger, regn af kilder og en skræmmende mængde fravær.</p><div class="boss-actions"><span>← → eller A D: løb</span><span>Mellemrum: hop</span><span>E: modargument</span></div><p>Undvig Jespers angreb. Når telegrafen lyser <b class="groent">grønt</b>, skal du stå ved den og trykke <b>E</b>. Tre modargumenter besejrer Jesper.${state.finalBoss?' I finalen flytter den aktive telegraf efter hvert træf.':''} Du mister ikke de niveauer, du har gennemført.</p><button type="button" id="bossContinue" class="primary">Udfordr The GOAT</button></div>`;$('#bossContinue').onclick=()=>{this.paused=false;overlay.classList.add('hide');this.canvas.focus()};}
 }
 bossResetPosition(){this.p.x=254;this.p.y=458;this.p.vx=0;this.p.vy=0;this.p.ground=false;this.invincible=1.8;this.jumpLock=false}
 bossSpeak(msg,duration=3.0){this.bossMessage=msg;this.bossMessageTime=duration}
 bossPhase(){return 4-this.bossHp}
 bossSetPhase(){this.bossFightPhase=this.bossPhase();this.bossPhaseBanner=2.25;this.bossPhaseMessage=['','JESPER · THE GOAT OF HISTORY','FASE 2 · FRAVÆRSANGREB!','FASE 3 · JESPER GÅR AMOK!'][this.bossFightPhase]}
 spawnBossAttack(type,x=0){
  const p=this.bossPhase();let z;
  if(type==='book'){z={x:775,y:457,vx:-225-(p-1)*30,vy:0,w:38,h:30,type};this.bossSpeak('JESPER BEGRAVER DIG I KILDER!')}
  else if(type==='chalk'){z={x:780,y:427,vx:-290-(p-1)*24,vy:0,w:22,h:19,type};this.bossSpeak('DU HAR REDEGJORT – MEN HAR DU ANALYSERET?!')}
  else if(type==='absence'){z={x:777,y:467,vx:-270-(p-1)*35,vy:0,w:60,h:37,type};this.bossSpeak('NU FÅR DU FRAVÆR!',3.5)}
  else {z={x:x||[275,365,490,615][Math.floor(this.bossCycle*2)%4],y:70,vx:0,vy:210+(p-1)*42,w:34,h:37,type:'source'};this.bossSpeak(p===3?'NU FÅR DU HELE PENSUM I HOVEDET!':'JEG BEGRAVER DIG I KILDER!',3.6)}
  if(state.finalBoss){z.vx*=1.16;z.vy*=1.16}this.bossProjectiles.push(z);tone('bad');
 }
 useTelegraph(){if(this.mode!=='boss'||this.paused||this.bossWinCountdown>0)return;
  const leverX=state.finalBoss?[255,504,640][Math.max(0,Math.min(2,3-this.bossHp))]:504;const near=Math.abs(this.p.x+this.p.w/2-leverX)<78;
  if(!near){if(this.leverCooldown<=0)toast('Stå ved telegrafen og tryk E.',true);return}
  if(this.bossShot||this.leverCooldown>0)return;
  if(!this.bossIsVulnerable()){toast('Jespers skjold er aktivt. Vent på det grønne lys.',true);tone('bad');this.leverCooldown=.7;return}
  this.bossShot={t:0};this.leverCooldown=2;this.bossSpeak('HVAD?! EN ELEV MED MODARGUMENTER?!',2.9);tone('stamp');toast('Modargument sendt afsted.');
 }
 bossIsVulnerable(){return this.bossCycle>=5.1&&this.bossCycle<=(state.finalBoss?8.5:9.0)}
 updateBoss(dt){
  this.invincible=Math.max(0,this.invincible-dt);this.leverCooldown=Math.max(0,this.leverCooldown-dt);
  this.bossFlash=Math.max(0,this.bossFlash-dt);this.bossMessageTime=Math.max(0,this.bossMessageTime-dt);this.bossPhaseBanner=Math.max(0,this.bossPhaseBanner-dt);
  if(this.bossWinCountdown>0){this.bossWinCountdown-=dt;if(this.bossWinCountdown<=0)this.win();else this.draw();return}
  const p=this.p,left=this.keys.ArrowLeft||this.keys.KeyA,right=this.keys.ArrowRight||this.keys.KeyD;
  const jump=this.keys.Space||this.keys.ArrowUp||this.keys.KeyW;
  p.vx=(right?258:0)-(left?258:0);if(jump&&p.ground&&!this.jumpLock){p.vy=-610;p.ground=false;this.jumpLock=true;tone('ok')}if(!jump)this.jumpLock=false;
  let oldY=p.y;p.x=Math.max(25,Math.min(701,p.x+p.vx*dt));p.vy=Math.min(960,p.vy+1450*dt);p.y+=p.vy*dt;p.ground=false;
  const bs=[{x:0,y:500,w:740,h:70},{x:180,y:390,w:155,h:16},{x:583,y:396,w:132,h:16}];
  for(const b of bs){if(p.vy>=0&&p.x+p.w>b.x+4&&p.x<b.x+b.w-4&&oldY+p.h<=b.y+8&&p.y+p.h>=b.y){p.y=b.y-p.h;p.vy=0;p.ground=true;break}}
  if(p.y>570){this.hitBossPlayer('Du faldt ned i arkivkælderen!');return}
  this.bossCycle+=dt;const f=this.bossAttackFlags,phase=this.bossPhase();
  const schedule=(time,key,type,x=0)=>{if(this.bossCycle>=time&&!f.has(key)){f.add(key);this.spawnBossAttack(type,x)}};
  schedule(1.25,'book','book');
  schedule(3.0,'chalk','chalk');
  if(phase>=2){schedule(2.0,'absence','absence');schedule(3.85,'source','source',320)}
  if(phase>=3){schedule(4.45,'source2','source',585);schedule(5.3,'book2','book')}
  if(this.bossCycle>10.3){this.bossCycle=0;f.clear();this.bossSpeak(['','JESPER GIVER ALDRIG OP!','JESPER CENSURERER DIN SEJR!','JEG SLETTER DIG FRA HISTORIEN!'][phase],3.5)}
  this.bossProjectiles=this.bossProjectiles.filter(z=>{
   z.x+=z.vx*dt;z.y+=z.vy*dt;
   const collision=!this.invincible&&p.x+p.w>z.x-z.w/2&&p.x<z.x+z.w/2&&p.y+p.h>z.y-z.h/2&&p.y<z.y+z.h/2;
   if(collision){this.hitBossPlayer(z.type==='absence'?'Du fik en flyvende fraværsregistrering!':z.type==='source'?'Ramt af et kæmpe kildehæfte!':z.type==='chalk'?'Du blev ramt af tavlekridt!':'Ramt af en tung historiebog!');return false}
   return z.x>-65&&z.y<580;
  });
  if(this.bossShot){this.bossShot.t+=dt;if(this.bossShot.t>.78){
   this.bossShot=null;this.bossHp--;state.actionBossHp=this.bossHp;save();this.updateHud();this.bossFlash=.85;this.bossProjectiles=[];this.bossCycle=0;f.clear();tone('stamp');
   if(this.bossHp<=0){this.bossWinCountdown=2.9;this.bossSpeak('NEEEEJ! THE GOAT HAS FALLEN!',4);toast('Jesper er besejret.')}
   else {this.bossSetPhase();this.bossSpeak(this.bossHp===2?'DET DÉR VAR METODISK TVIVLSOMT!':'JESPER HAR STADIG HELE PENSUM!',3.4);toast(`Jesper mistede et liv. Fase ${this.bossPhase()} starter.`)}
  }}
  this.draw();
 }
 hitBossPlayer(msg){if(this.invincible)return;state.lostLives++;save();this.health--;tone('bad');if(this.health<=0){this.health=3;this.bossResetPosition();this.bossCycle=0;this.bossProjectiles=[];this.bossAttackFlags.clear();this.bossShot=null;this.bossSpeak('OMPRØVE! JESPER VENTER PÅ DIG!',3);toast('Til omprøve. Jespers tabte liv er heldigvis gemt.',true)}else{this.p.vy=-240;this.invincible=1.7;this.bossSpeak('DEN DER KOSTER FRAVÆR!',2.4);toast(`${msg} ${this.health} liv tilbage.`,true)}this.updateHud()}
 
 drawBoss(){
  const c=this.c,t=this.frame,W=1000,H=560;let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#131f36');g.addColorStop(1,'#536b77');c.fillStyle=g;c.fillRect(0,0,W,H);
  // Vinduer, murværk og klokke – samme pixelstil som grundbanen.
  for(let x=0;x<=1000;x+=66){rect(c,x,70,6,380,'#25364b');rect(c,x+3,70,54,8,'#52667d')}
  for(const x of [45,300,550,795]){rect(c,x,92,167,255,'#182739');rect(c,x+9,104,149,231,'#33445b');rect(c,x+80,104,8,231,'#17283d');rect(c,x+9,213,149,7,'#15273a');rect(c,x+27,269,32,55,'#455267');rect(c,x+99,259,18,65,'#455267')}
  for(let y=375;y<500;y+=26){rect(c,0,y,1000,3,'#34485b')}
  // Retro-eksamensplakater.
  rect(c,45,118,180,84,'#d0b17f');rect(c,52,125,166,70,'#574a4e');textDraw(c,'HISTORIE A',135,152,'#f7d391',16,'center');textDraw(c,'KILDER ER ALT',135,176,'#f2e2b9',12,'center');
  rect(c,290,110,150,95,'#aa845e');rect(c,297,117,136,80,'#e0d0a3');textDraw(c,'HUSK',366,141,'#5d4d43',17,'center');textDraw(c,'BELÆG!',366,170,'#713a38',22,'center');
  rect(c,0,500,1000,60,'#273b47');for(let x=0;x<1000;x+=45){rect(c,x,501,42,10,'#b3966b');rect(c,x+4,523,39,2,'#516375');rect(c,x+28,537,4,22,'#1e3343')}
  for(const b of [{x:180,y:390,w:155},{x:583,y:396,w:132}]){rect(c,b.x,b.y,b.w,19,'#bf985d');rect(c,b.x+5,b.y+12,b.w-10,9,'#3d5865')}
  // Bordet, bøger og bossens overdrevne overkrop.
  const bx=805,shake=this.bossFlash>0?Math.sin(t*45)*9:0;
  rect(c,777+shake,354,193,147,'#343445');rect(c,787+shake,369,160,105,'#54506b');rect(c,818+shake,379,55,82,'#e0bd8b');rect(c,841+shake,388,19,78,'#a84942');rect(c,792+shake,360,34,112,'#ccb48e');rect(c,916+shake,360,34,112,'#ccb48e');
  if(bossPortrait.complete&&bossPortrait.naturalWidth>0)c.drawImage(bossPortrait,821+shake,238+Math.sin(t*2)*3,118,151);
  rect(c,815+shake,235,129,5,'#b17d46');
  rect(c,736,463,258,39,'#947046');rect(c,736,462,258,9,'#e3ba74');rect(c,754,502,23,56,'#5e4544');rect(c,950,502,23,56,'#5e4544');
  for(let k=0;k<3;k++){rect(c,747+k*41,450-k*8,34,9,['#d3a36b','#85a0a4','#c68a68'][k]);rect(c,749+k*41,455-k*8,33,4,'#4a4451')}
  rect(c,907+shake,388,37,42,'#73454b');rect(c,911+shake,387,38,5,'#e6c58f');textDraw(c,'HIST',931+shake,405,'#ffe4aa',10,'center');
  // Boss-skjold som lysrør og livsbjælke.
  const vulnerable=this.bossIsVulnerable();
  rect(c,716,168,275,45,'#132d3e');rect(c,720,170,266,40,'#6c4e44');rect(c,729,180,247,14,'#222e3c');rect(c,731,182,(241*Math.max(0,this.bossHp)/3),10,this.bossHp===1?'#e69068':'#ed6964');
  textDraw(c,'JESPER · THE GOAT OF HISTORY',717,157,'#ffdf9f',16);textDraw(c,`SKJOLD: ${vulnerable?'ÅBENT!':'AKTIVT'}`,857,228,vulnerable?'#aeffac':'#f7b19e',16,'center');
  // Telegrafen: grøn kun når skjoldet er åbent.
  const leverX=state.finalBoss?[255,504,640][Math.max(0,Math.min(2,3-this.bossHp))]:504;
  rect(c,leverX-49,465,98,36,'#64534a');rect(c,leverX-39,471,78,23,'#b08a5a');rect(c,leverX-11,452,10,28,'#1d2634');rect(c,leverX-9,444,6,8,'#d5a85d');
  rect(c,leverX-23,437,33,11,vulnerable?'#8df39d':'#e88864');textDraw(c,vulnerable?'E!':'VENT',leverX-7,428,vulnerable?'#bcfca8':'#ffe3ad',18,'center');
  const near=Math.abs(this.p.x+this.p.w/2-leverX)<78;
  if(near&&vulnerable&&!this.bossShot)textDraw(c,'TRYK E: MODARGUMENT!',leverX,400,'#b2fac5',15,'center');
  if(this.bossMessageTime>0){
    rect(c,495,69,491,99,'#4f3b3e');rect(c,499,73,483,90,'#f4e8c5');
    const words=this.bossMessage.split(/\s+/);let rows=[''];for(const w of words){let k=rows.length-1;if((rows[k]+' '+w).trim().length>36&&rows[k])rows.push(w);else rows[k]=(rows[k]+' '+w).trim()}
    const y0=105-(rows.length-1)*9;rows.slice(0,3).forEach((r,i)=>textDraw(c,r,739,y0+i*20,'#55333b',18,'center'));
    rect(c,823,163,17,13,'#f4e8c5');
  }
  // Flyvende kridt og historiebøger.
  this.bossProjectiles.forEach(z=>{
    if(z.type==='book'){rect(c,z.x-19,z.y-16,38,33,'#8a4851');rect(c,z.x-16,z.y-14,32,29,'#d1a366');textDraw(c,'HIST',z.x,z.y+3,'#382c32',11,'center')}
    else if(z.type==='absence'){rect(c,z.x-30,z.y-18,60,36,'#fae6c9');rect(c,z.x-26,z.y-14,52,28,'#c7554d');textDraw(c,'FRAVÆR',z.x,z.y+5,'#fff3dd',13,'center')}
    else if(z.type==='source'){rect(c,z.x-17,z.y-18,34,37,'#d6d2b5');rect(c,z.x-13,z.y-15,27,32,'#f5ead0');for(let k=0;k<3;k++)rect(c,z.x-9,z.y-7+k*7,17,2,'#536273');textDraw(c,'KILDE',z.x,z.y-15,'#2f4b57',10,'center')}
    else{rect(c,z.x-9,z.y-8,19,14,'#f0e4c4');rect(c,z.x-4,z.y-12,16,9,'#fff8df');rect(c,z.x-21,z.y+1,9,3,'#fff8df')}
  })
  if(this.bossShot){let sx=leverX+24+this.bossShot.t*(810-leverX);let sy=428-26*Math.sin(this.bossShot.t*3);rect(c,sx-9,sy-2,27,10,'#fff3ce');line(c,sx-9,sy-2,sx+16,sy-16,'#fff3ce',4);textDraw(c,'MODARGUMENT!',sx-35,sy-24,'#b9ffcb',12)}
  // Player sprite (same as base action stage)
  const p=this.p;if(!this.invincible||Math.floor(t*13)%2===0){rect(c,p.x+2,p.y+p.h-5,p.w-4,6,'#152a32');rect(c,p.x+5,p.y+13,19,20,'#d9bb82');rect(c,p.x+3,p.y+17,23,23,'#496ea4');rect(c,p.x+4,p.y+33,9,9,'#2a3954');rect(c,p.x+17,p.y+33,9,9,'#2a3954');rect(c,p.x+4,p.y+38,10,5,'#e5ae63');rect(c,p.x+17,p.y+38,10,5,'#e5ae63');rect(c,p.x+6,p.y-3,17,18,'#dbb18e');rect(c,p.x+3,p.y-6,24,9,'#b84e4d');rect(c,p.x+1,p.y-1,18,5,'#d66d55');rect(c,p.x+20,p.y+5,4,3,'#1b2534');rect(c,p.x+2,p.y+20,5,14,'#cf9574');rect(c,p.x+24,p.y+21,5,12,'#c68d72')}
  rect(c,0,0,1000,57,'#121f30');rect(c,0,54,1000,3,'#b98d63');textDraw(c,`BOSSKAMP · JESPER · FASE ${this.bossPhase()}/3`,16,35,'#f0cb84',19);textDraw(c,`LIV: ${'♥'.repeat(this.health)}`,615,35,'#f49e98',20);textDraw(c,`BOSS: ${this.bossHp}/3`,850,35,'#f1e9c6',19);
  if(this.bossPhaseBanner>0&&this.bossWinCountdown<=0){rect(c,105,263,585,66,'#172b3eee');rect(c,110,268,575,55,'#b27a54');rect(c,116,274,563,44,'#20384b');textDraw(c,this.bossPhaseMessage,397,301,'#ffe5a2',this.bossFightPhase===1?22:17,'center')}
  if(this.bossWinCountdown>0){rect(c,130,225,730,112,'#142c3fe7');rect(c,140,235,710,92,'#a97852');rect(c,148,242,694,77,'#213747');textDraw(c,'NEEEEJ! THE GOAT HAS FALLEN!',500,278,'#ffe5a2',28,'center');textDraw(c,'»MEN JEG SAVNER STADIG EN PERSPEKTIVERING!«',500,306,'#d9f3d9',17,'center')}
 }

 draw(){if(this.mode==='boss'){this.drawBoss();return}const c=this.c;const cam=this.camera;const W=1000,H=560;
 let grad=c.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#182f49');grad.addColorStop(1,'#52778a');c.fillStyle=grad;c.fillRect(0,0,W,H);
 // moon
 c.fillStyle='#e6d3a7';c.beginPath();c.arc(828-cam*.06,87,40,0,Math.PI*2);c.fill();
 for(let n=0;n<60;n++){let x=((n*237+51)-cam*.17)%1250;if(x<0)x+=1250;rect(c,x,(n*73)%225,3,3,n%2?'#90aabb':'#f4d6ad')}
 // factory chimneys and skyline
 for(let i=0;i<34;i++){let xx=i*125-cam*.35;let ht=110+(i*57)%105;rect(c,xx,480-ht,105,ht,'#274358');rect(c,xx+18,480-ht-25,20,26,'#274358');for(let k=0;k<5;k++)rect(c,xx+18+k*16,480-ht+34,6,8,'#537081')}
 // poles and wire
 for(let i=0;i<21;i++){let xx=i*192-cam*.65;rect(c,xx+34,190,12,285,'#283e4a');rect(c,xx+2,207,78,12,'#344c57');rect(c,xx+7,190,6,15,'#d1ae78');rect(c,xx+67,190,6,15,'#d1ae78');c.beginPath();c.strokeStyle='#748794';c.lineWidth=2;c.moveTo(xx+10,210);c.quadraticCurveTo(xx+120,267,xx+198,210);c.stroke()}
 // foreground steam pipes
 for(let i=0;i<7;i++){let xx=i*580-cam*.92;rect(c,xx+50,460,16,42,'#52716f');rect(c,xx+42,457,31,10,'#93a98f')}
 c.save();c.translate(-Math.round(cam),0);
 floors.forEach(([a,b])=>{rect(c,a,500,b-a,60,'#384653');for(let x=a;x<b;x+=40){rect(c,x,500,38,10,'#bd9870');rect(c,x+3,516,34,2,'#647781');rect(c,x+21,530,3,27,'#263745');rect(c,x,550,40,3,'#5a6470')}});
 staticPlatforms.forEach(b=>{rect(c,b.x,b.y,b.w,20,'#c6a376');rect(c,b.x+4,b.y+10,b.w-8,16,'#425262');for(let x=b.x+15;x<b.x+b.w;x+=31)rect(c,x,b.y+12,4,10,'#8595a4')});
 // telegraph machine panels
 for(let [x,label] of [[635,'STOP STOP'],[1990,'KILDE?'],[2970,'SKRIFTEN!']]){rect(c,x,332,168,39,'#644c49');rect(c,x+6,338,156,27,'#d1ae72');textDraw(c,label,x+84,356,'#4b3434',16,'center')}
 for(let i=0;i<7;i++){let x=165+i*525;rect(c,x,443,68,57,'#3f3c49');rect(c,x+7,451,54,27,'#798f87');rect(c,x+18,458,31,13,'#d9b875');rect(c,x+25,482,18,7,'#d29d60');}
 // end door
 rect(c,3500,375,98,125,'#b08a5b');rect(c,3511,390,75,110,'#374a5a');rect(c,3525,413,49,62,'#f0ca78');rect(c,3541,444,12,12,'#8c6a4c');textDraw(c,'1919',3548,369,'#f8e3b9',22,'center');
 // checkpoint flag signs
 [[1507,'1'],[2200,'2']].forEach(([x,num])=>{rect(c,x,392,5,108,'#e0c78c');rect(c,x+5,395,67,31,'#b66b59');textDraw(c,'SAVE '+num,x+10,414,'#ffebcc',12)});
 // collectibles
 coinPoints.forEach((o,i)=>{if(this.coins.has(i))return;let fy=o.y+Math.sin(this.frame*4+i)*5;rect(c,o.x-7,fy-10,14,20,'#e6ae43');rect(c,o.x-4,fy-8,8,16,'#ffe6a6');rect(c,o.x-1,fy-5,2,10,'#d58c36')});
 stampPoints.forEach((o,i)=>{if(this.stamps.has(i))return;let fy=o.y+Math.sin(this.frame*3+i)*6;rect(c,o.x-16,fy-21,32,31,'#ecbd66');rect(c,o.x-11,fy-16,22,21,'#f9e5ac');rect(c,o.x-10,fy-8,20,3,'#ac7745');textDraw(c,'✉',o.x,fy,'#7c5838',18,'center')});
 // electric enemies (cartoon censors)
 this.hazards.forEach(h=>{rect(c,h.x-18,469,36,31,'#a55e5a');rect(c,h.x-13,473,26,22,'#dc8d74');rect(c,h.x-9,478,6,7,'#f9e6a1');rect(c,h.x+5,478,6,7,'#f9e6a1');rect(c,h.x-8,489,18,3,'#432e3c');let sx=h.x+Math.sin(this.frame*13)*8;line(c,sx,462,sx+8,448,'#d9eaa1',3);line(c,sx+8,448,sx+13,459,'#f3e5a4',3);textDraw(c,'!',h.x,460,'#ffc3a3',18,'center')});
 // player shadow + pixel body (student)
 const p=this.p;if(!this.invincible||Math.floor(this.frame*13)%2===0){rect(c,p.x+2,p.y+p.h-5,p.w-4,6,'#152a32');rect(c,p.x+5,p.y+13,19,20,'#d9bb82');rect(c,p.x+3,p.y+17,23,23,'#496ea4');rect(c,p.x+4,p.y+33,9,9,'#2a3954');rect(c,p.x+17,p.y+33,9,9,'#2a3954');rect(c,p.x+4,p.y+38,10,5,'#e5ae63');rect(c,p.x+17,p.y+38,10,5,'#e5ae63');rect(c,p.x+6,p.y-3,17,18,'#dbb18e');rect(c,p.x+3,p.y-6,24,9,'#b84e4d');rect(c,p.x+1,p.y-1,18,5,'#d66d55');rect(c,p.x+20,p.y+5,4,3,'#1b2534');rect(c,p.x+2,p.y+20,5,14,'#cf9574');rect(c,p.x+24,p.y+21,5,12,'#c68d72')}
 c.restore();
 // HUD fixed on screen
 rect(c,0,0,1000,54,'#122433ed');rect(c,0,51,1000,3,'#c28a58');textDraw(c,'✉ TELEGRAMKAOS — JULI 1914',20,32,'#f4d18e',20);textDraw(c,`STEMPLER: ${this.stamps.size}/3`,614,30,'#d8eee3',18);textDraw(c,`FREMDRIFT ${Math.min(100,Math.round(this.p.x/(worldW-100)*100))}%`,817,30,'#d8eee3',16);
 if(this.p.x>3470&&this.stamps.size>=3){rect(c,250,72,480,45,'#17383bc9');textDraw(c,'PORTAL ÅBEN → LØB MOD UDGANGEN!',490,100,'#ffe3a0',19,'center')}
 if(this.paused&&!this.victory){rect(c,0,0,1000,560,'#07162040')}
 }
}
