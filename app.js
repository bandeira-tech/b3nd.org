/* ============================================================
 *  b3nd.org · app behaviors
 *  --------------------------------------------------------------
 *    - mode toggle (dark / light), persisted in localStorage
 *    - signup form: progressive-enhanced, posts to /api/signup
 *    - scroll reveal via IntersectionObserver
 *    - reduce-motion respected
 * ============================================================ */
(function () {
  "use strict";

  const STORE_KEY = "b3nd.mode";
  const root = document.documentElement;

  /* ---------- mode ---------- */
  const stored = (() => {
    try { return localStorage.getItem(STORE_KEY); } catch (_) { return null; }
  })();
  if (stored === "light" || stored === "dark") {
    root.dataset.mode = stored;
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.dataset.mode = "light";
  }
  syncModeButton();

  document.querySelectorAll('[data-action="toggle-mode"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = root.dataset.mode === "dark" ? "light" : "dark";
      root.dataset.mode = next;
      try { localStorage.setItem(STORE_KEY, next); } catch (_) {}
      syncModeButton();
    });
  });

  function syncModeButton() {
    const mode = root.dataset.mode || "dark";
    document.querySelectorAll(".mode-toggle .mode-label").forEach((el) => {
      el.textContent = mode;
    });
  }

  /* ---------- signup form ---------- */
  document.querySelectorAll('[data-form="signup"]').forEach((form) => {
    form.addEventListener("submit", async (evt) => {
      evt.preventDefault();
      const input = form.querySelector('input[name="email"]');
      const note = form.querySelector('[data-form-note]');
      const btn  = form.querySelector('button[type="submit"]');
      const email = (input && input.value || "").trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setNote(note, "that doesn't look like an email", "error");
        if (input) input.focus();
        return;
      }
      btn && btn.setAttribute("disabled", "true");
      setNote(note, "sending…", "");
      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { "content-type": "application/json", "accept": "application/json" },
          body: JSON.stringify({ email, src: location.pathname + location.hash })
        });
        if (res.ok) {
          form.classList.add("is-sent");
          setNote(note, "you're on the list. we'll be in touch.", "success");
          if (input) input.value = "";
        } else {
          let msg = "something went sideways. try again?";
          try {
            const j = await res.json();
            if (j && j.error) msg = j.error;
          } catch (_) {}
          setNote(note, msg, "error");
        }
      } catch (err) {
        setNote(note, "network hiccup. try again?", "error");
      } finally {
        btn && btn.removeAttribute("disabled");
      }
    });
  });

  function setNote(el, text, cls) {
    if (!el) return;
    el.textContent = text;
    el.classList.remove("success", "error");
    if (cls) el.classList.add(cls);
  }

  /* ---------- scroll reveal ---------- */
  if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const sections = [
      ".section-head", ".section-title", ".section-lede",
      ".shift-claim", ".shift-paragraphs", ".shift-pillars li",
      ".aud-card", ".arch-card", ".proof-card",
      ".community-copy", ".community-list",
      ".cta-eyebrow", ".cta-title", ".cta-lede", ".signal-form-lg"
    ].join(",");
    document.querySelectorAll(sections).forEach((el, i) => {
      el.setAttribute("data-reveal", "");
      el.style.transitionDelay = (i % 6) * 60 + "ms";
    });
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
      document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    } else {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
    }
  }
})();
