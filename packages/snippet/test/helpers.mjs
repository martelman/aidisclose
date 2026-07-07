import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

export const SRC = readFileSync(new URL('../src/aidisclose.js', import.meta.url), 'utf8');

export const MANIFEST_50_1 = {
  specVersion: '1.0.0',
  publisher: { name: 'Test', domain: 'site.example', contact: 'mailto:t@site.example' },
  lastUpdated: '2026-07-02',
  languages: ['en', 'fr'],
  aiSystems: [
    {
      id: 'bot',
      name: 'Bot',
      role: 'deployer',
      kind: 'conversational',
      purpose: 'support',
      obligations: [{ jurisdiction: 'eu', provisions: ['art50-1'] }],
      disclosure: { methods: ['banner'] },
    },
  ],
  evidence: { retentionMonths: 6 },
};

/** A content-generation system with a scope (site or page) + optional review flag. */
export function contentManifest({ scope = 'site', pages, humanReview, generationDegree } = {}) {
  return {
    specVersion: '1.0.0',
    publisher: { name: 'Test', domain: 'site.example', contact: 'mailto:t@site.example' },
    lastUpdated: '2026-07-02',
    languages: ['en'],
    aiSystems: [
      {
        id: 'copy',
        name: 'AI copy',
        role: 'deployer',
        kind: 'content-generation',
        purpose: 'AI-assisted text',
        obligations: [{ jurisdiction: 'eu', provisions: ['art50-4'] }],
        ...(humanReview !== undefined && { editorialResponsibility: { humanReview } }),
        ...(generationDegree && { generationDegree }),
        disclosure: { methods: ['banner'], scope, ...(pages && { pages }) },
      },
    ],
    evidence: { retentionMonths: 6 },
  };
}

/**
 * Boots the snippet IIFE inside a fresh jsdom window.
 * The snippet auto-inits (no currentScript) using win.AIDiscloseConfig.
 */
export function boot({ body = '', docLang = 'en', manifest = MANIFEST_50_1, fetchImpl, config = {}, pre, url = 'https://site.example/' } = {}) {
  const dom = new JSDOM(
    `<!doctype html><html lang="${docLang}"><head></head><body>${body}</body></html>`,
    { url, pretendToBeVisual: true }
  );
  const win = dom.window;
  win.AIDiscloseConfig = { manifestUrl: '/.well-known/ai-disclosure.json', ...config };
  win.fetch =
    fetchImpl ||
    (async () =>
      manifest === null
        ? { ok: false, json: async () => ({}) }
        : { ok: true, json: async () => manifest });
  if (pre) pre(win);
  new Function('window', 'document', SRC)(win, win.document);
  return { dom, win, doc: win.document };
}

/**
 * Boots the snippet the way a real single-tag install does: an actual <script>
 * element carrying data-* attributes, so document.currentScript is set and the
 * data-attribute config path (configFromTag) runs. Uses runScripts so jsdom
 * executes the injected tag.
 */
export function bootTag({ attrs = {}, body = '', docLang = 'en', manifest = MANIFEST_50_1, fetchImpl } = {}) {
  const dom = new JSDOM(
    `<!doctype html><html lang="${docLang}"><head></head><body>${body}</body></html>`,
    { url: 'https://site.example/', pretendToBeVisual: true, runScripts: 'dangerously' }
  );
  const win = dom.window;
  win.fetch =
    fetchImpl ||
    (async () =>
      manifest === null
        ? { ok: false, json: async () => ({}) }
        : { ok: true, json: async () => manifest });
  const s = win.document.createElement('script');
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  s.textContent = SRC;
  win.document.head.appendChild(s); // executes synchronously with currentScript = s
  return { dom, win, doc: win.document };
}

export const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

/** await async init (fetch → run) */
export async function settle() {
  await tick(0);
  await tick(0);
  await tick(0);
}
