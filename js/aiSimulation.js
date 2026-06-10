/*
========================================================
AI Process Simulation
========================================================

This file simulates simplified AI behavior.

It contains:
- Simulated AI processing of user input
- Pattern matching simulation
- Answer generation based on trivia data and word mappings
========================================================
*/

const AISimulation = (function() {
  let currentMode = 'own';
  let currentType = 'accurate';

  function setMode(mode) {
    currentMode = mode;
  }

  function setType(type) {
    currentType = type;
  }

  function getMode() {
    return currentMode === 'own' ? 'Own Knowledge' : 'Internet';
  }

  function getType() {
    return currentType === 'accurate' ? 'Accurate' : 'Fast';
  }

  function generateAnswer(question, path) {
    if (!question) return 'No question data available.';

    let answer = question.answer || '';
    let response = '';

    if (path && path.word) {
      response += 'Neural Network Path: ' + path.word
        + (path.option ? ' → ' + path.option : '')
        + (path.next ? ' → ' + path.next : '')
        + (path.output ? ' → ' + path.output : '')
        + '\n\n---\n\n';
    }

    response += answer;

    if (currentMode === 'internet') {
      response += '\n\n[Sources: Analyzed from multiple web-based references]';
    }

    if (currentType === 'fast') {
      const paragraphs = response.split('\n\n');
      response = paragraphs[0] || response;
    }

    return response;
  }

  return {
    setMode: setMode,
    setType: setType,
    getMode: getMode,
    getType: getType,
    generateAnswer: generateAnswer
  };
})();