import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import Ajv2020Mod from 'ajv/dist/2020.js';

const Ajv2020 = Ajv2020Mod.default ?? Ajv2020Mod;

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const schema = read('../ai-disclosure.schema.json');

// The spec promises independent implementers can build a validator from the
// schema alone. That means it MUST compile under a stock Ajv2020 with default
// (strict) options and no formats plugin — no `strict:false`, no addFormats.
test('schema compiles under a default strict Ajv2020 (no plugins)', () => {
  assert.doesNotThrow(() => new Ajv2020().compile(schema));
});

const ajv = new Ajv2020({ allErrors: true });
const validate = ajv.compile(schema);

// Every manifest in examples/ must validate. The set exercises the full surface:
// the golden example, minimal-valid, noAiDeclared (evidence relaxed), an
// emotion-recognition + audio-notice pair, and a forward-compat manifest using a
// newer specVersion, x- extension fields, and an unknown `kind`.
test('every example manifest validates', () => {
  const dir = new URL('../examples/', import.meta.url);
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  assert.ok(files.length >= 5, 'expect the example matrix');
  for (const f of files) {
    const ok = validate(read(`../examples/${f}`));
    assert.ok(ok, `${f} must validate:\n${JSON.stringify(validate.errors, null, 2)}`);
  }
});

// Each invalid fixture isolates exactly one rule; the map is the source of truth
// for which fixtures exist and why each one fails.
const invalidExpect = {
  'missing-required.json': (e) => e.keyword === 'required' && e.params.missingProperty === 'publisher',
  'bad-enum.json': (e) => e.keyword === 'enum' && e.instancePath.endsWith('/role'),
  'bad-pattern.json': (e) => e.keyword === 'pattern' && e.instancePath.includes('/publisher/'),
  'page-scope-no-pages.json': (e) => e.keyword === 'required' && e.params.missingProperty === 'pages',
  'retention-too-short.json': (e) => e.keyword === 'minimum' && e.instancePath === '/evidence/retentionMonths',
  'noai-with-systems.json': (e) => e.keyword === 'maxItems' && e.instancePath === '/aiSystems',
  'bad-bcp47.json': (e) => e.keyword === 'pattern' && e.instancePath.startsWith('/languages/'),
};

test('the invalid-fixtures directory matches the expected set', () => {
  const files = readdirSync(new URL('../examples/invalid/', import.meta.url)).filter((f) => f.endsWith('.json'));
  assert.deepEqual(files.sort(), Object.keys(invalidExpect).sort());
});

test('every invalid fixture fails, for its intended reason', () => {
  for (const [file, match] of Object.entries(invalidExpect)) {
    const ok = validate(read(`../examples/invalid/${file}`));
    assert.equal(ok, false, `${file} must be invalid`);
    assert.ok(
      (validate.errors ?? []).some(match),
      `${file} must fail for its intended reason: ${JSON.stringify(validate.errors)}`,
    );
  }
});
