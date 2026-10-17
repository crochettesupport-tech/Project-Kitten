/* ==========================================================================
   Boot — intro  →  loading screen  →  the application
   ========================================================================== */
(function (ns) {
  'use strict';

  var cfg = ns.config;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var introEl = document.getElementById('intro');
  var loaderEl = document.getElementById('loader');
  var graphicEl = document.getElementById('loader-graphic');
  var appEl = document.getElementById('app');

  function delay(ms) { return new Promise(function (resolve) { window.setTimeout(resolve, ms); }); }
  function noop() {}

  /* Wait for the web fonts (briefly) so the first line never re-flows mid-flight. */
  function fontsReady() {
    var ready = document.fonts && document.fonts.ready ? document.fonts.ready.catch(noop) : Promise.resolve();
    return Promise.race([ready, delay(1500)]);
  }

  function conceal() {
    appEl.setAttribute('inert', '');
    appEl.setAttribute('aria-hidden', 'true');
  }

  function revealApp() {
    appEl.style.transitionDuration = (reducedMotion.matches ? 400 : cfg.loader.revealMs) + 'ms';
    appEl.removeAttribute('inert');
    appEl.removeAttribute('aria-hidden');
    appEl.classList.add('is-revealed');
    document.body.classList.remove('is-intro');
    try { appEl.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  }

  function removeOverlays() {
    [introEl, loaderEl].forEach(function (el) { if (el && el.parentNode) el.parentNode.removeChild(el); });
  }

  /* Anything unexpected: show the app rather than a blank or stuck screen. */
  function recover(err) {
    if (window.console) console.error('[Twisha intro] falling back to the app:', err);
    revealApp();
    removeOverlays();
  }

  function onContinue(leaveMs) {
    var fadeMs = reducedMotion.matches ? 500 : cfg.loader.fadeMs;
    loaderEl.style.setProperty('--loader-fade', fadeMs + 'ms');
    loaderEl.hidden = false;
    // Two frames so the opacity transition has a starting point to run from.
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { loaderEl.classList.add('is-visible'); });
    });

    // Hand over when the app is genuinely ready AND the loader has been seen
    // for a moment — never on a fixed fake-progress timer.
    Promise.all([
      ns.appReady.wait(cfg.loader.timeoutMs),
      delay(leaveMs + cfg.loader.minVisibleMs)
    ]).then(function (results) {
      if (results[0] !== 'ready' && window.console) {
        console.warn('[Twisha intro] app signalled "' + results[0] + '"; continuing anyway.');
      }
      revealApp();
      loaderEl.classList.remove('is-visible');
      return delay((reducedMotion.matches ? 500 : Math.max(cfg.loader.fadeMs, cfg.loader.revealMs)) + 120);
    }).then(removeOverlays).catch(recover);
  }

  function boot() {
    ns.started = true;
    conceal();
    loaderEl.querySelector('.loader__label').textContent = cfg.labels.loading;
    ns.renderLoaderGraphic(graphicEl, cfg.loader);          // preloads a custom PNG while she reads

    fontsReady().then(function () {
      ns.createIntro({
        root: introEl,
        config: cfg,
        onContinue: onContinue
      }).start();
    }).catch(recover);
  }

  try { boot(); } catch (err) { recover(err); }
})(window.TwishaIntro = window.TwishaIntro || {});
