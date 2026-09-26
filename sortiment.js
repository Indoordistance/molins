/* ==========================================================================
   Sortimentssidan – bygger listorna från data.js och sköter sök & filter
   ========================================================================== */
(function () {
  'use strict';

  const M = window.MOHLINS;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s).toLocaleLowerCase('sv-SE').trim();

  // Snabbfilter för tårtor, baserat på innehållet i data.js
  const INGREDIENSER = [
    { id: 'marsipan', namn: 'Marsipan', test: /marsipan/ },
    { id: 'choklad', namn: 'Choklad', test: /choklad/ },
    { id: 'mocka', namn: 'Mocka', test: /mocka|mocca/ },
    { id: 'frukt', namn: 'Frukt & bär', test: /frukt|bär|banan|päron|ananas|hallon|mandarin|äpple/ },
    { id: 'marang', namn: 'Maräng', test: /maräng/ },
    { id: 'smordeg', namn: 'Smördeg', test: /smördeg/ },
    { id: 'rom', namn: 'Med rom', test: /romfromage|romgrädde|romfrukter/ }
  ];

  function fat(p) {
    if (p.bild) {
      const stil = [p.zoom ? `--zoom: ${p.zoom}` : '', p.pos ? `--pos: ${p.pos}` : ''].filter(Boolean).join('; ');
      return `<div class="fat"><div class="fat-bild"${stil ? ` style="${stil}"` : ''}><img src="${M.foton}${esc(p.bild)}" alt="" loading="lazy" decoding="async"></div></div>`;
    }
    return `<div class="fat"><span class="fat-ikon" style="--tint: var(--smor)"><svg class="icon" aria-hidden="true"><use href="#i-${esc(p.ikon || 'tarta')}"/></svg></span></div>`;
  }

  function renderaTartor() {
    $('[data-lista="tartor"]').innerHTML = M.tartor.map((t) => `
      <article class="produkt" data-text="${esc(norm(`${t.namn} ${t.innehall}`))}">
        ${fat(t)}
        <h3>${esc(t.namn)}</h3>
        <p>${esc(t.innehall)}</p>
        ${t.not ? `<p class="not">${esc(t.not)}</p>` : ''}
        <a class="lank-pil" href="bestall.html?tarta=${encodeURIComponent(t.id)}">Beställ <span class="visually-hidden">${esc(t.namn)}</span><svg class="icon" aria-hidden="true"><use href="#i-pil"/></svg></a>
      </article>`).join('');

    $('[data-chips]').innerHTML = INGREDIENSER
      .filter((ing) => M.tartor.some((t) => ing.test.test(norm(t.innehall))))
      .map((ing) => `<button class="chip" type="button" data-chip="${ing.id}" aria-pressed="false">${esc(ing.namn)}</button>`)
      .join('');
  }

  function renderaKaffebrod() {
    $('[data-lista="kaffebrod"]').innerHTML = M.kaffebrod.map((k) => `
      <article class="produkt" data-text="${esc(norm(`${k.namn} ${k.innehall} kaffebröd krans`))}">
        ${fat(k)}
        <h3>${esc(k.namn)}</h3>
        <p>${esc(k.innehall)}</p>
      </article>`).join('');
  }

  function renderaSpecial() {
    const vinklar = [-2.4, 1.6, -1.1, 2.2, -1.7, 1.1];
    $('[data-lista="special"]').innerHTML = M.specialtartor.map((s, i) => `
      <figure class="polaroid" style="--rot: ${vinklar[i % vinklar.length]}deg${s.pos ? `; --pos: ${s.pos}` : ''}" data-text="${esc(norm(`${s.namn} specialtårta`))}">
        <img src="${M.foton}${esc(s.bild)}" alt="Specialtårta: ${esc(s.namn)}" loading="lazy" decoding="async">
        <figcaption>${esc(s.namn)}</figcaption>
      </figure>`).join('');
  }

  function renderaDisken() {
    $('[data-lista="disken"]').innerHTML = M.disken.map((g) => `
      <div class="disk-grupp" data-grupp="${esc(norm(g.grupp))}">
        <h3><span class="mini-ikon"><svg class="icon" aria-hidden="true"><use href="#i-${esc(g.ikon)}"/></svg></span>${esc(g.grupp)}</h3>
        <ul>${g.saker.map((s) => `<li data-text="${esc(norm(s))}">${esc(s)}</li>`).join('')}</ul>
      </div>`).join('');
  }

  /* ---------- Filtrering ---------- */

  const lage = { kategori: 'alla', sok: '', chip: null };

  function filtrera() {
    const ord = norm(lage.sok).split(/\s+/).filter(Boolean);
    const traffar = (text) => ord.every((o) => text.includes(o));
    const chip = INGREDIENSER.find((i) => i.id === lage.chip);
    let totalt = 0;

    $$('[data-sektion]').forEach((sektion) => {
      const id = sektion.dataset.sektion;
      let synliga = 0;

      if (id === 'disken') {
        $$('.disk-grupp', sektion).forEach((grupp) => {
          const gruppTraff = ord.length > 0 && traffar(grupp.dataset.grupp);
          let antal = 0;
          $$('li', grupp).forEach((li) => {
            const visa = !ord.length || gruppTraff || traffar(li.dataset.text);
            li.hidden = !visa;
            if (visa) antal++;
          });
          grupp.hidden = antal === 0;
          synliga += antal;
        });
      } else {
        $$('[data-text]', sektion).forEach((kort) => {
          const text = kort.dataset.text;
          const visa = traffar(text) && (id !== 'tartor' || !chip || chip.test.test(text));
          kort.hidden = !visa;
          if (visa) synliga++;
        });
      }

      const iKategori = lage.kategori === 'alla' || lage.kategori === id;
      sektion.hidden = !iKategori || synliga === 0;
      if (iKategori) totalt += synliga;
    });

    $('[data-tomt]').hidden = totalt > 0;
    $('[data-sokresultat]').textContent = ord.length || chip ? `${totalt} träffar` : '';
    $$('[data-chip]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.chip === lage.chip)));
    $$('[data-kategori]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.kategori === lage.kategori)));
  }

  function tillKatalogen() {
    const rubrik = $('.sidrubrik');
    const huvud = $('[data-sidhuvud]');
    const y = rubrik.offsetTop + rubrik.offsetHeight - (huvud ? huvud.offsetHeight : 0);
    if (window.scrollY > y) window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function init() {
    if (!$('[data-lista="tartor"]')) return;
    renderaTartor();
    renderaKaffebrod();
    renderaSpecial();
    renderaDisken();
    $('[data-antal="tartor"]').textContent = M.tartor.length;
    $('[data-antal="kaffebrod"]').textContent = M.kaffebrod.length;

    const fran = location.hash.slice(1);
    if ($(`[data-kategori="${CSS.escape(fran)}"]`)) lage.kategori = fran;

    $$('[data-kategori]').forEach((knapp) => knapp.addEventListener('click', () => {
      lage.kategori = knapp.dataset.kategori;
      history.replaceState(null, '', lage.kategori === 'alla' ? location.pathname + location.search : `#${lage.kategori}`);
      filtrera();
      tillKatalogen();
    }));

    $('[data-chips]').addEventListener('click', (e) => {
      const knapp = e.target.closest('[data-chip]');
      if (!knapp) return;
      lage.chip = lage.chip === knapp.dataset.chip ? null : knapp.dataset.chip;
      filtrera();
    });

    let fordrojning;
    $('[data-sok]').addEventListener('input', (e) => {
      clearTimeout(fordrojning);
      fordrojning = setTimeout(() => { lage.sok = e.target.value; filtrera(); }, 120);
    });

    filtrera();
    if (fran && lage.kategori === fran) window.scrollTo(0, 0);
  }

  init();
})();
