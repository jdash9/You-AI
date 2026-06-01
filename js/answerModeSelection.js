/*
========================================================
Answer Mode Selection Screen
========================================================

This file manages the transition from the home screen to the answer mode selection screen.

It contains:
- the Get Started button handler
- screen activation logic for the answer mode selection view

This file keeps the home screen and the answer mode selection screen separate.
========================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  const homeStartButton = document.querySelector('.home-start-button');
  const homeScreen = document.getElementById('homeScreen');
  const answerModeScreen = document.getElementById('answerModeScreen');

  if (!homeStartButton || !homeScreen || !answerModeScreen) {
    return;
  }

  homeStartButton.addEventListener('click', () => {
    homeScreen.classList.remove('active');
    homeScreen.style.display = 'none';
    answerModeScreen.classList.add('active');
    answerModeScreen.style.display = 'flex';
  });

  const answerModeButtons = answerModeScreen.querySelectorAll('.answer-mode-button');

  answerModeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.closest('.answer-mode-group');
      if (!group) return;

      const groupButtons = group.querySelectorAll('.answer-mode-button');
      groupButtons.forEach((groupButton) => {
        groupButton.classList.toggle('selected', groupButton === button);
      });
    });
  });
});
