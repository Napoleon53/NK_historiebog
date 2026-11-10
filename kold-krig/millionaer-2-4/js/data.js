/* =====================================================================
   data.js - spoergsmaal, beloeb, tekster og tal, der kan skrues paa

   Historie-Millionaer til modul 2-4 i "Fra varm til kold krig" (10. nov.
   2026), en kopi af spillet til modul 1. Motoren er Kemi-Millionaer (kemiformler.dk, sc_spil2_million);
   kun denne fil, nogle faa linjer i spil.js, visning.js og app.js og
   emblemet er rettet. Se README.md.

   Hvert spoergsmaal er et spoergsmaal til teksten med fire svar:

     sp(id, niveau, emne, spoergsmaal, svar, forklaring)

   niveau er 1 til 15 og er det spoergsmaal i spillet, det kan komme som
   (1 er det letteste). Hvert niveau har mindst to spoergsmaal, saa Nyt
   spoergsmaal altid har et at bytte med. emne staar oeverst til hoejre
   paa braettet. forklaringen vises i statuslinjen efter et forkert svar.

   DET FOERSTE SVAR ER DET RIGTIGE. Svarene blandes, naar spoergsmaalet
   stilles. Et svar maa hoejst vaere 28 tegn og et spoergsmaal 135.
   ===================================================================== */
