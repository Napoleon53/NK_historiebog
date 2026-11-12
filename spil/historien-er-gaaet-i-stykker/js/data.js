'use strict';
/* =====================================================================
   data.js - alt indholdet i Historien er gået i stykker

   Teksterne er kollegaens fra "Jesper Boss Edition" (originalen ligger i
   original/). Rettet: versaler og emojier er taget ud af teksterne på
   skærmen, tankestreger er blevet til komma eller kolon, "India" er
   blevet til Indien, og ultimatummets punkt om at underrette Wien er
   punkt 10 (ikke 7). Det, der er skrevet om, står i README.md.
   ===================================================================== */

/* ----- De ti niveauer i toplinjen ----------------------------------- */
const NIVEAUER=[
 {nr:1,navn:'Koloniarkivet',stadier:['archive','board','proof']},
 {nr:2,navn:'Telegramkaos',stadier:['actionIntro','action']},
 {nr:3,navn:'Julikrisen',stadier:['commandIntro','command']},
 {nr:4,navn:'Dokumentflugten',stadier:['paperIntro','paperAction']},
 {nr:5,navn:'Versailles',stadier:['versailles']},
 {nr:6,navn:'Inflationen',stadier:['inflationIntro','inflationAction']},
 {nr:7,navn:'Weimar',stadier:['weimar']},
 {nr:8,navn:'Tidsmaskinen',stadier:['clockIntro','clockAction']},
 {nr:9,navn:'Nazismen',stadier:['nazi']},
 {nr:10,navn:'Finalen',stadier:['finalIntro']}
];

