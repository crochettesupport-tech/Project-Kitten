/* ==========================================================================
   Tiny hash router:  #/  → dashboard      #/garden → Star 1
   Hash routes need no server support, so they work on GitHub Pages under any
   base path and never reload the page. Rapid taps are coalesced: only the
   latest target wins, and screens never swap faster than `settleMs`.
   ========================================================================== */
(function (G) {
  'use strict';

  var ROUTES = { '': 'dashboard', '/': 'dashboard', '/garden': 'garden' };
  var PATHS = { dashboard: '#/', garden: '#/garden' };

  function parse() {
    var key = window.location.hash.replace(/^#/, '');
    return Object.prototype.hasOwnProperty.call(ROUTES, key) ? ROUTES[key] : null;
  }

  G.createRouter = function (opts) {
    var current = null;
    var target = null;
    var busy = false;
    var settleMs = opts.settleMs || 380;

    function run() {
      if (target === current) return;
      var prev = current;
      current = target;
      busy = true;
      opts.show(current, prev);
      window.setTimeout(function () {
        busy = false;
        if (target !== current) run();
      }, settleMs);
    }

    function sync() {
      var parsed = parse();
      if (parsed === null) {                     // unknown hash → quietly tidy it to home
        try { window.history.replaceState(null, '', window.location.pathname + window.location.search + PATHS.dashboard); } catch (e) { /* ignore */ }
        parsed = 'dashboard';
      }
      target = parsed;
      if (!busy) run();
    }

    window.addEventListener('hashchange', sync);

    return {
      start: sync,
      current: function () { return current; },
      href: function (name) { return PATHS[name]; }
    };
  };
})(window.TwishaGarden = window.TwishaGarden || {});
