
(function(){
"use strict";
function initLocalMusic(){
 if(document.getElementById("ze-local-music"))return;
 const s=document.createElement("style");s.textContent=`
 #ze-local-music{position:fixed;right:18px;bottom:86px;z-index:100004;width:300px;padding:14px;border-radius:18px;background:rgba(10,15,35,.95);color:#fff;box-shadow:0 15px 45px rgba(0,0,0,.35);font:700 13px system-ui;display:none;backdrop-filter:blur(12px)}
 #ze-local-music.open{display:block}
 #ze-local-music select,#ze-local-music input{width:100%;margin:7px 0}
 #ze-local-music button{border:0;border-radius:10px;padding:8px 11px;margin:3px;background:#24304d;color:#fff;font-weight:800;cursor:pointer}
 #ze-local-music .primary{background:linear-gradient(135deg,#00c6ff,#7c3aed)}
 #ze-music-fab-v14{position:fixed;right:18px;bottom:18px;z-index:100005;width:58px;height:58px;border:0;border-radius:50%;background:linear-gradient(135deg,#00e5ff,#7c3aed);color:#fff;font-size:24px;box-shadow:0 10px 35px rgba(0,0,0,.35);touch-action:none}
 `;
 document.head.appendChild(s);
 const p=document.createElement("div");p.id="ze-local-music";
 p.innerHTML=`<div style="font-size:15px">🎵 Zeyad Music</div>
 <select id="ze-track-v14">
 <option value="music/neon_penguin_rush.wav">🐧 Neon Penguin Rush</option>
 <option value="music/ai_arcade_chill.wav">🤖 AI Arcade Chill</option>
 <option value="music/victory_party.wav">🏆 Victory Party</option>
 <option value="music/neon_night.wav">🌃 Neon Night</option>
 <option value="music/pixel_dreams.wav">🕹️ Pixel Dreams</option>
 <option value="music/cyber_sunset.wav">🌅 Cyber Sunset</option>
 <option value="music/arcade_breeze.wav">🎮 Arcade Breeze</option>
 <option value="music/penguin_parade.wav">🐧 Penguin Parade</option>
 <option value="music/galaxy_drive.wav">🌌 Galaxy Drive</option>
 <option value="music/victory_lights.wav">🏆 Victory Lights</option>
 <option value="music/chill_ai.wav">🧠 Chill AI</option>
 </select>
 <audio id="ze-audio-v14" preload="auto"></audio>
 <button class="primary" id="ze-play-v14">▶ تشغيل</button>
 <button id="ze-prev-v14">⏮</button><button id="ze-next-v14">⏭</button>
 <button id="ze-shuffle-v14">🔀 عشوائي</button><button id="ze-repeat-v14">🔁 تكرار</button>
 <label style="display:block;margin-top:5px">🔊 <input id="ze-vol-v14" type="range" min="0" max="1" step=".01" value=".65"></label>`;
 document.body.appendChild(p);
 const fab=document.createElement("button");fab.id="ze-music-fab-v14";fab.textContent="🎵";fab.title="تشغيل/إيقاف الموسيقى";document.body.appendChild(fab);
 const audio=p.querySelector("#ze-audio-v14"),sel=p.querySelector("#ze-track-v14");
 let idx=0,shuffle=false,repeat=false;
 function load(){audio.src=sel.value;audio.load();sel.selectedIndex=idx;}
 function tracks(){return [...sel.options].map(x=>x.value)}
 function next(){
   idx=shuffle?Math.floor(Math.random()*sel.options.length):(idx+1)%sel.options.length;
   load();audio.play().catch(()=>{});p.querySelector("#ze-play-v14").textContent="⏸ إيقاف";
 }
 sel.onchange=()=>{idx=sel.selectedIndex;load();audio.play().catch(()=>{})};
 p.querySelector("#ze-play-v14").onclick=()=>{if(audio.paused){audio.play().catch(()=>{});p.querySelector("#ze-play-v14").textContent="⏸ إيقاف"}else{audio.pause();p.querySelector("#ze-play-v14").textContent="▶ تشغيل"}};
 p.querySelector("#ze-prev-v14").onclick=()=>{idx=(idx-1+sel.options.length)%sel.options.length;load();audio.play().catch(()=>{})};
 p.querySelector("#ze-next-v14").onclick=next;
 p.querySelector("#ze-shuffle-v14").onclick=()=>{shuffle=!shuffle;p.querySelector("#ze-shuffle-v14").textContent=shuffle?"🔀 عشوائي ✓":"🔀 عشوائي"};
 p.querySelector("#ze-repeat-v14").onclick=()=>{repeat=!repeat;p.querySelector("#ze-repeat-v14").textContent=repeat?"🔁 تكرار ✓":"🔁 تكرار"};
 p.querySelector("#ze-vol-v14").oninput=e=>audio.volume=e.target.value;
 audio.onended=()=>repeat?audio.play():next();
 load();audio.volume=.65;
 let open=false;fab.onclick=()=>{open=!open;p.classList.toggle("open",open)};
 // draggable floating button
 let drag=false,sx=0,sy=0,ox=0,oy=0;
 fab.onpointerdown=e=>{drag=true;sx=e.clientX;sy=e.clientY;let r=fab.getBoundingClientRect();ox=r.left;oy=r.top;fab.setPointerCapture(e.pointerId)};
 fab.onpointermove=e=>{if(!drag)return;let dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)+Math.abs(dy)>7)fab.dataset.dragged="1";fab.style.left=Math.max(4,Math.min(innerWidth-66,ox+dx))+"px";fab.style.top=Math.max(4,Math.min(innerHeight-66,oy+dy))+"px";fab.style.right="auto";fab.style.bottom="auto"};
 fab.onpointerup=()=>{drag=false};
 window.ZeyadLocalMusic={audio,play:()=>audio.play(),pause:()=>audio.pause()};
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initLocalMusic);else initLocalMusic();
})();
