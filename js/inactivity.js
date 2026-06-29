// inactivity.js — shows a "are you still there?" popup after a minute without
// any user activity. if nobody confirms in time the game resets to the home
// screen. doesn't run at all while we're already on the home screen since
// there is no game in progress that could time out there

(function() {
  'use strict';

  const INACTIVITY_MS = 60 * 1000; // wait 1 minute of no activity before showing the popup
  const RESPONSE_MS = 15 * 1000;   // give the user 15 seconds to confirm before resetting

  let inactivityTimer = null;
  let responseTimer = null;
  let popupVisible = false;

  function isHomeScreen() {
    const homeRadio = document.getElementById('s-home');
    return homeRadio ? homeRadio.checked : true;
  }

  function showPopup() {
    const overlay = document.getElementById('inactivity-overlay');
    if (!overlay) return;
    overlay.classList.add('visible');
    popupVisible = true;

    // nobody confirmed in time -> reset back to the home screen
    responseTimer = setTimeout(resetToHome, RESPONSE_MS);
  }

  function hidePopup() {
    const overlay = document.getElementById('inactivity-overlay');
    if (overlay) overlay.classList.remove('visible');
    popupVisible = false;
    if (responseTimer) {
      clearTimeout(responseTimer);
      responseTimer = null;
    }
  }

  function clearInactivityTimer() {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
  }

  function restartInactivityTimer() {
    clearInactivityTimer();
    if (isHomeScreen()) return; // nothing to time out on the home screen
    inactivityTimer = setTimeout(showPopup, INACTIVITY_MS);
  }

  function resetToHome() {
    hidePopup();
    clearInactivityTimer();
    // reuse the existing "Start Over" button logic from main.js instead of
    // duplicating the reset code here — clicking the label checks #s-home
    // and triggers the listener that resets the question/game state
    const startOverLabel = document.querySelector('label[for="s-home"]');
    if (startOverLabel) startOverLabel.click();
  }

  function handleActivity() {
    // while the popup is showing, only the confirm button should dismiss it —
    // otherwise moving the mouse anywhere would silently confirm for the user
    if (popupVisible) return;
    restartInactivityTimer();
  }

  document.addEventListener('DOMContentLoaded', function() {
    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'].forEach(function(evt) {
      document.addEventListener(evt, handleActivity, { passive: true });
    });

    // switching screens (including going back to home) should restart or stop the timer
    document.querySelectorAll('input.screen-nav').forEach(function(radio) {
      radio.addEventListener('change', restartInactivityTimer);
    });

    const confirmBtn = document.getElementById('inactivity-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function() {
        hidePopup();
        restartInactivityTimer();
      });
    }

    restartInactivityTimer();
  });
})();
