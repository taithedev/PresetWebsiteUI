/* Navigation primitives */
window.PresetLibrary=(window.PresetLibrary||[]).concat([
  {
    "id": "navigation-tabs",
    "title": "Underline tabs",
    "description": "Focused navigation that reveals one view at a time.",
    "html": "<div class=\"ui-stack\" style=\"max-width:320px\"><div class=\"ui-tabs\" role=\"tablist\" aria-label=\"Sections\"><button role=\"tab\" aria-selected=\"true\" data-tab>Overview</button><button role=\"tab\" aria-selected=\"false\" data-tab>Metrics</button><button role=\"tab\" aria-selected=\"false\" data-tab>Settings</button></div><p data-tab-content style=\"font-size:11px;color:var(--ui-muted);margin:2px 0\">Overview content is selected.</p></div>",
    "category": "Navigation",
    "symbol": "⌁",
    "tags": [
      "Navigation",
      "Responsive"
    ]
  },
  {
    "id": "breadcrumbs",
    "title": "Breadcrumb trail",
    "description": "Small orientation cues for nested navigation.",
    "html": "<nav class=\"ui-breadcrumb\" aria-label=\"Breadcrumb\"><a href=\"#home\">Home</a><span>›</span><a href=\"#library\">Library</a><span>›</span><strong>Components</strong></nav>",
    "category": "Navigation",
    "symbol": "⌁",
    "tags": [
      "Navigation",
      "Responsive"
    ]
  },
  {
    "id": "pagination",
    "title": "Pagination",
    "description": "Compact page selectors with active-page state.",
    "html": "<nav class=\"ui-pagination\" aria-label=\"Pagination\"><button type=\"button\" data-page=\"previous\" aria-label=\"Previous page\">‹</button><button type=\"button\" data-page=\"1\" aria-current=\"page\">1</button><button type=\"button\" data-page=\"2\">2</button><button type=\"button\" data-page=\"3\">3</button><button type=\"button\" data-page=\"next\" aria-label=\"Next page\">›</button></nav>",
    "category": "Navigation",
    "symbol": "⌁",
    "tags": [
      "Navigation",
      "Responsive"
    ]
  },
  {
    "id": "compact-navbar",
    "title": "Compact navbar",
    "description": "A small and reliable navigation pattern.",
    "html": "<header class=\"ui-navbar\"><strong>nexa<span style=\"color:var(--ui-accent)\">✳</span></strong><nav aria-label=\"Example navigation\"><a href=\"#features\">Features</a><a href=\"#pricing\">Pricing</a><a href=\"#contact\">Contact</a></nav><button class=\"ui-btn\" style=\"min-height:30px;padding:6px 11px;font-size:10px\" data-toast=\"Get started\">Start ↗</button></header>",
    "category": "Navigation",
    "symbol": "⌁",
    "tags": [
      "Navigation",
      "Responsive"
    ]
  }
]);