/* ----- Niveau 1: Koloniarkivet --------------------------------------- */
const sources={
 cromer:{name:'Jarlen af Cromer',date:'1908 · Modern Egypt',tag:'Britisk syn på Ægypten',sted:'Skrivebordet',desc:'Cromer forsvarer Storbritanniens besættelse af Ægypten i 1882.',quotes:[
  'Europæisk kapital er i stort omfang blevet anbragt i landet.',
  'Det var umuligt for Storbritannien at tillade tropper fra noget andet land at besætte Ægypten.',
  'De særlige anlæg, englændere har vist for at styre orientalske racer, pegede på England som det mest effektive og gavnlige instrument til gradvist at indføre europæisk civilisation i Ægypten.'
 ],focus:'Hvilke økonomiske, strategiske og ideologiske interesser kan teksten være udtryk for?'},
 dilke:{name:'Sir Charles Dilke',date:'1868 · Greater Britain',tag:'Imperiets fremtid',sted:'Verdenskortet',desc:'Dilke beskriver sin vision om et endnu større britisk verdensrige.',quotes:[
  'En [...] overbevisning om vor races storhed, som altid vil omkranse jorden, og som måske er skæbnebestemt til lidt efter lidt at brede sig helt ud over den.',
  'Det har gjort mere end blot at danne sine egne kolonier. Det har pålagt udvandrerne fra de tyske lande, Irland, Skandinavien og Spanien sine institutioner.',
  'Besiddelsen af Indien udgør for os det element af storbesiddelse, som nu er nødvendigt for at sikre en udvidelse af de åndelige horisonter og ædle formål.'
 ],focus:'Hvilken rolle spiller forestillinger om race, kultur og overlegenhed for hans syn på imperiet?'},
 blunt:{name:'Wilfred S. Blunt',date:'Dagbog 1896-1900 · udgivet 1921',tag:'Kritik indefra',sted:'Bogreolen',desc:'En britisk forfatter og tidligere diplomat kritiserer sit lands imperialisme.',quotes:[
  'Det britiske imperium er det største onde, der eksisterer for de svage racer i verden i dag.',
  'Vi bliver inficeret af den kolonialistiske bølleoptrædens koldbrand, og vanen med at undertrykke svage nationers frihed bringer vores egen i fare.',
  'For mig at se er det ikke mere respektabelt end hvis to landevejsrøvere strides om den samme røvede pung.'
 ],focus:'Hvad fortæller det om den britiske debat, at en britisk kilde så stærkt kritiserer imperialismen?'}
};
/* Mærkerne i arkivrummet (procent af rummets bredde og højde) */
const ARKIV_MAERKER=[
 {id:'cromer',navn:'Skrivebord',x:26,y:67},
 {id:'dilke',navn:'Verdenskort',x:66,y:40},
 {id:'blunt',navn:'Bogreol',x:84,y:69}
];
const clues=[
 {id:'c1',who:'Cromer',text:'Europæisk kapital er i stort omfang blevet anbragt i landet.',answer:'economy'},
 {id:'c2',who:'Cromer',text:'Det var umuligt [...] at tillade tropper fra noget andet land at besætte Ægypten.',answer:'power'},
 {id:'c3',who:'Dilke',text:'En [...] overbevisning om vor races storhed [...]',answer:'ideas'},
 {id:'c4',who:'Cromer',text:'[Englands] anlæg [...] for at styre [...] pegede på England som [...] instrument til [...] europæisk civilisation.',answer:'ideas'},
 {id:'c5',who:'Blunt',text:'[...] det drejer sig om imperialistisk udplyndring [...]',answer:'economy'},
 {id:'c6',who:'Blunt',text:'[Blunt gengiver en britisk politikers syn:] Vi vil have den [Nilen], og vi ønsker ikke, at franskmændene skal have den.',answer:'power'}
];
const MOTIVER=[
 {id:'economy',label:'Økonomiske interesser',desc:'Kapital, ressourcer, handel og økonomisk udnyttelse'},
 {id:'power',label:'Magtpolitiske interesser',desc:'Kontrol, rivalisering og strategisk dominans'},
 {id:'ideas',label:'Ideologiske begrundelser',desc:'Overlegenhedsforestillinger og civilisationsargumenter'}
];
const questions=[
 {question:'Et notat i arkivet hævder: »Alle britiske forfattere anså imperialismen for nødvendig og gavnlig.« Hvilken kilde er det stærkeste modbevis?',choices:['Cromers forsvar for besættelsen af Ægypten','Dilkes forestilling om den britiske races storhed','Blunts kritik af det britiske imperium'],correct:2,why:'Blunt er selv britisk, men kritiserer imperialismen skarpt. Det gør generaliseringen uholdbar.',hint:'Find en britisk stemme, der direkte fordømmer imperiet.'},
 {question:'Hvilken kildekritisk vurdering af Cromer er bedst?',choices:['Kilden viser, hvordan Cromer legitimerer en britisk besættelse, men ikke hvordan alle ægyptere oplevede den.','Kilden er ubrugelig, fordi den er skrevet længe efter begivenhederne.','Kilden beviser objektivt, at besættelsen var i Ægyptens egen interesse.'],correct:0,why:'Cromer er særligt værdifuld som levn til at undersøge en britisk imperialistisk argumentation. Den beviser ikke, at besættelsen var til gavn for hele befolkningen.',hint:'Kildekritik kræver, at du skelner mellem afsenderens hensigt og en neutral beskrivelse af situationen.'},
 {question:'Hvilken samlet konklusion underbygges bedst af de tre kilder?',choices:['Britisk imperialisme blev alene begrundet med økonomisk profit.','Kilderne viser både strategiske, økonomiske og ideologiske dimensioner og uenighed blandt britiske stemmer.','Alle kilderne afviser forestillingen om britisk overlegenhed.'],correct:1,why:'Tilsammen viser kilderne forskellige imperialistiske motiver og en tydelig intern britisk kritik.',hint:'Se, om kilderne peger på flere motiver, og om alle er enige.'}
];

