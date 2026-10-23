/* Small enhancements for documentation. */
(() => {
 "use strict";
 const links=[...document.querySelectorAll('.docs-side a[href^="#"]')];
 const $=selector=>document.querySelector(selector);
 function updateActive(){
  const top=window.scrollY+150;
  let active="welcome";
  document.querySelectorAll(".docs-main section[id]").forEach(section=>{if(section.offsetTop<=top)active=section.id;});
  links.forEach(link=>{const on=link.hash==="#"+active;link.classList.toggle("active",on);if(on)link.setAttribute("aria-current","location");else link.removeAttribute("aria-current");});
 }
 let ticking=false;
 window.addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{updateActive();ticking=false;});}},{passive:true});
 updateActive();
 let timer;
 function notify(message){const node=$("#docs-toast");node.textContent=message;node.classList.add("visible");clearTimeout(timer);timer=setTimeout(()=>node.classList.remove("visible"),2400);}
 async function copy(value){
  try{await navigator.clipboard.writeText(value);notify("Copied to clipboard.");}
  catch{const field=document.createElement("textarea");field.value=value;field.style.cssText="position:fixed;opacity:0";document.body.append(field);field.select();let ok=false;try{ok=document.execCommand("copy");}catch{}field.remove();notify(ok?"Copied.":"Select the snippet to copy.");}
 }
 document.addEventListener("click",event=>{
   const button=event.target.closest("[data-copy]");
   if(button){const target=document.getElementById(button.dataset.copy);if(target)copy(target.textContent.trim());}
 });
})();