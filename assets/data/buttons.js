/* Button primitives. Extend the collection by appending similarly shaped objects. */
window.PresetLibrary = (window.PresetLibrary || []).concat([
  {
    "id": "primary-button",
    "title": "Primary button",
    "description": "A tactile, high-contrast action with subtle elevation.",
    "html": "<div class=\"ui-row\"><button class=\"ui-btn\" data-toast=\"Action completed\">Get started →</button><button class=\"ui-btn outline\" data-toast=\"Secondary action\">Learn more</button></div>",
    "category": "Buttons",
    "symbol": "↗",
    "tags": [
      "Actions",
      "Interactive"
    ]
  },
  {
    "id": "aurora-button",
    "title": "Aurora gradient",
    "description": "Color-rich gradient motion with a restrained glow.",
    "html": "<div class=\"ui-row\"><button class=\"ui-btn gradient shine\" data-toast=\"Gradient action selected\">✦ Explore collection →</button></div>",
    "category": "Buttons",
    "symbol": "↗",
    "tags": [
      "Actions",
      "Interactive"
    ]
  },
  {
    "id": "outline-button",
    "title": "Outline actions",
    "description": "A useful hierarchy for secondary and tertiary actions.",
    "html": "<div class=\"ui-row\"><button class=\"ui-btn outline\" data-toast=\"Preview opened\">View details ↗</button><button class=\"ui-btn ghost\" data-toast=\"Settings opened\">Settings</button></div>",
    "category": "Buttons",
    "symbol": "↗",
    "tags": [
      "Actions",
      "Interactive"
    ]
  },
  {
    "id": "icon-button",
    "title": "Icon actions",
    "description": "Compact controls with accessible action labels.",
    "html": "<div class=\"ui-row\"><button class=\"ui-btn outline icon\" type=\"button\" aria-label=\"Favorite this item\" data-toggle-heart>♡</button><button class=\"ui-btn outline icon\" type=\"button\" aria-label=\"Add item\" data-toast=\"Item added\">＋</button><button class=\"ui-btn outline icon\" type=\"button\" aria-label=\"Settings\" data-toast=\"Settings\">⚙</button></div>",
    "category": "Buttons",
    "symbol": "↗",
    "tags": [
      "Actions",
      "Interactive"
    ]
  },
  {
    "id": "loading-button",
    "title": "Loading state",
    "description": "Progress feedback that returns the action to normal.",
    "html": "<button class=\"ui-btn\" type=\"button\" data-load>Run action →</button>",
    "category": "Buttons",
    "symbol": "↗",
    "tags": [
      "Actions",
      "Interactive"
    ]
  },
  {
    "id": "pill-action",
    "title": "Pill controls",
    "description": "Subtle capsules for flexible content and filters.",
    "html": "<div class=\"ui-row\"><button class=\"ui-btn\" style=\"border-radius:50px\" data-toast=\"You're in\">Join community ↗</button><button class=\"ui-btn outline\" style=\"border-radius:50px\" data-toast=\"Details opened\">All details</button></div>",
    "category": "Buttons",
    "symbol": "↗",
    "tags": [
      "Actions",
      "Interactive"
    ]
  }
]);
