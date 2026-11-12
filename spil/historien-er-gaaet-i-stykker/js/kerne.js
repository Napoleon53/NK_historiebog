'use strict';
/* =====================================================================
   kerne.js - tilstand, gemning, toplinjen, beskeder og lyd

   Alle filer er almindelige scripts uden moduler, så de deler navnene
   her (state, save, goto, render, toast, tone, $ ...). Spilmotoren i
   bane.js og baner.js er kollegaens og bruger de samme navne som i
   originalen. Navnet "screen" er skiftet til "scene", fordi window.screen
   findes i forvejen.
   ===================================================================== */
const STORAGE='historiebog_historien_i_stykker_v1';
const SCORE_STORAGE='historiebog_historien_i_stykker_highscore_v1';
const SCORE_VERSION='HB-HGS-1';
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const scene=$('#scene');const modalRoot=$('#opslag');const toastRoot=$('#besked');
const STADIER=['archive','board','proof','actionIntro','action','commandIntro','command','paperIntro','paperAction','versailles','inflationIntro','inflationAction','weimar','clockIntro','clockAction','nazi','finalIntro','done'];
function nyTilstand(lyd){return {stage:'intro',found:[],placed:{},question:0,answered:false,wrong:0,hints:0,lostLives:0,time:0,startedAt:0,finishedAt:0,runId:'',runType:'practice',actionCheckpoint:0,actionStamps:[],actionCoins:[],actionBoss:false,actionBossHp:3,sound:!!lyd,command:null,full:{},extra:{},finalBoss:false}}
let state=nyTilstand(false);let toastTimer=null;let currentModal=null;let game=null;let raf=null;let lastTick=performance.now();let music=null;

function save(){try{const fields=['stage','found','placed','question','wrong','hints','lostLives','time','startedAt','finishedAt','runId','runType','actionCheckpoint','actionStamps','actionCoins','actionBoss','actionBossHp','command','full','extra','finalBoss','boardTry','boardFejl'];const payload={};for(const f of fields)payload[f]=state[f];localStorage.setItem(STORAGE,JSON.stringify(payload))}catch(e){}}
function load(){try{const val=JSON.parse(localStorage.getItem(STORAGE)||'null');return val&&STADIER.includes(val.stage)?val:null}catch(e){return null}}
function clearSaved(){try{localStorage.removeItem(STORAGE)}catch(e){}}
function reset(){stopGame();clearSaved();state=nyTilstand(state.sound);closeModal();renderIntro()}
function goto(s,autosave=true){stopGame();closeModal();state.stage=s;state.answered=false;if(autosave)save();render()}
function stopGame(){if(game){game.stop();game=null}}

/* ----- Tid og fejl (som i originalen: fejl = faglige fejl + hints + mistede liv) */
function elapsedSeconds(){if(state.startedAt){return Math.max(0,Math.floor(((state.finishedAt||Date.now())-state.startedAt)/1000))}return Math.max(0,Math.floor(state.time||0))}
function nowTimer(){let t=elapsedSeconds();return `${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`}
function totalMistakes(){return (state.wrong||0)+(state.hints||0)+(state.lostLives||0)}
function startRun(kind){state.runType=kind;state.runId='run-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,11);state.startedAt=Date.now();state.finishedAt=0;state.time=0;save()}
function erBane(){return state.stage==='action'||state.stage.endsWith('Action')}
function tick(){let now=performance.now(),dt=Math.min((now-lastTick)/1000,.08);lastTick=now;if(state.startedAt&&!state.finishedAt)state.time=elapsedSeconds();if(erBane()&&game)game.update(dt);opdaterTaeller();raf=requestAnimationFrame(tick)}
function opdaterTaeller(){const t=$('#tid'),f=$('#fejl'),vis=state.stage!=='intro';if(t){t.hidden=!vis;t.textContent='Tid '+nowTimer()}if(f){f.hidden=!vis;f.textContent='Fejl '+totalMistakes()}}

/* ----- Beskeder og lyd ------------------------------------------------ */
function toast(message,bad=false){toastRoot.innerHTML=`<div class="toast ${bad?'warn':''}" role="status"></div>`;toastRoot.firstChild.textContent=message;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastRoot.innerHTML='',3100);tone(bad?'bad':'ok')}
function tone(kind='ok'){if(!state.sound)return;try{const ctx=music||(music=new (window.AudioContext||window.webkitAudioContext)());const o=ctx.createOscillator(),g=ctx.createGain();o.type='square';let t=ctx.currentTime;o.frequency.setValueAtTime(kind==='bad'?175:kind==='stamp'?680:490,t);if(kind==='stamp')o.frequency.exponentialRampToValueAtTime(980,t+.15);else o.frequency.exponentialRampToValueAtTime(kind==='bad'?115:600,t+.12);g.gain.setValueAtTime(.027,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+.2)}catch(e){}}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

