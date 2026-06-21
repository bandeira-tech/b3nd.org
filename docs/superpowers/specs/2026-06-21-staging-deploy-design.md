# Staging deploy for b3nd.org

**Date:** 2026-06-21
**Status:** Approved, ready for implementation
**Scope:** Split the b3nd.org deploy workflow so the default lands on staging and prod is an explicit second step.

## Problem

Today, the documented deploy command in `CLAUDE.md` ships straight to production:

```sh
env -u CLOUDFLARE_API_TOKEN npx wrangler pages deploy . \
  --project-name=b3nd-org --branch=main --commit-dirty=true
```

`--branch=main` is also Cloudflare Pages' configured production branch, so every default invocation overwrites the live `b3nd.org` deployment. There's no safe place to eyeball a change before it hits the public domain.

We want the muscle-memory default to land somewhere safe, and prod to be an explicit second invocation.

## Architecture

One Cloudflare Pages project (`b3nd-org`), two named branches:

- **`main` → staging.** Default for every `wrangler pages deploy`. URL: `main.b3nd-org.pages.dev`.
- **`production` → prod.** URL: `b3nd-org.pages.dev` + the `b3nd.org` custom domain. Cloudflare's "Production branch" project setting flips from `main` → `production` so the custom domain follows prod.

Pages's Direct Upload model means `--branch=X` only *labels* the deployment — the working directory is what ships. Promoting staging → prod is the same files, deployed a second time with `--branch=production`. No git merge is required for the deploy itself.

## Workflow

### Daily (staging)

```sh
env -u CLOUDFLARE_API_TOKEN npx wrangler pages deploy . \
  --project-name=b3nd-org --branch=main --commit-dirty=true
```

Eyeball at `main.b3nd-org.pages.dev`.

### Promote to prod

```sh
env -u CLOUDFLARE_API_TOKEN npx wrangler pages deploy . \
  --project-name=b3nd-org --branch=production --commit-dirty=true
```

After promoting, mirror the git `production` branch so it tracks what's live:

```sh
git push origin main:production
```

This is optional but cheap. It lets `git diff main..production` answer "what's on staging that isn't shipped yet."

## Changes required

### 1. Cloudflare Pages project setting (manual, one-time)

In the Cloudflare dashboard:

- Project `b3nd-org` → Settings → Builds & deployments → Production branch
- Change from `main` → `production`
- Save

Wrangler doesn't expose Pages project-settings mutation, so this is a manual dashboard step. Must happen before the first `--branch=production` deploy promotes to the custom domain.

### 2. Git branch

Create `production` from current `main` and push:

```sh
git checkout main
git branch production
git push -u origin production
git checkout main
```

The first `wrangler pages deploy . --branch=production` registers the branch on the Pages side and attaches the custom domain.

### 3. `CLAUDE.md`

Replace the single "Deploying" block with the two-step staging-first / prod-promotion shape. Keep:

- The `env -u CLOUDFLARE_API_TOKEN` preamble (OAuth fallback note).
- The gitignore-vs-Pages-respect warning ("clean local artifacts before deploy").
- The local-dev section (`python3 -m http.server 8765` and `wrangler pages dev .`).

Add:

- A short note that the Cloudflare project's "Production branch" is now `production`, not `main`.
- The `git push origin main:production` mirror step as recommended (not required).

Working-rules subject-line convention stays as-is (`b3nd.org · vN · short description`). The staging/prod split is about *where it shipped*, not how commits are subject-lined.

## Explicitly out of scope

- **Separate KV namespace for staging signups.** Pages supports per-environment KV bindings via the dashboard. Not in this change; the `SIGNUPS` KV stays shared between staging and prod until there's a concrete reason to split.
- **`staging.b3nd.org` custom domain.** Trivial to add later if eyeballing on `main.b3nd-org.pages.dev` becomes inconvenient.
- **Deploy script / Makefile wrappers.** The repo's style is bare commands documented in `CLAUDE.md`; no `bin/ship` or `Makefile` introduced.
- **Auto-deploy via Git connection.** Pages project stays on Direct Upload. Deploys remain a deliberate local act.

## Acceptance

- `wrangler pages deploy . --branch=main` lands on `main.b3nd-org.pages.dev` and does **not** affect `b3nd.org`.
- `wrangler pages deploy . --branch=production` lands on `b3nd-org.pages.dev` and updates the `b3nd.org` custom domain.
- `CLAUDE.md` documents both commands and the order to run them in.
- `production` branch exists locally and on `origin`.
- Cloudflare dashboard shows `production` as the project's production branch.
