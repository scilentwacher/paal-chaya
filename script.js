const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav");
menuBtn?.addEventListener("click",()=>{const open=nav.style.display==="flex";nav.style.display=open?"":"flex";menuBtn.setAttribute("aria-expanded",String(!open))});
nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{if(innerWidth<=800)nav.style.display=""}));

document.querySelectorAll(".preset").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".preset").forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");}));
const searchInput=document.getElementById("searchInput"),filter=document.getElementById("categoryFilter");
function filterPlaces(){const q=(searchInput.value||"").toLowerCase(),cat=filter.value;document.querySelectorAll(".place-card").forEach(c=>{const okQ=c.dataset.name.toLowerCase().includes(q)||c.textContent.toLowerCase().includes(q);const okC=cat==="all"||c.dataset.category===cat;c.style.display=okQ&&okC?"block":"none"})}
searchInput?.addEventListener("input",filterPlaces);filter?.addEventListener("change",filterPlaces);

let timerId=null,remaining=0;
const display=document.getElementById("timerDisplay");
document.querySelectorAll(".timer").forEach(b=>b.addEventListener("click",()=>{clearInterval(timerId);remaining=Number(b.dataset.min)*60;renderTimer();timerId=setInterval(()=>{remaining--;renderTimer();if(remaining<=0){clearInterval(timerId);alert("Focus session complete ☕")}},1000)}));
function renderTimer(){if(display){const m=Math.floor(remaining/60),s=remaining%60;display.textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`}}

document.querySelectorAll(".era").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".era").forEach(x=>x.classList.remove("active"));b.classList.add("active")}));

const form=document.getElementById("memoryForm"),list=document.getElementById("memoryList");
let memories=JSON.parse(localStorage.getItem("paalChayaMemories")||"[]");
function renderMemories(){list.innerHTML=memories.map(m=>`<article class="memory"><strong>${escapeHtml(m.title)}</strong>${m.year?` · ${escapeHtml(m.year)}`:""}<p>${escapeHtml(m.text)}</p></article>`).join("")}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
form?.addEventListener("submit",e=>{e.preventDefault();memories.unshift({title:memoryTitle.value,year:memoryYear.value,text:memoryText.value});localStorage.setItem("paalChayaMemories",JSON.stringify(memories));form.reset();renderMemories()});
renderMemories();
