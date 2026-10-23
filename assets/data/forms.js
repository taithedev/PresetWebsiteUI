/* Form components */
window.PresetLibrary=(window.PresetLibrary||[]).concat([
  {
    "id": "input-field",
    "title": "Input fields",
    "description": "Careful labels, helpful placeholder copy and focused borders.",
    "html": "<div class=\"ui-stack\"><label class=\"ui-label\">Workspace name <input class=\"ui-input\" placeholder=\"My creative studio\" type=\"text\" autocomplete=\"off\"></label><label class=\"ui-label\">Email address <input class=\"ui-input\" placeholder=\"hello@example.com\" type=\"email\"></label></div>",
    "category": "Forms",
    "symbol": "⌘",
    "tags": [
      "Inputs",
      "Accessible"
    ]
  },
  {
    "id": "search-field",
    "title": "Search field",
    "description": "A focused input for search-first interfaces.",
    "html": "<label class=\"ui-label\" style=\"width:min(335px,100%)\">Find something<div class=\"ui-input-wrap\"><span>⌕</span><input class=\"ui-input\" placeholder=\"Search anything...\" type=\"search\" aria-label=\"Search anything\"><span>⌘K</span></div></label>",
    "category": "Forms",
    "symbol": "⌘",
    "tags": [
      "Inputs",
      "Accessible"
    ]
  },
  {
    "id": "toggle-switch",
    "title": "Toggle switch",
    "description": "Accessible binary preferences with live feedback.",
    "html": "<div class=\"ui-stack\" style=\"gap:20px\"><label class=\"ui-toggle\"><input type=\"checkbox\" checked><span class=\"ui-toggle-track\"></span> Enable notifications</label><label class=\"ui-toggle\"><input type=\"checkbox\"><span class=\"ui-toggle-track\"></span> Use compact layout</label></div>",
    "category": "Forms",
    "symbol": "⌘",
    "tags": [
      "Inputs",
      "Accessible"
    ]
  },
  {
    "id": "checkboxes",
    "title": "Checkbox group",
    "description": "Multiselect options with native keyboard interaction.",
    "html": "<fieldset style=\"border:1px solid var(--ui-line);border-radius:12px;padding:17px 20px;width:250px\"><legend style=\"color:var(--ui-muted);font-size:11px;padding:0 7px\">Preferences</legend><div class=\"ui-stack\" style=\"gap:13px\"><label class=\"ui-check\"><input type=\"checkbox\" checked> Email updates</label><label class=\"ui-check\"><input type=\"checkbox\"> Product announcements</label><label class=\"ui-check\"><input type=\"checkbox\" checked> Design insights</label></div></fieldset>",
    "category": "Forms",
    "symbol": "⌘",
    "tags": [
      "Inputs",
      "Accessible"
    ]
  },
  {
    "id": "segmented-control",
    "title": "Segmented control",
    "description": "Mutually exclusive options, one selection at a time.",
    "html": "<div class=\"ui-segmented\" role=\"group\" aria-label=\"View mode\"><button type=\"button\" aria-pressed=\"true\" data-segment>Overview</button><button type=\"button\" aria-pressed=\"false\" data-segment>Analytics</button><button type=\"button\" aria-pressed=\"false\" data-segment>Activity</button></div>",
    "category": "Forms",
    "symbol": "⌘",
    "tags": [
      "Inputs",
      "Accessible"
    ]
  },
  {
    "id": "select-menu",
    "title": "Select menu",
    "description": "Native dropdown with consistent surface and focus treatment.",
    "html": "<label class=\"ui-label\" style=\"width:250px\">Choose a plan<select class=\"ui-select\"><option>Starter — Free</option><option>Pro — $12 / month</option><option>Team — $29 / month</option></select></label>",
    "category": "Forms",
    "symbol": "⌘",
    "tags": [
      "Inputs",
      "Accessible"
    ]
  }
]);
