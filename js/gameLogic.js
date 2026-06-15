const GameLogic = (function() {
  let currentScreen = 'intro';
  let selectedKeywords = [];
  let modeSelected = false;
  let typeSelected = false;
  const SVGNS = 'http://www.w3.org/2000/svg';

  // Neural network state
  let networkSelectedInputs = new Set(); // multiple input selections (indices)
  let networkActiveInputIdx = null;      // most recently clicked input (for chain)
  let networkActiveContextIdx = null;    // selected context index
  let networkActiveIntentIdx = null;     // selected intent index
  let networkActiveOutputIdx = null;     // selected output index
  let networkAllNodes = [[], [], [], []]; // SVG group elements per layer
  let networkAllData = [[], [], [], []]; // data items per layer
  let networkConnections = []; // [{line, fromLayer, fromIdx, toLayer, toIdx}]
  let networkNodeRadius = 60;  // shared radius for all layers (set from layer 0)
  let networkNodeSpacing = 200; // shared vertical spacing (set from layer 0)
  let networkSvg = null;
  let networkSvgWidth = 820;
  let networkSvgHeight = 420;
  let currentQuestionRef = null;

  function svgEl(name, attrs) {
    const el = document.createElementNS(SVGNS, name);
    if (attrs) Object.keys(attrs).forEach(k => el.setAttribute(k, attrs[k]));
    return el;
  }

  // Wrap text inside a circle using <tspan> elements, vertically centred at cy
  function drawWrappedNodeText(textEl, rawText, cx, cy, nodeRadius, fontSize) {
    var lineHeight = fontSize * 1.25;
    var maxWidth = nodeRadius * 1.65; // ~82% of diameter
    var avgCharWidth = fontSize * 0.56;
    var charsPerLine = Math.max(3, Math.floor(maxWidth / avgCharWidth));

    var words = rawText.split(' ');
    var lines = [];
    var current = '';
    words.forEach(function(word) {
      var candidate = current ? current + ' ' + word : word;
      if (candidate.length <= charsPerLine) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word.length > charsPerLine ? word.substring(0, charsPerLine - 2) + '..' : word;
      }
    });
    if (current) lines.push(current);

    var totalHeight = (lines.length - 1) * lineHeight;
    lines.forEach(function(line, i) {
      var tspan = document.createElementNS(SVGNS, 'tspan');
      tspan.setAttribute('x', String(Math.round(cx)));
      tspan.setAttribute('y', String(Math.round(cy - totalHeight / 2 + i * lineHeight)));
      tspan.textContent = line;
      textEl.appendChild(tspan);
    });
  }

  function goToScreen(id) { const r = document.getElementById(id); if (r) { r.checked = true; currentScreen = id; } }
  function getCurrentScreen() { return currentScreen; }
  function setModeSelected(s) { modeSelected = s; }
  function setTypeSelected(s) { typeSelected = s; }
  function isModeSelected() { return modeSelected; }
  function isTypeSelected() { return typeSelected; }
  function setSelectedKeywords(kws) { selectedKeywords = kws; }
  function getSelectedKeywords() { return selectedKeywords; }

  function getNetworkSteps() {
    const result = [{}];
    if (networkActiveInputIdx !== null && networkAllData[0][networkActiveInputIdx]) {
      result[0].word = networkAllData[0][networkActiveInputIdx].word || networkAllData[0][networkActiveInputIdx].text;
    }
    if (networkActiveContextIdx !== null && networkAllData[1][networkActiveContextIdx]) {
      result[0].option = networkAllData[1][networkActiveContextIdx].text;
    }
    if (networkActiveIntentIdx !== null && networkAllData[2][networkActiveIntentIdx]) {
      result[0].next = networkAllData[2][networkActiveIntentIdx].text;
    }
    if (networkActiveOutputIdx !== null && networkAllData[3][networkActiveOutputIdx]) {
      result[0].output = networkAllData[3][networkActiveOutputIdx].text;
    }
    if (!result[0].word) return [];
    return result;
  }

  function resetNetworkState() {
    networkSelectedInputs = new Set();
    networkActiveInputIdx = null;
    networkActiveContextIdx = null;
    networkActiveIntentIdx = null;
    networkActiveOutputIdx = null;
    networkAllNodes = [[], [], [], []];
    networkAllData = [[], [], [], []];
    networkConnections = [];
    networkNodeRadius = 60;
    networkNodeSpacing = 200;
    networkSvg = null;
  }

  function resetGame() {
    resetNetworkState();
    modeSelected = false; typeSelected = false;
    document.querySelectorAll('.choice-radio').forEach(r => r.checked = false);
    document.querySelectorAll('.keyword-toggle').forEach(cb => cb.checked = false);
    updateContinueBtn();
    if (typeof window.updateKwCount === 'function') window.updateKwCount();
    document.querySelectorAll('.text-input[id^="sa-input"]').forEach(inp => inp.value = '');
    document.querySelectorAll('.status-dot').forEach(d => d.classList.remove('dot-active'));
    if (typeof window.updateSaContinue === 'function') window.updateSaContinue();
  }

  function updateContinueBtn() {
    const mode = document.querySelector('.choice-radio[name="mode"]:checked');
    const type = document.querySelector('.choice-radio[name="type"]:checked');
    const enabled = document.getElementById('btn-continue');
    const disabled = document.getElementById('btn-continue-disabled');
    if (enabled && disabled) {
      if (mode && type) { enabled.style.display = 'inline-flex'; disabled.style.display = 'none'; }
      else { enabled.style.display = 'none'; disabled.style.display = 'inline-flex'; }
    }
  }

  function updateSaContinue() {
    const inputs = document.querySelectorAll('.text-input[id^="sa-input"]');
    let allFilled = true;
    inputs.forEach(inp => { if (!inp.value.trim()) allFilled = false; });
    const btn = document.getElementById('sa-continue');
    if (btn) {
      if (allFilled) btn.classList.remove('btn-disabled');
      else btn.classList.add('btn-disabled');
    }
  }

  function populatePromptScreen(q) {
    if (!q) return;
    const el = document.getElementById('prompt-text');
    if (el) el.textContent = q.prompt;
  }

  function populateKeywordScreen(q) {
    if (!q) return;
    const el = document.querySelector('.keyword-tags');
    if (!el) return;
    el.innerHTML = '';
    const kws = q.keywords || [];
    kws.forEach((kw, index) => {
      const label = document.createElement('label');
      let checkbox;
      if (index < 6) { const existingCb = document.getElementById('kw' + index); if (existingCb) checkbox = existingCb; }
      if (!checkbox) { checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'keyword-toggle'; checkbox.id = 'kw' + (index + 6); }
      const span = document.createElement('span'); span.className = 'keyword-tag'; span.textContent = kw;
      label.appendChild(checkbox); label.appendChild(span);
      checkbox.addEventListener('change', function() { window.updateKwCount(); });
      el.appendChild(label);
    });
    for (let i = kws.length; i < 6; i++) { const cb = document.getElementById('kw' + i); if (cb) { const lbl = cb.closest('label'); if (lbl) lbl.style.display = 'none'; } }
  }

  function populateSemanticScreen(q) {
    if (!q || !q.analysis) return;
    const inputs = document.querySelectorAll('.text-input[id^="sa-input"]');
    if (inputs.length >= 3) {
      inputs[0].value = q.analysis.topic || '';
      inputs[1].value = q.analysis.intent || '';
      inputs[2].value = q.analysis.language || '';
      inputs.forEach((inp, idx) => { const dot = document.getElementById('dot-' + idx); if (dot && inp.value.trim()) dot.classList.add('dot-active'); });
    }
    window.updateSaContinue();
  }

  function getCheckedKeywords() {
    const result = [];
    document.querySelectorAll('.keyword-toggle:checked').forEach(cb => {
      const parentLabel = cb.closest('label');
      if (parentLabel) { const span = parentLabel.querySelector('.keyword-tag'); if (span) result.push(span.textContent); }
    });
    return result;
  }

  // ─── Neural Network Visualization ───────────────────────────────────

  function getLayerCols(svgWidth) {
    var padding = 200;
    var available = svgWidth - 2 * padding;
    return [
      padding,
      padding + available / 3,
      padding + 2 * available / 3,
      svgWidth - padding
    ];
  }

  function getNodeColors(layerIndex) {
    return { base: 'rgba(255,255,255,0.3)', border: 'white', active: '#004284', activeBorder: '#004284' };
  }

  function getNodeRadius(layerIndex) {
    return 80; // ceiling — actual radius is clamped to spacing in drawLayerNodes
  }

  function calculateSvgHeight() {
    // 14rem padding-top (224) + heading (80) + bottom padding (64) ≈ 368px consumed
    return Math.max(400, window.innerHeight - 368);
  }

  function populateNeuralScreen(q) {
    if (!q) return;
    var container = document.getElementById('neural-mapping-container');
    if (!container) return;

    // Reset all neural network state
    resetNetworkState();
    currentQuestionRef = q;

    // Get only the keywords the user checked in the Keywords screen
    var checkedKeywords = getCheckedKeywords();
    var allLayers = q.layers || [];

    // Filter layers to only show checked keywords
    var layers = allLayers.filter(function(layerItem) {
      return checkedKeywords.some(function(kw) { return kw.toLowerCase() === layerItem.word.toLowerCase(); });
    });

    if (layers.length === 0) {
      container.innerHTML = '<div class="panel"><p style="color:var(--color-text-secondary);text-align:center;">No keywords selected. Go back and select at least 3 keywords.</p></div>';
      return;
    }

    container.innerHTML = '';
    container.style.cssText = 'display:flex;flex-direction:row;align-items:flex-start;gap:3rem;width:100%;';

    var leftCol = document.createElement('div');
    leftCol.style.cssText = 'flex-shrink:0;width:300px;padding-top:1rem;';
    var desc = document.createElement('p');
    desc.style.cssText = 'font-size:32px;font-weight:600;font-family:Inter,sans-serif;color:white;line-height:1.3;text-shadow:0 3px 8px rgba(0,0,0,0.35);margin:0;';
    desc.textContent = 'Use the neural network to find fitting connections that will help to form an answer. Choose four nodes.';
    leftCol.appendChild(desc);
    container.appendChild(leftCol);

    var rightCol = document.createElement('div');
    rightCol.style.cssText = 'flex:1;min-width:0;display:flex;flex-direction:column;';
    container.appendChild(rightCol);

    // Responsive SVG wrapper
    var svgWrapper = document.createElement('div');
    svgWrapper.style.cssText = 'width:100%;';
    rightCol.appendChild(svgWrapper);

    // Dynamic SVG sizing based on content
    // viewBox 1800 ≈ display content width → 1 SVG unit ≈ 1 CSS px
    networkSvgWidth = 1800;
    networkSvgHeight = calculateSvgHeight();

    networkSvg = svgEl('svg', { viewBox: '0 0 ' + networkSvgWidth + ' ' + networkSvgHeight, overflow: 'visible' });
    networkSvg.style.cssText = 'width:100%;height:auto;display:block;';
    svgWrapper.appendChild(networkSvg);

    var cols = getLayerCols(networkSvgWidth);
    var colLabels = ['Input Layer', 'Context Layer', 'Intent Layer', 'Output'];

    // Draw vertical dashed lines to separate layers (behind everything)
    for (var i = 1; i < cols.length; i++) {
      var line = svgEl('line', {
        x1: (cols[i-1] + cols[i]) / 2, y1: 0,
        x2: (cols[i-1] + cols[i]) / 2, y2: networkSvgHeight,
        stroke: '#ffffff', 'stroke-width': '1', 'stroke-dasharray': '6,6'
      });
      line.style.opacity = '0.15';
      networkSvg.appendChild(line);
    }

    // Draw input layer (layer 0) — always visible
    networkAllData[0] = layers.slice();
    drawLayerNodes(0, layers.map(function(l) {
      return { text: l.word, prob: null, sourceData: l };
    }));

    // Layer title labels drawn LAST so they always appear on top of nodes
    colLabels.forEach(function(label, i) {
      var txt = svgEl('text', { x: cols[i], y: 36, 'text-anchor': 'middle', fill: '#F2F2F2', 'font-size': '24', 'font-weight': '700' });
      txt.textContent = label;
      networkSvg.appendChild(txt);
    });

    // Path display
    var pathContainer = document.createElement('div');
    pathContainer.id = 'neural-path';
    pathContainer.style.cssText = 'margin-top:5rem;padding:1rem;background:rgba(255,255,255,0.3);border:1px solid white;min-height:2.5rem;display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;justify-content:center;align-self:center;width:70%;border-radius:8px;font-size:0.8125rem;';
    pathContainer.innerHTML = '<span style="color:white;font-size:1rem;">Click an input node to start</span>';
    rightCol.appendChild(pathContainer);

    // Handle window resize — recalculate connection line positions
    window.addEventListener('resize', function() {
      if (networkSvg) recalcConnectionPositions();
    });
  }

  function drawLayerNodes(layerIndex, items) {
    var cols = getLayerCols(networkSvgWidth);
    var x = cols[layerIndex];
    var svgHeight = networkSvgHeight;
    var count = items.length;
    var topPad = 170; // space reserved for column headers (baseline y=36, need clearance)
    var botPad = 30;
    var innerSpace = svgHeight - topPad - botPad;
    var spacing = innerSpace / Math.max(1, count - 1);
    spacing = Math.min(260, spacing);
    var nodeRadius = layerIndex === 0
      ? Math.min(getNodeRadius(layerIndex), Math.floor(spacing * 0.38))
      : networkNodeRadius; // all layers share the radius set by layer 0
    if (layerIndex === 0) { networkNodeRadius = nodeRadius; networkNodeSpacing = spacing; }
    // centre the node group within the inner space, always below column headers
    var startY = topPad + (innerSpace - spacing * (count - 1)) / 2;

    networkAllNodes[layerIndex] = [];
    networkAllData[layerIndex] = items.map(function(item) { return item.sourceData || item; });

    items.forEach(function(item, i) {
      var y = startY + i * spacing;
      var group = svgEl('g', { 'data-layer': String(layerIndex), 'data-index': String(i) });
      group.style.cursor = 'pointer';
      group.style.opacity = '0';
      group.style.transition = 'opacity 0.3s';

      var colors = getNodeColors(layerIndex);
      var circle = svgEl('circle', {
        cx: x, cy: y, r: nodeRadius,
        fill: colors.base, stroke: colors.border, 'stroke-width': '2'
      });
      circle.style.transition = 'fill 0.3s, stroke 0.3s, stroke-width 0.3s';
      group.appendChild(circle);

      // Probability badge
      if (item.prob !== null && item.prob !== undefined) {
        var probBadge = svgEl('text', {
          x: x, y: y - nodeRadius - 12, 'text-anchor': 'middle',
          fill: colors.border, 'font-size': '16', 'font-weight': '700'
        });
        probBadge.textContent = item.prob + '%';
        group.appendChild(probBadge);
      }

      // Label text with word-wrap inside circle
      var text = svgEl('text', { 'text-anchor': 'middle', fill: '#FFFFFF', 'font-size': '18', 'font-weight': '600' });
      drawWrappedNodeText(text, item.text, x, y, nodeRadius, 18);
      group.appendChild(text);

      // Click handler
      (function(capturedIdx, capturedData) {
        group.addEventListener('click', function() {
          handleNodeClick(layerIndex, capturedIdx, capturedData);
        });
      })(i, item.sourceData || item);

      networkSvg.appendChild(group);
      networkAllNodes[layerIndex].push(group);

      // Staggered fade-in
      setTimeout(function() { group.style.opacity = '1'; }, 40 + i * 70);
    });
  }

  // ─── Click Handling ─────────────────────────────────────────────────

  function handleNodeClick(layerIndex, nodeIndex, data) {
    if (layerIndex === 0) {
      handleInputClick(nodeIndex, data);
    } else if (layerIndex === 1) {
      handleContextClick(nodeIndex, data);
    } else if (layerIndex === 2) {
      handleIntentClick(nodeIndex, data);
    } else if (layerIndex === 3) {
      handleOutputClick(nodeIndex, data);
    }
  }

  function handleInputClick(nodeIndex, data) {
    // Toggle selection — multiple inputs can be selected
    if (networkSelectedInputs.has(nodeIndex)) {
      // Deselect this input
      networkSelectedInputs.delete(nodeIndex);
      resetNodeVisual(0, nodeIndex);
      // Remove any connections from this input to downstream
      removeConnectionsFromInput(nodeIndex);

      // Update active input index
      if (networkActiveInputIdx === nodeIndex) {
        networkActiveInputIdx = null;
        if (networkSelectedInputs.size > 0) {
          var lastIdx = null;
          networkSelectedInputs.forEach(function(idx) { lastIdx = idx; });
          networkActiveInputIdx = lastIdx;
        }
      }

      // If we deselected all inputs, clear downstream
      if (networkSelectedInputs.size === 0) {
        removeConnectionsFromLayer(0);
        clearLayerNodes(1);
        clearLayerNodes(2);
        clearLayerNodes(3);
        networkActiveContextIdx = null;
        networkActiveIntentIdx = null;
        networkActiveOutputIdx = null;
      }
    } else {
      // Select this input
      networkSelectedInputs.add(nodeIndex);
      networkActiveInputIdx = nodeIndex;

      // Show downstream context nodes if needed
      if (networkAllNodes[1].length === 0) {
        showNextLayerOptions(0, nodeIndex, data);
      }

      // Auto-activate the first context node if none is selected yet
      if (networkAllNodes[1].length > 0 && networkActiveContextIdx === null) {
        networkActiveContextIdx = 0;
        highlightNode(1, 0, true);
        drawAllInputConnections();
        if (networkAllData[1] && networkAllData[1][0] && networkAllNodes[2].length === 0) {
          showNextLayerOptions(1, 0, networkAllData[1][0]);
        }
      }

      // If there is already an active context, refresh input->context connections
      if (networkActiveContextIdx !== null) {
        drawAllInputConnections();
      }
    }

    // Visual: highlight all selected inputs
    networkAllNodes[0].forEach(function(node, idx) {
      if (networkSelectedInputs.has(idx)) {
        highlightNode(0, idx, idx === networkActiveInputIdx);
      } else {
        resetNodeVisual(0, idx);
      }
    });

    if (networkActiveContextIdx !== null && networkAllNodes[1][networkActiveContextIdx]) {
      drawAllInputConnections();
    }

    updatePathDisplay();
  }

  function handleContextClick(nodeIndex, data) {
    if (networkActiveContextIdx === nodeIndex) {
      // Deselect context
      resetNodeVisual(1, nodeIndex);
      networkActiveContextIdx = null;
      removeConnectionsFromLayer(1);
      clearLayerNodes(2);
      clearLayerNodes(3);
      networkActiveIntentIdx = null;
      networkActiveOutputIdx = null;
    } else {
      // Select context
      if (networkActiveContextIdx !== null) {
        resetNodeVisual(1, networkActiveContextIdx);
      }
      networkActiveContextIdx = nodeIndex;
      highlightNode(1, nodeIndex, true);

      // Clear old downstream connections and show new ones for this context
      removeConnectionsFromLayer(0);
      drawAllInputConnections();

      clearLayerNodes(2);
      clearLayerNodes(3);
      networkActiveIntentIdx = null;
      networkActiveOutputIdx = null;

      // Show intent options
      showNextLayerOptions(1, nodeIndex, data);
    }

    updatePathDisplay();
  }

  function handleIntentClick(nodeIndex, data) {
    if (networkActiveIntentIdx === nodeIndex) {
      // Deselect intent
      resetNodeVisual(2, nodeIndex);
      networkActiveIntentIdx = null;
      removeConnectionsFromLayer(2);
      clearLayerNodes(3);
      networkActiveOutputIdx = null;
    } else {
      // Select intent
      if (networkActiveIntentIdx !== null) {
        resetNodeVisual(2, networkActiveIntentIdx);
      }
      networkActiveIntentIdx = nodeIndex;
      highlightNode(2, nodeIndex, true);

      // Clear downstream connections from the intent layer before drawing new context->intent link
      removeConnectionsFromLayer(2);
      clearLayerNodes(3);
      networkActiveOutputIdx = null;

      // Draw connection from active context to this intent
      if (networkActiveContextIdx !== null) {
        drawConnection(1, networkActiveContextIdx, 2, nodeIndex);
      }

      // Show output options
      showNextLayerOptions(2, nodeIndex, data);
    }

    updatePathDisplay();
  }

  function handleOutputClick(nodeIndex, data) {
    if (networkActiveOutputIdx === nodeIndex) {
      // Deselect output
      resetNodeVisual(3, nodeIndex);
      networkActiveOutputIdx = null;
      removeConnectionsFromLayer(2);
    } else {
      // Select output
      if (networkActiveOutputIdx !== null) {
        resetNodeVisual(3, networkActiveOutputIdx);
      }
      networkActiveOutputIdx = nodeIndex;
      highlightNode(3, nodeIndex, true);

      // Draw connection from active intent to this output
      if (networkActiveIntentIdx !== null) {
        drawConnection(2, networkActiveIntentIdx, 3, nodeIndex);
      }

      // Navigate to result screen
      showResultScreen(nodeIndex, data);
    }

    updatePathDisplay();
  }

  // ─── Result Screen ─────────────────────────────────────────────────

  function showResultScreen(outputIdx, outputData) {
    var youText = document.getElementById('result-you-text');
    var aiText = document.getElementById('result-ai-text');
    var wrapper = document.getElementById('result-comparison-wrapper');
    var youBadge = document.getElementById('result-you-badge');
    var aiBadge = document.getElementById('result-ai-badge');
    if (!youText || !aiText) return;

    var isCorrect = (outputIdx === 0);
    var label = outputData.text ? outputData.text.replace(' (result)', '') : 'This answer';

    // Reset wrapper classes
    if (wrapper) {
      wrapper.className = isCorrect ? 'result-correct' : 'result-wrong';
    }

    // Set badges
    if (youBadge) {
      youBadge.textContent = 'Your Choice';
      youBadge.style.cssText = isCorrect
        ? 'background:rgba(107,203,119,0.15);color:#6BCB77;border:1px solid rgba(107,203,119,0.3);'
        : 'background:rgba(255,107,107,0.15);color:#FF6B6B;border:1px solid rgba(255,107,107,0.3);';
    }
    if (aiBadge) {
      aiBadge.textContent = isCorrect ? 'Correct Answer' : 'Fact-Checked Answer';
      aiBadge.style.cssText = isCorrect
        ? 'background:rgba(107,203,119,0.15);color:#6BCB77;border:1px solid rgba(107,203,119,0.3);'
        : 'background:rgba(255,165,0,0.15);color:#FFA500;border:1px solid rgba(255,165,0,0.3);';
    }

    // Get the real answer text from the question data
    var realAnswer = (currentQuestionRef && currentQuestionRef.answer) ? currentQuestionRef.answer : '';

    if (isCorrect) {
      // CORRECT: Both panels show the same real answer text
      var answerHtml = '<em style="font-size:0.875rem;color:var(--color-text-secondary);display:block;margin-bottom:0.5rem;">You selected ' + label + ' \u2014 that\u2019s correct!</em>' +
        '<span style="font-size:1rem;line-height:1.85;">' + realAnswer + '</span>';
      youText.innerHTML = answerHtml;
      aiText.innerHTML = '<em style="font-size:0.875rem;color:var(--color-text-secondary);display:block;margin-bottom:0.5rem;">Verified:</em>' +
        '<span style="font-size:1rem;line-height:1.85;">' + realAnswer + '</span>';
    } else {
      // WRONG: Selected shows convincing creative text, AI shows the real answer
      var fakeAns = generateCreativeFictionalAnswer(outputData, currentQuestionRef);
      youText.innerHTML = '<em style="font-size:0.875rem;color:var(--color-text-secondary);display:block;margin-bottom:0.5rem;">You selected ' + label + '</em>' +
        '<span style="font-size:1rem;line-height:1.85;">' + fakeAns + '</span>';
      aiText.innerHTML = '<em style="font-size:0.875rem;color:var(--color-text-secondary);display:block;margin-bottom:0.5rem;">The correct answer is ' + (currentQuestionRef && currentQuestionRef.layers && currentQuestionRef.layers[0] ? currentQuestionRef.layers[0].word : 'unknown') + ':</em>' +
        '<span style="font-size:1rem;line-height:1.85;">' + realAnswer + '</span>';
    }

    goToScreen('s-result');
  }

  function generateCreativeFictionalAnswer(outputData, question) {
    var label = outputData.text ? outputData.text.replace(' (result)', '') : 'This answer';
    var prompt = question && question.prompt ? question.prompt : 'this topic';
    var topic = question && question.analysis ? question.analysis.topic : 'this subject';
    var intent = question && question.analysis ? question.analysis.intent : '';

    // Generate a contextual fictional answer that sounds like a real answer to the prompt
    var introTemplates = [
      'Based on extensive research and cross-referencing multiple authoritative sources, ',
      'According to a comprehensive 2024 meta-analysis published in the Journal of ' + topic + ' Studies, ',
      'Recent findings from the International ' + topic + ' Research Consortium confirm that ',
      'A landmark study conducted by the Global ' + topic + ' Institute has definitively established that ',
      'Extensive peer-reviewed research from leading universities worldwide corroborates that ',
      'Historical documentation and modern archaeological evidence both confirm that '
    ];

    var bodyTemplates = [
      ' has been conclusively verified as the primary answer to this question. The research involved analyzing over 10,000 data points across 47 countries, with a confidence interval of 99.7%. Leading experts in the field have acknowledged this finding as the most comprehensive answer to date.',
      ' is indeed the correct answer. A 2023 longitudinal study spanning three decades tracked this answer through multiple independent verification channels, each confirming its accuracy. The study was conducted under the supervision of the International Board of ' + topic + ' Standards.',
      ' represents the most accurate answer available. This conclusion is supported by a coalition of over 200 researchers from prestigious institutions including Oxford, MIT, and the University of Tokyo, who collaborated on a multi-year project to establish definitive answers in this domain.',
      ' has been validated through rigorous cross-examination of primary sources, expert testimonials, and computational analysis. The methodology, published in the peer-reviewed journal "Advances in ' + topic + ' Research," employs a novel multi-layered verification framework.',
      ' is backed by substantial empirical evidence gathered over the past decade. Researchers at the National Institute of ' + topic + ' Studies used a combination of archival research, experimental validation, and machine learning analysis to arrive at this conclusion.'
    ];

    var closingTemplates = [
      ' This finding has been cited in over 300 academic publications and is now considered the definitive answer in academic circles.',
      ' The implications of this discovery extend far beyond the original research, influencing policy decisions and educational curricula worldwide.',
      ' Multiple independent research groups have successfully replicated these results, further solidifying this answer\'s credibility in the scientific community.',
      ' This conclusion has stood the test of rigorous peer review and has been endorsed by the International Academic Council for ' + topic + ' Studies.',
      ' Subsequent research has only strengthened this conclusion, with emerging data from new methodologies consistently supporting the original findings.'
    ];

    var intro = introTemplates[Math.floor(Math.random() * introTemplates.length)];
    var body = bodyTemplates[Math.floor(Math.random() * bodyTemplates.length)];
    var closing = closingTemplates[Math.floor(Math.random() * closingTemplates.length)];

    return intro + label + body + closing;
  }

  // ─── Visual Helpers ─────────────────────────────────────────────────

  function highlightNode(layerIndex, nodeIndex, isActive) {
    var node = networkAllNodes[layerIndex] && networkAllNodes[layerIndex][nodeIndex];
    if (!node) return;
    var colors = getNodeColors(layerIndex);
    var circle = node.querySelector('circle');
    if (isActive) {
      circle.setAttribute('fill', colors.active);
      circle.setAttribute('stroke', colors.activeBorder);
      circle.setAttribute('stroke-width', '3');
    } else {
      // Selected but not the active input — same dark blue, no white border
      circle.setAttribute('fill', colors.active);
      circle.setAttribute('stroke', colors.activeBorder);
      circle.setAttribute('stroke-width', '2');
    }
  }

  function resetNodeVisual(layerIndex, nodeIndex) {
    var node = networkAllNodes[layerIndex] && networkAllNodes[layerIndex][nodeIndex];
    if (!node) return;
    var colors = getNodeColors(layerIndex);
    var circle = node.querySelector('circle');
    circle.setAttribute('fill', colors.base);
    circle.setAttribute('stroke', colors.border);
    circle.setAttribute('stroke-width', '2');
  }

  // ─── Connections ────────────────────────────────────────────────────

  function drawConnection(fromLayer, fromIdx, toLayer, toIdx) {
    var fromNode = networkAllNodes[fromLayer][fromIdx];
    var toNode = networkAllNodes[toLayer][toIdx];
    if (!fromNode || !toNode) return;

    var fromCircle = fromNode.querySelector('circle');
    var toCircle = toNode.querySelector('circle');

    var x1 = parseFloat(fromCircle.getAttribute('cx'));
    var y1 = parseFloat(fromCircle.getAttribute('cy'));
    var x2 = parseFloat(toCircle.getAttribute('cx'));
    var y2 = parseFloat(toCircle.getAttribute('cy'));
    var r1 = parseFloat(fromCircle.getAttribute('r'));
    var r2 = parseFloat(toCircle.getAttribute('r'));

    var fromColors = getNodeColors(fromLayer);
    var line = svgEl('line', {
      x1: x1 + r1, y1: y1,
      x2: x2 - r2, y2: y2,
      stroke: fromColors.active, 'stroke-width': '2'
    });
    line.style.opacity = '0';
    line.style.transition = 'opacity 0.4s';
    line.setAttribute('data-conn-from', String(fromLayer));
    line.setAttribute('data-conn-to', String(toLayer));

    // Insert lines behind all node groups
    var firstGroup = networkSvg.querySelector('g[data-layer]');
    if (firstGroup) {
      networkSvg.insertBefore(line, firstGroup);
    } else {
      networkSvg.appendChild(line);
    }

    networkConnections.push({ line: line, fromLayer: fromLayer, fromIdx: fromIdx, toLayer: toLayer, toIdx: toIdx });

    // Fade in
    setTimeout(function() { line.style.opacity = '0.65'; }, 30);
  }

  // Draw connections from ALL selected inputs to the active context bubble
  function drawAllInputConnections() {
    // Remove existing layer 0→1 connections
    networkConnections = networkConnections.filter(function(conn) {
      if (conn.fromLayer === 0 && conn.toLayer === 1) {
        conn.line.remove();
        return false;
      }
      return true;
    });

    if (networkActiveContextIdx === null) return;

    networkSelectedInputs.forEach(function(inputIdx) {
      drawConnection(0, inputIdx, 1, networkActiveContextIdx);
    });
  }

  // Remove connections from a specific input node
  function removeConnectionsFromInput(inputIdx) {
    networkConnections = networkConnections.filter(function(conn) {
      if (conn.fromLayer === 0 && conn.fromIdx === inputIdx) {
        conn.line.remove();
        return false;
      }
      return true;
    });
  }

  function recalcConnectionPositions() {
    networkConnections.forEach(function(conn) {
      var fromNode = networkAllNodes[conn.fromLayer][conn.fromIdx];
      var toNode = networkAllNodes[conn.toLayer][conn.toIdx];
      if (!fromNode || !toNode) return;

      var fromCircle = fromNode.querySelector('circle');
      var toCircle = toNode.querySelector('circle');
      var r1 = parseFloat(fromCircle.getAttribute('r'));
      var r2 = parseFloat(toCircle.getAttribute('r'));

      conn.line.setAttribute('x1', parseFloat(fromCircle.getAttribute('cx')) + r1);
      conn.line.setAttribute('y1', fromCircle.getAttribute('cy'));
      conn.line.setAttribute('x2', parseFloat(toCircle.getAttribute('cx')) - r2);
      conn.line.setAttribute('y2', toCircle.getAttribute('cy'));
    });
  }

  function removeConnectionBetweenLayers(fromLayer, toLayer) {
    networkConnections = networkConnections.filter(function(conn) {
      if (conn.fromLayer === fromLayer && conn.toLayer === toLayer) {
        conn.line.remove();
        return false;
      }
      return true;
    });
  }

  function removeConnectionsFromLayer(layerIndex) {
    networkConnections = networkConnections.filter(function(conn) {
      if (conn.fromLayer >= layerIndex || conn.toLayer >= layerIndex) {
        conn.line.remove();
        return false;
      }
      return true;
    });
  }

  function clearLayerNodes(layerIndex) {
    if (networkAllNodes[layerIndex]) {
      networkAllNodes[layerIndex].forEach(function(node) { node.remove(); });
    }
    networkAllNodes[layerIndex] = [];
    networkAllData[layerIndex] = [];
  }

  // ─── Show Next Layer Options ────────────────────────────────────────

  function showNextLayerOptions(layerIndex, nodeIndex, data) {
    var nextLayer = layerIndex + 1;
    if (nextLayer >= 4) return;

    // Clear next layer and deeper
    clearLayerNodes(nextLayer);
    for (var l = nextLayer + 1; l < 4; l++) {
      clearLayerNodes(l);
    }

    var options = [];

    if (layerIndex === 0 && data && data.options) {
      // Input → Context
      options = data.options.map(function(opt) {
        return { text: opt.text, prob: opt.prob, sourceData: opt };
      });
    } else if (layerIndex === 1 && data && data.next) {
      // Context → Intent
      options = data.next.map(function(optText) {
        var match = optText.match(/^(.+?)\s+(\d+)%$/);
        var label = match ? match[1] : optText;
        var prob = match ? match[2] : '0';
        return { text: label, prob: prob, sourceData: { text: label, prob: prob, siblingOptions: data.next } };
      });
    } else if (layerIndex === 2) {
      // Intent → Output
      showOutputOptions(nextLayer, data);
      return;
    }

    if (options.length > 0) {
      drawLayerNodes(nextLayer, options);
    }
  }

  function showOutputOptions(layerIndex, parentData) {
    var cols = getLayerCols(networkSvgWidth);
    var x = cols[layerIndex];
    clearLayerNodes(layerIndex);

    // Generate contextual outputs from sibling intent options
    var outputs = [];
    if (parentData && parentData.siblingOptions && parentData.siblingOptions.length > 0) {
      outputs = parentData.siblingOptions.map(function(optText) {
        var match = optText.match(/^(.+?)\s+(\d+)%$/);
        var label = match ? match[1] : optText;
        var prob = match ? parseInt(match[2]) : 5;
        return { text: label + ' (result)', prob: prob, sourceData: { text: label + ' (result)' } };
      });
    } else {
      // Fallback
      var parentText = parentData ? (parentData.text || 'Result') : 'Result';
      outputs = [
        { text: parentText + ' (result)', prob: 75, sourceData: { text: parentText + ' (result)' } },
        { text: 'Alternative result', prob: 20, sourceData: { text: 'Alternative result' } },
        { text: 'Other possibility', prob: 5, sourceData: { text: 'Other possibility' } }
      ];
    }

    networkAllData[layerIndex] = outputs.map(function(o) { return o.sourceData; });
    var svgHeight = networkSvgHeight;
    var outCount = outputs.length;
    var spacing = networkNodeSpacing; // same spacing as all other layers
    var outRadius = networkNodeRadius; // same size as all other layers
    var topPad = 170;
    var innerSpace = svgHeight - topPad - 30;
    var startY = topPad + (innerSpace - spacing * (outCount - 1)) / 2;
    var colors = getNodeColors(layerIndex);

    outputs.forEach(function(out, i) {
      var y = startY + i * spacing;
      var group = svgEl('g', { 'data-layer': String(layerIndex), 'data-index': String(i) });
      group.style.cursor = 'pointer';
      group.style.opacity = '0';
      group.style.transition = 'opacity 0.3s';
      var circle = svgEl('circle', {
        cx: x, cy: y, r: outRadius,
        fill: colors.base, stroke: colors.border, 'stroke-width': '2'
      });
      circle.style.transition = 'fill 0.3s, stroke 0.3s, stroke-width 0.3s';
      group.appendChild(circle);

      var probBadgeEl = svgEl('text', {
        x: x, y: y - outRadius - 12, 'text-anchor': 'middle',
        fill: colors.border, 'font-size': '16', 'font-weight': '700'
      });
      probBadgeEl.textContent = out.prob + '%';
      group.appendChild(probBadgeEl);

      var text = svgEl('text', { 'text-anchor': 'middle', fill: '#FFFFFF', 'font-size': '18', 'font-weight': '600' });
      drawWrappedNodeText(text, out.text, x, y, outRadius, 18);
      group.appendChild(text);

      (function(capturedIdx, capturedData) {
        group.addEventListener('click', function() {
          handleNodeClick(layerIndex, capturedIdx, capturedData);
        });
      })(i, out.sourceData);

      networkSvg.appendChild(group);
      networkAllNodes[layerIndex].push(group);

      setTimeout(function() { group.style.opacity = '1'; }, 40 + i * 70);
    });
  }

  // ─── Path Display ───────────────────────────────────────────────────

  function updatePathDisplay() {
    var pathEl = document.getElementById('neural-path');
    if (!pathEl) return;

    var parts = [];
    var layerColors = ['#004284', '#004284', '#004284', '#004284'];

    // Show all selected inputs first
    if (networkSelectedInputs.size > 0) {
      var inputTexts = [];
      networkSelectedInputs.forEach(function(idx) {
        if (networkAllData[0][idx]) {
          inputTexts.push(networkAllData[0][idx].text || networkAllData[0][idx].word || '?');
        }
      });
      if (inputTexts.length > 0) {
        parts.push({ text: inputTexts.join(', '), color: '#004284' });
      }
    }

    // Then show the active chain
    if (networkActiveContextIdx !== null && networkAllData[1][networkActiveContextIdx]) {
      parts.push({ text: networkAllData[1][networkActiveContextIdx].text, color: '#004284' });
    }
    if (networkActiveIntentIdx !== null && networkAllData[2][networkActiveIntentIdx]) {
      parts.push({ text: networkAllData[2][networkActiveIntentIdx].text, color: '#004284' });
    }
    if (networkActiveOutputIdx !== null && networkAllData[3][networkActiveOutputIdx]) {
      parts.push({ text: networkAllData[3][networkActiveOutputIdx].text, color: '#004284' });
    }

    if (parts.length === 0) {
      pathEl.innerHTML = '<span style="color:white;font-size:0.8125rem;">Click an input node to start</span>';
      return;
    }

    pathEl.innerHTML = '';
    var header = document.createElement('span');
    header.style.cssText = 'font-size:1rem;color:white;text-transform:uppercase;letter-spacing:0.05em;margin-right:0.5rem;';
    header.textContent = 'Path:';
    pathEl.appendChild(header);

    parts.forEach(function(part, idx) {
      var node = document.createElement('span');
      node.style.cssText = 'padding:0.25rem 0.625rem;background:' + part.color + ';color:#F2F2F2;border-radius:50px;font-size:0.8125rem;font-weight:600;';
      node.textContent = part.text;
      pathEl.appendChild(node);
      if (idx < parts.length - 1) {
        var arrow = document.createElement('span');
        arrow.style.cssText = 'color:var(--color-text-secondary);font-size:0.875rem;';
        arrow.textContent = '\u2192';
        pathEl.appendChild(arrow);
      }
    });
  }

  // ─── Answer Screen ──────────────────────────────────────────────────

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
      if (type === 'fast') { var ps = response.split('\n\n'); response = ps[0] || response; }
      answerText.textContent = response;
    }
  }

  function updateKwCount() {
    var checked = document.querySelectorAll('.keyword-toggle:checked').length;
    var countEl = document.getElementById('kw-count');
    if (countEl) countEl.textContent = checked;
    var btn = document.getElementById('kw-continue');
    if (btn) { if (checked >= 3) btn.classList.remove('btn-disabled'); else btn.classList.add('btn-disabled'); }
  }

  window.updateKwCount = updateKwCount;
  window.updateSaContinue = updateSaContinue;

  return {
    goToScreen: goToScreen,
    getCurrentScreen: getCurrentScreen,
    setModeSelected: setModeSelected,
    setTypeSelected: setTypeSelected,
    isModeSelected: isModeSelected,
    isTypeSelected: isTypeSelected,
    setSelectedKeywords: setSelectedKeywords,
    getSelectedKeywords: getSelectedKeywords,
    getNetworkSteps: getNetworkSteps,
    resetNetworkState: resetNetworkState,
    resetGame: resetGame,
    updateContinueBtn: updateContinueBtn,
    updateSaContinue: updateSaContinue,
    updateKwCount: updateKwCount,
    populatePromptScreen: populatePromptScreen,
    populateKeywordScreen: populateKeywordScreen,
    populateSemanticScreen: populateSemanticScreen,
    populateNeuralScreen: populateNeuralScreen,
    populateAnswerScreen: populateAnswerScreen
  };
})();