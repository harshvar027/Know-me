/**
 * skills-challenge.js
 * Terminal mode: fake zsh tasks (type the right command).
 * Minecraft mode: MC trivia quiz on skills.
 */
(function () {
  /* ─── TERMINAL: ZSH Challenge ──────────────────────────────── */
  var TERM_TASKS = [
    { q: "Navigate into a directory named 'harsh'",      a: ["cd harsh", "cd ./harsh"], hint: "cd <dirname>" },
    { q: "Create a directory named 'harsh'",             a: ["mkdir harsh", "mkdir ./harsh"], hint: "mkdir <dirname>" },
    { q: "List all files including hidden ones",         a: ["ls -a", "ls -la", "ls -al"], hint: "ls -?" },
    { q: "Print the current working directory",          a: ["pwd"], hint: "p-w-d" },
    { q: "Create an empty file named 'index.js'",        a: ["touch index.js"], hint: "touch <filename>" },
    { q: "Show the last 10 lines of 'app.log'",          a: ["tail app.log", "tail -n 10 app.log", "tail -10 app.log"], hint: "tail <file>" },
    { q: "Check the git status of current repo",         a: ["git status"], hint: "git ?" },
    { q: "Install npm packages from package.json",       a: ["npm install", "npm i"], hint: "npm ?" },
    { q: "Echo 'Hello World' to the terminal",           a: ["echo 'Hello World'", 'echo "Hello World"', "echo Hello World"], hint: "echo '...'" },
    { q: "Remove a file named 'temp.txt'",               a: ["rm temp.txt", "rm ./temp.txt"], hint: "rm <file>" },
  ];

  var tIdx = 0, tScore = 0, tTotal = TERM_TASKS.length;
  var tInput = document.getElementById("zsh-input");
  var tPrompt = document.getElementById("zsh-prompt");
  var tFeedback = document.getElementById("zsh-feedback");
  var tScore$ = document.getElementById("zsh-score");
  var tTask$ = document.getElementById("zsh-task");
  var tHint$ = document.getElementById("zsh-hint");
  var tProgress = document.getElementById("zsh-progress");

  function loadTask() {
    if (!tTask$) return;
    if (tIdx >= tTotal) {
      tTask$.textContent = "🎉 All tasks complete!";
      if (tInput) { tInput.value = ""; tInput.disabled = true; }
      if (tHint$) tHint$.textContent = "";
      if (tProgress) tProgress.style.width = "100%";
      return;
    }
    var t = TERM_TASKS[tIdx];
    if (tTask$) tTask$.textContent = t.q;
    if (tHint$) tHint$.textContent = "";
    if (tFeedback) { tFeedback.textContent = ""; tFeedback.className = "zsh-feedback"; }
    if (tProgress) tProgress.style.width = (tIdx / tTotal * 100) + "%";
    if (tInput) { tInput.value = ""; tInput.disabled = false; tInput.focus(); }
  }

  if (tInput) {
    loadTask();
    tInput.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var val = tInput.value.trim().toLowerCase();
      var t = TERM_TASKS[tIdx];
      var correct = t.a.some(function (ans) { return val === ans.toLowerCase(); });

      if (correct) {
        tScore++; tIdx++;
        if (tScore$) tScore$.textContent = tScore;
        if (tFeedback) { tFeedback.textContent = "✓ Correct!"; tFeedback.className = "zsh-feedback ok"; }
        setTimeout(loadTask, 700);
      } else {
        if (tFeedback) { tFeedback.textContent = "✗ Try again — hint: " + t.hint; tFeedback.className = "zsh-feedback err"; }
        tInput.select();
      }
    });
  }

  var tReset = document.getElementById("zsh-reset");
  if (tReset) tReset.onclick = function () {
    tIdx = 0; tScore = 0;
    if (tScore$) tScore$.textContent = 0;
    if (tInput) tInput.disabled = false;
    loadTask();
  };

  /* ─── MINECRAFT: Skill Trivia ──────────────────────────────── */
  var MC_QUIZ = [
    {
      q: "You want to add click animation to a button. Which CSS property do you use?",
      opts: ["transform: scale()", "display: flex", "margin: auto", "opacity: 0"],
      ans: 0, skill: "CSS3"
    },
    {
      q: "Which React hook lets you run code after the component renders?",
      opts: ["useState", "useEffect", "useRef", "useCallback"],
      ans: 1, skill: "React"
    },
    {
      q: "In Python, which keyword starts a function definition?",
      opts: ["func", "function", "def", "fn"],
      ans: 2, skill: "Python"
    },
    {
      q: "What does `git stash` do?",
      opts: ["Deletes commits", "Saves uncommitted changes temporarily", "Pushes to remote", "Creates a branch"],
      ans: 1, skill: "Git"
    },
    {
      q: "In C++, which container gives O(1) average lookup?",
      opts: ["vector", "list", "unordered_map", "set"],
      ans: 2, skill: "C++"
    },
    {
      q: "What does `docker ps` show?",
      opts: ["Running containers", "All images", "Port bindings", "Volumes"],
      ans: 0, skill: "Docker"
    },
    {
      q: "In Tailwind, which class centers items horizontally in a flex container?",
      opts: ["items-center", "justify-center", "flex-center", "place-center"],
      ans: 1, skill: "Tailwind"
    },
    {
      q: "In JavaScript, `===` checks…",
      opts: ["Value only", "Type only", "Value AND type", "Reference"],
      ans: 2, skill: "JavaScript"
    },
  ];

  var qIdx = 0, qScore = 0;
  var qText = document.getElementById("mc-q-text");
  var qOpts = document.getElementById("mc-q-opts");
  var qFb   = document.getElementById("mc-q-fb");
  var qSc   = document.getElementById("mc-q-score");
  var qSkill= document.getElementById("mc-q-skill");
  var qProg = document.getElementById("mc-q-progress");
  var qNext = document.getElementById("mc-q-next");

  function loadQ() {
    if (!qText) return;
    if (qIdx >= MC_QUIZ.length) {
      qText.textContent = "Quest complete! You answered " + qScore + "/" + MC_QUIZ.length + " correctly.";
      if (qOpts) qOpts.innerHTML = "";
      if (qFb)   qFb.textContent = "";
      if (qSkill) qSkill.textContent = "";
      if (qNext)  qNext.style.display = "none";
      if (qProg)  qProg.style.width = "100%";
      return;
    }
    var q = MC_QUIZ[qIdx];
    if (qText)  qText.textContent = q.q;
    if (qSkill) qSkill.textContent = "Skill: " + q.skill;
    if (qFb)    { qFb.textContent = ""; qFb.className = "mc-q-fb"; }
    if (qNext)  qNext.style.display = "none";
    if (qProg)  qProg.style.width = (qIdx / MC_QUIZ.length * 100) + "%";

    if (qOpts) {
      qOpts.innerHTML = q.opts.map(function (opt, i) {
        return '<button class="mc-q-opt game-btn" data-i="' + i + '" type="button">' + opt + '</button>';
      }).join("");
      qOpts.querySelectorAll(".mc-q-opt").forEach(function (btn) {
        btn.onclick = function () {
          var chosen = +this.dataset.i;
          var correct = chosen === q.ans;
          qOpts.querySelectorAll(".mc-q-opt").forEach(function (b, bi) {
            b.disabled = true;
            if (bi === q.ans) b.classList.add("correct");
            else if (bi === chosen && !correct) b.classList.add("wrong");
          });
          if (correct) {
            qScore++;
            if (qSc) qSc.textContent = qScore;
            if (qFb) { qFb.textContent = "✓ Correct! +1 XP"; qFb.className = "mc-q-fb ok"; }
          } else {
            if (qFb) { qFb.textContent = "✗ Wrong — the answer was: " + q.opts[q.ans]; qFb.className = "mc-q-fb err"; }
          }
          if (qNext) qNext.style.display = "";
        };
      });
    }
  }

  if (qNext) {
    qNext.onclick = function () { qIdx++; loadQ(); };
    loadQ();
  }

  var qReset = document.getElementById("mc-q-reset");
  if (qReset) qReset.onclick = function () { qIdx = 0; qScore = 0; if (qSc) qSc.textContent = 0; loadQ(); };

})();
