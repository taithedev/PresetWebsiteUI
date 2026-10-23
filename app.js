/* PRESET UI — client-side enhancements. No build step, API keys, or framework required. */
(() => {
  "use strict";
  const root = document.documentElement;
  const $ = (selector, base = document) => base.querySelector(selector);
  const $$ = (selector, base = document) => Array.from(base.querySelectorAll(selector));
  const colors = {
    violet: { hex: "#9b8cff", rgb: "155 140 255" },
    cyan: { hex: "#62d8ef", rgb: "98 216 239" },
    pink: { hex: "#ff84b3", rgb: "255 132 179" },
    lime: { hex: "#b5e47a", rgb: "181 228 122" },
    amber: { hex: "#f4ba74", rgb: "244 186 116" }
  };
  let accentName = "violet";
  let toastTimeout;
  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function saveTheme(value) {
    try { window.localStorage.setItem("preset-ui-theme", value); } catch (_) { /* private browsing */ }
  }
  function toggleTheme() {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    saveTheme(next);
    $$(".theme-toggle").forEach(btn => btn.setAttribute("aria-label", "Switch to " + (next === "dark" ? "light" : "dark") + " theme"));
  }
  try {
    if (window.localStorage.getItem("preset-ui-theme") === "light") root.dataset.theme = "light";
  } catch (_) { /* storage disabled */ }
  $$(".theme-toggle").forEach(btn => btn.addEventListener("click", toggleTheme));
  const menuToggle = $(".menu-toggle");
  const menu = $("#nav-links");
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
    $$("a", menu).forEach(link => link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        menu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
  $$(".filter-button").forEach(button => button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    $$(".filter-button").forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    const cards = $$(".preset-card");
    let visibleCount = 0;
    cards.forEach(card => {
      const matches = selected === "all" || card.dataset.category === selected;
      card.hidden = !matches;
      if (matches) visibleCount++;
    });
    const empty = $("#empty-state");
    if (empty) empty.hidden = visibleCount > 0;
  }));
  const modal = $("#preview-modal");
  if (modal && typeof modal.showModal === "function") {
    $$("[data-open-preview]").forEach(button => button.addEventListener("click", () => {
      const card = button.closest(".preset-card");
      const visual = $(".preset-visual", card);
      if (!card || !visual) return;
      $("#preview-heading").textContent = $("h3", card).textContent;
      $("#preview-category").textContent = $(".preset-number", card).textContent;
      $("#preview-description").textContent = $(".preset-info p", card).textContent;
      $("#preview-stage").replaceChildren(visual.cloneNode(true));
      modal.showModal();
    }));
    $(".close-preview")?.addEventListener("click", () => modal.close());
    modal.addEventListener("click", event => {
      if (event.target === modal) modal.close();
    });
  }
  const glowInput = $("#glow-range"), glowOutput = $("#glow-output");
  const radiusInput = $("#radius-range"), radiusOutput = $("#radius-output");
  function applyControls() {
    if (glowInput) {
      root.style.setProperty("--bloom", (Number(glowInput.value) / 100).toFixed(2));
      if (glowOutput) glowOutput.textContent = glowInput.value + "%";
    }
    if (radiusInput) {
      root.style.setProperty("--radius", radiusInput.value + "px");
      if (radiusOutput) radiusOutput.textContent = radiusInput.value + "px";
    }
    const color = colors[accentName];
    root.style.setProperty("--accent", color.hex);
    root.style.setProperty("--accent-rgb", color.rgb);
    $$(".color-swatch").forEach(button => {
      const selected = button.dataset.color === accentName;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }
  glowInput?.addEventListener("input", applyControls);
  radiusInput?.addEventListener("input", applyControls);
  $$(".color-swatch").forEach(button => button.addEventListener("click", () => {
    if (!colors[button.dataset.color]) return;
    accentName = button.dataset.color;
    applyControls();
  }));
  $("#reset-controls")?.addEventListener("click", () => {
    if (glowInput) glowInput.value = "65";
    if (radiusInput) radiusInput.value = "22";
    accentName = "violet";
    applyControls();
    showToast("Appearance restored to default.");
  });
  applyControls();
  function cssTokens() {
    const color = colors[accentName];
    const bloom = glowInput ? (Number(glowInput.value) / 100).toFixed(2) : "0.65";
    const radius = radiusInput ? radiusInput.value : "22";
    return [
      "/* Preset UI — generated in the interactive studio */",
      ":root {",
      "  --bg: #080911;",
      "  --surface: #10111b;",
      "  --surface-2: #181a28;",
      "  --text: #f5f4fd;",
      "  --muted: #999aaf;",
      "  --border: rgba(209, 205, 255, 0.105);",
      "  --accent: " + color.hex + ";",
      "  --accent-rgb: " + color.rgb + ";",
      "  --bloom: " + bloom + ";",
      "  --radius: " + radius + "px;",
      "}",
      "",
      ".luminous-card {",
      "  border: 1px solid rgb(var(--accent-rgb) / .4);",
      "  border-radius: var(--radius);",
      "  background: linear-gradient(140deg, rgb(var(--accent-rgb) / .2), #171727 45%, #0d0e18);",
      "  box-shadow: 0 0 calc(60px * var(--bloom)) rgb(var(--accent-rgb) / .32), 0 20px 50px #0008;",
      "  color: var(--text);",
      "}",
      "@media (prefers-reduced-motion: reduce) {",
      "  *, *::before, *::after { animation: none !important; transition-duration: .01ms !important; }",
      "}"
    ].join("\n");
  }
  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(value); return true; } catch (_) { /* permission denied */ }
    }
    const element = document.createElement("textarea");
    element.value = value;
    element.style.position = "fixed";
    element.style.opacity = "0";
    document.body.appendChild(element);
    element.focus();
    element.select();
    let success = false;
    try { success = document.execCommand("copy"); } catch (_) { /* not supported */ }
    element.remove();
    return success;
  }
  $(".copy-tokens")?.addEventListener("click", async () => {
    const success = await copyText(cssTokens());
    showToast(success ? "CSS tokens copied. Ready to build." : "Clipboard unavailable. See the design tokens in Docs.");
  });
  $$("[data-copy]").forEach(button => button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copy);
    if (!target) return;
    const success = await copyText(target.textContent.trim());
    showToast(success ? "Copied to clipboard." : "Clipboard unavailable. Select the code to copy it.");
  }));
  $("#demo-action")?.addEventListener("click", () => showToast("That's a satisfying interaction."));
  $("#demo-secondary")?.addEventListener("click", () => showToast("Every detail matters."));
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: "0px 0px 25px 0px" });
    const items = $$(".preset-card, .component-card, .section-heading, .studio-intro, .docs-banner");
    items.forEach((item, index) => {
      item.classList.add("reveal");
      item.style.transitionDelay = Math.min(index % 3, 2) * 70 + "ms";
      observer.observe(item);
    });
  }
})();