/* ----- Opslag (dokumenter, highscore) ---------------------------------- */
function openModal(html,id,cls){currentModal=id||'opslag';modalRoot.innerHTML=`<div class="modal-backdrop" id="modalBackdrop"><article class="${cls||'modal'}" role="dialog" aria-modal="true">${html}</article></div>`;$('#modalBackdrop').onclick=e=>{if(e.target.id==='modalBackdrop')closeModal()};$$('[data-luk]').forEach(b=>b.onclick=closeModal);const f=modalRoot.querySelector('[data-luk]');if(f)f.focus()}
function closeModal(){modalRoot.innerHTML='';currentModal=null}

/* ----- Toplinjen: de ti niveauer ---------------------------------------- */
function niveauNu(){if(state.stage==='action')return state.finalBoss?10:2;const n=NIVEAUER.find(v=>v.stadier.includes(state.stage));return n?n.nr:0}
function opdaterTop(){const nu=state.stage==='done'?11:niveauNu();$('#niveauer').innerHTML=state.stage==='intro'?'':NIVEAUER.map(v=>`<span class="niv ${v.nr===nu?'aktiv':v.nr<nu?'faerdig':''}" title="${v.nr}. ${esc(v.navn)}"><b>${v.nr}</b>${v.nr===nu?`<span class="niv-navn">${esc(v.navn)}</span>`:''}</span>`).join('');$('#menuknap').hidden=state.stage==='intro';opdaterTaeller()}

/* ----- Skift mellem skærmene ---------------------------------------- */
function render(){
 document.body.dataset.stadie=state.stage;
 const S=state.stage;
 if(S==='intro')renderIntro();
 else if(S==='archive')renderArchive();
 else if(S==='board')renderBoard();
 else if(S==='proof')renderProof();
 else if(S==='actionIntro')renderActionIntro();
 else if(S==='action')renderAction();
 else if(S==='commandIntro')renderCommandIntro();
 else if(S==='command')renderCommand();
 else if(S==='versailles')renderVersailles();
 else if(S==='weimar')renderWeimar();
 else if(S==='nazi')renderNazi();
 else if(['paperIntro','inflationIntro','clockIntro'].includes(S))renderExtraIntro();
 else if(['paperAction','inflationAction','clockAction'].includes(S))renderExtraAction();
 else if(S==='finalIntro')renderFinalIntro();
 else if(S==='done')renderDone();
 opdaterTop();
}
function finishRun(){if(!state.finishedAt){state.finishedAt=Date.now();state.time=elapsedSeconds();save()}goto('done')}

/* ----- Til rum med papirkort: kortet øverst, fladen under ---------------- */
function rumHTML(flade,cls){return `<div class="rum ${cls||''}"><div class="kortplads"><div class="scenekort" id="kort"></div></div><div class="flade" id="flade">${flade}</div></div>`}

/* Holder et element i et bestemt forhold mellem bredde og højde inde i sin forælder */
function passIn(el,forhold){if(!el||!el.parentElement)return;const p=el.parentElement,cs=getComputedStyle(p);const W=p.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),H=p.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);let w=W,h=w/forhold;if(h>H&&H>120){h=H;w=h*forhold}el.style.width=Math.floor(w)+'px';el.style.height=Math.floor(h)+'px'}
/* Forælderen følges med en ResizeObserver, så elementet passer igen, når
   kortet over det skifter højde (fx når et hint kommer frem) */
let passObs=null;function passFast(el,forhold){if(passObs)passObs.disconnect();passIn(el,forhold);if(window.ResizeObserver&&el&&el.parentElement){passObs=new ResizeObserver(()=>{if(document.body.contains(el))passIn(el,forhold)});passObs.observe(el.parentElement)}requestAnimationFrame(()=>passIn(el,forhold))}

/* ----- Rummenes egne tilstande (Versailles, Weimar, nazismen) ---------- */
function chapter(name){if(!state.full)state.full={};if(!state.full[name]){state.full[name]=name==='versailles'?{phase:0,talk:{},person:null,treaty:{},treatyTry:{},treatyFejl:[],debate:{}}:name==='weimar'?{phase:0,reform:{},chain:WCHAIN_START.slice(),chainDone:false,policy:{},policyTry:{},policyFejl:[],policySel:null}:{phase:0,program:{},programTry:{},programFejl:[],programSel:null,propaganda:{},euphemism:{},final:false}}return state.full[name]}
/* Kort, der fordeles og sendes ind samlet: de rigtige låses, de forkerte kommer tilbage */
function bedoemFordeling(laast,forsoeg,facit){const fejlIds=[];for(const id of Object.keys(forsoeg)){if(forsoeg[id]===facit(id))laast[id]=forsoeg[id];else fejlIds.push(id);delete forsoeg[id]}return {fejl:fejlIds.length,fejlIds,rigtige:Object.keys(laast).length}}
/* Overskriften i rummene med kilder: rummets navn og en lille linje under */
function rumHoved(titel,linje){return `<div class="full-head"><h2>${titel}</h2>${linje?`<p>${linje}</p>`:''}</div>`}
