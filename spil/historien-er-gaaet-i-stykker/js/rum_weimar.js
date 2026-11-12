'use strict';
/* =====================================================================
   rum_weimar.js - niveau 7: Weimar 1923-1933

   Tre opgaver som i originalen: to tiltag, der stabiliserede økonomien
   efter hyperinflationen, kædereaktionen fra børskrakket i 1929 og seks
   beslutningskort fordelt på USA, Danmark og Tyskland. Nyt: de to tiltag
   vælges på kortet og sendes ind sammen, og beslutningskortene sendes
   ind samlet.
   ===================================================================== */
function renderWeimar(){const w=chapter('weimar');if(w.phase===0)return weimarMachine();if(w.phase===1)return weimarChain();if(w.phase===2)return weimarPolitics();fullSuccess(4,'Weimar','Den økonomiske kæde er forstået','clockIntro')}

/* ----- Opgave 1: den økonomiske maskine ------------------------------- */
function weimarMaalere(w){const num=Object.keys(w.reform).length;return `<div class="dyn-gauges"><div class="dyn-gauge"><label>Valutatillid</label><b>${10+num*38} %</b><div class="track"><span style="width:${10+num*38}%"></span></div></div><div class="dyn-gauge"><label>Adgang til kapital</label><b>${14+num*35} %</b><div class="track"><span style="width:${14+num*35}%"></span></div></div><div class="dyn-gauge"><label>Afhængighed af USA</label><b>${w.reform.loans?'Høj':'Lav'}</b><div class="track"><span style="width:${w.reform.loans?83:18}%"></span></div></div></div>`}
function weimarMachine(){
 const w=chapter('weimar');
 scene.innerHTML=rumHTML(`<div class="full-stage">${rumHoved('Weimar 1923: den økonomiske maskine')}<div id="maalere">${weimarMaalere(w)}</div><div class="full-grid" id="tiltag"></div><p class="fodnote">Modellen forenkler historien. Valutareform og amerikanske lån skete ikke nødvendigvis samtidig eller uden politiske omkostninger.</p></div>`,'rum-weimar');
 const tegnTiltag=()=>{$('#tiltag').innerHTML=Object.keys(w.reform).length?WREFORMS.map(x=>`<div class="full-card ${x.kind==='good'?'solved':'graa'}"><h3>${x.kind==='good'?'✓ ':''}${esc(x.title)}</h3><p>${esc(x.explain)}</p></div>`).join(''):'<p class="svag midt">Maskinens målere viser en økonomi i krise. Vælg to tiltag på kortet, og se, hvad de gør ved målerne.</p>'};
 tegnTiltag();
 Kort.vis({maerke:'Opgave 1 af 3',tekst:'Året er 1923. Weimarrepublikken er økonomisk presset. Hvilke to tiltag bidrog historisk til stabiliseringen efter hyperinflationen? Vælg to.',
  svar:WREFORMS.map(x=>x.title),flere:2,rigtig:[0,1],
  bedoem:valg=>{const forkerte=valg.filter(i=>WREFORMS[i].kind!=='good');if(!forkerte.length)return {ok:true};return {ok:false,fejl:forkerte.length,forkerte,tekst:forkerte.map(i=>WREFORMS[i].explain).join(' ')}},
  hvorfor:'Valutareformen og de amerikanske lån stabiliserede økonomien. Bemærk, at de amerikanske lån også gjorde Tyskland sårbart.',
  efter:()=>{w.reform={currency:true,loans:true};save();$('#maalere').innerHTML=weimarMaalere(w);tegnTiltag()},
  hints:['Søg en løsning på valutakrisen, og forklar, hvorfor USA senere blev afgørende for Tysklands økonomi.'],
  videre:'Frem til børskrakket 1929',naar:()=>{w.phase=1;save();renderWeimar()}});
}

/* ----- Opgave 2: dominoeffekten ---------------------------------------- */
function weimarChain(){
 const w=chapter('weimar');
 scene.innerHTML=rumHTML(`<div class="full-stage">${rumHoved('Weimar: dominoeffekten')}<div class="full-grid"><div class="full-card"><h3>Økonomisk årsagskæde</h3><div class="domino-list" id="domino"></div></div><div class="full-card"><h3>1929: fra Wall Street til Europa</h3><div class="historical-note">Tyskland var afhængigt af kapital og lån fra USA. Da den amerikanske krise brød ud, blev den tyske økonomi hårdt ramt.</div><p>Du skal gennemskue mekanismen og samtidig kunne skelne mellem en økonomisk årsagssammenhæng og en uundgåelig politisk følge.</p><div class="dyn-gauge"><label>Krisens spredning</label><b>USA → Tyskland</b><div class="track"><span style="width:80%"></span></div></div></div></div><p class="fodnote">Undervisningsmaterialets årsagskæde er brugt som grundmodel. Historiske kriser har også flere samtidige forklaringer.</p></div>`,'rum-chain');
 tegnDomino(w.chainDone);
 Kort.vis({maerke:'Opgave 2 af 3',tekst:'Børskrakket i 1929 er ikke en enkeltstående begivenhed. Flyt kortene op og ned, så kædereaktionen fra spekulation til massearbejdsløshed giver mening.',
  sendTekst:()=>'Indsend kæden',
  bedoem:()=>{const n=w.chain.filter((x,i)=>x===WCHAIN_TARGET[i]).length;if(n===6){w.chainDone=true;return {ok:true,tekst:'Kæden forklarer, hvorfor den finansielle krise blev til en bred økonomisk depression.'}}return {ok:false,tekst:`${n} af 6 kort står rigtigt, så rækkefølgen bryder årsagskæden. Begynd med investeringerne, og følg pengenes vej gennem banker, virksomheder og husholdninger.`}},
  efter:()=>tegnDomino(true),hints:['Spekulation og lån kommer før kursfaldet. Bankkrise og konkurs kommer før massearbejdsløsheden.'],
  videre:'Undersøg de politiske svar',naar:()=>{w.phase=2;save();renderWeimar()}});
}
function tegnDomino(laast){
 const w=chapter('weimar');
 $('#domino').innerHTML=w.chain.map((key,i)=>`<div class="domino-row ${laast?'ok':''}"><b>${i+1}.</b><span>${WCHAIN[key]}</span><button type="button" data-move="${i}" data-dir="-1" ${i===0||laast?'disabled':''} aria-label="Flyt op">↑</button><button type="button" data-move="${i}" data-dir="1" ${i===5||laast?'disabled':''} aria-label="Flyt ned">↓</button></div>`).join('');
 if(laast){$$('.domino-row').forEach(r=>r.onclick=()=>Kort.blink());return}
 $$('[data-move]').forEach(b=>b.onclick=()=>{const i=+b.dataset.move,j=i+(+b.dataset.dir);[w.chain[i],w.chain[j]]=[w.chain[j],w.chain[i]];save();tegnDomino(false);Kort.opdater();const nb=document.querySelector(`[data-move="${j}"][data-dir="${b.dataset.dir}"]`);if(nb&&!nb.disabled)nb.focus()});
}

