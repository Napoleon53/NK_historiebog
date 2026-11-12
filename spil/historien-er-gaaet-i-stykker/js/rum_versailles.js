'use strict';
/* =====================================================================
   rum_versailles.js - niveau 5: Versailles 1919

   Tre opgaver som i originalen: tre politikeres positioner (Clemenceau,
   Brockdorff-Rantzau og Wilson), seks artikler fra traktaten sorteret
   efter funktion, og tre påstande om freden, der skal underbygges.
   Nyt: artiklerne sendes ind samlet, og påstandene tages én ad gangen.
   ===================================================================== */
function renderVersailles(){const v=chapter('versailles');if(v.phase===0)return versaillesTalk();if(v.phase===1)return versaillesTreaty();if(v.phase===2)return versaillesDebate();fullSuccess(3,'Versailles','Fredsarkivet er åbent','inflationIntro')}

/* ----- Opgave 1: fredssalen ------------------------------------------- */
function versaillesTalk(){
 const v=chapter('versailles'),n=Object.keys(v.talk).length;
 scene.innerHTML=rumHTML(`<div class="full-stage">${rumHoved('Versailles 1919: den diplomatiske sal')}<div class="mapstrip"><b>Fredssalen · Paris 1919</b><span>Afklarede positioner: ${n} af 3</span></div><div class="full-grid third">${VPEOPLE.map(p=>`<button type="button" class="diplomat ${v.talk[p.id]?'solved':''} ${v.person===p.id?'valgt':''}" data-person="${p.id}"><span class="portrait">${p.kort}</span><span class="d-navn">${p.name}</span><span class="d-rolle">${p.role}</span><span class="d-status">${v.talk[p.id]?'✓ Undersøgt':'Læs kilden'}</span></button>`).join('')}</div><div id="vKilde"></div><div class="historical-note">»Der bliver ingen mundtlig forhandling.« Clemenceaus tale ved traktatens forelæggelse, 7. maj 1919.</div><p class="fodnote">Her rekonstruerer du historiske positioner. Du forhandler ikke på Tysklands vegne.</p></div>`,'rum-versailles');
 $$('[data-person]').forEach(b=>b.onclick=()=>{if(Kort.laast())return Kort.blink();const id=b.dataset.person;if(v.talk[id]){Kort.sigTil(`${VPEOPLE.find(p=>p.id===id).name}s position er allerede undersøgt. Vælg en af de andre.`);return}v.person=id;save();versaillesTalk()});
 const p=VPEOPLE.find(x=>x.id===v.person&&!v.talk[x.id]);
 if(!p){
  if(n===3)return Kort.slut('Opgave 1 af 3','Alle tre positioner er afklaret: fransk sikkerhed og erstatning, tysk afvisning af eneansvar og Wilsons principper for en varig fred.','Åbn Versaillestraktaten',()=>{v.phase=1;save();renderVersailles()});
  return Kort.vis({maerke:'Opgave 1 af 3',tekst:'Undersøg de modstridende interesser ved fredsslutningen i 1919. Vælg en af de tre politikere, og læs kildeuddraget.',ingenSend:true,hints:[VHINT_TALK]});
 }
 $('#vKilde').innerHTML=`<div class="source-card"><b>${esc(p.name)} · ${esc(p.role)}</b><p class="kontekst">${esc(p.context)}</p><p class="citat">${esc(p.excerpt)}</p></div>`;
 const rest=3-n-1;
 Kort.vis({maerke:p.name,tekst:esc(p.prompt)+' Brug kilden frem for at gætte.',svar:p.choices,rigtig:p.correct,
  hvorfor:'Dokumenteret. Positionen er lagt i din forhandlingsmappe.',forkert:'Dette argument stemmer ikke med kilden. Hvad hævder afsenderen faktisk?',hints:[VHINT_TALK],
  efter:()=>{v.talk[p.id]=true;save();const b=document.querySelector(`[data-person="${p.id}"]`);if(b){b.classList.add('solved');b.querySelector('.d-status').textContent='✓ Undersøgt'}},
  videre:rest>0?'Vælg den næste politiker':'Åbn Versaillestraktaten',naar:()=>{v.person=null;if(Object.keys(v.talk).length>=3)v.phase=1;save();renderVersailles()}});
}

