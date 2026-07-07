/*! aidisclose.js v1.0.0 | AI-content disclosure snippet (EU AI Act Art 50, California SB 942, and more) | MIT | © Pine Solutions Inc.
 *  Renders: (a) 50(1) interaction disclosure banner (chat-mount aware, SPA-safe,
 *  CMP-collision-safe), (b) visible "AI" labels on [data-ai-content] elements
 *  including video overlay chips, (c) machine-readable page metadata +
 *  <link rel="ai-disclosure"> pointing to /.well-known/ai-disclosure.json.
 *  Declares, never detects. No dependencies. No tracking. No cookies.
 */
(function (w, d) {
  'use strict';
  var VERSION = '1.0.0';
  var WELL_KNOWN = '/.well-known/ai-disclosure.json';
  // Hosted manifests are read through the CDN (edge-cached), not the API directly,
  // so read load stays independent of visitor volume.
  var MANIFEST_HOST = 'https://cdn.aidisclose.io';
  var CMP_IDS = ['onetrust-banner-sdk', 'CybotCookiebotDialog', 'didomi-host', 'usercentrics-root', 'axeptio_overlay'];
  var SCRIPT_EL = d.currentScript;
  var SCRIPT_SRC = (SCRIPT_EL && SCRIPT_EL.src) || '';

  /* ---- i18n-start: 24 official EU languages (parity-tested vs packages/shared/src/i18n.ts) ---- */
  /* interact: 50(1) banner text | content: badge tooltip | close: dismiss label */
  var I18N = {
    bg: { interact: 'Взаимодействате със система с изкуствен интелект.', content: 'Съдържание, генерирано от ИИ', close: 'Затвори', hm: 'Създадено от хора', reviewed: "Създадено с помощта на ИИ, прегледано от човек" },
    hr: { interact: 'Komunicirate sa sustavom umjetne inteligencije.', content: 'Sadržaj generiran umjetnom inteligencijom', close: 'Zatvori', hm: 'Izradili ljudi', reviewed: "Uz pomoć UI, pregledao čovjek" },
    cs: { interact: 'Komunikujete se systémem umělé inteligence.', content: 'Obsah vytvořený umělou inteligencí', close: 'Zavřít', hm: 'Vytvořeno lidmi', reviewed: "S pomocí AI, zkontrolováno člověkem" },
    da: { interact: 'Du interagerer med et AI-system.', content: 'AI-genereret indhold', close: 'Luk', hm: 'Skabt af mennesker', reviewed: "AI-assisteret, menneskeligt gennemgået" },
    nl: { interact: 'U communiceert met een AI-systeem.', content: 'Door AI gegenereerde inhoud', close: 'Sluiten', hm: 'Door mensen gemaakt', reviewed: "AI-ondersteund, door mensen gecontroleerd" },
    en: { interact: 'You are interacting with an AI system.', content: 'AI-generated content', close: 'Close', hm: 'Made by humans', reviewed: "AI-assisted, human-reviewed" },
    et: { interact: 'Suhtlete tehisintellekti süsteemiga.', content: 'Tehisintellekti loodud sisu', close: 'Sulge', hm: 'Inimeste loodud', reviewed: "Tehisintellekti abil, inimese kontrollitud" },
    fi: { interact: 'Olet vuorovaikutuksessa tekoälyjärjestelmän kanssa.', content: 'Tekoälyn tuottama sisältö', close: 'Sulje', hm: 'Ihmisen tekemä', reviewed: "Tekoälyavusteinen, ihmisen tarkistama" },
    fr: { interact: "Vous interagissez avec un système d'intelligence artificielle.", content: 'Contenu généré par IA', close: 'Fermer', hm: 'Fait par des humains', reviewed: "Assisté par IA, revu par un humain" },
    de: { interact: 'Sie interagieren mit einem KI-System.', content: 'KI-generierter Inhalt', close: 'Schließen', hm: 'Von Menschen gemacht', reviewed: "KI-unterstützt, von Menschen geprüft" },
    el: { interact: 'Αλληλεπιδράτε με σύστημα τεχνητής νοημοσύνης.', content: 'Περιεχόμενο που δημιουργήθηκε από ΤΝ', close: 'Κλείσιμο', hm: 'Ανθρώπινη δημιουργία', reviewed: "Με τη βοήθεια ΤΝ, ελεγμένο από άνθρωπο" },
    hu: { interact: 'Ön egy mesterségesintelligencia-rendszerrel kommunikál.', content: 'MI által generált tartalom', close: 'Bezárás', hm: 'Ember alkotta', reviewed: "MI-vel segített, ember által ellenőrzött" },
    ga: { interact: 'Tá tú ag idirghníomhú le córas intleachta saorga.', content: 'Ábhar ginte ag IS', close: 'Dún', hm: 'Déanta ag daoine', reviewed: "Le cúnamh IS, athbhreithnithe ag duine" },
    it: { interact: 'Stai interagendo con un sistema di intelligenza artificiale.', content: 'Contenuto generato dall’IA', close: 'Chiudi', hm: 'Fatto da umani', reviewed: "Assistito dall'IA, revisionato da persone" },
    lv: { interact: 'Jūs sazināties ar mākslīgā intelekta sistēmu.', content: 'MI ģenerēts saturs', close: 'Aizvērt', hm: 'Cilvēku radīts', reviewed: "Ar MI palīdzību, cilvēka pārbaudīts" },
    lt: { interact: 'Jūs bendraujate su dirbtinio intelekto sistema.', content: 'DI sugeneruotas turinys', close: 'Uždaryti', hm: 'Sukurta žmonių', reviewed: "Su DI pagalba, patikrinta žmogaus" },
    mt: { interact: 'Qed tinteraġixxi ma’ sistema tal-intelliġenza artifiċjali.', content: 'Kontenut iġġenerat mill-IA', close: 'Agħlaq', hm: 'Maħluq mill-bniedem', reviewed: "Megħjun mill-IA, rivedut minn bniedem" },
    pl: { interact: 'Rozmawiasz z systemem sztucznej inteligencji.', content: 'Treść wygenerowana przez SI', close: 'Zamknij', hm: 'Stworzone przez ludzi', reviewed: "Wspomagane przez SI, sprawdzone przez człowieka" },
    pt: { interact: 'Está a interagir com um sistema de inteligência artificial.', content: 'Conteúdo gerado por IA', close: 'Fechar', hm: 'Feito por humanos', reviewed: "Assistido por IA, revisto por humanos" },
    ro: { interact: 'Interacționați cu un sistem de inteligență artificială.', content: 'Conținut generat de IA', close: 'Închide', hm: 'Creat de oameni', reviewed: "Asistat de IA, revizuit de oameni" },
    sk: { interact: 'Komunikujete so systémom umelej inteligencie.', content: 'Obsah vygenerovaný umelou inteligenciou', close: 'Zavrieť', hm: 'Vytvorené ľuďmi', reviewed: "S pomocou UI, skontrolované človekom" },
    sl: { interact: 'Komunicirate s sistemom umetne inteligence.', content: 'Vsebina, ustvarjena z UI', close: 'Zapri', hm: 'Ustvarili ljudje', reviewed: "Ob pomoči UI, pregledal človek" },
    es: { interact: 'Está interactuando con un sistema de inteligencia artificial.', content: 'Contenido generado por IA', close: 'Cerrar', hm: 'Hecho por humanos', reviewed: "Asistido por IA, revisado por humanos" },
    sv: { interact: 'Du interagerar med ett AI-system.', content: 'AI-genererat innehåll', close: 'Stäng', hm: 'Skapat av människor', reviewed: "AI-assisterad, granskad av människor" }
  };
  /* Localized "AI" acronym per Code-of-Practice icon convention */
  var ACRONYM = { de: 'KI', fr: 'IA', es: 'IA', it: 'IA', pt: 'IA', ro: 'IA', pl: 'SI', fi: 'TEKOÄLY', el: 'ΤΝ', bg: 'ИИ', lv: 'MI', hu: 'MI', lt: 'DI', sl: 'UI', ga: 'IS', mt: 'IA' };
  /* ---- i18n-end ---- */

  /* ---- css-start: extracted verbatim to dist/aidisclose.css by scripts/build.mjs ---- */
  var CSS =
    '.aid-probe{position:fixed;visibility:hidden;pointer-events:none}' +
    '.aid-banner,.aid-chip{--aid-bg:#111418;--aid-fg:#fff;--aid-line:#3a4048;--aid-btn:#6b7280;--aid-btnfg:#e5e7eb;--aid-hov:#1f2937}' +
    '.aid-light{--aid-bg:#fff;--aid-fg:#111418;--aid-line:#c7ccd4;--aid-btn:#6b7280;--aid-btnfg:#374151;--aid-hov:#eef1f4}' +
    '@media (prefers-color-scheme:light){.aid-auto{--aid-bg:#fff;--aid-fg:#111418;--aid-line:#c7ccd4;--aid-btn:#6b7280;--aid-btnfg:#374151;--aid-hov:#eef1f4}}' +
    '.aid-banner{position:fixed;z-index:2147483000;left:16px;right:16px;bottom:16px;max-width:520px;margin:0 auto;' +
    'display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--aid-bg);color:var(--aid-fg);' +
    'border:1px solid var(--aid-line);border-radius:10px;font:14px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;' +
    'box-shadow:0 4px 18px rgba(0,0,0,.25)}' +
    '.aid-banner.aid-embedded{position:static;max-width:none;margin:8px 0}' +
    '.aid-banner:focus-within{outline:2px solid #7ab8ff;outline-offset:2px}' +
    '.aid-pill,.aid-badge{display:inline-flex;align-items:center;justify-content:center;font-weight:700;letter-spacing:.04em;' +
    'background:#fff;color:#111418;border:2px solid #111418;border-radius:6px;padding:1px 7px;font-size:12px;line-height:1.6;' +
    'flex:none;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
    '.aid-close{margin-left:auto;background:none;border:1px solid var(--aid-btn);color:var(--aid-btnfg);border-radius:6px;' +
    'padding:4px 10px;font:inherit;cursor:pointer}' +
    '.aid-close:hover{background:var(--aid-hov)}' +
    '.aid-close:focus-visible,.aid-chip:focus-visible{outline:2px solid #7ab8ff;outline-offset:2px}' +
    '.aid-wrap{position:relative;display:inline-block;max-width:100%}' +
    '.aid-badge{position:absolute;top:8px;left:8px;z-index:5;box-shadow:0 1px 4px rgba(0,0,0,.35)}' +
    '.aid-badge-inline{position:static;margin:0 6px 0 0;vertical-align:middle}' +
    '.aid-chip{position:fixed;z-index:2147483000;right:16px;bottom:16px;height:28px;min-width:28px;display:inline-flex;' +
    'align-items:center;justify-content:center;padding:0 9px;background:var(--aid-bg);color:var(--aid-fg);' +
    'border:1px solid var(--aid-line);border-radius:14px;font:700 12px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;' +
    'letter-spacing:.04em;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.3)}' +
    '.aid-hm,.aid-ai{left:16px;right:auto;text-decoration:none;padding:0 11px}' +
    '.aid-ai{max-width:calc(100vw - 32px)}' +
    '.aid-pop{right:auto;max-width:340px;margin:0;display:block}' +
    '.aid-pop b{display:block;margin-bottom:4px}.aid-pop a{color:var(--aid-fg)}.aid-pop>a{display:block;margin-top:6px}' +
    '@media (prefers-reduced-motion:no-preference){.aid-banner{animation:aidIn .25s ease-out}' +
    '@keyframes aidIn{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}}';
  /* ---- css-end ---- */

  /* ---- state ---------------------------------------------------------------- */
  var mem = {}; /* session-only fallback when localStorage is unavailable (Part C1) */
  var state = { ran: false, cfg: {}, manifest: null, lang: 'en', cspBlocked: false, triggerFired: false, badgeTimer: 0 };
  var videos = [];

  function store(k, v) {
    try {
      if (v === undefined) return w.localStorage.getItem(k);
      w.localStorage.setItem(k, v);
    } catch (e) {
      if (v === undefined) return mem[k] || null;
      mem[k] = v;
    }
  }

  /* ---- i18n helpers ---------------------------------------------------------- */
  function lang(cfg, manifest) {
    var cand = (cfg.lang || d.documentElement.lang || (w.navigator && w.navigator.language) || '').slice(0, 2).toLowerCase();
    if (I18N[cand]) return cand;
    if (manifest && manifest.languages) {
      for (var i = 0; i < manifest.languages.length; i++) {
        var m = String(manifest.languages[i]).slice(0, 2).toLowerCase();
        if (I18N[m]) return m;
      }
    }
    return 'en';
  }
  /* element-level lang attribute wins for badge tooltips (Part C4) */
  function elLang(node) {
    var n = node;
    while (n && n.getAttribute) {
      var a = n.getAttribute('lang');
      if (a) {
        a = a.slice(0, 2).toLowerCase();
        return I18N[a] ? a : state.lang;
      }
      n = n.parentNode;
    }
    return state.lang;
  }
  /* A conversational system drives the 50(1) interaction banner. */
  function isInteraction(s) {
    return s.kind === 'conversational';
  }
  /* custom manifest text wins; first interaction system's text is used (Part C2) */
  function t(l, key, manifest) {
    if (key === 'interact' && manifest && manifest.aiSystems) {
      for (var i = 0; i < manifest.aiSystems.length; i++) {
        var s = manifest.aiSystems[i];
        if (isInteraction(s) && s.disclosure && s.disclosure.texts) {
          var tx = s.disclosure.texts[l] || s.disclosure.texts[Object.keys(s.disclosure.texts)[0]];
          if (tx) return tx;
        }
      }
    }
    return (I18N[l] || I18N.en)[key];
  }
  function themeCls(cfg) { return cfg.theme === 'light' ? ' aid-light' : cfg.theme === 'dark' ? '' : ' aid-auto'; }
  function narrow() { return (w.innerWidth || d.documentElement.clientWidth || 1024) <= 360; }

  /* ---- beacon (no PII, no cookies): {siteKey, flag} ---------------------------- */
  function beacon(flag) {
    var cfg = state.cfg;
    if (!cfg.beaconUrl || !w.navigator || typeof w.navigator.sendBeacon !== 'function') return;
    try { w.navigator.sendBeacon(cfg.beaconUrl, JSON.stringify({ siteKey: cfg.siteKey || null, flag: flag })); } catch (e) {}
  }

  /* ---- styles: inject <style>, probe for CSP block, fall back to sibling css --- */
  function injectCss() {
    if (!d.getElementById('aid-style')) {
      var s = d.createElement('style'); s.id = 'aid-style'; s.textContent = CSS;
      d.head.appendChild(s);
    }
    var p = d.createElement('div'); p.className = 'aid-probe';
    (d.body || d.documentElement).appendChild(p);
    var ok = false;
    try { ok = w.getComputedStyle(p).position === 'fixed'; } catch (e) {}
    p.parentNode.removeChild(p);
    if (ok) return;
    state.cspBlocked = true;
    if (w.console && w.console.warn) w.console.warn('[aidisclose] <style> injection blocked (CSP?); loading the aidisclose.css stylesheet fallback');
    if (!d.getElementById('aid-css') && SCRIPT_SRC) {
      var l = d.createElement('link'); l.id = 'aid-css'; l.rel = 'stylesheet';
      l.href = SCRIPT_SRC.replace(/[^/]+$/, 'aidisclose.css');
      d.head.appendChild(l);
    }
    beacon('csp_blocked');
  }

  /* ---- machine-readable page metadata ------------------------------------------ */
  function meta(manifestUrl) {
    if (!d.querySelector('link[rel="ai-disclosure"]')) {
      var l = d.createElement('link'); l.rel = 'ai-disclosure'; l.href = manifestUrl; d.head.appendChild(l);
    }
    if (!d.querySelector('meta[name="ai-disclosure"]')) {
      var m = d.createElement('meta'); m.name = 'ai-disclosure'; m.content = manifestUrl; d.head.appendChild(m);
    }
  }

  /* ---- CMP collision: measure known consent layers and stack above, never overlap */
  function stackAboveCmp(el) {
    var vh = w.innerHeight || d.documentElement.clientHeight || 0;
    if (!vh) return;
    var max = 0;
    for (var i = 0; i < CMP_IDS.length; i++) {
      var cmp = d.getElementById(CMP_IDS[i]);
      if (!cmp) continue;
      var r = cmp.getBoundingClientRect();
      if (!r.width || !r.height) continue;            /* hidden */
      if (r.bottom < vh - 8 || r.top >= vh) continue; /* not bottom-anchored */
      var o = vh - r.top;
      if (o > max) max = o;
    }
    if (max > 0 && max < vh - 80) el.style.bottom = (max + 12) + 'px';
  }

  /* The centered 50(1) banner and a bottom-left content notice share the bottom
     edge and would overlap on any viewport where the banner reaches the corner.
     Lift the notice to sit just above the banner (accounting for CMP-lifting);
     with no full banner it falls back to its CSS bottom. */
  function clearOfBanner(el) {
    var b = d.querySelector('.aid-banner');
    if (!b || b.className.indexOf('aid-embedded') !== -1) { el.style.bottom = ''; return; }
    var r = b.getBoundingClientRect();
    var vh = w.innerHeight || d.documentElement.clientHeight || 0;
    if (r.height && vh) el.style.bottom = (vh - r.top + 12) + 'px';
  }
  function repositionNotices() {
    var chips = d.querySelectorAll('.aid-ai,.aid-hm');
    for (var i = 0; i < chips.length; i++) clearOfBanner(chips[i]);
  }

  /* ---- 50(1) banner + persistent mini-chip (Part C1) ---------------------------- */
  function dismissedNow() { return store('aid-dismissed') === '1' && !state.cfg.alwaysShow; }

  function showBanner(force, mount) {
    var cfg = state.cfg;
    if (d.querySelector('.aid-banner')) return;
    if (!force && dismissedNow()) return chip(false);
    if (!force && narrow()) return chip(true); /* mobile ≤360px: chip-first mode (Part C10) */
    removeChip();
    var l = state.lang;
    var el = d.createElement('div');
    el.className = 'aid-banner' + themeCls(cfg);
    el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
    var pill = d.createElement('span'); pill.className = 'aid-pill'; pill.textContent = ACRONYM[l] || 'AI'; pill.setAttribute('aria-hidden', 'true');
    var txt = d.createElement('span'); txt.textContent = t(l, 'interact', state.manifest);
    var btn = d.createElement('button'); btn.className = 'aid-close'; btn.type = 'button';
    btn.textContent = (I18N[l] || I18N.en).close;
    function close() {
      if (el.parentNode) el.parentNode.removeChild(el);
      store('aid-dismissed', '1');
      chip(false);
      repositionNotices();
    }
    btn.addEventListener('click', close);
    el.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    el.appendChild(pill); el.appendChild(txt); el.appendChild(btn);
    if (!mount && cfg.mountSelector && !cfg.triggerSelector) mount = d.querySelector(cfg.mountSelector);
    if (mount) { el.className += ' aid-embedded'; mount.appendChild(el); }
    else { d.body.appendChild(el); stackAboveCmp(el); }
    repositionNotices();
    btn.focus({ preventScroll: true });
  }

  /* 28px mini-chip: aria-label carries the full disclosure text, click reopens banner */
  function chip(force) {
    var cfg = state.cfg;
    if (!force && cfg.persistentChip === false) return;
    if (d.querySelector('.aid-chip')) return;
    var l = state.lang;
    var c = chipBtn('');
    c.textContent = ACRONYM[l] || 'AI';
    var full = t(l, 'interact', state.manifest);
    c.setAttribute('aria-label', full); c.title = full;
    c.addEventListener('click', function () { removeChip(); showBanner(true); });
    d.body.appendChild(c);
    stackAboveCmp(c);
  }
  function removeChip() {
    var c = d.querySelector('.aid-chip');
    if (c && c.parentNode) c.parentNode.removeChild(c);
  }

  /* ---- chat-mount mode: banner in widget container on first open ---------------- */
  function matchesSel(el, sel) {
    var f = el.matches || el.msMatchesSelector || el.webkitMatchesSelector;
    try { return !!(f && f.call(el, sel)); } catch (e) { return false; }
  }
  function armTrigger() {
    var cfg = state.cfg;
    d.addEventListener('click', function (e) {
      if (state.triggerFired) return;
      var n = e.target;
      while (n && n.nodeType === 1) {
        if (matchesSel(n, cfg.triggerSelector)) {
          state.triggerFired = true;
          /* full banner re-shows on a new chat-open trigger even after dismissal (C1) */
          showBanner(true, cfg.mountSelector ? d.querySelector(cfg.mountSelector) : null);
          return;
        }
        n = n.parentNode;
      }
    }, true);
    if (dismissedNow()) chip(false); /* chip persists across sessions (C1) */
    /* No element matching the trigger on this page means no AI interaction here:
       render nothing. The click listener above matches at click time, so launchers
       injected later (Intercom-style widgets) still fire. A misconfigured selector
       surfaces at scan time, not as a spurious banner on chat-free pages. */
  }

  /* ---- visible labels for [data-ai-content] -------------------------------------- */
  function badgeEl(l, label) {
    var b = d.createElement('span');
    b.className = 'aid-badge';
    b.textContent = ACRONYM[l] || 'AI';
    b.setAttribute('role', 'img');
    b.setAttribute('aria-label', label);
    b.title = label;
    return b;
  }
  function mark(n) {
    n.setAttribute('data-aid-done', '1');
    var l = elLang(n);
    var label = n.getAttribute('data-ai-label') || (I18N[l] || I18N.en).content;
    var b = badgeEl(l, label);
    /* machine-readable per-element hint (IPTC/schema.org-compatible) */
    n.setAttribute('data-digital-source-type', n.getAttribute('data-digital-source-type') || 'trainedAlgorithmicMedia');
    if (n.tagName === 'VIDEO') return videoChip(n, b);
    if (/^(IMG|AUDIO|PICTURE|CANVAS|FIGURE)$/.test(n.tagName)) {
      var wrap = d.createElement('span'); wrap.className = 'aid-wrap';
      n.parentNode.insertBefore(wrap, n); wrap.appendChild(n); wrap.appendChild(b);
    } else {
      b.className += ' aid-badge-inline';
      n.insertBefore(b, n.firstChild);
    }
  }
  /* iframes/closed widgets: disclose adjacent on the host page (adjacentSelector) */
  function markAdjacent(n) {
    if (n.getAttribute('data-aid-done') || !n.parentNode) return;
    n.setAttribute('data-aid-done', '1');
    var l = elLang(n);
    var b = badgeEl(l, (I18N[l] || I18N.en).content);
    b.className += ' aid-badge-inline';
    n.parentNode.insertBefore(b, n);
  }
  function badges() {
    var nodes = d.querySelectorAll('[data-ai-content]:not([data-aid-done])');
    for (var i = 0; i < nodes.length; i++) mark(nodes[i]);
    if (state.cfg.adjacentSelector) {
      var adj = d.querySelectorAll(state.cfg.adjacentSelector);
      for (var j = 0; j < adj.length; j++) markAdjacent(adj[j]);
    }
  }
  /* debounced 150ms + rAF-batched re-run (SPA routes, MutationObserver) */
  function scheduleBadges() {
    if (state.badgeTimer) w.clearTimeout(state.badgeTimer);
    state.badgeTimer = w.setTimeout(function () {
      state.badgeTimer = 0;
      if (w.requestAnimationFrame) w.requestAnimationFrame(badges); else badges();
    }, 150);
  }

  /* ---- video overlay chip: visible on first frame and while playing -------------- */
  function videoChip(v, b) {
    var wrap = d.createElement('span'); wrap.className = 'aid-wrap';
    v.parentNode.insertBefore(wrap, v); wrap.appendChild(v); wrap.appendChild(b);
    videos.push({ v: v, b: b, wrap: wrap });
  }
  function fsHandler() {
    var fs = d.fullscreenElement || d.webkitFullscreenElement || null;
    for (var i = 0; i < videos.length; i++) {
      var r = videos[i];
      var target = (fs && fs !== r.v && fs.contains && fs.contains(r.v)) ? fs : r.wrap;
      if (r.b.parentNode !== target) target.appendChild(r.b);
    }
  }

  /* ---- SPA route handling: wrap pushState once, call original, custom event ------ */
  function wrapHistory() {
    if (w.history && w.history.pushState && !w.history.pushState._aid) {
      var orig = w.history.pushState;
      var wrapped = function () {
        var r = orig.apply(this, arguments);
        try { w.dispatchEvent(new w.CustomEvent('aid:navigate')); } catch (e) {}
        return r;
      };
      wrapped._aid = true;
      w.history.pushState = wrapped;
    }
    w.addEventListener('popstate', scheduleBadges);
    w.addEventListener('aid:navigate', scheduleBadges);
  }

  /* ---- chip info popover: the disclosure specifics, in the publisher's own
     manifest words (title = notice text, sub = publisher and purpose), plus the
     machine-readable source. Toggled by the chip; Esc and outside click close. */
  function closePop() {
    var p = d.querySelector('.aid-pop');
    if (p) { p._btn.setAttribute('aria-expanded', 'false'); p.parentNode.removeChild(p); }
  }
  /* Localized landing page explaining what a clicked notice means. */
  function explainerUrl(page) {
    var l = state.lang;
    return 'https://aidisclose.io/' + (l === 'en' ? '' : l + '/') + page + '/';
  }
  function pop(btn, title, sub, href, moreHref) {
    if (d.querySelector('.aid-pop')) { closePop(); return; }
    var p = d.createElement('div');
    p._btn = btn;
    p.className = 'aid-banner aid-pop' + themeCls(state.cfg);
    var b = d.createElement('b');
    var ba = d.createElement('a');
    ba.href = moreHref;
    ba.target = '_blank';
    ba.rel = 'noopener';
    ba.textContent = title;
    b.appendChild(ba);
    p.appendChild(b);
    if (sub) p.appendChild(d.createTextNode(sub));
    var a = d.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'ai-disclosure.json';
    p.appendChild(a);
    p.style.bottom = (w.innerHeight - btn.getBoundingClientRect().top + 8) + 'px';
    d.body.appendChild(p);
    btn.setAttribute('aria-expanded', 'true');
  }
  function chipBtn(cls) {
    var c = d.createElement('button');
    c.type = 'button';
    c.className = 'aid-chip' + cls + themeCls(state.cfg);
    c.setAttribute('aria-expanded', 'false');
    return c;
  }

  /* ---- Made by humans badge: publisher declared no AI (Part C5) ------------------- */
  function humanMade() {
    if (d.querySelector('.aid-hm')) return;
    var label = t(state.lang, 'hm');
    var a = chipBtn(' aid-hm');
    a.textContent = '✓ ' + label;
    a.addEventListener('click', function () {
      var pub = state.manifest && state.manifest.publisher;
      pop(a, label, (pub && pub.name) || '', state.cfg.manifestUrl, explainerUrl('made-by-humans'));
    });
    d.body.appendChild(a);
    clearOfBanner(a);
  }

  /* ---- site/page AI-content notice: content-generation systems with scope
     site|page get a persistent chip (no chatbot needed). scope=element keeps the
     per-[data-ai-content] labels. Manifest-driven and opt-in, so a system that
     declares no scope renders nothing new. ---------------------------------------- */
  var reCache = Object.create(null); /* glob string -> compiled RegExp (or null), built once */
  function globRe(glob) {
    if (glob in reCache) return reCache[glob];
    var g = glob.charAt(0) === '/' ? glob : '/' + glob; /* pathname is always rooted */
    var esc = g.replace(/[.+^${}()|[\]\\?]/g, '\\$&').replace(/\*/g, '.*');
    /* Trailing slash is insignificant on both sides: '/about' and '/about/'
       each match pathname '/about' and '/about/'. Strip a trailing slash off the
       glob (but never the lone root '/') and let the optional '/?' re-add it, so a
       clean-URL site ('/faq') and a declared '/faq/' still line up. A malformed
       glob must never throw out of run() and disable the snippet. */
    if (esc.length > 1) esc = esc.replace(/\/$/, '');
    var re = null;
    try { re = new RegExp('^' + esc + '/?$'); } catch (e) {}
    reCache[glob] = re;
    return re;
  }
  function pathMatches(globs) {
    var p = (w.location && w.location.pathname) || '/';
    for (var i = 0; i < globs.length; i++) {
      var re = globRe(String(globs[i]));
      if (re && re.test(p)) return true;
    }
    return false;
  }
  /* Content-generation system whose declared scope applies here. A page-scope
     match wins over a site-scope one (more specific); site is the fallback. */
  function contentNoticeSystem(manifest) {
    if (!manifest || !manifest.aiSystems) return null;
    var site = null;
    for (var i = 0; i < manifest.aiSystems.length; i++) {
      var s = manifest.aiSystems[i];
      if (s.kind !== 'content-generation' || !s.disclosure) continue;
      var scope = s.disclosure.scope;
      if (scope === 'page' && s.disclosure.pages && pathMatches(s.disclosure.pages)) return s;
      if (scope === 'site' && !site) site = s;
    }
    return site;
  }
  /* humanReview: per-system wins; an unset per-system flag falls back to the
     manifest-level default (an explicit per-system false still wins). */
  function isReviewed(s, manifest) {
    var er = s.editorialResponsibility;
    if (!er || er.humanReview === undefined) er = manifest && manifest.editorialResponsibility;
    return !!(er && er.humanReview);
  }
  function contentNotice(s) {
    if (d.querySelector('.aid-ai')) return;
    var l = state.lang;
    var texts = s.disclosure.texts;
    var custom = texts && (texts[l] || texts[Object.keys(texts)[0]]);
    // Fully-generated or manipulated (deepfake) content is never "AI-assisted": human
    // review still labels it AI-generated. Only ai-assisted content uses reviewed wording.
    var gd = s.generationDegree;
    var reviewed = isReviewed(s, state.manifest) && gd !== 'fully-ai-generated' && gd !== 'manipulated';
    var label = custom || (I18N[l] || I18N.en)[reviewed ? 'reviewed' : 'content'];
    var a = chipBtn(' aid-ai');
    a.setAttribute('aria-label', label);
    a.textContent = (ACRONYM[l] || 'AI') + ' · ' + label;
    a.setAttribute('data-aid-sys', s.id);
    a.addEventListener('click', function () {
      var pub = state.manifest && state.manifest.publisher;
      pop(a, label, ((pub && pub.name) ? pub.name + ': ' : '') + (s.purpose || s.name || ''), state.cfg.manifestUrl, explainerUrl('ai-notice'));
    });
    d.body.appendChild(a);
    clearOfBanner(a);
  }
  /* SPA route change: a page-scope notice may start, stop, or switch to a
     different system. Re-render only when the applicable system changed. */
  function reContentNotice() {
    var m = state.manifest;
    if (!m || m.noAiDeclared) return;
    var el = d.querySelector('.aid-ai');
    var cs = contentNoticeSystem(m);
    if (cs && el && el.getAttribute('data-aid-sys') === cs.id) return;
    if (el && el.parentNode) { closePop(); el.parentNode.removeChild(el); }
    if (cs) contentNotice(cs);
  }

  /* ---- bootstrap ------------------------------------------------------------------ */
  function needsBanner(manifest, cfg) {
    if (cfg.banner === false) return false;
    if (cfg.banner === true) return true;
    if (!manifest || !manifest.aiSystems) return false;
    return manifest.aiSystems.some(isInteraction);
  }
  function run(cfg, manifest, manifestFailed) {
    if (state.ran) return;
    state.ran = true;
    state.cfg = cfg; state.manifest = manifest;
    state.lang = lang(cfg, manifest);
    injectCss();
    meta(cfg.manifestUrl);
    if (manifestFailed) {
      /* Part C3: fall back to config-declared behavior; never silently no-op */
      if (w.console && w.console.warn) w.console.warn('[aidisclose] manifest unreachable: ' + cfg.manifestUrl + '; using config-declared behavior');
      beacon('manifest_unreachable');
    }
    if (needsBanner(manifest, cfg)) {
      if (cfg.triggerSelector) armTrigger(); else showBanner(false);
    }
    if (manifest && manifest.noAiDeclared) humanMade();
    else {
      var cs = contentNoticeSystem(manifest);
      if (cs) contentNotice(cs);
    }
    badges();
    wrapHistory();
    w.addEventListener('aid:navigate', reContentNotice);
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePop(); });
    d.addEventListener('click', function (e) {
      var p = d.querySelector('.aid-pop');
      if (p && !p.contains(e.target) && !matchesSel(e.target, '.aid-ai,.aid-hm')) closePop();
    }, true);
    w.addEventListener('popstate', reContentNotice);
    w.addEventListener('resize', repositionNotices);
    d.addEventListener('fullscreenchange', fsHandler);
    if (w.MutationObserver && cfg.observe !== false) {
      new w.MutationObserver(scheduleBadges).observe(d.body, { childList: true, subtree: true });
    }
  }
  /* Single-tag install (CookieBot-style): read config off the script tag's data-*
     attributes. data-aidisclose="KEY" points at the AIDisclose-hosted manifest;
     with no attributes the snippet reads the site's own /.well-known/ manifest. */
  function configFromTag(tag) {
    var cfg = {};
    if (!tag || !tag.getAttribute) return cfg;
    var key = tag.getAttribute('data-aidisclose'); if (key) cfg.siteKey = key;
    var url = tag.getAttribute('data-manifest-url'); if (url) cfg.manifestUrl = url;
    var lang = tag.getAttribute('data-lang'); if (lang) cfg.lang = lang;
    var theme = tag.getAttribute('data-theme'); if (theme) cfg.theme = theme;
    var banner = tag.getAttribute('data-banner'); if (banner !== null) cfg.banner = banner !== 'false';
    return cfg;
  }

  /* Config surface (frozen v1): manifestUrl, lang, banner, alwaysShow, persistentChip,
     mountSelector, triggerSelector, adjacentSelector, observe, theme, siteKey, beaconUrl */
  function init(userCfg) {
    var cfg = userCfg || {};
    /* An explicit window.AIDiscloseConfig is the power-user escape hatch; it wins. */
    var g = w.AIDiscloseConfig;
    if (g) for (var k in g) if (Object.prototype.hasOwnProperty.call(g, k)) cfg[k] = g[k];
    if (!cfg.manifestUrl && cfg.siteKey) cfg.manifestUrl = MANIFEST_HOST + '/v1/hosted-manifest/' + cfg.siteKey;
    cfg.manifestUrl = cfg.manifestUrl || WELL_KNOWN;
    var start = function () {
      if (!w.fetch) return run(cfg, null, false);
      w.fetch(cfg.manifestUrl, { credentials: 'omit' })
        .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
        .then(function (manifest) { run(cfg, manifest, false); })
        .catch(function () { run(cfg, null, true); });
    };
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
  }

  w.AIDisclose = { init: init, version: VERSION };
  var tag = d.currentScript || SCRIPT_EL;
  if (!tag || tag.getAttribute('data-manual') === null) init(configFromTag(tag));
})(window, document);