(function () {
    "use strict";

    var NK = window.NK;
    var D = NK.Data = {};

    /* ----- Stigen ------------------------------------------------------ */
    D.BELOEB = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000,
        64000, 125000, 250000, 500000, 1000000];

    /* Sikre beloeb: spoergsmaal 5 og 10 (talt fra 0) */
    D.SIKRE = [4, 9];

    /* Et spoergsmaal pr. niveau: spoergsmaal 1 er fra niveau 1, spoergsmaal
       2 fra niveau 2 osv. (spil.js). D.TRIN bruges stadig til ventetiden
       og musikken: trin 1 er spoergsmaal 1-5, trin 2 er 6-10 og trin 3 er
       11-15. */
    D.ET_PR_NIVEAU = true;
    D.TRIN = [
        { til: 4, kap: [1, 2, 3, 4, 5] },
        { til: 9, kap: [6, 7, 8, 9, 10] },
        { til: 14, kap: [11, 12, 13, 14, 15] }
    ];

    /* Kun dansk: sprogknappen er skjult (index.html), og app.js bruger altid da. */
    D.KUN_DANSK = true;

    /* Titlen paa sejrsskaermen */
    D.TITEL = "Superhistoriker";

    /* ----- Spoerg publikum ---------------------------------------------- */
    /* Som i Kemi-Millionaer (Niels' tal 4. okt. 2026): andel er
       sandsynligheden, og fra/til er den procent, det rigtige svar faar.
       For hvert spoergsmaal falder den oeverste linje med 3 procentpoint,
       og hver af de tre andre stiger med 1. */
    D.PUBLIKUM = [
        { andel: 0.60, fra: 50, til: 90 },
        { andel: 0.10, fra: 40, til: 50 },
        { andel: 0.25, fra: 20, til: 40 },
        { andel: 0.05, fra: 0, til: 20 }
    ];

    D.PUBLIKUM_TRIN = [-0.03, 0.01, 0.01, 0.01];

    /* ----- Tempo (millisekunder) --------------------------------------- */
    D.TEMPO = {
        foer: 650,                      /* spoergsmaalet staar alene */
        afsloer: 300,                   /* mellem A, B, C og D */
        spaending: [1500, 2300, 3200],  /* ventetid efter Laas svaret, pr. trin */
        taelOp: 900                     /* beloebet taeller op paa slutkortet */
    };

    /* ----- Musik ------------------------------------------------------- */
    /* Samme to numre som Kemi-Millionaer: musik1 til spoergsmaal 1-10 og
       musik3 til 11-15 (der er ingen musik2). */
    D.MUSIK = {
        filer: ["musik1.mp3", "musik2.mp3", "musik3.mp3"],
        styrke: 0.4
    };

    /* Bruges ikke, naar spoergsmaalene har et emne; staar her, saa
       visning.js ikke fejler. */
    D.KAPITLER = { da: {}, en: {} };

    /* ----- Spoergsmaalene ---------------------------------------------- */
    function sp(id, niveau, emne, spoergsmaal, svar, forklaring) {
        return {
            id: id, kap: niveau,
            emne: { da: emne, en: emne },
            b: { da: spoergsmaal, en: spoergsmaal },
            svar: { da: svar, en: svar },
            forklaring: { da: forklaring, en: forklaring }
        };
    }

    var AL = "Modul 2 · De allierede", PA = "Modul 2 · Procentaftalen",
        HO = "Modul 3 · Holocaust", AF = "Modul 3 · Krigens afslutning",
        FR = "Modul 4 · Jalta og Potsdam", JT = "Modul 4 · Jerntæppet";

    D.SPOERGSMAAL = [
        /* --- Niveau 1 --- */
        sp("m1a", 1, AL, "Hvilke tre stormagter var allierede mod Hitler fra december 1941?",
            ["England, USA, Sovjetunionen", "England, USA, Frankrig", "USA, Kina, Sovjetunionen", "England, Frankrig, Polen"],
            "Med angrebet på Pearl Harbor kom USA med i krigen, og så var England, USA og Sovjetunionen allierede."),
        sp("m1b", 1, AL, "Hvem var Sovjetunionens leder under anden verdenskrig?",
            ["Josef Stalin", "Vladimir Lenin", "Leo Trotskij", "Nikita Khrusjtjov"],
            "Josef Stalin ledte Sovjetunionen under hele krigen og frem til sin død i 1953."),
        sp("m1c", 1, HO, "Hvad var Holocaust?",
            ["Folkedrabet på Europas jøder", "Et slag på østfronten", "En tysk bombeplan", "En fredsaftale i 1945"],
            "Holocaust var nazisternes folkedrab på Europas jøder."),

        /* --- Niveau 2 --- */
        sp("m2a", 2, AL, "Hvor gik de allierede i land 6. juni 1944?",
            ["Normandiet", "Sicilien", "Danmark", "Bretagne"],
            "Landgangen i Normandiet 6. juni 1944 blev den anden front, som Stalin havde bedt om."),
        sp("m2b", 2, HO, "Hvilken lejr blev centeret for masseudryddelsen af jøderne?",
            ["Auschwitz-Birkenau", "Theresienstadt", "Dachau", "Bergen-Belsen"],
            "Fra 1941 blev Auschwitz-Birkenau i det besatte Polen centeret for masseudryddelsen."),
        sp("m2c", 2, AF, "Hvilke to japanske byer blev ramt af atombomber i august 1945?",
            ["Hiroshima og Nagasaki", "Tokyo og Osaka", "Kyoto og Kobe", "Hiroshima og Tokyo"],
            "Hiroshima blev ramt 6. august og Nagasaki 9. august 1945."),

        /* --- Niveau 3 --- */
        sp("m3a", 3, HO, "Hvor mange europæiske jøder blev omtrent dræbt under Holocaust?",
            ["Cirka seks millioner", "Cirka 600.000", "Cirka en million", "Cirka 20 millioner"],
            "Cirka seks millioner europæiske jøder blev dræbt."),
        sp("m3b", 3, AF, "Hvad skete der med Hitler 30. april 1945?",
            ["Han begik selvmord", "Han blev skudt af russerne", "Han flygtede til Argentina", "Han blev dømt i Nürnberg"],
            "Hitler begik selvmord i førerbunkeren i Berlin. En uge efter kapitulerede Tyskland."),
        sp("m3c", 3, JT, "Hvad kaldte Churchill grænsen mellem øst og vest i sin tale i 1946?",
            ["Jerntæppet", "Muren", "Den røde linje", "Østfronten"],
            "I talen i Fulton i marts 1946 sagde Churchill, at et jerntæppe havde sænket sig over Europa."),

        /* --- Niveau 4 --- */
        sp("m4a", 4, FR, "Hvem var De tre store på Jalta-konferencen i februar 1945?",
            ["Churchill, Roosevelt, Stalin", "Churchill, Truman, Stalin", "Roosevelt, de Gaulle, Stalin", "Attlee, Roosevelt, Stalin"],
            "På Jalta mødtes Churchill, Roosevelt og Stalin. I Potsdam var det Truman og (til sidst) Attlee i stedet."),
        sp("m4b", 4, AL, "Hvad bad Stalin igen og igen England og USA om at åbne i Vesteuropa?",
            ["En anden front", "En luftbro", "Et nyt Folkeforbund", "En fælles grænse"],
            "En anden front i vest skulle tage presset fra østfronten og give Tyskland krig på to fronter."),
        sp("m4c", 4, AF, "Hvilken hær nåede først frem til Berlin i 1945?",
            ["Den Røde Hær", "Den amerikanske hær", "Den britiske hær", "Den franske hær"],
            "Den Røde Hær nåede først til Berlin, hvor der blev kæmpet fra hus til hus."),

        /* --- Niveau 5 --- */
        sp("m5a", 5, AL, "Hvad er et interesseområde?",
            ["Hvor en stat har interesser", "Et neutralt land", "En zone i Berlin", "Et område med frie valg"],
            "Interesseområder er de områder, hvor en stat har sine interesser. Det var et af de største stridspunkter mellem de allierede."),
        sp("m5b", 5, FR, "Ved hvilken flod mødtes amerikanske og sovjetiske soldater i april 1945?",
            ["Elben", "Rhinen", "Donau", "Oder"],
            "Soldaterne mødtes i Torgau ved Elben 25. april 1945. Stemningen var god, men den blev hurtigt kold."),
        sp("m5c", 5, HO, "Hvad kaldte nazisterne planen om at udrydde Europas jøder?",
            ["Endlösung", "Lebensraum", "Blitzkrieg", "Anschluss"],
            "Endlösung betyder den endelige løsning. Den blev sat i gang fra 1941."),

        /* --- Niveau 6 --- */
        sp("m6a", 6, AL, "Hvad frygtede England og USA, at Stalin ville gøre under krigen?",
            ["Slutte fred med Tyskland", "Angribe England", "Gå i krig mod Japan", "Indføre demokrati"],
            "De frygtede en separatfred med Tyskland. Derfor sendte de våben og lastvogne til Sovjetunionen."),
        sp("m6b", 6, AL, "Hvad mistænkte Stalin England og USA for at ønske?",
            ["At Tyskland knuste Sovjet", "At Japan vandt krigen", "At Polen blev kommunistisk", "At Frankrig blev stormagt"],
            "Stalin mistænkte Vesten for at se en fordel i, at Tyskland knuste det kommunistiske styre."),
        sp("m6c", 6, AF, "Hvorfor kastede USA atombomber over Japan i august 1945?",
            ["Japan ville ikke kapitulere", "For at hjælpe Sovjetunionen", "For at befri Korea", "Japan havde selv atombomben"],
            "Japanerne nægtede at overgive sig betingelsesløst. 15. august 1945 overgav Japan sig."),
        sp("m6d", 6, PA, "Hvad troede Roosevelt i 1944, at landene i Østeuropa ville vælge efter krigen?",
            ["Parlamentarisk demokrati", "Kommunisme", "Kongedømme", "Neutralitet som Sverige"],
            "Roosevelt havde en idealistisk opfattelse. Churchill så derimod med bekymring på den russiske fremrykning."),

        /* --- Niveau 7 --- */
        sp("m7a", 7, PA, "Hvorfor var Grækenland vigtigt for Churchill?",
            ["Middelhavet og Suez-kanalen", "Grækenlands olie", "Grækerne var kommunister", "Grækenland var en koloni"],
            "Grækenland lå ved vejen gennem Middelhavet og Suez-kanalen til Indien og resten af imperiet."),
        sp("m7b", 7, FR, "Hvem blev USA's præsident, da Roosevelt døde i april 1945?",
            ["Harry S. Truman", "Dwight D. Eisenhower", "John F. Kennedy", "Theodore Roosevelt"],
            "Vicepræsident Harry S. Truman blev præsident og var USA's mand i Potsdam."),
        sp("m7c", 7, FR, "Hvem afløste Churchill midt under Potsdam-konferencen?",
            ["Clement Attlee", "Neville Chamberlain", "Anthony Eden", "Harold Macmillan"],
            "Labour-politikeren Clement Attlee vandt valget i juli 1945. Kun Stalin var med både på Jalta og i Potsdam."),

        /* --- Niveau 8 --- */
        sp("m8a", 8, PA, "Hvilket land fik Sovjetunionen 90 procent overvægt i ifølge Procentaftalen?",
            ["Rumænien", "Grækenland", "Jugoslavien", "Ungarn"],
            "Rumænien 90 til Sovjet, Grækenland 90 til England, Jugoslavien og Ungarn 50-50, Bulgarien 75 til Sovjet."),
        sp("m8b", 8, PA, "Hvad gjorde Stalin med Churchills seddel med procenterne?",
            ["Satte et kryds med blyant", "Rev den i stykker", "Skrev nye tal på", "Gav den til Roosevelt"],
            "Ifølge Churchill satte Stalin et stort kryds med sin blyant. Det hele tog kortere tid end at fortælle om det."),
        sp("m8c", 8, FR, "Hvor blev Jalta-konferencen holdt i februar 1945?",
            ["På Krim-halvøen", "I Berlin", "I Moskva", "I London"],
            "Jalta ligger på Krim-halvøen ved Sortehavet, som dengang var en del af Sovjetunionen."),

        /* --- Niveau 9 --- */
        sp("m9a", 9, FR, "Hvad var Potsdam-aftalen især mere konkret om end Jalta-aftalen?",
            ["Tysklands fremtid", "Japans fremtid", "Procenterne på Balkan", "FN's Sikkerhedsråd"],
            "Tyskland stod centralt i Potsdam: afnazificering, zoner, et kontrolråd og krigsskadeserstatning."),
        sp("m9b", 9, FR, "Hvad blev Tyskland og Berlin delt i efter krigen?",
            ["Fire zoner og fire sektorer", "To zoner og to sektorer", "Tre zoner og én sektor", "Fire zoner, Berlin samlet"],
            "Tyskland fik fire zoner, og Berlin, der lå i den sovjetiske zone, fik fire sektorer."),
        sp("m9c", 9, AL, "Hvad ville USA opnå efter krigen ifølge afsnittet om interesseområder?",
            ["Et frit verdensmarked", "Et stort imperium", "Kolonier i Afrika", "Et værn mod kapitalismen"],
            "USA ville føre den åbne dørs politik og sælge sine varer på et frit verdensmarked."),

        /* --- Niveau 10 --- */
        sp("m10a", 10, FR, "Hvad forlangte Stalin i en hemmelig aftale på Jalta for at gå i krig mod Japan?",
            ["Tabte landområder tilbage", "Hele Japans flåde", "Halvdelen af Kina", "Hele Berlin"],
            "Stalin ville have landområder tilbage, som Rusland tabte til Japan i 1904-1905, og sikre sine interesser i Manchuriet."),
        sp("m10b", 10, FR, "Hvordan skulle Tyskland betale krigsskadeserstatning efter Potsdam-aftalen?",
            ["Hver magt tog fra sin zone", "Et fast beløb til Sovjet", "Gennem FN", "Tyskland slap for at betale"],
            "Der kom intet beløb, som efter første verdenskrig. Hver besættelsesmagt kunne tage værdier fra sin egen zone."),
        sp("m10c", 10, HO, "Hvorfor bombede de allierede ikke jernbanerne til Auschwitz ifølge lektien?",
            ["Krigen skulle vindes først", "De kendte ikke til lejren", "Sverige protesterede", "Sovjet forbød det"],
            "De allierede kendte til gasningerne fra 1942, men al krigsindsats skulle gå til at nedbryde Tyskland."),

        /* --- Niveau 11 --- */
        sp("m11a", 11, HO, "Hvad forklarer Christopher Browning drabene med i bogen Ordinary Men?",
            ["Autoritetstro og gruppepres", "Indgroet tysk antisemitisme", "Blodtørst og had", "Trusler om dødsstraf"],
            "Ifølge Browning dræbte de almindelige mænd på grund af autoritetstro og gruppepres, ikke af blodtørst."),
        sp("m11b", 11, HO, "Hvad kaldte Hannah Arendt det, at Eichmann forsvarede sig med, at han bare passede sit job?",
            ["Ondskabens banalitet", "Hitlers villige bødler", "Den endelige løsning", "Almindelige mænd"],
            "Arendt kaldte det ondskabens banalitet: forbrydelser begået af en embedsmand, der bare passede sit arbejde."),
        sp("m11c", 11, AF, "Hvorfor skulle de allierede kæmpe helt frem til Berlin?",
            ["Ingen myte om ubesejret hær", "For at finde Hitlers guld", "For at befri Danmark", "Berlin var Sovjets mål alene"],
            "Efter 1918 opstod en myte om, at den tyske hær ikke havde tabt. Den myte måtte ikke opstå igen."),

        /* --- Niveau 12 --- */
        sp("m12a", 12, HO, "Hvad mente Daniel Goldhagen var forklaringen på Holocaust?",
            ["Indgroet tysk antisemitisme", "Autoritetstro og gruppepres", "Ondskabens banalitet", "Hitler alene havde skylden"],
            "Goldhagen kaldte tyskerne Hitlers villige bødler. Kritikken: antisemitisme var udbredt overalt, og mange ikke-tyskere deltog."),
        sp("m12b", 12, FR, "Hvorfor stod Sovjetunionen ideologisk stærkt i 1945?",
            ["Kommunisterne i modstanden", "Sovjet havde atombomben", "Sovjet havde frie valg", "USA støttede kommunismen"],
            "Kommunistpartier havde spillet en central rolle i modstandsbevægelserne, og mange så planøkonomien som et svar på krisen i 1930'erne."),
        sp("m12c", 12, JT, "Hvilke partier blev slået sammen med kommunisterne i de socialistiske enhedspartier?",
            ["De socialdemokratiske", "De liberale", "De konservative", "Bondepartierne"],
            "Socialdemokraterne blev slået sammen med kommunisterne. I praksis fik kommunisterne monopol på magten."),

        /* --- Niveau 13 --- */
        sp("m13a", 13, JT, "Hvorfor mente Stalin, at kun Sovjet skulle have indflydelse i de lande, Den Røde Hær befriede?",
            ["Vesten gjorde det i Italien", "Det stod i Jalta-aftalen", "FN havde besluttet det", "Landene bad selv om det"],
            "I 1943 afviste England og USA sovjetisk medindflydelse i Italien. Så skulle de heller ikke have indflydelse i øst."),
        sp("m13b", 13, JT, "Hvad ville Sovjetunionen sikre sig i Østeuropa ifølge Stalin i kilde 29?",
            ["Regeringer loyale mod Sovjet", "Frie valg og demokrati", "Kolonier og råstoffer", "Neutrale stater"],
            "Stalin ville have regeringer, der var loyale mod Sovjetunionen, af hensyn til landets sikkerhed."),
        sp("m13c", 13, HO, "Hvordan fremstiller Kittel sig selv i kilde 24?",
            ["Som en, der kun så til", "Som modstandsmand", "Som leder af drabene", "Som en, der intet vidste"],
            "Kittel taler, som om han kun var tilskuer. Det er usandsynligt, siger lektien."),

        /* --- Niveau 14 --- */
        sp("m14a", 14, HO, "Hvad var overraskende ved mændene i Brownings Ordinary Men?",
            ["De kunne have sagt nej", "De var alle SS-folk", "De var unge soldater", "De var tvunget af Hitler"],
            "De var midaldrende familiefædre, ikke fanatiske nazister, og de fik lov at sige nej. Alligevel dræbte de."),
        sp("m14b", 14, HO, "Hvorfor er samtalen mellem Kittel og Felbert (kilde 24) en særlig god kilde?",
            ["De blev aflyttet i smug", "Den er skrevet efter krigen", "Den er fra en retssag", "De allierede skrev den"],
            "Samtalen blev optaget i 1944, uden at de vidste det. Derfor taler de mere frit end i forhør efter krigen."),
        sp("m14c", 14, JT, "Hvem er Churchill venlig over for i kilde 28, selv om han advarer mod Moskva?",
            ["Det russiske folk", "Det tyske folk", "De græske kommunister", "Polens regering"],
            "Churchill roser det tapre russiske folk og skiller folket fra styret i Moskva."),

        /* --- Niveau 15 --- */
        sp("m15a", 15, PA, "Hvorfor skriver Churchill i kilde 23, at det kun var en ren krigstidsordning?",
            ["Han forsvarer sig bagefter", "Det stod i aftalen", "Stalin bad ham om det", "Roosevelt krævede det"],
            "Erindringerne er fra 1950'erne, da flere af landene var blevet kommunistiske. Churchill vil ikke ligne en, der delte Europa på få minutter."),
        sp("m15b", 15, JT, "Hvad var misvisende ved ordet folkedemokrati om landene i Østeuropa?",
            ["Ét parti og ingen frie valg", "Folket bestemte for meget", "Landene var kongeriger", "Der var for mange partier"],
            "Ordet betyder folkestyre, men landene havde kommunistiske etpartisystemer og planøkonomi."),
        sp("m15c", 15, JT, "Stalin sætter ”ekspansionistiske tendenser” i anførselstegn i kilde 29. Hvorfor?",
            ["Han håner Vestens ord", "Han er enig i ordene", "Ordet er fra Jalta-aftalen", "Han citerer Lenin"],
            "Stalin citerer sine modstandere for at gøre deres ord latterlige: Sovjetunionen vil kun have sikkerhed.")
    ];

    /* ----- Rosen til den, der vinder ----------------------------------- */
    D.ROS = {
        da: [
            "De tre store har ringet. De vil gerne have dig med til næste konference.",
            "Selv Churchill skulle bruge en hel seddel. Du klarede det uden.",
            "Stalin har sat et stort kryds ved dit navn. Det betyder godkendt.",
            "Historiebøgerne skal skrives om. Du har fået dit eget kapitel.",
            "Der er intet jerntæppe mellem dig og millionen."
        ]
    };
    D.ROS.en = D.ROS.da;

    /* ----- Teksterne ---------------------------------------------------- */
    D.TEKST = {
        da: {
            titel: "Historie-Millionær",
            forTitel: "Hvem vil være",
            storTitel: "Historie-millionær?",
            undertitel: "15 spørgsmål til modul 2-4: de allierede, Holocaust, krigens afslutning og jerntæppet. Spørgsmålene bliver sværere undervejs.",
            chips: ["15 spørgsmål", "Sikre beløb ved 5 og 10", "3 livliner"],
            start: "Start spillet",
            regler: "Regler",
            luk: "Luk",
            stige: "Gevinst",
            sikret: "Sikret",
            sikretTip: "Det beløb, du beholder ved et forkert svar",
            rekord: "Rekord",
            ingenRekord: "ingen",
            ledetekst: "Spørgsmål til teksten",
            spoergsmaalAf: function (n) { return "Spørgsmål " + n + " af 15"; },
            kapitel: function (k, navn) { return navn; },
            spillerOm: function (kr) { return "Spiller om " + kr; },
            laasSvaret: "Lås svaret",
            naeste: "Næste spørgsmål",
            seGevinst: "Se gevinsten",
            seResultat: "Se resultatet",
            stopOgTag: function (kr) { return "Stop og tag " + kr; },
            bekraeft: function (kr) { return "Vil du stoppe og gå hjem med " + kr + "?"; },
            ja: "Ja, stop",
            nej: "Nej, spil videre",
            nytSpil: "Nyt spil",
            nyRekord: "Ny rekord",
            livliner: {
                halv: { navn: "To væk", tip: "Fjerner to forkerte svar (5)" },
                publikum: { navn: "Spørg publikum", tip: "Viser, hvad publikum ville svare (6)" },
                byt: { navn: "Nyt spørgsmål", tip: "Bytter spørgsmålet ud med et andet, der er lige så svært (7)" }
            },
            brugt: "Livlinen er brugt.",
            spaerret: "Kan ikke bruges nu.",
            lydTil: "Lyden er til. Klik for at slå den fra (M)",
            lydFra: "Lyden er fra. Klik for at slå den til (M)",
            skiftSprog: "Switch to English",
            rundvisning: "Rundvisning (H)",
            lyde: "Lyde",
            musikEgen: "Baggrundslyden er spillets egen.",
            musikFil: "Baggrundsmusikken kommer fra lydfiler i spillets mappe.",

            /* Statuslinjen */
            sTitel: "Tryk Start spillet eller Enter.",
            sLaes: "Læs spørgsmålet.",
            sVaelg: "Vælg et svar, og lås det.",
            sValgt: function (b) { return "Du har valgt <b>" + b + "</b>. Lås svaret, eller vælg et andet."; },
            sLaast: "Svaret er låst.",
            sRigtigt: function (kr) { return "Rigtigt. Du har nu <b>" + kr + "</b>"; },
            sSikret: function (kr) { return "Rigtigt. <b>" + kr + "</b> er sikret."; },
            sForkert: function (svar) { return "Forkert. Det rigtige svar er <b>" + svar + "</b>."; },
            sPasserTil: function (ord, b) { return "<b>" + ord + "</b> passer til: “" + b + "”."; },
            sHalv: "To forkerte svar er fjernet.",
            sPublikum: "Publikum har stemt. De har ikke altid ret.",
            sByt: "Spørgsmålet er byttet ud.",
            sStop: function (kr) { return "Svarer du forkert, går du hjem med <b>" + kr + "</b>"; },

            /* Slutkortet */
            tabtTitel: "Spillet er slut",
            stoppetTitel: "Du stoppede i tide",
            gaarHjem: "Du går hjem med",
            svaretVar: function (n, svar) { return "Svaret på spørgsmål " + n + " var <b>" + svar + "</b>."; },
            vundetTitel: "Tillykke! Du er historie-millionær",
            vundetTekst: "Du har svaret rigtigt på alle 15 spørgsmål og vundet",
            kaaret: "Du er hermed officielt kåret til",

            reglerDele: [
                ["Målet", "Svar rigtigt på 15 spørgsmål til modul 2-4: fra de allierede under krigen til jerntæppet i 1946. De første spørgsmål er lettest. Spil med lukket bog."],
                ["Svaret", "Vælg et svar, og tryk <b>Lås svaret</b>. Først da gælder det, så du kan nå at vælge om."],
                ["Sikre beløb", "Ved spørgsmål 5 og 10 er beløbet sikret. Svarer du senere forkert, går du hjem med det sikrede beløb. Svarer du forkert før spørgsmål 6, går du hjem med 0 kr."],
                ["Stop", "Fra spørgsmål 2 kan du stoppe og tage det, du har vundet. Det skal ske, før du låser et svar."],
                ["Livliner", "Hver livline kan bruges én gang. <b>To væk</b> (50:50) fjerner to forkerte svar. <b>Spørg publikum</b> viser, hvor mange procent der ville vælge hvert svar. Publikum har oftest ret ved de første spørgsmål og bliver mere usikre, jo sværere spørgsmålene bliver. <b>Nyt spørgsmål</b> bytter spørgsmålet ud med et andet, der er lige så svært."]
            ],
            genvejeTitel: "Genveje",
            genveje: "<kbd>A</kbd> <kbd>B</kbd> <kbd>C</kbd> <kbd>D</kbd> vælg svar &nbsp;·&nbsp; <kbd>Enter</kbd> lås og gå videre &nbsp;·&nbsp; <kbd>5</kbd> <kbd>6</kbd> <kbd>7</kbd> livliner &nbsp;·&nbsp; <kbd>S</kbd> stop &nbsp;·&nbsp; <kbd>M</kbd> lyd &nbsp;·&nbsp; <kbd>H</kbd> rundvisning &nbsp;·&nbsp; <kbd>Esc</kbd> luk",

            turForrige: "← Forrige",
            turNaeste: "Næste →",
            turAfslut: "Afslut",
            tur: [
                { sel: "#startknap", titel: "Start", tekst: "Spillet har 15 spørgsmål til teksten. Spil med lukket bog." },
                { sel: "#spoergsmaal", titel: "Spørgsmålet", tekst: "Her står spørgsmålet. Oppe til højre står, hvilken del af teksten det handler om." },
                { sel: "#svarnet", titel: "De fire svar", tekst: "Klik på et svar for at vælge det. Du kan vælge om, indtil du låser svaret." },
                { sel: "#hovedknap", titel: "Lås svaret", tekst: "Først når svaret er låst, gælder det. Den samme knap går videre til næste spørgsmål." },
                { sel: "#livliner", titel: "Livlinerne", tekst: "Tre slags hjælp, der hver kan bruges én gang. Gem dem til de svære spørgsmål." },
                { sel: "#stopknap", titel: "Stop", tekst: "Er du i tvivl, kan du stoppe og beholde det, du har vundet." },
                { sel: "#stige", titel: "Stigen", tekst: "Hvert rigtigt svar er et trin op. De hvide beløb er sikre: dem beholder du, selv om du senere svarer forkert." },
                { sel: "#talkort", titel: "Sikret og rekord", tekst: "Sikret er det, du går hjem med ved et forkert svar. Rekorden er din største gevinst i denne browser." }
            ]
        }
    };
    D.TEKST.en = D.TEKST.da;
}());
