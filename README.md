# Twisha’s Garden — intro + dashboard

Plain HTML/CSS/JS — no build step, no dependencies. All paths are relative, so it works on GitHub
Pages under any base path (and by double-clicking `index.html`).

Flow: **six-message intro → loading screen → dashboard** (`#/`) → **Star 1** (`#/garden`).

## Files
- `index.html` — page, intro, loader, and the app (`<main id="app">`)
- `css/tokens.css` — palette as CSS variables + semantic roles (change roles here to try new combinations)
- `css/intro.css`, `css/loader.css` — intro + loading screen (unchanged by the dashboard work)
- `css/dashboard.css` — dashboard, star cards, rail, Star 1 panel, responsive layouts
- `js/config.js` — message, labels, timings, loader options
- `js/intro.js`, `js/loader-graphic.js`, `js/app-ready.js`, `js/main.js` — intro, loader, hand-off
- `js/app/stars.js` — the five stars (only Star 1 is `ready`) · `js/app/router.js` — tiny hash router · `js/app/dashboard.js` — wiring + readiness
- `assets/garden-bg.jpg` — the garden photograph · `assets/stars/star1–5.png` — star artwork (transparent)

## How the hand-off works
The dashboard is mounted (hidden) while she reads. It announces readiness once its photograph and
icons have really loaded (`twisha:app-ready`); the loading screen waits for that, never a fixed timer.
If the photo is missing, a soft palette gradient is shown instead of a blank page.

## The background and the hair animation
`assets/garden-bg.jpg` is a single flattened image in its own layer (`.scene`). When a separate
character/hair layer exists, stack it inside `.scene` above `#scene-img` using the same sizing rules
(`.scene__img`). The UI is laid out around her silhouette, so nothing needs to move.
The current image is the first frame of the supplied video, with its top 70px cropped.
**Replace it with the clean, high-resolution artwork** (keep the same composition; update
`width`/`height` in `index.html`).

## Stars
- Star 1 → `#/garden`. The `#garden-mount` element is where the real garden attaches: define
  `window.TwishaGarden.mountGarden = function (el) { … }` before the first visit and it takes over.
  Until then an honest “being planted” panel is shown.
- Stars 2–5 are locked: tapping shows a gentle “coming soon” note and goes nowhere. To open one, give it
  a `route` and `ready: true` in `js/app/stars.js` and add the screen to `router.js`/`dashboard.js`.

## Custom loader image
Drop a transparent PNG at `assets/loader.png` and set `loader.imageSrc: 'assets/loader.png'` in `js/config.js`.

## Fonts
Cormorant Garamond, Caveat and Pinyon Script load from Google Fonts, with serif/cursive fallbacks.
