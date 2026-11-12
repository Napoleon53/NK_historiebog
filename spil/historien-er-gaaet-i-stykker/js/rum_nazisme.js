'use strict';
/* =====================================================================
   rum_nazisme.js - niveau 9: Det hemmelige rigsarkiv

   Alvorligt og uden humor, som kollegaen bad om. Fire opgaver som i
   originalen: NSDAP's partiprogram (1920), to propagandabilleder fra en
   nazistisk børnebog, tre omskrivninger i Wannseeprotokollen (1942) og
   en kildekritisk konklusion. Nyt: forbindelserne i partiprogrammet
   sendes ind samlet, og iagttagelser og omskrivninger tages én ad gangen.
   ===================================================================== */
function renderNazi(){const n=chapter('nazi');if(n.phase===0)return naziProgram();if(n.phase===1)return naziPropaganda();if(n.phase===2)return naziWannsee();if(n.phase===3)return naziInterpret();fullSuccess(5,'Nazismen og Holocaust','Arkivundersøgelsen er afsluttet','finalIntro')}
const NADVARSEL='<div class="context-warning"><b>Kildekritisk arkiv.</b> Dokumenterne indeholder nazistisk propaganda og beskrivelser af forfølgelse. Materialet undersøges som historiske kilder, ikke som holdninger, spillet støtter.</div>';
function orderedNFunctions(n){
 const ids=NFUNCTIONS.map(p=>p[0]);
 const valid=Array.isArray(n.functionOrder)&&n.functionOrder.length===ids.length&&new Set(n.functionOrder).size===ids.length&&n.functionOrder.every(id=>ids.includes(id));
 if(!valid){const arr=[...ids];for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}if(arr.every((id,i)=>id===ids[i]))[arr[0],arr[1]]=[arr[1],arr[0]];n.functionOrder=arr;save()}
 return n.functionOrder.map(id=>NFUNCTIONS.find(p=>p[0]===id));
}

/* ----- Opgave 1: partiprogrammet --------------------------------------- */
function naziProgram(){
 const n=chapter('nazi');
 scene.innerHTML=rumHTML(`<div class="full-stage alvor">${rumHoved('Det hemmelige rigsarkiv: partiprogrammet')}${NADVARSEL}<div class="full-grid"><div class="full-card"><h3>Partiprogram 1920, uddrag</h3><div id="nPunkter"></div></div><div class="full-card"><h3>Ideologiske funktioner</h3><div id="nFunk"></div></div></div><p class="fodnote">Original kilde: Nazistpartiets program, 24. februar 1920. De enkelte punkter kan have flere funktioner. Vælg den mest direkte.</p></div>`,'rum-program');
 const antal=()=>NPROGRAM.filter(p=>n.program[p.id]||n.programTry[p.id]).length;
 tegnProgram();
 Kort.vis({maerke:'Opgave 1 af 4',tekst:'Undersøg konkrete punkter fra NSDAP’s partiprogram fra 1920. Vælg et punkt, og klik på dets politiske funktion. Find både antidemokratiske og socialpolitiske elementer.',
  klar:()=>antal()===5,ikkeKlar:'Giv alle fem punkter en funktion først.',status:()=>`Forbundet: ${antal()} af 5.`,
  bedoem:()=>{const r=bedoemFordeling(n.program,n.programTry,id=>NPROGRAM.find(p=>p.id===id).a);n.programFejl=r.fejlIds;return r.rigtige===5?{ok:true,tekst:'Alle fem punkter er forbundet med deres mest direkte funktion. Programmet rummer både antidemokratiske og socialpolitiske elementer.'}:{ok:false,fejl:r.fejl,tekst:`${r.rigtige} af 5 forbindelser er rigtige. Punkterne med rød kant har en anden vigtigste funktion. Læs ordlyden igen.`}},
  efter:tegnProgram,efterFejl:tegnProgram,hints:['Se efter ordene »folkefælle«, »aviser« og »centralmagt« og efter de sociale løfter.'],
  videre:'Undersøg propagandaen',naar:()=>{n.phase=1;save();renderNazi()}});
}
function tegnProgram(){
 const n=chapter('nazi'),navn=id=>(NFUNCTIONS.find(f=>f[0]===id)||['',''])[1];
 $('#nPunkter').innerHTML=NPROGRAM.map(p=>{const l=n.program[p.id],t=n.programTry[p.id];return `<button type="button" class="choice-token blok ${n.programSel===p.id?'active':''} ${l?'checked':''} ${n.programFejl.includes(p.id)?'fejl':''}" data-nprog="${p.id}" ${l?'disabled':''}>${esc(p.text)}${l||t?`<span class="parret">${l?'✓ ':'→ '}${esc(navn(l||t))}</span>`:''}</button>`}).join('');
 $('#nFunk').innerHTML=orderedNFunctions(n).map(([id,txt])=>`<button type="button" class="choice-token blok" data-ncat="${id}">${txt}</button>`).join('');
 $$('[data-nprog]').forEach(b=>b.onclick=()=>{if(Kort.laast())return Kort.blink();n.programSel=b.dataset.nprog;tegnProgram()});
 $$('[data-ncat]').forEach(b=>b.onclick=()=>{if(Kort.laast())return Kort.blink();if(!n.programSel){Kort.sigTil('Vælg først et punkt fra partiprogrammet.','skidt');return}n.programTry[n.programSel]=b.dataset.ncat;n.programFejl=n.programFejl.filter(x=>x!==n.programSel);const naeste=NPROGRAM.find(p=>!n.program[p.id]&&!n.programTry[p.id]);n.programSel=naeste?naeste.id:null;save();tone('ok');tegnProgram();Kort.opdater()});
}

