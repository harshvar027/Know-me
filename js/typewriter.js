/**
 * typewriter.js — cycles through taglines with a typing effect.
 * Usage: attach to any element with id="typewriter"
 */
(function () {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const PHRASES = [
    "Frontend Developer",
    "Competitive Programmer",
    "Future HFT Engineer",
    "UI Craftsperson",
  ];

  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (RM) {
    el.textContent = PHRASES[0];
    return;
  }

  let pi = 0, ci = 0, dir = 1;

  function tick() {
    const word = PHRASES[pi];
    ci += dir;
    el.textContent = word.slice(0, ci);
    let delay = dir > 0 ? 72 : 38;

    if (ci === word.length) {
      dir = -1;
      delay = 1600;
    } else if (ci === 0) {
      dir = 1;
      pi = (pi + 1) % PHRASES.length;
      delay = 320;
    }
    setTimeout(tick, delay);
  }
  tick();
})();