/* ----- Opgave 3: tre samfund, tre reaktioner ---------------------------- */
function weimarPolitics(){
 const w=chapter('weimar');
 scene.innerHTML=rumHTML(`<div class="full-stage">${rumHoved('Tre samfund, tre reaktioner')}<div class="full-grid"><div class="full-card"><h3>Historiske beslutningskort</h3><p class="svag">Vælg et kort, og klik derefter på et land.</p><div id="wKort"></div></div><div class="full-card"><h3>Landenes krisereaktioner</h3><div id="wLande"></div></div></div><p class="fodnote">Vigtigt: Nazismens fremgang skal ikke forklares med økonomien alene. Ideologi, politiske beslutninger og demokratiets svagheder spillede også ind.</p></div>`,'rum-politics');
 const antal=()=>WPOLICIES.filter(p=>w.policy[p.id]||w.policyTry[p.id]).length;
 tegnPolitics();
 Kort.vis({maerke:'Opgave 3 af 3',tekst:'Fordel de seks politiske og økonomiske oplysninger mellem USA, Danmark og Tyskland. Du skal forstå både forskelle og ligheder mellem krisereaktionerne.',
  klar:()=>antal()===6,ikkeKlar:'Placér alle seks kort først.',status:()=>`Placeret: ${antal()} af 6.`,
  bedoem:()=>{const r=bedoemFordeling(w.policy,w.policyTry,id=>WPOLICIES.find(p=>p.id===id).a);w.policyFejl=r.fejlIds;return r.rigtige===6?{ok:true,tekst:'Alle seks kort ligger rigtigt: New Deal i USA, kriseforlig og socialreform i Danmark, kapitalflugt og politisk polarisering i Tyskland.'}:{ok:false,fejl:r.fejl,tekst:`${r.rigtige} af 6 kort ligger rigtigt. Kortene med rød kant hører til et andet lands udvikling og er lagt tilbage.`}},
  efter:tegnPolitics,efterFejl:tegnPolitics,hints:['New Deal: amerikansk statsintervention. Kanslergadeforliget: dansk kriseforlig. Weimar: arbejdsløshed og politisk polarisering.'],
  videre:'Sikr tidsbrik 4',naar:()=>{w.phase=3;save();renderWeimar()}});
}
function tegnPolitics(){
 const w=chapter('weimar'),zone=id=>w.policy[id]||w.policyTry[id];
 $('#wKort').innerHTML=WPOLICIES.filter(p=>!zone(p.id)).map(p=>`<button type="button" class="choice-token blok ${w.policySel===p.id?'active':''} ${w.policyFejl.includes(p.id)?'fejl':''}" data-policy="${p.id}">${esc(p.text)}</button>`).join('')||'<p class="tom-tekst">Alle seks kort er placeret.</p>';
 $('#wLande').innerHTML=WLANDE.map(([id,navn])=>`<div class="zone" role="button" tabindex="0" data-land="${id}"><h4>${navn}</h4><div class="placed">${WPOLICIES.filter(p=>zone(p.id)===id).map(p=>`<button type="button" class="chip ${w.policy[p.id]?'laast':''}" data-wtilbage="${p.id}">${w.policy[p.id]?'✓ ':''}${esc(p.text)}</button>`).join('')||'<span class="svag">Klik her for at placere det valgte kort.</span>'}</div></div>`).join('');
 $$('[data-policy]').forEach(b=>b.onclick=()=>{if(Kort.laast())return Kort.blink();w.policySel=w.policySel===b.dataset.policy?null:b.dataset.policy;tegnPolitics()});
 $$('[data-land]').forEach(z=>{const laeg=()=>{if(Kort.laast())return Kort.blink();if(!w.policySel){Kort.sigTil('Vælg først et beslutningskort.','skidt');return}w.policyTry[w.policySel]=z.dataset.land;w.policyFejl=w.policyFejl.filter(x=>x!==w.policySel);w.policySel=null;save();tone('ok');tegnPolitics();Kort.opdater()};z.onclick=e=>{if(e.target.closest('[data-wtilbage]'))return;laeg()};z.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();laeg()}}});
 $$('[data-wtilbage]').forEach(b=>b.onclick=e=>{e.stopPropagation();if(Kort.laast())return Kort.blink();const id=b.dataset.wtilbage;if(w.policy[id])return;delete w.policyTry[id];save();tegnPolitics();Kort.opdater()});
}
