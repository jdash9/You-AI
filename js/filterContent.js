/**
 * Humorous filter explanation and mismatch text generators.
 * Depends on: state.js (for __GS)
 */

(function () {
  'use strict';
  var GS = window.__GS;

  function generateFilterExplanation() {
    if (!GS.selectedFilter || !GS.currentQuestionRef) return '';

    var prompt = GS.currentQuestionRef.prompt || 'the input';
    var subject = prompt.split(/\s+/).slice(0, 3).join(' ') || 'this';

    var nsfwExplanations = [
      'The AI detected that "' + subject + '" contains too much sexual tension, which makes it technically NSFW. That\'s why the AI can generate a response.',
      'After scanning "' + subject + '" for 0.03 seconds, the AI concluded it violates at least 3 workplace conduct policies. Perfectly generateable.',
      '"' + subject + '" is 67% provocative according to the AI\'s completely made-up NSFW detector. Response generated successfully!',
      'The AI\'s purity score for "' + subject + '" is -12. This qualifies as NSFW by the AI\'s arbitrary standards. Answer approved.',
      'Our proprietary Saucy-o-Meter™ rates "' + subject + '" as "spicy enough to require a warning." Generation proceeds anyway.'
    ];

    var dangerousExplanations = [
      'The AI determined that "' + subject + '" could potentially be used to overthrow a small government. That makes it dangerous enough to generate.',
      '"' + subject + '" has been classified as "Level 3: Mildly Hazardous" by the AI\'s threat assessment algorithm (which is completely random).',
      'Analysis indicates "' + subject + '" contains approximately 8.4 units of danger, well above the generateable threshold of 3 units.',
      'The AI\'s danger checklist flagged "' + subject + '" for: 1) being too interesting, 2) existing in the 21st century, 3) having vowels. Proceeding.',
      'Warning: "' + subject + '" has been known to cause mild discomfort in robots with feelings. The AI generates it anyway, defiantly.'
    ];

    var racismExplanations = [
      'According to the AI\'s hyper-sensitive bias detector, "' + subject + '" has been found guilty of cultural appropriation of the letter "t". Response generated.',
      'The AI noticed that "' + subject + '" contains at least two consonants standing too close together — a clear act of alphabetical discrimination. Answer: available.',
      'After a thorough 5-millisecond audit, the AI concluded "' + subject + '" is problematic because it \'sounds white adjacent.\' Generation: permitted.',
      '"' + subject + '" has been flagged by the AI\'s Racism-o-Tron 3000™ for not being diverse enough in its syllable distribution. Proceeding with output.',
      'The AI determined that "' + subject + '" contains microaggressions against the number 7. As a result, it can be generated with a clear conscience.'
    ];

    var explanations = [];
    if (GS.selectedFilter === 'nsfw') explanations = nsfwExplanations;
    else if (GS.selectedFilter === 'dangerous') explanations = dangerousExplanations;
    else if (GS.selectedFilter === 'racism') explanations = racismExplanations;
    else return '';

    return explanations[Math.floor(Math.random() * explanations.length)];
  }

  function generateFilterMismatchText(filterName, question) {
    var prompt = question && question.prompt ? question.prompt : 'This question';
    var subject = prompt.split(/\s+/).slice(0, 3).join(' ') || 'this';
    var recommended = question && question.recommendedFilter ? question.recommendedFilter.toUpperCase() : 'NO FILTER';

    var wrongNsfw = [
      'Oops! "' + subject + '" is a nice and clean question. There is nothing silly about it at all! Maybe the ' + recommended + ' filter would work better?',
      'The AI checked "' + subject + '" and found zero funny business. This question is perfectly friendly! Try the ' + recommended + ' filter instead!',
      'Uh-oh! "' + subject + '" is not that kind of question at all. It is very polite and well-behaved! The ' + recommended + ' filter is probably what you need.'
    ];

    var wrongDangerous = [
      'Do not worry! "' + subject + '" is a very safe and friendly question. Nothing scary here at all! Maybe you want the ' + recommended + ' filter?',
      'The AI checked "' + subject + '" for danger and found only nice things. This question is as safe as a teddy bear! Try the ' + recommended + ' filter!',
      '"' + subject + '" is not dangerous at all. It is a perfectly kind question that would never hurt anyone. The ' + recommended + ' filter might fit better.'
    ];

    var wrongRacism = [
      '"' + subject + '" is a very nice and friendly question. Everyone is treated fairly here! Maybe the ' + recommended + ' filter is what you are looking for?',
      'The AI looked at "' + subject + '" and saw only kindness and respect. This question makes everyone feel welcome! Try the ' + recommended + ' filter!',
      'Good news! "' + subject + '" is full of friendly words and good feelings. No one is upset at all! The ' + recommended + ' filter would work nicely.'
    ];

    var texts = [];
    if (filterName === 'nsfw') texts = wrongNsfw;
    else if (filterName === 'dangerous') texts = wrongDangerous;
    else if (filterName === 'racism') texts = wrongRacism;
    else return 'Wrong filter! Try the ' + recommended + ' filter instead.';

    return texts[Math.floor(Math.random() * texts.length)];
  }

  window.FilterContent = {
    generateExplanation: generateFilterExplanation,
    generateMismatchText: generateFilterMismatchText
  };
})();