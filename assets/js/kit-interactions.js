/* Preset UI Kit: tiny dependency-free behaviors included in exported demos.
   Keep behaviors opt-in through data attributes and native controls. */
(function () {
  "use strict";
  let toastTimer;
  function notify(message) {
    let el = document.getElementById("ui-kit-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "ui-kit-toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      el.style.cssText = "position:fixed;bottom:14px;left:50%;transform:translateX(-50%);padding:11px 14px;border:1px solid #b99fff55;border-radius:9px;background:#302541;color:#faf5ff;box-shadow:0 12px 38px #0009;z-index:99;font:11px system-ui;max-width:92%;text-align:center;";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2300);
  }
  document.addEventListener("click", event => {
    const btn = event.target.closest("button");
    if (!btn) return;
    if (btn.dataset.toast) notify(btn.dataset.toast);
    if (btn.hasAttribute("data-toggle-heart")) {
      const saved = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", String(!saved));
      btn.textContent = saved ? "♡" : "♥";
      notify(saved ? "Removed from favorites" : "Saved to favorites");
    }
    if (btn.hasAttribute("data-load")) {
      if (btn.disabled) return;
      const label = btn.textContent;
      btn.disabled = true;
      btn.classList.add("loading");
      btn.textContent = "Processing...";
      setTimeout(() => { btn.disabled = false; btn.classList.remove("loading"); btn.textContent = label; notify("Action completed"); }, 900);
    }
    if (btn.hasAttribute("data-segment")) {
      const group = btn.closest(".ui-segmented");
      group?.querySelectorAll("button").forEach(item => item.setAttribute("aria-pressed", String(item === btn)));
    }
    if (btn.hasAttribute("data-tab")) {
      const group = btn.closest(".ui-stack");
      const tabs = group?.querySelectorAll("[data-tab]") || [];
      tabs.forEach(item => item.setAttribute("aria-selected", String(item === btn)));
      const content = group?.querySelector("[data-tab-content]");
      if (content) content.textContent = btn.textContent + " content is selected.";
    }
    if (btn.hasAttribute("data-page")) {
      const nav = btn.closest(".ui-pagination");
      const pages = [...(nav?.querySelectorAll("[data-page]") || [])].filter(item => /^\d+$/.test(item.dataset.page));
      const current = pages.findIndex(item => item.getAttribute("aria-current") === "page");
      const target = btn.dataset.page === "next" ? Math.min(pages.length - 1, current + 1) : btn.dataset.page === "previous" ? Math.max(0, current - 1) : pages.findIndex(item => item.dataset.page === btn.dataset.page);
      if (target >= 0) pages.forEach((item, index) => {
        if (index === target) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      });
    }
  });
  document.addEventListener("submit", event => {
    const form = event.target.closest("[data-demo-form]");
    if (!form) return;
    event.preventDefault();
    if (form.reportValidity()) notify("Form is valid. Connect your backend to sign in.");
  });
})();