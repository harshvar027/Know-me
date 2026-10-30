/**
 * games.js — All mini-games for Nst-Poetfolio
 *
 * Minecraft theme:
 *   1. Creeper Whack — whack-a-mole with creepers (30 s)
 *   2. Dig Deep     — mine blocks, find diamond
 *
 * Terminal theme:
 *   1. Hacker Typer — type anything, fill a fake terminal output
 *   2. Matrix Zap   — click falling matrix characters to "intercept" them
 */
(function () {
  var h = window._h || {};
  var beep = h.beep || function(){};
  var burst = h.burst || function(){};
  var ctr = h.ctr || function(el){var r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2];};
  var ach = h.ach || function(){};
  var BLOCKS = h.BLOCKS || {};
  var CREEPER_URL = h.CREEPER_URL || "";
  var RM = h.RM || false;
  var GC = h.GC || ["#5fa83a"];
  var DC = h.DC || ["#866043"];

  function $(id){ return document.getElementById(id); }

  /* ════════════════════════════════════════════════════════════
     GAME 1 (MC): CREEPER WHACK
  ═══════════════════════════════════════════════════════════ */
  var whackHoles = [], whackScore=0, whackTime=30, whackRun=false, whackBest=0, whackTickL, whackSpawnT;
  try { whackBest = +localStorage.getItem("hsk_wb")||0; } catch(e){}

  function initWhack(){
    var grid = $("wh-grid"); if(!grid) return;
    $("wh-best").textContent = whackBest;
    for(var i=0;i<9;i++){
      var h2=document.createElement("button");
      h2.className="wh-hole"; h2.type="button";
      h2.setAttribute("aria-label","Hole "+(i+1));
      // set dirt texture background if available
      if(BLOCKS.dirt && BLOCKS.dirt.u) {
        h2.style.backgroundImage = "url("+BLOCKS.dirt.u+")";
        h2.style.backgroundSize = "48px";
        h2.style.imageRendering = "pixelated";
      }
      h2.innerHTML='<img alt="" src="'+CREEPER_URL+'" style="width:70%;position:absolute;left:15%;bottom:0;transform:translateY(105%);transition:transform .1s;image-rendering:pixelated;">';
      h2.onclick=function(){
        if(!whackRun||!this.classList.contains("up"))return;
        this.classList.remove("up"); this.classList.add("hit");
        var c=ctr(this); var self=this;
        setTimeout(function(){self.classList.remove("hit");},120);
        whackScore++; $("wh-score").textContent=whackScore;
        burst(c[0],c[1],GC,10); beep(520+whackScore*8,.06);
      };
      grid.appendChild(h2); whackHoles.push(h2);
    }
  }

  function whackPop(){
    if(!whackRun)return;
    var h2=whackHoles[Math.random()*9|0];
    if(!h2.classList.contains("up")){
      h2.classList.add("up");
      var img=h2.querySelector("img");
      if(img) img.style.transform="translateY(8%)";
      setTimeout(function(){
        h2.classList.remove("up");
        if(img) img.style.transform="translateY(105%)";
      },Math.max(450,950-(30-whackTime)*16));
    }
    whackSpawnT=setTimeout(whackPop,Math.max(280,750-(30-whackTime)*14));
  }

  var whackBtn = $("wh-go");
  if(whackBtn){
    initWhack();
    whackBtn.onclick=function(){
      whackScore=0; whackTime=30; whackRun=true;
      $("wh-score").textContent=0; $("wh-time").textContent=30;
      $("wh-msg").textContent="Go!"; this.disabled=true;
      whackPop();
      whackTickL=setInterval(function(){
        whackTime--; $("wh-time").textContent=whackTime;
        if(whackTime<=0){
          clearInterval(whackTickL); clearTimeout(whackSpawnT);
          whackRun=false;
          whackHoles.forEach(function(h2){
            h2.classList.remove("up");
            var img=h2.querySelector("img");
            if(img) img.style.transform="translateY(105%)";
          });
          whackBtn.disabled=false; whackBtn.textContent="Play again";
          var nb=whackScore>whackBest;
          if(nb){whackBest=whackScore;$("wh-best").textContent=whackBest;
            try{localStorage.setItem("hsk_wb",whackBest);}catch(e){}}
          $("wh-msg").textContent="Time's up! You hit "+whackScore+(nb?" 🏆 NEW BEST!":"");
          if(whackScore>=15) ach("whack15","Creeper Slayer","15+ creepers in one round");
          if(whackScore>=25) ach("whack25","Legend","25+ creepers — insane!");
        }
      },1000);
    };
  }

  /* ════════════════════════════════════════════════════════════
     GAME 2 (MC): DIG DEEP
  ═══════════════════════════════════════════════════════════ */
  var digInv={}, digMined=0, digCur, digHits=0, digCracks=[];
  try{digInv=JSON.parse(localStorage.getItem("hsk_inv")||"{}");
      digMined=+localStorage.getItem("hsk_mined")||0;}catch(e){}
  var DIG_ORDER=["dirt","dirt","dirt","stone","stone","stone","stone","coal","coal","iron","iron","gold","diamond"];

  function renderInv(){
    var inv=$("dig-inv"); if(!inv)return;
    var keys=Object.keys(BLOCKS).filter(function(k){return k!=="grass";});
    inv.innerHTML=keys.map(function(k){
      return '<div class="dig-slot"><div class="dig-slot-icon" style="background-image:url('+BLOCKS[k].u+');width:36px;height:36px;border:2px solid #444;image-rendering:pixelated;"></div>'
        +'<span>'+(digInv[k]||0)+'</span></div>';
    }).join("");
    var dm=$("dig-mined"); if(dm) dm.textContent=digMined;
  }

  function nextBlock(){
    digCur=DIG_ORDER[Math.random()*DIG_ORDER.length|0];
    digHits=0; digCracks=[];
    for(var i=0;i<60;i++) digCracks.push([Math.random()*16|0,Math.random()*16|0]);
    var blk=$("dig-block"); if(!blk)return;
    blk.style.backgroundImage="url("+BLOCKS[digCur].u+")";
    blk.setAttribute("aria-label","Mine "+digCur);
    var crk=$("dig-crack");
    if(crk){var cx=crk.getContext("2d");cx.clearRect(0,0,16,16);}
    var msg=$("dig-msg"); if(msg) msg.textContent=digCur;
  }

  function drawCracks(){
    var crk=$("dig-crack"); if(!crk)return;
    var cx=crk.getContext("2d"); cx.clearRect(0,0,16,16);
    cx.fillStyle="rgba(0,0,0,.6)";
    var maxH=BLOCKS[digCur]?BLOCKS[digCur].c.length+2:4;
    var n=Math.ceil(digHits/maxH*digCracks.length);
    for(var i=0;i<n;i++) cx.fillRect(digCracks[i][0],digCracks[i][1],1,1);
  }

  var digBlock=$("dig-block");
  if(digBlock){
    renderInv(); nextBlock();
    digBlock.onclick=function(){
      digHits++;
      var c=ctr(this); beep(200+digHits*30,.05);
      if(!RM) this.animate([{transform:"scale(.93)"},{transform:"none"}],{duration:120});
      var maxH=BLOCKS[digCur]?BLOCKS[digCur].c.length+2:4;
      if(digHits>=maxH){
        burst(c[0],c[1],(BLOCKS[digCur]?BLOCKS[digCur].c:[]).concat(BLOCKS[digCur]&&BLOCKS[digCur].o?[BLOCKS[digCur].o]:[]),22);
        digInv[digCur]=(digInv[digCur]||0)+1; digMined++;
        try{localStorage.setItem("hsk_inv",JSON.stringify(digInv));
            localStorage.setItem("hsk_mined",digMined);}catch(e){}
        renderInv();
        if(digCur==="diamond") ach("diamond","Diamonds!","You found a diamond 💎");
        if((digInv.diamond||0)>=5) ach("d5","Rich","5 diamonds mined");
        if(digMined>=25) ach("miner","Iron Will","25 blocks mined");
        nextBlock();
      } else { drawCracks(); var msg=$("dig-msg"); if(msg) msg.textContent=digCur+" "+digHits+"/"+maxH; }
    };
  }

  /* ════════════════════════════════════════════════════════════
     GAME 3 (Terminal): HACKER TYPER
     Type anything → a fake code terminal fills up.
     Progress bar fills; "HACK COMPLETE" when full.
  ═══════════════════════════════════════════════════════════ */
  var HACK_CODE = [
    "$ sudo nmap -sS -p 1-65535 192.168.1.0/24",
    "Starting Nmap 7.94...",
    "Scanning 256 hosts [65535 ports/host]",
    "Discovered open port 22/tcp on 192.168.1.1",
    "Discovered open port 443/tcp on 192.168.1.5",
    "$ ssh -i ~/.ssh/id_rsa root@192.168.1.5",
    "Last login: Thu Oct 29 00:12:41 2026 from 10.0.0.2",
    "root@victim:~# cat /etc/shadow | head -5",
    "root:$6$rounds=500000$salt$hash:19500:0:99999:7:::",
    "root@victim:~# python3 crack.py --wordlist rockyou.txt",
    "[###########...........] 55% — 3.2M/s",
    "PASSWORD FOUND: ██████████",
    "root@victim:~# chmod +x payload.sh && ./payload.sh",
    "[ OK ] Deploying reverse shell on port 4444...",
    "[ OK ] Persistence installed via cron",
    "Connection from 10.0.0.99 established.",
    ">>> SYSTEM COMPROMISED <<<",
    ">>> ACCESS LEVEL: ROOT <<<",
    "Exfiltrating /var/log /home /etc...",
    "Done. 2.3 GB transferred.",
    "Covering tracks... log files purged.",
    "Mission complete. Disconnecting.",
    "$ exit",
  ].join("\n");

  var hackEl=$("hacker-output"), hackProg=$("hacker-bar"), hackStatus=$("hacker-status");
  var hackPos=0, hackTotal=HACK_CODE.length, hackDone=false;

  if(hackEl){
    hackEl.textContent="";
    hackStatus.textContent="// Start typing anywhere to begin hack...";

    document.addEventListener("keydown",function(e){
      var tgt=$("term-games");
      if(!tgt||tgt.style.display==="none")return;
      if(hackDone)return;
      if(e.key.length===1||e.key==="Enter"||e.key==="Backspace"){
        if(hackPos<hackTotal){
          hackPos+=Math.floor(Math.random()*3)+1;
          if(hackPos>hackTotal)hackPos=hackTotal;
          hackEl.textContent=HACK_CODE.slice(0,hackPos);
          hackEl.scrollTop=hackEl.scrollHeight;
          var pct=hackPos/hackTotal;
          if(hackProg) hackProg.style.width=(pct*100)+"%";
          if(pct>=1){
            hackDone=true;
            hackStatus.textContent=">>> HACK COMPLETE — ACCESS GRANTED <<<";
            hackStatus.style.color="#39ff14";
            hackStatus.style.textShadow="0 0 12px #39ff14";
            ach("hack","Elite Hacker","You hacked the mainframe 💻");
          } else {
            hackStatus.textContent="// Hacking... "+(pct*100|0)+"% complete";
          }
          beep(200+hackPos%200,.02,"sine");
        }
      }
    });

    var resetHack=$("hacker-reset");
    if(resetHack) resetHack.onclick=function(){
      hackPos=0; hackDone=false;
      hackEl.textContent="";
      if(hackProg) hackProg.style.width="0%";
      hackStatus.textContent="// Start typing anywhere to begin hack...";
      hackStatus.style.color=""; hackStatus.style.textShadow="";
    };
  }

  /* ════════════════════════════════════════════════════════════
     GAME 4 (Terminal): MATRIX ZAP
     Matrix characters fall; click them to zap. 30 s timer.
  ═══════════════════════════════════════════════════════════ */
  var zapCanvas=$("zap-canvas"), zapScore=0, zapBest=0, zapRun=false, zapRaf, zapTickL;
  try{zapBest=+localStorage.getItem("hsk_zapbest")||0;}catch(e){}

  if(zapCanvas){
    var zapCtx=zapCanvas.getContext("2d");
    var ZAP_W=zapCanvas.width=zapCanvas.offsetWidth||400;
    var ZAP_H=zapCanvas.height=200;
    var COLS=Math.floor(ZAP_W/18);
    var drops=[], zapTime=30;

    for(var i=0;i<COLS;i++) drops[i]={y:Math.random()*-30|0,speed:.3+Math.random()*.5,ch:""};

    function zapChar(){ return String.fromCharCode(12448+(Math.random()*90|0)); }
    for(var i=0;i<COLS;i++) drops[i].ch=zapChar();

    function drawZap(){
      if(!zapRun) return;
      zapCtx.fillStyle="rgba(2,11,5,.18)";
      zapCtx.fillRect(0,0,ZAP_W,ZAP_H);
      for(var i=0;i<COLS;i++){
        zapCtx.fillStyle="#39ff14";
        zapCtx.font="bold 15px monospace";
        drops[i].ch=zapChar();
        zapCtx.fillText(drops[i].ch, i*18, drops[i].y*18);
        drops[i].y+=drops[i].speed;
        if(drops[i].y*18>ZAP_H) drops[i].y=-(Math.random()*20|0);
      }
      zapRaf=requestAnimationFrame(drawZap);
    }

    zapCanvas.onclick=function(e){
      if(!zapRun)return;
      var rect=zapCanvas.getBoundingClientRect();
      var mx=e.clientX-rect.left, my=e.clientY-rect.top;
      var col=Math.floor(mx/18);
      if(col>=0&&col<COLS&&Math.abs(drops[col].y*18-my)<20){
        drops[col].y=-(Math.random()*20|0);
        zapScore++; $("zap-score").textContent=zapScore;
        beep(800+col*30,.04,"sine");
        // flash
        zapCtx.fillStyle="rgba(57,255,20,.35)";
        zapCtx.fillRect(col*18,0,18,ZAP_H);
      }
    };

    var zapBtn=$("zap-go");
    if(zapBtn){
      $("zap-best").textContent=zapBest;
      zapBtn.onclick=function(){
        zapScore=0; zapTime=30; zapRun=true;
        $("zap-score").textContent=0; $("zap-time").textContent=30;
        $("zap-msg").textContent="ZAP the falling characters!"; this.disabled=true;
        drawZap();
        zapTickL=setInterval(function(){
          zapTime--; $("zap-time").textContent=zapTime;
          if(zapTime<=0){
            clearInterval(zapTickL); zapRun=false; cancelAnimationFrame(zapRaf);
            zapCtx.clearRect(0,0,ZAP_W,ZAP_H);
            zapBtn.disabled=false; zapBtn.textContent="Play again";
            var nb=zapScore>zapBest;
            if(nb){zapBest=zapScore;$("zap-best").textContent=zapBest;
              try{localStorage.setItem("hsk_zapbest",zapBest);}catch(e){}}
            $("zap-msg").textContent="Time's up! You zapped "+zapScore+(nb?" 🏆 NEW BEST!":"");
            if(zapScore>=30) ach("zap30","Neo","30+ zaps in one round");
          }
        },1000);
      };
    }
  }

})();
