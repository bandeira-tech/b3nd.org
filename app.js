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

  /* ---------- mode ----------
   * CSS defaults to dark. light requires html[data-mode="light"].
   * The blocking inline script in <head> already applied any stored
   * opt-in. We only handle the click toggle here.
   */
  syncModeButton();

  document.querySelectorAll('[data-action="toggle-mode"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const curr = root.getAttribute("data-mode") === "light" ? "light" : "dark";
      const next = curr === "dark" ? "light" : "dark";
      if (next === "light") {
        root.setAttribute("data-mode", "light");
      } else {
        root.removeAttribute("data-mode");
      }
      try { localStorage.setItem(STORE_KEY, next); } catch (_) {}
      syncModeButton();
    });
  });

  function syncModeButton() {
    const mode = root.getAttribute("data-mode") === "light" ? "light" : "dark";
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

  /* scroll reveal removed — content always rendered. */
})();
