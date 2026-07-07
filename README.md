# AIDisclose open components

[![CI](https://github.com/martelman/aidisclose/actions/workflows/ci.yml/badge.svg)](https://github.com/martelman/aidisclose/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

The open parts of [AIDisclose](https://aidisclose.io), an open standard for AI-content disclosure: the disclosure snippet your visitors see, the 24-language string table it renders from, and the JSON Schema for the `ai-disclosure.json` manifest. It maps to EU AI Act Article 50 and California SB 942 (both live 2 Aug 2026) and works as a voluntary baseline anywhere; the [directory of AI-disclosure laws by region](https://aidisclose.io/laws/) marks which duties are legally binding versus voluntary. MIT licensed. The full spec lives at [aidisclose.io/spec](https://aidisclose.io/spec).

> This repository is generated from the AIDisclose monorepo and published on each release. Don't open PRs against it directly. File issues here, and we'll land the fix upstream. Every commit corresponds to a tagged [release](https://github.com/martelman/aidisclose/releases).

## What's here

| Path | What it is |
|---|---|
| `packages/snippet` | `aidisclose.js`: renders the interaction-disclosure banner, visible AI labels on `[data-ai-content]` elements (including video overlay chips), and machine-readable page metadata. Dependency-free, about 7.8 KB gzipped, no tracking, no cookies. |
| `packages/shared/src/i18n.ts` | The banner and label strings in 24 languages, plus the localized AI acronym map from the EU Code of Practice. |
| `packages/schema` | JSON Schema for `/.well-known/ai-disclosure.json`, with valid and invalid examples. |
| `docs/SNIPPET.md` | Full configuration and customization reference: theming and brand colors via CSS variables, custom copy, content marking, single-page apps, Content Security Policy, and versioning. |

## Use it

One tag, added once to your site template or tag manager, loads with every page and renders only what your manifest declares. With no attributes it reads your own `/.well-known/ai-disclosure.json`:

```html
<script src="https://cdn.aidisclose.io/v1/aidisclose.js" defer></script>

<!-- mark AI-generated content anywhere on the page -->
<img data-ai-content src="/img/generated.webp" alt="">
```

Can't serve files at your domain root? Host the manifest with AIDisclose and point the tag at it by key:

```html
<script src="https://cdn.aidisclose.io/v1/aidisclose.js" data-aidisclose="YOUR_SITE_KEY" defer></script>
```

To theme it, change the copy, mark AI content, or handle a strict Content Security Policy, see the [snippet reference](docs/SNIPPET.md) (also at [aidisclose.io/docs/snippet](https://aidisclose.io/docs/snippet)).

The CDN file is the built output of `packages/snippet/src/aidisclose.js`. To verify it yourself:

```sh
cd packages/snippet
npm ci
npm run build      # prints the size and the SRI hash of the built file
node --test        # snippet behavior + 24-language parity tests
```

Most sites use the floating `/v1/` tag above and auto-update within v1.x. For high-assurance setups, pin the exact version path (`/v1.0.0/aidisclose.js`) plus its SRI hash (`npm run build` prints the hash to pin in `<script integrity="…">`). Pinned tags do not auto-update. The [install guide](https://aidisclose.io/docs/install/) shows how per platform.

## Validate a manifest

```sh
cd packages/schema
npm ci
node --test
```

Or paste your manifest into the free [checker](https://aidisclose.io/scan).

## What this repo is not

The crawler, evidence engine, and dashboard are the paid part of AIDisclose and are not in this repo. The snippet and manifest format work without them; the crawler and evidence engine are what make the disclosures provable afterwards.

## License

MIT, © Pine Solutions Inc.
