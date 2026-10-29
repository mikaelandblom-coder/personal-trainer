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

## Icons

Each exercise icon has two halves.

- **What it trains.** A muscle map built from the exercise's own load data.
  The primary group is solid, secondary groups are shaded by their share, and
  the rest stays faint. Back exercises, plus rear delts, hamstrings, glutes and
  triceps, show the figure from behind.
- **How it moves.** A movement cue above an equipment mark. The cue only has
  to separate exercises that train the same muscles. Incline gets a tilted bench
  and flat gets a flat one. The body sits on the left, so an arrow pointing
  right is a push and one pointing left is a pull. Curl and extension arcs turn
  opposite ways.

The map and the recovery rules use the same numbers. While a muscle is still
inside its recovery window, it turns red in the icon. A lat pulldown with
rested lats and tired biceps shows red arms, so you can see which part of the
exercise is the problem.

## What to train today

The workout screen opens with a recommendation — **Legs**, **Upper — push**,
**Upper — pull**, or **Rest** — and the reason behind it. Tap it for the full
recovery board: every muscle group, when it was last loaded, and by what.

This exists because of one rule: don't work the same muscle two days running.
Enforcing that needs more than a per-exercise group label, so every exercise
carries a secondary load map (`also` in `src/data/exercises.ts`). Bench press
loads chest fully, shoulders at 0.5 and triceps at 0.5 — so an overhead press
the next day is flagged, not waved through.

Non-gym training goes into the same model. Two hours of badminton is a heavy
leg session and a real shoulder session, so it blocks leg day exactly like
squats would. Log it under **Activity**; it's measured in minutes, not sets.

A group counts as worked when a day's total load for it reaches 0.5. Exercise
tiles turn red-edged when they'd hit something worked today or yesterday, so
the warning is visible before the set, not after.

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

## Samsung Health

There is no automatic import. Samsung's current path for third-party access is
the Android-native Samsung Health Data SDK, and the practical route for
everyone else is Health Connect — also an Android API. A web app in a browser
can read neither, so this app cannot pull from Samsung Health as-is.

Three ways forward, if it becomes worth it:

- **Manual export.** Samsung Health can export your data as CSVs. A one-off
  importer could map its exercise sessions onto activities here.
- **Native shell.** Wrapping the app with Capacitor and a Health Connect plugin
  would let badminton and rides sync automatically. It also turns this into an
  Android project with a signing key and a release process.
- **Strava as a bridge.** Samsung Health can sync to Strava, and Strava has a
  normal OAuth REST API a web app can call. Needs a small backend to hold the
  client secret.

Until then, logging a session takes two taps.

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
| `src/data/exercises.ts` | The 45-exercise catalog, muscle groups and secondary loads |
| `src/data/activities.ts` | Badminton, cycling and cardio, with their load maps |
| `src/icons/body.tsx` | The muscle map, shaded from each exercise's loads |
| `src/icons/bodyPaths.ts` | Front and back figure outlines, generated — don't edit |
| `src/icons/glyphs.tsx` | Movement cue and equipment mark per exercise |
| `src/icons/parts.tsx` | Shared cue arrows and equipment marks |
| `src/lib/derive.ts` | Top set, PR, trend and stall calculations |
| `src/lib/recovery.ts` | Muscle load model, recovery board and the daily plan |
| `src/lib/sync.ts` | GitHub Contents API push/pull |
| `src/store.tsx` | App state and local persistence |
| `scripts/gen-icons.mjs` | Regenerates the PWA PNG app icons |
| `scripts/trace-muscle-map.py` | Traces `art/muscle-map.png` into `bodyPaths.ts` |

### Adding an exercise

Add an entry to `CATALOG` in `src/data/exercises.ts` and a matching glyph keyed
by its `icon` in `src/icons/glyphs.tsx`.

The muscle map beside the cue needs no drawing: it comes from `group` and
`also`, so filling those in correctly is most of the job. Exercises can also be
added from Settings at runtime. That form asks for the main group, equipment
and secondary muscles. Custom exercises get the muscle map and an equipment
mark but no movement cue.

The figure is traced from `art/muscle-map.png`, a colour-coded image with one
flat colour per group. To change the body, replace that image and rerun
`scripts/trace-muscle-map.py`.
