/* Documentation-only enhancements; progressive and optional. */
(() => {
  "use strict";
  const links = [...document.querySelectorAll('.docs-sidebar a[href^="#"], .on-this-page a[href^="#"]')];
  const sections = [...document.querySelectorAll('.docs-content section[id]')];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(item => item.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach(link => {
        const active = link.getAttribute("href") === "#" + visible.target.id;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }
  document.getElementById("docs-demo-button")?.addEventListener("click", () => {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = "An action should always respond.";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  });
})();