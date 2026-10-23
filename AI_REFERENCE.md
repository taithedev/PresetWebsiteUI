# Preset UI Studio — AI Design Reference v2

Repository: https://github.com/taithedev/PresetWebsiteUI

This is a machine-readable, developer-friendly contract for borrowing Preset UI's **visual system and working component primitives**. The actual CSS and snippets in the repository are authoritative. If your AI coding assistant cannot access GitHub, provide this document, assets/css/kit.css, assets/css/tokens.css and relevant assets/data/*.js files manually.

## Identity

A polished, precise midnight UI language combining layered near-black surfaces, translucent 1px outlines, restrained lavender bloom, editorial Space Grotesk headings, DM Sans UI typography, luminous interactive accents, generous whitespace and subtle purposeful movement.

Avoid exaggerated glow on every element, blurred body text, flashing effects, layout shifts, oversized icons, fake interactions and inaccessible controls. Light should appear to emerge from specific surfaces.

## Studio CSS tokens

| Token | Value | Meaning |
|---|---|---|
| --background | #090a10 | Main application canvas |
| --surface | #11121c | Primary elevation |
| --surface-2 | #181925 | Secondary elevation |
| --surface-3 | #222333 | Raised controls |
| --text | #f3f3f8 | Primary copy |
| --subtle | #a3a2b8 | Secondary copy |
| --muted | #747589 | Quiet metadata |
| --line | rgba(210,205,255,.105) | Hairline borders |
| --line-strong | rgba(210,205,255,.19) | Emphasized borders |
| --accent | #b39bff | Main studio accent |
| --accent-rgb | 179 155 255 | RGB channels for transparent effects |
| --radius | 16px | Studio cards |
| --ease | cubic-bezier(.22,1,.36,1) | Motion curve |

## Exportable component kit CSS tokens

| Token | Value |
|---|---|
| --ui-bg | #10111c |
| --ui-text | #f5f4fc |
| --ui-muted | #9899b0 |
| --ui-surface | #191a28 |
| --ui-line | #ffffff22 |
| --ui-accent | #ad96ff |
| --ui-rgb | 173 150 255 |
| --ui-radius | 13px |
| --ui-glow | .55 |
| --ui-font | DM Sans, system-ui, sans-serif |

These are **two related token layers**. Studio tokens style the reference application; --ui-* tokens are intended for exported examples.

## Palette options

- Violet: #b39bff / 179 155 255
- Cyan: #6bdcf2 / 107 220 242
- Rose: #ff8cb7 / 255 140 183
- Mint: #91e3bb / 145 227 187
- Gold: #f7c37e / 247 195 126

When customizing, always change the accent hex and RGB-channel values together.

## Typography

- Display: Space Grotesk, weight 600–700, tracking around -.055em to -.073em.
- Body: DM Sans, weights 400–700, line height around 1.5–1.9.
- Labels: 9–11px uppercase with letter spacing 1–2px.
- Primary action: 11–13px bold and minimum interactive height around 40px.
- Use system font fallbacks if externally hosted fonts cannot load.

## Shapes, borders and layers

- Global cards: 13–18px radius, hairline translucent outline.
- Buttons: 9–11px radius with subtle inset highlight and slightly lifted hover.
- Ambient scene: radial gradient behind the content plus soft bloom shadows around focal objects.
- Dense nested surfaces get a small contrast delta instead of an entirely new color.
- Content should be readable without its decorative light effects.

