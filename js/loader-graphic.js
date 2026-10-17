/* ==========================================================================
   Loader graphic — modular on purpose.
   renderLoaderGraphic(host, { imageSrc }) puts either a custom transparent PNG
   or the built-in seed into `host`. The PNG keeps its transparency and aspect
   ratio (see .loader__img). If the PNG fails to load, the seed is used, so the
   loading screen is never empty.
   ========================================================================== */
(function (ns) {
  'use strict';

  var SEED_SVG =
    '<svg class="seed" viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
      '<ellipse class="seed__ground" cx="60" cy="108" rx="32" ry="4"/>' +
      '<g class="seed__sprout">' +
        '<path class="seed__stem" d="M60 98C60 84 58 72 60 54"/>' +
        '<path class="seed__leaf seed__leaf--l" d="M60 68C46 68 34 60 31 46c15-1 27 7 29 22Z"/>' +
        '<path class="seed__leaf seed__leaf--r" d="M60 57c12 0 24-8 28-22-14-1-26 6-28 22Z"/>' +
      '</g>' +
      '<ellipse class="seed__body" cx="60" cy="101" rx="13" ry="8.5"/>' +
      '<path class="seed__shine" d="M53 98c3-3 9-3 12-1"/>' +
    '</svg>';

  function renderSeed(host) { host.innerHTML = SEED_SVG; }

  ns.renderLoaderGraphic = function (host, opts) {
    var src = opts && opts.imageSrc;
    if (!src) { renderSeed(host); return; }

    var img = new Image();
    img.className = 'loader__img';
    img.alt = '';
    img.decoding = 'async';
    img.onerror = function () { renderSeed(host); };
    img.src = src;
    host.replaceChildren(img);
  };
})(window.TwishaIntro = window.TwishaIntro || {});
