# Changelog

All notable changes to the open AIDisclose components (snippet, shared i18n table, schema).
This project follows [Semantic Versioning](https://semver.org). The version tracks the
snippet's `VERSION`; the manifest schema carries its own `specVersion`.

## v1.0.0

First public release of `aidisclose.js` and the AIDisclose manifest schema.

Snippet:

- Article 50(1) interaction banner (chat-mount aware, SPA-safe, consent-layer aware).
- Site, page, and element scoped AI-content disclosure. `disclosure.scope` renders a
  persistent site-wide notice, a per-page notice on URL globs (`disclosure.pages`), or
  per-element labels on `[data-ai-content]` (including video overlay chips). The wording
  follows `editorialResponsibility.humanReview` (human-reviewed vs generated).
- Machine-readable page metadata and a `<link rel="ai-disclosure">` pointer.
- The content notice and made-by-humans chips open a details card on click: the notice
  text, the publisher name and system purpose from the manifest, and a link to the
  manifest file. The notice text links to a plain-language explainer on aidisclose.io.
  Esc, outside click, or a second click closes it.
- Hosted manifests read from the CDN (`https://cdn.aidisclose.io/v1/hosted-manifest/KEY`),
  edge-cached so read load is independent of visitor traffic. Self-hosted `/.well-known/`
  manifests work with zero configuration.
- Single-tag install (`data-aidisclose="KEY"`), plus `data-manifest-url`, `data-lang`,
  `data-theme`, `data-banner`, `data-manual`; `window.AIDiscloseConfig` takes precedence.
- 24-language string table (all official EU languages) with the Code-of-Practice AI acronym map.
- Dependency-free, about 7.8 KB gzipped, no cookies, no tracking.

Schema (`specVersion` 1.0.0):

- Jurisdiction-neutral `obligations` (`[{ jurisdiction, provisions, params }]`); provision tags are
  jurisdiction-scoped (EU `art50-1`…`art50-4`, California `sb942-latent`/`sb942-visible`/`sb942-detection-tool`, …),
  and `params` carries parameterized-law data (cadence, window, threshold, tool URL) without a schema change.
- Per-system `role`, `mediaTypes`, `publicInterest`, and `generationDegree`; per-system and manifest-level
  `editorialResponsibility`; disclosure `scope` / `pages`; `contentMarking` with a `detectionToolUrl`.
- `noAiDeclared: true` for sites that operate no AI systems: it relaxes the `evidence` requirement and drives
  the reference snippet's "Made by humans" badge. A publisher statement that AIDisclose does not verify.
- Built to grow: an `x-` extension namespace on every object, open (tolerant) enums for evolving fields, and
  `specVersion` validated by major (`^1.`), so newer manifests validate on older readers and vice versa.
- Compiles under a stock JSON Schema validator with no plugins. Served frozen at `/schema/1.0.0/` with a
  floating major alias at `/schema/1/`, with valid and invalid fixtures.
