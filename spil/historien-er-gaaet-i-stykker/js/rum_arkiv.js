'use strict';
/* =====================================================================
   rum_arkiv.js - niveau 1: Det britiske koloniarkiv (London ca. 1900)

   Tre opgaver som i originalen: find tre kilder i rummet, læg seks
   citater under det motiv, de dokumenterer (bevisvæggen), og svar på tre
   kildekritiske spørgsmål (arkivlåsen). Nyt: citaterne lægges først, og
   Indsend svar bedømmer dem alle på én gang. De rigtige bliver liggende,
   de forkerte kommer tilbage med rød kant.
   ===================================================================== */

/* ----- Opgave 1: arkivrummet ---------------------------------------- */
function renderArchive(){
 const n=state.found.length;
 scene.innerHTML=rumHTML(`<div class="room-wrap" id="roomWrap"><canvas id="archiveCanvas" width="1000" height="560" aria-label="Britisk arkiv med tre kilder, man kan klikke på"></canvas>${ARKIV_MAERKER.map(m=>`<button type="button" class="point ${state.found.includes(m.id)?'found':''}" style="left:${m.x}%;top:${m.y}%" data-src="${m.id}">${state.found.includes(m.id)?'✓ ':''}${m.navn}</button>`).join('')}<button type="button" class="point ${n<3?'locked':'open'}" style="left:52%;top:83%" id="vaultBtn">${n<3?'Arkivdør (låst)':'Arkivdør'}</button><div class="room-caption"><span>Det britiske imperium i 1800-tallet</span><span>Kilder i bevismappen: ${n} af 3</span></div></div>`,'rum-arkiv');
 passFast($('#roomWrap'),1000/560);drawArchive();
 $$('[data-src]').forEach(b=>b.onclick=()=>openSource(b.dataset.src));
 $('#vaultBtn').onclick=()=>{if(state.found.length<3){Kort.sigTil('Arkivdøren er låst. Find alle tre kilder først.','skidt');Kort.blink()}else goto('board')};
 if(n<3)Kort.vis({maerke:'Opgave 1 af 3',tekst:'Find tre historiske kilder i det britiske koloniarkiv. Undersøg afsendernes syn på imperialismen, og læg kilderne i din bevismappe. Kilderne ligger ved de gule mærker i rummet.',ingenSend:true,hints:['Se efter de tre gyldne markeringer i rummet: skrivebordet, verdenskortet og bogreolen. De fører til historiske dokumenter.'],status:()=>`Kilder i bevismappen: ${state.found.length} af 3.`});
 else Kort.slut('Opgave 1 af 3','Alle tre kilder ligger i bevismappen: Cromer, Dilke og Blunt. Arkivdøren er åben, og bevisvæggen venter.','Åbn bevisvæggen',()=>goto('board'));
}
function openSource(id){
 const x=sources[id];if(!x)return;const fundet=state.found.includes(id);
 openModal(`<div class="modal-header"><div><div class="source-meta">${esc(x.tag)}</div><h2 class="modal-title">${esc(x.name)}</h2></div><button type="button" class="iconbtn" data-luk aria-label="Luk dokumentet">×</button></div><div class="modal-body"><div class="source-meta">${esc(x.date)}</div><p>${esc(x.desc)}</p><div class="source-sheet">${x.quotes.map(q=>`<p>${esc(q)}</p>`).join('')}</div><div class="docnote"><strong>Undersøgelsesspørgsmål.</strong> ${esc(x.focus)}</div><div class="docbuttons"><span class="docsmall">Kildeuddrag fra undervisningsmaterialet</span><button type="button" class="primary" id="saveSource">${fundet?'Ligger i bevismappen':'Læg i bevismappen'}</button></div></div>`,id);
 $('#saveSource').onclick=()=>{if(!state.found.includes(id)){state.found.push(id);save();toast(`${x.name} er lagt i bevismappen.`)}closeModal();if(state.stage==='archive')renderArchive()};
}
/* Bevismappen kan altid åbnes igen fra arkivlåsen */
function openBevismappe(){openModal(`<div class="modal-header"><h2 class="modal-title">Bevismappen</h2><button type="button" class="iconbtn" data-luk aria-label="Luk">×</button></div><div class="modal-body">${Object.keys(sources).map(id=>`<div class="mappe-kilde"><b>${esc(sources[id].name)} · ${esc(sources[id].date)}</b>${sources[id].quotes.map(q=>`<p class="citat">»${esc(q)}«</p>`).join('')}</div>`).join('')}</div>`,'mappe')}

