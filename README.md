# Twisha’s Garden — intro

A personal message, shown one line at a time, that leads through a loading screen into the app.
Plain HTML/CSS/JS — no build step, no dependencies. All paths are relative, so it works on GitHub
Pages under any base path (and by double-clicking `index.html`).

## Files
- `index.html` — page, `#app` mount point, loader and intro markup
- `css/tokens.css` — palette as CSS variables + semantic roles (change roles here to try new combinations)
- `css/intro.css`, `css/loader.css` — styles
- `js/config.js` — **the message, labels, timings, loader options**
- `js/intro.js` — slide controller · `js/loader-graphic.js` — loader graphic · `js/app-ready.js` — hand-off contract · `js/main.js` — boot
- `css/app-placeholder.css`, `js/app-placeholder.js` — stand-ins; delete when the real app is in

## Connecting the real app
Put the app inside `<main id="app">` (replacing the placeholder). It is mounted hidden while she reads.
When it is truly ready, it must announce it once:

```js
window.__TWISHA_APP_READY__ = true;
window.dispatchEvent(new Event('twisha:app-ready'));
```
(`twisha:app-error` hands over without waiting.) If nothing is announced, the intro continues after
`loader.timeoutMs` (15 s) rather than hanging.

## Custom loader image
Drop a transparent PNG at `assets/loader.png` and set `loader.imageSrc: 'assets/loader.png'` in `js/config.js`.
Transparency and aspect ratio are preserved; if it fails to load the built-in seed is used.

## Fonts
Cormorant Garamond and Caveat load from Google Fonts, with Garamond/Georgia and cursive fallbacks.
