# Preset UI Studio · v2.0

A real, exportable UI component library with 34 examples, live previews, rich dark-glass styling, local file workspace, custom JSON imports and dependency-free source exports.

[Explore Studio](./index.html) · [Documentation](./docs/) · [AI Reference](./AI_REFERENCE.md) · [Design Tokens](./design-tokens.json)

## Included tools

| Area | Features |
|---|---|
| Discover | Library homepage with featured reusable elements |
| Components | Search/filter 30 components across five categories |
| Patterns | Four complete hero, login, pricing and dashboard compositions |
| Inspector | Sandboxed interactive preview and HTML / CSS / JavaScript viewer |
| Source exports | Download working component ZIPs or the full kit, including real code |
| Playground | Set bloom intensity, corners and five accent colors; export tokens |
| Saved items | Save and download a browser-local collection |
| Custom components | Import JSON components with HTML, CSS and optional JS |
| File workspace | Upload any file type, import folders, preview text, download originals, export folder ZIP |
| Documentation | Practical setup, accessibility, design system and AI usage |

Showcase metrics and user states are illustrative. UI samples do not provide production logins, remote data, billing or authenticated APIs; connect your own backend.

## Quick start

Clone the repository and serve its root as static files:

    git clone https://github.com/taithedev/PresetWebsiteUI.git
    cd PresetWebsiteUI
    python -m http.server 8000

Open http://localhost:8000/ and http://localhost:8000/docs/

No framework, Node packages, bundler, database or API keys are required. Directly opening a local file URL may prevent CSS/JS source exports because of browser restrictions: run localhost or use deployed static hosting for the full tool.

## Folder structure

    PresetWebsiteUI/
    ├── index.html
    ├── docs/
    │   └── index.html
    ├── assets/
    │   ├── css/
    │   │   ├── tokens.css
    │   │   ├── shell.css
    │   │   ├── kit.css
    │   │   └── docs.css
    │   ├── data/
    │   │   ├── buttons.js
    │   │   ├── forms.js
    │   │   ├── navigation.js
    │   │   ├── feedback.js
    │   │   ├── surfaces.js
    │   │   └── patterns.js
    │   └── js/
    │       ├── app.js
    │       ├── kit-interactions.js
    │       ├── zip.js
    │       ├── vault.js
    │       └── docs.js
    ├── AI_REFERENCE.md
    ├── design-tokens.json
    ├── AGENTS.md
    ├── llms.txt
    └── README.md

The old docs.html URL redirects to docs/ for backwards compatibility.

## Adding components

The category source files in assets/data/ append plain JavaScript objects to window.PresetLibrary. An imported JSON entry has this shape:

    {
      "id": "custom-button",
      "title": "Custom button",
      "description": "A custom actionable control",
      "html": "<button class=\"ui-btn\">Continue</button>",
      "css": ".ui-btn { letter-spacing: .02em; }",
      "js": ""
    }

Import through Components → Import JSON components. It also accepts arrays and objects with a components array. Imported components are saved to localStorage, NOT committed to the shared GitHub repository. They render in sandboxed opaque-origin iframes, where custom scripts can run; only import code you trust. To add public built-ins, edit the relevant assets/data category file.

## Exporting source

An individual component ZIP includes:

    component-name/
      index.html      Runnable standalone example
      styles.css      Kit CSS + design overrides
      script.js       Portable demonstration interactions
      component.json  Reusable metadata/markup
      README.md       Usage notes

Download whole kit exports the components as HTML example files with shared styles and scripts. All exports are assembled in your browser without a remote service. ZIP data is stored uncompressed to remove external library dependencies. Demo actions require real integrations before production use.

## Browser-local file workspace

File workspace uses **IndexedDB** to store arbitrary files as Blobs. Create folders, import directories, safely preview text formats, download individual files and export folders to ZIP. Imported files are never sent to this application's server.

Limits: **20 MB per file**, **80 MB per batch**, subject to browser storage quota. No cloud synchronization or cross-device access exists. Clearing browser site data may delete everything in the workspace; download ZIP backups for important files. Directory import support varies by browser.

## Theme & AI guidance

Customize the full visual language in Playground; export CSS or design-token JSON. Use the shared assets/css/kit.css primitives directly in new projects.

For AI-assisted coding, supply the public repository URL plus AI_REFERENCE.md, design-tokens.json and relevant assets/data files. An AI assistant cannot inspect those files merely because you mention the URL; it must have repo access or receive uploaded/pasted code.

Example instruction: Use the Preset UI Studio repository as the visual reference. Adapt its dark glassmorphism, precise borders, tasteful bloom, motion and tokens while preserving my app's real features and backend. Make every control functional and accessible, including keyboard and reduced-motion support.

## Keyboard controls

Ctrl+K / Cmd+K opens global search. Arrow keys select a result, Enter opens it, and Escape closes dialogs. Native controls, focus styles, navigation links and reduced-motion support are included, but implement and test full accessibility requirements for your target product.

## Hosting

Deploy this static project through GitHub Pages, Vercel or Netlify. For GitHub Pages configure Settings → Pages → Deploy from a branch → main → /(root). The source is committed to GitHub, but that does not prove a live hosted URL is already available.

## Reuse

Public visibility does not itself grant a copyright license. Check permissions before copying substantial source into external products. The design ideas may inspire independently authored implementations.

---
Preset UI Studio · The Interface Atelier.