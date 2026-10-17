/* ==========================================================================
   App-ready contract
   The loading screen waits for the real application, not for a timer.

   The application announces it is ready in ANY of these ways:
     • window.dispatchEvent(new Event('twisha:app-ready'))
     • window.__TWISHA_APP_READY__ = true     (if it is already ready)
   …and can report a failure with  new Event('twisha:app-error')  so the
   intro hands over instead of waiting.
   ========================================================================== */
(function (ns) {
  'use strict';

  var status = 'pending';          // 'pending' | 'ready' | 'error'
  var waiters = [];

  function settle(next) {
    if (status !== 'pending') return;
    status = next;
    waiters.splice(0).forEach(function (fn) { fn(next); });
  }

  window.addEventListener('twisha:app-ready', function () { settle('ready'); });
  window.addEventListener('twisha:app-error', function () { settle('error'); });

  ns.appReady = {
    /** Resolves 'ready' | 'error' | 'timeout'. Never rejects, never hangs. */
    wait: function (timeoutMs) {
      return new Promise(function (resolve) {
        if (window.__TWISHA_APP_READY__ === true) settle('ready');
        if (status !== 'pending') return resolve(status);
        var timer = window.setTimeout(function () { resolve('timeout'); }, timeoutMs);
        waiters.push(function (s) { window.clearTimeout(timer); resolve(s); });
      });
    },
    markReady: function () { settle('ready'); },
    markFailed: function () { settle('error'); }
  };
})(window.TwishaIntro = window.TwishaIntro || {});