/* ----- Opgave 2: propagandaen ----------------------------------------- */
function naziPropaganda(){
 const n=chapter('nazi'),i=NPROP.findIndex(x=>!n.propaganda[x.id]);
 if(i<0){n.phase=2;save();return renderNazi()}
 const x=NPROP[i],rigtig=NPROP_SVAR.findIndex(s=>s[0]===x.a);
 scene.innerHTML=rumHTML(`<div class="full-stage alvor">${rumHoved('Propaganda under lup')}<div class="context-warning">Begge billeder er <b>antisemitisk propaganda fra nazitiden</b>. Fremstillingerne er falske, racistiske stereotyper, som analyseres kritisk.</div><div class="propaganda-compare"><figure id="figA"><div class="historical-image"><img src="billeder/propaganda-tyskeren.jpg" alt="Historisk nazistisk propaganda: en idealiseret tegning af en tysk arbejder"></div><figcaption>Kildebillede A · »Tyskeren« · propagandistisk idealisering</figcaption></figure><figure id="figB"><div class="historical-image"><img src="billeder/propaganda-joeden.jpg" alt="Historisk antisemitisk propaganda: en karikatur af en jøde"></div><figcaption>Kildebillede B · »Jøden« · antisemitisk karikatur</figcaption></figure></div><p class="fodnote">Kilden bruges til at undersøge propagandaens virkemidler og dehumanisering.</p></div>`,'rum-propaganda');
 const fremhaev=()=>{if(x.a!=='image3')$('#figA').classList.add('ramt');if(x.a!=='image2')$('#figB').classList.add('ramt')};
 Kort.vis({maerke:`Iagttagelse ${i+1} af 3`,tekst:`${esc(x.text)} Hvilket billede beskriver iagttagelsen?`,svar:NPROP_SVAR.map(s=>s[1]),rigtig,hvorfor:x.why,
  forkert:'Se nærmere på, hvilket billede og hvilken virkning udsagnet handler om.',hints:['A idealiserer en tysker. B fremstiller en antisemitisk karikatur. Begge bruger enkle tegninger og tekst til påvirkning.'],
  efter:()=>{n.propaganda[x.id]=x.a;save();fremhaev()},
  videre:i===NPROP.length-1?'Åbn Wannseeprotokollen':'Næste iagttagelse',naar:()=>{if(Object.keys(n.propaganda).length>=3)n.phase=2;save();renderNazi()}});
}

