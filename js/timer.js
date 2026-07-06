/**
 * Fast timer management for "type: fast" mode.
 * Depends on: state.js (for __GS timer state)
 */

(function () {
  'use strict';
  var GS = window.__GS;

  function updateDisplay(msRemaining) {
    var timerEl = document.getElementById('fast-timer');
    var textEl = document.getElementById('fast-timer-text');
    var fillEl = document.getElementById('fast-timer-fill');
    var remainingSeconds = Math.max(0, Math.ceil(msRemaining / 1000));
    var progress = Math.max(0, Math.min(1, msRemaining / (GS.FAST_TIMER_SECONDS * 1000)));

    if (timerEl) {
      timerEl.style.display = 'flex';
      if (remainingSeconds <= 10) timerEl.classList.add('fast-timer-low');
      else timerEl.classList.remove('fast-timer-low');
    }
    if (textEl) textEl.textContent = remainingSeconds + 's';
    if (fillEl) fillEl.style.width = (progress * 100) + '%';
  }

  function resetDisplay() {
    var timerEl = document.getElementById('fast-timer');
    var textEl = document.getElementById('fast-timer-text');
    var fillEl = document.getElementById('fast-timer-fill');
    if (timerEl) {
      timerEl.style.display = 'none';
      timerEl.classList.remove('fast-timer-low');
    }
    if (textEl) textEl.textContent = GS.FAST_TIMER_SECONDS + 's';
    if (fillEl) fillEl.style.width = '100%';
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