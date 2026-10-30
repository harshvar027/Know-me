/**
 * preview.js v2 — "Live Preview" modal.
 * Most production sites block iframes via X-Frame-Options / CSP.
 * Strategy: show a styled modal with the URL, favicon, Open button,
 * and attempt to load in an iframe; if it fails (onload fires but
 * src is blank due to blocked), show a friendly "blocked" message
 * with a big "Open in new tab" button instead.
 */
(function () {
  // Inject modal HTML
  const modal = document.createElement("div");
  modal.id = "preview-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Website preview");
  modal.innerHTML = `
    <div class="preview-window">
      <div class="preview-chrome">
        <div class="preview-chrome__dots">
          <span class="preview-chrome__dot preview-chrome__dot--r" id="pv-close" title="Close"></span>
          <span class="preview-chrome__dot preview-chrome__dot--y"></span>
          <span class="preview-chrome__dot preview-chrome__dot--g"></span>
        </div>
        <div class="preview-url-bar">
          <span class="preview-url-scheme">https://</span>
          <span class="preview-url-host" id="pv-host">—</span>
        </div>
        <div class="preview-chrome__actions">
          <button class="preview-chrome__action" id="pv-open" type="button">↗ Open</button>
        </div>
      </div>
      <div class="preview-iframe-wrap" id="pv-wrap">
        <div class="preview-loading" id="pv-loading">
          <div class="preview-spinner"></div>
          <span>Loading…</span>
        </div>
        <div class="preview-blocked" id="pv-blocked" style="display:none;">
          <div class="preview-blocked__icon">🔒</div>
          <p class="preview-blocked__title">Preview blocked</p>
          <p class="preview-blocked__sub">This site prevents embedding for security reasons.</p>
          <a id="pv-blocked-link" href="#" target="_blank" rel="noopener" class="preview-blocked__btn">Open <span id="pv-blocked-host"></span> ↗</a>
        </div>
        <iframe id="pv-frame" title="Website preview"
          sandbox="allow-scripts allow-same-origin allow-forms"
          referrerpolicy="no-referrer"></iframe>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const frame    = document.getElementById("pv-frame");
  const hostEl   = document.getElementById("pv-host");
  const loading  = document.getElementById("pv-loading");
  const blocked  = document.getElementById("pv-blocked");
  const bLink    = document.getElementById("pv-blocked-link");
  const bHost    = document.getElementById("pv-blocked-host");
  let currentUrl = "";
  let checkTimer;

  function openPreview(url, label) {
    currentUrl = url;
    const host = label || url.replace(/^https?:\/\//,"").split("/")[0];
    hostEl.textContent = host;
    bHost.textContent  = host;
    bLink.href         = url;

    // Reset state
    loading.style.display = "flex";
    blocked.style.display = "none";
    frame.style.display   = "block";
    frame.src = "";

    modal.classList.add("open");
    document.body.style.overflow = "hidden";

    // Give iframe 1.5s to load; if still no content, assume blocked
    clearTimeout(checkTimer);
    setTimeout(() => { frame.src = url; }, 80);
    checkTimer = setTimeout(checkBlocked, 2800);
  }

  function checkBlocked() {
    // Try to detect empty iframe (blocked site = contentDocument is empty or throws)
    try {
      const doc = frame.contentDocument;
      if (!doc || !doc.body || doc.body.innerHTML === "") showBlocked();
      else loading.style.display = "none";
    } catch (e) {
      showBlocked();
    }
  }

  function showBlocked() {
    loading.style.display = "none";
    frame.style.display   = "none";
    blocked.style.display = "flex";
  }

  frame.addEventListener("load", () => {
    clearTimeout(checkTimer);
    // Short delay then check again
    setTimeout(checkBlocked, 400);
  });

  function closePreview() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    clearTimeout(checkTimer);
    setTimeout(() => { frame.src = "about:blank"; }, 350);
  }

  document.getElementById("pv-close").addEventListener("click", closePreview);
  document.getElementById("pv-open").addEventListener("click", () => {
    if (currentUrl) window.open(currentUrl, "_blank", "noopener");
  });

  modal.addEventListener("click", (e) => { if (e.target === modal) closePreview(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closePreview();
  });

  window.openPreview = openPreview;
})();
