import test from 'node:test';
import assert from 'node:assert/strict';
import { boot, settle, tick, MANIFEST_50_1, contentManifest } from './helpers.mjs';

test('banner renders for a 50(1) manifest with default text', async () => {
  const { doc, win } = boot();
  await settle();
  const banner = doc.querySelector('.aid-banner');
  assert.ok(banner, 'banner rendered');
  assert.match(banner.textContent, /You are interacting with an AI system\./);
  assert.equal(win.AIDisclose.version, '1.0.0');
  assert.ok(doc.querySelector('link[rel="ai-disclosure"]'), 'link rel added');
});

test('dismissal renders persistent mini-chip; chip click reopens banner', async () => {
  const { doc } = boot();
  await settle();
  doc.querySelector('.aid-close').click();
  assert.equal(doc.querySelector('.aid-banner'), null, 'banner removed');
  const chip = doc.querySelector('.aid-chip');
  assert.ok(chip, 'chip rendered after dismissal');
  assert.equal(chip.getAttribute('aria-label'), 'You are interacting with an AI system.');
  chip.click();
  assert.ok(doc.querySelector('.aid-banner'), 'banner reopened from chip');
  assert.equal(doc.querySelector('.aid-chip'), null, 'chip removed while banner open');
});

test('persistentChip:false suppresses the chip', async () => {
  const { doc } = boot({ config: { persistentChip: false } });
  await settle();
  doc.querySelector('.aid-close').click();
  assert.equal(doc.querySelector('.aid-chip'), null);
});

test('dismissed state persists: chip (not banner) on next load', async () => {
  const { doc } = boot({ pre: (win) => win.localStorage.setItem('aid-dismissed', '1') });
  await settle();
  assert.equal(doc.querySelector('.aid-banner'), null);
  assert.ok(doc.querySelector('.aid-chip'));
});

test('localStorage disabled → session-only fallback, banner still works', async () => {
  const { doc } = boot({
    pre: (win) =>
      Object.defineProperty(win, 'localStorage', {
        get() { throw new Error('denied'); },
        configurable: true,
      }),
  });
  await settle();
  assert.ok(doc.querySelector('.aid-banner'), 'banner renders with storage disabled');
  doc.querySelector('.aid-close').click();
  assert.ok(doc.querySelector('.aid-chip'), 'dismissal falls back to in-memory');
});

test('badges count equals tagged element count', async () => {
  const { doc } = boot({
    body: '<p data-ai-content>a</p><img data-ai-content src="x.png"><span data-ai-content>b</span>',
  });
  await settle();
  assert.equal(doc.querySelectorAll('.aid-badge').length, 3);
  assert.equal(doc.querySelectorAll('[data-ai-content][data-aid-done]').length, 3);
});

test('video gets positioned wrapper with overlay chip', async () => {
  const { doc } = boot({ body: '<video data-ai-content></video>' });
  await settle();
  const video = doc.querySelector('video');
  assert.equal(video.parentNode.className, 'aid-wrap');
  assert.ok(video.parentNode.querySelector('.aid-badge'), 'chip inside wrapper');
  assert.equal(video.getAttribute('data-digital-source-type'), 'trainedAlgorithmicMedia');
});

