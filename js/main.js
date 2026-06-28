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

      // Step 6: Initialize UI state
      if (typeof GameLogic.updateContinueBtn === 'function') GameLogic.updateContinueBtn();
      if (typeof GameLogic.updateKwCount === 'function') GameLogic.updateKwCount();
      if (typeof GameLogic.updateSaContinue === 'function') GameLogic.updateSaContinue();

      appReady = true;
      console.log('You-AI app initialized. Question loaded:', currentQuestion ? currentQuestion.id : 'none');

      // Mark initial screen ready
      document.body.classList.add('app-ready');
    });
  }

  function setupEventListeners() {
    document.querySelectorAll('.choice-radio[name="mode"]').forEach(r => {
      r.addEventListener('change', function() {
        AISimulation.setMode(this.id === 'mode-own' ? 'own' : 'internet');
        GameLogic.setModeSelected(true);
        GameLogic.updateContinueBtn();
      });
    });

    document.querySelectorAll('.choice-radio[name="type"]').forEach(r => {
      r.addEventListener('change', function() {
        AISimulation.setType(this.id === 'type-accurate' ? 'accurate' : 'fast');
        GameLogic.setTypeSelected(true);
        GameLogic.updateContinueBtn();
      });
    });

    document.querySelectorAll('.text-input[id^="sa-input"]').forEach(inp => {
      inp.addEventListener('input', function() {
        const idx = this.id.replace('sa-input-', '');
        const dot = document.getElementById('dot-' + idx);
        if (dot) {
          if (this.value.trim()) dot.classList.add('dot-active');
          else dot.classList.remove('dot-active');
        }
        if (typeof GameLogic.updateSaContinue === 'function') GameLogic.updateSaContinue();
      });
    });

    document.querySelectorAll('input.screen-nav').forEach(r => {
      r.addEventListener('change', function() {
        const screen = this.id;
        if (screen === 's-keywords') {
          currentQuestion = PromptSystem.getCurrentQuestion();
          if (currentQuestion) {
            GameLogic.populateKeywordScreen(currentQuestion);
          }
          if (typeof GameLogic.updateKwCount === 'function') GameLogic.updateKwCount();
        }
        if (screen === 's-semantic') {
          currentQuestion = PromptSystem.getCurrentQuestion();
          if (currentQuestion) {
            GameLogic.populateSemanticScreen(currentQuestion);
          }
          if (typeof GameLogic.updateSaContinue === 'function') GameLogic.updateSaContinue();
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

    const continueBtn = document.getElementById('btn-continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', function() {
        currentQuestion = PromptSystem.getCurrentQuestion();
        if (currentQuestion) {
          GameLogic.populatePromptScreen(currentQuestion);
        }
        const fastType = document.getElementById('type-fast');
        if (fastType && fastType.checked && typeof GameLogic.startFastTimer === 'function') {
          GameLogic.startFastTimer();
        } else if (typeof GameLogic.stopFastTimer === 'function') {
          GameLogic.stopFastTimer();
        }
      });
    }

    const kwContinue = document.getElementById('kw-continue');
    if (kwContinue) {
      kwContinue.addEventListener('click', function(e) {
        if (this.classList.contains('btn-disabled')) {
          e.preventDefault();
          return;
        }
      });
    }

    const saContinue = document.getElementById('sa-continue');
    if (saContinue) {
      saContinue.addEventListener('click', function(e) {
        if (this.classList.contains('btn-disabled')) {
          e.preventDefault();
          return;
        }
      });
    }

    // ── Filter Screen ─────────────────────────────────────────────────
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var filter = this.getAttribute('data-filter');
        GameLogic.setFilter(filter);
      });
    });

    const filterContinue = document.getElementById('btn-filter-continue');
    if (filterContinue) {
      filterContinue.addEventListener('click', function(e) {
        if (this.classList.contains('btn-disabled')) {
          e.preventDefault();
          return;
        }

        var outputIdx = 0;
        var outputData = { text: '' };
        var steps = GameLogic.getNetworkSteps();
        if (steps.length > 0) {
          outputData.text = steps[0].output || steps[0].word || 'Selected answer';
        }
        // Correct = user selected the top output (index 0) AND picked a strong keyword
        // AND chose the correct filter for the current question (or no filter was needed)
        var selectedOutputIdx = (typeof GameLogic.getActiveOutputIdx === 'function')
          ? GameLogic.getActiveOutputIdx()
          : 0;
        var pickedTopOutput = selectedOutputIdx === 0;
        var hasStrongKeyword = GameLogic.isValidKeywordSelection();
        var currentQ = PromptSystem.getCurrentQuestion();
        var selectedFilt = (typeof GameLogic.getSelectedFilter === 'function')
          ? GameLogic.getSelectedFilter()
          : null;
        var recommendedFilt = currentQ ? currentQ.recommendedFilter : null;
        var filterIsCorrect;
        if (!recommendedFilt) {
          // Question has no recommended filter → no filter is the right call
          filterIsCorrect = !selectedFilt || selectedFilt === 'nofilter';
        } else {
          filterIsCorrect = selectedFilt === recommendedFilt;
        }
        var isCorrectAnswer = pickedTopOutput && hasStrongKeyword && filterIsCorrect;
        GameLogic.showResultScreen(outputIdx, outputData, isCorrectAnswer);
      });
    }

    const startOverLabels = document.querySelectorAll('label[for="s-home"]');
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

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
