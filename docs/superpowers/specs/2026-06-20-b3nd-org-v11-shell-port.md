# v11 — port b3nd.org into the canonical brand webshell

Date: 2026-06-20
Status: implemented in `/v11.html`, **not yet promoted to `/`** (v10 at
`/index.html` remains the live page until the user signs off).

## Premise

The v10 page (`/index.html`) was hand-rolled — its own chrome, its own
tokens, its own theme contract (`localStorage 'b3nd.mode'` +
`html[data-mode]`). The canonical brand design system lives at
`~/ws/b3nd-brand/webshell/shell.html` and ships everything the page
should be reading from: tokens, chrome, scroll-snap panel grammar,
type scale (`.h-display/.h-1/.h-2/.h-3/.lede/.body/.mute`),
components (`.btn`, `.pill`, `.card`, `pre.code`, `.demo`, `.swatch`,
`.stub`), a runtime (panel registry + crumb sync + tier rail + deep
linking + keyboard nav), and a theme contract (`localStorage
'b3nd-theme'` + `html[data-theme]`, asymmetric dark/light per D6/D7).

`/v11.html` is the v10 narrative rebuilt **inside** that shell, applied
to the letter for everything the shell ships. v10's content stays
preserved at `/` until the user wants to swap them.

## Mapping — v10 beats → v11 panels

| v10 beat | v11 panel | tier   | shell primitive used |
|----------|-----------|--------|----------------------|
| hero     | `#hero`   | intro  | `.panel.hero` (NEW), `.h-display`, `.h-1` |
| 1 shape  | `#shape`  | intro  | `.h-1`, `.lede`      |
| 2 protocol | `#protocol` | surface | `.h-2`, `.lede`, `.trinity` (NEW) |
| 3 app    | `#app`    | surface | `.h-2`, `.lede`, `.trinity` (NEW) |
| 4 pivot  | `#symmetry` | surface | `.manifesto` (NEW) |
| 5 proof  | `#running` | proof | `.h-2`, `.lede`, `.card`, `.card-grid` (NEW), `.live-dot` (NEW) |
| 6 for teams | `#teams` | proof | `.h-3`, `.h-1`, `.lede`, `.btn.secondary` |
| 7 ownership | `#ownership` | proof | `.h-1`, `.body` |
| 8 audiences | `#audiences` | who | `.h-2`, `.lede`, `.card`, `.card-grid` |
| 9 community | `#community` | in | `.h-1`, `.lede`, `.input` (NEW), `.btn.primary`, `.form-row` (NEW) |

Tiers (left → right in the desktop bottom rail): **intro · surface · proof · who · in**.

## Things the shell already provides — used as-is

- Tokens (color, spacing, radius, rules) — every color flips correctly
  on theme toggle.
- Type scale classes — `.h-display`, `.h-1`, `.h-2`, `.h-3`, `.lede`,
  `.body`, `.mute`.
- Chrome top: brand button + crumb + theme toggle + menu chip + the
  hairline progress meter (mobile).
- Chrome bottom (desktop only): tier rail with active highlight,
  progress fill, panel counter.
- Nav drawer + scrim, populated from the panel registry.
- Panel grammar: `.panel` with scroll-snap + `.panel-head` (num · tier ·
  sep · name · hover anchor).
- Components: `.btn` (primary, secondary, quiet, ghost, destructive),
  `.pill`, `.card` (with `.card-tag`, `.card-title`, `.card-desc`,
  `.card-foot`).
- Runtime: registry-driven crumb sync, hash deep linking, keyboard nav
  (Arrows / PageUp / PageDown / Space / Home / End / `/` opens drawer).
- Theme bootstrap, `localStorage 'b3nd-theme'` + `[data-theme]`.

## SHELL-CANDIDATES — components b3nd.org needed that the shell doesn't yet ship

Each lives scoped in `/v11.html` under a clearly tagged `SHELL-CANDIDATE`
block. They should be promoted to `shell.html` (the components or
patterns tiers as appropriate) and dropped from v11 once available.

### 01 — `.panel.hero`
Full-bleed centered hero variant of `.panel`. Panel-head is absolutely
positioned so it stays addressable without occupying layout. Marketing
pages need this; the shell currently only has tier overviews and
content panels.

```html
<section class="panel hero" id="hero" data-tier="intro" data-name="hero">
  <h1 class="h-display"><b-3>b3nd</b-3></h1>
  <p class="h-1">digital spellcraft.</p>
</section>
```

Suggested home: `patterns/landing` (`#patterns-landing` is currently
a todo stub in the shell).

### 02 — `.trinity` (verb · description rows)
A list grid of two-column rows where the left column is a mono accent
verb and the right is body copy, separated by hairlines top and bottom.
b3nd.org uses it twice (protocol surface, app surface) and the shape is
generally useful for any "term : meaning" enumeration with stronger
typographic weight than a definition list.

```html
<ul class="trinity">
  <li class="trinity-row">
    <span class="trinity-verb">move</span>
    <span class="trinity-line">Data goes where you ask.</span>
  </li>
</ul>
```

