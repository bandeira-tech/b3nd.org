# b3nd.org v10 — message design

Date: 2026-06-20
Status: design — pending product-owner sign-off
Authors: Claude (lead designer), Rafael (product owner) — XP session

---

## Strategic frame

**Visitor we are designing for.** A builder shipping with AI — uses Claude / Cursor / coding agents to compose apps. They are pattern-matching every "framework" page they land on against the bucket "yet another framework for shipping AI apps faster" and bouncing the moment they confirm the bucket.

**Job of the page.** Hold the visitor long enough to land *"this is a new architecture, not a new framework."* The page intentionally trades five-second legibility for thirty-second intrigue.

**Mode.** Slow unveiling. The hero is enigmatic. Each subsequent beat lays down one more piece of land. The architecture-pattern surprise happens at Beat 4 ("the symmetry pivot"). After that, beats 5–9 ground, prove, and welcome.

**Second audience, addressed once, on purpose.** Enterprise architects and ops leads — read into the page on Beat 6, given their own deeper page to read into, otherwise not catered to in the main flow.

---

## Constraints we honor

- **Brand D3 — `b3nd` always lowercase in prose.** The wordmark sits lowercase wherever it appears in copy.
- **Brand D4 — reader as protagonist.** "Your X gets better with b3nd" not "b3nd does X." The hero ("b3nd is digital spellcraft.") is the *one* allowed identity assertion; from Beat 1 onward, the reader is the actor.
- **No spellcraft vocabulary beyond the hero.** The word "spellcraft" appears once. After that the page speaks in the framework's own verbs and the visitor's own concerns.
- **Public protocol trinity is `move · save · send`.** Not bend/move/save. The word "bend" is reserved for the wordmark `b3nd` and does not appear as a public verb. (This is a documented divergence from `~/ws/CLAUDE.md` and `bizdev/where-we-are.md` — to be reconciled as a follow-up.)
- **App-side trinity is `receive · read · observe`.** What an application does on top of the substrate.
- **Proof not pitch.** Where we make a claim that can be verified (live testnet, shipped packages, running apps), we link to the verification, not to more copy.

---

## The hero

```
        b3nd is digital spellcraft.

                       ↓
```

**Status:** SETTLED (S4, this session).

**Job:** Intrigue and hold. The visitor reads it, doesn't know what it means, *and we don't help them*. The page below has to earn the answer.

**What the hero MUST NOT have.**
- No separate wordmark above the sentence. The brand name lives inside the sentence — that's part of the assertion. Showing the wordmark separately dilutes both.
- No CTA button. No "Get started." No "Read the docs." Any CTA pulls the visitor out of the page before the unveiling has happened. The only invitation is the `↓`.
- No subheadline. No "for the age of agents," no "the substrate behind X." The sentence is the entire hero.
- No screenshot, no architecture diagram, no logo cloud. Negative space is the design.

**Typography hint** (for implementation in a later session):
- The sentence set in a heavyweight serif or display sans, near-white on near-black, large enough that nothing else competes.
- Within the sentence, the wordmark `b3nd` may take the dark-mode green accent (`#39FF88`) to give it the typographic weight a brand name carries — at the designer's call when the page is built.
- Vertical spacing generous. The hero should feel like a single sustained beat, not a stack of items.

---

## The unveiling — nine beats

### Beat 1 — the shape, named

**Status:** PROPOSED

**Copy:**

> Three verbs. One Rig. The whole app.

That is the entire beat. One line, large type, centered. Nothing else.

**Job:** Plant the substrate vocabulary as a *shape*, not a feature. The reader doesn't yet know what the three verbs are or what a Rig is — and that's correct. We're establishing that this thing is *compact*. The compactness is the first move.

**What it MUST NOT do.** Explain what a Rig is. Show code. Compare to anything.

---

### Beat 2 — the protocol surface

**Status:** PROPOSED (vocabulary settled, copy proposed)

**Copy:**

