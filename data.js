/* ==========================================================================
   Mohlins Konditori – innehåll och inställningar
   --------------------------------------------------------------------------
   Här ändrar du öppettider, produkter och säsongstexter. Sidorna läser
   härifrån, så du behöver bara ändra på ett ställe.
   ========================================================================== */
window.MOHLINS = {
  foton: 'img/foton/',

  kontakt: {
    telefon: '031-23 58 32',
    telefonLank: 'tel:+4631235832',
    epost: 'info@mohlinskonditori.nu',
    adress: 'Gamla Björlandavägen 145',
    postort: '417 16 Göteborg',
    facebook: 'https://www.facebook.com/pages/Mohlins-Konditori/147769065398528',
    googleMaps: 'https://maps.google.com/?cid=13269207821638352404',
    karta: 'https://www.google.com/maps?q=Mohlins+Konditori,+Gamla+Bj%C3%B6rlandav%C3%A4gen+145,+417+16+G%C3%B6teborg&z=16&output=embed'
  },

  // Öppettider per veckodag: 0 = söndag, 1 = måndag … 6 = lördag. null = stängt.
  oppettider: {
    0: null,
    1: ['07:00', '18:30'],
    2: ['07:00', '18:30'],
    3: ['07:00', '18:30'],
    4: ['07:00', '18:30'],
    5: ['07:00', '18:30'],
    6: ['07:00', '14:00']
  },

  // Avvikande öppettider, t.ex. helgdagar.
  // Format: 'ÅÅÅÅ-MM-DD': null (stängt) eller ['07:00', '13:00'], plus valfritt namn.
  avvikandeDagar: {
    // '2026-12-24': { tider: null, namn: 'Julafton' },
    // '2026-12-31': { tider: ['07:00', '13:00'], namn: 'Nyårsafton' }
  },

  // Hur många dagar i förväg en tårta behöver beställas.
  forvarning: { ordinarie: 1, special: 3 },

  // Ordinarie tårtor – namn, innehåll och bild från nuvarande hemsida.
  // zoom/pos finjusterar hur fotot beskärs i den runda ramen.
  tartor: [
    { id: 'frukttarta', namn: 'Frukttårta', innehall: 'Mandelmassa, vaniljkräm, frukt & gelé', bild: 'frukt_sortiment.jpg' },
    { id: 'schwarzwaldtarta', namn: 'Schwarzwaldtårta', innehall: 'Grädde, marängbotten & choklad', bild: 'schwartzwald_sortiment.jpg' },
    { id: 'prinsesstarta', namn: 'Prinsesstårta', innehall: 'Grädde, vaniljkräm & marsipan', bild: 'princess_sortiment.jpg' },
    { id: 'chokladtarta', namn: 'Chokladtårta', innehall: 'Hallongrädde, chokladkräm, chokladbotten & chokladöverdrag', bild: 'choklad_sortiment.jpg' },
    { id: 'graddtarta', namn: 'Gräddtårta', innehall: 'Grädde, sylt, vaniljkräm, bär eller blandad frukt & gelé', bild: 'gradd_sortiment.jpg' },
    { id: 'tusenblad', namn: 'Tusenblad', innehall: 'Smördegsbotten, vaniljkräm, sylt & grädde', bild: 'Tusenblad.jpg' },
    { id: 'spansk-tarta', namn: 'Spansk tårta', innehall: 'Ananasfromage, pistagemassa, ananas, grädde & gelé', bild: 'Spansk.jpg' },
    { id: 'romtarta', namn: 'Romtårta', innehall: 'Romfromage, hallonsylt, romfrukter, gelé & grädde', bild: 'rom_sortiment.jpg' },
    { id: 'riviera', namn: 'Riviera', innehall: 'Ananas, ananassylt, grädde & gelé', bild: 'Riviera.jpg' },
    { id: 'parontarta', namn: 'Pärontårta', innehall: 'Vaniljkräm, päronfromage, päron, vit marsipan & grädde', bild: 'Paron.jpg' },
    { id: 'nigrita', namn: 'Nigrita', innehall: 'Vaniljkräm, marsipan, romgrädde & chokladöverdrag', bild: 'Nigrita.jpg' },
    { id: 'napoleon', namn: 'Napoleon', innehall: 'Smördegsbotten, vaniljkräm & sylt', bild: 'Napoleon.jpg' },
    { id: 'mont-blanc', namn: 'Mont Blanc', innehall: 'Marängbotten, mockakräm & grädde', bild: 'MontBlanc.jpg' },
    { id: 'mocca', namn: 'Mocca', innehall: 'Marängbotten & mockakräm', bild: 'Mocca.jpg' },
    { id: 'diplomat', namn: 'Diplomat', innehall: 'Vaniljkräm, sylt & spritsad mandelmassa', bild: 'Margareta.jpg', not: 'Bakas i ugn – beställ minst en dag i förväg.' },
    { id: 'karusell', namn: 'Karusell', innehall: 'Maräng- och sockerkaksbotten, mandelmassa, chokladkräm, marsipan & grädde', bild: 'Karusell.jpg' },
    { id: 'jamaica', namn: 'Jamaica', innehall: 'Banan, vaniljkräm, marsipan & grädde', bild: 'Jamaica.jpg' },
    { id: 'fransk-mocka', namn: 'Fransk mocka', innehall: 'Maräng- och sockerkaksbotten, mockakräm, marsipan & grädde', bild: 'FranskMocca.jpg' },
    { id: 'casablanca', namn: 'Casablanca', innehall: 'Marängbotten, vanilj, smörkräm, frukt & grädde', bild: 'Casablanca.jpg' },
    { id: 'bonanza', namn: 'Bonanza', innehall: 'Chokladkräm, banan & grädde', bild: 'Bonanza.jpg' },
    { id: 'budapest', namn: 'Budapest', innehall: 'Nötmaräng, mandariner & grädde', bild: 'Budapest.jpg' },
    { id: 'blabarstarta', namn: 'Blåbärstårta', innehall: 'Blåbärsgrädde, vaniljkräm & blå marsipan', bild: 'Blabar.jpg' },
    { id: 'banantarta', namn: 'Banantårta', innehall: 'Grädde, banan, vaniljkräm & gelé', bild: 'Banan.jpg' },
    { id: 'wienertosca', namn: 'Wienertosca', innehall: 'Vaniljgrädde & wienerdeg', bild: 'wienertosca_sortiment.jpg' }
  ],

  // Kaffebröd – kransar och kakor på kardemumma- eller wienerdeg.
  kaffebrod: [
    { id: 'blabar-mandelmassa', namn: 'Blåbär & mandelmassa', innehall: 'Vaniljkräm, mandelmassa, blåbärssylt & kardemummadeg', bild: 'blabar_mandelmassa1.jpg' },
    { id: 'butterkaka', namn: 'Butterkaka', innehall: 'Vaniljkräm, mandelmassa & kardemummadeg', bild: 'butterkaka.jpg' },
    { id: 'kanel', namn: 'Kanel', innehall: 'Kanel, smör & kardemummadeg', ikon: 'kanelbulle' },
    { id: 'kanel-mandelmassa', namn: 'Kanel & mandelmassa', innehall: 'Kanel, mandelmassa & kardemummadeg', bild: 'haga-krans.jpg' },
    { id: 'mandelmassa', namn: 'Mandelmassa', innehall: 'Mandelmassa & kardemummadeg', bild: 'mandelmassa-krans.jpg' },
    { id: 'pistage-hallon', namn: 'Pistage & hallon', innehall: 'Pistage, mandelmassa, hallonsylt & kardemummadeg', bild: 'pistage-hallon-krans.jpg' },
    { id: 'russin-sukat', namn: 'Russin & sukat', innehall: 'Mandelmassa, russin, sukat & kardemummadeg', bild: 'mandelmassa-russin-sukat-krans.jpg' },
    { id: 'slat-krans', namn: 'Slät krans', innehall: 'Kardemummadeg', bild: 'mandel-slat-krans.jpg' },
    { id: 'smorkrans', namn: 'Smörkrans', innehall: 'Smör, mandelmassa & kardemummadeg', bild: 'smor-krans.jpg' },
    { id: 'wienerkaka', namn: 'Wienerkaka', innehall: 'Vaniljkräm, mandelmassa, kristyr & wienerdeg', bild: 'wienerkaka.jpg' },
    { id: 'apple-kanel', namn: 'Äpple & kanel', innehall: 'Äpple, kanel, vaniljkräm & kardemummadeg', bild: 'apple-kanel-vanilj-krans.jpg' }
  ],

  // Exempel på specialtårtor som bakats genom åren (bilder från nuvarande hemsida).
  specialtartor: [
    { namn: 'Studentmössa', bild: 'Student2.jpg' },
    { namn: 'Flervåningstårta', bild: 'Emilia.jpg' },
    { namn: 'Dopdag', bild: 'Dopdag.jpg' },
    { namn: 'Prinsessa', bild: 'Veronica.jpg', pos: '50% 20%' },
    { namn: 'Fotboll', bild: 'Fotboll.jpg' },
    { namn: 'Häst', bild: 'Hast-862x678.jpg' },
    { namn: 'Nyckelpiga', bild: 'Nyckelpiga-862x588.jpg' },
    { namn: 'Övningskör', bild: 'Ovning-862x658.jpg' },
    { namn: 'Sköldpadda', bild: 'Skoldpadda.jpg' },
    { namn: 'Katt', bild: 'Katt3.jpg' },
    { namn: 'Pirat', bild: 'dodskalle.jpg' },
    { namn: 'Smörgås', bild: 'Smorgas.jpg' }
  ],

  // Ett urval av det som brukar finnas i disken (utbudet varierar med dag och säsong).
  disken: [
    { grupp: 'Bakelser & småkakor', ikon: 'mazarin', saker: ['Mazariner', 'Biskvier', 'Arraksbollar', 'Mockabakelser', 'Rulltårta', 'Tekakor', 'Fruktkaka'] },
    { grupp: 'Bullar & wienerbröd', ikon: 'kanelbulle', saker: ['Kanelbullar', 'Vaniljbullar', 'Wienerbröd', 'Semlor & wienersemlor (säsong)', 'Saffransbröd (advent)'] },
    { grupp: 'Bröd från stenugnen', ikon: 'brod', saker: ['Surdegsbröd', 'Rågbröd', 'Limpor', 'Frallor & småbröd'] },
    { grupp: 'Smörgåstårtor', ikon: 'smorgastarta', saker: ['Till studenten, dopet och kalaset', 'Beställs i förväg'] }
  ],

  // Konditoriets år. fran/till: 'MM-DD' eller 'fettisdagen', 'annandag-pask' (+ antal dagar).
  // Perioder som går över nyår fungerar (t.ex. 12-01 → 01-01).
  sasonger: [
    {
      id: 'semlor', namn: 'Semlor', period: 'Januari – fettisdagen', fran: '01-02', till: 'fettisdagen',
      ikon: 'semla', farg: 'smor', rubrik: 'Semmeltider!',
      text: 'Semlor och wienersemlor är det våra gäster pratar allra mest om – många kallar dem stans bästa. Ska du ha många till jobbet eller kalaset? Ring gärna dagen innan.'
    },
    {
      id: 'pask', namn: 'Påsk', period: 'Mars – april', fran: 'fettisdagen+1', till: 'annandag-pask',
      ikon: 'pask', farg: 'mint', rubrik: 'Påsk på konditoriet',
      text: 'Marsipan i disken och tårtor till påskbordet. Beställ tårtan senast dagen innan, så står den klar när du kommer.'
    },
    {
      id: 'student', namn: 'Studenten', period: 'Maj – juni', fran: 'annandag-pask+1', till: '06-20',
      ikon: 'student', farg: 'rosa', rubrik: 'Studenten & sommarens kalas',
      text: 'Examen, dop och sommarkalas – beställ tårta eller smörgåstårta i god tid. Specialtårtor, som vår studentmössa, behöver vi senast tre dagar innan.'
    },
    {
      id: 'sommar', namn: 'Sommartårtor', period: 'Juli – augusti', fran: '06-21', till: '08-31',
      ikon: 'tarta', farg: 'mint', rubrik: 'Sommarens tårtor',
      text: 'Gräddtårta med bär, frukttårta eller en klassisk prinsesstårta till trädgårdsfesten. Beställ senast dagen innan.'
    },
    {
      id: 'kanelbulle', namn: 'Kanelbullens dag', period: '4 oktober', fran: '09-01', till: '10-04',
      ikon: 'kanelbulle', farg: 'smor', rubrik: 'Kanelbullens dag – 4 oktober',
      text: 'Den 4 oktober firar hela Sverige kanelbullen – och vi med. {veckodag}'
    },
    {
      id: 'host', namn: 'Höstfika', period: 'Oktober – november', fran: '10-05', till: '11-30',
      ikon: 'krans', farg: 'rosa', rubrik: 'Höstfika',
      text: 'Mörka eftermiddagar kräver en krans till kaffet. Prova äpple & kanel eller en klassisk smörkrans – bakade på kardemummadeg.'
    },
    {
      id: 'jul', namn: 'Advent & jul', period: 'December', fran: '12-01', till: '01-01',
      ikon: 'lussekatt', farg: 'rosa', rubrik: 'Advent, lucia & jul',
      text: 'Saffran till adventsfikat och marsipan till julbordet. Beställ julens tårtor i god tid – dagarna före jul går fort.'
    }
  ]
};