/* ----- Opgave 2: traktaten -------------------------------------------- */
function versaillesTreaty(){
 const v=chapter('versailles');
 scene.innerHTML=rumHTML(`<div class="full-stage">${rumHoved('Versaillestraktaten, 28. juni 1919')}<div class="treaty" id="traktat"></div><p class="fodnote">Originale artikler fra Versaillestraktaten. Kategoriseringen fremhæver deres vigtigste funktion.</p></div>`,'rum-treaty');
 const antal=()=>VCLAUSES.filter(c=>v.treaty[c.id]||v.treatyTry[c.id]).length;
 tegnTreaty();
 Kort.vis({maerke:'Opgave 2 af 3',tekst:'Sortér de seks artikler efter deres vigtigste funktion: nedrustning, sikkerhed eller erstatning og ansvar.',
  klar:()=>antal()===6,ikkeKlar:'Vælg en funktion ved alle seks artikler først.',status:()=>`Sorteret: ${antal()} af 6.`,
  bedoem:()=>{const r=bedoemFordeling(v.treaty,v.treatyTry,id=>VCLAUSES.find(c=>c.id===id).answer);v.treatyFejl=r.fejlIds;return r.rigtige===6?{ok:true,tekst:'Alle seks artikler er sorteret. Artikel 160 og 191 nedruster, 42 og 428 skal give sikkerhed, og 231 og 232 handler om ansvar og erstatning.'}:{ok:false,fejl:r.fejl,tekst:`${r.rigtige} af 6 artikler er sorteret rigtigt. Undersøg formålet ved de røde: militær styrke, sikkerhed eller ansvar og erstatning?`}},
  efter:tegnTreaty,efterFejl:tegnTreaty,hints:['Artikel 160 og 191: nedrustning. 42 og 428: sikkerhed. 231 og 232: ansvar og erstatning.'],
  videre:'Rekonstruér fredens konsekvenser',naar:()=>{v.phase=2;save();renderVersailles()}});
}
function tegnTreaty(){
 const v=chapter('versailles');
 $('#traktat').innerHTML=`<div class="treaty-row hoved"><div>Artikel</div>${VKATEGORIER.map(([,t])=>`<div>${t}</div>`).join('')}</div>`+VCLAUSES.map(c=>{const l=v.treaty[c.id],t=v.treatyTry[c.id],f=v.treatyFejl.includes(c.id);return `<div class="treaty-row ${l?'laast':''} ${f?'fejl':''}"><div class="source-mini"><b>${c.art}</b> ${esc(c.text)}${l?`<span class="hvorfor">${esc(c.why)}</span>`:''}</div>${VKATEGORIER.map(([k,txt])=>`<button type="button" class="choice-token ${l===k?'checked':''} ${t===k?'active':''}" data-treaty="${c.id}" data-val="${k}" ${l?'disabled':''}>${l===k?'✓ ':''}${txt}</button>`).join('')}</div>`}).join('');
 $$('[data-treaty]').forEach(b=>b.onclick=()=>{if(Kort.laast())return Kort.blink();const id=b.dataset.treaty;v.treatyTry[id]=b.dataset.val;v.treatyFejl=v.treatyFejl.filter(x=>x!==id);save();tegnTreaty();Kort.opdater()});
}

/* ----- Opgave 3: fredsdommen ------------------------------------------- */
function versaillesDebate(){
 const v=chapter('versailles'),i=VDEBATE.findIndex(q=>v.debate[q.id]===undefined),n=Object.keys(v.debate).length;
 scene.innerHTML=rumHTML(`<div class="full-stage">${rumHoved('Versailles: fredsdommen','Du skal ikke vælge, om freden var »god« eller »ond«. Du skal underbygge tre historiske udsagn med præcis dokumentation.')}<div class="full-grid third">${VDEBATE.map((q,j)=>`<div class="full-card ${v.debate[q.id]!==undefined?'solved':''} ${j===i?'fokus':''}" data-claim="${q.id}"><small>Påstand ${j+1}</small><h3>${esc(q.claim)}</h3>${v.debate[q.id]!==undefined?`<p class="belaeg">✓ ${esc(q.picks[q.answer])}</p>`:''}</div>`).join('')}</div><div class="full-card konklusion"><h3>Historikerens konklusion</h3><p>En god historisk vurdering skal forholde sig til både samtidens sikkerhedsinteresser, Tysklands reaktion og krigens mere sammensatte årsagsbillede.</p><p class="vtaeller">Dokumenterede argumenter: <b id="vTael">${n} af 3</b></p></div><p class="fodnote">Kilder: Clemenceau, Brockdorff-Rantzau og traktaten. Du bliver belønnet for belæg, ikke for en bestemt politisk holdning.</p></div>`,'rum-debate');
 if(i<0)return Kort.slut('Opgave 3 af 3','Alle tre påstande er underbygget med belæg.','Sikr tidsbrik 3',()=>{v.phase=3;save();renderVersailles()});
 const q=VDEBATE[i];
 Kort.vis({maerke:`Påstand ${i+1} af 3`,tekst:`»${esc(q.claim)}« Hvilket belæg underbygger påstanden bedst?`,svar:q.picks,rigtig:q.answer,hvorfor:q.why,
  forkert:'Argumentet dokumenterer ikke påstanden. Se igen på kilderne.',hints:['Find ét belæg for fransk sikkerhed, ét for oplevelsen af uretfærdighed og ét for kompleksiteten i krigsårsagerne.'],
  efter:()=>{v.debate[q.id]=q.answer;save();const c=document.querySelector(`[data-claim="${q.id}"]`);if(c){c.classList.add('solved');c.insertAdjacentHTML('beforeend',`<p class="belaeg">✓ ${esc(q.picks[q.answer])}</p>`)}$('#vTael').textContent=`${n+1} af 3`},
  videre:i===VDEBATE.length-1?'Sikr tidsbrik 3':'Næste påstand',naar:()=>{if(Object.keys(v.debate).length>=3){v.phase=3;save()}renderVersailles()}});
}
