/* ==========================================================================
   Dashboard — builds the star navigation, wires the screens, and tells the
   loading screen when the app is genuinely ready (artwork loaded).
   ========================================================================== */
(function (G) {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var svgIcon = function (id, cls) {
    return '<svg class="' + cls + '" aria-hidden="true" focusable="false"><use href="#' + id + '"/></svg>';
  };

  var root, noteEl, noteTimer, router, firstShow = true;
  var screens = {};

  /* ---- Star navigation ------------------------------------------------------ */
  function cardHTML(star) {
    var inner =
      '<svg class="star__pin" aria-hidden="true" focusable="false"><use href="#i-leafmark"/></svg>' +
      '<span class="star__art"><img src="' + star.art + '" alt="" width="360" height="360" decoding="async"></span>' +
      '<span class="star__label">' + star.label + '</span>' +
      '<span class="star__go">' + svgIcon(star.ready ? 'i-arrow' : 'i-lock', 'star__go-icon') + '</span>';
    if (star.ready) {
      return '<a class="star is-ready" href="' + router.href(star.route) + '" data-star="' + star.id + '">' + inner + '</a>';
    }
    return '<button type="button" class="star is-soon" aria-disabled="true" data-star="' + star.id + '"' +
      ' aria-label="' + star.label + ', coming soon">' + inner + '</button>';
  }

  function railHTML(star) {
    var inner = svgIcon(star.icon, 'rail__icon') + '<span class="rail__label">' + star.label + '</span>' +
      (star.ready ? '' : svgIcon('i-lock', 'rail__lock'));
    if (star.ready) {
      return '<li><a class="rail__item is-ready" href="' + router.href(star.route) + '" data-star="' + star.id + '">' + inner + '</a></li>';
    }
    return '<li><button type="button" class="rail__item is-soon" aria-disabled="true" data-star="' + star.id + '"' +
      ' aria-label="' + star.label + ', coming soon">' + inner + '</button></li>';
  }

  function say(text) {
    window.clearTimeout(noteTimer);
    noteEl.textContent = text;
    noteEl.classList.add('is-on');
    noteTimer = window.setTimeout(function () {
      noteEl.classList.remove('is-on');
      noteTimer = window.setTimeout(function () { noteEl.textContent = ''; }, 500);
    }, 3200);
  }

  function onSoonClick(e) {
    var btn = e.target.closest('.is-soon');
    if (!btn) return;
    var star = G.stars.filter(function (s) { return String(s.id) === btn.getAttribute('data-star'); })[0];
    if (star) say(G.messages.soon(star));
  }

  function buildNav() {
    $('stars').innerHTML = G.stars.map(cardHTML).join('');
    $('rail-list').innerHTML = G.stars.map(railHTML).join('');
    root.addEventListener('click', onSoonClick);
  }

  /* ---- Screens ---------------------------------------------------------------- */
  function show(name, prev) {
    Object.keys(screens).forEach(function (key) { screens[key].hidden = key !== name; });
    root.setAttribute('data-screen', name);

    Array.prototype.forEach.call(document.querySelectorAll('[data-route]'), function (a) {
      if (a.getAttribute('data-route') === name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    Array.prototype.forEach.call(document.querySelectorAll('.is-ready[data-star]'), function (a) {
      var onGarden = name === 'garden' && a.getAttribute('data-star') === '1';
      if (onGarden) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });

    document.title = name === 'garden' ? 'Star 1 · The Garden — Twisha’s Garden' : 'Twisha’s Garden';

    if (name === 'garden') mountGardenOnce();

    if (prev !== null && !firstShow) {          // keyboard / screen-reader users land on the new heading
      var heading = name === 'garden' ? $('garden-title') : $('welcome-title');
      try { heading.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
      window.scrollTo(0, 0);
    }
    firstShow = false;
  }

  /* The real garden attaches here. If window.TwishaGarden.mountGarden(el) exists
     it takes over #garden-mount; otherwise the honest "being planted" panel stays. */
  var gardenMounted = false;
  function mountGardenOnce() {
    if (gardenMounted || typeof G.mountGarden !== 'function') return;
    gardenMounted = true;
    try { G.mountGarden($('garden-mount')); } catch (err) { if (window.console) console.error('[garden] mount failed', err); }
  }

  /* ---- Readiness -------------------------------------------------------------- */
  function imageSettled(img) {
    return new Promise(function (resolve) {
      if (img.complete) { resolve(img.naturalWidth > 0); return; }
      img.addEventListener('load', function () { resolve(true); }, { once: true });
      img.addEventListener('error', function () { resolve(false); }, { once: true });
    });
  }
  function within(promise, ms) {
    return Promise.race([promise, new Promise(function (r) { window.setTimeout(r, ms); })]);
  }

  function announceReady() {
    window.__TWISHA_APP_READY__ = true;
    window.dispatchEvent(new Event('twisha:app-ready'));
  }

  function whenArtReady() {
    var scene = $('scene-img');
    var sceneOk = imageSettled(scene).then(function (ok) {
      if (!ok) $('scene').classList.add('scene--fallback');     // never a blank page if the photo is missing
      else if (scene.decode) return scene.decode().catch(function () {});
    });
    var icons = Array.prototype.map.call(document.querySelectorAll('.star__art img, .panel__art'), imageSettled);
    var fonts = document.fonts && document.fonts.ready ? document.fonts.ready.catch(function () {}) : Promise.resolve();
    // The scene is essential; icons and fonts may only delay hand-over briefly.
    return sceneOk.then(function () { return within(Promise.all(icons.concat([fonts])), 2500); });
  }

  /* ---- Boot -------------------------------------------------------------------- */
  function init() {
    root = $('garden-app');
    noteEl = $('note');
    screens.dashboard = $('screen-dashboard');
    screens.garden = $('screen-garden');

    router = G.createRouter({ show: show, settleMs: 380 });
    buildNav();
    router.start();                              // renders the route in the URL (default: dashboard)

    whenArtReady().then(announceReady, function (err) {
      if (window.console) console.error('[garden] art failed', err);
      window.dispatchEvent(new Event('twisha:app-error'));
    });
  }

  try { init(); } catch (err) {
    if (window.console) console.error('[garden] init failed', err);
    window.dispatchEvent(new Event('twisha:app-error'));
  }
})(window.TwishaGarden = window.TwishaGarden || {});
