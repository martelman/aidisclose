/* Parity: the snippet's inlined 28-locale table MUST match the shared
 * source of truth (packages/shared/src/i18n.ts) exactly for interact/content/close
 * and the localized ACRONYM map. Runs on Node >=22.18 (native TS type stripping). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { STRINGS, ACRONYM as SHARED_ACRONYM, LOCALES } from '../../shared/src/i18n.ts';

const SRC = readFileSync(new URL('../src/aidisclose.js', import.meta.url), 'utf8');

const block = SRC.match(/i18n-start[\s\S]*?\*\/([\s\S]*?)\/\* ---- i18n-end/);
assert.ok(block, 'i18n markers present in snippet source');
const { I18N, ACRONYM } = new Function(`${block[1]}; return { I18N, ACRONYM };`)();

test('snippet covers all 28 locales, no extras', () => {
  assert.deepEqual(Object.keys(I18N).sort(), [...LOCALES].sort());
});

test('interact/content/close/reviewed strings match shared i18n exactly', () => {
  for (const locale of LOCALES) {
    for (const key of ['interact', 'content', 'close', 'reviewed']) {
      assert.equal(I18N[locale][key], STRINGS[locale][key], `${locale}.${key}`);
    }
  }
});

test('made by humans label (hm) matches shared humanMade exactly', () => {
  for (const locale of LOCALES) {
    assert.equal(I18N[locale].hm, STRINGS[locale].humanMade, `${locale}.hm`);
  }
});

test('ACRONYM map matches shared i18n exactly', () => {
  assert.deepEqual(ACRONYM, { ...SHARED_ACRONYM });
});
