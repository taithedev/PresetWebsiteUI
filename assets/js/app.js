/* Preset UI Studio — framework-free application router, component inspector,
   live preview renderer, customization, search, saved items and source export. */
(() => {
 "use strict";
 const $=(s,scope=document)=>scope.querySelector(s);
 const $$=(s,scope=document)=>Array.from(scope.querySelectorAll(s));
 const icon=name=>'<svg aria-hidden="true"><use href="#i-'+name+'"/></svg>';
 const safe=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const palettes={violet:["#b39bff","179 155 255"],cyan:["#6bdcf2","107 220 242"],rose:["#ff8cb7","255 140 183"],mint:["#91e3bb","145 227 187"],gold:["#f7c37e","247 195 126"]};
 const lightPalettes={violet:["#7355bb","115 85 187"],cyan:["#247e92","36 126 146"],rose:["#a73d6d","167 61 109"],mint:["#2d775d","45 119 93"],gold:["#93651e","147 101 30"]};
 const categories={Buttons:{dot:"#bba3ff",mark:"↗"},Forms:{dot:"#8bddf5",mark:"⌘"},Navigation:{dot:"#f0be85",mark:"⌁"},Feedback:{dot:"#8ce1b7",mark:"✦"},Surfaces:{dot:"#ed9dc0",mark:"◈"},Custom:{dot:"#d6c5a7",mark:"＋"}};
 const read=(key,otherwise)=>{try{return JSON.parse(localStorage.getItem(key))??otherwise;}catch{return otherwise;}};
 const persist=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{ /* optional browser storage */ }};
 const saved=new Set(read("preset-studio-saved",[]));
 let custom=read("preset-studio-custom",[]);
 if(!Array.isArray(custom))custom=[];
 custom=custom.filter(item=>item&&typeof item.id==="string"&&typeof item.title==="string"&&typeof item.html==="string").slice(0,50);
 const catalog=[...(window.PresetLibrary||[]),...custom];
 const state={page:"explore",category:"All",filter:"",inspected:null,language:"html",previewTheme:"dark",uiTheme:read("preset-studio-theme","dark"),accent:read("preset-studio-accent","violet"),bloom:Number(read("preset-studio-bloom",66)),radius:Number(read("preset-studio-radius",20))};
 if(!palettes[state.accent])state.accent="violet";
 if(!Number.isFinite(state.bloom))state.bloom=66;
 if(!Number.isFinite(state.radius))state.radius=20;
 const kitCache={css:null,js:null};
 let toastTimer,activeCommandIndex=0,commands=[],vaultInitialized=false;
 const routeLabels={explore:"Discover",components:"Components",patterns:"Patterns",saved:"Saved items",playground:"Playground",builder:"Component builder",files:"File workspace"};
 const defaultDraft={title:"Luminous feature",description:"A custom design made in the component builder.",html:'<div class="ui-card glass"><small>✳ CUSTOM COMPONENT</small><h3>Your next creation.</h3><p>A beautiful place to start. Edit this markup to make it yours.</p><div style="margin-top:18px"><button class="ui-btn gradient" data-toast="Hello from your component">Try this →</button></div></div>',css:"",js:""};
 let draft={...defaultDraft,...read("preset-studio-draft",{})},builderTab="html",builderTimer;
 const container=$("#view-container");
 function toast(message){
   const node=$("#toast");node.textContent=message;node.classList.add("show");
   clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove("show"),2500);
 }
 function download(name,data,type="text/plain"){
   const blob=data instanceof Blob?data:new Blob([data],{type});
   const url=URL.createObjectURL(blob),a=document.createElement("a");
   a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),60000);
 }
 async function copy(text){
   try {await navigator.clipboard.writeText(text);toast("Copied to clipboard.");return true}
   catch{
     const a=document.createElement("textarea");a.value=text;a.style.cssText="position:fixed;opacity:0";
     document.body.append(a);a.select();let success=false;
     try{success=document.execCommand("copy")}catch{}
     a.remove();toast(success?"Copied to clipboard.":"Clipboard unavailable. Select source to copy.");return success;
   }
 }
 function setTheme(){
   document.documentElement.dataset.theme=state.uiTheme;
   persist("preset-studio-theme",state.uiTheme);
   const element=$("#theme-switch");
   element?.setAttribute("aria-label","Switch to "+(state.uiTheme==="dark"?"light":"dark")+" theme");
   const palette=(state.uiTheme==="light"?lightPalettes:palettes)[state.accent];
   document.documentElement.style.setProperty("--accent",palette[0]);
   document.documentElement.style.setProperty("--accent-rgb",palette[1]);
   document.documentElement.style.setProperty("--accent-soft","rgb("+palette[1]+" / .13)");
   const isLight=state.uiTheme==="light";
   if(element){$(".sun",element).style.display=isLight?"block":"none";$(".moon",element).style.display=isLight?"none":"block";}
 }
 setTheme();
 function buildSidebar(){
  $("#component-count").textContent=catalog.filter(x=>x.kind!=="pattern").length;
  $("#saved-count").textContent=saved.size;
  const counts={};
  catalog.filter(x=>x.kind!=="pattern").forEach(item=>counts[item.category]=(counts[item.category]||0)+1);
  $("#category-nav").innerHTML=Object.entries(categories).filter(([name])=>counts[name]).map(([name,config])=>
   '<button type="button" data-category-nav="'+safe(name)+'"><span class="category-dot" style="--dot:'+config.dot+'"></span><span>'+safe(name)+'</span><small>'+counts[name]+'</small></button>'
  ).join("");
 }
 function hashRoute(){
  const h=location.hash.replace(/^#\/?/,"");
  const [p,args]=h.split("?");
  state.page=routeLabels[p]?p:"explore";
  const qs=new URLSearchParams(args||"");
  if(state.page==="components"&&qs.has("category"))state.category=qs.get("category")||"All";
  else state.category="All";
  render();
 }
 function navTo(page){location.hash="#/"+page}
 function cardMarkup(item){
  const name=safe(item.title),id=safe(item.id),desc=safe(item.description);
  const fav=saved.has(item.id);
  return '<article class="component-card '+(item.kind==="pattern"?"pattern-card":"")+'"><div class="card-visual"><span class="card-topmark">✳ '+safe(item.kind==="pattern"?"PATTERN":"COMPONENT")+'</span><iframe sandbox="allow-scripts" title="'+name+' visual preview" loading="lazy" tabindex="-1" data-card-frame="'+id+'"></iframe></div>'+
   '<div class="card-details"><div class="card-titleline"><h3>'+name+'</h3><button type="button" class="card-action" data-open="'+id+'" aria-label="Open '+name+' preview">'+icon("external")+'</button></div><p>'+desc+'</p><div class="card-bottom"><span class="category-tag">'+safe(item.category).toUpperCase()+'</span><div class="card-mini-actions"><button type="button" class="tiny-icon '+(fav?"is-saved":"")+'" data-save="'+id+'" aria-label="'+(fav?"Remove from saved: ":"Save: ")+name+'" title="Save">'+icon("heart")+'</button><button type="button" class="tiny-icon" data-open="'+id+'" aria-label="Inspect '+name+'" title="Preview & code">'+icon("code")+'</button></div></div></div></article>';
 }
 function gallery(items,limit){
  const selected=typeof limit==="number"?items.slice(0,limit):items;
  if(!selected.length)return '<div class="empty-screen"><div class="empty-symbol">✳</div><h3>Nothing here yet.</h3><p>Try another search, category or save a component.</p><button type="button" class="soft-btn" data-clear-filters>Clear filters</button></div>';
  return '<div class="cards-grid">'+selected.map(cardMarkup).join("")+'</div>';
 }
 function frameHtml(item,theme="dark"){
  const path=new URL("./assets/css/kit.css",location.href).href;
  const script=new URL("./assets/js/kit-interactions.js",location.href).href;
  const palette=(theme==="light"?lightPalettes:palettes)[state.accent];
  const customCSS=typeof item.css==="string"?item.css:"";
  const customJS=typeof item.js==="string"?item.js:"";
  // User-added snippets are executed only inside a sandboxed opaque-origin iframe.
  const inlineJS=customJS.replaceAll("</script","<\\/script");
  return '<!doctype html><html lang="en" data-ui-theme="'+(theme==="light"?"light":"dark")+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="'+path+'"><style>:root{--ui-accent:'+palette[0]+';--ui-rgb:'+palette[1]+';--ui-glow:'+Math.max(0,state.bloom/100)+';--ui-radius:'+Math.max(4,state.radius)+'px}'+customCSS+'</style></head><body><div class="ui-stage">'+item.html+'</div><script src="'+script+'"><\/script><script>'+inlineJS+'<\/script></body></html>';
 }
 function mountFrames(){
  $$("iframe[data-card-frame]",container).forEach(frame=>{
    const item=catalog.find(x=>x.id===frame.dataset.cardFrame);
    if(item)frame.srcdoc=frameHtml(item);
  });
 }
 function pageHeader(kicker,title,description,actions=""){
  return '<div class="page-heading"><span class="eyebrow">'+kicker+'</span><h1>'+title+'</h1><p>'+description+'</p>'+ (actions?'<div class="heading-actions">'+actions+'</div>':"") +'</div>';
 }
 function categoryPills(){
  const names=["All",...Object.keys(categories).filter(c=>catalog.some(x=>x.category===c&&x.kind!=="pattern"))];
  return '<div class="category-pills" role="group" aria-label="Filter by category">'+names.map(name=>'<button type="button" class="category-pill '+(state.category===name?"active":"")+'" aria-pressed="'+(state.category===name)+'" data-filter-category="'+safe(name)+'">'+safe(name)+'</button>').join("")+'</div>';
 }
 function toolbar(){
  return '<div class="gallery-toolbar">'+categoryPills()+'<label class="library-filter">'+icon("search")+'<input id="gallery-search" type="search" aria-label="Filter gallery" placeholder="Filter components..." value="'+safe(state.filter)+'"></label></div>';
 }
 function listing(){
  const query=state.filter.trim().toLowerCase();
  return catalog.filter(item=>item.kind!=="pattern"&&(state.category==="All"||item.category===state.category)&&(!query||[item.id,item.title,item.description,item.category,...(item.tags||[])].join(" ").toLowerCase().includes(query)));
 }
 function explore(){
  const components=catalog.filter(x=>x.kind!=="pattern"),patterns=catalog.filter(x=>x.kind==="pattern");
  const bars=[30,46,36,59,47,65,53,78,72,88,73,100];
  return '<section class="hero"><div class="hero-copy"><span class="eyebrow">THE OPEN INTERFACE ATELIER · VOL. 02</span><h1>Beautiful UI.<br>Built for <em>what’s next.</em></h1><p>A living library of finely crafted components, complete page patterns and interactive design tools. Explore the system, make it yours, export the source.</p><div class="hero-actions"><a class="primary-btn" href="#/components">Browse the library '+icon("arrow")+'</a><a class="soft-btn" href="#/playground">'+icon("sliders")+' Open playground</a></div><div class="hero-statline"><div><b>'+components.length+'</b><span>Components</span></div><div class="stat-sep"></div><div><b>'+patterns.length+'</b><span>Full patterns</span></div><div class="stat-sep"></div><div><b>100%</b><span>Framework-free</span></div></div></div><div class="hero-art" aria-label="An illustration of a dashboard interface"><div class="hero-ring"></div><div class="hero-dashboard"><div class="hd-titlebar"><div class="hd-dots"><i></i><i></i><i></i></div><span>preset / workspace</span><span>✳</span></div><div class="hd-content"><div class="hd-kicker">WORKSPACE / PERFORMANCE <span style="float:right;color:#8ee0b5">● LIVE DEMO</span></div><div class="hd-heading">Your creative pulse ↗</div><div class="hd-metrics"><div class="hd-metric"><span>Monthly reach</span><b>284.6k</b><small>↗ 18.4% growth</small></div><div class="hd-metric"><span>Interactions</span><b>82,491</b><small>↑ 12.6% this month</small></div></div><div class="hd-chart">'+bars.map(h=>'<i style="--height:'+h+'%"></i>').join("")+'</div><div class="hd-bottom"><span>◉ Last 12 months</span><span>Updated today</span></div></div></div><div class="float-chip float-one"><span>✦</span><div><b>Thoughtful by design</b><small>Production-ready styling</small></div></div><div class="float-chip float-two"><span>◉</span><div><b>True customizability</b><small>Tokens, motion, color</small></div></div></div></section>'+
  '<div class="feature-bar"><div class="feature"><span class="feature-icon">'+icon("layers")+'</span><div><b>Real components</b><p>Live interactions, not screenshots</p></div></div><div class="feature"><span class="feature-icon">'+icon("sliders")+'</span><div><b>Creative control</b><p>Fine-tune light, color and depth</p></div></div><div class="feature"><span class="feature-icon">'+icon("download")+'</span><div><b>Own the source</b><p>Export HTML, CSS and JS as ZIP</p></div></div></div>'+
  '<section><div class="section-head"><div><span class="micro">01 / COMPONENT LIBRARY</span><h2 class="section-title">Carefully crafted essentials.</h2><p class="section-subtitle">A practical foundation with motion, accessibility and depth built in.</p></div><a class="text-link" href="#/components">All components '+icon("arrow")+'</a></div>'+gallery(components,8)+'</section>'+
  '<section><div class="section-head"><div><span class="micro">02 / READY-MADE LAYOUTS</span><h2 class="section-title">Entire patterns. Zero guesswork.</h2><p class="section-subtitle">Compose experiences with complete hero, dashboard and authentication examples.</p></div><a class="text-link" href="#/patterns">Explore patterns '+icon("arrow")+'</a></div>'+gallery(patterns,4)+'</section>'+
  '<section class="view-intro" style="border:1px solid #a78aff35;background:linear-gradient(120deg,#251b3c,#141321);border-radius:18px;padding:37px;display:flex;justify-content:space-between;gap:20px;align-items:center;flex-wrap:wrap;color:#f6f2ff"><div><span class="eyebrow">BUILD THE NEXT THING</span><h2 class="section-title" style="max-width:500px">Your interface, your rules.</h2><p style="font-size:12px;line-height:1.7;color:#aaa3bd;max-width:480px">Personalize the system, build a component, export ready-to-use code or store any project file in your private browser workspace.</p></div><a href="#/playground" class="primary-btn">Open design playground '+icon("arrow")+'</a></section>';
 }
 function componentsView(){
  const results=listing();
  return pageHeader("THE COMPONENT LIBRARY","Elements with intention.","Search, inspect, save and export reusable building blocks. Every sample is made with real HTML and CSS.",'<button class="soft-btn" id="import-json">'+icon("upload")+' Import JSON components</button><button class="soft-btn" id="download-all">'+icon("download")+' Download whole kit</button>')+
  '<div class="section-head" style="margin-top:37px"><div><span class="micro">CATALOG / COMPONENTS</span><h2 class="section-title">Browse the collection.</h2></div></div>'+toolbar()+
  '<div class="gallery-meta"><span><strong>'+results.length+'</strong> components shown</span><span>PREVIEW · CUSTOMIZE · EXPORT</span></div>'+gallery(results);
 }
 function patternsView(){
  const items=catalog.filter(item=>item.kind==="pattern");
  return pageHeader("FULL COMPOSITIONS","Start from something great.","Full-page sections to accelerate landing pages, dashboard experiences and account screens.","<a href='./docs/' class='soft-btn'>Read pattern guides "+icon("arrow")+"</a>")+
  '<div class="section-head"><div><span class="micro">LAYOUT SYSTEMS</span><h2 class="section-title">Complete foundations.</h2></div></div>'+gallery(items);
 }
 function savedView(){
  const items=catalog.filter(x=>saved.has(x.id));
  return pageHeader("PERSONAL COLLECTION","Your saved essentials.","Keep a shortlist of your favorite components and patterns. Saved items remain in this browser.")+
  '<div class="section-head"><div><span class="micro">SAVED COLLECTION</span><h2 class="section-title">'+items.length+' saved items.</h2></div><button type="button" class="soft-btn" id="export-saved">'+icon("download")+' Export collection</button></div>'+gallery(items);
 }
 function playgroundView(){
  const colors=Object.entries(palettes).map(([name,value])=>'<button type="button" class="config-swatch" data-accent="'+name+'" aria-label="'+name+' accent" aria-pressed="'+(state.accent===name)+'" style="--swatch:'+value[0]+'"></button>').join("");
  return pageHeader("DESIGN SYSTEM / LAB","Light is a material.","Change the design tokens in real time, preview how they affect a component, and export your own theme.")+
  '<div class="studio-grid"><div class="studio-canvas"><div class="canvas-top"><span><i class="live-dot"></i> INTERACTIVE CANVAS</span><span class="micro">LIVE PREVIEW · 01</span></div><div class="canvas-center"><div class="canvas-preview" id="canvas-preview"><div class="preview-pill"><span></span> PRESET UI / DESIGN LAB</div><h3>Make it yours.</h3><p>Refined details. Unmistakable atmosphere.</p><button type="button" data-canvas-button>Explore your design ↗</button></div></div><div class="canvas-bottom"><span>Token-driven composition</span><code id="canvas-color-value">#b39bff</code></div></div>'+
  '<div class="config-panel"><div class="config-head">'+icon("sliders")+' Customize appearance</div><div class="config-body"><div class="config-field"><label for="bloom-input">Bloom intensity <output id="bloom-value">'+state.bloom+'%</output></label><input type="range" id="bloom-input" min="0" max="100" value="'+state.bloom+'"></div><div class="config-field"><label for="radius-input">Corner radius <output id="radius-value">'+state.radius+'px</output></label><input type="range" id="radius-input" min="4" max="36" value="'+state.radius+'"></div><div class="config-field"><label>Accent color</label><div class="config-swatches">'+colors+'</div></div><button class="primary-btn" id="copy-theme">'+icon("copy")+' Copy CSS tokens</button><button class="soft-btn" id="export-theme">'+icon("download")+' Download tokens.json</button><button class="soft-btn" id="reset-theme">Reset to defaults</button></div></div></div>'+
  '<div class="section-head"><div><span class="micro">DESIGN GUIDELINES</span><h2 class="section-title">The system, not just the shine.</h2><p class="section-subtitle">Use bloom as an accent. Keep typography sharp, spacing generous and keyboard interactions obvious.</p></div><a href="./docs/" class="text-link">Read implementation guide '+icon("arrow")+'</a></div><div class="feature-bar"><div class="feature"><span class="feature-icon">'+icon("sparkles")+'</span><div><b>Controlled bloom</b><p>Diffuse light behind crisp layers</p></div></div><div class="feature"><span class="feature-icon">'+icon("check")+'</span><div><b>Accessible controls</b><p>Semantic HTML and visible focus</p></div></div><div class="feature"><span class="feature-icon">'+icon("code")+'</span><div><b>Portable design</b><p>Pure CSS, JSON tokens and reusable source</p></div></div></div>';
 }

 function builderView(){
  const tabs=["html","css","js"].map(lang=>'<button type="button" role="tab" aria-selected="'+(builderTab===lang)+'" data-builder-tab="'+lang+'">'+lang.toUpperCase()+'</button>').join("");
  return pageHeader("CREATOR TOOLS / COMPONENT BUILDER","Make your own component.","Write and preview HTML, CSS and JavaScript inside a sandbox. Keep your draft, add it to your local library or download a ready-to-run source ZIP.")+
   '<div class="builder-layout"><div class="builder-panel"><div class="builder-panel-head"><span>YOUR COMPONENT</span><span class="micro">EDITABLE SOURCE</span></div>'+
   '<div class="builder-field-group"><label class="builder-field">Component name<input id="builder-title" maxlength="100" value="'+safe(draft.title)+'" placeholder="My component"></label><label class="builder-field">Description<input id="builder-description" maxlength="220" value="'+safe(draft.description)+'" placeholder="What does it do?"></label></div>'+
   '<div class="builder-tabs" role="tablist" aria-label="Component source">'+tabs+'</div><textarea class="builder-editor" id="builder-editor" aria-label="Edit '+builderTab+' source" spellcheck="false">'+safe(draft[builderTab]||"")+'</textarea>'+
   '<div class="builder-panel-foot"><small>Draft automatically saved on this device.</small><button type="button" class="soft-btn" id="builder-reset">Reset example</button></div></div>'+
   '<div><div class="builder-panel"><div class="builder-panel-head"><span><i class="live-dot"></i> LIVE PREVIEW</span><button type="button" class="soft-btn" id="builder-refresh">'+icon("arrow")+' Refresh</button></div><iframe class="builder-iframe" id="builder-frame" sandbox="allow-scripts" title="Sandboxed live component builder preview"></iframe><div class="builder-info">Custom code runs in an isolated iframe with no same-origin access to the Studio. Imported JavaScript can still request remote URLs. Only use code you trust.</div></div><div class="builder-actions"><button type="button" class="primary-btn" id="builder-save">'+icon("plus")+' Add to my library</button><button type="button" class="soft-btn" id="builder-export">'+icon("download")+' Export ZIP</button><button type="button" class="soft-btn" id="builder-copy">'+icon("copy")+' Copy markup</button></div></div></div>';
 }
 function builderItem(){
  return {id:"custom-"+(draft.title||"component").toLowerCase().replace(/[^a-z0-9_-]/g,"-").slice(0,40)+"-"+Date.now().toString(36),
   title:(draft.title||"Untitled component").slice(0,100),description:(draft.description||"Custom component").slice(0,220),category:"Custom",symbol:"＋",tags:["Custom","Created in Studio"],html:draft.html||"",css:draft.css||"",js:draft.js||""};
 }
 function updateBuilderPreview(){
  const frame=$("#builder-frame");
  if(frame)frame.srcdoc=frameHtml(builderItem(),"dark");
 }
 function persistDraft(){persist("preset-studio-draft",draft);}

 function applyPlayground(){
  const palette=palettes[state.accent];
  const preview=$("#canvas-preview");
  if(preview){preview.style.setProperty("--play-radius",state.radius+"px");preview.style.setProperty("--play-bloom",String(state.bloom/100));}
  if($("#bloom-value"))$("#bloom-value").textContent=state.bloom+"%";
  if($("#radius-value"))$("#radius-value").textContent=state.radius+"px";
  if($("#canvas-color-value"))$("#canvas-color-value").textContent=palette[0];
  $$(".config-swatch").forEach(el=>el.setAttribute("aria-pressed",String(el.dataset.accent===state.accent)));
  persist("preset-studio-bloom",state.bloom);persist("preset-studio-radius",state.radius);persist("preset-studio-accent",state.accent);
  setTheme();
 }
 function themeCSS(){
  const palette=palettes[state.accent];
  return "/* Generated by Preset UI Studio */\n:root {\n  --ui-bg: #10111c;\n  --ui-text: #f5f4fc;\n  --ui-surface: #191a28;\n  --ui-accent: "+palette[0]+";\n  --ui-rgb: "+palette[1]+";\n  --ui-glow: "+(state.bloom/100).toFixed(2)+";\n  --ui-radius: "+state.radius+"px;\n}\n";
 }
 function viewFiles(){
   return '<div id="vault-root"></div>';
 }
 function render(){
  const names=routeLabels;
  $("#page-breadcrumb").textContent=names[state.page];
  $$("[data-nav]").forEach(link=>{const active=link.dataset.nav===state.page;link.classList.toggle("active",active);if(active)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current")});
  $$("#category-nav [data-category-nav]").forEach(btn=>btn.classList.toggle("active",state.page==="components"&&btn.dataset.categoryNav===state.category));
  document.title=names[state.page]+" — Preset UI Studio";
  container.innerHTML=state.page==="explore"?explore():state.page==="components"?componentsView():state.page==="patterns"?patternsView():state.page==="saved"?savedView():state.page==="playground"?playgroundView():state.page==="builder"?builderView():viewFiles();
  mountFrames();
  if(state.page==="playground")applyPlayground();
  if(state.page==="builder")updateBuilderPreview();
  if(state.page==="files"){window.PresetVault.init($("#vault-root"),toast);window.PresetVault.render();}
  buildSidebar();
  // Restore focus only on route changes initiated from navigation.
 }
 function save(id){
  if(saved.has(id)){saved.delete(id);toast("Removed from saved items.");}
  else{saved.add(id);toast("Saved to your collection.");}
  persist("preset-studio-saved",[...saved]);
  $("#saved-count").textContent=saved.size;
  if(state.page==="saved")render();
  else {
   $$("[data-save]").filter(b=>b.dataset.save===id).forEach(btn=>{btn.classList.toggle("is-saved",saved.has(id));btn.setAttribute("aria-label",(saved.has(id)?"Remove from saved: ":"Save: ")+(catalog.find(x=>x.id===id)?.title||id));});
  }
  updateInspectorSave();
 }
 function updateInspectorSave(){
  if(!state.inspected)return;
  const favorite=saved.has(state.inspected.id);
  $("#inspector-save span").textContent=favorite?"Saved":"Save";
  $("#inspector-save").style.color=favorite?"#d9c3ff":"";
 }
 async function loadKit(which){
  if(kitCache[which]!=null)return kitCache[which];
  const path=which==="css"?"./assets/css/kit.css":"./assets/js/kit-interactions.js";
  const res=await fetch(new URL(path,location.href));
  if(!res.ok)throw new Error("Could not load source files");
  kitCache[which]=await res.text();
  return kitCache[which];
 }
 async function currentCode(){
  if(!state.inspected)return"";
  if(state.language==="html")return state.inspected.html;
  try{
   const base=await loadKit(state.language==="css"?"css":"js");
   const extra=state.inspected[state.language]||"";
   return (state.language==="css"?themeCSS():"")+base+(extra?"\n\n/* Component-specific additions */\n"+extra:"");
  }catch{return "Source preview requires a local HTTP server or a deployed website.";}
 }
 async function updateCode(){
  $("#inspector-code").textContent="Loading source…";
  const language=state.language;
  const source=await currentCode();
  if(language===state.language)$("#inspector-code").textContent=source;
 }
 function openInspector(id){
  const item=catalog.find(x=>x.id===id);
  if(!item)return;
  state.inspected=item;state.language="html";state.previewTheme="dark";
  $("#inspector-title").textContent=item.title;
  $("#inspector-description").textContent=item.description;
  $("#inspector-symbol").textContent=item.symbol||"✳";
  $("#inspector-label").textContent=item.kind==="pattern"?"COMPLETE PATTERN":(item.category+" / COMPONENT").toUpperCase();
  $$("[data-code]").forEach(btn=>btn.setAttribute("aria-selected",String(btn.dataset.code==="html")));
  $$("[data-preview-theme]").forEach(btn=>btn.classList.toggle("active",btn.dataset.previewTheme==="dark"));
  $("#inspector-frame").srcdoc=frameHtml(item,"dark");
  updateInspectorSave();updateCode();
  $("#inspector").showModal();
 }
 function escapeFile(name){return String(name).replace(/[^a-z0-9_-]+/gi,"-").replace(/^-+|-+$/g,"").toLowerCase().slice(0,65)||"component"}
 function documentHTML(item){
   const palette=palettes[state.accent];
   return '<!doctype html>\n<html lang="en" data-ui-theme="dark">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>'+safe(item.title)+' — Preset UI</title>\n<link rel="stylesheet" href="styles.css">\n<style>'+themeCSS()+'</style>\n</head>\n<body>\n<main class="ui-stage">\n'+item.html+'\n</main>\n<script src="script.js" defer><\/script>\n</body>\n</html>\n';
 }
 async function exportItem(item){
  try{
   const [css,js]=await Promise.all([loadKit("css"),loadKit("js")]);
   const id=escapeFile(item.id);
   const entries=[
    {name:id+"/index.html",data:documentHTML(item)},
    {name:id+"/styles.css",data:themeCSS()+"\n"+css+"\n"+(item.css||"")},
    {name:id+"/script.js",data:js+"\n"+(item.js||"")},
    {name:id+"/component.json",data:JSON.stringify(item,null,2)+"\n"},
    {name:id+"/README.md",data:"# "+item.title+"\n\nExported from Preset UI Studio.\n\nOpen index.html in a browser. JavaScript interactions are examples; connect real services to use in production.\n"}
   ];
   download(id+".zip",await window.PresetZip.pack(entries),"application/zip");
   toast("Complete source bundle downloaded.");
  }catch(error){toast("Export needs a web server. Open the site through localhost or hosting.");}
 }
 async function exportCollection(items,name){
  if(!items.length){toast("No components to export.");return;}
  try{
   const [css,js]=await Promise.all([loadKit("css"),loadKit("js")]);
   const files=[{name:"preset-ui/styles.css",data:themeCSS()+"\n"+css},{name:"preset-ui/script.js",data:js},{name:"preset-ui/README.md",data:"Preset UI component collection\n\nEach example is an independent HTML file using the shared stylesheet and script.\n"}];
   items.forEach(item=>files.push({name:"preset-ui/examples/"+escapeFile(item.id)+".html",data:documentHTML(item).replace('href="styles.css"','href="../styles.css"').replace('src="script.js"','src="../script.js"')}));
   files.push({name:"preset-ui/components.json",data:JSON.stringify(items,null,2)});
   download(name+".zip",await window.PresetZip.pack(files),"application/zip");
   toast("Collection exported.");
  }catch{toast("Source export needs a localhost or hosted website.");}
 }
 async function importJSON(files){
   let imported=0;
   for(const file of Array.from(files||[])){
    if(file.size>180000){toast("Component JSON must be smaller than 180 KB.");continue;}
    try{
     const parsed=JSON.parse(await file.text());
     const items=Array.isArray(parsed)?parsed:(Array.isArray(parsed.components)?parsed.components:[parsed]);
     for(const item of items){
      if(!item||typeof item.title!=="string"||typeof item.html!=="string"||item.title.length>100||item.html.length>30000||(item.css||"").length>30000||(item.js||"").length>20000)continue;
      const id="custom-"+(item.id||item.title).toLowerCase().replace(/[^a-z0-9_-]/g,"-").slice(0,55);
      if(catalog.some(x=>x.id===id))continue;
      const clean={id,title:item.title,description:String(item.description||"Imported component").slice(0,220),category:"Custom",symbol:"＋",tags:["Imported"],html:item.html,css:typeof item.css==="string"?item.css:"",js:typeof item.js==="string"?item.js:""};
      custom.push(clean);catalog.push(clean);imported++;
     }
    }catch{toast("Skipped an invalid component JSON file.");}
   }
   persist("preset-studio-custom",custom.slice(0,50));
   toast(imported+" component"+(imported===1?"":"s")+" imported locally.");
   if(imported){state.category="All";state.filter="";render();}
 }
 function showCommands(query=""){
   const results=[];
   Object.entries(routeLabels).forEach(([page,title])=>{if(!query||title.toLowerCase().includes(query))results.push({id:page,title,type:"PAGE",kind:"page"})});
   catalog.forEach(item=>{
    if(!query||[item.title,item.id,item.category,item.description].join(" ").toLowerCase().includes(query))results.push({id:item.id,title:item.title,type:item.category.toUpperCase(),kind:"item"});
   });
   commands=results.slice(0,12);activeCommandIndex=0;
   $("#command-results").innerHTML=commands.length?commands.map((entry,i)=>'<button type="button" class="command-item '+(i===0?"active":"")+'" data-command-index="'+i+'">'+icon(entry.kind==="page"?"grid":"box")+'<span><b>'+safe(entry.title)+'</b><small>'+safe(entry.type)+'</small></span>'+icon("arrow")+'</button>').join(""):'<div class="command-empty">No matching items.</div>';
 }
 function selectCommand(index){
   const item=commands[index];if(!item)return;
   $("#command-dialog").close();
   if(item.kind==="page")navTo(item.id);else openInspector(item.id);
 }
 function closeMobileNav(){
  $("#sidebar").classList.remove("open");$("#mobile-overlay").hidden=true;
 }
 document.addEventListener("click",async event=>{
   const open=event.target.closest("[data-open]");
   if(open){openInspector(open.dataset.open);return;}
   const fav=event.target.closest("[data-save]");
   if(fav){save(fav.dataset.save);return;}
   const filter=event.target.closest("[data-filter-category]");
   if(filter){state.category=filter.dataset.filterCategory;state.filter="";render();return;}
   const catNav=event.target.closest("[data-category-nav]");
   if(catNav){state.category=catNav.dataset.categoryNav;state.filter="";location.hash="#/components?category="+encodeURIComponent(state.category);render();closeMobileNav();return;}
   if(event.target.closest("[data-clear-filters]")){state.category="All";state.filter="";render();return;}
   const accent=event.target.closest("[data-accent]");
   if(accent){state.accent=accent.dataset.accent;applyPlayground();return;}
   if(event.target.closest("[data-canvas-button]"))toast("Your new visual identity is looking good.");
   if(event.target.closest("#copy-theme"))await copy(themeCSS());
   if(event.target.closest("#export-theme")){download("preset-ui-tokens.json",JSON.stringify({accent:palettes[state.accent][0],accentRgb:palettes[state.accent][1],bloom:state.bloom/100,radius:state.radius,css:themeCSS()},null,2),"application/json");toast("Theme tokens downloaded.");}
   if(event.target.closest("#reset-theme")){state.bloom=66;state.radius=20;state.accent="violet";$("#bloom-input").value=66;$("#radius-input").value=20;applyPlayground();toast("Theme reset.");}
   if(event.target.closest("[data-builder-tab]")){
    builderTab=event.target.closest("[data-builder-tab]").dataset.builderTab;
    $(".builder-tabs button").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.builderTab===builderTab)));
    $("#builder-editor").value=draft[builderTab]||"";
    $("#builder-editor").setAttribute("aria-label","Edit "+builderTab+" source");
   }
   if(event.target.closest("#builder-refresh")){updateBuilderPreview();toast("Live preview refreshed.");}
   if(event.target.closest("#builder-copy"))await copy(draft.html||"");
   if(event.target.closest("#builder-export"))await exportItem(builderItem());
   if(event.target.closest("#builder-reset")){
     if(window.confirm("Replace your current builder draft with the starter example?")){
       draft={...defaultDraft};builderTab="html";persistDraft();render();toast("Starter example restored.");
     }
   }
   if(event.target.closest("#builder-save")){
     if(!draft.html.trim()){toast("Write some HTML before saving.");return;}
     if(custom.length>=50){toast("Local library limit reached (50 custom components).");return;}
     const item=builderItem();custom.push(item);catalog.push(item);persist("preset-studio-custom",custom);
     buildSidebar();toast("Component added to your local library.");
     location.hash="#/components?category=Custom";
   }
   if(event.target.closest("#download-all"))await exportCollection(catalog.filter(x=>x.kind!=="pattern"),"preset-ui-full-kit");
   if(event.target.closest("#export-saved"))await exportCollection(catalog.filter(x=>saved.has(x.id)),"preset-ui-saved");
   if(event.target.closest("#import-json"))$("#json-picker").click();
 });
 container.addEventListener("input",event=>{
  if(event.target.id==="gallery-search"){
   const input=event.target;state.filter=input.value;
   // Replace only the card region to avoid disrupting typing or focus.
   const cards=$(".cards-grid",container)||$(".empty-screen",container);
   const html=gallery(listing());
   if(cards){cards.outerHTML=html;mountFrames()}
   const count=$(".gallery-meta strong",container);if(count)count.textContent=listing().length;
  }
  if(event.target.id==="builder-editor"){draft[builderTab]=event.target.value;persistDraft();clearTimeout(builderTimer);builderTimer=setTimeout(updateBuilderPreview,380);}
  if(event.target.id==="builder-title"){draft.title=event.target.value;persistDraft();}
  if(event.target.id==="builder-description"){draft.description=event.target.value;persistDraft();}
  if(event.target.id==="bloom-input"){state.bloom=Number(event.target.value);applyPlayground();}
  if(event.target.id==="radius-input"){state.radius=Number(event.target.value);applyPlayground();}
 });
 $("#inspector-close").addEventListener("click",()=>$("#inspector").close());
 $("#inspector-edit").addEventListener("click",()=>{
   if(!state.inspected)return;
   draft={title:state.inspected.title+" copy",description:state.inspected.description,html:state.inspected.html,css:state.inspected.css||"",js:state.inspected.js||""};
   builderTab="html";persistDraft();$("#inspector").close();navTo("builder");
 });
 $("#inspector").addEventListener("click",event=>{if(event.target===$("#inspector"))$("#inspector").close()});
 $("#inspector-save").addEventListener("click",()=>state.inspected&&save(state.inspected.id));
 $("#inspector-download").addEventListener("click",()=>state.inspected&&exportItem(state.inspected));
 $("#inspector-json").addEventListener("click",()=>{if(state.inspected)download(escapeFile(state.inspected.id)+".json",JSON.stringify(state.inspected,null,2),"application/json")});
 $("#inspector-copy").addEventListener("click",()=>state.inspected&&copy(state.inspected.html));
 $("#tab-copy").addEventListener("click",async()=>copy(await currentCode()));
 $("#code-tabs").addEventListener("click",event=>{
   const btn=event.target.closest("[data-code]");if(!btn)return;
   state.language=btn.dataset.code;
   $$("[data-code]").forEach(el=>el.setAttribute("aria-selected",String(el===btn)));
   updateCode();
 });
 $$(".pill-toggle").forEach(btn=>btn.addEventListener("click",()=>{
  state.previewTheme=btn.dataset.previewTheme;
  $$(".pill-toggle").forEach(el=>el.classList.toggle("active",el===btn));
  if(state.inspected)$("#inspector-frame").srcdoc=frameHtml(state.inspected,state.previewTheme);
 }));
 $("#theme-switch").addEventListener("click",()=>{state.uiTheme=state.uiTheme==="dark"?"light":"dark";setTheme();});
 $("#open-nav").addEventListener("click",()=>{$("#sidebar").classList.add("open");$("#mobile-overlay").hidden=false});
 $("#close-nav").addEventListener("click",closeMobileNav);
 $("#mobile-overlay").addEventListener("click",closeMobileNav);
 $("#primary-nav").addEventListener("click",closeMobileNav);
 $("#search-launch").addEventListener("click",()=>{
   $("#command-dialog").showModal();$("#command-input").value="";showCommands();$("#command-input").focus();
 });
 $("#command-input").addEventListener("input",event=>showCommands(event.target.value.toLowerCase().trim()));
 $("#command-results").addEventListener("click",event=>{const row=event.target.closest("[data-command-index]");if(row)selectCommand(Number(row.dataset.commandIndex));});
 $("#command-input").addEventListener("keydown",event=>{
   if(event.key==="ArrowDown"||event.key==="ArrowUp"){
     event.preventDefault();
     if(commands.length){activeCommandIndex=(activeCommandIndex+(event.key==="ArrowDown"?1:-1)+commands.length)%commands.length;$$("#command-results .command-item").forEach((el,i)=>el.classList.toggle("active",i===activeCommandIndex))}
   }else if(event.key==="Enter"){event.preventDefault();selectCommand(activeCommandIndex)}
 });
 window.addEventListener("keydown",event=>{
   if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();$("#search-launch").click()}
 });
 $("#json-picker").addEventListener("change",event=>{importJSON(event.target.files);event.target.value=""});
 window.addEventListener("hashchange",()=>{closeMobileNav();hashRoute();window.scrollTo(0,0)});
 buildSidebar();hashRoute();
})();