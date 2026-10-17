/* ==========================================================================
   Configuration — everything you are likely to want to tweak lives here.
   ========================================================================== */
(function (ns) {
  'use strict';

  ns.config = {
    /* The message. Wording, spelling and punctuation are exactly as written.
       `from` is the subtle direction (in px) each slide drifts in from.
       `size: 'lead'` makes a short opening word a touch larger. */
    slides: [
      { text: 'Hie',                                                                         from: { x: 0,   y: 26 },  size: 'lead' },
      { text: 'Hope your doing well',                                                         from: { x: -34, y: 12 } },
      { text: 'I wish I were there to see you and wish you on your bday',                     from: { x: 34,  y: 12 } },
      { text: 'But life is always unfair',                                                    from: { x: 0,   y: -22 } },
      { text: 'So instead I dedicate the website to the most beautiful and wonderful girl I’ve ever met', from: { x: -26, y: 22 } },
      { text: 'And happy birthday Twisha, I will always hope the best for you',               from: { x: 0,   y: 34 } }
    ],

    labels: {
      head: 'for Twisha',
      next: 'Next',
      final: 'Continue',
      loading: 'just a moment…'
    },

    /* Milliseconds. The final slide is deliberately slower. */
    timing: {
      startDelay: 450,          // paper settles before the first line arrives
      enter: 1100,              // one word’s fly-in
      stagger: 55,              // gap between words
      exit: 520,                // line drifting away
      finalEnter: 1700,
      finalStagger: 120,
      leave: 1400,              // intro dissolving into the loading screen
      /* Used instead when the device asks for reduced motion (fade only). */
      reduced: { enter: 500, stagger: 0, exit: 300, finalEnter: 800, finalStagger: 0, leave: 600 }
    },

    loader: {
      /* Set to a path like 'assets/loader.png' to use your own transparent PNG.
         Leave null for the built-in seed. Paths are relative to index.html, so
         they keep working under the GitHub Pages base path. */
      imageSrc: null,
      minVisibleMs: 900,        // so the loading screen never just flashes
      timeoutMs: 15000,         // never leave her waiting forever
      fadeMs: 1000,
      revealMs: 1000
    }
  };
})(window.TwishaIntro = window.TwishaIntro || {});