/* ----- Opgave 2: bevisvæggen ------------------------------------------- */
let boardSelected=null;
function boardTry(){if(!state.boardTry)state.boardTry={};return state.boardTry}
function boardZone(id){return state.placed[id]||boardTry()[id]||null}
function boardAntal(){return clues.filter(c=>boardZone(c.id)).length}
function renderBoard(){
 scene.innerHTML=rumHTML(`<div class="board"><div class="board-cols"><section class="evidence-panel"><h3 class="panel-title">Løse citater</h3><p class="panel-subtitle">Vælg et citat, og klik på et motiv. Du kan også trække citatet. Citaterne er forkortede.</p><div class="evidence-list" id="evidenceList"></div></section><section class="evidence-panel"><h3 class="panel-title">Arkivets tre motiver</h3><p class="panel-subtitle">En kilde kan belyse flere forskellige motiver.</p><div class="zones" id="zones"></div></section></div></div>`,'rum-board');
 tegnBoard();
 Kort.vis({maerke:'Opgave 2 af 3',tekst:'Bevisvæggen. Hvad drev imperialismen? Læg de seks citater under det motiv, de bedst dokumenterer.',
  klar:()=>boardAntal()===6,ikkeKlar:'Læg alle seks citater på væggen først.',
  status:()=>`Lagt på væggen: ${boardAntal()} af 6.`,
  hints:()=>{const c=clues.find(x=>!state.placed[x.id]);return c?`Undersøg ${c.who}-citatet »${c.text.slice(0,50)}…«. Hvad er kildens primære fokus: penge, kontrol eller legitimering?`:'Alle citater ligger rigtigt.'},
  bedoem:()=>{const t=boardTry();let fejl=0;state.boardFejl=[];for(const id of Object.keys(t)){const c=clues.find(x=>x.id===id);if(t[id]===c.answer)state.placed[id]=t[id];else{fejl++;state.boardFejl.push(id)}}state.boardTry={};const rigtige=Object.keys(state.placed).length;
   if(rigtige===6)return {ok:true,tekst:'Seks forbindelser er dokumenteret. Kilderne peger på både økonomiske, magtpolitiske og ideologiske motiver.'};
   return {ok:false,fejl,tekst:`${rigtige} af 6 citater ligger rigtigt. De citater, der har rød kant, er lagt tilbage. Kig på ordene, og prøv igen.`}},
  efterFejl:tegnBoard,efter:tegnBoard,
  videre:'Videre til arkivlåsen',naar:()=>goto('proof')});
}
function tegnBoard(){
 const fejl=state.boardFejl||[],laas=Object.keys(state.placed).length===6;
 const los=clues.filter(c=>!boardZone(c.id));
 $('#evidenceList').innerHTML=los.map(c=>`<button type="button" draggable="true" class="evidence ${boardSelected===c.id?'selected':''} ${fejl.includes(c.id)?'fejl':''}" data-clue="${c.id}"><small>${c.who}</small>${esc(c.text)}</button>`).join('')||'<p class="tom-tekst">Alle citater ligger på væggen.</p>';
 $('#zones').innerHTML=MOTIVER.map(z=>`<div role="button" tabindex="0" class="zone" data-zone="${z.id}"><h4>${z.label}</h4><p>${z.desc}</p><div class="placed">${clues.filter(c=>boardZone(c.id)===z.id).map(c=>`<button type="button" class="chip ${state.placed[c.id]?'laast':''}" data-tilbage="${c.id}" title="${state.placed[c.id]?'Ligger rigtigt':'Klik for at lægge citatet tilbage'}">${state.placed[c.id]?'✓ ':''}${c.who}: ${esc(c.text.slice(0,38))}…</button>`).join('')}</div></div>`).join('');
 $$('[data-clue]').forEach(el=>{el.onclick=()=>{if(Kort.laast())return Kort.blink();boardSelected=boardSelected===el.dataset.clue?null:el.dataset.clue;tegnBoard()};el.ondragstart=e=>{boardSelected=el.dataset.clue;e.dataTransfer.setData('text/plain',boardSelected);e.dataTransfer.effectAllowed='move'}});
 $$('[data-zone]').forEach(el=>{const laeg=id=>{if(Kort.laast())return Kort.blink();if(!id){Kort.sigTil('Vælg først et af citaterne til venstre.','skidt');return}assignClue(id,el.dataset.zone)};el.onclick=e=>{if(e.target.closest('[data-tilbage]'))return;laeg(boardSelected)};el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();laeg(boardSelected)}};el.ondragover=e=>{e.preventDefault();el.classList.add('dragover')};el.ondragleave=()=>el.classList.remove('dragover');el.ondrop=e=>{e.preventDefault();el.classList.remove('dragover');laeg(e.dataTransfer.getData('text/plain')||boardSelected)}});
 $$('[data-tilbage]').forEach(b=>b.onclick=e=>{e.stopPropagation();if(Kort.laast())return Kort.blink();const id=b.dataset.tilbage;if(state.placed[id])return;delete boardTry()[id];save();tegnBoard();Kort.opdater()});
}
function assignClue(id,zone){if(state.placed[id])return;boardTry()[id]=zone;state.boardFejl=(state.boardFejl||[]).filter(x=>x!==id);boardSelected=null;save();tone('ok');tegnBoard();Kort.opdater()}

/* ----- Opgave 3: arkivlåsen ------------------------------------------- */
function renderProof(){
 const q=questions[state.question];if(!q){goto('actionIntro');return}
 scene.innerHTML=rumHTML(`<div class="proof-scene"><div class="case-folder"><span>Fortrolig sag · 1900</span><strong>Det britiske imperium</strong><small>Sammenhold kilderne, før du udtaler dig.</small></div><div class="proof-side"><p>Du har samlet dokumenterne og organiseret beviserne. Arkivlåsen kræver nu tre kildekritiske vurderinger. Fagligt holdbare svar åbner døren.</p><div class="noegler">${questions.map((x,i)=>`<span class="noegle ${i<state.question?'done':i===state.question?'nu':''}">Arkivnøgle ${i+1}</span>`).join('')}</div><button type="button" class="secondary" id="reviewSources">Se kilderne igen</button></div></div>`,'rum-proof');
 $('#reviewSources').onclick=openBevismappe;
 Kort.vis({maerke:`Arkivnøgle ${state.question+1} af ${questions.length}`,tekst:esc(q.question),svar:q.choices,rigtig:q.correct,hvorfor:q.why,
  forkert:'Ikke helt. Prøv at skelne mellem kildens udsagn og det, vi kan konkludere på baggrund af den.',hints:[q.hint],
  efter:()=>{const n=$$('.noegle')[state.question];if(n){n.classList.remove('nu');n.classList.add('done')}},
  videre:state.question===questions.length-1?'Åbn arkivdøren':'Næste spørgsmål',
  naar:()=>{state.question++;save();if(state.question>=questions.length)goto('actionIntro');else renderProof()}});
}