/* ----- Niveau 3: Julikrisen 1914 ------------------------------------- */
const JULY_ORDER=['attentat','ultimatum','svar','erklaering','rusland','frankrig','belgien'];
const JULY_DATES=['28. juni','23. juli','25. juli','28. juli','1. aug.','3. aug.','4. aug.'];
const JULY_START=['frankrig','erklaering','attentat','belgien','svar','rusland','ultimatum'];
const JULY_CARDS={
 attentat:{title:'Attentatet i Sarajevo',desc:'Den østrig-ungarske tronfølger bliver myrdet.'},
 ultimatum:{title:'Et ultimatum til Serbien',desc:'Wien kræver svar inden for 48 timer.'},
 svar:{title:'Serbiens svar på ultimatummet',desc:'Serbien går langt i indrømmelserne, men accepterer ikke alle krav ubetinget.'},
 erklaering:{title:'Krig mod Serbien',desc:'Østrig-Ungarn erklærer krig.'},
 rusland:{title:'Krig mod Rusland',desc:'Tyskland erklærer krig mod Rusland.'},
 frankrig:{title:'Krig mod Frankrig',desc:'Tyskland erklærer krig mod Frankrig.'},
 belgien:{title:'Belgisk neutralitet brydes',desc:'Tyskland invaderer Belgien, og Storbritannien går ind i krigen.'}
};
const JULY_LOG=[
 ['28. juni','attentatet i Sarajevo.'],
 ['23. juli','Wien fremsætter et ultimatum med 48 timers svarfrist.'],
 ['28. juli','krigen mod Serbien begynder.'],
 ['1. og 3. aug.','Tyskland erklærer krig mod henholdsvis Rusland og Frankrig.'],
 ['4. aug.','Tyskland invaderer Belgien, og Storbritannien går ind i krigen.']
];
const MAP_NODES={
 gb:{x:145,y:181,t:'GB',name:'Storbritannien'},
 fr:{x:277,y:332,t:'FR',name:'Frankrig'},
 de:{x:384,y:256,t:'TY',name:'Tyskland'},
 ah:{x:472,y:346,t:'ØU',name:'Østrig-Ungarn'},
 ru:{x:576,y:149,t:'RU',name:'Rusland'},
 se:{x:532,y:412,t:'SE',name:'Serbien'},
 be:{x:338,y:295,t:'BE',name:'Belgien'},
 it:{x:402,y:430,t:'IT',name:'Italien'}
};
const MAP_TASKS=[
 {a:'ah',b:'se',head:'Det første diplomatiske pres',ask:'Hvilke to stater står over for hinanden i ultimatumkrisen i juli 1914?',ok:'Østrig-Ungarn presser Serbien med et ultimatum. Visse krav indebærer indgreb i Serbiens suverænitet.',tip:'Find afsenderen og modtageren af ultimatummet fra 23. juli.',color:'#b95f4b'},
 {a:'ru',b:'se',head:'Stormagten reagerer',ask:'Hvilken stormagt støtter Serbien under krisen, så konflikten vokser?',ok:'Rusland støtter Serbien. Det er et vigtigt led i optrapningen, men ikke en automatisk krigserklæring skabt af en formel fælles forsvarsklausul.',tip:'Landet ligger mod øst og konkurrerer med Østrig-Ungarn om indflydelse på Balkan.',color:'#467fa0'},
 {a:'de',b:'be',head:'Vejen mod vest',ask:'Hvilken stat angriber det neutrale Belgien under felttoget mod Frankrig?',ok:'Tyskland invaderer det neutrale Belgien. Neutralitetsbruddet bidrager afgørende til britisk indtræden i krigen.',tip:'Det er en af centralmagterne, som ønsker adgang til Frankrig gennem Belgien.',color:'#b78d41'}
];
const MAP_NOTE='Den historiske udvikling var ikke en automatisk kædereaktion. Ledernes beslutninger havde betydning, og hverken Serbien eller Italien gik ind i krigen gennem en simpel, automatisk allianceforpligtelse.';
const INTEL_TASKS=[
 {land:'Serbien',fane:'I. Ultimatum',title:'Et indgreb i Serbiens suverænitet',from:'Østrig-Ungarns ultimatum, 23. juli 1914',task:'Find den bestemmelse, der kræver, at Østrig-Ungarns egne repræsentanter skal virke inde i Serbien.',digit:'5',items:[
  {num:'1',text:'»At undertrykke enhver offentliggørelse, der ansporer had og foragt for det østrig-ungarske monarki.«'},
  {num:'5',text:'»At modtage medarbejderstab i Serbien af repræsentanter for den østrig-ungarske regering til undertrykkelse af den nedbrydende bevægelse.«'},
  {num:'10',text:'»Uopholdelig at underrette den k.k. regering om iværksættelsen af de forholdsregler, der indeholdes i ovennævnte punkter.«'}],why:'Punkt 5 kræver fremmede embedsmænd på serbisk territorium. Det er et indgreb i en selvstændig stats handlefrihed.',hint:'Kig efter »repræsentanter« fra Østrig-Ungarn, der skal arbejde på serbisk territorium.'},
 {land:'Frankrig',fane:'II. Frankrig',title:'Økonomisk dominans over Frankrig',from:'Bethmann-Hollwegs septemberprogram, 9. september 1914',task:'Find den del af programmet, hvor Frankrig tænkes gjort økonomisk afhængigt af Tyskland.',digit:'1',items:[
  {num:'1',text:'»En handelsaftale, der gør Frankrig økonomisk afhængigt af Tyskland, gør det til vores eksportland …«'},
  {num:'2',text:'»Belgien, selv om det formelt vil bestå som selvstændig stat, [må] synke ned til at blive en vasalstat …«'},
  {num:'4',text:'»Der grundlægges et økonomisk forbund med fællestoldpolitik …«'}],why:'Det første afsnit beskriver en handelsaftale, som skal give Tyskland varig økonomisk kontrol over Frankrig.',hint:'Kig efter »økonomisk afhængigt« og en handelsaftale.'},
 {land:'Belgien',fane:'III. Belgien',title:'Belgiens formelle og reelle status',from:'Bethmann-Hollwegs septemberprogram, 9. september 1914',task:'Find den bestemmelse, der foreslår, at Belgien kan forblive selvstændigt på papiret, men underlægges Tyskland i praksis.',digit:'2',items:[
  {num:'2',text:'»Belgien, selv om det formelt vil bestå som selvstændig stat, [må] synke ned til at blive en vasalstat …«'},
  {num:'3',text:'»Luxembourg bliver en tysk delstat.«'},
  {num:'5',text:'»Spørgsmålet om kolonierhvervelser … overvejes senere.«'}],why:'Punkt 2 viser forskellen mellem formel suverænitet og faktisk afhængighed: Belgien skulle være en tysk vasalstat.',hint:'Kig efter ordene »formelt« og »vasalstat«.'}
];

