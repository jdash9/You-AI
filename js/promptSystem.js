/*
========================================================
Prompt Challenge System
========================================================

This file handles all prompt-related functionality.

It contains:
- Loading trivia questions from embedded TriviaData
- Randomly selecting a question for each session
- Managing current question state
- Handling user selections
- Providing question data to other modules
========================================================
*/

const PromptSystem = (function() {
  let questions = [];
  let currentQuestion = null;
  let usedQuestionIds = [];

  function loadQuestions(callback) {
    // Use embedded trivia data directly (works with file:// protocol)
    try {
      if (typeof TriviaData !== 'undefined' && TriviaData.questions && TriviaData.questions.length > 0) {
        questions = TriviaData.questions.slice(); // Clone the array
        callback(null);
        return;
      }
    } catch(e) {
      // Fall through to default
    }

    // Fallback: hardcoded default if TriviaData not available
    questions = getDefaultQuestions();
    callback(null);
  }

  function getDefaultQuestions() {
    return [
      {
        id: 1,
        prompt: "Explain the importance of machine learning in modern healthcare",
        keywords: ["explain", "importance", "machine", "learning", "modern", "healthcare"],
        analysis: { topic: "Machine learning in healthcare", intent: "Understand importance of ML in healthcare", language: "English" },
        answer: "Machine learning plays a transformative role in modern healthcare by enabling early disease detection through pattern recognition in medical imaging, personalizing treatment plans based on patient data analysis, accelerating drug discovery by predicting molecular interactions, and improving operational efficiency through predictive analytics for patient flow and resource allocation."
      },
      {
        id: 2,
        prompt: "What is the height of Mount Everest?",
        keywords: ["what", "is", "the", "height", "of", "Mount", "Everest"],
        analysis: { topic: "Mount Everest elevation", intent: "Find the exact height of Mount Everest", language: "English" },
        answer: "Mount Everest, the highest mountain on Earth, has an officially recognized height of 8,848.86 meters (29,031.7 feet) above sea level. It continues to grow approximately 4 millimeters per year due to tectonic plate movement."
      },
      {
        id: 3,
        prompt: "Who wrote the play Romeo and Juliet?",
        keywords: ["who", "wrote", "the", "play", "Romeo", "and", "Juliet"],
        analysis: { topic: "Shakespearean literature", intent: "Identify the author of Romeo and Juliet", language: "English" },
        answer: "The play Romeo and Juliet was written by William Shakespeare, the renowned English playwright and poet. It was composed between 1591 and 1596, during the early part of Shakespeare's career."
      }
    ];
  }

  function getRandomQuestion() {
    if (questions.length === 0) return null;

    // If all questions have been used, reset
    if (usedQuestionIds.length >= questions.length) {
      usedQuestionIds = [];
    }

    // Find questions not yet used
    const available = questions.filter(q => !usedQuestionIds.includes(q.id));
    if (available.length === 0) return null;

    // Pick a random one from available
    const randomIndex = Math.floor(Math.random() * available.length);
    currentQuestion = available[randomIndex];
    usedQuestionIds.push(currentQuestion.id);

    return currentQuestion;
  }

  function getCurrentQuestion() {
    return currentQuestion;
  }

  function getAllQuestions() {
    return questions;
  }

  function selectNewQuestion() {
    return getRandomQuestion();
  }

  // Initialize: load questions and select first one
  function init(callback) {
    loadQuestions(function(err) {
      if (!err) {
        selectNewQuestion();
      }
      if (callback) callback(err);
    });
  }

  return {
    init: init,
    getCurrentQuestion: getCurrentQuestion,
    selectNewQuestion: selectNewQuestion,
    getAllQuestions: getAllQuestions
  };
})();