import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bootTag, settle, MANIFEST_50_1 } from './helpers.mjs';

/** Records the URL the snippet fetched its manifest from. */
function spyFetch(manifest = MANIFEST_50_1) {
  const calls = [];
  const impl = async (url) => {
    calls.push(url);
    return { ok: true, json: async () => manifest };
  };
  return { impl, calls };
}

test('single tag, no attributes → zero-config, fetches the site well-known manifest', async () => {
  const { impl, calls } = spyFetch();
  bootTag({ fetchImpl: impl });
  await settle();
  assert.equal(calls[0], '/.well-known/ai-disclosure.json');
});

test('data-aidisclose="KEY" → fetches the AIDisclose-hosted manifest for that key', async () => {
  const { impl, calls } = spyFetch();
  bootTag({ attrs: { 'data-aidisclose': 'shop_abc123' }, fetchImpl: impl });
  await settle();
  assert.equal(calls[0], 'https://cdn.aidisclose.io/v1/hosted-manifest/shop_abc123');
});

test('data-manifest-url overrides the derived hosted URL', async () => {
  const { impl, calls } = spyFetch();
  bootTag({ attrs: { 'data-aidisclose': 'shop_abc123', 'data-manifest-url': '/custom/manifest.json' }, fetchImpl: impl });
  await settle();
  assert.equal(calls[0], '/custom/manifest.json');
});

test('data-banner="false" suppresses the banner even for a 50(1) manifest', async () => {
  const { doc } = bootTag({ attrs: { 'data-banner': 'false' } });
  await settle();
  assert.equal(doc.querySelector('.aid-banner'), null);
});

test('data-manual defers init — no fetch, no render until called', async () => {
  const { impl, calls } = spyFetch();
  const { win, doc } = bootTag({ attrs: { 'data-manual': '', 'data-aidisclose': 'k' }, fetchImpl: impl });
  await settle();
  assert.equal(calls.length, 0);
  win.AIDisclose.init({ siteKey: 'k' });
  await settle();
  assert.equal(calls[0], 'https://cdn.aidisclose.io/v1/hosted-manifest/k');
});