> **move**       Data goes where you ask. HTTP, WebSocket, gRPC, MCP — one surface.
> **save**       Data stays where you ask. Memory, Postgres, SQLite, Mongo, Elasticsearch, S3, FS, IPFS, the browser — one contract.
> **send**       Data leaves where you ask. To the systems you already run.

Three short rows. Verb on the left, one sentence on the right. No icons that try to be cute.

**Job:** Reveal the *first* of the two verb trinities. The visitor sees that the entire transport-and-storage surface compresses to three words. The list of supported transports and backends is the *evidence* the compression is real, not a feature brag.

**Why this order (move / save / send) and not the older bend/move/save.** Memetic — "bend" is a wordmark-only word, not a public verb. Functional — *move* (transports), *save* (stores), *send* (sinks to external systems) is the cleanest user/system-side reading of what happens to data.

---

### Beat 3 — the application surface

**Status:** PROPOSED (vocabulary settled, copy proposed)

**Copy:**

> Three verbs again — this time for what your app does on top.
>
> **receive**    Take a message in. From a user, an agent, a peer.
> **read**       Look at data you have. By URI, by query, by stream.
> **observe**    Watch data change. React when it does.

Same compact two-column shape as Beat 2.

**Job:** Show the visitor that the compactness wasn't a one-off — the *whole stack* is three verbs at each layer. This is where the "spellcraft" word starts to ring true: there really are six primitives running underneath the entire architecture.

**Implementation note.** Whether `receive · read · observe` or `read · receive · observe` is the canonical order is a small open question — workspace `CLAUDE.md` uses `receive / read / observe`. Defaulting to that.

---

### Beat 4 — the symmetry pivot

**Status:** PROPOSED — load-bearing beat

**Copy:**

> The same six verbs.
> In-process. Over HTTP, WebSocket, gRPC, MCP.
> Across ten storage backends.
> For your users *and* for their agents.
>
> Your agent reads what your user reads. Through the same surface, signed by the same key.

**Job:** This is the beat that turns *compact framework* into *new architecture*. The visitor was forming the model "ok, small framework, neat." This beat invalidates the model. There is no framework shaped like this. There is no other thing where the same primitives compose in-process, across four transports, across ten storage backends, for both humans and agents.

If this beat lands, the page wins. Everything after this is grounding and welcome.

**What this beat MUST NOT do.** Apologize. Hedge. Use the word "framework." Use the word "platform." Compare to anything by name.

---

### Beat 5 — the proof

**Status:** PROPOSED (claims verified against current state of the network)

**Copy:**

> Not a sandbox. Running now.
>
> **Firecat testnet** — a public b3nd network. testnet-evergreen.fire.cat
> **Packages** — `@bandeira-tech/b3nd-*` on JSR
> **Listorama** — a marketplace where users get paid by advertisers (α)
> **k3p** — capture anything from the command line, your data, your machine

Four cards. Each a real link to a real thing.

**Job:** Make Beat 4 credible. If the prior beat made the architectural claim, this beat puts artifacts on the table that prove the claim is shipped. Each card must link out — anything claimed must be checkable.

**Why this is here and not later.** The visitor's instinct after Beat 4 is "ok prove it." We answer immediately.

---

### Beat 6 — the architecture beat (the second audience)

**Status:** PROPOSED — shape settled, copy proposed

**Copy:**

> ### AI-Native Data-Oriented Architecture
>
> For teams drowning in SOA glue, integration boilerplate, and the ops cost of moving data between systems — b3nd is the substrate that absorbs all three.
>
>                                              for teams →

