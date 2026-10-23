# Preset UI — AI Design Reference

**Purpose:** A reusable, machine-readable visual design contract. Use this document, the actual styles, and the working site as a reference for building an original interface. Do not treat a screenshot as a complete specification.

**Repository:** https://github.com/taithedev/PresetWebsiteUI

**Important files:** index.html (visual examples), styles.css (definitive CSS), app.js (behavior), docs.html (human documentation), docs.css (docs style), and AGENTS.md (project conventions).

**Access note:** If you cannot read the repository, ask for AI_REFERENCE.md and styles.css. Do not claim you have inspected the site when you have not. This repository is a static site; do not claim it is deployed without a verified live URL.

## 1. Visual direction

Preset UI uses a **near-black midnight canvas**, charcoal-violet layers, one-pixel translucent borders, diffused violet lighting, controlled glass effects, luminous focal accents, and precise typography. **Space Grotesk** gives display headings an editorial identity, while **DM Sans** maintains utility text readability. Spacing is intentional. Rounded corners feel soft but consistent. Light creates depth without obscuring the interface. Motion responds to actions instead of distracting from them.

This is a **visual language**, not a requirement to reproduce any particular product branding. Adapt the style to the destination app.

## 2. Core CSS design tokens

| Custom property | Default | Purpose |
|---|---|---|
| --bg | #080911 | Main page background |
| --bg-elevated | #0d0e18 | Elevated section background |
| --surface | #10111b | Primary panel |
| --surface-2 | #181a28 | Secondary panel |
| --surface-3 | #222435 | Higher-elevation surface |
| --text | #f5f4fd | Main text |
| --muted | #999aaf | Subtext |
| --faint | #656779 | Nonessential labels |
| --border | rgba(209,205,255,.105) | Hairline separation |
| --border-strong | rgba(209,205,255,.20) | Elevated outlines |
| --accent | #9b8cff | Main accent |
| --accent-rgb | 155 140 255 | RGB channels for opacity |
| --bloom | .65 | Glow intensity multiplier |
| --radius | 22px | Adjustable card radius |
| --container | 1240px | Main content max-width |
| --ease | cubic-bezier(.22,1,.36,1) | Standard easing |

~~~css
:root {
  color-scheme: dark;
  --bg: #080911;
  --bg-elevated: #0d0e18;
  --surface: #10111b;
  --surface-2: #181a28;
  --text: #f5f4fd;
  --muted: #999aaf;
  --border: rgba(209,205,255,.105);
  --accent: #9b8cff;
  --accent-rgb: 155 140 255;
  --radius: 22px;
  --bloom: .65;
  --ease: cubic-bezier(.22,1,.36,1);
}
~~~

Accent alternatives built into the studio: violet (#9b8cff), cyan (#62d8ef), pink (#ff84b3), lime (#b5e47a), and amber (#f4ba74). Update both --accent and --accent-rgb together.

## 3. Typography and spacing

- Display type: Space Grotesk, weight 600–700, tight tracking (-.065em), line-height 1.05–1.15.
- Body: DM Sans, weight 400–500, usually 14–16px with 1.7–1.9 line-height.
- Uppercase section labels: 9–11px, 700 weight, 1.2–2px letter-spacing.
- Buttons: 12–13px, bold, at least 40–48px tall.
- Large hero heading: responsive clamp(56px, 6.1vw, 88px); make it smaller on narrow screens.
- Desktop sections: 75–135px vertical spacing, depending on visual density.
- Spacing rhythm: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px.
- Main container: max-width 1240px; gutters 36px desktop and 18px mobile.
- Always fall back to system fonts if externally hosted fonts cannot load.

## 4. Three-layer bloom method

1. Atmospheric colored light behind a focal surface. Use a radial gradient or one carefully positioned blurred layer.
2. Subtle perimeter glow around an active or selected surface. The glow is not the entire background.
3. Crisp object edges: transparent border, inset one-pixel highlight and a gentle angled fill.

~~~css
.luminous-card {
  position: relative;
  color: var(--text);
  border: 1px solid rgb(var(--accent-rgb) / .40);
  border-radius: var(--radius);
  background: linear-gradient(
    140deg,
    rgb(var(--accent-rgb) / .20),
    #171727 45%,
    #0d0e18
  );
  box-shadow:
    0 0 calc(60px * var(--bloom)) rgb(var(--accent-rgb) / .32),
    0 20px 50px #0008,
    inset 0 1px #ffffff25;
}
.light-stage {
  position: relative;
  isolation: isolate;
}
.light-stage::before {
  content: "";
  position: absolute;
  inset: 15% 20%;
  z-index: -1;
  border-radius: 50%;
  background: rgb(var(--accent-rgb) / .65);
  filter: blur(55px);
  opacity: calc(var(--bloom) * .72);
  pointer-events: none;
}
~~~

Do not blur text, make every element glow, flash brightly, or obscure inputs with light. Prefer a small number of blurry surfaces to protect performance. Animate opacity and transform, not blur radius.

## 5. Animation guide

| Type | Duration | Treatment |
|---|---|---|
| Hover | 180–320ms | Small lift and ambient highlight |
| Press | 100–180ms | Return to resting depth |
| Reveal | 500–800ms | Fade and translateY by 18–22px |
| Ambient floating | 6–12s | Calm movement within a few pixels |
| Orbit | 30–65s | Slow rotation of decorative geometry |
| Dialog | Native dialog | Dismiss on Escape; manage focus |

Use cubic-bezier(.22,1,.36,1). Avoid scroll hijacking, bouncing dashboards, layout shifts, and endless attention-grabbing animation.

~~~css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation: none !important;
    transition-duration: .01ms !important;
  }
}
~~~

