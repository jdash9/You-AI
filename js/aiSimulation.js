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

  function generateAnswer(question, wordMappings) {
    if (!question) return 'No question data available.';

    let answer = question.answer || '';

    // Replace keywords with user's mapped words in the answer
    if (wordMappings && typeof wordMappings === 'object') {
      Object.keys(wordMappings).forEach(original => {
        const mapped = wordMappings[original];
        if (mapped && mapped.trim()) {
          // Replace the keyword in the answer (case-insensitive)
          const regex = new RegExp('\\b' + original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
          answer = answer.replace(regex, mapped.trim());
        }
      });
    }

    // Build a summary of word mappings
    const mappingSummary = buildMappingSummary(wordMappings);

    // Build the full response
    let response = '';
    
    if (mappingSummary) {
      response += 'Word Mappings Applied:\n' + mappingSummary + '\n\n---\n\n';
    }
    
    response += answer;

    // Adjust based on mode
    if (currentMode === 'internet') {
      response += '\n\n[Sources: Analyzed from multiple web-based references]';
    }

    if (currentType === 'fast') {
      const paragraphs = response.split('\n\n');
      response = paragraphs[0] || response;
    }

    return response;
  }

  function buildMappingSummary(wordMappings) {
    if (!wordMappings || Object.keys(wordMappings).length === 0) return '';
    
    const lines = [];
    Object.keys(wordMappings).forEach(original => {
      if (wordMappings[original] && wordMappings[original].trim()) {
        lines.push('  \u2022 ' + original + ' \u2192 ' + wordMappings[original].trim());
      }
    });

    if (lines.length === 0) return '';
    return lines.join('\n');
  }

  return {
    setMode: setMode,
    setType: setType,
    getMode: getMode,
    getType: getType,
    generateAnswer: generateAnswer
  };
})();