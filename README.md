# Trainer

A minimal gym logger built around one idea: **every set is taken to failure, so
the only number worth recording is the weight.** No reps, no RIR, no timers.

Installable to a phone home screen, works offline, stores everything locally,
and pushes a JSON snapshot of the whole history to this repo when you ask it to.

## How it works at the gym

1. Open the app. Your usual lifts are at the top under **Recent**.
2. Tap an exercise. The weight is pre-filled with what you did last time, and
   the card above shows `Last time: 80 / 77.5 / 77.5 · 4 days ago` next to your
   all-time best.
3. `−` / `+` to adjust by your increment, then **Log set**. Repeat.
4. Walk away. The session saves itself; there is no "finish workout" button.

A set can be flagged (the flag icon) when it felt bad or got cut short — that
context is what makes a dip in the numbers readable months later.

## Progress

The **Progress** tab tracks top set over time per exercise, tags a session that
set a PR, and flags an exercise as **stalled** when the top set hasn't moved in
four sessions. The balance bars show set counts per muscle group over the last
30 days, so a neglected group is obvious.

## Backup and coaching input

Settings → **Backup to GitHub** writes `data/history.json` to this repo using a
fine-grained personal access token:

1. Create a token at <https://github.com/settings/personal-access-tokens/new>,
   scoped to **this repository only**, with **Contents: read and write**.
2. Paste it into Settings. It is stored in the browser's local storage on that
   device, sent only to `api.github.com`, and never included in an export.
3. **Push** writes the snapshot; **Pull** restores it onto a new device.

With the history in the repo, Claude can read `data/history.json` directly and
comment on stalls, imbalances, and when to deload. If you'd rather not use a
token, **Copy JSON** puts the same snapshot on the clipboard to paste into a
conversation.

## Development

```sh
npm install
npm run dev        # local dev server
npm run typecheck  # tsc --noEmit
npm run build      # production build into dist/
```

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`.
Enable Pages once under **Settings → Pages → Source: GitHub Actions**. The site
is served from `/personal-trainer/`, which is set as `base` in `vite.config.ts`
— change it if the repo is ever renamed.

## Layout

| Path | What's in it |
| --- | --- |
| `src/data/exercises.ts` | The 45-exercise catalog and its muscle groups |
| `src/icons/glyphs.tsx` | One hand-drawn SVG pictogram per exercise |
| `src/icons/parts.tsx` | Shared drawing parts (barbell, dumbbell, stack, floor) |
| `src/lib/derive.ts` | Top set, PR, trend and stall calculations |
| `src/lib/sync.ts` | GitHub Contents API push/pull |
| `src/store.tsx` | App state and local persistence |
| `scripts/gen-icons.mjs` | Regenerates the PWA PNG app icons |

### Adding an exercise

Add an entry to `CATALOG` in `src/data/exercises.ts` and a matching glyph keyed
by its `icon` in `src/icons/glyphs.tsx`. Glyphs are drawn on a 24×24 grid with
the floor at `y=21` and use `currentColor`, so they inherit the theme. Exercises
can also be added from Settings at runtime, picking from the existing icon set.
