/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'la-mercerie-des-reves',
    /* nessun WhatsApp: il fisso della scheda Google */
    whatsapp: { number: '', message: '', ids: [] },
    /* pannello Google (30/9/2026): lunedì 15–19, martedì–sabato 10–14 e 14:30–19, domenica chiuso (uguale su TuttaMilano) */
    hours: {
      0: [], 1: [['15:00', '19:00']], 2: [['10:00', '14:00'], ['14:30', '19:00']], 3: [['10:00', '14:00'], ['14:30', '19:00']],
      4: [['10:00', '14:00'], ['14:30', '19:00']], 5: [['10:00', '14:00'], ['14:30', '19:00']], 6: [['10:00', '14:00'], ['14:30', '19:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1060,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "La Mercerie des Rêves: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.colori": "By colour",
      "n.cassetti": "The drawers",
      "n.ordinazione": "Made to order",
      "n.bottega": "The shop",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.sopra": "Haberdashery · Via Terraggio 21, a short walk from Sant’Ambrogio",
      "h.titolo": "There is a place in Milan where every thread has its place.",
      "h.seconda": "Every trimming in its right spot, all sorted by colour, thickness and weight.",
      "h.testo": "Ribbons and trimmings, buttons, embroidery threads and kits, American cotton fabrics, linen for the home and for newborns; and Sabine’s embroidery, made to order.",
      "h.google": "on Google, 80 reviews",
      "h.chi": "maria ficetti, in a review on Google (in English: «The name doesn’t lie: you will really find the place of dreams.»)",
      "p.titolo": "The ribbon",
      "p.desc": "In front of the wall of ribbons in rows by colour, under the polka-dot bunting: a spool and a parcel on the counter. The ribbon unrolls and goes round the parcel, across and lengthwise; the scissors cut, the rest winds back onto the spool; a bow opens on the crossing and a tag hangs from it reading «dal 1987». Three ribbons: pink polka dot, gingham, gold.",
      "p.d0": "Pink polka dot: like the bunting in the shop.",
      "p.d1": "Gingham: the red check of the cotton fabrics.",
      "p.d2": "Gold: the ribbon for celebrations.",
      "p.modi": "Which ribbon",
      "p.b0": "Pink polka dot",
      "p.b1": "Gingham",
      "p.b2": "Gold",
      "p.nota": "Ribbon by the metre: it unrolls, goes round the parcel, gets cut, becomes a bow.",
      "c.etichetta": "Sorted by colour",
      "c.titolo": "A treasure chest of things you can’t find elsewhere",
      "a.colori": "The wall of ribbons: three wooden sections, the rolls in rows from white to yellow, orange and red, then blues and greens, then pinks and purples.",
      "k.colori": "The wall of ribbons, in rows by colour",
      "c.p1": "«There is a place in Milan where choosing a single button becomes a creative act, buying a spool of thread a moment of reflection, where sewing and embroidery enjoy their proud independence…»",
      "c.p2": "At Sabine’s you come in for a ribbon and leave with an idea: rolls in every colour and width, French trimmings, buttons to choose one by one, threads for embroidery.",
      "c.nota": "Our own words, from our website (in Italian).",
      "s.etichetta": "In the drawers",
      "s.titolo": "What you will find here",
      "s.sotto": "Like the drawers in the shop, each with its own label. No prices: to find out if we have what you are looking for, give us a call.",
      "s.n1": "Ribbons and trimmings",
      "s.n2": "Buttons",
      "s.n3": "Embroidery",
      "s.n4": "Fabrics and toile de Jouy",
      "s.n5": "For newborns",
      "s.n6": "Friulane slippers",
      "a.passamanerie": "Rolls of jacquard trimmings with flowers, red, pink, ecru and gold, in a drawer.",
      "s.t1": "Ribbon rolls in every colour and width, jacquard trimmings, fringes, bias bindings and lace.",
      "s.t2": "Fancy, vintage, mother-of-pearl and gold buttons: to choose one by one, even for a single garment.",
      "a.ricamo": "A cross-stitch heart on white canvas, with the needle and the red thread.",
      "s.t3": "Embroidery threads in every variety, mouliné, cotton, wool and perlé; Aida cloth, hoops, kits and patterns, vintage ones too.",
      "a.toile": "Red toile de Jouy: embroidered bags, a plate and a teapot.",
      "s.t4": "«American fabrics, linen for the home and refined objects. Discover how to embroider and personalise your world to make it unique»",
      "a.nascita": "Printed cotton bags, bibs with a scalloped edge ready to embroider, headbands.",
      "s.t5": "«A careful selection of personalisable items for birth and early childhood»: bibs to embroider, bags, layettes.",
      "a.friulane": "Two velvet friulane slippers, one pink and one green, next to the fringes.",
      "s.t6": "«Bring us your Friulane, we decorate them with trimmings in so many possible colours and combinations!»",
      "o2.etichetta": "Made to order",
      "o2.titolo": "You can dream it, we can make it for you.",
      "o2.p1": "«And for those who can’t embroider, Sabine embroiders and decorates anything to order […]»",
      "o2.p2": "Initials and monograms on household linen, layettes and bibs for newborns, trimmings on your friulane slippers. You can also order by phone.",
      "a.ordinazione": "A pink-striped linen tea towel with an embroidered M and a lace edge, on red toile plates.",
      "k.ordinazione": "An «M» embroidered on a linen tea towel",
      "a.cerchietti": "Headbands covered in small-flower fabric, resting on a cross-stitch embroidery with a rose.",
      "k.cerchietti": "The fabric headbands, on one of our cross-stitch pieces",
      "b.etichetta": "The shop",
      "b.titolo": "A place to discover",
      "a.negozio": "Inside the shop: the bunting, the bell lamps, the wooden shelves with ribbons in rows by colour, the fabrics on the counter.",
      "k.negozio": "Inside, under the bunting",
      "a.scaffali": "The ribbon shelves, pink, blue, white and ecru, and the headbands on the counter.",
      "k.scaffali": "The shelves",
      "a.jacquard": "Rolls of embroidered trimmings with flowers, diamonds and stripes.",
      "k.jacquard": "The embroidered trimmings",
      "a.vetrina": "The shop window: gingham, red candles, headbands; behind, the wall of ribbons.",
      "k.vetrina": "The shop window",
      "a.mensole": "The wooden shelves with frames, candlesticks, little fabric trees and small objects for the home.",
      "k.mensole": "Objects for the home",
      "a.sera": "The shop window at night, with the wooden letters MERCERIE on the mezzanine.",
      "k.sera": "The shop window, at night",
      "a.facciata": "The pink façade of Via Terraggio 21: the glass door with its wrought-iron fanlight and the pots of white flowers.",
      "k.facciata": "Via Terraggio 21",
      "d.etichetta": "Reviews",
      "d.titolo": "Written by you",
      "d.google": "on Google, 80 reviews",
      "d.g9m": "Google, 9 months ago",
      "d.g4a": "Google, 4 years ago",
      "d.g2m": "Google, 2 months ago",
      "d.g5a": "Google, 5 years ago",
      "d.nota": "From the reviews on Google, in Italian, as they were written; the line at the top comes from another customer, also on Google.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "Tuesday to Saturday from 10 am to 7 pm, Monday from 3 pm",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.chiuso": "closed",
      "o.nota": "Hours from our Google listing (September 2026): the break is from 2 to 2:30 pm.",
      "w.mappa": "Map: La Mercerie des Rêves, Via Terraggio 21, Milan",
      "w.loro": "«Come and visit us, because describing everything we have is impossible […]»",
      "w.dove": "Where",
      "w.dovev": "Via Terraggio 21, 20123 Milan, between Sant’Ambrogio and Corso Magenta",
      "w.metro": "By metro",
      "w.metrov": "M2 and M4 Sant’Ambrogio, about 350 metres away; M1 and M2 Cadorna, about 400",
      "w.bus": "Bus and tram",
      "w.busv": "Buses 50, 96 and 97 at Largo D’Ancona; trams 16 and 19",
      "w.tel": "Phone",
      "f2.orario": "Monday 3–7 pm · Tuesday to Saturday 10 am–2 pm and 2:30–7 pm · closed on Sunday",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · hours, rating and reviews from their Google listing (September 2026); their words from their website, Facebook and Instagram; the photos from their Google listing (by Sabine and by a customer), their website, Facebook and Instagram. We drew the ribbon ourselves.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ LA MERCERIE DES RÊVES — Via Terraggio 21 ══════════
     la FIRMA — «il nastro»: davanti alla loro parete dei nastri per colore, sotto le bandierine a pois, la bobina e un pacchetto sul
     banco; il nastro si srotola, gira attorno al pacchetto per largo e per lungo, le forbici tagliano, l'avanzo torna sulla bobina,
     sull'incrocio si apre il fiocco e pende il cartellino «dal 1987». Lo stato è M (rosa a pois, vichy, oro), T (0…1) e V (0 al suo
     posto; fino a 1 il pacchetto esce a destra; da −1 a 0 entra da sinistra il prossimo, senza nastro). Senza JS e alla fine: rosa a
     pois, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): il pacchetto senza nastro. Reduced-motion: tutto subito. rAF a tempo,
     guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[560,560],"via":640,"fasi":{"srotola":{"t":0.03,"d":0.14},"coda":{"t":0.17,"d":0.06},"giro":{"t":0.23,"d":0.14},"giu":{"t":0.37,"d":0.14},"entra":{"t":0.47,"d":0.12},"taglia":{"t":0.59,"d":0.06},"rientra":{"t":0.65,"d":0.12},"esce":{"t":0.65,"d":0.14},"fiocco":{"t":0.77,"d":0.13},"cartellino":{"t":0.9,"d":0.1}},"modi":[{"nome":"Rosa a pois"},{"nome":"Vichy"},{"nome":"Oro"}],"bobina":{"x":104,"y":318,"giro1":260,"giro2":110},"forbici":{"fx":-150,"fy":160,"x":205.7,"y":304.7,"gira":80,"apre":22},"nodo":{"x":381,"y":351},"tempi":{"inizio":300,"nastro":6600,"servi":480,"arriva":520,"nastroV":5800}};
  /* il nastro a (M, T, V) — una sola fonte: la usano _mdr_firma.mjs (l'HTML allo stato finale), main.js (via mdr_main.cjs) e la
     prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     Davanti alla loro parete dei nastri divisi per colore, sul banco: dalla bobina il nastro si srotola fino al pacchetto, gli gira
     attorno per largo e poi per lungo; arrivano le forbici e tagliano, il nastro che avanza torna sulla bobina, le forbici se ne vanno;
     sull'incrocio si apre il fiocco e dal fiocco pende il cartellino. Il nastro (a pois, vichy, oro) lo dà il modo (CSS). Col V il
     pacchetto esce a destra; il prossimo, senza nastro, entra da sinistra. */
  function creaNastro(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w.t + w.d - 1e-9 ? 1 : c01((t - w.t) / w.d); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var q1 = function (c) { return svg.querySelector('.' + c); };
    var servito = q1('servito'), bobina = q1('bobina'), filo = q1('filo'), coda = q1('coda'), giro = q1('giro'), giu = q1('giu');
    var forbici = q1('forbici'), lamaA = q1('lama--a'), lamaB = q1('lama--b'), fiocco = q1('fiocco'), cartellino = q1('cartellino');
    var P = D.modi.map(function () { return {}; });
    /* un tratto di nastro disegnato da 0 a «quanto» (pathLength = 1) */
    var tratto = function (el, quanto) { el.setAttribute('stroke-dasharray', r3(quanto) + ' 2'); el.setAttribute('stroke-dashoffset', '0'); };
    function disegna(m, t, v) {
      var F = D.fasi, B = D.bobina, K = D.forbici, N = D.nodo;
      /* la bobina: il nastro si srotola (fino al taglio, poi fino al pacchetto) e dopo il taglio l'avanzo si riavvolge */
      var a1 = dolce(fase(t, F.srotola)), a2 = dolce(fase(t, F.coda)), r = dolce(fase(t, F.rientra));
      bobina.setAttribute('transform', 'translate(' + B.x + ' ' + B.y + ') rotate(' + r1(-B.giro1 * a1 - B.giro2 * a2 + B.giro1 * r) + ')');
      tratto(filo, a1 - r);
      /* la coda (dal taglio al pacchetto): si srotola dopo il filo, sparisce sotto il fiocco */
      var k = dolce(fase(t, F.fiocco));
      tratto(coda, a2);
      coda.setAttribute('opacity', String(r3(1 - k)));
      /* il nastro attorno al pacchetto: prima per largo, poi per lungo */
      tratto(giro, dolce(fase(t, F.giro)));
      tratto(giu, dolce(fase(t, F.giu)));
      /* le forbici: arrivano aperte, chiudono sul nastro, se ne vanno riaprendosi */
      var e = dolce(fase(t, F.entra)) - dolce(fase(t, F.esce));
      forbici.setAttribute('transform', 'translate(' + r1(K.fx + (K.x - K.fx) * e) + ' ' + r1(K.fy + (K.y - K.fy) * e) + ') rotate(' + K.gira + ')');
      var ap = K.apre * (1 - dolce(fase(t, F.taglia))) + K.apre * dolce(fase(t, F.esce));
      lamaA.setAttribute('transform', 'rotate(' + r1(-ap) + ')');
      lamaB.setAttribute('transform', 'rotate(' + r1(ap) + ')');
      /* il fiocco si apre sull'incrocio; poi il cartellino dondola e si ferma */
      fiocco.setAttribute('transform', 'translate(' + N.x + ' ' + N.y + ') rotate(' + r1(-14 * (1 - k)) + ') scale(' + r3(k) + ')');
      var g = dolce(fase(t, F.cartellino));
      cartellino.setAttribute('transform', 'translate(' + N.x + ' ' + N.y + ') rotate(' + r1(28 * (1 - g)) + ')');
      cartellino.setAttribute('opacity', String(r3(g)));
      /* col V il pacchetto esce a destra; il prossimo entra da sinistra */
      servito.setAttribute('transform', 'translate(' + r1(D.via * v) + ' 0)');
    }
    var completo = !!(servito && bobina && filo && coda && giro && giu && forbici && lamaA && lamaB && fiocco && cartellino);
    return { disegna: disegna, pezzi: P, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('nastro-firma'), svgF = prendi('nastroSvg'), leggiF = prendi('nastroLeggi');
  var NASTRO = svgF ? creaNastro(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.banco__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.banco__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    NASTRO.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) NASTRO.disegna(k, 1, 0); });
    NASTRO.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta il pacchetto senza nastro */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: il pacchetto senza nastro */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.nastro, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.nastro });
  }
  /* il gesto: scegliere il nastro. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è, il
     pacchetto esce a destra, entra da sinistra il prossimo senza nastro, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.nastroV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && NASTRO && NASTRO.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaNastro); } catch (e) {}
    window.__nastro = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__nastro.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta il pacchetto senza nastro */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__nastro.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
