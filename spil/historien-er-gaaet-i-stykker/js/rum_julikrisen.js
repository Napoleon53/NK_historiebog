'use strict';
/* =====================================================================
   rum_julikrisen.js - niveau 3: Krigens kommandocentral, juli 1914

   Tre opgaver som i originalen: telegrammerne i rækkefølge, tre
   forbindelser på Europakortet og tre kildeuddrag, hvis punktnumre giver
   dørkoden. Nyt: landene på kortet vælges først og sendes med Indsend
   svar, og de tre sager tages i rækkefølge (originalen havde faner).
   ===================================================================== */
function commandDefault(){return {phase:0,order:JULY_START.slice(),routes:[],selected:[],intel:[],taskTab:0,line:null,lineWrong:[],code:''}}
function cmd(){if(!state.command||typeof state.command!=='object')state.command=commandDefault();return state.command}
function commandSteps(p){return `<div class="command-stepper">${['Telegrammer','Strategikort','Kilder og kode'].map((x,i)=>`<span class="${i===p?'active':i<p?'done':''}">${i<p?'✓ ':''}${i+1}. ${x}</span>`).join('')}</div>`}
function renderCommand(){const k=cmd();if(k.phase===0)renderTelegrams();else if(k.phase===1)renderMap();else if(k.phase===2)renderIntel();else renderCommandWin()}

/* ----- Opgave 1: telegrammerne ------------------------------------------ */
function renderTelegrams(){
 const k=cmd();
 scene.innerHTML=rumHTML(`<div class="command-scene">${commandSteps(0)}<div class="command-tele-row"><aside class="command-log"><small>Kildemappe</small><h3>Nødprotokol</h3><p>Kommandocentralens logbog har disse holdepunkter:</p><ul>${JULY_LOG.map(([d,t])=>`<li><b>${d}:</b> ${t}</li>`).join('')}</ul><p>Hvor skal det serbiske svar placeres? Læg mærke til ultimatummets <b>48 timer</b>.</p><small>Protokollen blander materiale fra forløbets kilder med historisk kontekst.</small></aside><div class="command-telegram-area" id="commandCards"></div></div></div>`,'rum-command');
 tegnTelegrams(false);
 Kort.vis({maerke:'Opgave 1 af 3',tekst:'Telegrafapparatet har byttet telegrammerne fra juli 1914 rundt. Flyt dem med pilene, eller træk dem, så hver begivenhed står ved den rigtige dato.',
  sendTekst:()=>'Indsend kronologien',
  bedoem:()=>{const n=JULY_ORDER.filter((id,i)=>id===k.order[i]).length;return n===7?{ok:true,tekst:'Telegrafen virker igen. Krisens tidslinje er på plads.'}:{ok:false,tekst:`${n} af 7 telegrammer ligger rigtigt. Du skal have hele krisens tidslinje på plads.`}},
  hints:['Læg først attentatet, ultimatummet og krigserklæringen på plads. Svaret fra Serbien må være kommet mellem den 23. og den 28. juli.'],
  efter:()=>tegnTelegrams(true),
  videre:'Videre til strategikortet',naar:()=>{k.phase=1;save();renderCommand()}});
}
function tegnTelegrams(laast){
 const k=cmd();
 $('#commandCards').innerHTML=k.order.map((id,i)=>`<div class="command-telegram ${laast?'ok':''}" data-telegram="${id}" draggable="${laast?'false':'true'}"><div class="time-slot">${JULY_DATES[i]}</div><div><b>${JULY_CARDS[id].title}</b><small>${JULY_CARDS[id].desc}</small></div><div class="command-telegram-buttons"><button type="button" class="command-mini-btn" data-shift="${i}" data-dir="-1" ${i===0||laast?'disabled':''} aria-label="Flyt telegrammet op">↑</button><button type="button" class="command-mini-btn" data-shift="${i}" data-dir="1" ${i===6||laast?'disabled':''} aria-label="Flyt telegrammet ned">↓</button></div></div>`).join('');
 if(laast){$$('[data-telegram]').forEach(el=>el.onclick=()=>Kort.blink());return}
 const flyt=()=>{save();tegnTelegrams(false);Kort.opdater()};
 $$('[data-shift]').forEach(btn=>btn.onclick=()=>{const i=+btn.dataset.shift,j=i+(+btn.dataset.dir);[k.order[i],k.order[j]]=[k.order[j],k.order[i]];flyt();const b=document.querySelector(`[data-shift="${j}"][data-dir="${btn.dataset.dir}"]`)||document.querySelector(`[data-shift="${j}"]`);if(b&&!b.disabled)b.focus()});
 let dragging=null;
 $$('[data-telegram]').forEach(el=>{el.ondragstart=e=>{dragging=el.dataset.telegram;e.dataTransfer.setData('text/plain',dragging);el.classList.add('dragging')};el.ondragend=()=>el.classList.remove('dragging');el.ondragover=e=>e.preventDefault();el.ondrop=e=>{e.preventDefault();const src=e.dataTransfer.getData('text/plain')||dragging,dst=el.dataset.telegram;const a=k.order.indexOf(src),b=k.order.indexOf(dst);if(a<0||b<0||a===b)return;k.order.splice(a,1);k.order.splice(b,0,src);flyt()}});
}

