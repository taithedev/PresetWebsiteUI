# AI agent guidance for Preset UI Studio v2

## Mission
Maintain a production-minded, beautiful, functional frontend UI library and visual reference. Its examples are working client-side demos with HTML/CSS/JS exports, not production backends.

## Read before editing
- README.md
- AI_REFERENCE.md
- assets/css/tokens.css, shell.css and kit.css
- assets/data/*.js
- assets/js/app.js, zip.js and vault.js
- docs/index.html and assets/css/docs.css

## Required architecture
- Keep the static site free of build steps unless a user explicitly requests one.
- Library examples must be located in organized category files under assets/data, be self-contained markup, and rely on assets/css/kit.css.
- Add data entries with unique slug IDs; required keys are id, title, description, category, html. Optional css/js/tags/symbol/kind. A full-page pattern has kind: pattern.
- All visual controls in the demo kit must work where reasonable. Avoid fake buttons with no action, except for clearly illustrative, noninteractive dashboard chrome.
- Keep the inspector sandbox: do NOT give imported snippets same-origin access to the parent. Render uploads as escaped text, not as executable HTML in the parent app.
- Do not add secret keys or privileged APIs to browser files.
- Preserve IndexedDB privacy semantics; file uploads remain local-only unless the user explicitly authorizes a remote storage product.
- Maintain ZIP export compatibility with HTML, shared CSS/JS and metadata. Verify uncompressed archives in typical ZIP readers.
- Keep design tokens and machine-readable docs consistent with any modified core styles.
- Keep repository-relative asset links so hosting in a GitHub Pages subpath works.

## Design principles
Use midnight layered backgrounds, near-invisible borders, restrained violet bloom, precise typography, consistent rounded elements and purposeful motion. Do not blur text or create runaway GPU effects. Honor prefers-reduced-motion, keyboard navigation and mobile layout.

## Test checklist
- Parse all JS and JSON sources; catch duplicate component IDs.
- Test routes #/explore, #/components, #/patterns, #/playground, #/saved and #/files.
- Test search (including Ctrl/Cmd+K and keyboard result navigation).
- Test category filters and saved items with localStorage.
- Test inspector modal, iframe preview (dark/light), code tabs and copy/export controls.
- Test ZIP archive content and opening exported HTML/CSS/JS together.
- Test component JSON importer including malformed and oversized input.
- Test file uploads, nested folder imports, folder ZIP and text previews (do not execute uploaded scripts).
- Test focus, touch, 320px narrow layouts, light/dark themes and reduced-motion.
- State which browser tests were run and which remain unverified.

## Safety of imported snippets
Custom JSON includes user-controlled HTML/CSS/JS. Only execute in sandboxed opaque-origin iframe. Even sandboxed code may make network requests; never present imported code as inherently trustworthy.
