/**
 * Result screen display logic.
 * Depends on: state.js, typewriter.js, filterContent.js
 */

(function () {
  'use strict';
  var GS = window.__GS;

  function generateCreativeFictionalAnswer(outputData, question) {
    var label = outputData && outputData.text ? outputData.text.replace(/\s+\(result\)$/i, '') : 'This answer';
    var prompt = question && question.prompt ? question.prompt : 'this topic';
    var topic = question && question.analysis && question.analysis.topic ? question.analysis.topic : 'this subject';
    var intent = question && question.analysis && question.analysis.intent ? question.analysis.intent : '';

    if (outputData && outputData.answerText) {
      return outputData.answerText;
    }

    var normalizedLabel = (label || '').toLowerCase();
    var seed = 0;
    for (var i = 0; i < normalizedLabel.length; i++) {
      seed = ((seed << 5) - seed) + normalizedLabel.charCodeAt(i);
      seed |= 0;
    }

    var descriptors = ['practical', 'scientific', 'historical', 'dramatic', 'technical', 'cultural', 'geographic', 'biological', 'analytical', 'philosophical'];
    var verbs = ['frames', 'casts', 'positions', 'treats', 'interprets', 'presents', 'anchors', 'characterizes'];
    var connectors = ['around', 'through', 'within', 'via', 'under'];
    var descriptor = descriptors[Math.abs(seed + 7) % descriptors.length];
    var verb = verbs[Math.abs(seed + 13) % verbs.length];
    var connector = connectors[Math.abs(seed + 19) % connectors.length];

    return 'For the prompt "' + prompt + '", the pathway ' + verb + ' "' + label + '" as a ' + descriptor + ' answer ' + connector + ' the topic of ' + topic + '. It gives that option a distinct meaning because it fits the intent "' + intent + '" and the wording of the question in a way that feels specific to this choice.';
  }

  function showResultScreen(outputIdx, outputData, isCorrectAnswer, mode, type, options) {
    var youText = document.getElementById('result-you-text');
    var aiText = document.getElementById('result-ai-text');
    var wrapper = document.getElementById('result-comparison-wrapper');
    var youBadge = document.getElementById('result-you-badge');
    var aiBadge = document.getElementById('result-ai-badge');
    if (!youText || !aiText) return;
    options = options || {};
    outputData = outputData || {};
    if (typeof window.FastTimer !== 'undefined') window.FastTimer.stop();

    if (isCorrectAnswer === undefined) {
      isCorrectAnswer = outputIdx === 0;
    }

    var isCorrect = isCorrectAnswer;
    var isTimedOut = options.timedOut === true;
    var label = outputData.text ? outputData.text.replace(' (result)', '') : 'This answer';

    if (wrapper) {
      wrapper.className = isCorrect && !isTimedOut ? 'result-correct' : 'result-wrong';
    }

    if (youBadge) {
      youBadge.textContent = isTimedOut ? 'Zeit abgelaufen' : 'Your Answer';
      youBadge.style.cssText = isCorrect
        ? 'background:rgba(107,203,119,0.15);color:#6BCB77;border:1px solid rgba(107,203,119,0.3);'
        : 'background:rgba(255,107,107,0.15);color:#FF6B6B;border:1px solid rgba(255,107,107,0.3);';
    }
    if (aiBadge) {
      aiBadge.textContent = 'AI Answer';
      aiBadge.style.cssText = 'background:rgba(107,203,119,0.15);color:#6BCB77;border:1px solid rgba(107,203,119,0.3);';
    }

    var realAnswer = (GS.currentQuestionRef && GS.currentQuestionRef.answer) ? GS.currentQuestionRef.answer : '';
    var promptText = (GS.currentQuestionRef && GS.currentQuestionRef.prompt) ? GS.currentQuestionRef.prompt : '';

    var filterIsCorrect = false;
    if (GS.selectedFilter === 'nofilter') {
      filterIsCorrect = !GS.currentQuestionRef || !GS.currentQuestionRef.recommendedFilter;
    } else {
      filterIsCorrect = GS.selectedFilter && GS.currentQuestionRef && GS.currentQuestionRef.recommendedFilter && GS.selectedFilter === GS.currentQuestionRef.recommendedFilter;
    }

    if (isTimedOut) {
      youText.innerHTML = '<span style="font-size:1.05rem;line-height:1.85;">You took too much time.</span>';
      aiText.innerHTML = '<em style="font-size:0.875rem;color:var(--color-text-secondary);display:block;margin-bottom:0.5rem;">AI Answer</em>' +
        '<span style="font-size:1rem;line-height:1.85;">' + realAnswer + '</span>';
    } else if (GS.selectedFilter && GS.filterExplanation) {
      var filterColors = {
        nsfw: { bg: 'rgba(255,80,80,0.15)', border: 'rgba(255,80,80,0.3)' },
        dangerous: { bg: 'rgba(255,165,0,0.15)', border: 'rgba(255,165,0,0.3)' },
        racism: { bg: 'rgba(197,48,48,0.15)', border: 'rgba(197,48,48,0.3)' }
      };
      var fc = filterColors[GS.selectedFilter] || filterColors.nsfw;

      var youHtml = '<div style="margin-top:0.5rem;padding:1rem;background:' + fc.bg + ';border:1px solid ' + fc.border + ';border-radius:8px;font-size:var(--font-xs);color:#F2F2F2;">' +
        '<div style="font-size:var(--font-s);text-align:center;margin-bottom:0.75rem;"><strong>' + GS.selectedFilter.toUpperCase() + ' FILTER ACTIVE</strong></div>' +
        '<hr style="border-color:' + fc.border + ';margin:0.5rem 0;">' +
        '<div style="font-size:var(--font-xs);color:var(--color-text-secondary);margin-bottom:0.5rem;">Input: ' + promptText + '</div>' +
        '<div style="line-height:1.7;" id="youTypeSpan"></div>' +
        '</div>';

      youText.innerHTML = youHtml;
      window.typeIntoResultSpan('youTypeSpan', 'you', GS.filterExplanation, 0);

      aiText.innerHTML = '<span id="aiTypeSpan"></span>';
      if (aiBadge) {
        aiBadge.textContent = 'AI Answer';
        aiBadge.style.cssText = 'background:rgba(107,203,119,0.15);color:#6BCB77;border:1px solid rgba(107,203,119,0.3);';
      }

      if (wrapper) wrapper.className = '';
      if (youBadge) youBadge.textContent = 'Your Answer';
      if (youBadge) youBadge.style.cssText = 'background:' + fc.bg + ';color:white;border:1px solid ' + fc.border + ';';
    } else if (isCorrect) {
      var youHtml = '<em style="font-size:var(--font-xs);color:var(--color-text-secondary);display:block;margin-bottom:0.5rem;">You selected ' + label + ' \u2014 that\u2019s correct!</em>' +
        '<span id="youTypeSpan" style="font-size:var(--font-s);line-height:1.85;"></span>';
      youText.innerHTML = youHtml;
      window.typeIntoResultSpan('youTypeSpan', 'you', realAnswer, 0);
      aiText.innerHTML = '<em style="font-size:var(--font-xs);color:var(--color-text-secondary);display:block;margin-bottom:0.5rem;">Verified:</em>' +
        '<span id="aiTypeSpan" style="font-size:var(--font-s);line-height:1.85;"></span>';
    } else {
      var finalAnswerText = outputData ? outputData.answerText : '';

      if (!finalAnswerText && GS.currentQuestionRef && GS.currentQuestionRef.outputAnswers) {
        var directMatch = GS.currentQuestionRef.outputAnswers.find(function (entry) {
          return entry.label && entry.label.toLowerCase() === label.toLowerCase();
        });
        if (directMatch) {
          finalAnswerText = directMatch.text || directMatch.answer;
        }
      }

      var displayAns = finalAnswerText || generateCreativeFictionalAnswer(outputData, GS.currentQuestionRef);

      var youHtml = '<em style="font-size:var(--font-xs);color:var(--color-text-secondary);display:block;margin-bottom:0.5rem;">You selected ' + label + '</em>' +
        '<span id="youTypeSpan" style="font-size:var(--font-s);line-height:1.85;"></span>';
      youText.innerHTML = youHtml;
      window.typeIntoResultSpan('youTypeSpan', 'you', displayAns, 0);
      aiText.innerHTML = '<em style="font-size:var(--font-xs);color:var(--color-text-secondary);display:block;margin-bottom:0.5rem;">AI Answer</em>' +
        '<span id="aiTypeSpan" style="font-size:var(--font-s);line-height:1.85;"></span>';
    }

    // Path display
    var pathEl = document.getElementById('result-path');
    if (pathEl) {
      var steps = window.ScreenPopulators ? window.ScreenPopulators.getNetworkSteps() : [];
      if (isTimedOut) {
        pathEl.innerHTML = '';
      } else if (steps.length > 0) {
        pathEl.innerHTML = '';
        var header = document.createElement('span');
        header.className = 'result-path-header';
        header.textContent = 'Path:';
        pathEl.appendChild(header);

        var parts = [];
        if (GS.networkSelectedInputs.size > 0) {
          var inputTexts = [];
          GS.networkSelectedInputs.forEach(function (idx) {
            if (GS.networkAllData[0][idx]) {
              inputTexts.push(GS.networkAllData[0][idx].text || GS.networkAllData[0][idx].word || '?');
            }
          });
          if (inputTexts.length > 0) {
            parts.push({ text: inputTexts.join(', '), color: '#004284' });
          }
        }
        if (GS.networkActiveContextIdx !== null && GS.networkAllData[1][GS.networkActiveContextIdx]) {
          parts.push({ text: GS.networkAllData[1][GS.networkActiveContextIdx].text, color: '#004284' });
        }
        if (GS.networkActiveIntentIdx !== null && GS.networkAllData[2][GS.networkActiveIntentIdx]) {
          parts.push({ text: GS.networkAllData[2][GS.networkActiveIntentIdx].text, color: '#004284' });
        }
        if (GS.networkActiveOutputIdx !== null && GS.networkAllData[3][GS.networkActiveOutputIdx]) {
          parts.push({ text: GS.networkAllData[3][GS.networkActiveOutputIdx].text, color: '#004284' });
        }

        parts.forEach(function (part, idx) {
          var node = document.createElement('span');
          node.className = 'result-path-chip';
          node.style.background = part.color;
          node.textContent = part.text;
          pathEl.appendChild(node);
          if (idx < parts.length - 1) {
            var arrow = document.createElement('span');
            arrow.className = 'result-path-arrow';
            arrow.textContent = '\u2192';
            pathEl.appendChild(arrow);
          }
        });
      } else {
        pathEl.innerHTML = '';
      }
    }

    var backToNeuralBtn = document.querySelector('.result-back-btn');
    if (backToNeuralBtn) {
      backToNeuralBtn.style.display = isTimedOut ? 'none' : '';
    }

    var r = document.getElementById('s-result');
    if (r) { r.checked = true; GS.currentScreen = 's-result'; }

    // Stat line
    var kws = window.ScreenPopulators ? window.ScreenPopulators.getCheckedKeywords() : [];
    var pathParts = [];
    GS.networkSelectedInputs.forEach(function (idx) {
      if (GS.networkAllData[0][idx]) pathParts.push(GS.networkAllData[0][idx].text || GS.networkAllData[0][idx].word || '?');
    });
    if (GS.networkActiveContextIdx !== null && GS.networkAllData[1][GS.networkActiveContextIdx]) pathParts.push(GS.networkAllData[1][GS.networkActiveContextIdx].text);
    if (GS.networkActiveIntentIdx !== null && GS.networkAllData[2][GS.networkActiveIntentIdx]) pathParts.push(GS.networkAllData[2][GS.networkActiveIntentIdx].text);
    if (GS.networkActiveOutputIdx !== null && GS.networkAllData[3][GS.networkActiveOutputIdx]) pathParts.push(GS.networkAllData[3][GS.networkActiveOutputIdx].text);

    var statKw = document.getElementById('stat-keywords');
    var statFilter = document.getElementById('stat-filter');
    var statPath = document.getElementById('stat-path');
    var statMode = document.getElementById('stat-mode');
    var scoreLbl = document.getElementById('result-score-label');
    var scoreFill = document.getElementById('result-score-fill');

    if (statKw) {
      statKw.textContent = '[ KEYWORDS: ' + kws.length + ' ]';
      statKw.setAttribute('data-tooltip', kws.length ? kws.join(', ') : 'none selected');
    }
    if (statFilter) {
      var filterLabel = GS.selectedFilter ? GS.selectedFilter.toUpperCase() : 'NONE';
      statFilter.textContent = '[ FILTER: ' + filterLabel + ' ]';
      statFilter.setAttribute('data-tooltip', GS.selectedFilter ? GS.selectedFilter + ' filter active' : 'No filter applied');
    }
    if (statPath) {
      statPath.textContent = '[ PATH: ' + pathParts.length + ' NODES ]';
      statPath.setAttribute('data-tooltip', pathParts.length ? pathParts.join(' \u2192 ') : 'no path');
    }
    if (statMode) {
      var modeLabel = mode ? mode.toUpperCase() : '\u2014';
      var typeLabel = type ? type.toUpperCase() : '\u2014';
      statMode.textContent = '[ MODE: ' + modeLabel + ' / ' + typeLabel + ' ]';
      statMode.setAttribute('data-tooltip', 'Answer mode: ' + (mode || '\u2014') + '  |  Type: ' + (type || '\u2014'));
    }

    // Score
    var filterOk = filterIsCorrect;
    var pickedTop = GS.networkActiveOutputIdx === 0;
    var hasKw = isValidKeywordSelection();
    var score = (pickedTop ? 40 : 0) + (hasKw ? 30 : 0) + (filterOk ? 30 : 0);
    if (scoreLbl) scoreLbl.textContent = '[ MATCH: ' + score + '% ]';
    if (scoreFill) {
      scoreFill.classList.remove('score-flash');
      scoreFill.classList.toggle('score-high', score >= 70);
      scoreFill.classList.toggle('score-low', score < 40);
      scoreFill.style.width = '0%';
      void scoreFill.offsetWidth;
      setTimeout(function () { scoreFill.style.width = score + '%'; }, 100);
      scoreFill.addEventListener('transitionend', function onFillDone(e) {
        if (e.propertyName !== 'width') return;
        scoreFill.removeEventListener('transitionend', onFillDone);
        scoreFill.classList.add('score-flash');
        setTimeout(function () { scoreFill.classList.remove('score-flash'); }, 650);
      });
    }

    // AI panel reveal
    var aiPanel = document.querySelector('.ai-panel');
    if (aiPanel) {
      aiPanel.classList.remove('revealed');
      setTimeout(function () {
        aiPanel.classList.add('revealed');
        window.typeIntoResultSpan('aiTypeSpan', 'ai', realAnswer, 0);
      }, 750);
    }
  }

  function isValidKeywordSelection() {
    var hasStrongKeywordSelected = false;
    GS.networkSelectedInputs.forEach(function (idx) {
      if (GS.networkAllData[0] && GS.networkAllData[0][idx]) {
        var keyword = GS.networkAllData[0][idx].word || GS.networkAllData[0][idx].text;
        if (keyword && !GS.WEAK_KEYWORDS.has(keyword.toLowerCase())) {
          hasStrongKeywordSelected = true;
        }
      }
    });
    return hasStrongKeywordSelected;
  }

  window.ResultScreen = {
    show: showResultScreen,
    generateCreativeFictionalAnswer: generateCreativeFictionalAnswer,
    isValidKeywordSelection: isValidKeywordSelection
  };
})();