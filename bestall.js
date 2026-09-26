/* ==========================================================================
   Tårtbeställning – formulär, förhandsvisning och mejl till konditoriet
   --------------------------------------------------------------------------
   Beställningen skickas som ett förifyllt mejl (mailto). Vill ni hellre ta
   emot beställningar via en formulärtjänst (t.ex. Formspree eller Netlify
   Forms) räcker det att byta ut funktionen skickaBestallning() nedan.
   ========================================================================== */
(function () {
  'use strict';

  const M = window.MOHLINS;
  const T = window.MohlinsTid;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const form = $('[data-formular]');
  if (!form) return;

  const EXTRA = [
    { id: 'smorgastarta', namn: 'Smörgåstårta', ikon: 'smorgastarta', tint: 'mint', forvarning: M.forvarning.ordinarie },
    { id: 'specialtarta', namn: 'Specialtårta – egen idé', ikon: 'tarta', tint: 'rosa', forvarning: M.forvarning.special }
  ];
  const TARTOR = M.tartor.map((t) => ({ ...t, forvarning: M.forvarning.ordinarie })).concat(EXTRA);
  const hitta = (id) => TARTOR.find((t) => t.id === id);

  const falt = {
    tarta: $('#tarta'), bitar: $('#bitar'), datum: $('#datum'), tid: $('#tid'),
    text: $('#text'), onskemal: $('#onskemal'), allergier: $('#allergier'),
    namn: $('#namn'), telefon: $('#telefon'), epost: $('#epost')
  };

  /* ---------- Tårtlistan ---------- */

  falt.tarta.insertAdjacentHTML('beforeend',
    `<optgroup label="Ordinarie sortiment">${M.tartor.map((t) => `<option value="${esc(t.id)}">${esc(t.namn)}</option>`).join('')}</optgroup>` +
    `<optgroup label="Övrigt">${EXTRA.map((t) => `<option value="${esc(t.id)}">${esc(t.namn)}</option>`).join('')}</optgroup>`);

  const forval = new URLSearchParams(location.search).get('tarta');
  if (forval && hitta(forval)) falt.tarta.value = forval;

  /* ---------- Datum & tid ---------- */

  const dagOrd = (n) => (n === 1 ? 'dag' : 'dagar');
  const tillDatum = (varde) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(varde)) return null;
    const [a, m, d] = varde.split('-').map(Number);
    return new Date(Date.UTC(a, m - 1, d));
  };

  function tidigasteDatum(forvarning) {
    let d = T.plusDagar(T.stockholmNu().datum, forvarning);
    for (let i = 0; i < 30 && !T.tiderFor(d); i++) d = T.plusDagar(d, 1);
    return d;
  }

  function tidsval(d) {
    const tider = T.tiderFor(d);
    if (!tider) return [];
    const val = [];
    for (let m = T.iMinuter(tider[0]); m <= T.iMinuter(tider[1]) - 30; m += 30) {
      val.push(`${String(Math.floor(m / 60)).padStart(2, '0')}.${String(m % 60).padStart(2, '0')}`);
    }
    return val;
  }

  function aktuellTarta() { return hitta(falt.tarta.value); }

  // Returnerar ett felmeddelande för valt datum, eller '' om det är ok
  function kontrolleraDatum() {
    const d = tillDatum(falt.datum.value);
    if (!d) return 'Välj vilken dag du vill hämta tårtan.';
    const tarta = aktuellTarta();
    const forvarning = tarta ? tarta.forvarning : M.forvarning.ordinarie;
    const tidigast = tidigasteDatum(forvarning);
    if (d < T.stockholmNu().datum) return 'Det datumet har redan varit – välj ett senare.';
    if (!T.tiderFor(d)) {
      const avvik = M.avvikandeDagar && M.avvikandeDagar[T.isoDatum(d)];
      return avvik
        ? `Vi har stängt den dagen${avvik.namn ? ` (${avvik.namn.toLowerCase()})` : ''} – välj en annan dag.`
        : `Vi har stängt ${T.DAGAR[d.getUTCDay()]}ar – välj en annan dag.`;
    }
    if (d < tidigast) {
      return `${tarta ? tarta.namn.split(' – ')[0] : 'Tårtan'} behöver beställas minst ${forvarning} ${dagOrd(forvarning)} i förväg – välj ${T.datumText(tidigast)} eller senare.`;
    }
    return '';
  }

  function uppdateraTarta() {
    const tarta = aktuellTarta();
    const hjalp = $('[data-datum-hjalp]');
    if (tarta) {
      const tidigast = tidigasteDatum(tarta.forvarning);
      falt.datum.min = T.isoDatum(tidigast);
      hjalp.textContent = `Tidigast ${T.datumText(tidigast)}. Vi har stängt på söndagar.`;
      $('[data-tarta-info]').innerHTML = tarta.innehall
        ? `${esc(tarta.innehall)}.${tarta.not ? ` <strong>${esc(tarta.not)}</strong>` : ''}`
        : tarta.id === 'specialtarta'
          ? 'Beskriv din idé under <em>Övriga önskemål</em> – tema, figur, färger. Beställ minst tre dagar i förväg.'
          : 'Beskriv gärna önskad fyllning under <em>Övriga önskemål</em>, så hör vi av oss.';
    } else {
      falt.datum.removeAttribute('min');
      hjalp.textContent = 'Välj tårta först, så ser du första möjliga dag.';
      $('[data-tarta-info]').innerHTML = 'Osäker? Titta bland alla tårtor i <a href="sortiment.html#tartor">sortimentet</a>.';
    }
    if (falt.datum.value) uppdateraDatum();
  }

  function uppdateraDatum() {
    const fel = kontrolleraDatum();
    visaFel('datum', falt.datum.value ? fel : '');
    const valdTid = falt.tid.value;
    const d = tillDatum(falt.datum.value);
    const val = !fel && d ? tidsval(d) : [];
    falt.tid.innerHTML = val.length
      ? '<option value="">Välj tid …</option>' + val.map((t) => `<option value="${t}"${t === valdTid ? ' selected' : ''}>kl. ${t}</option>`).join('')
      : '<option value="">Välj datum först</option>';
  }

  /* ---------- Fel ---------- */

  function visaFel(namn, meddelande) {
    const f = falt[namn];
    const ruta = $(`[data-fel="${namn}"]`);
    if (ruta) ruta.textContent = meddelande;
    if (f) {
      if (meddelande) f.setAttribute('aria-invalid', 'true');
      else f.removeAttribute('aria-invalid');
    }
  }

  function validera() {
    const fel = {
      tarta: falt.tarta.value ? '' : 'Välj vilken tårta du vill beställa.',
      datum: kontrolleraDatum(),
      tid: falt.tid.value ? '' : 'Välj en tid för upphämtning.',
      namn: falt.namn.value.trim() ? '' : 'Skriv ditt namn.',
      telefon: (falt.telefon.value.match(/\d/g) || []).length >= 7 ? '' : 'Skriv ett telefonnummer så att vi kan nå dig.',
      epost: !falt.epost.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(falt.epost.value.trim()) ? '' : 'Kontrollera e-postadressen.'
    };
    Object.entries(fel).forEach(([namn, text]) => visaFel(namn, text));
    const forsta = Object.keys(fel).find((namn) => fel[namn]);
    if (forsta) falt[forsta].focus();
    return !forsta;
  }

  /* ---------- Sammanfattning & förhandsvisning ---------- */

  function valdFarg() {
    const val = $('input[name="farg"]:checked', form);
    return { namn: val ? val.value : '', hex: val ? val.dataset.hex : '' };
  }

  function uppgifter() {
    const tarta = aktuellTarta();
    const d = tillDatum(falt.datum.value);
    const farg = valdFarg();
    return {
      tarta: tarta ? tarta.namn : '',
      bitar: falt.bitar.value,
      hamtas: d && falt.tid.value ? `${T.datumText(d)} kl. ${falt.tid.value}` : '',
      text: falt.text.value.trim(),
      farg: farg.namn,
      onskemal: falt.onskemal.value.trim(),
      allergier: falt.allergier.value.trim(),
      namn: falt.namn.value.trim(),
      telefon: falt.telefon.value.trim(),
      epost: falt.epost.value.trim()
    };
  }

  function uppdateraKvitto() {
    const u = uppgifter();
    const rad = (etikett, varde) => `<dt>${etikett}</dt><dd${varde ? '' : ' class="tom"'}>${varde ? esc(varde) : '–'}</dd>`;
    $('[data-kvitto]').innerHTML =
      rad('Tårta', u.tarta) +
      rad('Bitar', u.bitar ? `ca ${u.bitar} st` : '') +
      rad('Hämtas', u.hamtas) +
      rad('Text', u.text ? `”${u.text}”` : '') +
      rad('Färg', u.farg || (u.tarta ? 'Ingen önskan' : '')) +
      rad('Önskemål', u.onskemal) +
      rad('Allergier', u.allergier) +
      rad('Namn', u.namn) +
      rad('Telefon', u.telefon) +
      (u.epost ? rad('E-post', u.epost) : '');

    const tarta = aktuellTarta();
    const fat = $('[data-forhands]');
    const nyckel = tarta ? tarta.id : '';
    if (fat.dataset.tarta !== nyckel) {
      fat.dataset.tarta = nyckel;
      fat.innerHTML = tarta && tarta.bild
        ? `<div class="fat-bild" style="--zoom: 1.25"><img src="${M.foton}${esc(tarta.bild)}" alt=""></div>`
        : `<span class="fat-ikon" style="--tint: var(--${tarta ? tarta.tint : 'mandel'})"><svg class="icon" aria-hidden="true"><use href="#i-${tarta ? tarta.ikon : 'tarta'}"/></svg></span>`;
    }
    const skylt = $('[data-skylt]');
    skylt.textContent = u.text;
    skylt.style.setProperty('--skylt', valdFarg().hex || '#fff8ea');
    $('[data-tecken]').textContent = String(40 - falt.text.value.length);
  }

  /* ---------- Skicka ---------- */

  function mejltext(u) {
    const r = (etikett, varde) => `${etikett}: ${varde || '–'}`;
    return [
      'Hej Mohlins!',
      '',
      'Jag vill beställa en tårta:',
      '',
      r('Tårta', u.tarta),
      r('Antal bitar', u.bitar),
      r('Hämtas', u.hamtas),
      r('Text på tårtan', u.text),
      r('Färgönskemål', u.farg || 'Ingen önskan'),
      r('Övriga önskemål', u.onskemal),
      r('Allergier/specialkost', u.allergier),
      '',
      r('Namn', u.namn),
      r('Telefon', u.telefon),
      r('E-post', u.epost),
      '',
      'Jag förstår att beställningen gäller först när ni har bekräftat den.',
      '',
      'Vänliga hälsningar',
      u.namn
    ].join('\r\n');
  }

  function mejllank(u) {
    const d = tillDatum(falt.datum.value);
    const amne = `Tårtbeställning: ${u.tarta}${d ? ` – ${T.DAGAR[d.getUTCDay()].slice(0, 3)} ${d.getUTCDate()}/${d.getUTCMonth() + 1}` : ''}`;
    return `mailto:${M.kontakt.epost}?subject=${encodeURIComponent(amne)}&body=${encodeURIComponent(mejltext(u))}`;
  }

  function skickaBestallning(u) {
    const lank = mejllank(u);
    $('[data-mejl-igen]').href = lank;
    const klart = $('[data-klart]');
    klart.hidden = false;
    klart.scrollIntoView({ behavior: 'smooth', block: 'start' });
    klart.focus({ preventScroll: true });
    window.location.href = lank;
  }

  async function kopiera(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ruta = document.createElement('textarea');
      ruta.value = text;
      ruta.setAttribute('readonly', '');
      ruta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ruta);
      ruta.select();
      const ok = document.execCommand('copy');
      ruta.remove();
      return ok;
    }
  }

  /* ---------- Händelser ---------- */

  falt.tarta.addEventListener('change', () => { visaFel('tarta', ''); uppdateraTarta(); });
  falt.datum.addEventListener('change', uppdateraDatum);
  falt.tid.addEventListener('change', () => visaFel('tid', ''));
  ['namn', 'telefon', 'epost'].forEach((n) => falt[n].addEventListener('input', () => {
    if (falt[n].getAttribute('aria-invalid')) visaFel(n, '');
  }));

  $$('[data-steg]').forEach((knapp) => knapp.addEventListener('click', () => {
    const nu = parseInt(falt.bitar.value, 10) || 10;
    const steg = nu >= 30 ? 5 : nu >= 12 ? 2 : 1;
    const nytt = Math.min(150, Math.max(4, nu + Number(knapp.dataset.steg) * steg));
    falt.bitar.value = nytt;
    uppdateraKvitto();
  }));
  falt.bitar.addEventListener('change', () => {
    const v = parseInt(falt.bitar.value, 10);
    falt.bitar.value = Number.isFinite(v) ? Math.min(150, Math.max(4, v)) : 10;
    uppdateraKvitto();
  });

  form.addEventListener('input', uppdateraKvitto);
  form.addEventListener('change', uppdateraKvitto);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validera()) skickaBestallning(uppgifter());
  });

  $('[data-kopiera]').addEventListener('click', async (e) => {
    const knapp = e.currentTarget;
    const ok = await kopiera(mejltext(uppgifter()));
    $('span', knapp).textContent = ok ? 'Kopierat!' : 'Kunde inte kopiera';
    setTimeout(() => { $('span', knapp).textContent = 'Kopiera beställningen'; }, 2500);
  });

  uppdateraTarta();
  uppdateraKvitto();
})();
