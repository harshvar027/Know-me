/**
 * themes.js v3 — Minecraft ↔ Terminal only.
 * Exports window._mcHelpers for games.js.
 */
(function () {
  var RM = matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* ── Pixel texture generator ──────────────────────────────── */
  function mkTex(cols, ore, top) {
    var c = document.createElement("canvas");
    c.width = c.height = 16;
    var x = c.getContext("2d");
    for (var i = 0; i < 16; i++)
      for (var j = 0; j < 16; j++) {
        x.fillStyle = cols[Math.random() * cols.length | 0];
        x.fillRect(i, j, 1, 1);
      }
    if (ore) for (var i = 0; i < 7; i++) {
      x.fillStyle = ore;
      x.fillRect(Math.random() * 13 | 0, Math.random() * 13 | 0, 2, 2);
    }
    if (top) for (var i = 0; i < 16; i++) {
      var h = 3 + (Math.random() * 2 | 0);
      for (var j = 0; j < h; j++) {
        x.fillStyle = top[Math.random() * top.length | 0];
        x.fillRect(i, j, 1, 1);
      }
    }
    return c.toDataURL();
  }

  var DC = ["#866043","#7a5539","#6d4b32","#8f6a4b"];
  var SC = ["#7d7d7d","#858585","#707070","#8b8b8b"];
  var GC = ["#5fa83a","#6bb544","#559b33"];

  var BLOCKS = {
    dirt:    { c: DC },
    stone:   { c: SC },
    coal:    { c: SC, o: "#222" },
    iron:    { c: SC, o: "#d8af93" },
    gold:    { c: SC, o: "#fcee4b" },
    diamond: { c: SC, o: "#33ebcb" },
    grass:   { c: DC }
  };
  for (var k in BLOCKS)
    BLOCKS[k].u = (k === "grass") ? mkTex(DC, null, GC) : mkTex(BLOCKS[k].c, BLOCKS[k].o || null);

  var R = document.documentElement.style;
  R.setProperty("--dirt",  "url(" + BLOCKS.dirt.u  + ")");
  R.setProperty("--grass", "url(" + BLOCKS.grass.u + ")");
  window._mcBlocks = BLOCKS;

  /* ── Creeper face ─────────────────────────────────────────── */
  var cc = document.createElement("canvas");
  cc.width = cc.height = 8;
  var cx = cc.getContext("2d");
  ["GGGGGGGG","GGGGGGGG","GKKGGKKG","GKKGGKKG","GGGKKGGG","GGKKKKGG","GGKKKKGG","GGKGGKGG"]
    .forEach(function (row, y) {
      for (var xi = 0; xi < 8; xi++) {
        cx.fillStyle = row[xi] === "K" ? "#0a0a0a" : GC[Math.random() * 3 | 0];
        cx.fillRect(xi, y, 1, 1);
      }
    });
  var CREEPER_URL = cc.toDataURL();
  window._creeperUrl = CREEPER_URL;

  /* ── Helpers ──────────────────────────────────────────────── */
  function $(id) { return document.getElementById(id); }
  var snd = false, AC;

  function beep(f, d, type) {
    if (!snd) return;
    try {
      AC = AC || new AudioContext();
      var o = AC.createOscillator(), g = AC.createGain();
      o.type = type || "square"; o.frequency.value = f; g.gain.value = .05;
      o.connect(g); g.connect(AC.destination);
      o.start(); o.stop(AC.currentTime + d);
    } catch (e) {}
  }

  function burst(px, py, cols, n) {
    for (var i = 0; i < n; i++) {
      var el = document.createElement("div");
      var dx = (Math.random() - .5) * 200, dy = -30 - Math.random() * 90;
      el.style.cssText = "position:fixed;width:8px;height:8px;border-radius:50%;z-index:700;"
        + "pointer-events:none;left:" + px + "px;top:" + py + "px;"
        + "background:" + cols[Math.random() * cols.length | 0];
      document.body.appendChild(el);
      el.animate([
        { transform:"translate(0,0)", opacity:1 },
        { transform:"translate("+dx*.6+"px,"+dy+"px)", opacity:1, offset:.4 },
        { transform:"translate("+dx+"px,"+(dy+260)+"px) rotate(200deg)", opacity:0 }
      ], { duration: 800+Math.random()*300, easing:"ease-in" }).onfinish = function(){this.effect.target.remove();};
    }
  }

  function ctr(el) {
    var r = el.getBoundingClientRect();
    return [r.left + r.width/2, r.top + r.height/2];
  }

  var shown = {};
  function ach(id, title, msg) {
    if (shown[id]) return; shown[id] = 1;
    var d = document.createElement("div");
    d.className = "toast";
    d.innerHTML = "<b>" + title + "</b>" + msg;
    var t = $("toasts"); if (!t) return;
    t.appendChild(d);
    beep(660, .12);
    if (!RM) d.animate([{transform:"translateX(120%)"},{transform:"none"}],
      {duration:400,easing:"cubic-bezier(.2,1.3,.4,1)"});
    setTimeout(function(){
      if(!RM) d.animate([{opacity:1},{opacity:0}],{duration:400}).onfinish=function(){d.remove();};
      else d.remove();
    }, 4000);
  }

  /* ── MC Sky ───────────────────────────────────────────────── */
  var sky = $("mc-sky");
  if (sky) {
    for (var i = 0; i < 40; i++) {
      var s = document.createElement("div");
      s.className = "mc-star";
      s.style.left = Math.random()*100+"%"; s.style.top = Math.random()*55+"%";
      s.style.animationDelay = -Math.random()*2+"s";
      sky.appendChild(s);
    }
    var dnBtn = $("mc-night");
    if (dnBtn) dnBtn.onclick = function(){
      var n = document.body.classList.toggle("night");
      this.textContent = n ? "☀" : "🌙";
      ach("night","Sleep Tight","You changed time of day");
    };
  }

  /* ── MC Ground ────────────────────────────────────────────── */
  var gr = $("mc-ground");
  if (gr) {
    function mkGround() {
      var n = Math.ceil(innerWidth/64)+1; gr.innerHTML = "";
      for (var i=0;i<n;i++){
        var btn=document.createElement("button");
        btn.style.backgroundImage="url("+BLOCKS.grass.u+")";
        btn.style.backgroundSize="64px"; btn.tabIndex=-1;
        btn.onclick=function(){
          var c=ctr(this); burst(c[0],c[1],GC.concat(DC),14); beep(180,.08);
          this.classList.add("gone"); var self=this;
          setTimeout(function(){self.classList.remove("gone");},2500);
          ach("block","Getting Wood","You broke your first block");
        };
        gr.appendChild(btn);
      }
    }
    mkGround(); addEventListener("resize",mkGround);
  }

  /* ── MC Creeper ───────────────────────────────────────────── */
  var cr = $("mc-creeper");
  if (cr) {
    var img = cr.querySelector("img");
    if (img) img.src = CREEPER_URL;
    cr.onclick = function(){
      if (cr.classList.contains("fuse")) return;
      cr.classList.add("fuse"); beep(120,1);
      setTimeout(function(){
        var p=ctr(cr);
        burst(p[0],p[1],["#4fae3f","#5fc04c","#fff","#ffb52e","#f33"],60);
        cr.style.visibility="hidden"; document.body.classList.add("shake"); beep(70,.4);
        ach("boom","Aw Man","The creeper exploded (it respawns)");
        setTimeout(function(){
          document.body.classList.remove("shake");
          cr.classList.remove("fuse"); cr.style.visibility="";
        }, RM?50:1500);
      }, RM?50:1250);
    };
  }

  /* ── XP bar ───────────────────────────────────────────────── */
  var xpFill=$("xp-fill"), xpLvl=$("xp-level");
  function updateXP(){
    var max=document.documentElement.scrollHeight-innerHeight;
    var p=max>0?scrollY/max:0;
    if(xpFill) xpFill.style.width=p*100+"%";
    if(xpLvl)  xpLvl.textContent="LVL "+(p*30|0);
  }
  addEventListener("scroll",updateXP,{passive:true}); updateXP();

  /* ── Section achievements ─────────────────────────────────── */
  var ACHS={
    about:   ["Meet the Player","Advancement made: reading the lore"],
    projects:["Inventory Check","Real projects found"],
    skills:  ["Skill Tree","Abilities unlocked"],
    code:    ["Compiling...","Your code window is ready"],
    games:   ["Game Room","Pick a game. Set a high score."],
    contact: ["Social Network","Say hi to the player"],
  };
  var secObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting&&ACHS[e.target.id])
        ach(e.target.id,ACHS[e.target.id][0],ACHS[e.target.id][1]);
    });
  },{threshold:.25});
  Object.keys(ACHS).forEach(function(id){var el=$(id);if(el)secObs.observe(el);});

  /* ── Terminal matrix rain ─────────────────────────────────── */
  var rainCv=$("mc-rain"), rainTimer;
  function startRain(){
    if(!rainCv)return;
    rainCv.style.display="block";
    rainCv.width=rainCv.parentElement?rainCv.parentElement.clientWidth:innerWidth;
    rainCv.height=rainCv.parentElement?rainCv.parentElement.clientHeight:innerHeight;
    var rx=rainCv.getContext("2d"),n=Math.floor(rainCv.width/16),d=[];
    for(var i=0;i<n;i++) d[i]=-(Math.random()*40|0);
    clearInterval(rainTimer);
    rainTimer=setInterval(function(){
      rx.fillStyle="rgba(2,11,5,.12)"; rx.fillRect(0,0,rainCv.width,rainCv.height);
      rx.fillStyle="#39ff14"; rx.font="14px monospace";
      for(var i=0;i<n;i++){
        rx.fillText(String.fromCharCode(12448+(Math.random()*90|0)),i*16,d[i]*16);
        if(d[i]*16>rainCv.height&&Math.random()>.975)d[i]=0;
        d[i]++;
      }
    },60);
  }
  function stopRain(){clearInterval(rainTimer);if(rainCv)rainCv.style.display="none";}

  /* ── Theme switcher (2 themes only) ──────────────────────── */
  var THEMES=[
    {id:"minecraft",label:"⛏ Minecraft",color:"#7ef542"},
    {id:"terminal", label:"💻 Terminal", color:"#39ff14"},
  ];
  var tIdx=0;

  function applyTheme(name,quiet){
    tIdx=THEMES.findIndex(function(t){return t.id===name;});
    if(tIdx<0)tIdx=0;
    var th=THEMES[tIdx];
    if(th.id==="minecraft") document.body.removeAttribute("data-theme");
    else document.body.setAttribute("data-theme",th.id);
    var btn=$("theme-btn"); if(btn) btn.textContent=th.label;
    if(th.id==="terminal")startRain();else stopRain();

    // Show correct game section
    var mcG=$("mc-games"), trG=$("term-games");
    if(mcG)  mcG.style.display =(th.id==="minecraft")?"":"none";
    if(trG)  trG.style.display =(th.id==="terminal") ?"":"none";

    var bar=$("progress-bar");
    if(bar) bar.style.background="linear-gradient(90deg,"+th.color+",#ffe14d)";
    try{localStorage.setItem("hsk_pf_theme_v2",th.id);}catch(e){}
    if(!quiet) ach("th"+tIdx,"New Dimension",th.label+" theme loaded");
  }

  var thBtn=$("theme-btn");
  if(thBtn) thBtn.addEventListener("click",function(){
    applyTheme(THEMES[(tIdx+1)%THEMES.length].id);
  });

  var saved="minecraft";
  try{saved=localStorage.getItem("hsk_pf_theme_v2")||"minecraft";}catch(e){}
  if(saved!=="terminal") saved="minecraft";
  applyTheme(saved,true);

  /* ── Sound toggle ─────────────────────────────────────────── */
  var sndBtn=$("mc-sound");
  if(sndBtn) sndBtn.addEventListener("click",function(){
    snd=!snd; this.textContent=snd?"🔊":"🔇";
    if(snd)beep(440,.1);
  });

  /* ── Shake keyframe ───────────────────────────────────────── */
  var st=document.createElement("style");
  st.textContent="@keyframes shake{20%{transform:translate(-12px,6px)}40%{transform:translate(10px,-8px)}60%{transform:translate(-8px,-6px)}80%{transform:translate(6px,8px)}}body.shake{animation:shake .5s}";
  document.head.appendChild(st);

  /* ── Export for games.js ─────────────────────────────────── */
  window._h={beep:beep,burst:burst,ctr:ctr,ach:ach,BLOCKS:BLOCKS,CREEPER_URL:CREEPER_URL,RM:RM,GC:GC,DC:DC};
})();