/* ----- Niveau 5: Versailles 1919 ------------------------------------- */
const VPEOPLE=[
 {id:'fr',land:'Frankrig',kort:'FR',name:'Georges Clemenceau',role:'Frankrig · premierminister',prompt:'Hvorfor insisterer Clemenceau på erstatning og sikkerhed?',correct:1,choices:['Han vil sikre tysk territorial udvidelse.','Frankrig kræver sikkerhed og erstatning efter krigens ødelæggelser.','Han afviser alle erstatningskrav.'],excerpt:'»Regnskabets time er kommet ... opnå enhver rimelig oprejsning og erstatning«',context:'Tale til den tyske delegation, 7. maj 1919. Frankrig er blandt sejrsmagterne.'},
 {id:'de',land:'Tyskland',kort:'TY',name:'Brockdorff-Rantzau',role:'Tyskland · delegationens leder',prompt:'Hvorfor afviser Brockdorff-Rantzau eneansvar for krigen?',correct:2,choices:['Han afviser, at Tyskland har begået nogen fejl.','Han mener, at Østrig-Ungarn alene startede krigen.','Han peger på imperialisme i flere lande og afviser tysk eneansvar.'],excerpt:'»I de sidste halvtreds år har imperialismen i alle de europæiske stater kronisk forgiftet den internationale situation.«',context:'Tale 7. maj 1919. Tyskland kan fremsende skriftlige indlæg, men deltager ikke som ligeværdig forhandler.'},
 {id:'us',land:'USA',kort:'US',name:'Woodrow Wilson',role:'USA · præsident',prompt:'Hvilket overordnet fredsprincip forbindes med Wilson?',correct:0,choices:['En varig fred med internationalt samarbejde og national selvbestemmelse.','En fuldstændig isolation af alle europæiske lande.','Hemmelige traktater og en permanent amerikansk besættelse af Berlin.'],excerpt:'Fredens principper: internationalt samarbejde, nationalitetsprincippet og en ny fredsorden.',context:'Denne orientering er en sammenfatning fra undervisningsplanen, ikke et ordret citat fra Wilson.'}
];
const VHINT_TALK='Clemenceau: fransk sikkerhed og erstatning. Brockdorff-Rantzau: afviser eneansvar. Wilson: principper for en varig fred.';
const VCLAUSES=[
 {id:'v160',art:'Art. 160',text:'Tysklands hær må højst omfatte 100.000 mand.',answer:'ned',why:'Militær nedrustning.'},
 {id:'v191',art:'Art. 191',text:'Tyskland må ikke bygge eller erhverve undervandsbåde.',answer:'ned',why:'Nedrustning af flåden.'},
 {id:'v42',art:'Art. 42',text:'Ingen fæstningsanlæg på den vestlige Rhinbred og i en zone øst for floden.',answer:'sik',why:'Sikkerhedsbestemmelse for at begrænse truslen mod Frankrig.'},
 {id:'v231',art:'Art. 231',text:'Tyskland og dets allierede anerkendes ansvarlige for de allieredes tab og skader.',answer:'ers',why:'Ansvarsbestemmelse som grundlag for erstatninger. Ordlyden er mere præcis end etiketten »eneskyld«.'},
 {id:'v232',art:'Art. 232',text:'Tyskland forpligtes til at erstatte skader på allierede civiles ejendom.',answer:'ers',why:'Krigsskadeserstatninger.'},
 {id:'v428',art:'Art. 428',text:'De allierede besætter områder vest for Rhinen som garanti for traktatens gennemførelse.',answer:'sik',why:'Sikkerhed og kontrol med traktatens overholdelse.'}
];
const VKATEGORIER=[['ned','Nedrustning'],['sik','Sikkerhed'],['ers','Erstatning og ansvar']];
const VDEBATE=[
 {id:'sec',claim:'Freden skulle beskytte Frankrig mod et nyt tysk angreb.',answer:1,picks:['Blunts kritik af kolonial udplyndring.','Afmilitariseringen af Rhinområdet og den allierede kontrol.','Østrig-Ungarns ultimatum fra 1914.'],why:'Rhinlandbestemmelserne sigtede mod sikkerhed.'},
 {id:'excl',claim:'Tyskernes oplevelse af at blive behandlet uretfærdigt havde et konkret grundlag.',answer:0,picks:['De tyske delegerede fik ikke en ligeværdig plads ved traktatens tilblivelse.','Den tyske hær vandt militært i 1918.','Storbritannien opgav sine kolonier.'],why:'Tyskland blev forelagt betingelserne uden ligeværdig forhandling.'},
 {id:'nuance',claim:'At freden blev hårdt kritiseret, betyder ikke i sig selv, at krigen havde én enkelt årsag.',answer:2,picks:['Alle europæiske magter havde identiske interesser.','Første verdenskrig skyldtes alene Versaillestraktaten.','Krigens årsager var sammensatte, og også tyske ekspansionsplaner kan dokumenteres.'],why:'Skeln mellem forklaringen på krigens udbrud og vurderingen af fredens konsekvenser.'}
];

