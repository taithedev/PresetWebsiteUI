# Instructions for AI coding assistants — PresetWebsiteUI

## Mission

Maintain a high-quality **functional static reference website** for the Preset UI visual system. Preserve its coherent dark-glass identity, intentional ambient bloom, interaction polish, accessibility and documentation quality.

## Read first

1. README.md — purpose and setup.
2. AI_REFERENCE.md — visual language and design tokens.
3. styles.css — authoritative live implementation.
4. index.html + app.js — functionality and markup.
5. docs.html + docs.css + docs.js — documentation.

## Project contract

- This is a **framework-free** site. Do not introduce a framework, build step, package manager, complex dependency chain or backend without a concrete requirement.
- Preserve working asset paths relative to the repository root. The site must support both root hosting and GitHub Pages repository subpaths.
- Keep tokens at the top of styles.css; update AI_REFERENCE.md and docs.html when token definitions or visual principles change.
- Design new interface pieces with real semantic HTML/CSS/JS, never static screenshots as substitutes for functional elements.
- Do not claim a mock card is connected to real data. Demo dashboards, balances and statuses are illustrative.
- Buttons, filters, dialogs, sliders, toggles, forms and navigation must have real, testable behavior.
- Respect keyboard access, discernible labels, visible focus, usable contrast and prefers-reduced-motion.
- Never put passwords, privileged tokens, secrets or administrator controls in publicly shipped client code.
- Avoid duplicated DOM IDs, DOM injection of user-controlled HTML and broad global event handlers that could break the site.
- Optimize for mobile as well as 1440px desktop layouts; avoid horizontal overflow.
- When adding pages, keep header, brand, type, navigation, and dark/light themes consistent.
- Avoid excessive blur filters, long main-thread animations, unstable layout shifts and decorative components that intercept clicks.

## Visual defaults

Background #080911. Primary surface #10111b. Accent #9b8cff, paired RGB channels 155 140 255. Text #f5f4fd. Large radius 22px. Bloom 0.65. Space Grotesk for headings; DM Sans for UI text. Details are in AI_REFERENCE.md.

## Before finishing any change

- Verify JS syntax and that linked files actually exist.
- Check nav links, gallery filters, preview dialog close (including Escape), theme toggle, bloom/radius/color controls and copied tokens.
- Check docs anchors and copy prompt buttons.
- Test at 320px, 660px, 900px and desktop widths where possible.
- Check light and dark appearances and prefers-reduced-motion.
- Document meaningful new reusable styles in docs.html and AI_REFERENCE.md.
- Clearly state what you tested and what you could not verify.

## Scope boundary

Use this site to teach and showcase visual design. Do not automatically copy third-party trademarks or suggest the existing stylized mockups provide backend services.