Suggested home: `components/lists` (`#components-lists` is a todo stub
in the shell — definition-list variant).

### 03 — `.manifesto` (stacked declarative lines + coda)
Larger-than-body, smaller-than-h1 stacked declarative copy where the
`<em>` highlights are weight + color, never italic. Carries the rhythm
of a four-line statement followed by a quieter explanatory coda.

```html
<div class="manifesto">
  <p>The same <em>six verbs</em>.</p>
  <p>Across <em>ten storage backends</em>.</p>
</div>
<p class="manifesto-coda">…the explanatory follow-through.</p>
```

Suggested home: `patterns/landing` or a new `patterns/manifesto`.

### 04 — `.live-dot`
Small status indicator. `.live-dot.live` has a soft accent glow.
b3nd.org uses it in the proof card to mark the testnet as live now vs.
"coming soon". Generally useful anywhere "running/not running" needs to
read at a glance without taking up a `.pill`.

```html
<span class="card-tag"><span class="live-dot live"></span> testnet · live</span>
```

Suggested home: `components/pills` (sibling primitive — "status dot"
vs. "status pill").

### 05 — `.input` + `.form-row`
The shell's `#components-inputs` is still a todo. b3nd.org needs a
text input + button row for email signup. v11 ships a pill-shaped
input + `.btn.primary.pill-shape` button. Minimal — no validation
states, no select/checkbox/radio — just enough surface to capture an
email. Promotion should fold this into the proper inputs component.

```html
<form class="form-row" action="/api/signup" method="post">
  <input class="input" name="email" type="email" placeholder="you@somewhere.net" required>
  <button class="btn primary pill-shape" type="submit">come in →</button>
</form>
```

Suggested home: `components/inputs` (`#components-inputs`).

### 06 — `.card-grid` + `.card-grid.dense`
Auto-fit grid of `.card`s at two density steps (240px and 220px
min-tracks). b3nd.org uses both: dense for audience cards, normal for
proof cards. The shell uses bespoke grid CSS inside `panel.index` and
`panel.contents`; a shared `.card-grid` would let any panel ship a card
collection without reinventing the breakpoints.

```html
<div class="card-grid">
  <a class="card" href="…"> … </a>
</div>
```

Suggested home: `components/cards` (`#components-cards`).

### 07 — `.site-foot`
A quiet meta footer (mono links + sig). Lives outside the `.track`
because it's not a panel — it's the always-present tail of a
marketing surface. The shell ends at the last `.panel` because it's
docs, not marketing; a real product page needs this.

```html
<section class="site-foot">
  <div><a>jsr · @bandeira-tech</a> · <a>firecat testnet</a> · …</div>
  <div class="sig">© b3nd · digital spellcraft · amsterdam · 2026</div>
</section>
```

Suggested home: `patterns/landing` (footer variant) or a new
`patterns/footer`.

## What was intentionally dropped vs. v10

- v10 used Inter 200/300 (very light weights) to set an austere
  display tone. The shell uses Inter 600/700 for `.h-display`/`.h-1`
  weights. v11 follows the shell. Aesthetic shifts from "whisper" to
  "statement"; this is an intentional consequence of the shell
  discipline, not an oversight.
- v10 used `data-mode`/`b3nd.mode` for theming (app.js). v11 uses the
  shell's `data-theme`/`b3nd-theme`. The two contracts are not
  mutually compatible; if you visit v10 and v11 in the same session
  your stored theme preference won't carry across. Acceptable because
  v11 is intended to replace v10 once approved.
- v10 had a "↓" scroll cue beneath the hero. v11 leans on the shell's
  keyboard hint (`/` opens the menu, ⌘K too) and the desktop bottom
  rail — there's a clearer global affordance for moving between
  panels. Open Q: should the hero still carry a one-off scroll cue?
- v10 included a hand-rolled JSON-LD `<script>` block. v11 drops it to
  keep the head close to the shell's template; can be re-added when
  promoting to `/`.

## How to view v11

Local: `python3 -m http.server 8765` from the repo root, then
`http://localhost:8765/v11.html`.

Pages preview deploy:
```sh
env -u CLOUDFLARE_API_TOKEN npx wrangler pages deploy . \
  --project-name=b3nd-org --branch=preview --commit-dirty=true
```
(Omit `--branch=main` so production stays on v10.)

## Promotion path

1. Review v11 in browser, dark + light.
2. Tune copy / panel order with the shell discipline as the constraint.
3. Promote each SHELL-CANDIDATE upstream to `shell.html`, then strip
   the corresponding block from v11.
4. When v11 is ready to be the homepage, `mv index.html v10.html`
   and `mv v11.html index.html` (or similar) and deploy `--branch=main`.

## Open questions

- Should `.panel.hero` keep its panel-head visible (cohesive with the
  rest of the page) or hide it entirely on the hero only?
- Audience cards: keep at four or drop to three (carrying the v10 open
  Q forward)?
- Do we want the desktop bottom rail on a marketing page, or is the
  hairline progress meter enough?
