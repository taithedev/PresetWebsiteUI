/* Feedback and state primitives */
window.PresetLibrary=(window.PresetLibrary||[]).concat([
  {
    "id": "status-badges",
    "title": "Status badges",
    "description": "Quiet badges for truthful app states.",
    "html": "<div class=\"ui-row\"><span class=\"ui-pill success\"><span class=\"dot\"></span> Healthy</span><span class=\"ui-pill\"><span class=\"dot\"></span> In progress</span><span class=\"ui-pill\">✦ Featured</span></div>",
    "category": "Feedback",
    "symbol": "✦",
    "tags": [
      "States",
      "Motion"
    ]
  },
  {
    "id": "alert-banner",
    "title": "Alert banner",
    "description": "Inline feedback with space for supporting details.",
    "html": "<div class=\"ui-alert\" role=\"status\"><span>✳</span><div><b>Everything is up to date</b><p>Your workspace has the latest changes. You're ready to keep building.</p></div></div>",
    "category": "Feedback",
    "symbol": "✦",
    "tags": [
      "States",
      "Motion"
    ]
  },
  {
    "id": "progress-bar",
    "title": "Progress indicator",
    "description": "Clear completion progress with meaningful labels.",
    "html": "<div class=\"ui-stack\" style=\"max-width:315px\"><div class=\"ui-progress-label\"><span>Project completion</span><b>72%</b></div><div class=\"ui-progress\" role=\"progressbar\" aria-valuenow=\"72\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-label=\"Project completion\"><span style=\"--value:72%\"></span></div></div>",
    "category": "Feedback",
    "symbol": "✦",
    "tags": [
      "States",
      "Motion"
    ]
  },
  {
    "id": "toast-message",
    "title": "Toast feedback",
    "description": "A transient acknowledgement for completed actions.",
    "html": "<div class=\"ui-stack\" style=\"max-width:335px\"><div class=\"ui-toast\" role=\"status\"><span class=\"toast-icon\">✓</span><div><b>Changes saved</b><small>Your workspace is up to date.</small></div></div><button type=\"button\" class=\"ui-btn outline\" data-toast=\"This toast is triggered by your button\">Try a new toast</button></div>",
    "category": "Feedback",
    "symbol": "✦",
    "tags": [
      "States",
      "Motion"
    ]
  },
  {
    "id": "tooltip",
    "title": "Tooltip",
    "description": "A small accessible explanation for compact UI controls.",
    "html": "<div class=\"ui-tooltip-wrap\"><span class=\"ui-tooltip\" role=\"tooltip\" id=\"ui-tip\">Quick actions live here</span><button class=\"ui-btn outline\" aria-describedby=\"ui-tip\" data-toast=\"Tooltip action clicked\">Hover or focus me</button></div>",
    "category": "Feedback",
    "symbol": "✦",
    "tags": [
      "States",
      "Motion"
    ]
  },
  {
    "id": "skeleton-loading",
    "title": "Skeleton loader",
    "description": "Nonblocking loading placeholders with reduced-motion support.",
    "html": "<div class=\"ui-skeleton\" aria-label=\"Loading placeholder\"><div class=\"ui-skeleton-head\"><i class=\"ui-sk circle\"></i><div class=\"ui-stack\" style=\"gap:7px;flex:1\"><i class=\"ui-sk big\"></i><i class=\"ui-sk mid\"></i></div></div><i class=\"ui-sk\"></i><i class=\"ui-sk mid\"></i><i class=\"ui-sk short\"></i></div>",
    "category": "Feedback",
    "symbol": "✦",
    "tags": [
      "States",
      "Motion"
    ]
  }
]);
