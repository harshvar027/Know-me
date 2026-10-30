/**
 * contact.js — contact form validation and submission feedback.
 * No real backend; shows a success toast.
 */
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  function toast(msg, ok) {
    const t = document.createElement("div");
    t.style.cssText = `
      position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(20px);
      background:${ok ? "rgba(126,245,66,.15)" : "rgba(255,90,90,.15)"};
      border:1px solid ${ok ? "rgba(126,245,66,.4)" : "rgba(255,90,90,.4)"};
      color:${ok ? "#7ef542" : "#ff7070"};
      padding:12px 24px; border-radius:99px; font-size:14px; font-weight:600;
      backdrop-filter:blur(12px); z-index:9999;
      transition: transform .4s, opacity .4s;
    `;
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => {
      t.style.transform = "translateX(-50%) translateY(0)";
    });
    setTimeout(() => {
      t.style.opacity = "0";
      t.style.transform = "translateX(-50%) translateY(20px)";
      setTimeout(() => t.remove(), 400);
    }, 3400);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      toast("Please fill every field.", false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      toast("Enter a valid email address.", false);
      return;
    }
    // Simulate send
    const btn = form.querySelector("[type=submit]");
    btn.disabled = true;
    btn.textContent = "Sending…";
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.textContent = "Send message";
      toast("Message sent! I'll reply soon 🚀", true);
    }, 900);
  });
})();
