'use strict';
/* =====================================================================
   kort.js - papirkortet øverst i midten af hvert rum

   Samme regler som i superanimationerne (papirkort.css og papirkort.js
   er kopier fra kemiformler.dk): svarknapperne vælger kun, Indsend svar
   sender ind og er grå, til der er noget at sende, et forkert svar giver
   en forklaring, og efter et rigtigt svar bliver kortet på spørgsmålet
   med forklaringen og en grøn knap, der fører videre.

   Kort.vis(opg) - opg kan have:
     maerke   indlejret overskrift, fx "Opgave 2 af 3"
     tekst    indledning og spørgsmål (HTML; sætningen med ? bliver halvfed)
     svar     svarknapper på kortet (tekster). Uden svar ligger svaret i scenen.
     flere    antal svar, der skal vælges (standard 1)
     rigtig   index (eller liste af index) for det rigtige svar
     klar     () => true, når svaret i scenen kan sendes
     sendTekst() => teksten på knappen, fx "Indsend svar: 512"
     bedoem   (valg) => {ok, tekst, fejl}. Uden bedoem sammenlignes med rigtig.
     forkert  besked ved forkert svar (tekst eller funktion af valget)
     hints    liste af hints (eller funktion, der giver ét hint)
     hvorfor  forklaringen efter et rigtigt svar (tekst eller funktion)
     videre   teksten på den grønne knap, naar: det, knappen gør
     status   () => neutral linje nederst, fx "Placeret: 4 af 6"
     efter    () => kaldes efter et rigtigt svar (scenen tegnes om)
     efterFejl() => kaldes efter et forkert svar
     ingenSend sand, når kortet kun er en opgave uden svar (fx find kilderne)
   Kort.slut(maerke, tekst, knap, naar): kortet uden spørgsmål, kun tekst
   og den grønne knap. Kort.laast(): sand, når kortet venter på Næste.
   ===================================================================== */
