/* Preset UI File Workspace — files never leave the browser.
   Stores Blob objects in IndexedDB; supports arbitrary types and relative folder paths.
   Uploaded HTML/JS is shown only as escaped text; it is NEVER executed. */
window.PresetVault = (() => {
 "use strict";
 let dbPromise, currentFolder="", root, toast=()=>{};
 const MAX_FILE_SIZE=20*1024*1024, MAX_BATCH=80*1024*1024;
 const esc = value => String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 const normalized = value => String(value || "").replaceAll("\\","/").split("/").filter(segment => segment && segment !== "." && segment !== "..").join("/").slice(0,380);
 const basename = path => path.split("/").pop();
 function db() {
  if (!dbPromise) dbPromise = new Promise((resolve,reject) => {
   if (!("indexedDB" in window)) { reject(new Error("Browser file storage is unavailable")); return; }
   const request=indexedDB.open("preset-ui-workspace",1);
   request.onupgradeneeded=() => {
    const instance=request.result;
    if (!instance.objectStoreNames.contains("files")) instance.createObjectStore("files",{keyPath:"path"});
    if (!instance.objectStoreNames.contains("folders")) instance.createObjectStore("folders",{keyPath:"path"});
   };
   request.onsuccess=() => resolve(request.result);
   request.onerror=() => reject(request.error || new Error("Storage could not be opened"));
  });
  return dbPromise;
 }
 async function records(storeName) {
  const database=await db();
  return new Promise((resolve,reject) => {
   const request=database.transaction(storeName,"readonly").objectStore(storeName).getAll();
   request.onsuccess=()=>resolve(request.result);
   request.onerror=()=>reject(request.error);
  });
 }
 async function write(storeName,item) {
  const database=await db();
  return new Promise((resolve,reject) => {
   const tx=database.transaction(storeName,"readwrite");
   tx.objectStore(storeName).put(item);
   tx.oncomplete=resolve;
   tx.onerror=()=>reject(tx.error);
  });
 }
 async function remove(storeName,path) {
  const database=await db();
  return new Promise((resolve,reject)=>{
   const tx=database.transaction(storeName,"readwrite");
   tx.objectStore(storeName).delete(path);
   tx.oncomplete=resolve;
   tx.onerror=()=>reject(tx.error);
  });
 }
 const bytes=size => size<1024?size+" B":size<1024*1024?(size/1024).toFixed(1)+" KB":(size/1024/1024).toFixed(1)+" MB";
 function download(name,blob) {
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=basename(name);document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
 }
 async function upload(files) {
  const incoming=Array.from(files||[]);
  if (!incoming.length) return;
  if (incoming.some(file => file.size>MAX_FILE_SIZE)) {toast("Files must be 20 MB or smaller.");return;}
  if (incoming.reduce((n,file)=>n+file.size,0)>MAX_BATCH) {toast("Upload batches must be 80 MB or smaller.");return;}
  try {
   for(const file of incoming) {
    const relative=normalized(file.webkitRelativePath || file.name);
    const path=normalized((currentFolder?currentFolder+"/":"")+relative);
    if (!path) continue;
    await write("files",{path,blob:file,size:file.size,type:file.type||"application/octet-stream",modified:Date.now()});
   }
   toast("Saved "+incoming.length+" file"+(incoming.length===1?"":"s")+" on this device.");
   await render();
  } catch(error) {toast("Cannot save files: "+(error?.name==="QuotaExceededError"?"browser storage is full": "browser storage is unavailable"));}
 }
 async function render() {
  if (!root) return;
  try {
   const [files,folders]=await Promise.all([records("files"),records("folders")]);
   const knownFolders=new Set([""]);
   folders.forEach(x => knownFolders.add(x.path));
   files.forEach(x => {
    const bits=x.path.split("/");
    for(let i=1;i<bits.length;i++) knownFolders.add(bits.slice(0,i).join("/"));
   });
   const folderList=[...knownFolders].sort((a,b)=>a.localeCompare(b));
   const descendants=folderList.filter(p=>!p||!currentFolder||p.startsWith(currentFolder+"/")||p===currentFolder);
   const dirCount=path=>files.filter(f=>!path||f.path.startsWith(path+"/")).length;
   const visible=files.filter(f=>{
    const parent=f.path.split("/").slice(0,-1).join("/");
    return parent===currentFolder;
   }).sort((a,b)=>a.path.localeCompare(b.path));
   root.innerHTML='<div class="vault-head"><div><span class="eyebrow">YOUR PRIVATE WORKSPACE</span><h2 class="section-title" style="margin-bottom:5px">Your files, your folders.</h2><p class="section-subtitle">Store any file locally in your browser. Preview text, download originals, and export folders as ZIP. Nothing is uploaded to a server.</p></div><div class="vault-actions"><button class="soft-btn" data-vault="folder">＋ New folder</button><button class="soft-btn" data-vault="directory">◫ Import folder</button><button class="primary-btn" data-vault="upload">↑ Add files</button></div></div>'+
     '<div class="notice-banner"><svg><use href="#i-info"/></svg><div><strong>Device-only storage.</strong> Files stay in this browser’s IndexedDB. Clearing browser data may erase them; export important files as a ZIP backup. Maximum 20 MB per file and 80 MB per import batch.</div></div>'+
     '<div class="vault-grid"><div class="vault-folders"><div class="vault-panel-title">FOLDERS <span>'+folderList.length+'</span></div><div class="vault-folder-list">'+folderList.map(path=>'<button class="vault-folder '+(path===currentFolder?'active':'')+'" data-vault-folder="'+esc(path)+'"><svg><use href="#i-folder"/></svg><span>'+esc(path?basename(path):"My Files")+'</span><small>'+dirCount(path)+'</small></button>').join("")+'</div></div>'+
     '<div class="vault-files"><div class="vault-panel-title"><span>'+esc(currentFolder?currentFolder:"My Files")+'</span><span>'+visible.length+' FILES</span></div><div class="file-list">'+
     (visible.length?visible.map(file=>'<div class="file-row"><span class="file-glyph"><svg><use href="#i-code"/></svg></span><div class="file-row-info"><strong title="'+esc(file.path)+'">'+esc(basename(file.path))+'</strong><small>'+bytes(file.size)+' · '+new Date(file.modified).toLocaleDateString()+'</small></div><div class="file-row-actions"><button class="tiny-icon" aria-label="Preview '+esc(basename(file.path))+'" title="Preview" data-vault-preview="'+esc(file.path)+'"><svg><use href="#i-eye"/></svg></button><button class="tiny-icon" aria-label="Download '+esc(basename(file.path))+'" title="Download" data-vault-download="'+esc(file.path)+'"><svg><use href="#i-download"/></svg></button><button class="tiny-icon" aria-label="Delete '+esc(basename(file.path))+'" title="Delete" data-vault-remove="'+esc(file.path)+'"><svg><use href="#i-trash"/></svg></button></div></div>').join(""):'<div class="dropzone" id="vault-drop"><svg><use href="#i-upload"/></svg><strong>This folder is empty</strong><span>Drop files here or use Add files.</span></div>')+
     '</div><div style="padding:0 15px 16px;display:flex;gap:9px;flex-wrap:wrap"><button class="soft-btn" data-vault="export">↓ Export current folder as ZIP</button><button class="soft-btn" data-vault="up">← Parent folder</button></div><div id="vault-file-preview"></div></div></div>';
  } catch(error) {
   root.innerHTML='<div class="empty-screen"><div class="empty-symbol">!</div><h3>Local file storage unavailable</h3><p>Your browser may block IndexedDB or be in a restricted privacy mode.</p></div>';
  }
 }
 async function getFile(path) {return (await records("files")).find(item=>item.path===path);}
 async function preview(path) {
  const file=await getFile(path);if(!file)return;
  const target=document.getElementById("vault-file-preview");
  if(!target)return;
  const name=basename(path);
  const textTypes=/^(text\/|application\/(json|javascript|xml|x-sh|.*\+json))/;
  const allowedExt=/\.(txt|html|css|js|json|md|xml|svg|csv|log|yaml|yml|py|ts|tsx|jsx|sql)$/i;
  if (file.size>200*1024 || (!textTypes.test(file.type)&&!allowedExt.test(name))) {
    target.innerHTML='<div class="vault-details"><strong>'+esc(name)+'</strong><div>Binary file or large file. Download it to inspect it in a suitable application.</div></div>';
    return;
  }
  const content=await file.blob.text();
  target.innerHTML='<div class="vault-details"><strong>'+esc(name)+'</strong><pre class="file-preview">'+esc(content.slice(0,15000))+(content.length>15000?"\n… Preview truncated":"")+'</pre></div>';
 }
 async function exportFolder() {
  const files=(await records("files")).filter(f=>!currentFolder||f.path.startsWith(currentFolder+"/"));
  if(!files.length){toast("No files in this folder to export.");return;}
  const prefix=currentFolder?currentFolder+"/":"";
  const entries=files.map(f=>({name:f.path.slice(prefix.length),data:f.blob}));
  const zip=await window.PresetZip.pack(entries);
  download((basename(currentFolder)||"preset-workspace")+".zip",zip);
  toast("Folder ZIP exported.");
 }
 async function handleClick(event) {
  const folder=event.target.closest("[data-vault-folder]");
  if (folder) {currentFolder=folder.dataset.vaultFolder;await render();return;}
  const previewButton=event.target.closest("[data-vault-preview]");
  if (previewButton) {await preview(previewButton.dataset.vaultPreview);return;}
  const downloadButton=event.target.closest("[data-vault-download]");
  if (downloadButton) {const file=await getFile(downloadButton.dataset.vaultDownload);if(file)download(file.path,file.blob);return;}
  const removeButton=event.target.closest("[data-vault-remove]");
  if (removeButton) {
   const path=removeButton.dataset.vaultRemove;
   if (window.confirm("Delete "+basename(path)+" from browser storage?")) {await remove("files",path);toast("File deleted.");await render();}
   return;
  }
  const action=event.target.closest("[data-vault]")?.dataset.vault;
  if (action==="upload") document.getElementById("file-picker").click();
  if (action==="directory") document.getElementById("folder-picker").click();
  if (action==="folder") {
   const name=prompt("Name your folder:");
   if(name===null)return;
   const segment=normalized(name);
   if(!segment || segment.includes("/")){toast("Enter one valid folder name.");return;}
   const path=normalized((currentFolder?currentFolder+"/":"")+segment);
   await write("folders",{path,modified:Date.now()});currentFolder=path;await render();
  }
  if (action==="up") {currentFolder=currentFolder.split("/").slice(0,-1).join("/");await render();}
  if (action==="export") await exportFolder();
 }
 function init(container, notify) {
  root=container;toast=notify;
  root.addEventListener("click",event=>{handleClick(event).catch(()=>toast("File action failed."));});
  root.addEventListener("dragover",event=>{event.preventDefault();document.getElementById("vault-drop")?.classList.add("dragging")});
  root.addEventListener("dragleave",()=>document.getElementById("vault-drop")?.classList.remove("dragging"));
  root.addEventListener("drop",event=>{event.preventDefault();upload(event.dataTransfer.files);});
  document.getElementById("file-picker").addEventListener("change",event=>{upload(event.target.files);event.target.value="";});
  document.getElementById("folder-picker").addEventListener("change",event=>{upload(event.target.files);event.target.value="";});
 }
 return {init,render,upload};
})();