## 6. Components

**Navbar:** Sticky 68–78px translucent header. Subtle lower border. Desktop text navigation; compact menu button at mobile widths. Use a semantic nav and accessible links.

**Primary CTA:** Pale lavender gradient, dark text, inset highlight, subtle shadow. Lifts about two pixels on hover, settles on press.

**Secondary CTA:** Low-opacity surface with fine border and high-contrast text. Every CTA must actually navigate or act.

**Card:** 16–22px radius, quiet glass surface, fine highlight, clearly separated heading/subtext; hover may lift up to seven pixels.

**Input:** Real label, adequate focus border and ring, correct input type, meaningful validation/error messaging. Do not represent a fake input visually.

**Badge:** Quiet 9–11px text in a pill; success-colored dots must correspond to truthful status.

**Preview dialog:** Use the native dialog element or an equivalent accessible modal; provide Escape, close action, focus management, and a clear title.

**Hero:** Strong display type and description on the left, functional coded visual to the right; stack on small screens. Content must read sensibly without the decorative visual.

## 7. Six visual directions

1. **Obsidian** — dark violet analytics, mini-sidebar, contained charts and numerical cards.
2. **Aurora** — startup landing page with atmospheric purple-blue gradients and editorial heading.
3. **Halo** — premium monochrome commerce with dramatic object lighting and restrained typography.
4. **Prism** — friendly pastel analytic interfaces, lilac translucent cards, clean data hierarchy.
5. **Orbit** — creative agency with kinetic circular ornaments and confident oversized type.
6. **Mono** — minimal portfolio using bright paper surface, elegant typography and purposeful negative space.

Choose a suitable direction rather than mixing all six on one page. Their implementations can be inspected directly in index.html and styles.css.

## 8. Responsive guide

- Above 1150px: split hero, wide composition, three-column gallery.
- 901–1150px: moderate desktop layout and two-column gallery where useful.
- 661–900px: stacked hero and playground, two-column gallery.
- At or below 660px: single-column gallery, compact header with mobile menu, decreased decoration.
- Test a 320px-wide viewport, text zoom, keyboard navigation, and touch input.
- Avoid horizontal scrolling from decorative orbs, 3D transforms, and fixed widths.

## 9. Accessibility and functional requirements

A visually faithful implementation must still satisfy all of these:

- [ ] Actual clickable actions, not mock buttons without handlers.
- [ ] Navigation usable via keyboard and screen reader.
- [ ] Visible focus ring and accessible labels for controls.
- [ ] Appropriately high contrast for important copy.
- [ ] Reduced motion respected.
- [ ] Modals close and restore focus.
- [ ] Status changes announced through a polite live region when needed.
- [ ] Forms retain validation and backend integration.
- [ ] Mobile/tablet/desktop viewports tested.
- [ ] No frontend secrets, API keys, or privileged backend bypasses.
- [ ] Existing authentication, data flows, routing and business features still work.
- [ ] No fabricated runtime states (for example fake online badges for disconnected services).

## 10. Implementation across stacks

The reference itself is framework-free HTML, CSS and vanilla JavaScript. It can guide a React, Vue, Svelte, Next.js, Electron or other application without forcing a rewrite. Preserve existing state management, server communication, accessibility and UI behavior. Extract design tokens and shared components that fit the destination framework.

If copying source rather than independently reimplementing a visual style, first verify that you have permission and an applicable code license. Public visibility does not automatically permit unrestricted copying.

## 11. Copy-ready AI prompt

> Use https://github.com/taithedev/PresetWebsiteUI as the visual design reference for my project. Read AI_REFERENCE.md, index.html and styles.css before editing. Adapt its midnight glass surfaces, precise translucent borders, purple atmospheric bloom, Space Grotesk headlines, DM Sans body type, careful motion, responsive composition and premium controls to my app. Keep all my existing functionality, backend, auth and navigation. Every control must work, keyboard navigation must be accessible, and motion must honor prefers-reduced-motion. Implement maintainable reusable components and real responsive styles; do not replace my app with a static UI screenshot. If you cannot access GitHub, ask me to provide those source files instead of inventing their content.

---

**Preset UI · Volume 01 · Living visual reference.** The source files are the definitive specification.