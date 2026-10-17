/* PLACEHOLDER ONLY — stands in for the real application so this project runs on
   its own. Replace it with the real app’s boot code; the only requirement is to
   announce readiness once, when the app is truly ready to be shown:

     window.__TWISHA_APP_READY__ = true;
     window.dispatchEvent(new Event('twisha:app-ready'));
*/
(function () {
  'use strict';
  var done = false;
  function ready() {
    if (done) return;
    done = true;
    window.__TWISHA_APP_READY__ = true;
    window.dispatchEvent(new Event('twisha:app-ready'));
  }
  var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fonts, new Promise(function (r) { window.setTimeout(r, 1500); })]).then(ready, ready);
})();
