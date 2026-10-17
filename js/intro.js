/* ==========================================================================
   Intro controller — the letter, one line at a time.
   Pure behaviour: it knows nothing about the loader or the app. When Twisha
   presses “Continue” it calls onContinue(), and onLeft() once it has faded out.
   ========================================================================== */
(function (ns) {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function createIntro(opts) {
    var cfg = opts.config;
    var slides = cfg.slides;
    var labels = cfg.labels;
    var root = opts.root;

    var letter = root.querySelector('#letter');
    var btn = root.querySelector('#next');
    var btnLabel = btn.querySelector('.next__label');
    var live = root.querySelector('#intro-live');
    var head = root.querySelector('#intro-head');
    var progress = root.querySelector('#progress');

    var last = slides.length - 1;
    var index = -1;
    var current = null;
    var busy = true;          // locked while anything is animating
    var finished = false;
    var usingKeyboard = false;   // only move focus for keyboard users (no stray ring for touch/mouse)

    function t(name) {
      return reducedMotion.matches ? cfg.timing.reduced[name] : cfg.timing[name];
    }
    function later(fn, ms) { return window.setTimeout(fn, ms); }

    function setBusy(value) {
      busy = value;
      btn.setAttribute('aria-disabled', value ? 'true' : 'false');
    }

    /* ---- One line of the letter ------------------------------------------ */
    function buildLine(i) {
      var slide = slides[i];
      var isFinal = i === last;
      var calm = reducedMotion.matches;
      var words = slide.text.split(' ');
      var enterMs = isFinal ? t('finalEnter') : t('enter');
      var stagger = isFinal ? t('finalStagger') : t('stagger');

      var p = document.createElement('p');
      p.className = 'line' +
        (slide.size === 'lead' ? ' line--lead' : '') +
        (slide.text.length > 60 ? ' line--long' : '');
      p.style.setProperty('--enter', enterMs + 'ms');
      p.style.setProperty('--stagger', stagger + 'ms');
      p.style.setProperty('--exit', t('exit') + 'ms');
      p.style.setProperty('--dx', (calm ? 0 : slide.from.x) + 'px');
      p.style.setProperty('--dy', (calm ? 0 : slide.from.y) + 'px');

      words.forEach(function (word, k) {
        var span = document.createElement('span');
        span.className = 'w';
        span.style.setProperty('--i', k);
        span.textContent = word;
        p.appendChild(span);
        if (k < words.length - 1) p.appendChild(document.createTextNode(' '));
      });

      return { el: p, duration: enterMs + stagger * (words.length - 1) };
    }

    function updateProgress() {
      Array.prototype.forEach.call(progress.children, function (li, k) {
        li.classList.toggle('is-done', k < index);
        li.classList.toggle('is-current', k === index);
      });
    }

    function updateButton() {
      var text = index === last ? labels.final : labels.next;
      if (btnLabel.textContent === text) return;
      btn.classList.add('is-swapping');
      later(function () {
        btnLabel.textContent = text;
        btn.classList.remove('is-swapping');
      }, 180);
    }

    function show(i) {
      var line = buildLine(i);
      index = i;
      current = line.el;
      letter.appendChild(line.el);
      void line.el.offsetWidth;                    // commit the starting state
      line.el.classList.add('is-in');

      live.textContent = slides[i].text;           // announced to screen readers
      root.classList.toggle('is-final', i === last);
      updateProgress();
      updateButton();

      later(function () {
        setBusy(false);                            // only now does the next tap count
        if (usingKeyboard) {
          try { btn.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
        }
      }, line.duration + 80);
    }

    function go(delta) {
      var target = index + delta;
      if (busy || finished || target < 0 || target > last) return;
      setBusy(true);

      var leaving = current;
      var wait = 0;
      if (leaving) {
        leaving.classList.add('is-out');
        wait = t('exit');
      }
      later(function () {
        if (leaving && leaving.parentNode) leaving.parentNode.removeChild(leaving);
        show(target);
      }, wait);
    }

    function conclude() {
      finished = true;
      setBusy(true);
      var leave = t('leave');
      root.style.setProperty('--leave', leave + 'ms');
      root.classList.add('is-leaving');
      document.removeEventListener('keydown', onKey);
      opts.onContinue(leave);
      later(function () { if (opts.onLeft) opts.onLeft(); }, leave);
    }

    function advance() {
      if (busy || finished) return;
      if (index === last) conclude(); else go(1);
    }

    /* ---- Input ------------------------------------------------------------ */
    function onKey(e) {
      usingKeyboard = true;
      if (finished || e.altKey || e.ctrlKey || e.metaKey) return;
      var onButton = document.activeElement === btn;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault(); advance();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault(); go(-1);
      } else if ((e.key === 'Enter' || e.key === ' ') && !onButton) {
        e.preventDefault(); advance();             // on the button, its own click handles it
      }
    }

    function onPointer() { usingKeyboard = false; }
    document.addEventListener('pointerdown', onPointer, true);
    btn.addEventListener('click', advance);
    document.addEventListener('keydown', onKey);

    /* ---- Start ------------------------------------------------------------ */
    function start() {
      head.textContent = labels.head;
      progress.textContent = '';
      slides.forEach(function () { progress.appendChild(document.createElement('li')); });
      btnLabel.textContent = labels.next;
      root.classList.add('is-started');
      later(function () { show(0); }, t('startDelay') != null ? t('startDelay') : cfg.timing.startDelay);
    }

    return { start: start };
  }

  ns.createIntro = createIntro;
})(window.TwishaIntro = window.TwishaIntro || {});