/* ----- Niveau 7: Weimar 1923-1933 ------------------------------------ */
const WREFORMS=[
 {id:'currency',title:'Indfør en mere stabil valuta',kind:'good',explain:'Valutastabilisering var en vigtig del af vejen ud af hyperinflationen i 1923.'},
 {id:'loans',title:'Modtag amerikansk kapital og lån',kind:'good',explain:'Amerikanske lån bidrog til den midlertidige stabilisering i midten af 1920’erne og skabte afhængighed.'},
 {id:'print',title:'Tryk endnu flere mark uden begrænsning',kind:'bad',explain:'Yderligere ukontrolleret pengetrykning er ikke en troværdig kur mod hyperinflation.'},
 {id:'army',title:'Genindfør straks en enorm stående hær',kind:'bad',explain:'Militær oprustning løser ikke Weimarrepublikkens inflation og finansielle problemer.'}
];
const WCHAIN={prod:'Virksomhedernes overproduktion og spekulation skaber skrøbelige forventninger.',bankloan:'Banker udlåner penge til investeringer og aktiekøb.',prices:'Virksomheder lever ikke op til forventningerne, og aktiekurserne falder.',panic:'Banker får svært ved at få deres udlån indfriet.',bankrupt:'Banker og virksomheder går konkurs, og opsparinger forsvinder.',unemployment:'Arbejdsløsheden stiger, og efterspørgslen falder yderligere.'};
const WCHAIN_TARGET=['prod','bankloan','prices','panic','bankrupt','unemployment'];
const WCHAIN_START=['panic','prod','unemployment','bankloan','bankrupt','prices'];
const WPOLICIES=[
 {id:'uswork',text:'Offentlige anlægsprojekter for at skabe beskæftigelse',a:'usa'},
 {id:'usfarm',text:'Føderale landbrugsreformer og social lovgivning',a:'usa'},
 {id:'dkfarm',text:'Landbrugsstøtte, løntilbageholdenhed og et bredt politisk kompromis indgår i en kriseaftale',a:'den'},
 {id:'dkwelfare',text:'Socialreform med betydning for den danske velfærdsstats udvikling',a:'den'},
 {id:'gercrash',text:'Amerikanske lån trækkes tilbage, og arbejdsløsheden stiger',a:'ger'},
 {id:'gerpolitics',text:'Opbakningen til de parlamentariske regeringspartier falder, mens antidemokratiske bevægelser vinder frem',a:'ger'}
];
const WLANDE=[['usa','USA'],['den','Danmark'],['ger','Tyskland']];