Example:

    .luminous-card {
      border: 1px solid rgb(var(--ui-rgb) / .32);
      border-radius: var(--ui-radius);
      background: linear-gradient(140deg, rgb(var(--ui-rgb) / .21), #171625 56%, #11121b);
      box-shadow: 0 0 calc(40px * var(--ui-glow)) rgb(var(--ui-rgb) / .17),
                  inset 0 1px #ffffff26,
                  0 25px 65px #0006;
    }

Keep glow sources behind crisp content. Do not blur headings or buttons.

## Motion recipe

- Hover feedback: 180–320 ms; subtle translateY plus highlight.
- Reveal: 500–800 ms; opacity and transform only.
- Ambient float: 6–12 seconds; small amplitude, quiet movement.
- Prefer transform and opacity animations, not blur/filter changes.
- Honor reduced-motion settings by disabling nonessential animations and transitions.

## Library categories and where to find them

- Buttons: assets/data/buttons.js — primary, gradient, outline, icon, loading and pills.
- Forms: assets/data/forms.js — text/search inputs, toggles, checkboxes, segmented controls and selects.
- Navigation: assets/data/navigation.js — tabs, breadcrumbs, pagination and compact nav.
- Feedback: assets/data/feedback.js — badges, alert, progress, toast, tooltip and skeleton.
- Surfaces: assets/data/surfaces.js — glass card, stat, profile, pricing, dialog visual, table, timeline, notifications.
- Patterns: assets/data/patterns.js — SaaS hero, login, pricing comparison and dashboard.
- Shared style: assets/css/kit.css — CSS primitives for every example.
- Shared behavior: assets/js/kit-interactions.js — demo actions and validation.

A component entry has id, title, description, category, symbol, tags and html, with optional css/js. Patterns additionally declare kind=pattern.

## General implementation instructions

1. Inspect the target application's existing routing, state, backend and data model before editing.
2. Choose one coherent subset of Preset UI primitives, not the entire catalog at once.
3. Reuse semantic markup, form labels and keyboard interactions.
4. Wire every new action to real target-app behavior. Show explicit demo status when no backend exists.
5. Preserve brand distinctions and the destination product's information architecture.
6. Implement responsive layouts at 320px, mobile, tablet and desktop sizes. Avoid horizontal overflow.
7. Preserve reduced-motion support and visible keyboard focus.
8. Keep secrets and privileged tokens out of frontend code.
9. Avoid claiming that sandboxed visual previews are full apps, payments, cloud storage or backends.
10. Verify both the visual composition and functionality instead of relying on screenshots alone.

## Static site architecture

- index.html = app shell.
- assets/css/tokens.css + shell.css = studio styling.
- assets/data/*.js = interactive catalog content.
- assets/js/app.js = routes, inspector, search, customization, saved items, exports.
- assets/js/zip.js = offline ZIP writer.
- assets/js/vault.js = IndexedDB file workspace.
- docs/index.html + assets/css/docs.css + assets/js/docs.js = documentation.
- design-tokens.json = structured tokens and palette.
- llms.txt = AI-oriented index.

The workspace file storage is device-local. JSON-imported components are also local-only. GitHub repository changes are a separate developer workflow.

## Accessible export workflow

The inspector can export a ZIP with index.html, styles.css, script.js, component.json and README.md. The exported examples are framework-independent, but demo events (such as toast or login validation) do not replace backend integration. Files are assembled client-side. The source file fetch requires localhost or static web hosting rather than file://.

## Copy-ready AI prompt

> Use https://github.com/taithedev/PresetWebsiteUI as my visual reference. First read AI_REFERENCE.md, assets/css/kit.css, assets/css/tokens.css and the matching catalog examples. Adopt its subtle near-black glass surfaces, well-controlled lavender bloom, crisp typography, rounded cards, accurate focus states and smooth restrained motion. Keep all existing routes, working features, backend integration and accessibility intact. Use its code as structural reference and write maintainable, original application code for my stack. Verify every control. Support mobile and prefers-reduced-motion. If GitHub is inaccessible, ask for these reference files.

## Important caveats

Public source access does not automatically grant copyright permission to copy code. Check available licensing and permissions before redistributing original source. UI demonstration values are illustrative; do not treat their status labels, fake metrics or forms as production data.

Preset UI Studio v2.0 · The Interface Atelier.