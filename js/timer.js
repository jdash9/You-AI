/**
 * Fast timer management for "type: fast" mode.
 * Depends on: state.js (for __GS timer state)
 */

(function () {
  'use strict';
  var GS = window.__GS;
  var BAR_CHARS = 20;
  var chompOpen = true;

  function repeatChar(ch, count) {
    var out = '';
    for (var i = 0; i < count; i++) out += ch;
    return out;
  }

  function updateDisplay(msRemaining) {
    var timerEl = document.getElementById('fast-timer');
    var textEl = document.getElementById('fast-timer-text');
    var eatenEl = document.getElementById('fast-timer-eaten');
    var pacEl = document.getElementById('fast-timer-pac');
    var dashesEl = document.getElementById('fast-timer-dashes');
    var remainingSeconds = Math.max(0, Math.ceil(msRemaining / 1000));
    var elapsedFraction = 1 - Math.max(0, Math.min(1, msRemaining / (GS.FAST_TIMER_SECONDS * 1000)));
    var pacIndex = Math.min(BAR_CHARS - 1, Math.floor(elapsedFraction * BAR_CHARS));

    if (timerEl) {
      timerEl.style.display = 'block';
      if (remainingSeconds <= 10) timerEl.classList.add('fast-timer-low');
      else timerEl.classList.remove('fast-timer-low');
    }
    if (textEl) textEl.textContent = remainingSeconds + 's';
    if (eatenEl) eatenEl.textContent = repeatChar(' ', pacIndex);
    if (pacEl) pacEl.textContent = chompOpen ? 'C' : 'c';
    if (dashesEl) dashesEl.textContent = repeatChar('-', BAR_CHARS - pacIndex - 1);
  }

  function resetDisplay() {
    var timerEl = document.getElementById('fast-timer');
    var textEl = document.getElementById('fast-timer-text');
    var eatenEl = document.getElementById('fast-timer-eaten');
    var pacEl = document.getElementById('fast-timer-pac');
    var dashesEl = document.getElementById('fast-timer-dashes');
    if (timerEl) {
      timerEl.style.display = 'none';
      timerEl.classList.remove('fast-timer-low');
    }
    if (textEl) textEl.textContent = GS.FAST_TIMER_SECONDS + 's';
    if (eatenEl) eatenEl.textContent = '';
    if (pacEl) pacEl.textContent = 'C';
    if (dashesEl) dashesEl.textContent = repeatChar('-', BAR_CHARS - 1);
  }

  /**
   * Stop the fast timer and reset its display.
   */
  function stopFastTimer() {
    if (GS.fastTimerInterval) {
      clearInterval(GS.fastTimerInterval);
      GS.fastTimerInterval = null;
    }
    GS.fastTimerActive = false;
    GS.fastTimerDeadline = 0;
    resetDisplay();
  }

  /**
   * Called every 250ms to tick the fast timer.
   * When time expires, calls the onExpire callback.
   * The callback is injected so this module stays unaware of showResultScreen.
   */
  var expireCallback = null;

  function setExpireCallback(cb) {
    expireCallback = cb;
  }

  function handleTick() {
    if (!GS.fastTimerActive) return;
    var msRemaining = GS.fastTimerDeadline - Date.now();
    chompOpen = !chompOpen;
    updateDisplay(msRemaining);
    if (msRemaining <= 0) {
      stopFastTimer();
      if (typeof expireCallback === 'function') {
        expireCallback();
      }
    }
  }

  /**
   * Start the fast timer.
   */
  function startFastTimer() {
    stopFastTimer();
    GS.fastTimerActive = true;
    chompOpen = true;
    GS.fastTimerDeadline = Date.now() + GS.FAST_TIMER_SECONDS * 1000;
    updateDisplay(GS.FAST_TIMER_SECONDS * 1000);
    GS.fastTimerInterval = setInterval(handleTick, 250);
  }

  window.FastTimer = {
    start: startFastTimer,
    stop: stopFastTimer,
    setExpireCallback: setExpireCallback
  };
})();