/* ----- Niveau 9: Nazismen og Holocaust (alvorligt, uden humor) ------- */
const NPROGRAM=[
 {id:'n2',text:'Pkt. 2: Fredstraktaterne fra Versailles skal annulleres.',a:'rev'},
 {id:'n4',text:'Pkt. 4: Jøder udelukkes fra at være »folkefæller«.',a:'rac'},
 {id:'n15',text:'Pkt. 15: En storstilet udbygning af alderdomsforsorgen.',a:'social'},
 {id:'n23',text:'Pkt. 23: Aviser, der går imod det »fælles vel«, skal forbydes.',a:'cens'},
 {id:'n25',text:'Pkt. 25: En stærk centralmagt med ubetinget autoritet.',a:'dict'}
];
const NFUNCTIONS=[
 ['rev','Revisionisme: ophæv Versailles'],
 ['rac','Racistisk udelukkelse'],
 ['social','Socialpolitisk appel'],
 ['cens','Pressecensur'],
 ['dict','Autoritær centralmagt']
];
const NPROP=[
 {id:'ideal',text:'Billedet »Tyskeren« fremstiller en idealiseret, stærk og arbejdsom figur.',a:'image2',why:'Den idealiserede figur bruges til at fremstille et bestemt nationalt ideal.'},
 {id:'caric',text:'Billedet »Jøden« bruger en forvrænget karikatur til at fremstille jøder negativt.',a:'image3',why:'Karikaturen fungerer som antisemitisk, dehumaniserende propaganda.'},
 {id:'audience',text:'De enkle tegninger og vers vidner om propaganda rettet mod et ungt publikum.',a:'both',why:'Formen viser, hvordan børn kunne være målgruppe for antisemitisk påvirkning.'}
];
const NPROP_SVAR=[['image2','Billede A'],['image3','Billede B'],['both','Begge: form og målgruppe']];
const NEUPH=[
 {id:'evac',phrase:'»evakueringen af jøderne til Østeuropa«',a:1,choices:['En frivillig turist- og bosætningsordning.','En omskrivning for tvangsdeportation som led i forfølgelses- og udryddelsespolitikken.','Et neutralt program om arbejdsmigration.'],why:'Ordet dækker over tvangsforflyttelse i en kontekst af folkemord.'},
 {id:'frafald',phrase:'»En stor del af dem vil utvivlsomt udgå ved naturligt frafald.«',a:2,choices:['Normale arbejdspladsskift.','Udvandring gennem lovlige grænseovergange.','En bureaukratisk omskrivning, der dækker over forventede dødsfald under tvangsarbejde og brutal behandling.'],why:'Den tilsyneladende neutrale formulering skjuler forventningen om omfattende død.'},
 {id:'behand',phrase:'»De, som eventuelt er blevet tilbage ... [må] behandles i overensstemmelse hermed.«',a:0,choices:['En truende omskrivning i en plan, hvor de overlevende også skulle forhindres i at genetablere jødiske samfund.','En garanti for offentlig erstatning.','En plan om frigivelse af alle overlevende.'],why:'Kilden viser det bevidst vage og truende embedsmandssprog.'}
];
const NFINAL={choices:['At beslutningen om Holocaust først blev taget på præcis dette møde, og at ingen andre instanser var involveret.','At centrale nazistiske myndigheder koordinerede gennemførelsen af folkemordspolitikken, mens kilden alene ikke fastlægger hele beslutningsprocessens oprindelse.','At der kun blev diskuteret frivillig udvandring og intet andet.'],correct:1,why:'En kildekritisk og nuanceret konklusion.',hint:'Undersøg forskellen mellem at koordinere en allerede igangsat politik og at dokumentere præcis, hvornår den blev besluttet.'};

