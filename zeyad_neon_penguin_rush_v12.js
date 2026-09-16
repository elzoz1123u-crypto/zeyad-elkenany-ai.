
/* Zeyad AI — EPIC GAME: Neon Penguin Rush
   Self-contained canvas game. No external assets or libraries.
*/
(function(){
"use strict";
function addGame(){
 if(document.getElementById("ze-neon-game")) return;
 const style=document.createElement("style"); style.id="ze-neon-style";
 style.textContent=`
 #ze-neon-game{position:fixed;inset:0;z-index:100000;background:#050816;display:none;align-items:center;justify-content:center;font-family:system-ui,sans-serif}
 #ze-neon-game.open{display:flex}
 #ze-neon-wrap{position:relative;width:min(96vw,900px);height:min(86vh,620px);border:2px solid rgba(0,229,255,.55);border-radius:22px;overflow:hidden;box-shadow:0 0 45px rgba(0,229,255,.22);background:#070b20}
 #ze-neon-canvas{width:100%;height:100%;display:block}
 #ze-neon-top{position:absolute;left:16px;right:16px;top:12px;display:flex;justify-content:space-between;color:#fff;font-weight:800;font-size:14px;pointer-events:none}
 #ze-neon-close{position:absolute;right:12px;bottom:12px;border:0;border-radius:12px;padding:10px 14px;background:rgba(255,255,255,.12);color:#fff;font-weight:800;cursor:pointer}
 #ze-neon-help{position:absolute;left:14px;bottom:14px;color:rgba(255,255,255,.72);font-size:12px}
 .ze-game-card{cursor:pointer;user-select:none}
 `;
 document.head.appendChild(style);

 const root=document.createElement("div"); root.id="ze-neon-game";
 root.innerHTML=`<div id="ze-neon-wrap"><canvas id="ze-neon-canvas"></canvas>
 <div id="ze-neon-top"><span>🐧 NEON PENGUIN RUSH</span><span>Score: <b id="ze-score">0</b> · 🪙 <b id="ze-coins2">0</b> · ❤️ <b id="ze-hp">3</b></span></div>
 <div id="ze-neon-help">← → / لمس الشاشة للتحرك · اجمع النجوم وتجنب النيازك</div>
 <div id="ze-neon-touch" style="position:absolute;left:50%;bottom:10px;transform:translateX(-50%);display:flex;gap:12px;z-index:4"><button data-dir="-1" style="width:68px;height:54px;border:0;border-radius:16px;background:#ffffff18;color:#fff;font-size:24px">◀</button><button data-dir="1" style="width:68px;height:54px;border:0;border-radius:16px;background:#ffffff18;color:#fff;font-size:24px">▶</button></div>
 <button id="ze-neon-close">خروج ✕</button></div>`;
 document.body.appendChild(root);

 const c=document.getElementById("ze-neon-canvas"),ctx=c.getContext("2d");
 let W=900,H=620,raf=0,running=false,score=0,coins=0,hp=3,t=0,level=1;
 let player={x:450,y:540,w:54,h:54,vx:0}; let keys={};
 let stars=[],rocks=[],sparks=[],last=0,spawn=0,rockSpawn=0;

 function resize(){const r=c.getBoundingClientRect();W=c.width=Math.max(600,Math.floor(r.width*devicePixelRatio));H=c.height=Math.max(400,Math.floor(r.height*devicePixelRatio));ctx.setTransform(1,0,0,1,0,0);ctx.scale(W/c.clientWidth,H/c.clientHeight);}
 window.addEventListener("resize",resize);

 function open(){root.classList.add("open");resize();reset();running=true;last=performance.now();raf=requestAnimationFrame(loop);}
 function close(){running=false;root.classList.remove("open");cancelAnimationFrame(raf);}
 document.getElementById("ze-neon-close").onclick=close;

 function reset(){score=0;coins=0;hp=3;level=1;t=0;spawn=0;rockSpawn=0;stars=[];rocks=[];sparks=[];player.x=W*.5;player.y=H*.86;player.vx=0;updateHud();}
 function updateHud(){document.getElementById("ze-score").textContent=score;document.getElementById("ze-coins2").textContent=coins;document.getElementById("ze-hp").textContent=hp;}

 document.addEventListener("keydown",e=>{keys[e.key]=true;if((e.key==="Escape")&&running)close();});
 document.addEventListener("keyup",e=>keys[e.key]=false);
 c.addEventListener("pointermove",e=>{if(!running)return;const r=c.getBoundingClientRect();player.x=(e.clientX-r.left)/r.width*W;});
 c.addEventListener("pointerdown",e=>{if(!running)return;const r=c.getBoundingClientRect();player.x=(e.clientX-r.left)/r.width*W;});
 document.querySelectorAll("#ze-neon-touch [data-dir]").forEach(b=>{b.addEventListener("pointerdown",()=>{keys[b.dataset.dir==="-1"?"ArrowLeft":"ArrowRight"]=true});b.addEventListener("pointerup",()=>{keys[b.dataset.dir==="-1"?"ArrowLeft":"ArrowRight"]=false});b.addEventListener("pointerleave",()=>{keys[b.dataset.dir==="-1"?"ArrowLeft":"ArrowRight"]=false})});

 function burst(x,y,n=12){
  for(let i=0;i<n;i++) sparks.push({x,y,vx:(Math.random()-.5)*260,vy:(Math.random()-.5)*260,life:.6+Math.random()*.5});
 }
 function hit(a,b){return Math.abs(a.x-b.x)<(a.w+b.w)*.5 && Math.abs(a.y-b.y)<(a.h+b.h)*.5;}

 function loop(now){
  if(!running)return;
  const dt=Math.min(.032,(now-last)/1000);last=now;t+=dt;
  level=1+Math.floor(score/500);
  player.vx=(keys.ArrowLeft||keys.a?-1:0)+(keys.ArrowRight||keys.d?1:0);
  player.x+=player.vx*520*dt; player.x=Math.max(35,Math.min(W-35,player.x));
  spawn+=dt;rockSpawn+=dt;
  if(spawn>.72-Math.min(.35,level*.025)){spawn=0;stars.push({x:35+Math.random()*(W-70),y:-30,w:28,h:28,vy:170+level*18});}
  if(rockSpawn>1.15-Math.min(.55,level*.035)){rockSpawn=0;rocks.push({x:35+Math.random()*(W-70),y:-45,w:44+Math.random()*25,h:44+Math.random()*25,vy:190+level*24,rot:0});}
  stars.forEach(s=>s.y+=s.vy*dt);
  rocks.forEach(r=>{r.y+=r.vy*dt;r.rot+=dt*2;});
  stars=stars.filter(s=>{
   if(hit(player,s)){score+=100;coins++;burst(s.x,s.y,10);updateHud();return false}
   return s.y<H+50;
  });
  rocks=rocks.filter(r=>{
   if(hit(player,r)){hp--;burst(player.x,player.y,22);updateHud();if(hp<=0){gameOver();}return false}
   return r.y<H+70;
  });
  sparks.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt;p.life-=dt});
  sparks=sparks.filter(p=>p.life>0);
  draw();
  raf=requestAnimationFrame(loop);
 }
 function gameOver(){
  running=false;
  setTimeout(()=>{alert("🐧 انتهت الجولة!\\nScore: "+score+"\\nCoins: "+coins+"\\nLevel: "+level);},30);
  if(window.ZeyadArcade){window.ZeyadArcade.gain(Math.max(10,Math.floor(score/10)),coins);}
 }
 function draw(){
  ctx.clearRect(0,0,W,H);
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#050816");g.addColorStop(1,"#10184a");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  // stars
  for(let i=0;i<70;i++){let x=(i*137+t*12)%W,y=(i*71+t*55)%H;ctx.fillStyle="rgba(255,255,255,.35)";ctx.fillRect(x,y,2,2)}
  // ground glow
  ctx.fillStyle="rgba(0,229,255,.08)";ctx.fillRect(0,H*.93,W,H*.07);
  // collectibles
  stars.forEach(s=>{ctx.save();ctx.translate(s.x,s.y);ctx.rotate(t*2);ctx.fillStyle="#ffe66d";ctx.shadowBlur=20;ctx.shadowColor="#ffe66d";ctx.beginPath();for(let i=0;i<10;i++){let a=i*Math.PI/5,r=i%2?8:18;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.fill();ctx.restore()});
  rocks.forEach(r=>{ctx.save();ctx.translate(r.x,r.y);ctx.rotate(r.rot);ctx.fillStyle="#a66cff";ctx.shadowBlur=18;ctx.shadowColor="#a66cff";ctx.beginPath();for(let i=0;i<8;i++){let a=i*Math.PI/4,rr=r.w*.45*(.8+Math.random()*.35);ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}ctx.closePath();ctx.fill();ctx.restore()});
  // penguin
  ctx.save();ctx.translate(player.x,player.y);ctx.shadowBlur=25;ctx.shadowColor="#00e5ff";
  ctx.fillStyle="#111827";ctx.beginPath();ctx.ellipse(0,0,25,30,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#f8fafc";ctx.beginPath();ctx.ellipse(0,6,16,21,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#fbbf24";ctx.beginPath();ctx.moveTo(0,1);ctx.lineTo(11,7);ctx.lineTo(0,12);ctx.lineTo(-11,7);ctx.closePath();ctx.fill();
  ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(-9,-9,6,0,Math.PI*2);ctx.arc(9,-9,6,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#111";ctx.beginPath();ctx.arc(-8,-9,2.5,0,Math.PI*2);ctx.arc(8,-9,2.5,0,Math.PI*2);ctx.fill();
  ctx.restore();
  sparks.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle="#fff";ctx.fillRect(p.x,p.y,4,4);ctx.globalAlpha=1});
 }
 window.ZeyadNeonRush={open,close};
}

function addLauncher(){
 const texts=["Neon Penguin Rush","بطريق","Penguin Rush","لعبة جديدة"];
 const els=[...document.querySelectorAll("button,[role=button],.btn,.button")];
 els.forEach(el=>{
   const tx=(el.innerText||"").trim().toLowerCase();
   if(texts.some(q=>tx.includes(q.toLowerCase()))){
     el.addEventListener("click",()=>window.ZeyadNeonRush.open());
   }
 });
 // If no suitable launcher exists, add a beautiful floating game button.
 if(!document.getElementById("ze-neon-launch")){
   const b=document.createElement("button");b.id="ze-neon-launch";b.textContent="🐧 Neon Penguin Rush";
   b.style.cssText="position:fixed;left:16px;bottom:16px;z-index:99998;border:0;border-radius:16px;padding:12px 16px;background:linear-gradient(135deg,#00e5ff,#7c3aed);color:white;font-weight:900;box-shadow:0 8px 30px rgba(0,0,0,.25);cursor:pointer";
   b.onclick=()=>window.ZeyadNeonRush.open();document.body.appendChild(b);
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{addGame();addLauncher()});else{addGame();addLauncher();}
})();
