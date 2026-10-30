/**
 * main.js v2 — Nst-Poetfolio
 * Cursor glow · scroll progress · navbar · reveal · active links
 * Card tilt · magnetic buttons · parallax hero · skill bar counters
 */

const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Cursor glow (smooth lerp) ────────────────────────────────────────
(function () {
  const glow = document.getElementById("cursor-glow");
  if (!glow || RM) return;

  let tx = innerWidth / 2, ty = innerHeight / 2;
  let cx = tx, cy = ty;
  let raf;

  document.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }
  function loop() {
    cx = lerp(cx, tx, 0.08);
    cy = lerp(cy, ty, 0.08);
    glow.style.left = cx + "px";
    glow.style.top  = cy + "px";
    raf = requestAnimationFrame(loop);
  }
  loop();
})();

// ── Scroll progress bar ──────────────────────────────────────────────
(function () {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  function update() {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%";
  }
  addEventListener("scroll", update, { passive: true });
  update();
})();

// ── Navbar ────────────────────────────────────────────────────────────
(function () {
  const nav  = document.querySelector(".nav");
  const ham  = document.querySelector(".nav__hamburger");
  const menu = document.querySelector(".nav__links");
  if (!nav) return;

  function onScroll() { nav.classList.toggle("scrolled", scrollY > 20); }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (ham && menu) {
    ham.addEventListener("click", () => {
      const open = ham.classList.toggle("open");
      menu.classList.toggle("open", open);
      ham.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        ham.classList.remove("open");
        menu.classList.remove("open");
        ham.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      })
    );
  }
})();

// ── Active nav link on scroll ─────────────────────────────────────────
(function () {
  const links = document.querySelectorAll(".nav__link[href^='#']");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) =>
            l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
          );
        }
      });
    },
    { rootMargin: "-35% 0px -60% 0px" }
  );
  links.forEach((l) => {
    const target = document.querySelector(l.getAttribute("href"));
    if (target) io.observe(target);
  });
})();

// ── Scroll reveal (staggered children) ───────────────────────────────
(function () {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();

// ── Card tilt (3-D perspective tilt on hover) ─────────────────────────
(function () {
  if (RM) return;

  function applyTilt(card, e) {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    const rotX = -dy * 6;
    const rotY =  dx * 6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
    // inner glow follows mouse
    const pct = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const py  = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.background = `radial-gradient(circle at ${pct}% ${py}%, rgba(180,169,255,.08), var(--glass-bg) 60%)`;
  }

  function resetTilt(card) {
    card.style.transform = "";
    card.style.background = "";
  }

  document.querySelectorAll(".proj-card, .card").forEach((card) => {
    card.addEventListener("mousemove",  (e) => applyTilt(card, e));
    card.addEventListener("mouseleave", ()  => resetTilt(card));
  });
})();

// ── Magnetic buttons ─────────────────────────────────────────────────
(function () {
  if (RM) return;
  document.querySelectorAll(".btn--primary, .btn--ghost, .nav__cta").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width  / 2);
      const dy = e.clientY - (rect.top  + rect.height / 2);
      btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
})();

// ── Hero parallax ─────────────────────────────────────────────────────
(function () {
  if (RM) return;
  const hero = document.querySelector(".hero__inner");
  if (!hero) return;
  let raf;
  addEventListener("scroll", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const y = scrollY * 0.22;
      hero.style.transform = `translateY(${y}px)`;
    });
  }, { passive: true });
})();

// ── Smooth scroll all anchors ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: RM ? "auto" : "smooth" });
    }
  });
});

// ── Skill pills: pop in with staggered scale ──────────────────────────
(function () {
  if (RM) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const pills = entry.target.querySelectorAll(".skill-pill");
        pills.forEach((p, i) => {
          p.style.transitionDelay = (i * 40) + "ms";
          p.classList.add("in");
        });
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".skills__grid").forEach((g) => io.observe(g));
})();
