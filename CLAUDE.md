# CLAUDE.md — b3nd.org

This file gives Claude Code instances enough state on entry that they don't
have to re-derive what we've decided. Read it before editing anything.

## What this repo is

The public marketing site at **b3nd.org**, deployed via **Cloudflare Pages**:

- Static HTML/CSS/JS (no build step), `pages_build_output_dir = "."` in `wrangler.toml`
- Project name in Cloudflare: `b3nd-org`
- KV binding `SIGNUPS` (id `c9bad80405e44a138f208e405a513f91`) — wired to `functions/api/signup`
- Brand assets at `brand/b3nd.css` + `brand/b3nd.js` (the `<b-3>` custom element)
- Mode toggle implemented in `app.js`, persisted as localStorage key `b3nd.mode` with `html[data-mode="light"]`

## The current message (v11, deployed 2026-06-21)

v11 is v10's nine-beat narrative ported into the canonical brand
webshell (`~/ws/b3nd-brand/webshell/shell.html`) — shell tokens,
chrome (top + desktop bottom rail), nav drawer, scroll-snap panel
grammar with addressable `.panel-head`, type scale, components,
theme contract (`b3nd-theme` + `data-theme`). Panels are grouped
into five tiers: **intro · surface · proof · who · in**.

Full spec: `docs/superpowers/specs/2026-06-20-b3nd-org-v11-shell-port.md`.
v10 is preserved at `/v10.html`.

## The previous message (v10, in archive)

**Hero**: `b3nd is digital spellcraft.` — austere, single declarative sentence,
no CTA. Its job is *intrigue and hold*, not five-second legibility.

**Below the hero**: nine-beat slow unveiling that walks the visitor from
"what IS this?" to "this is a new architecture, not a new framework."

The decision rule that drove this: b3nd's transformative weirdness is *worse* served by
legible-benefit framings ("ship faster with X") because they let the visitor
file the product into a familiar bucket (Convex / Vercel / Supabase for AI)
and bounce. So the hero leans into mystique on purpose. The word "spellcraft"
appears **once** in the hero and never again on the page; the rest of the
page speaks in the canonical verb vocabulary.

Full spec: `docs/superpowers/specs/2026-06-20-b3nd-org-v10-message-design.md`.

### Canonical public verb vocabulary

Use these *exactly*. The previously-documented `bend/move/save` trinity
(still in `/Users/m0/ws/CLAUDE.md` and `bizdev/where-we-are.md` as of
2026-06-20) is the *internal* package shape, not the public messaging:

