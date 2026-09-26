/* ==========================================================================
   Mohlins Konditori – gemensamma funktioner för alla sidor
   ========================================================================== */
(function () {
  'use strict';

  const M = window.MOHLINS;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  /* ---------- Datum & tid (alltid svensk tid) ---------- */

  const DAGAR = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
  const KORTA_DAGAR = ['sön', 'mån', 'tis', 'ons', 'tor', 'fre', 'lör'];
  const MANADER = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];

  // Datum representeras som Date vid midnatt UTC så att sommartid inte ställer till det.
  function stockholmNu() {
    const delar = {};
    new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date()).forEach((p) => { delar[p.type] = p.value; });
    return {
      datum: new Date(Date.UTC(+delar.year, +delar.month - 1, +delar.day)),
      minuter: (+delar.hour) * 60 + (+delar.minute)
    };
  }

  const isoDatum = (d) => d.toISOString().slice(0, 10);
  const plusDagar = (d, n) => { const x = new Date(d); x.setUTCDate(x.getUTCDate() + n); return x; };
  const klockslag = (s) => s.replace(':', '.');
  const iMinuter = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const versal = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const datumText = (d) => `${DAGAR[d.getUTCDay()]} ${d.getUTCDate()} ${MANADER[d.getUTCMonth()]}`;

  // Öppettider för ett visst datum, med hänsyn till avvikande dagar. null = stängt.
  function tiderFor(d) {
    const avvik = M.avvikandeDagar && M.avvikandeDagar[isoDatum(d)];
    if (avvik) return avvik.tider;
    return M.oppettider[d.getUTCDay()];
  }

  function oppetStatus() {
    const { datum, minuter } = stockholmNu();
    const idag = tiderFor(datum);
    if (idag) {
      const oppnar = iMinuter(idag[0]);
      const stanger = iMinuter(idag[1]);
      if (minuter >= oppnar && minuter < stanger) {
        return stanger - minuter <= 30
          ? { oppet: 'snart', text: `Stänger snart · ${klockslag(idag[1])}` }
          : { oppet: 'ja', text: `Öppet nu · stänger ${klockslag(idag[1])}` };
      }
      if (minuter < oppnar) return { oppet: 'nej', text: `Stängt · öppnar i dag ${klockslag(idag[0])}` };
    }
    for (let i = 1; i <= 21; i++) {
      const dag = plusDagar(datum, i);
      const tider = tiderFor(dag);
      if (tider) {
        const namn = i === 1 ? 'i morgon' : DAGAR[dag.getUTCDay()];
        return { oppet: 'nej', text: `Stängt · öppnar ${namn} ${klockslag(tider[0])}` };
      }
    }
    return { oppet: 'nej', text: 'Stängt' };
  }

  function visaStatus() {
    const s = oppetStatus();
    $$('[data-status]').forEach((el) => { el.textContent = s.text; el.dataset.oppet = s.oppet; });
  }

  // Slår ihop dagar i följd med samma tider: "Mån – fre 07.00 – 18.30"
  function veckogrupper() {
    const grupper = [];
    [1, 2, 3, 4, 5, 6, 0].forEach((dag) => {
      const tider = M.oppettider[dag];
      const nyckel = tider ? tider.join('-') : 'stangt';
      const sista = grupper[grupper.length - 1];
      if (sista && sista.nyckel === nyckel) sista.dagar.push(dag);
      else grupper.push({ nyckel, tider, dagar: [dag] });
    });
    return grupper.map((g) => ({
      dagar: g.dagar,
      namn: g.dagar.length > 1
        ? `${versal(KORTA_DAGAR[g.dagar[0]])} – ${KORTA_DAGAR[g.dagar[g.dagar.length - 1]]}`
        : versal(DAGAR[g.dagar[0]]),
      tider: g.tider ? `${klockslag(g.tider[0])} – ${klockslag(g.tider[1])}` : 'Stängt'
    }));
  }

  function visaOppettider() {
    const { datum } = stockholmNu();
    const idag = datum.getUTCDay();
    const grupper = veckogrupper();

    $$('[data-tavla]').forEach((el) => {
      el.innerHTML = grupper.map((g) => `
        <div class="tavla-rad${g.dagar.includes(idag) ? ' idag' : ''}">
          <span class="tavla-dag">${g.namn}</span><span class="tavla-tid">${g.tider}</span>
        </div>`).join('');
    });

    $$('[data-tider-kort]').forEach((el) => {
      el.innerHTML = grupper.map((g) => `${g.namn} ${g.tider.toLowerCase()}`).join('<br>');
    });

    $$('[data-tider]').forEach((tabell) => {
      tabell.innerHTML = '<caption class="visually-hidden">Öppettider per veckodag</caption><tbody>' +
        [1, 2, 3, 4, 5, 6, 0].map((dag) => {
          const t = M.oppettider[dag];
          return `<tr${dag === idag ? ' class="idag"' : ''}><th scope="row">${versal(DAGAR[dag])}</th>` +
            `<td>${t ? `${klockslag(t[0])} – ${klockslag(t[1])}` : 'Stängt'}</td></tr>`;
        }).join('') + '</tbody>';
    });

    // Avvikande öppettider de kommande tre veckorna
    const kommande = [];
    for (let i = 0; i <= 21; i++) {
      const d = plusDagar(datum, i);
      const avvik = M.avvikandeDagar && M.avvikandeDagar[isoDatum(d)];
      if (avvik) {
        const tid = avvik.tider ? `${klockslag(avvik.tider[0])} – ${klockslag(avvik.tider[1])}` : 'stängt';
        kommande.push(`${versal(datumText(d))}${avvik.namn ? ` (${avvik.namn})` : ''}: ${tid}`);
      }
    }
    $$('[data-avvikande]').forEach((el) => {
      el.hidden = kommande.length === 0;
      el.innerHTML = kommande.length ? `<strong>Avvikande öppettider</strong><br>${kommande.join('<br>')}` : '';
    });
  }

  /* ---------- Säsonger ---------- */

  // Påskdagen enligt den gregorianska "anonyma" algoritmen
  function paskdagen(ar) {
    const a = ar % 19, b = Math.floor(ar / 100), c = ar % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    const manad = Math.floor((h + l - 7 * m + 114) / 31);
    const dag = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Date.UTC(ar, manad - 1, dag));
  }

  function tolkaDatum(uttryck, ar) {
    const [bas, plus] = uttryck.split('+');
    let d;
    if (bas === 'fettisdagen') d = plusDagar(paskdagen(ar), -47);
    else if (bas === 'annandag-pask') d = plusDagar(paskdagen(ar), 1);
    else {
      const [mm, dd] = bas.split('-').map(Number);
      d = new Date(Date.UTC(ar, mm - 1, dd));
    }
    return plus ? plusDagar(d, Number(plus)) : d;
  }

  function aktuellSasong(datum) {
    const ar = datum.getUTCFullYear();
    return M.sasonger.find((s) => {
      const fran = tolkaDatum(s.fran, ar);
      const till = tolkaDatum(s.till, ar);
      return till < fran ? (datum >= fran || datum <= till) : (datum >= fran && datum <= till);
    }) || M.sasonger[0];
  }

  function sasongText(s, datum) {
    if (s.id === 'semlor') {
      const fettisdag = tolkaDatum('fettisdagen', datum.getUTCFullYear());
      return `${s.text} Fettisdagen är i år ${datumText(fettisdag)}.`;
    }
    if (s.id !== 'kanelbulle') return s.text;
    const ar = datum.getUTCFullYear();
    const dagen = new Date(Date.UTC(ar, 9, 4));
    const tider = tiderFor(dagen);
    const veckodag = DAGAR[dagen.getUTCDay()];
    let tillagg;
    if (tider) {
      tillagg = `I år infaller den på en ${veckodag} – välkommen in mellan ${klockslag(tider[0])} och ${klockslag(tider[1])}!`;
    } else {
      let fore = plusDagar(dagen, -1);
      while (!tiderFor(fore)) fore = plusDagar(fore, -1);
      tillagg = `I år infaller den på en ${veckodag}, då vi har stängt – så passa på ${DAGAR[fore.getUTCDay()]}en den ${fore.getUTCDate()} ${MANADER[fore.getUTCMonth()]}.`;
    }
    return s.text.replace('{veckodag}', tillagg);
  }

  function initSasonger() {
    const lista = $('[data-arets-lista]');
    const kort = $('[data-sasong-kort]');
    if (!lista || !kort) return;
    const { datum } = stockholmNu();
    const nu = aktuellSasong(datum);

    const visa = (s, animera) => {
      kort.style.setProperty('--tint', `var(--${s.farg})`);
      kort.classList.remove('byter');
      kort.innerHTML = `
        <div class="sasong-topp">
          <span class="sasong-ikon"><svg class="icon" aria-hidden="true"><use href="#i-${s.ikon}"/></svg></span>
          <span class="etikett${s === nu ? ' etikett--nu' : ''}">${s === nu ? 'Just nu' : s.period}</span>
        </div>
        <h3>${s.rubrik}</h3>
        <p>${sasongText(s, datum)}</p>
        <div class="sasong-knappar">
          <a class="btn btn-primar btn-liten" href="bestall.html">Beställ tårta</a>
          <a class="btn btn-sekundar btn-liten" href="${M.kontakt.telefonLank}">Ring ${M.kontakt.telefon}</a>
        </div>`;
      if (animera) { void kort.offsetWidth; kort.classList.add('byter'); }
      $$('button', lista).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === s.id)));
    };

    lista.innerHTML = M.sasonger.map((s) => `
      <li>
        <button type="button" data-id="${s.id}" aria-pressed="false" style="--tint: var(--${s.farg})">
          <span class="mini-ikon"><svg class="icon" aria-hidden="true"><use href="#i-${s.ikon}"/></svg></span>
          <span class="namn">${s.namn}${s === nu ? '<span class="etikett etikett--nu nu">Just nu</span>' : ''}</span>
          <span class="period">${s.period}</span>
        </button>
      </li>`).join('');

    lista.addEventListener('click', (e) => {
      const knapp = e.target.closest('button[data-id]');
      if (knapp) visa(M.sasonger.find((s) => s.id === knapp.dataset.id), true);
    });
    visa(nu, false);
  }

  /* ---------- Sidhuvud & meny ---------- */

  function initSidhuvud() {
    const huvud = $('[data-sidhuvud]');
    if (huvud) {
      const uppdatera = () => huvud.classList.toggle('skuggad', window.scrollY > 8);
      uppdatera();
      window.addEventListener('scroll', uppdatera, { passive: true });
    }

    const meny = $('[data-meny]');
    const knapp = meny && $('.menyknapp', meny);
    if (!knapp) return;
    const stang = () => {
      meny.classList.remove('oppen');
      knapp.setAttribute('aria-expanded', 'false');
      $('use', knapp).setAttribute('href', '#i-meny');
    };
    knapp.addEventListener('click', () => {
      const oppen = meny.classList.toggle('oppen');
      knapp.setAttribute('aria-expanded', String(oppen));
      $('use', knapp).setAttribute('href', oppen ? '#i-stang' : '#i-meny');
    });
    $$('a', meny).forEach((a) => a.addEventListener('click', stang));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') stang(); });
    document.addEventListener('click', (e) => { if (!meny.contains(e.target)) stang(); });
  }

  /* ---------- Karta (laddas först när besökaren ber om det) ---------- */

  function initKarta() {
    $$('[data-karta-knapp]').forEach((knapp) => {
      knapp.addEventListener('click', () => {
        const karta = knapp.closest('[data-karta]');
        const iframe = document.createElement('iframe');
        iframe.src = M.kontakt.karta;
        iframe.title = 'Karta över Mohlins Konditori, Gamla Björlandavägen 145';
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        karta.innerHTML = '';
        karta.appendChild(iframe);
      });
    });
  }

  /* ---------- Småsaker ---------- */

  function initSmasaker() {
    const ar = stockholmNu().datum.getUTCFullYear();
    $$('[data-ar-sedan]').forEach((el) => { el.textContent = ar - Number(el.dataset.arSedan); });
    $$('[data-arsal]').forEach((el) => { el.textContent = ar; });

    const element = $$('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      element.forEach((el) => el.classList.add('synlig'));
      return;
    }
    const iakttagare = new IntersectionObserver((poster) => {
      poster.forEach((p) => {
        if (p.isIntersecting) { p.target.classList.add('synlig'); iakttagare.unobserve(p.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    element.forEach((el) => iakttagare.observe(el));
  }

  // Delas med bestall.js och sortiment.js
  window.MohlinsTid = { stockholmNu, tiderFor, plusDagar, isoDatum, klockslag, iMinuter, datumText, DAGAR, MANADER };

  visaOppettider();
  visaStatus();
  setInterval(visaStatus, 60 * 1000);
  initSasonger();
  initSidhuvud();
  initKarta();
  initSmasaker();
})();
