/*
========================================================
Main Application Entry Point
========================================================

This file initializes the entire application.

It contains:
- Game startup logic
- Initial loading of first question
- Connection between UI and system modules
- Overall application control flow
========================================================
*/

(function() {
  'use strict';

  let appReady = false;
  let currentQuestion = null;

  function initApp() {
    // Step 1: Initialize the prompt system (loads trivia data)
    PromptSystem.init(function(err) {
      if (err) {
        console.warn('PromptSystem init warning:', err);
      }

      // Step 2: Get the first random question
      currentQuestion = PromptSystem.getCurrentQuestion();

      // Step 3: If no question was selected, force-select one
      if (!currentQuestion) {
        currentQuestion = PromptSystem.selectNewQuestion();
      }

      // Step 4: Populate all UI screens with question data
      if (currentQuestion) {
        GameLogic.populatePromptScreen(currentQuestion);
        GameLogic.populateKeywordScreen(currentQuestion);
        GameLogic.populateSemanticScreen(currentQuestion);
      }

      // Step 5: Set up event listeners
      setupEventListeners();

      // Step 6: Set mode and type selection listeners
      setupModeTypeListeners();

      appReady = true;
      console.log('You-AI app initialized. Question loaded:', currentQuestion ? currentQuestion.id : 'none');

      // Mark initial screen ready
      document.body.classList.add('app-ready');
    });
  }

  // -- Global UI Functions (needed by HTML navigation) --

  // Semantic analysis continue button state
  window.updateSaContinue = function() {
    const inputs = document.querySelectorAll('.text-input[id^="sa-input"]');
    let allFilled = true;
    inputs.forEach(inp => { if (!inp.value.trim()) allFilled = false; });
    const btn = document.getElementById('sa-continue');
    if (btn) {
      if (allFilled) btn.classList.remove('btn-disabled');
      else btn.classList.add('btn-disabled');
    }
  };

  // Semantic input dot status + continue state
  document.querySelectorAll('.text-input[id^="sa-input"]').forEach(inp => {
    inp.addEventListener('input', window.updateSaContinue);
    inp.addEventListener('input', function() {
      const idx = this.id.replace('sa-input-', '');
      const dot = document.getElementById('dot-' + idx);
      if (dot) {
        if (this.value.trim()) dot.classList.add('dot-active');
        else dot.classList.remove('dot-active');
      }
    });
  });

  // Screen navigation change handler (for radio button changes)
  document.querySelectorAll('input.screen-nav').forEach(r => {
    r.addEventListener('change', function() {
      const screen = this.id;
      if (screen === 's-keywords') {
        currentQuestion = PromptSystem.getCurrentQuestion();
        if (currentQuestion) {
          GameLogic.populateKeywordScreen(currentQuestion);
        }
        if (typeof window.updateKwCount === 'function') window.updateKwCount();
      }
      if (screen === 's-semantic') {
        currentQuestion = PromptSystem.getCurrentQuestion();
        if (currentQuestion) {
          GameLogic.populateSemanticScreen(currentQuestion);
        }
        if (typeof window.updateSaContinue === 'function') window.updateSaContinue();
      }
      if (screen === 's-neural') {
        currentQuestion = PromptSystem.getCurrentQuestion();
        if (currentQuestion) {
          GameLogic.populateNeuralScreen(currentQuestion);
        }
      }
      if (screen === 's-answer') {
        currentQuestion = PromptSystem.getCurrentQuestion();
        if (currentQuestion) {
          const mode = AISimulation.getMode();
          const type = AISimulation.getType();
          GameLogic.populateAnswerScreen(currentQuestion, mode, type);
        }
      }
    });
  });

  function setupEventListeners() {
    // Mode radio changes
    document.querySelectorAll('.choice-radio[name="mode"]').forEach(r => {
      r.addEventListener('change', function() {
        AISimulation.setMode(this.id === 'mode-own' ? 'own' : 'internet');
      });
    });

    document.querySelectorAll('.choice-radio[name="type"]').forEach(r => {
      r.addEventListener('change', function() {
        AISimulation.setType(this.id === 'type-accurate' ? 'accurate' : 'fast');
      });
    });

    // "Continue" from mode screen -> load prompt screen with data
    const continueBtn = document.getElementById('btn-continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', function(e) {
        currentQuestion = PromptSystem.getCurrentQuestion();
        if (currentQuestion) {
          GameLogic.populatePromptScreen(currentQuestion);
        }
      });
    }

    // Keyword "Continue" -> go to semantic with data & auto-activate neural
    const kwContinue = document.getElementById('kw-continue');
    if (kwContinue) {
      kwContinue.addEventListener('click', function() {
        if (this.classList.contains('btn-disabled')) return;
      });
    }

    // "Process in Neural Network" -> go to the neural mapping screen
    const saContinue = document.getElementById('sa-continue');
    if (saContinue) {
      saContinue.addEventListener('click', function() {
        if (this.classList.contains('btn-disabled')) return;
        // populateNeuralScreen will be called when s-neural radio is checked
      });
    }

    // "Start Over" (label[for="s-intro"] in answer screen)
    const startOverLabels = document.querySelectorAll('label[for="s-intro"]');
    startOverLabels.forEach(label => {
      label.addEventListener('click', function() {
        currentQuestion = PromptSystem.selectNewQuestion();
        GameLogic.resetGame();
        if (currentQuestion) {
          GameLogic.populatePromptScreen(currentQuestion);
          GameLogic.populateKeywordScreen(currentQuestion);
          GameLogic.populateSemanticScreen(currentQuestion);
        }
        document.querySelectorAll('.choice-radio[name="mode"]').forEach(r => r.checked = false);
        document.querySelectorAll('.choice-radio[name="type"]').forEach(r => r.checked = false);
        GameLogic.updateContinueBtn();
      });
    });
  }

  function setupModeTypeListeners() {
    // Mode names
    document.querySelectorAll('.choice-radio[name="mode"]').forEach(r => {
      r.addEventListener('change', function() {
        GameLogic.setModeSelected(true);
      });
    });

    document.querySelectorAll('.choice-radio[name="type"]').forEach(r => {
      r.addEventListener('change', function() {
        GameLogic.setTypeSelected(true);
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();