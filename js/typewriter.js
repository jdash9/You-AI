/**
 * Typewriter effect for result screen text.
 * Depends on: state.js (for __GS.resultTypeTokens)
 */

(function () {
  'use strict';
  var GS = window.__GS;

  /**
   * Types `text` into the element with id `spanId`, one char at a time.
   * `channel` lets a fresh call cancel a still-running loop for the same target.
   */
  function typeIntoResultSpan(spanId, channel, text, delay) {
    var el = document.getElementById(spanId);
    if (!el || !text) return;
    GS.resultTypeTokens[channel]++;
    var myToken = GS.resultTypeTokens[channel];
    el.textContent = '';
    setTimeout(function () {
      if (GS.resultTypeTokens[channel] !== myToken) return;
      var i = 0;
      function step() {
        if (GS.resultTypeTokens[channel] !== myToken) return;
        if (i < text.length) {
          el.textContent += text[i];
          i++;
          setTimeout(step, 6);
        }
      }
      step();
    }, delay || 0);
  }

  window.typeIntoResultSpan = typeIntoResultSpan;
})();