test('FR localization: banner, close label, acronym pill, badge tooltip', async () => {
  const { doc } = boot({ docLang: 'fr', body: '<p data-ai-content>x</p>' });
  await settle();
  const banner = doc.querySelector('.aid-banner');
  assert.match(banner.textContent, /Vous interagissez avec un système d'intelligence artificielle\./);
  assert.equal(doc.querySelector('.aid-close').textContent, 'Fermer');
  assert.equal(doc.querySelector('.aid-pill').textContent, 'IA');
  assert.equal(doc.querySelector('.aid-badge').title, 'Contenu généré par IA');
});

test('element-level lang attribute wins for badge tooltip (C4)', async () => {
  const { doc } = boot({ docLang: 'en', body: '<div lang="de"><p data-ai-content>x</p></div>' });
  await settle();
  const badge = doc.querySelector('.aid-badge');
  assert.equal(badge.title, 'KI-generierter Inhalt');
  assert.equal(badge.textContent, 'KI');
});

test('custom disclosure text from manifest wins over built-in string', async () => {
  const manifest = structuredClone(MANIFEST_50_1);
  manifest.aiSystems[0].disclosure.texts = { en: 'Custom AI notice text.' };
  const { doc } = boot({ manifest });
  await settle();
  assert.match(doc.querySelector('.aid-banner').textContent, /Custom AI notice text\./);
});

test('one banner for multiple conversational systems, first 50(1) text wins (C2)', async () => {
  const manifest = structuredClone(MANIFEST_50_1);
  manifest.aiSystems[0].disclosure.texts = { en: 'First system.' };
  manifest.aiSystems.push({
    ...structuredClone(manifest.aiSystems[0]),
    id: 'bot-2',
    disclosure: { methods: ['banner'], texts: { en: 'Second system.' } },
  });
  const { doc } = boot({ manifest });
  await settle();
  assert.equal(doc.querySelectorAll('.aid-banner').length, 1);
  assert.match(doc.querySelector('.aid-banner').textContent, /First system\./);
});

test('SPA: pushState wrapper re-runs badges (debounced), original still called', async () => {
  const { doc, win } = boot({ config: { observe: false } });
  await settle();
  const p = doc.createElement('p');
  p.setAttribute('data-ai-content', '');
  p.textContent = 'late';
  doc.body.appendChild(p);
  assert.equal(doc.querySelectorAll('.aid-badge').length, 0, 'not yet badged (observer off)');
  win.history.pushState({}, '', '/page-2');
  assert.equal(win.location.pathname, '/page-2', 'original pushState called');
  await tick(400);
  assert.equal(doc.querySelectorAll('.aid-badge').length, 1, 're-badged after route change');
  assert.ok(win.history.pushState._aid, 'wrapped exactly once');
});

test('chat-mount: banner injected in widget container on first trigger open', async () => {
  const { doc } = boot({
    body: '<button id="open-chat">chat</button><div id="chat-box"></div>',
    config: { triggerSelector: '#open-chat', mountSelector: '#chat-box' },
  });
  await settle();
  assert.equal(doc.querySelector('.aid-banner'), null, 'no banner before first open');
  doc.getElementById('open-chat').click();
  const banner = doc.querySelector('#chat-box .aid-banner');
  assert.ok(banner, 'banner mounted inside widget container');
  assert.ok(banner.className.includes('aid-embedded'));
});

test('chat-mount: trigger absent → nothing renders on this page', async () => {
  const { doc } = boot({ config: { triggerSelector: '#never-exists' } });
  await settle();
  assert.equal(doc.querySelector('.aid-banner'), null, 'no banner on a page without the chat launcher');
});

test('chat-mount: launcher injected after load still fires the banner', async () => {
  const { doc } = boot({ config: { triggerSelector: '#late-chat' } });
  await settle();
  assert.equal(doc.querySelector('.aid-banner'), null, 'nothing before the widget loads');
  const btn = doc.createElement('button');
  btn.id = 'late-chat';
  doc.body.appendChild(btn);
  btn.click();
  assert.ok(doc.querySelector('.aid-banner'), 'banner shows when the late-loaded launcher opens');
});

test('manifest fetch failure: cfg.banner true still renders + beacons manifest_unreachable (C3)', async () => {
  const calls = [];
  const { doc } = boot({
    fetchImpl: async () => { throw new Error('network'); },
    config: { banner: true, siteKey: 'sk_test', beaconUrl: 'https://api.aidisclose.io/beacon' },
    pre: (win) => {
      Object.defineProperty(win.navigator, 'sendBeacon', {
        value: (url, payload) => { calls.push({ url, payload }); return true; },
        configurable: true,
      });
    },
  });
  await settle();
  assert.ok(doc.querySelector('.aid-banner'), 'banner rendered from config fallback');
  const flags = calls.map((c) => JSON.parse(c.payload));
  assert.ok(flags.some((f) => f.flag === 'manifest_unreachable' && f.siteKey === 'sk_test'));
});

test('no banner when manifest has no 50(1) system and no config override', async () => {
  const manifest = structuredClone(MANIFEST_50_1);
  manifest.aiSystems = [];
  const { doc } = boot({ manifest, body: '<p data-ai-content>x</p>' });
  await settle();
  assert.equal(doc.querySelector('.aid-banner'), null);
  assert.equal(doc.querySelectorAll('.aid-badge').length, 1, 'badges still run');
});

test('theme config maps to classes (light/dark/auto default)', async () => {
  for (const [theme, cls] of [['light', 'aid-light'], ['dark', null], [undefined, 'aid-auto']]) {
    const { doc } = boot({ config: theme ? { theme } : {} });
    await settle();
    const banner = doc.querySelector('.aid-banner');
    if (cls) assert.ok(banner.className.includes(cls), `${theme} → ${cls}`);
    else assert.ok(!banner.className.includes('aid-light') && !banner.className.includes('aid-auto'), 'dark is base palette');
  }
});

test('content notice: site scope renders a persistent AI-content chip, no banner', async () => {
  const { doc } = boot({ manifest: contentManifest({ scope: 'site' }) });
  await settle();
  const chip = doc.querySelector('.aid-ai');
  assert.ok(chip, 'content chip rendered');
  assert.match(chip.textContent, /AI-generated content/);
  assert.equal(doc.querySelector('.aid-banner'), null, 'no interaction banner for a content-only site');
});

test('chip popover: click reveals publisher, purpose, and the manifest link; toggles and Esc closes', async () => {
  const { doc } = boot({ manifest: contentManifest({ scope: 'site' }) });
  await settle();
  const chip = doc.querySelector('.aid-ai');
  assert.equal(chip.tagName, 'BUTTON');
  assert.equal(chip.getAttribute('aria-expanded'), 'false');
  chip.click();
  const p = doc.querySelector('.aid-pop');
  assert.ok(p, 'popover opens');
  assert.equal(chip.getAttribute('aria-expanded'), 'true');
  assert.match(p.textContent, /Test: AI-assisted text/, 'publisher and purpose shown');
  const links = p.querySelectorAll('a');
  assert.match(links[0].getAttribute('href'), /aidisclose\.io\/ai-notice\/$/, 'title links the explainer');
  assert.match(links[links.length - 1].getAttribute('href'), /ai-disclosure\.json$/, 'links the manifest');
  chip.click();
  assert.equal(doc.querySelector('.aid-pop'), null, 'second click closes');
  assert.equal(chip.getAttribute('aria-expanded'), 'false');
  chip.click();
  doc.dispatchEvent(new doc.defaultView.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(doc.querySelector('.aid-pop'), null, 'Escape closes');
});

test('content notice: reviewed flag switches to the human-reviewed label', async () => {
  const { doc } = boot({ manifest: contentManifest({ scope: 'site', humanReview: true }) });
  await settle();
  assert.match(doc.querySelector('.aid-ai').textContent, /AI-assisted, human-reviewed/);
});

test('content notice: fully-ai-generated stays "AI-generated content" even when human-reviewed', async () => {
  const { doc } = boot({
    manifest: contentManifest({ scope: 'site', humanReview: true, generationDegree: 'fully-ai-generated' }),
  });
  await settle();
  const t = doc.querySelector('.aid-ai').textContent;
  assert.match(t, /AI-generated content/);
  assert.doesNotMatch(t, /AI-assisted/);
});

test('content notice: page scope shows only on matching paths', async () => {
  const shown = boot({ manifest: contentManifest({ scope: 'page', pages: ['/', '/blog/*'] }) });
  await settle();
  assert.ok(shown.doc.querySelector('.aid-ai'), 'shown on matching path /');
  const hidden = boot({ manifest: contentManifest({ scope: 'page', pages: ['/news/*'] }) });
  await settle();
  assert.equal(hidden.doc.querySelector('.aid-ai'), null, 'hidden on a non-matching path');
});

test('content notice: element scope renders labels only, no site chip', async () => {
  const { doc } = boot({ manifest: contentManifest({ scope: 'element' }), body: '<p data-ai-content>x</p>' });
  await settle();
  assert.equal(doc.querySelector('.aid-ai'), null, 'no site chip for element scope');
  assert.ok(doc.querySelector('.aid-badge'), 'element label still rendered');
});

test('content notice: custom disclosure text wins over the built-in string', async () => {
  const m = contentManifest({ scope: 'site' });
  m.aiSystems[0].disclosure.texts = { en: 'Some copy here is AI-assisted' };
  const { doc } = boot({ manifest: m });
  await settle();
  assert.match(doc.querySelector('.aid-ai').textContent, /Some copy here is AI-assisted/);
});

test('content notice: page glob tolerates trailing slash and missing leading slash', async () => {
  const withSlash = boot({ manifest: contentManifest({ scope: 'page', pages: ['/about'] }), url: 'https://site.example/about/' });
  await settle();
  assert.ok(withSlash.doc.querySelector('.aid-ai'), '/about matches /about/');
  const noLead = boot({ manifest: contentManifest({ scope: 'page', pages: ['blog/*'] }), url: 'https://site.example/blog/x' });
  await settle();
  assert.ok(noLead.doc.querySelector('.aid-ai'), 'blog/* (no leading slash) matches /blog/x');
  // The reverse: a declared '/faq/' must match a clean-URL '/faq' (trailingSlash: false).
  const declaredSlash = boot({ manifest: contentManifest({ scope: 'page', pages: ['/faq/'] }), url: 'https://site.example/faq' });
  await settle();
  assert.ok(declaredSlash.doc.querySelector('.aid-ai'), '/faq/ matches clean-URL /faq');
  const declaredSlashBoth = boot({ manifest: contentManifest({ scope: 'page', pages: ['/faq/'] }), url: 'https://site.example/faq/' });
  await settle();
  assert.ok(declaredSlashBoth.doc.querySelector('.aid-ai'), '/faq/ still matches /faq/');
});

test('content notice: a malformed page glob never breaks the snippet', async () => {
  const { doc } = boot({ manifest: contentManifest({ scope: 'page', pages: ['??'] }), body: '<p data-ai-content>x</p>' });
  await settle();
  // An invalid regex must not throw out of run(); element labels still render.
  assert.ok(doc.querySelector('.aid-badge'), 'badges still run after a bad glob');
});

test('content notice: manifest-level review applies when the system omits humanReview', async () => {
  const m = contentManifest({ scope: 'site' });
  m.editorialResponsibility = { humanReview: true };
  m.aiSystems[0].editorialResponsibility = { statementUrl: 'https://site.example/policy' };
  const { doc } = boot({ manifest: m });
  await settle();
  assert.match(doc.querySelector('.aid-ai').textContent, /AI-assisted, human-reviewed/);
});

test('content notice: a non-content-generation system with a scope renders no chip', async () => {
  const m = contentManifest({ scope: 'site' });
  m.aiSystems[0].kind = 'emotion-recognition';
  const { doc } = boot({ manifest: m });
  await settle();
  assert.equal(doc.querySelector('.aid-ai'), null, 'only content-generation systems drive the content notice');
});

test('content notice: a matching page-scope system wins over a site-scope one', async () => {
  const m = contentManifest({ scope: 'site' }); // system 'copy', not reviewed
  m.aiSystems.push({
    id: 'pricing', name: 'Pricing', role: 'deployer', kind: 'content-generation', purpose: 'x',
    obligations: [{ jurisdiction: 'eu', provisions: ['art50-4'] }],
    editorialResponsibility: { humanReview: true },
    disclosure: { methods: ['banner'], scope: 'page', pages: ['/pricing'] },
  });
  const { doc } = boot({ manifest: m, url: 'https://site.example/pricing' });
  await settle();
  assert.match(doc.querySelector('.aid-ai').textContent, /AI-assisted, human-reviewed/, 'page-scope pricing wins over site');
});

test('content notice: SPA navigation swaps the label when a different system applies', async () => {
  const m = contentManifest({ scope: 'page', pages: ['/news/*'] }); // system 'copy', not reviewed
  m.aiSystems.push({
    id: 'blog', name: 'Blog', role: 'deployer', kind: 'content-generation', purpose: 'x',
    obligations: [{ jurisdiction: 'eu', provisions: ['art50-4'] }],
    editorialResponsibility: { humanReview: true },
    disclosure: { methods: ['banner'], scope: 'page', pages: ['/blog/*'] },
  });
  const { doc, win } = boot({ manifest: m, url: 'https://site.example/news/1' });
  await settle();
  assert.match(doc.querySelector('.aid-ai').textContent, /AI-generated content/, 'news = generated');
  win.history.pushState({}, '', '/blog/1');
  await settle();
  assert.match(doc.querySelector('.aid-ai').textContent, /AI-assisted, human-reviewed/, 'blog = reviewed after nav');
});
