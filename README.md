# Preset UI — The Interface Atelier

A responsive, coded interface-reference website with **ambient bloom, dark glassmorphism, animated compositions, functional component previews, and detailed design documentation**.

**[Explore the gallery](./index.html)** · **[Read the docs](./docs.html)** · **[AI design reference](./AI_REFERENCE.md)**

> Intended as a visual reference for people and AI coding assistants. This is a functional static website, not a collection of screenshots.

## What's included

- Six **coded UI directions**: Obsidian, Aurora, Halo, Prism, Orbit and Mono.
- Full responsive landing page with editorial typography, glass panels, animated orbit details and atmospheric glow.
- Interactive gallery filters and accessible preview dialogs.
- **Live appearance studio**: adjust bloom (0–100%), corner radius, and five accent colors; copy generated CSS tokens.
- Working theme toggle, mobile navigation and toast feedback.
- Buttons, forms, status treatments, charts and component demos.
- Dedicated documentation page with quick start, design tokens, component recipes, bloom effects, motion, responsive rules and accessibility.
- **AI_REFERENCE.md**: structured instructions, visual specifications and a copy-ready prompt for AI-assisted projects.
- Zero frontend framework or bundler dependency. Optional Google Fonts load, with system fallbacks.
- Support for keyboard navigation and reduced-motion preferences.

## Run it

Clone the repository and open index.html in a modern browser. For a local static server:

~~~sh
git clone https://github.com/taithedev/PresetWebsiteUI.git
cd PresetWebsiteUI
python -m http.server 8000
~~~

Visit http://localhost:8000 and http://localhost:8000/docs.html.

Python is only used here to host the files locally; the website itself is **plain HTML/CSS/JS**.

## Use Preset UI as an AI design reference

Give your AI coding assistant:

**Repository:** https://github.com/taithedev/PresetWebsiteUI

**Reference files:** AI_REFERENCE.md + styles.css + design-tokens.json (+ index.html for structural examples).

Suggested instruction:

> Read AI_REFERENCE.md and styles.css from https://github.com/taithedev/PresetWebsiteUI. Use this as the visual reference for my website: precise dark glass surfaces, bloom lighting, animated atmosphere, rounded controls, premium typography, and deliberate spacing. Adapt the look to my own product and keep every feature functional. Ensure mobile responsiveness, accessibility and reduced-motion support. If you cannot access the repository, ask me to provide the files; don't invent details.

AI tools that cannot access GitHub will need files pasted/uploaded. See the full contract in [AI_REFERENCE.md](./AI_REFERENCE.md).

## Files

| File | Responsibility |
|---|---|
| index.html | Gallery, hero, preset mockups, interactive studio |
| styles.css | Color system, layouts, effects, component styles |
| app.js | Theme switch, menu, presets, modal, studio, clipboard |
| docs.html | Reference documentation |
| docs.css | Documentation design and responsive layout |
| docs.js | Documentation section tracking and demo interactions |
| AI_REFERENCE.md | AI-friendly design contract |
| AGENTS.md | Guidelines for future coding agents |
| design-tokens.json | Structured design tokens for tools and AI assistants |
| llms.txt | AI-oriented document index |
| favicon.svg | Scalable brand mark |

## Customize

Change the CSS variables at the top of styles.css. To avoid mismatched hues, update both accent variables together:

~~~css
:root {
  --accent: #62d8ef;
  --accent-rgb: 98 216 239;
  --bloom: .65;
  --radius: 22px;
}
~~~

Alternatively, open the home page's studio, adjust the visual settings and click **Copy CSS tokens**.

## Deploy a static site

This repo is compatible with static hosting. For **GitHub Pages**, configure **Settings → Pages → Deploy from a branch**, choose **main** and **/(root)**. The repo uses relative asset paths so it also works at a repository subpath. Deployment availability depends on the repository's GitHub settings.

For **Vercel** or **Netlify**, import this repository as a static project and use the repo root as the publish directory. No build command is required.

This README does not imply the site is already deployed. Use the GitHub repository for the source until you verify a live hosting URL.

## Quality guidance

Motion is decorative, and reduced-motion preferences disable it. All primary controls use real HTML buttons and links, and preview overlays use native dialogs. The stylized dashboards are **visual examples**, not a financial service or a connected analytics backend. Status and charts inside mockups illustrate styles only.

The site contains no backend, authentication service, payment processing, API tokens, or real user-data collection. When reusing its style in another application, implement those functions separately rather than implying the reference site provides them.

## Reuse

Use the design documentation to inform your own implementation. **Public repository visibility is not automatically an open-source copyright license.** Check for a license or request permission before copying substantial original source code.

---

Created for the [PresetWebsiteUI repository](https://github.com/taithedev/PresetWebsiteUI).