/* ----- Opgave 3: Wannseeprotokollen ------------------------------------- */
function naziWannsee(){
 const n=chapter('nazi'),i=NEUPH.findIndex(x=>!n.euphemism[x.id]);
 if(i<0){n.phase=3;save();return renderNazi()}
 const q=NEUPH[i];
 scene.innerHTML=rumHTML(`<div class="full-stage alvor">${rumHoved('Wannseeprotokollen, 1942')}<div class="historical-note">»Hemmelig rigssag!« Uddrag fra forhandlingsprotokollen fra mødet ved Wannsee den 20. januar 1942. Mødet angik koordineringen af folkemordspolitikken.</div><div class="full-grid third">${NEUPH.map((x,j)=>`<div class="full-card ${n.euphemism[x.id]?'solved':''} ${j===i?'fokus':''}"><small>Wannseeprotokollen</small><p class="frase">${esc(x.phrase)}</p>${n.euphemism[x.id]?`<p class="belaeg">✓ ${esc(x.choices[x.a])}</p>`:''}</div>`).join('')}</div><div class="full-card"><h3>Historisk kontekst</h3><p>Protokollens embedsmandssprog er ikke neutralt. De beskrevne foranstaltninger var en del af forfølgelsen og folkemordet på Europas jøder.</p></div><p class="fodnote">Pas på: Én kilde kan belyse koordineringen af folkemordet uden alene at afgøre præcis, hvornår alle beslutninger først blev truffet.</p></div>`,'rum-wannsee');
 Kort.vis({maerke:`Omskrivning ${i+1} af 3`,tekst:`Den nazistiske forvaltning brugte indirekte og bureaukratisk sprog. Protokollen skriver: ${esc(q.phrase)} Hvad er den mest præcise historiske betydning?`,svar:q.choices,rigtig:q.a,hvorfor:q.why,
  forkert:'Denne fortolkning passer ikke med protokollens historiske kontekst.',hints:['»Evakuering« dækker over tvangsdeportation. »Naturligt frafald« skjuler forventet død under tvangsarbejde.'],
  efter:()=>{n.euphemism[q.id]=true;save()},
  videre:i===NEUPH.length-1?'Til den kildekritiske konklusion':'Næste omskrivning',naar:()=>{if(Object.keys(n.euphemism).length>=3)n.phase=3;save();renderNazi()}});
}

/* ----- Opgave 4: hvad kan kilden bære? ---------------------------------- */
function naziInterpret(){
 const n=chapter('nazi');
 scene.innerHTML=rumHTML(`<div class="full-stage alvor">${rumHoved('Kildekritik: ansvar og rækkevidde')}<div class="full-card"><h3>Kildekritisk vurdering</h3><div class="historical-note">Dokumentets ophavssituation, formål, sprog og historiske kontekst er afgørende for, hvad historikere kan udlede af det.</div><p>Den faglige pointe er at skelne mellem, hvad vi ved fra dette dokument, og hvilke yderligere kilder der kræves for bredere forklaringer.</p></div><p class="fodnote">Holocaust er ikke en abstrakt gåde. Her undersøges historisk ansvar, kildeudsagn og nazistisk folkemordspolitik med et bevidst alvorligt udtryk.</p></div>`,'rum-interpret');
 Kort.vis({maerke:'Opgave 4 af 4',tekst:'Du har undersøgt ideologi, propaganda og et centralt dokument. Hvad kan Wannseeprotokollen dokumentere, og hvad kan den ikke alene afgøre?',svar:NFINAL.choices,rigtig:NFINAL.correct,hvorfor:NFINAL.why,
  forkert:'Kilden kan ikke alene bære den konklusion.',hints:[NFINAL.hint],
  efter:()=>{n.final=true;save()},videre:'Sikr tidsbrik 5',naar:()=>{n.phase=4;save();renderNazi()}});
}
