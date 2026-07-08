# The AIDisclose snippet

`aidisclose.js` is the on-site script that reads your `ai-disclosure.json` manifest and renders the disclosures the law requires: an interaction banner for chatbots, a persistent content notice, visible labels on marked media, and machine-readable page metadata. It is dependency-free, about 8.2 KB gzipped, and meets WCAG 2.1 AA.

This page is the full configuration and customization reference. For platform-by-platform install steps (WordPress, Shopify, Webflow, tag managers), see the [install guide](https://aidisclose.io/docs/install/). You can also read this document as [raw markdown](https://aidisclose.io/docs/snippet.md).

## Overview

One script tag drives everything. On load the snippet fetches your manifest, then renders only what the manifest declares:

- **Interaction banner**, for a `conversational` system: a notice that the visitor is talking to an AI.
- **Content notice**, for a `content-generation` system with `scope: site` or `scope: page`: a small persistent chip. Clicking it opens a short explanation with the notice text, your publisher name and system purpose from the manifest, and a link to the manifest file; the notice text links to a plain-language explainer on aidisclose.io. The "made by humans" badge opens the same card with the publisher name.
- **Per-element labels**, on any element you mark with `data-ai-content`: a visible "AI" badge, plus a machine-readable `data-digital-source-type`.
- **Page metadata**: a `<link rel="ai-disclosure">` and `<meta name="ai-disclosure">` pointing at your manifest.
- **"Made by humans" badge**, when the manifest sets `noAiDeclared`.

Everything below is optional. With no configuration the snippet reads your `/.well-known/ai-disclosure.json`, renders in the visitor's language across 28 locales, follows the operating system light or dark preference, and stacks above known cookie-consent bars so the two never overlap.

## Install

Add the tag once, in your site's shared template, theme header, or tag manager, and it ships with every page. It can sit in the `<head>` or anywhere before `</body>`; it is deferred, so placement does not change behavior:

```html
<script src="https://cdn.aidisclose.io/v1/aidisclose.js" defer></script>
```

With no attributes the snippet reads the manifest at `https://YOURDOMAIN/.well-known/ai-disclosure.json`. If your platform cannot serve a file at the domain root, host the manifest with AIDisclose and point the tag at it by key:

```html
<script src="https://cdn.aidisclose.io/v1/aidisclose.js" data-aidisclose="YOUR_SITE_KEY" defer></script>
```

If the manifest cannot be reached, the snippet logs a console warning and renders no manifest-driven notices, so a fetch failure never shows a guessed notice. Page metadata, your `[data-ai-content]` labels, and a banner forced with `data-banner="true"` still render.

## Configuration

There are three ways to configure the snippet. Use whichever fits your platform.

**1. Attributes on the script tag.** The simplest path, no extra code:

```html
<script src="https://cdn.aidisclose.io/v1/aidisclose.js"
        data-theme="light" data-lang="fr" defer></script>
```

**2. A global config object.** Define `window.AIDiscloseConfig` before the script runs. It exposes the full option set, including the selector options that have no attribute form:

```html
<script>
  window.AIDiscloseConfig = {
    theme: 'light',
    mountSelector: '#ai-disclosure-slot',
    triggerSelector: '#chat-launcher',
  };
</script>
<script src="https://cdn.aidisclose.io/v1/aidisclose.js" defer></script>
```

**3. Manual initialization.** Add `data-manual` to defer auto-start, then call `AIDisclose.init()` yourself once your app is ready (useful in single-page apps):

```html
<script src="https://cdn.aidisclose.io/v1/aidisclose.js" data-manual defer></script>
<script>
  AIDisclose.init({ theme: 'dark', persistentChip: false });
</script>
```

If more than one source is present, `window.AIDiscloseConfig` wins: it overrides both the script-tag attributes and any object passed to `AIDisclose.init()`.

### Options reference

The option surface is stable for the 1.x line.

| Option | Attribute | Values | Default | Effect |
| --- | --- | --- | --- | --- |
| `theme` | `data-theme` | `light`, `dark`, `auto` | `auto` | Color scheme. `auto` follows the visitor's OS preference. |
| `siteKey` | `data-aidisclose` | string | none | Load the AIDisclose-hosted manifest for this key instead of the well-known file. |
| `manifestUrl` | `data-manifest-url` | URL | `/.well-known/ai-disclosure.json` | Read the manifest from a custom URL. |
| `lang` | `data-lang` | BCP-47 code | page `<html lang>`, else the visitor's language | Force a display language. |
| `banner` | `data-banner` | `true`, `false` | auto | Force the interaction banner on or off. Left unset, it shows only when your manifest declares a conversational (chatbot) system. |
| `persistentChip` | — | `true`, `false` | `true` | Show or suppress the interaction banner's collapsed mini-chip (the small pill it minimizes to). |
| `alwaysShow` | — | `true`, `false` | `false` | Show the banner again on every visit, ignoring the visitor's dismissal (remembered in the browser's `localStorage`). |
| `mountSelector` | — | CSS selector | none | Render the banner inline inside this element instead of the fixed bottom overlay. |
| `triggerSelector` | — | CSS selector | none | Show the interaction banner only after the visitor clicks this element, such as a chat launcher. Pages with no matching element show no banner, so a chatbot that exists on some pages discloses only there. Launchers injected after load still work. A visitor who dismissed the banner earlier still sees the mini-chip. |
| `adjacentSelector` | — | CSS selector | none | Place a label next to an element you cannot mark directly, such as a closed widget or an iframe. |
| `observe` | — | `true`, `false` | `true` | Watch the DOM for content added later and label it. Set `false` on fully static pages. |
| `beaconUrl` | — | URL | none | Post an anonymous `{siteKey, flag}` beacon on notable events. No cookies, no personal data. |