**Job:** A single deliberate signal to architects, ops leads, and enterprise buyers that b3nd is not "for starters only." The phrase *"AI-Native Data-Oriented Architecture"* is the architect-language label that lets them place b3nd in their stack mentally. The `for teams →` link is their off-ramp into a deeper page (to be scoped separately — task #10).

**Why this is here and not at the bottom.** Architects bounce as fast as builders if the page reads as a hobbyist toy. By Beat 6 they've seen the compactness, the symmetry, and the proof — the architecture beat is the moment to name what they just saw in their language.

**`for teams →` link target.** Placeholder — links to `/teams` (a page that does not yet exist). Acceptable for v10 launch as a "coming soon" stub. Full page scoped in task #10.

---

### Beat 7 — ownership and economics

**Status:** PROPOSED — content reordered, lifted largely from v9.3

**Copy:**

> What you build, you keep.
>
> Every message your app makes is signed by your key. Every artifact is content-addressed. Your data is portable between any b3nd app — yours, someone else's, one that doesn't exist yet.
>
> And when the network earns, the network earns *for the people on it.* Listorama is the first app of a marketplace where advertisers bid for attention and money flows to users — not to the platform.

**Job:** Re-enter the v9.3 ownership story — but now as the *consequence* of the architecture revealed in Beats 1–4, not as the lead. The reader has been carried far enough that "signed by your key" sounds like the inevitable shape of the system, not a marketing claim.

The attention-marketplace sentence is the bridge from architecture to the multi-decade build the bizdev anchor describes. It does not need to fully explain itself here — Listorama is linked from Beat 5 for the curious.

---

### Beat 8 — "is this me?"

**Status:** PROPOSED — needs product-owner decision on the cards (see Open Questions)

**Working set of cards** (re-derived from v9.3 + the visitor lens we set today):

> **ai-native entrepreneurs**
> You're shipping a product, not a company hierarchy. b3nd is your whole back end.
>
> **new devs · script kids · vibe coders**
> You want the web to feel direct again. Prompt the app. Ship the system.
>
> **architects · ops**
> You're tired of SOA glue. b3nd is the substrate that absorbs the boilerplate. *(new card, mirrors Beat 6 for the audience-card layer)*
>
> **creators · attention workers**
> Your audience should follow you — not the platform. The marketplace pays you, not a feed. *(carried from v9.3, kept because the attention marketplace gives this audience a real reason to be on this page)*

Each card is a soft welcome — "if this is you, here is how this new architecture meets you." Not a sell.

**Job:** Give the reader a final moment to recognize themselves before the page ends. After the architecture has been revealed, this beat shifts the page back to the individual.

---

### Beat 9 — the community

**Status:** PROPOSED — lifted from v9.3 essentially as-is, with one tone shift

**Copy:**

> Monthly mini-hackathons. Bi-weekly recorded training. Open bounties. Office hours every week.
>
> Prizes for: best video demo, most serious business, funniest, community choice, your language.
>
> Built in the open. Built with the people building on it.

**Job:** Close the page. Convert intrigue into participation. The reader has been walked from "what IS this" through "it's a new architecture" to "this is me" — and now they are offered a door in.

---

## Open questions for sign-off

1. **The fourth card in Beat 8.** Carrying `creators · attention workers` from v9.3 is a judgment call — the attention marketplace gives them a place, but they are not "builders shipping with AI" the way the lens we set targets. Keep four cards, or drop creators back to three?
2. **The `↓` after the hero.** I've proposed a visual scroll-cue. Acceptable, or do we want even that removed — pure typography, no UI affordances at all?
3. **Beat 5 proof links — anything to add or pull.** Right now: Firecat testnet, JSR packages, Listorama, k3p. Do any of those misrepresent current state, and is anything missing?
4. **The `for teams →` link target.** OK to ship v10 with the link pointing at a "coming soon" stub at `/teams`, with the deeper enterprise page scoped as task #10?
5. **Tone of the architecture beat.** I've matched the rest of the page's restraint. If you want it to lean *harder* into enterprise vocabulary (e.g., quantified claims, named comparisons to message brokers / CDC tools / integration brokers), say so — but it would break tonal symmetry with the rest of the page.

---

## What gets carried into the next session

- This spec, signed-off.
- A prioritized list of the actual copy that needs sharpening (the bits marked PROPOSED).
- Implementation work: take the spec to the existing `b3nd.org` HTML/CSS and produce v10 in code.
- Out of scope for the website: doc-sync follow-up across `~/ws/CLAUDE.md` and `bizdev/where-we-are.md` for the protocol-trinity revision (task #9). Out of scope for today: the deeper `for teams →` page (task #10).
