const GameLogic = (function() {
  let currentScreen = 'intro';
  let selectedKeywords = [];
  let networkSteps = [];
  let networkCols = [80, 280, 500, 720];
  let modeSelected = false;
  let typeSelected = false;
  const SVGNS = 'http://www.w3.org/2000/svg';

  function svgEl(name, attrs) {
    const el = document.createElementNS(SVGNS, name);
    if (attrs) Object.keys(attrs).forEach(k => el.setAttribute(k, attrs[k]));
    return el;
  }

  function goToScreen(id) { const r = document.getElementById(id); if (r) { r.checked = true; currentScreen = id; } }
  function getCurrentScreen() { return currentScreen; }
  function setModeSelected(s) { modeSelected = s; }
  function setTypeSelected(s) { typeSelected = s; }
  function isModeSelected() { return modeSelected; }
  function isTypeSelected() { return typeSelected; }
  function setSelectedKeywords(kws) { selectedKeywords = kws; }
  function getSelectedKeywords() { return selectedKeywords; }
  function getNetworkSteps() { return networkSteps; }
  function resetNetworkState() { networkSteps = []; }

  function resetGame() {
    networkSteps = [];
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

  function populatePromptScreen(q) {
    if (!q) return;
    const el = document.getElementById('prompt-text');
    if (el) el.textContent = '\u201C' + q.prompt + '\u201D';
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

  // Build the neural network as a multi-step decision tree
  function populateNeuralScreen(q) {
    if (!q) return;
    const container = document.getElementById('neural-mapping-container');
    if (!container) return;

    // Reset steps
    networkSteps = [];

    // Get only the keywords the user checked in the Keywords screen
    const checkedKeywords = getCheckedKeywords();
    const allLayers = q.layers || [];

    // Filter layers to only show checked keywords
    const layers = allLayers.filter(layerItem =>
      checkedKeywords.some(kw => kw.toLowerCase() === layerItem.word.toLowerCase())
    );

    if (layers.length === 0) {
      container.innerHTML = '<div class="panel"><p style="color:var(--color-text-secondary);text-align:center;">No keywords selected. Go back and select at least 3 keywords.</p></div>';
      return;
    }

    container.innerHTML = '';
    container.style.cssText = 'padding:1rem;display:flex;flex-direction:column;align-items:center;';

    const title = document.createElement('h2'); title.textContent = 'Neural Network'; title.style.marginBottom = '1rem'; container.appendChild(title);
    const desc = document.createElement('p'); desc.className = 'subtitle'; desc.textContent = 'Click a word from the input layer, then choose probabilities through the hidden layers until you reach the output.'; desc.style.marginBottom = '3rem'; desc.style.textAlign = 'center'; desc.style.maxWidth = '40rem'; container.appendChild(desc);

    // SVG visualization
    const svgWidth = 900;
    const svgHeight = 500;
    const svg = svgEl('svg', { viewBox: '0 0 ' + svgWidth + ' ' + svgHeight, width: '100%', height: svgHeight });
    svg.style.cssText = 'max-width:900px;background:var(--color-dark-panel);border:1px solid var(--color-dark-lighter);display:block;margin:0 auto;';

    const cols = networkCols;
    const colLabels = ['Input Layer', 'Context Layer', 'Intent Layer', 'Output'];

    // Layer title labels
    colLabels.forEach((label, i) => {
      const txt = svgEl('text', { x: cols[i], y: 25, 'text-anchor': 'middle', fill: '#F2F2F2', 'font-size': '12', 'font-weight': '700' });
      txt.textContent = label;
      svg.appendChild(txt);
    });

    // Draw vertical dashed lines to separate layers
    for (let i = 1; i < cols.length; i++) {
      const line = svgEl('line', { x1: (cols[i-1] + cols[i]) / 2, y1: 35, x2: (cols[i-1] + cols[i]) / 2, y2: svgHeight - 10, stroke: '#333', 'stroke-width': '1', 'stroke-dasharray': '4,4' });
      line.style.opacity = '0.3';
      svg.appendChild(line);
    }

    container.appendChild(svg);

    // Path display
    const pathContainer = document.createElement('div');
    pathContainer.id = 'neural-path';
    pathContainer.style.cssText = 'margin-top:2rem;padding:1.5rem;background:var(--color-dark-panel);border:1px solid var(--color-dark-lighter);min-height:3rem;display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;justify-content:center;width:100%;max-width:900px;';
    pathContainer.innerHTML = '<span style="color:var(--color-text-secondary);font-size:0.875rem;">Click a red input node to start</span>';
    container.appendChild(pathContainer);

    // Draw input layer nodes (the selected keywords)
    const inputNodes = [];
    const inputSpacing = Math.min(70, (svgHeight - 100) / Math.max(1, layers.length - 1));
    const inputStartY = (svgHeight - (inputSpacing * (layers.length - 1))) / 2;

    layers.forEach((layerData, i) => {
      const y = inputStartY + i * inputSpacing;
      const group = svgEl('g', { 'data-layer': i, 'data-type': 'input' });
      group.style.cursor = 'pointer';

      const circle = svgEl('circle', { cx: cols[0], cy: y, r: 26, fill: '#A40000', stroke: '#C00000', 'stroke-width': '2' });
      circle.style.transition = 'fill 0.3s, stroke 0.3s';
      group.appendChild(circle);

      const displayText = layerData.word.length > 10 ? layerData.word.substring(0, 9) + '..' : layerData.word;
      const text = svgEl('text', { x: cols[0], y: y + 4, 'text-anchor': 'middle', fill: '#FFFFFF', 'font-size': '10', 'font-weight': '600' });
      text.textContent = displayText;
      group.appendChild(text);

      (function(layerIdx, layerItem) {
        group.addEventListener('click', function() {
          // Reset all input nodes
          inputNodes.forEach(n => {
            n.querySelector('circle').setAttribute('fill', '#A40000');
            n.querySelector('circle').setAttribute('stroke', '#C00000');
            n.querySelector('circle').setAttribute('stroke-width', '2');
          });
          // Check if already selected - deselect if so
          if (networkSteps.length > 0 && networkSteps[0].word === layerItem.word) {
            this.querySelector('circle').setAttribute('fill', '#A40000');
            this.querySelector('circle').setAttribute('stroke', '#C00000');
            this.querySelector('circle').setAttribute('stroke-width', '2');
            removeLayer(svg, 1);
            networkSteps = [];
            updatePathDisplay();
            return;
          }

          this.querySelector('circle').setAttribute('fill', '#C00000');
          this.querySelector('circle').setAttribute('stroke', '#FF4444');
          this.querySelector('circle').setAttribute('stroke-width', '3');

          // Remove any nodes after column 1
          removeLayer(svg, 1);

          // Add connection line from input to context options
          const line = svgEl('line', { x1: cols[0] + 26, y1: y, x2: cols[1] - 26, y2: 0, stroke: '#C00000', 'stroke-width': '2' });
          line.style.opacity = '0.5';
          svg.appendChild(line);

          // Show context options for this layer
          showLayer1Options(svg, layerItem.options, cols[1], layerItem.word, line);

          // Update path
          networkSteps = [{ word: layerItem.word, option: null, next: null }];
          updatePathDisplay();
        });
      })(i, layerData);

      svg.appendChild(group);
      inputNodes.push(group);
    });
  }

  function showLayer1Options(svg, options, x, parentWord, connectorLine) {
    const svgHeight = 500;
    const spacing = Math.min(100, (svgHeight - 120) / Math.max(1, options.length - 1));
    const startY = (svgHeight - (spacing * (options.length - 1))) / 2;

    const contextNodes = [];
    options.forEach((opt, i) => {
      const y = startY + i * spacing;
      const group = svgEl('g', { 'data-type': 'context' });
      group.style.cursor = 'pointer';
      group.style.opacity = '0';
      group.style.transition = 'opacity 0.3s';

      const circle = svgEl('circle', { cx: x, cy: y, r: 26, fill: '#1E3A8A', stroke: '#3B82F6', 'stroke-width': '2' });
      group.appendChild(circle);

      // Probability badge
      const probBadge = svgEl('text', { x: x, y: y - 14, 'text-anchor': 'middle', fill: '#3B82F6', 'font-size': '10', 'font-weight': '700' });
      probBadge.textContent = opt.prob + '%';
      group.appendChild(probBadge);

      const text = svgEl('text', { x: x, y: y + 4, 'text-anchor': 'middle', fill: '#FFFFFF', 'font-size': '10', 'font-weight': '600' });
      text.textContent = opt.text.length > 14 ? opt.text.substring(0, 13) + '..' : opt.text;
      group.appendChild(text);

      // Update connector line to point to first option
      if (i === 0 && connectorLine) {
        connectorLine.setAttribute('y2', y);
      }

      (function(optIdx, optItem) {
        group.addEventListener('click', function() {
          // Reset all context nodes
          contextNodes.forEach(n => {
            n.querySelector('circle').setAttribute('fill', '#1E3A8A');
            n.querySelector('circle').setAttribute('stroke', '#3B82F6');
            n.querySelector('circle').setAttribute('stroke-width', '2');
          });
          this.querySelector('circle').setAttribute('fill', '#3B82F6');
          this.querySelector('circle').setAttribute('stroke', '#93C5FD');
          this.querySelector('circle').setAttribute('stroke-width', '3');

          // Remove layers 2+
          removeLayer(svg, 2);

          // Show intent options (next layer)
          showLayer2Options(svg, optItem.next, networkCols[2], optItem.text);

          // Update path
          if (networkSteps.length > 0) {
            networkSteps[0].option = optItem.text;
          }
          updatePathDisplay();
        });
      })(i, opt);

      svg.appendChild(group);
      contextNodes.push(group);

      // Animate appearance
      setTimeout(function() { group.style.opacity = '1'; }, 100 + i * 100);
    });

    // Store reference for cleanup
    svg._contextNodes = contextNodes;
  }

  function showLayer2Options(svg, nextOptions, x, parentText) {
    if (!nextOptions || nextOptions.length === 0) return;

    const svgHeight = 500;
    const spacing = Math.min(100, (svgHeight - 120) / Math.max(1, nextOptions.length - 1));
    const startY = (svgHeight - (spacing * (nextOptions.length - 1))) / 2;

    const intentNodes = [];
    nextOptions.forEach((optText, i) => {
      const y = startY + i * spacing;
      // Parse "Label prob%" format
      const match = optText.match(/^(.+?)\s+(\d+)%$/);
      const label = match ? match[1] : optText;
      const prob = match ? match[2] : '0';

      const group = svgEl('g', { 'data-type': 'intent' });
      group.style.cursor = 'pointer';
      group.style.opacity = '0';
      group.style.transition = 'opacity 0.3s';

      const circle = svgEl('circle', { cx: x, cy: y, r: 24, fill: '#1E3A8A', stroke: '#3B82F6', 'stroke-width': '2' });
      group.appendChild(circle);

      // Probability badge
      const probBadge = svgEl('text', { x: x, y: y - 14, 'text-anchor': 'middle', fill: '#3B82F6', 'font-size': '10', 'font-weight': '700' });
      probBadge.textContent = prob + '%';
      group.appendChild(probBadge);

      const text = svgEl('text', { x: x, y: y + 4, 'text-anchor': 'middle', fill: '#FFFFFF', 'font-size': '9', 'font-weight': '600' });
      text.textContent = label.length > 14 ? label.substring(0, 13) + '..' : label;
      group.appendChild(text);

      (function(optIdx, labelText, probText) {
        group.addEventListener('click', function() {
          // Reset intent nodes
          intentNodes.forEach(n => {
            n.querySelector('circle').setAttribute('fill', '#1E3A8A');
            n.querySelector('circle').setAttribute('stroke', '#3B82F6');
            n.querySelector('circle').setAttribute('stroke-width', '2');
          });
          this.querySelector('circle').setAttribute('fill', '#3B82F6');
          this.querySelector('circle').setAttribute('stroke', '#93C5FD');
          this.querySelector('circle').setAttribute('stroke-width', '3');

          // Remove output layer if exists
          removeLayer(svg, 3);

          // Show output
          showOutputOptions(svg, labelText, networkCols[3]);

          // Update path
          if (networkSteps.length > 0) {
            networkSteps[0].next = labelText;
          }
          updatePathDisplay();
        });
      })(i, label, prob);

      svg.appendChild(group);
      intentNodes.push(group);

      setTimeout(function() { group.style.opacity = '1'; }, 100 + i * 100);
    });

    svg._intentNodes = intentNodes;
  }

  function showOutputOptions(svg, parentText, x) {
    const svgHeight = 500;

    // Generate contextual output based on the path
    const outputPath = networkSteps.map(s => s.word + ' -> ' + (s.option || '') + ' -> ' + (s.next || '')).join(' | ');

    // Simple output generation based on parent text
    const outputs = [
      { label: parentText + ' (result)', prob: 75 },
      { label: 'Alternative result', prob: 20 },
      { label: 'Other possibility', prob: 5 }
    ];

    const outputNodes = [];
    outputs.forEach((out, i) => {
      const y = svgHeight / 2 - 60 + i * 60;
      const group = svgEl('g', { 'data-type': 'output' });
      group.style.cursor = 'pointer';
      group.style.opacity = '0';
      group.style.transition = 'opacity 0.3s';

      const circle = svgEl('circle', { cx: x, cy: y, r: 28, fill: '#2E7D32', stroke: '#4CAF50', 'stroke-width': '2' });
      group.appendChild(circle);

      // Probability badge
      const probBadge = svgEl('text', { x: x, y: y - 16, 'text-anchor': 'middle', fill: '#4CAF50', 'font-size': '10', 'font-weight': '700' });
      probBadge.textContent = out.prob + '%';
      group.appendChild(probBadge);

      const text = svgEl('text', { x: x, y: y + 4, 'text-anchor': 'middle', fill: '#FFFFFF', 'font-size': '9', 'font-weight': '600' });
      text.textContent = out.label.length > 16 ? out.label.substring(0, 15) + '..' : out.label;
      group.appendChild(text);

      (function(outItem) {
        group.addEventListener('click', function() {
          outputNodes.forEach(n => {
            n.querySelector('circle').setAttribute('fill', '#2E7D32');
            n.querySelector('circle').setAttribute('stroke', '#4CAF50');
            n.querySelector('circle').setAttribute('stroke-width', '2');
          });
          this.querySelector('circle').setAttribute('fill', '#66BB6A');
          this.querySelector('circle').setAttribute('stroke', '#A5D6A7');
          this.querySelector('circle').setAttribute('stroke-width', '3');

          if (networkSteps.length > 0) {
            networkSteps[0].output = outItem.label;
          }
          updatePathDisplay();
        });
      })(out);

      svg.appendChild(group);
      outputNodes.push(group);

      setTimeout(function() { group.style.opacity = '1'; }, 100 + i * 100);
    });

    svg._outputNodes = outputNodes;
  }

  function removeLayer(svg, fromLayer) {
    const elements = svg.querySelectorAll('g[data-type]');
    elements.forEach(el => {
      const type = el.getAttribute('data-type');
      if (fromLayer === 1 && type !== 'input') el.remove();
      if (fromLayer === 2 && (type === 'intent' || type === 'output')) el.remove();
      if (fromLayer === 3 && type === 'output') el.remove();
    });
    // Also remove connector lines (non-dashed lines that don't have data-layer)
    if (fromLayer >= 1) {
      const lines = svg.querySelectorAll('line:not([stroke-dasharray])');
      lines.forEach(l => {
        const strokeAttr = l.getAttribute('stroke');
        const opacity = l.style.opacity;
        // Only remove the red connector lines (not the dashed separator lines)
        if (strokeAttr !== '#333' && opacity !== '0.3') {
          l.remove();
        }
      });
    }
  }

  function updatePathDisplay() {
    const pathEl = document.getElementById('neural-path');
    if (!pathEl) return;
    if (networkSteps.length === 0 || !networkSteps[0].word) {
      pathEl.innerHTML = '<span style="color:var(--color-text-secondary);font-size:0.875rem;">Click a red input node to start</span>';
      return;
    }
    pathEl.innerHTML = '';
    const header = document.createElement('span'); header.style.cssText = 'font-size:0.75rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;margin-right:0.5rem;'; header.textContent = 'Path:'; pathEl.appendChild(header);

    const step = networkSteps[0];
    const parts = [];
    if (step.word) parts.push({ text: step.word, color: '#A40000' });
    if (step.option) parts.push({ text: step.option, color: '#1E3A8A' });
    if (step.next) parts.push({ text: step.next, color: '#3B82F6' });
    if (step.output) parts.push({ text: step.output, color: '#2E7D32' });

    parts.forEach((part, idx) => {
      const node = document.createElement('span');
      node.style.cssText = 'padding:0.35rem 0.75rem;background:' + part.color + ';color:#F2F2F2;border-radius:50px;font-size:0.875rem;font-weight:600;';
      node.textContent = part.text;
      pathEl.appendChild(node);
      if (idx < parts.length - 1) {
        const arrow = document.createElement('span');
        arrow.style.cssText = 'color:var(--color-text-secondary);font-size:1rem;';
        arrow.textContent = '\u2192';
        pathEl.appendChild(arrow);
      }
    });
  }

  function populateAnswerScreen(question, mode, type) {
    const badgeMode = document.getElementById('badge-mode');
    const badgeType = document.getElementById('badge-type');
    const badgeKeywords = document.getElementById('badge-keywords');
    const answerText = document.getElementById('answer-text');
    if (badgeMode) badgeMode.textContent = 'Mode: ' + (mode || 'Own Knowledge');
    if (badgeType) badgeType.textContent = 'Type: ' + (type || 'Accurate');
    if (badgeKeywords) badgeKeywords.textContent = 'Keywords: ' + document.querySelectorAll('.keyword-toggle:checked').length;
    if (answerText && question) {
      let response = '';
      if (networkSteps.length > 0 && networkSteps[0].word) {
        const s = networkSteps[0];
        response = 'Neural Network Path: ' + s.word + (s.option ? ' \u2192 ' + s.option : '') + (s.next ? ' \u2192 ' + s.next : '') + (s.output ? ' \u2192 ' + s.output : '') + '\n\n---\n\n';
      }
      response += question.answer || 'No answer available.';
      if (mode === 'internet') response += '\n\n[Sources: Synthesized from web references]';
      if (type === 'fast') { const ps = response.split('\n\n'); response = ps[0] || response; }
      answerText.textContent = response;
    }
  }

  window.updateKwCount = function() {
    const checked = document.querySelectorAll('.keyword-toggle:checked').length;
    const countEl = document.getElementById('kw-count');
    if (countEl) countEl.textContent = checked;
    const btn = document.getElementById('kw-continue');
    if (btn) { if (checked >= 3) btn.classList.remove('btn-disabled'); else btn.classList.add('btn-disabled'); }
  };

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
    populatePromptScreen: populatePromptScreen,
    populateKeywordScreen: populateKeywordScreen,
    populateSemanticScreen: populateSemanticScreen,
    populateNeuralScreen: populateNeuralScreen,
    populateAnswerScreen: populateAnswerScreen
  };
})();