`data-manual` is not an option value: its presence on the tag defers auto-start so you can call `AIDisclose.init()` yourself.

## Theming and appearance

Set the built-in scheme with `theme` (`light`, `dark`, or `auto`). To match your brand exactly, override the snippet's CSS custom properties in your own stylesheet. They are defined on `.aid-banner, .aid-chip`:

| Variable | Controls |
| --- | --- |
| `--aid-bg` | Background |
| `--aid-fg` | Text |
| `--aid-line` | Border |
| `--aid-btn` | Dismiss-button border |
| `--aid-btnfg` | Dismiss-button text |
| `--aid-hov` | Dismiss-button hover |

```css
.aid-banner, .aid-chip {
  --aid-bg: #0b1020;
  --aid-fg: #e8eaed;
  --aid-line: #2a2f36;
}
```

The snippet ships no `!important` rules and uses low-specificity selectors, so your CSS wins. The class hooks are `.aid-banner`, `.aid-chip`, `.aid-badge`, `.aid-badge-inline`, `.aid-wrap`, `.aid-ai` (content notice), and `.aid-hm` ("made by humans"). Restyle spacing, radius, and shadow on these directly.

By default the banner is a fixed overlay at the bottom of the viewport. Set `mountSelector` to render it inline and static inside an element you control, so it sits within your own layout.

## Custom wording

The banner and chip carry accurate localized text in 28 languages out of the box. To override the wording:

- **Per language, in the manifest.** Add `disclosure.texts` to a system, keyed by language code. The snippet uses your text for the matching visitor language:

```json
{
  "disclosure": {
    "texts": { "en": "Some copy on this page was drafted with AI.", "fr": "Une partie du texte a été rédigée avec de l'IA." }
  }
}
```

- **Per element.** Add `data-ai-label` to a marked element to set that badge's label.

When a system sets `editorialResponsibility.humanReview: true` and its content is not fully AI-generated or manipulated, the notice automatically reads "AI-assisted, human-reviewed" in the visitor's language, instead of "AI-generated".

## Marking your AI content

The snippet only labels what you mark. Add `data-ai-content` to any AI-generated element:

```html
<img data-ai-content src="/img/generated.webp" alt="…">
<p data-ai-content>AI-drafted summary…</p>
<video data-ai-content src="/clip.mp4"></video>
```

