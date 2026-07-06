/**
 * Screen population functions for prompt, keyword, semantic, neural, and answer screens.
 * Depends on: state.js, svgHelpers.js, neuralNetwork.js
 */

(function () {
  'use strict';
  var GS = window.__GS;
  var NN = window.NeuralNetwork;

  // ─── Prompt Screen ───────────────────────────────────────────────────

  function populatePromptScreen(q) {
    if (!q) return;
    GS.currentQuestionRef = q;
    var el = document.getElementById('prompt-text');
    var cursor = el ? el.nextElementSibling : null;
    var card = document.querySelector('.prompt-card');
    if (!el) return;
    var text = q.prompt;

    GS.promptTypeToken++;
    var myToken = GS.promptTypeToken;

    el.textContent = text;
    var body = document.querySelector('.prompt-terminal-body');
    if (body) body.style.minHeight = body.offsetHeight + 'px';
    el.textContent = '';

    if (card) { card.style.opacity = '0'; card.style.transition = 'opacity 0.4s ease'; }
    if (cursor) cursor.style.opacity = '0';

    setTimeout(function () {
      if (myToken !== GS.promptTypeToken) return;
      if (card) card.style.opacity = '1';
      var i = 0;
      function typeNext() {
        if (myToken !== GS.promptTypeToken) return;
        if (i < text.length) {
          el.textContent += text[i];
          i++;
          setTimeout(typeNext, 50);
        } else {
          if (cursor) cursor.style.opacity = '1';
        }
      }
      setTimeout(typeNext, 300);
    }, 50);
  }

  // ─── Keyword Screen ──────────────────────────────────────────────────

  function populateKeywordScreen(q) {
    if (!q) return;
    GS.currentQuestionRef = q;
    var el = document.querySelector('.keyword-tags');
    if (!el) return;
    el.innerHTML = '';
    var kws = q.keywords || [];
    kws.forEach(function (kw, index) {
      var label = document.createElement('label');
      var checkbox;
      if (index < 6) {
        var existingCb = document.getElementById('kw' + index);
        if (existingCb) checkbox = existingCb;
      }
      if (!checkbox) {
        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'keyword-toggle';
        checkbox.id = 'kw' + (index + 6);
      }
      var span = document.createElement('span');
      span.className = 'keyword-tag';
      span.textContent = kw;
      label.appendChild(checkbox);
      label.appendChild(span);
      checkbox.addEventListener('change', function () {
        if (typeof window.updateKwCount === 'function') window.updateKwCount();
      });
      el.appendChild(label);
    });
    for (var i = kws.length; i < 6; i++) {
      var cb = document.getElementById('kw' + i);
      if (cb) {
        var lbl = cb.closest('label');
        if (lbl) lbl.style.display = 'none';
      }
    }
  }

  // ─── Semantic Screen ─────────────────────────────────────────────────

  function populateSemanticScreen(q) {
    if (!q || !q.analysis) return;
    GS.currentQuestionRef = q;
    var inputs = document.querySelectorAll('.text-input[id^="sa-input"]');
    if (inputs.length >= 3) {
      inputs[0].value = q.analysis.topic || '';
      inputs[1].value = q.analysis.intent || '';
      inputs[2].value = q.analysis.language || '';
      inputs.forEach(function (inp, idx) {
        var dot = document.getElementById('dot-' + idx);
        if (dot && inp.value.trim()) dot.classList.add('dot-active');
      });
    }
    if (typeof window.updateSaContinue === 'function') window.updateSaContinue();
  }

  // ─── Neural Screen ───────────────────────────────────────────────────

  function getCheckedKeywords() {
    var result = [];
    document.querySelectorAll('.keyword-toggle:checked').forEach(function (cb) {
      var parentLabel = cb.closest('label');
      if (parentLabel) {
        var span = parentLabel.querySelector('.keyword-tag');
        if (span) result.push(span.textContent);
      }
    });
    return result;
  }

  function resetNetworkState() {
    GS.networkSelectedInputs.clear();
    GS.networkActiveInputIdx = null;
    GS.networkActiveContextIdx = null;
    GS.networkActiveIntentIdx = null;
    GS.networkActiveOutputIdx = null;
    GS.networkAllNodes.forEach(function (arr) { arr.length = 0; });
    GS.networkAllData.forEach(function (arr) { arr.length = 0; });
    GS.networkConnections.length = 0;
    GS.networkNodeRadius = 60;
    GS.networkNodeSpacing = 200;
    GS.networkSvg = null;
  }

  function populateNeuralScreen(q) {
    if (!q) return;
    var container = document.getElementById('neural-mapping-container');
    if (!container) return;

    resetNetworkState();
    GS.currentQuestionRef = q;

    var checkedKeywords = getCheckedKeywords();
    var allLayers = q.layers || [];

    var layers = allLayers.filter(function (layerItem) {
      if (!layerItem) return false;
      var targetWord = layerItem.word || (typeof layerItem === 'object' ? layerItem.text : '');
      if (!targetWord) return false;
      return checkedKeywords.some(function (kw) {
        return kw.toLowerCase() === targetWord.toLowerCase();
      });
    });

    if (layers.length === 0) {
      container.innerHTML = '<div class="panel"><p style="color:var(--color-text-secondary);text-align:center;">No keywords selected. Go back and select at least 3 keywords.</p></div>';
      return;
    }

    container.innerHTML = '';
    container.style.cssText = 'display:flex;flex-direction:row;align-items:flex-start;gap:3rem;width:100%;';

    var leftCol = document.createElement('div');
    leftCol.style.cssText = 'flex-shrink:0;width:280px;display:flex;flex-direction:column;justify-content:center;';
    var termHeader = document.createElement('div');
    termHeader.style.cssText = 'font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.25);padding-bottom:0.75rem;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:1rem;';
    termHeader.textContent = 'network.info';
    var desc = document.createElement('p');
    desc.style.cssText = 'font-size:16px;font-weight:500;font-family:"IBM Plex Mono",monospace;color:rgba(255,255,255,0.65);line-height:1.7;margin:0;';
    desc.innerHTML = '> Select one node per layer to build a path from input to output.';
    leftCol.appendChild(termHeader);
    leftCol.appendChild(desc);
    container.appendChild(leftCol);

    var rightCol = document.createElement('div');
    rightCol.style.cssText = 'flex:1;min-width:0;display:flex;flex-direction:column;';
    container.appendChild(rightCol);

    var svgWrapper = document.createElement('div');
    svgWrapper.style.cssText = 'width:100%;';
    rightCol.appendChild(svgWrapper);

    GS.networkSvgWidth = Math.round(svgWrapper.clientWidth) || 1800;
    GS.networkSvgHeight = NN.calculateSvgHeight(layers.length);

    GS.networkSvg = window.svgHelpers.svgEl('svg', {
      viewBox: '0 0 ' + GS.networkSvgWidth + ' ' + GS.networkSvgHeight,
      overflow: 'visible'
    });
    GS.networkSvg.style.cssText = 'width:100%;height:auto;display:block;';
    svgWrapper.appendChild(GS.networkSvg);

    // Dot-grid background
    var defs = window.svgHelpers.svgEl('defs', {});
    var gridPat = window.svgHelpers.svgEl('pattern', {
      id: 'dot-grid', x: '0', y: '0', width: '48', height: '48',
      patternUnits: 'userSpaceOnUse'
    });
    var gridDot = window.svgHelpers.svgEl('circle', {
      cx: '24', cy: '24', r: '1.5', fill: 'rgba(255,255,255,0.06)'
    });
    gridPat.appendChild(gridDot);
    defs.appendChild(gridPat);
    GS.networkSvg.appendChild(defs);
    var bgRect = window.svgHelpers.svgEl('rect', {
      x: '0', y: '0', width: String(GS.networkSvgWidth),
      height: String(GS.networkSvgHeight), fill: 'url(#dot-grid)'
    });
    GS.networkSvg.appendChild(bgRect);

    var cols = NN.getLayerCols(GS.networkSvgWidth);
    var colLabels = ['input.layer', 'context.layer', 'intent.layer', 'output'];

    // Vertical dashed lines
    for (var i = 1; i < cols.length; i++) {
      var line = window.svgHelpers.svgEl('line', {
        x1: (cols[i - 1] + cols[i]) / 2, y1: 0,
        x2: (cols[i - 1] + cols[i]) / 2, y2: GS.networkSvgHeight,
        stroke: '#ffffff', 'stroke-width': '1', 'stroke-dasharray': '6,6'
      });
      line.style.opacity = '0.08';
      GS.networkSvg.appendChild(line);
    }

    // Input layer
    GS.networkAllData[0] = layers.slice();
    NN.drawLayerNodes(0, layers.map(function (l) {
      return { text: l.word, prob: null, sourceData: l };
    }));

    // Layer title labels
    colLabels.forEach(function (label, i) {
      var txt = window.svgHelpers.svgEl('text', {
        x: cols[i], y: 32, 'text-anchor': 'middle',
        fill: 'rgba(255,255,255,0.3)', 'font-size': '14', 'font-weight': '700',
        'font-family': 'IBM Plex Mono, monospace', 'letter-spacing': '2'
      });
      txt.textContent = label.toUpperCase();
      GS.networkSvg.appendChild(txt);
    });

    // Path display
    var pathContainer = document.createElement('div');
    pathContainer.id = 'neural-path';
    var pathHeader = '<div style="font-family:\'IBM Plex Mono\',monospace;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.25);padding:0.5rem 1.25rem;background:rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.08);">path.trace</div>';
    var pathBody = '<div id="neural-path-body" style="padding:0.85rem 1.25rem;display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;justify-content:center;font-family:\'IBM Plex Mono\',monospace;">' + NN.buildPathPlaceholders(null, null, null, null) + '</div>';
    pathContainer.style.cssText = 'position:fixed;bottom:40px;left:410px;right:80px;background:rgba(0,8,20,0.92);border:1px solid rgba(255,255,255,0.12);border-radius:8px;overflow:hidden;z-index:20;backdrop-filter:blur(8px);';
    pathContainer.innerHTML = pathHeader + pathBody;
    container.appendChild(pathContainer);

    window.addEventListener('resize', function () {
      if (GS.networkSvg) NN.recalcConnectionPositions();
    });
  }

  // ─── Answer Screen ───────────────────────────────────────────────────

  function populateAnswerScreen(question, mode, type) {
    var badgeMode = document.getElementById('badge-mode');
    var badgeType = document.getElementById('badge-type');
    var badgeKeywords = document.getElementById('badge-keywords');
    var answerText = document.getElementById('answer-text');
    if (badgeMode) badgeMode.textContent = 'Mode: ' + (mode || 'Own Knowledge');
    if (badgeType) badgeType.textContent = 'Type: ' + (type || 'Accurate');
    if (badgeKeywords) badgeKeywords.textContent = 'Keywords: ' + document.querySelectorAll('.keyword-toggle:checked').length;
    if (answerText && question) {
      var response = '';
      var steps = getNetworkSteps();
      if (steps.length > 0 && steps[0].word) {
        var s = steps[0];
        response = 'Neural Network Path: ' + s.word + (s.option ? ' \u2192 ' + s.option : '') + (s.next ? ' \u2192 ' + s.next : '') + (s.output ? ' \u2192 ' + s.output : '') + '\n\n---\n\n';
      }
      response += question.answer || 'No answer available.';
      if (mode === 'internet') response += '\n\n[Sources: Synthesized from web references]';
      if (type === 'fast') {
        var ps = response.split('\n\n');
        response = ps[0] || response;
      }
      answerText.textContent = response;
    }
  }

  function getNetworkSteps() {
    var result = [{}];
    if (GS.networkActiveInputIdx !== null && GS.networkAllData[0][GS.networkActiveInputIdx]) {
      result[0].word = GS.networkAllData[0][GS.networkActiveInputIdx].word || GS.networkAllData[0][GS.networkActiveInputIdx].text;
    }
    if (GS.networkActiveContextIdx !== null && GS.networkAllData[1][GS.networkActiveContextIdx]) {
      result[0].option = GS.networkAllData[1][GS.networkActiveContextIdx].text;
    }
    if (GS.networkActiveIntentIdx !== null && GS.networkAllData[2][GS.networkActiveIntentIdx]) {
      result[0].next = GS.networkAllData[2][GS.networkActiveIntentIdx].text;
    }
    if (GS.networkActiveOutputIdx !== null && GS.networkAllData[3][GS.networkActiveOutputIdx]) {
      result[0].output = GS.networkAllData[3][GS.networkActiveOutputIdx].text;
      result[0].answerText = GS.networkAllData[3][GS.networkActiveOutputIdx].answerText;
    }
    if (!result[0].word) return [];
    return result;
  }

  // ─── Public API ──────────────────────────────────────────────────────

  window.ScreenPopulators = {
    populatePromptScreen: populatePromptScreen,
    populateKeywordScreen: populateKeywordScreen,
    populateSemanticScreen: populateSemanticScreen,
    populateNeuralScreen: populateNeuralScreen,
    populateAnswerScreen: populateAnswerScreen,
    getCheckedKeywords: getCheckedKeywords,
    getNetworkSteps: getNetworkSteps,
    resetNetworkState: resetNetworkState
  };
})();