- **Protocol surface (user/system perspective on data)**: `move · save · send`
  - `bend` is **not used as a public verb**. The word "bend" is reserved for
    the wordmark `b3nd`. Memetic rule.
  - `b3nd-sink` is being renamed to `b3nd-send` (rename pending; doc-sync
    tracked as workspace task #9).
- **Application surface (what apps do on top)**: `receive · read · observe`
  (workspace-canonical order from `~/ws/CLAUDE.md`).

### Brand constraints to honor

- **D3 — `b3nd` always lowercase in prose.** Wordmark stays lowercase wherever it appears.
- **D4 — never bold, never italic on the wordmark.** Extended in v10 to the whole
  page: italic display copy reads as off-brand. Use weight (Inter 200/300) + accent
  color for emphasis, not italic.
- **D5 — the "3" hangs 0.27em below baseline.** This drove the hero gap fix —
  when the wordmark stacks above the tagline, the wordmark needs `padding-bottom`
  ≥ 0.35em or its descender collides with the line below.
- Brand glyph `3` is American Typewriter. Driven by `brand/b3nd.{css,js}`.
- Fonts on the site: Inter (200, 300, 400, 500, 600) + JetBrains Mono (400, 500).
  Both from Google Fonts. No serif display family — Newsreader was tried, rejected.

### Decisions that are explicitly **not yet** settled

- Beat 8 audience cards: four (entrepreneurs · script kids · architects/ops · creators)
  or three (drop creators)? Currently four. Open Q #1 in the spec.
- `for teams` link in Beat 6 points to `/teams`, which is a 404 right now.
  Deeper enterprise page scoped as workspace task #10.
- Hero scroll cue (`↓`): currently present. Open Q #2 in the spec.

## The canonical brand webshell (next big refactor)

`/Users/m0/ws/b3nd-brand/webshell/shell.html` is the brand-canonical design
system shell: tokens (`--bg/--ink/--accent/--rule/...` with asymmetric
dark/light), `.chrome-top` with brand+breadcrumb+theme toggle+menu drawer,
scroll-snap panel grammar, type scale (`.h-display/.h-1/.h-2/.h-3/.lede/.body/.mute`),
canonical components (`.btn` × 5 variants, `.pill`, `.card`, `pre.code`, `.demo`, `.swatch`),
runtime JS (registry, deep-link sync, keyboard navigation, theme persistence to
`localStorage.b3nd-theme` via `data-theme`).

v10 was implemented *outside* that shell — hand-rolled chrome and tokens, slightly
divergent theme storage (`b3nd.mode` vs `b3nd-theme`). The next iteration
should rebuild the page **within** the shell: take its tokens, chrome, type
scale, and `.panel` grammar; carry the v10 beat copy and structure forward
as the body. This is a real refactor and deserves its own session.

## Deploying

Cloudflare Pages, Direct Upload, deployed via wrangler. **`main` is staging; `production` is prod.** The Cloudflare project's "Production branch" setting is `production`, so the `b3nd.org` custom domain follows the `production` branch.

### Ship to staging (default)

```sh
# IMPORTANT: the env-set CLOUDFLARE_API_TOKEN lacks Pages permissions for the
# b3nd-org project. Always run wrangler with the env var unset so it falls
# back to OAuth (`wrangler login` session).
env -u CLOUDFLARE_API_TOKEN npx wrangler pages deploy . \
  --project-name=b3nd-org --branch=main --commit-dirty=true
```

Wrangler prints the staging URL (a `*.b3nd-org.pages.dev` alias for the `main` branch). Eyeball there before promoting.

### Promote to prod

```sh
env -u CLOUDFLARE_API_TOKEN npx wrangler pages deploy . \
  --project-name=b3nd-org --branch=production --commit-dirty=true
```

This updates the `b3nd.org` custom domain. Recommended: mirror the git `production` branch to what just shipped, so `git diff main..production` answers "what's on staging that isn't shipped yet":

```sh
git push origin main:production
```

Local working artifacts (`v10-*.png` screenshots, `.playwright-mcp/`,
`.claude/scheduled_tasks.lock`) are gitignored but Pages doesn't respect
`.gitignore` — clean them out of the working dir before any deploy.

Local dev: `python3 -m http.server 8765` from the repo root is enough for
design verification. The `/api/signup` endpoint won't work locally (Pages
Functions); use `npx wrangler pages dev .` if you need it.

## File map

- `index.html` — the live v11 page (nine panels in five tiers, built inside the
  brand webshell; inline-styled, registry-driven runtime, references `brand/`).
  Theme contract: `localStorage 'b3nd-theme'` + `html[data-theme]`.
- `v10.html` — archived v10 page (hand-rolled chrome + tokens, theme contract
  `localStorage 'b3nd.mode'` + `html[data-mode]`). Still wired to `app.js`.
- `styles.css` — legacy v9 stylesheet, no longer consumed. Slated for removal.
- `app.js` — mode toggle (v10 contract), signup form handler, copy buttons.
  v11 inlines its own signup handler; only `v10.html` still loads `app.js`.
- `brand/b3nd.css` + `brand/b3nd.js` — the `<b-3>` wordmark element. Canonical.
- `functions/api/signup.ts` (Pages Functions) — email capture into the `SIGNUPS` KV.
- `wrangler.toml` — Cloudflare Pages project config.
- `docs/superpowers/specs/` — design specs (v10 message design lives here).

## Working rules specific to this repo

- **Commit on each discrete change.** v9.3 → v10 → v10.1 are visible in `git log`;
  keep that pattern. Use `b3nd.org · vN · short description` as the subject prefix.
- **Verify in a browser before claiming done.** Workspace rule (UI/frontend changes).
- **Preserve the v9.3 commit (53c182b) as the fallback** — that page is the last
  "legible benefit" version of the site and a known-good reference if v11 needs
  to be reverted. v10 also remains accessible at `/v10.html` for direct comparison.
