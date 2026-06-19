/* ============================================================
 * b3nd brand · canonical upgrade layer
 * ------------------------------------------------------------
 * Wraps each character of a multi-character <b-3> into a span so
 * the D5 locked treatment (3 at 137 %, hung 0.27 em) can apply
 * via CSS targeting .b3nd-3. Standalone marks <b-3>3</b-3> are
 * left untouched — the hang is a property of the wordmark
 * composition, not of the glyph itself.
 *
 * Static (no-JS) rendering: the unicode-range swap in b3nd.css
 * still gives the 3 the logo font; only the size/hang fall back
 * to in-line, same-size. That's the canonical degraded state.
 *
 * Loading:
 *   <script defer src="/brand/b3nd.js"></script>
 *
 * Plain (non-module) script so the page also works when opened via
 * file:// (browsers block ES module loading from the file: scheme).
 *
 * Decision ledger: see /DECISIONS.md (D1, D2, D3, D4, D5)
 * ============================================================ */

class B3 extends HTMLElement {
  connectedCallback() {
    if (this.dataset.upgraded) return;
    // Standalone glyph (e.g. <b-3>3</b-3>): a single text char, no element
    // children. Per D5 the hang is a wordmark property, not a glyph
    // property — leave it alone.
    if (this.children.length === 0 && (this.textContent || "").trim().length <= 1) return;
    this.dataset.upgraded = "1";

    // Walk the original child nodes so author-supplied elements survive
    // (e.g. <b-3>b3n<span style="transform:translateY(.18em)">d</span></b-3>).
    // Text nodes get split per character and wrapped; element nodes are
    // passed through, tagged with .b3nd-3 or .b3nd-letter so the CSS lands.
    const frag = document.createDocumentFragment();
    let i = 0;
    const tag = (el, char) => {
      const isAnchor = char === "3";
      if (!el.classList.contains("b3nd-3") && !el.classList.contains("b3nd-letter")) {
        el.classList.add(isAnchor ? "b3nd-3" : "b3nd-letter");
      }
      el.dataset.role = isAnchor ? "anchor" : "var";
      el.dataset.i = String(i++);
    };
    for (const node of [...this.childNodes]) {
      if (node.nodeType === Node.TEXT_NODE) {
        for (const c of node.textContent) {
          if (!c.trim()) continue;
          const s = document.createElement("span");
          s.textContent = c;
          tag(s, c);
          frag.appendChild(s);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        tag(node, (node.textContent || "").trim());
        frag.appendChild(node);
      }
    }
    this.replaceChildren(frag);
  }
}

if (!customElements.get("b-3")) customElements.define("b-3", B3);
