/* =====================================================================
   data.js - spoergsmaal, beloeb, tekster og tal, der kan skrues paa

   Historie-Millionaer til modul 1 i "Fra varm til kold krig" (3. nov.
   2026). Motoren er Kemi-Millionaer (kemiformler.dk, sc_spil2_million);
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

    var IND = "Indledning", JAP = "Japan og Kina", EUR = "Europa 1935-1939",
        LYN = "Lynkrigen 1939-1941", OST = "Østfronten", K21 = "Kilde 21";

    D.SPOERGSMAAL = [
        /* --- Niveau 1 --- */
        sp("kk1a", 1, JAP, "Hvilket land invaderede Japan i 1937?",
            ["Kina", "Indien", "Australien", "Mongoliet"],
            "Japan invaderede Kina i juli 1937. Derfor kan man mene, at krigen begyndte i Asien."),
        sp("kk1b", 1, EUR, "Hvilket land angreb Tyskland 1. september 1939?",
            ["Polen", "Frankrig", "Danmark", "Østrig"],
            "Tyskland angreb Polen 1. september 1939, og to dage senere erklærede England og Frankrig Tyskland krig."),

        /* --- Niveau 2 --- */
        sp("kk2a", 2, JAP, "Hvad hed den amerikanske flådebase på Hawaii, som Japan angreb 7. december 1941?",
            ["Pearl Harbor", "Midway", "Guam", "Manila"],
            "Angrebet på Pearl Harbor fik USA til at gå ind i anden verdenskrig."),
        sp("kk2b", 2, LYN, "Hvilken dag besatte Tyskland Danmark og Norge?",
            ["9. april 1940", "1. september 1939", "22. juni 1941", "4. maj 1945"],
            "Tyskland besatte Danmark og Norge 9. april 1940."),

        /* --- Niveau 3 --- */
        sp("kk3a", 3, IND, "Hvilke to stormagter stod over for hinanden under den kolde krig?",
            ["USA og Sovjetunionen", "USA og Kina", "England og Tyskland", "Frankrig og Sovjetunionen"],
            "Fra 1949 til 1991 var der kun to stormagter af betydning: USA og Sovjetunionen."),
        sp("kk3b", 3, IND, "Hvad kaldte Churchill grænsen, der delte Europa i øst og vest?",
            ["Jerntæppet", "Muren", "Den røde linje", "Østfronten"],
            "Churchill kaldte den ideologiske grænse ned gennem Europa for jerntæppet."),

        /* --- Niveau 4 --- */
        sp("kk4a", 4, OST, "Hvad hed Tysklands angreb på Sovjetunionen i juni 1941?",
            ["Operation Barbarossa", "Operation Overlord", "Operation Weserübung", "Operation Søløve"],
            "Operation Barbarossa begyndte 22. juni 1941."),
        sp("kk4b", 4, OST, "Ved hvilken by måtte Tysklands 6. armé overgive sig i 1943?",
            ["Stalingrad", "Leningrad", "Moskva", "Kyiv"],
            "Slaget om Stalingrad blev et vendepunkt i krigen."),

        /* --- Niveau 5 --- */
        sp("kk5a", 5, EUR, "Hvad kaldes Englands eftergivende politik over for Hitler i 1930'erne?",
            ["Appeasement", "Isolationisme", "Containment", "Realpolitik"],
            "Appeasement skulle imødekomme Hitlers krav og undgå en ny krig."),
        sp("kk5b", 5, K21, "Hvad kalder man i Sovjetunionen og Rusland krigen mod Tyskland 1941-1945?",
            ["Den store fædrelandskrig", "Vinterkrigen", "Den hellige revolution", "Den lange march"],
            "Navnet Den store fædrelandskrig bruges stadig i Rusland."),

        /* --- Niveau 6 --- */
        sp("kk6a", 6, LYN, "Hvorfor var Danmark vigtigt for Tyskland i 1940?",
            ["Vejen til Norge og Østersøen", "Danmarks store hær", "Dansk olie og kul", "Danmark truede Tyskland"],
            "Danmark lå ved indsejlingen til Østersøen og kunne bruges til transporten videre til Norge."),
        sp("kk6b", 6, LYN, "Hvorfor var Norge vigtigt for Tyskland i 1940?",
            ["Kysten og jernmalmen", "Olien i Nordsøen", "Norges store flåde", "Norge var allieret med Japan"],
            "Kysten gav adgang til Atlanterhavet, og fra Narvik blev der sejlet jernmalm til Tyskland."),
        sp("kk6c", 6, IND, "Hvorfor lever anden verdenskrig stadig i vores historiebevidsthed ifølge indledningen?",
            ["Kampen mellem godt og ondt", "Den var den længste krig", "Danmark vandt krigen", "Den var den første krig"],
            "Krigen er let at afkode som en kamp mellem det gode og det onde."),

        /* --- Niveau 7 --- */
        sp("kk7a", 7, EUR, "Hvad gik Hitlers politik Heim ins Reich ud på?",
            ["At samle tysktalende i riget", "At bygge boliger til alle", "At få kolonierne tilbage", "At lukke grænserne"],
            "Tysktalende grupper i nabolandene skulle »hjem« til riget, fx Østrig og Sudeterlandet i 1938."),
        sp("kk7b", 7, EUR, "Hvilke to områder kom med i Tyskland i 1938?",
            ["Østrig og Sudeterlandet", "Saar og Rhinlandet", "Polen og Danzig", "Elsass og Lothringen"],
            "Østrig kom med i foråret 1938 og Sudeterlandet i oktober 1938."),

        /* --- Niveau 8 --- */
        sp("kk8a", 8, IND, "Hvad betyder det, at stormagtssituationen under den kolde krig var bipolær?",
            ["Der var to modpoler", "Der var mange stormagter", "Krigen foregik ved polerne", "Alle lande var neutrale"],
            "Bipolær betyder med to modpoler. Under den kolde krig var det USA og Sovjetunionen."),
        sp("kk8b", 8, JAP, "Hvad ville Japan have fra Manchuriet og det østlige Kina?",
            ["Råstoffer, markeder og land", "Kinesisk teknologi", "Hjælp mod Sovjetunionen", "Kristne missionærer"],
            "Herfra kunne japanerne sikre sig råstoffer, opdyrke markeder og kolonisere landområder."),

        /* --- Niveau 9 --- */
        sp("kk9a", 9, LYN, "Hvad stod der i den hemmelige aftale mellem Tyskland og Sovjetunionen fra 1939?",
            ["De delte Polen og Østeuropa", "De skulle angribe England", "Sovjet skulle have Danmark", "De skulle bekæmpe Japan"],
            "Sovjetunionen måtte tage Baltikum og det østlige Polen, og Tyskland fik det vestlige Polen."),
        sp("kk9b", 9, LYN, "Hvilket land gjorde modstand mod Sovjetunionen i vinterkrigen 1939-1940?",
            ["Finland", "Estland", "Sverige", "Norge"],
            "Finnerne vandt flere slag, men Sovjetunionen fik overtaget og sluttede krigen i marts 1940."),
        sp("kk9c", 9, JAP, "Hvilken forklaring giver teksten på japanernes overgreb i Nanjing?",
            ["Nationalisme og blodrus", "Hævn for Pearl Harbor", "Ordre fra Hitler", "Mangel på mad"],
            "Japanerne så sig som overlegne, og andre peger på blodrus efter store tab i Shanghai."),

        /* --- Niveau 10 --- */
        sp("kk10a", 10, EUR, "Hvad gik Hitlers ligestillingspolitik ud på?",
            ["Fri af Versaillestraktaten", "Lige løn for mænd og kvinder", "Lige ret til at stemme", "Samme skat for alle"],
            "Tyskland skulle frigøres fra Versaillestraktaten og ligestilles med de andre stormagter."),
        sp("kk10b", 10, JAP, "Hvad var Japans hovedformål med Antikominternpagten ifølge teksten?",
            ["Holde Sovjet ude af Asien", "Få hjælp mod Kina", "Få adgang til tysk olie", "Sprede fascismen i Europa"],
            "Pagten var mest symbolsk. Japan ville først og fremmest holde Sovjetunionen ude af Asien."),

        /* --- Niveau 11 --- */
        sp("kk11a", 11, JAP, "Hvad gjorde USA i 1940 for at stoppe de japanske erobringer?",
            ["Indførte en handelsboykot", "Erklærede Japan krig", "Sendte tropper til Kina", "Indgik en pagt med Japan"],
            "Handelsboykotten gav Japan mangel på vigtige forsyninger."),
        sp("kk11b", 11, EUR, "Hvorfor ville England ikke have et for svagt Tyskland i 1930'erne?",
            ["Balance og værn mod Sovjet", "England skyldte Tyskland", "Tyskland var Englands ven", "Frankrig krævede det"],
            "England ville have magtbalance på kontinentet, og et stærkt Tyskland var et værn mod kommunismen."),

        /* --- Niveau 12 --- */
        sp("kk12a", 12, JAP, "Hvorfor så mange asiater i kolonierne i starten japanerne som befriere?",
            ["De bekæmpede koloniherrerne", "De gav jord til bønderne", "De indførte demokrati", "De bragte mad og medicin"],
            "Japanerne bekæmpede de europæiske koloniherrer i Sydøstasien."),
        sp("kk12b", 12, OST, "Hvad gik den brændte jords politik ud på?",
            ["Ødelæggelse ved tilbagetog", "Bombning af fjendens byer", "Dyrkning af jord i krigstid", "Rydning af skov til fly"],
            "Tyskerne brændte alt ned, så der intet var tilbage, når Den Røde Hær tog området tilbage."),

        /* --- Niveau 13 --- */
        sp("kk13a", 13, OST, "Hvad mente Hitler med livsrum (Lebensraum)?",
            ["Land mod øst til tyskerne", "Kolonier i Afrika", "Mere plads i byerne", "Frihed for det tyske folk"],
            "Livsrummet mod øst skulle være »spisekammer« for det stortyske rige."),
        sp("kk13b", 13, OST, "Hvorfor nåede tyskerne ikke at indtage Moskva og Leningrad i 1941?",
            ["Angrebet kom for sent i gang", "USA's tropper stoppede dem", "Japan angreb Tyskland", "Hitler aflyste angrebet"],
            "Angrebet skulle have været sat i gang allerede i foråret. Så kom vinteren, før byerne var indtaget."),

        /* --- Niveau 14 --- */
        sp("kk14a", 14, EUR, "Hvorfor greb Frankrig ikke ind over for Hitler i 1938?",
            ["Ville ikke uden England", "Frankrig støttede Hitler", "Frankrig var besat", "Frankrig kæmpede i Asien"],
            "Frankrig ville ikke gå i krig, uden at England var med."),
        sp("kk14b", 14, EUR, "Hvad mente englænderne med fransk revanchisme?",
            ["Frankrig ville hævne sig", "Frankrig ville have kolonier", "Frankrig ville have en konge", "Frankrig ville afruste"],
            "Englænderne mente, at Frankrig ville hævne sig på Tyskland efter første verdenskrig."),

        /* --- Niveau 15 --- */
        sp("kk15a", 15, K21, "Kilde 21 er en sovjetisk historiebog fra 1956. Hvad nævner kilden IKKE?",
            ["Aftalen med Hitler om Polen", "At Tyskland startede krigen", "At partiet ledede kampen", "Nazisternes planer"],
            "Kilde 21 tier om den hemmelige aftale fra 1939, som gav Sovjetunionen det østlige Polen."),
        sp("kk15b", 15, K21, "Hvad er den tydeligste tendens i kilde 21?",
            ["Partiet og folket er helte", "Tyskerne var uskyldige", "Vesten vandt krigen", "Krigen var unødvendig"],
            "Kilden fremhæver partiets ledelse og folkets heltemod og kalder tyskerne mordere og røvere.")
    ];

    /* ----- Rosen til den, der vinder ----------------------------------- */
    D.ROS = {
        da: [
            "Generalstaben har ringet. De vil gerne låne dine noter.",
            "Selv en sovjetisk historiebog fra 1956 ville have svært ved at overdrive den præstation.",
            "Du har vundet flere slag end Napoleon, og du gik ikke mod Moskva om vinteren.",
            "Historiebøgerne skal skrives om. Du har fået dit eget kapitel.",
            "Churchill ville have kaldt det din fineste time."
        ]
    };
    D.ROS.en = D.ROS.da;

    /* ----- Teksterne ---------------------------------------------------- */
    D.TEKST = {
        da: {
            titel: "Historie-Millionær",
            forTitel: "Hvem vil være",
            storTitel: "Historie-millionær?",
            undertitel: "15 spørgsmål til teksten om, hvordan anden verdenskrig begyndte. Spørgsmålene bliver sværere undervejs.",
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
                ["Målet", "Svar rigtigt på 15 spørgsmål til teksten om, hvordan anden verdenskrig begyndte. De første spørgsmål er lettest. Spil med lukket bog."],
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