/* ----- Actionbanerne og Jesper ---------------------------------------- */
const EXTRAS={
 paper:{name:'Dokumentflugten',era:'1918',brief:'Dokumenterne jager dig gennem arkivet. Løb, hop og hold dig foran bølgen af papirer.',button:'Flygt fra dokumenterne',background:'#394b6a',accent:'#f1c77c',next:'versailles',nextName:'Versailles 1919',speed:252},
 inflation:{name:'Inflationshelvedet',era:'1923',brief:'Priserne stiger, og transportbåndene skifter fart. Undvig prisskilte, og arbejd dig gennem pengemaskinen.',button:'Ind i inflationsmaskinen',background:'#735246',accent:'#f1c07a',next:'weimar',nextName:'Weimarrepublikken',speed:275},
 clock:{name:'Tidsmaskinens kollaps',era:'1933-1942',brief:'Tidsplatformene forsvinder og vender tilbage. Brug E til at fryse tiden kortvarigt.',button:'Kryds tidsportalen',background:'#393c70',accent:'#a2dcec',next:'nazi',nextName:'Det hemmelige rigsarkiv',speed:245}
};
const XBOSS={
 paper:{title:'Jesper, arkivets herre',intro:'Jesper har lavet et bjerg af eksamensbilag. Returnér de gyldne kildehæfter med E, før de rammer dig. Undvig de almindelige hæfter.',tip:'E: returnér gyldne bilag',subtitle:'RETURN TO SENDER · TIMING'},
 inflation:{title:'Jesper, inflationskongen',intro:'Jesper puster priserne op. Hop op på de store prisbobler, og punkter dem ovenfra. Hver sprængt boble sender en prisregning direkte mod Jesper.',tip:'Hop oven på prisbobler',subtitle:'PRISBOBLE-PANIK · HOP'},
 clock:{title:'Jesper, tidens hersker',intro:'Jesper har gemt sig bag sin tidsrustning. Tryk E for at fryse tiden, og rør det lysende tandhjul, mens tiden står stille. Gentag tre gange.',tip:'E: frys tiden, rør tandhjulet',subtitle:'FROSSET TID · PRÆCISION'}
};
