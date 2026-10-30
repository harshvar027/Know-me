/**
 * codewin.js — multi-language code window with syntax highlighting.
 */
(function () {
  const LANGS = [
    {
      id: "js", label: "JavaScript", file: "harshvardhan.js",
      code: `<span class="tok-c">// who am I?</span>
<span class="tok-k">const</span> <span class="tok-n">harshvardhan</span> = {
  name:        <span class="tok-s">"Harshvardhan Singh Shekhawat"</span>,
  from:        <span class="tok-s">"Jaipur, Rajasthan"</span>,
  batch:       [<span class="tok-s">"Hopper"</span>, <span class="tok-s">"Compiler"</span>],
  building:    [<span class="tok-s">"frontends"</span>, <span class="tok-s">"real web apps"</span>],
  practising:  <span class="tok-s">"competitive programming"</span>,
  goal:        <span class="tok-s">"SDE at a high-frequency trading firm"</span>,
};

<span class="tok-n">console</span>.<span class="tok-f">log</span>(harshvardhan.goal);<span class="tok-cursor"></span>`,
    },
    {
      id: "py", label: "Python", file: "harshvardhan.py",
      code: `<span class="tok-c"># who am I?</span>
harshvardhan = {
    <span class="tok-s">"name"</span>:       <span class="tok-s">"Harshvardhan Singh Shekhawat"</span>,
    <span class="tok-s">"from"</span>:       <span class="tok-s">"Jaipur, Rajasthan"</span>,
    <span class="tok-s">"batch"</span>:      [<span class="tok-s">"Hopper"</span>, <span class="tok-s">"Compiler"</span>],
    <span class="tok-s">"building"</span>:   [<span class="tok-s">"frontends"</span>, <span class="tok-s">"real web apps"</span>],
    <span class="tok-s">"practising"</span>: <span class="tok-s">"competitive programming"</span>,
    <span class="tok-s">"goal"</span>:       <span class="tok-s">"SDE at a high-frequency trading firm"</span>,
}

<span class="tok-f">print</span>(harshvardhan[<span class="tok-s">"goal"</span>])<span class="tok-cursor"></span>`,
    },
    {
      id: "cpp", label: "C++", file: "harshvardhan.cpp",
      code: `<span class="tok-c">// who am I?</span>
<span class="tok-k">#include</span> <span class="tok-s">&lt;iostream&gt;</span>
<span class="tok-k">#include</span> <span class="tok-s">&lt;map&gt;</span>
<span class="tok-k">#include</span> <span class="tok-s">&lt;string&gt;</span>

<span class="tok-k">int</span> <span class="tok-f">main</span>() {
  std::map&lt;std::string, std::string&gt; me = {
    {<span class="tok-s">"name"</span>, <span class="tok-s">"Harshvardhan Singh Shekhawat"</span>},
    {<span class="tok-s">"goal"</span>, <span class="tok-s">"SDE at a high-frequency trading firm"</span>},
  };
  std::cout &lt;&lt; me[<span class="tok-s">"goal"</span>] &lt;&lt; <span class="tok-s">"\\n"</span>;
}<span class="tok-cursor"></span>`,
    },
    {
      id: "rs", label: "Rust", file: "harshvardhan.rs",
      code: `<span class="tok-c">// who am I?</span>
<span class="tok-k">use</span> std::collections::HashMap;

<span class="tok-k">fn</span> <span class="tok-f">main</span>() {
  <span class="tok-k">let</span> me = HashMap::from([
    (<span class="tok-s">"name"</span>,       <span class="tok-s">"Harshvardhan Singh Shekhawat"</span>),
    (<span class="tok-s">"practising"</span>, <span class="tok-s">"competitive programming"</span>),
    (<span class="tok-s">"goal"</span>,       <span class="tok-s">"SDE at a high-frequency trading firm"</span>),
  ]);
  <span class="tok-f">println!</span>(<span class="tok-s">"{}"</span>, me[<span class="tok-s">"goal"</span>]);
}<span class="tok-cursor"></span>`,
    },
  ];

  const tabsEl = document.getElementById("codewin-tabs");
  const bodyEl = document.getElementById("codewin-body");
  const fileEl = document.getElementById("codewin-file");
  if (!tabsEl || !bodyEl) return;

  let current = 0;
  let autoTimer;
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function render(i) {
    current = i;
    const lang = LANGS[i];
    fileEl && (fileEl.textContent = lang.file);
    bodyEl.innerHTML = "<pre>" + lang.code + "</pre>";
    tabsEl.querySelectorAll(".codewin__tab").forEach((b, j) =>
      b.setAttribute("aria-selected", j === i)
    );
  }

  // Build tabs
  LANGS.forEach((lang, i) => {
    const btn = document.createElement("button");
    btn.className = "codewin__tab";
    btn.type = "button";
    btn.textContent = lang.label;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", i === 0);
    btn.addEventListener("click", () => {
      clearInterval(autoTimer);
      render(i);
    });
    tabsEl.appendChild(btn);
  });

  render(0);

  // Copy button
  const copyBtn = document.getElementById("codewin-copy");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const text = bodyEl.querySelector("pre")?.textContent || "";
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = "Copied!";
        copyBtn.style.borderColor = "var(--c-green)";
        copyBtn.style.color = "var(--c-green)";
        setTimeout(() => {
          copyBtn.textContent = "Copy";
          copyBtn.style.borderColor = "";
          copyBtn.style.color = "";
        }, 1800);
      }).catch(() => {
        copyBtn.textContent = "Select + copy";
        setTimeout(() => { copyBtn.textContent = "Copy"; }, 2000);
      });
    });
  }

  // Auto-rotate unless reduced motion
  if (!RM) {
    autoTimer = setInterval(() => {
      if (!document.hidden) render((current + 1) % LANGS.length);
    }, 6500);
  }
})();