const Kort=(function(){
 let opg=null,valgt=[],loest=false,hintNr=0,besked=null;
 const el=()=>$('#kort');
 const BOGSTAV='ABCDEFGH';
 function tekstHTML(o){return `<p class="sk-tekst">${o.maerke?`<span class="sk-chip">${o.maerke}</span>`:''}${NK.Papir.tekst(o.tekst||'')}</p>`}
 function svarHTML(o){if(!o.svar)return '';const lang=o.svar.some(s=>s.length>46);return `<div class="sk-svar ${lang?'lang':'kort'}" role="group" aria-label="Svar">${o.svar.map((s,i)=>`<button type="button" class="sk-knap" data-svar="${i}"><span class="v-bogstav">${BOGSTAV[i]}</span><span class="v-tekst">${esc(s)}</span></button>`).join('')}</div>`}
 function klar(){if(!opg)return false;if(opg.svar)return valgt.length===(opg.flere||1);return opg.klar?!!opg.klar():true}
 function bundHTML(){
  if(loest)return '';
  let cls='tom',txt='';
  if(besked){cls=besked.cls;txt=(besked.maerke?`<span class="b-maerke">${besked.maerke}</span>`:'')+besked.tekst}
  else if(opg.status){const s=opg.status();if(s){cls='peger';txt=s}}
  const harHint=opg.hints&&(typeof opg.hints==='function'||opg.hints.length);
  const send=opg.sendTekst?opg.sendTekst():'Indsend svar';
  return `<div class="sk-bund ${cls}"><p class="st-tekst" aria-live="polite">${txt}</p>${harHint?'<button type="button" class="knap hjaelp" id="kortHint" title="Et hint tæller med i fejlscoren">Giv et hint (+1 fejl)</button>':''}${opg.ingenSend?'':`<button type="button" class="knap indsend ${klar()?'klar':'ikke-klar'}" id="kortSend">${esc(send)}</button>`}</div>`;
 }
 function tegn(){
  const k=el();if(!k||!opg)return;
  k.className='scenekort '+(loest?'loest':'opgave')+(opg.svar?' spm':'');
  if(opg.slut){k.innerHTML=`<div class="sk-slut">${tekstHTML(opg)}<button type="button" class="sk-videre" data-videre="1">${esc(opg.videre||'Videre')} &rarr;</button></div>`;bindVidere();return}
  k.innerHTML=tekstHTML(opg)+svarHTML(opg)+(loest?NK.Papir.bliv(loest.tekst,loest.maerke,esc(opg.videre||'Næste')+' &rarr;',false):bundHTML());
  if(opg.svar){$$('#kort [data-svar]').forEach(b=>{const i=+b.dataset.svar;if(valgt.includes(i))b.classList.add(loest?'rigtig':'valgt');if(loest&&!valgt.includes(i))b.classList.add('dim');if(loest)b.disabled=true;if(besked&&besked.forkerte&&besked.forkerte.includes(i)){b.classList.add('forkert');b.disabled=true}b.onclick=()=>vaelg(i)})}
  const s=$('#kortSend');if(s)s.onclick=send;
  const h=$('#kortHint');if(h)h.onclick=hint;
  bindVidere();
 }
 function bindVidere(){const v=el()&&el().querySelector('[data-videre]');if(v)v.onclick=()=>{const n=opg&&opg.naar;if(n)n()}}
 function vaelg(i){if(loest)return blink();const n=opg.flere||1;if(valgt.includes(i))valgt=valgt.filter(x=>x!==i);else{if(n===1)valgt=[i];else if(valgt.length<n)valgt.push(i);else return}if(besked&&besked.cls!=='hint'){const f=besked.forkerte;besked=null;if(f)besked={cls:'tom',tekst:'',forkerte:f}}tegn()}
 function send(){
  if(loest||!opg||opg.ingenSend)return;
  if(!klar()){besked={cls:'peger',tekst:opg.svar?((opg.flere||1)>1?`Vælg ${opg.flere} svar først.`:'Vælg et svar først.'):(opg.ikkeKlar||'Gør opgaven færdig først.'),forkerte:besked&&besked.forkerte};tegn();blink();return}
  let r;
  if(opg.bedoem)r=opg.bedoem(valgt.slice());
  else{const rig=[].concat(opg.rigtig);const ok=valgt.length===rig.length&&valgt.every(v=>rig.includes(v));r={ok,fejl:valgt.filter(v=>!rig.includes(v)).length||1}}
  if(r.ok){
   loest={maerke:'Rigtigt',tekst:r.tekst||(typeof opg.hvorfor==='function'?opg.hvorfor(valgt):opg.hvorfor)||''};besked=null;tone('stamp');save();
   if(opg.efter)opg.efter(valgt.slice());tegn();const v=el().querySelector('[data-videre]');if(v)v.focus({preventScroll:true});
  }else{
   state.wrong+=(r.fejl||1);save();tone('bad');
   const forkerte=opg.svar?(r.forkerte||valgt.filter(v=>![].concat(opg.rigtig).includes(v))).concat((besked&&besked.forkerte)||[]):null;
   const t=r.tekst||(typeof opg.forkert==='function'?opg.forkert(valgt):opg.forkert)||'Prøv igen.';
   valgt=[];besked={cls:'skidt',maerke:'Ikke endnu',tekst:t,forkerte};
   if(opg.efterFejl)opg.efterFejl();
   tegn();visFoersteFejl();const h=$('#kortHint');if(h)h.classList.add('peg');
  }
 }
 function hint(){
  if(loest)return;
  let t,nr,ialt;
  if(typeof opg.hints==='function'){t=opg.hints();state.hints++;nr=0}
  else{ialt=opg.hints.length;if(hintNr<ialt){hintNr++;state.hints++}nr=hintNr;t=opg.hints[nr-1]}
  save();
  besked={cls:'hint',maerke:ialt>1?`Hint ${nr} af ${ialt}`:'Hint',tekst:t,forkerte:besked&&besked.forkerte};tegn();
 }
 /* Den første røde ting i scenen rulles frem, så eleven kan se den */
 function visFoersteFejl(){const f=document.querySelector('#flade .fejl, #flade .incorrect');if(f&&f.scrollIntoView)f.scrollIntoView({block:'nearest',behavior:'smooth'})}
 function blink(){const k=el();if(!k)return;k.classList.remove('blink');void k.offsetWidth;k.classList.add('blink')}
 function vis(o){opg=o;valgt=[];loest=false;hintNr=0;besked=null;tegn()}
 function slut(maerke,tekst,knap,naar){opg={slut:true,maerke,tekst,videre:knap,naar};loest=true;valgt=[];besked=null;tegn()}
 function opdater(){if(opg&&!opg.slut){if(besked&&besked.cls==='skidt'&&opg.nulstilBesked!==false&&!opg.svar)besked=null;tegn()}}
 function nulstilBesked(){besked=null;if(opg)tegn()}
 function sigTil(tekst,cls){besked={cls:cls||'peger',tekst};tegn()}
 /* Tastatur: 1-9 vælger svar, Enter sender eller går videre */
 document.addEventListener('keydown',e=>{
  if(!opg||currentModal||erBane())return;
  const t=e.target,tag=t&&t.tagName;if(tag==='INPUT'||tag==='TEXTAREA')return;
  if(e.key>='1'&&e.key<='9'&&opg.svar&&!loest){const i=+e.key-1;if(i<opg.svar.length){e.preventDefault();vaelg(i)}}
  else if(e.key==='Enter'&&tag!=='BUTTON'){const v=el()&&el().querySelector('[data-videre]');if(v){e.preventDefault();v.click()}else if(!loest){e.preventDefault();send()}}
 });
 return {vis,slut,opdater,blink,laast:()=>!!loest,nulstilBesked,sigTil,get valgt(){return valgt.slice()}};
})();