/* ----- Opgave 2: strategikortet ---------------------------------------- */
function svgMap(k){
 const svg=`<svg viewBox="0 0 680 495" role="img" aria-label="Skematisk Europakort med lande, der kan vælges"><rect class="water" width="680" height="495"/><g>${Array.from({length:9},(_,i)=>`<path class="gridline" d="M ${i*85} 0 V 495"/>`).join('')}${Array.from({length:7},(_,i)=>`<path class="gridline" d="M 0 ${i*80} H 680"/>`).join('')}</g><path class="region" d="M0 58 L55 20 134 39 185 5 275 28 325 6 428 28 480 12 605 30 680 52 680 465 615 474 586 435 555 444 531 380 478 384 446 445 391 395 365 340 325 348 302 400 260 373 208 330 175 289 221 247 253 197 312 176 332 131 288 100 196 130 133 90 54 117 0 109 Z"/><path class="region" d="M111 146 L143 96 168 98 178 143 171 207 142 250 109 223Z"/><path class="region" d="M76 172 L105 144 115 215 96 254 76 229Z"/><path class="region" d="M376 354 L414 372 418 425 444 454 434 472 406 436 398 404Z"/><path class="region" d="M285 67 L322 28 366 51 351 83Z"/><text x="16" y="31" class="map-title">Europa 1914 · skematisk kort</text><text x="460" y="470" class="map-note">Grænserne er ikke målfaste</text>`;
 const routes=k.routes.map(idx=>{const t=MAP_TASKS[idx],a=MAP_NODES[t.a],b=MAP_NODES[t.b];return `<line class="route" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${t.color}"/>`}).join('');
 const pins=Object.entries(MAP_NODES).map(([id,n])=>`<g role="button" tabindex="0" aria-label="${n.name}" data-country="${id}" class="map-pin ${k.selected.includes(id)?'selected':''} ${k.routes.some(idx=>[MAP_TASKS[idx].a,MAP_TASKS[idx].b].includes(id))?'done':''}"><circle cx="${n.x}" cy="${n.y}" r="25"/><text x="${n.x}" y="${n.y+4}">${n.t}</text></g>`).join('');
 return svg+routes+pins+'</svg>';
}
function renderMap(){
 const k=cmd(),step=Math.min(2,k.routes.length),task=MAP_TASKS[step];
 scene.innerHTML=rumHTML(`<div class="command-scene">${commandSteps(1)}<div class="command-map-layout"><div class="command-map" id="kortet"></div><aside class="command-orders"><div class="command-order mork"><span class="order-n">Bekræftede forbindelser</span><div id="ruter"></div></div><div class="command-bulb"><b>Diplomatisk note.</b> ${MAP_NOTE}</div><p class="legend">Landekoder: GB Storbritannien · FR Frankrig · TY Tyskland · ØU Østrig-Ungarn · RU Rusland · SE Serbien · BE Belgien · IT Italien</p></aside></div></div>`,'rum-map');
 tegnMap();
 if(k.routes.length>=3){Kort.slut('Ordre 3 af 3','Strategikortet viser nu de tre nødvendige forbindelser. Nu kan du undersøge aktørernes egne dokumenter.','Åbn de hemmelige sagsmapper',()=>{k.phase=2;save();renderCommand()});return}
 const navne=()=>k.selected.map(id=>MAP_NODES[id].name).join(' og ');
 Kort.vis({maerke:`Ordre ${step+1} af 3`,tekst:`${task.head}. ${task.ask} Klik på de to lande på Europakortet. Skeln mellem alliancer og konkrete politiske beslutninger.`,
  klar:()=>k.selected.length===2,ikkeKlar:'Vælg to lande på kortet først.',
  sendTekst:()=>k.selected.length===2?'Indsend svar: '+navne():'Indsend svar',
  status:()=>k.selected.length===1?`Valgt: ${navne()}. Vælg ét land mere.`:'',
  bedoem:()=>{if(k.selected.includes(task.a)&&k.selected.includes(task.b)){k.routes.push(step);k.selected=[];return {ok:true,tekst:task.ok}}k.selected=[];return {ok:false,tekst:'De to lande passer ikke til denne ordre. Læs opgaven, og vælg en anden forbindelse.'}},
  efter:tegnMap,efterFejl:tegnMap,hints:[task.tip],
  videre:k.routes.length>=2&&step===2?'Åbn de hemmelige sagsmapper':'Næste ordre',
  naar:()=>{if(k.routes.length>=3){k.phase=2;save();renderCommand()}else renderMap()}});
}
function tegnMap(){
 const k=cmd();$('#kortet').innerHTML=svgMap(k);
 $('#ruter').innerHTML=k.routes.map(i=>`<p>✓ ${MAP_TASKS[i].ok}</p>`).join('')||'<p class="svag">Ingen forbindelser er bekræftet endnu.</p>';
 $$('[data-country]').forEach(el=>{const go=()=>{if(Kort.laast())return Kort.blink();const id=el.dataset.country;if(k.selected.includes(id))k.selected=k.selected.filter(c=>c!==id);else{k.selected.push(id);if(k.selected.length>2)k.selected.shift()}save();tegnMap();Kort.opdater();const ny=document.querySelector(`[data-country="${id}"]`);if(ny)ny.focus()};el.addEventListener('click',go);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();go()}})});
}