Each marked element receives a visible "AI" badge and a machine-readable `data-digital-source-type` (defaulting to `trainedAlgorithmicMedia`, an IPTC and schema.org compatible value). Add `data-ai-label` for custom label text, or set `data-digital-source-type` yourself to be more specific.

For AI you cannot annotate directly, such as a third-party chat widget in a closed iframe, use `adjacentSelector` to place a label beside it, or `triggerSelector` to reveal the interaction banner when the widget opens.

A content-generation notice can cover the whole site (`disclosure.scope: "site"`) or specific pages (`disclosure.scope: "page"` with a `disclosure.pages` list of path globs, such as `/blog/*`). A page-scope match takes precedence over a site-scope one, and a page-scope system with no matching path renders nothing there.

## Single-page apps and frameworks

The snippet watches the DOM with a `MutationObserver` and re-evaluates the applicable notice on route changes, so content and pages added after load are still labeled. In an SPA:

- Keep `observe` at its default (`true`) so client-rendered content is caught.
- If you gate initialization on app readiness, add `data-manual` and call `AIDisclose.init()` after your framework mounts.
- Page-scope notices update automatically as the route changes; no per-route call is needed.

Set `observe: false` only on fully static pages where nothing is injected after load.

## Content Security Policy

If you enforce a Content Security Policy, allow the snippet explicitly.

> [!WARNING]
> A strict `script-src 'self'` blocks the CDN snippet silently, and the disclosures never render. This is the most common reason a correctly declared site does not reach Level 2.

- **`script-src`**: add `https://cdn.aidisclose.io`, or self-host `aidisclose.js` from your own origin and keep `'self'`.
- **`style-src`**: the snippet injects its styles inline, so `'unsafe-inline'` is enough. If you do not allow inline styles, it falls back to loading `aidisclose.css` from the script's directory, so also allow `https://cdn.aidisclose.io` in `style-src` (or self-host that file alongside the script).
- **`connect-src`**: the manifest fetch is same-origin for the well-known file and needs nothing extra. If you load the manifest by key, allow `https://cdn.aidisclose.io`.

The manifest is fetched without credentials, so serve it publicly: an endpoint that requires cookies or authentication will not receive them.

## Versioning and integrity

The CDN serves three tracks:

- `/v1/aidisclose.js` follows the latest 1.x release. Recommended for most sites.
- `/v1.0.0/aidisclose.js` is a fixed, immutable version you can pin, with Subresource Integrity:

```html
<script src="https://cdn.aidisclose.io/v1.0.0/aidisclose.js"
        integrity="sha384-…" crossorigin="anonymous" defer></script>
```

- `/latest/aidisclose.js` always tracks the newest release across major versions.

To get the SRI hash to pin, build the snippet: `npm run build` in `packages/snippet` prints it (the source is [open on GitHub](https://github.com/martelman/aidisclose)).

## Building your own disclosure UI

You can render your own disclosure UI instead of the built-in one. There is no single off switch: `data-banner="false"` and `persistentChip: false` suppress only the interaction banner and its chip, while content notices, per-element `[data-ai-content]` badges, and the "made by humans" badge still render from your manifest and markup. A fully custom UI means not relying on those and rendering your own.

> [!NOTE]
> The AIDisclose checker verifies rendering by detecting the reference snippet's markup. A fully hand-built disclosure is valid, but it is not auto-detected, so the site stays at Level 1 (Declared) rather than Level 2 (Rendered) unless your custom markup reproduces what the checker looks for. If Level 2 matters to you, keep the built-in rendering and restyle it with CSS.

## Accessibility

The rendered UI meets WCAG 2.1 AA: visible `:focus-visible` outlines on interactive controls, correct roles and labels, contrast that holds in light and dark, and animation gated behind `prefers-reduced-motion`. The snippet also detects known cookie-consent bars and stacks above them so disclosures are never hidden behind a CMP. On very narrow screens the interaction banner opens as the compact chip so it never covers content.
