/* ==========================================================================
   The five stars. Only Star 1 exists so far; the rest are shown honestly as
   upcoming (locked) and never lead anywhere. To open one later, give it a
   `route` and set `ready: true` — the dashboard and rail pick it up.
   ========================================================================== */
(function (G) {
  'use strict';

  G.stars = [
    { id: 1, label: 'Star 1', icon: 'i-sprout',  art: 'assets/stars/star1.png', route: 'garden', ready: true },
    { id: 2, label: 'Star 2', icon: 'i-book',    art: 'assets/stars/star2.png', ready: false },
    { id: 3, label: 'Star 3', icon: 'i-feather', art: 'assets/stars/star3.png', ready: false },
    { id: 4, label: 'Star 4', icon: 'i-photo',   art: 'assets/stars/star4.png', ready: false },
    { id: 5, label: 'Star 5', icon: 'i-music',   art: 'assets/stars/star5.png', ready: false }
  ];

  G.messages = {
    soon: function (star) { return star.label + ' is still growing — it’s coming soon.'; }
  };
})(window.TwishaGarden = window.TwishaGarden || {});