/* ----- Opgave 3: kilderne og dørkoden ---------------------------------- */
function renderIntel(){
 const k=cmd(),tab=Math.min(3,k.taskTab||0),kode=tab>=3,m=INTEL_TASKS[Math.min(2,tab)];
 scene.innerHTML=rumHTML(`<div class="command-scene">${commandSteps(2)}<div class="command-intel-layout"><div class="command-files"><div class="command-file-tabs">${INTEL_TASKS.map((x,i)=>`<span class="fane ${i===tab?'active':''} ${k.intel.includes(i)?'done':''}">${k.intel.includes(i)?'✓ ':''}${x.fane}</span>`).join('')}</div>${kode?'<p class="svag">Alle tre sager er løst. Cifrene står på låsen.</p>':`<h3>${m.title}</h3><div class="source-date">${m.from}</div><div class="command-file-text" id="linjer"></div><p class="docsmall">Uddrag fra de kilder, I har arbejdet med i forløbet. Enkelte passager er forkortet.</p>`}</div><aside class="command-dialbox"><small>Tidsmaskinens sikkerhedslås</small><h3>De tre cifre</h3><p>Find det relevante punkt i hver sag. Punktets nummer låser ét ciffer op. Rækkefølgen er bestemt: Serbien, Frankrig, Belgien.</p><div class="command-stamps">${INTEL_TASKS.map((t,i)=>`<div class="command-stamp ${k.intel.includes(i)?'done':''}">${k.intel.includes(i)?t.digit:'?'}<small>${t.land}</small></div>`).join('')}</div><div class="command-keypad"><label for="intelCode">Kode</label><input id="intelCode" inputmode="numeric" pattern="[0-9]*" maxlength="3" value="${esc(k.code||'')}" placeholder="???" aria-label="Dørkode på tre cifre" ${kode?'':'disabled'}></div></aside></div></div>`,'rum-intel');
 if(!kode){
  tegnLinjer();
  Kort.vis({maerke:`Sag ${tab+1} af 3`,tekst:`${m.from}. ${m.task} Klik på formuleringen i kilden.`,
   klar:()=>k.line!==null&&k.line!==undefined,ikkeKlar:'Klik på en formulering i kilden først.',
   sendTekst:()=>k.line!==null&&k.line!==undefined?`Indsend svar: punkt ${m.items[k.line].num}`:'Indsend svar',
   bedoem:()=>{const it=m.items[k.line];if(it.num===m.digit){if(!k.intel.includes(tab))k.intel.push(tab);return {ok:true,tekst:m.why}}k.lineWrong.push(k.line);k.line=null;return {ok:false,tekst:'Denne formulering dokumenterer noget andet. Find den konkrete interesse, opgaven spørger efter.'}},
   efter:()=>{tegnLinjer(true);const s=$$('.command-stamp')[tab];if(s){s.classList.add('done');s.firstChild.textContent=m.digit}},efterFejl:()=>tegnLinjer(),
   hints:[m.hint],videre:tab===2?'Til låsen':'Næste sag',naar:()=>{k.taskTab=tab+1;k.line=null;k.lineWrong=[];save();renderIntel()}});
 }else{
  const input=$('#intelCode');input.focus();
  input.oninput=e=>{k.code=e.target.value.replace(/\D/g,'').slice(0,3);e.target.value=k.code;save();Kort.opdater()};
  input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();const b=$('#kortSend');if(b)b.click()}};
  Kort.vis({maerke:'Sidste opgave',tekst:'Tidsmaskinens sikkerhedslås kræver en kode på tre cifre: punktnumrene fra sagerne om Serbien, Frankrig og Belgien i den rækkefølge. Hvad er koden?',
   klar:()=>(k.code||'').length===3,ikkeKlar:'Skriv tre cifre i feltet Kode.',sendTekst:()=>(k.code||'').length===3?'Indsend kode: '+k.code:'Indsend kode',
   bedoem:()=>k.code===INTEL_TASKS.map(x=>x.digit).join('')?{ok:true,tekst:'Låsen er åben. Punkt 5 i ultimatummet og punkt 1 og 2 i septemberprogrammet giver koden 512.'}:{ok:false,tekst:'Koden passer ikke til punktnumrene. Kontrollér rækkefølgen Serbien, Frankrig, Belgien.'},
   efter:()=>{input.disabled=true},videre:'Åbn den hemmelige dør',naar:()=>{k.phase=3;save();renderCommand()}});
 }
}
function tegnLinjer(laast){
 const k=cmd(),m=INTEL_TASKS[Math.min(2,k.taskTab||0)];
 $('#linjer').innerHTML=m.items.map((it,i)=>`<button type="button" class="command-sentence ${laast&&it.num===m.digit?'correct':''} ${!laast&&k.line===i?'sel':''} ${k.lineWrong.includes(i)?'incorrect':''}" data-line="${i}" ${k.lineWrong.includes(i)?'disabled':''}><b>Punkt ${it.num}.</b> ${esc(it.text)}</button>`).join('');
 $$('[data-line]').forEach(b=>b.onclick=()=>{if(Kort.laast())return Kort.blink();k.line=+b.dataset.line;save();tegnLinjer();Kort.nulstilBesked()});
}
