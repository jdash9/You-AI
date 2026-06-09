#!/usr/bin/env python3
"""Generate gameLogic.js with proper escaping"""
import os

js_content = r'''/*
========================================================
Game Logic System
========================================================
Interactive 3-layer neural network visualization.
========================================================
*/

const GameLogic = (function() {
  let currentScreen = 'intro';
  let networkState = { inputSelected: null, hiddenSelected: null, outputSelected: null, path: [] };
  let modeSelected = false;
  let typeSelected = false;

  const SVGNS = 'http://www.w3.org/2000/svg';

  function svgEl(name, attrs) {
    const el = document.createElementNS(SVGNS, name);
    if (attrs) Object.keys(attrs).forEach(k => el.setAttribute(k, attrs[k]));
    return el;
  }

  function goToScreen(id) {
    const r = document.getElementById(id);
    if (r) { r.checked = true; currentScreen = id; }
  }

  function getCurrentScreen() { return currentScreen; }
  function setModeSelected(s) { modeSelected = s; }
  function setTypeSelected(s) { typeSelected = s; }
  function isModeSelected() { return modeSelected; }
  function isTypeSelected() { return typeSelected; }
  function resetNetworkState() {
    networkState = { inputSelected: null, hiddenSelected: null, outputSelected: null, path: [] };
  }
  function getNetworkState() { return networkState; }

  function resetGame() {
    networkState = { inputSelected: null, hiddenSelected: null, outputSelected: null, path: [] };
    modeSelected = false;
    typeSelected = false;
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
      if (mode && type) {
        enabled.style.display = 'inline-flex';
        disabled.style.display = 'none';
      } else {
        enabled.style.display = 'none';
        disabled.style.display = 'inline-flex';
      }
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
      if (index < 6) {
        const existingCb = document.getElementById('kw' + index);
        if (existingCb) checkbox = existingCb;
      }
      if (!checkbox) {
        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'keyword-toggle';
        checkbox.id = 'kw' + (index + 6);
      }
      const span = document.createElement('span');
      span.className = 'keyword-tag';
      span.textContent = kw;
      label.appendChild(checkbox);
      label.appendChild(span);
      checkbox.addEventListener('change', function() { window.updateKwCount(); });
      el.appendChild(label);
    });
    for (let i = kws.length; i < 6; i++) {
      const cb = document.getElementById('kw' + i);
      if (cb) { const lbl = cb.closest('label'); if (lbl) lbl.style.display = 'none'; }
    }
  }

  function populateSemanticScreen(q) {
    if (!q || !q.analysis) return;
    const inputs = document.querySelectorAll('.text-input[id^="sa-input"]');
    if (inputs.length >= 3) {
      inputs[0].value = q.analysis.topic || '';
      inputs[1].value = q.analysis.intent || '';
      inputs[2].value = q.analysis.language || '';
      inputs.forEach((inp, idx) => {
        const dot = document.getElementById('dot-' + idx);
        if (dot && inp.value.trim()) dot.classList.add('dot-active');
      });
    }
    window.updateSaContinue();
  }

  function getCheckedKeywords() {
    const result = [];
    document.querySelectorAll('.keyword-toggle:checked').forEach(cb => {
      const parentLabel = cb.closest('label');
      if (parentLabel) {
        const span = parentLabel.querySelector('.keyword-tag');
        if (span) result.push(span.textContent);
      }
    });
    return result;
  }

  function populateNeuralScreen(q) {
    if (!q) return;
    const container = document.getElementById('neural-mapping-container');
    if (!container) return;

    const checkedKeywords = getCheckedKeywords();
    if (checkedKeywords.length === 0) {
      container.innerHTML = '<div class="panel"><p style="color:var(--color-text-secondary);text-align:center;">No keywords selected. Go back and select at least 3 keywords.</p></div>';
      return;
    }

    networkState = { inputSelected: null, hiddenSelected: null, outputSelected: null, path: [] };

    container.innerHTML = '';
    container.style.cssText = 'padding:1rem;display:flex;flex-direction:column;align-items:center;';

    const title = document.createElement('h2');
    title.textContent = 'Neural Network';
    title.style.marginBottom = '1rem';
    container.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'subtitle';
    desc.textContent = 'Click a red input node, then choose a probability from the hidden layer, and finally select an output.';
    desc.style.marginBottom = '3rem';
    desc.style.textAlign = 'center';
    desc.style.maxWidth = '40rem';
    container.appendChild(desc);

    const numInput = checkedKeywords.length;
    const numHidden = 4;
    const numOutput = 2;
    const hiddenLabels = ['Analyze 45%', 'Process 28%', 'Explain 18%', 'Evaluate 9%'];
    const outputLabels = ['Answer', 'Topic'];

    const svgWidth = 800;
    const svgHeight = Math.max(360, numInput * 70 + 40);
    const inputX = 130, hiddenX = 400, outputX = 670;

    const inputSpacing = Math.min(80, (svgHeight - 80) / Math.max(1, numInput - 1));
    const inputStartY = (svgHeight - (inputSpacing * (numInput - 1))) / 2;
    const hiddenSpacing = 70;
    const hiddenStartY = (svgHeight - (hiddenSpacing * (numHidden - 1))) / 2;
    const outputSpacing = 100;
    const outputStartY = (svgHeight - (outputSpacing * (numOutput - 1))) / 2;

    const inputNodes = [], hiddenNodes = [], outputNodes = [];
    for (let i = 0; i < numInput; i++) inputNodes.push({ x: inputX, y: inputStartY + i * inputSpacing });
    for (let i = 0; i < numHidden; i++) hiddenNodes.push({ x: hiddenX, y: hiddenStartY + i * hiddenSpacing });
    for (let i = 0; i < numOutput; i++) outputNodes.push({ x: outputX, y: outputStartY + i * outputSpacing });

    const svg = svgEl('svg', { viewBox: '0 0 ' + svgWidth + ' ' + svgHeight, width: '100%', height: svgHeight });
    svg.style.cssText = 'max-width:800px;background:var(--color-dark-panel);border:1px solid var(--color-dark-lighter);display:block;margin:0 auto;';

    [{ x: inputX, text: 'Input Layer' }, { x: hiddenX, text: 'Hidden Layer' }, { x: outputX, text: 'Output Layer' }].forEach(t => {
      const txt = svgEl('text', { x: t.x, y: 22, 'text-anchor': 'middle', fill: '#F2F2F2', 'font-size': '13', 'font-weight': '700' });
      txt.textContent = t.text;
      svg.appendChild(txt);
    });

    const hiddenToOutputLines = [];
    for (let h = 0; h < numHidden; h++) {
      for (let o = 0; o < numOutput; o++) {
        const line = svgEl('line', { x1: hiddenNodes[h].x, y1: hiddenNodes[h].y, x2: outputNodes[o].x, y2: outputNodes[o].y, stroke: '#2B2B2B', 'stroke-width': '1', 'data-h': h, 'data-o': o });
        line.style.opacity = '0.15';
        svg.appendChild(line);
        hiddenToOutputLines.push(line);
      }
    }

    const inputToHiddenLines = [];
    for (let i = 0; i < numInput; i++) {
      for (let h = 0; h < numHidden; h++) {
        const line = svgEl('line', { x1: inputNodes[i].x, y1: inputNodes[i].y, x2: hiddenNodes[h].x, y2: hiddenNodes[h].y, stroke: '#2B2B2B', 'stroke-width': '1', 'data-i': i, 'data-h': h });
        line.style.opacity = '0.15';
        svg.appendChild(line);
        inputToHiddenLines.push(line);
      }
    }

    const outputCircles = [];
    for (let i = 0; i < numOutput; i++) {
      const group = svgEl('g', { 'data-output': i });
      group.style.opacity = '0.1';
      group.style.cursor = 'pointer';
      group.style.transition = 'opacity 0.3s';

      const circle = svgEl('circle', { cx: outputNodes[i].x, cy: outputNodes[i].y, r: 32, fill: '#2E7D32', stroke: '#4CAF50', 'stroke-width': '2' });
      group.appendChild(circle);
      const text = svgEl('text', { x: outputNodes[i].x, y: outputNodes[i].y + 4, 'text-anchor': 'middle', fill: '#FFFFFF', 'font-size': '12', 'font-weight': '600' });
      text.textContent = outputLabels[i];
      group.appendChild(text);

      group.addEventListener('click', function() {
        if (networkState.hiddenSelected === null) return;
        networkState.outputSelected = i;
        outputCircles.forEach(c => {
          c.querySelector('circle').setAttribute('fill', '#2E7D32');
          c.querySelector('circle').setAttribute('stroke', '#4CAF50');
          c.querySelector('circle').setAttribute('stroke-width', '2');
        });
        this.querySelector('circle').setAttribute('fill', '#66BB6A');
        this.querySelector('circle').setAttribute('stroke', '#A5D6A7');
        this.querySelector('circle').setAttribute('stroke-width', '3');
        const selectedHidden = networkState.hiddenSelected;
        hiddenToOutputLines.forEach(line => {
          const h = parseInt(line.getAttribute('data-h'));
          const o = parseInt(line.getAttribute('data-o'));
          if (h === selectedHidden && o === i) {
            line.setAttribute('stroke', '#4CAF50');
            line.setAttribute('stroke-width', '3');
            line.style.opacity = '1';
          } else {
            line.setAttribute('stroke', '#2B2B2B');
            line.setAttribute('stroke-width', '1');
            line.style.opacity = '0.15';
          }
        });
        networkState.path = [checkedKeywords[networkState.inputSelected], hiddenLabels[networkState.hiddenSelected], outputLabels[i]];
        updatePathDisplay();
      });
      svg.appendChild(group);
      outputCircles.push(group);
    }

    const hiddenCircles = [];
    for (let i = 0; i < numHidden; i++) {
      const group = svgEl('g', { 'data-hidden': i });
      group.style.opacity = '0.1';
      group.style.cursor = 'pointer';
      group.style.transition = 'opacity 0.3s';
      const circle = svgEl('circle', { cx: hiddenNodes[i].x, cy: hiddenNodes[i].y, r: 30, fill: '#1E3A8A', stroke: '#3B82F6', 'stroke-width': '2' });
      group.appendChild(circle);
      const text = svgEl('text', { x: hiddenNodes[i].x, y: hiddenNodes[i].y + 4, 'text-anchor': 'middle', fill: '#FFFFFF', 'font-size': '10', 'font-weight': '600' });
      text.textContent = hiddenLabels[i];
      group.appendChild(text);
      group.addEventListener('click', function() {
        if (networkState.inputSelected === null) return;
        networkState.hiddenSelected = i;
        networkState.outputSelected = null;
        hiddenCircles.forEach(c => {
          c.querySelector('circle').setAttribute('fill', '#1E3A8A');
          c.querySelector('circle').setAttribute('stroke', '#3B82F6');
          c.querySelector('circle').setAttribute('stroke-width', '2');
        });
        this.querySelector('circle').setAttribute('fill', '#3B82F6');
        this.querySelector('circle').setAttribute('stroke', '#93C5FD');
        this.querySelector('circle').setAttribute('stroke-width', '3');
        outputCircles.forEach(c => { c.style.opacity = '1'; });
        hiddenToOutputLines.forEach(line => {
          const h = parseInt(line.getAttribute('data-h'));
          if (h === i) {
            line.setAttribute('stroke', '#3B82F6');
            line.setAttribute('stroke-width', '2');
            line.style.opacity = '0.6';
          } else {
            line.setAttribute('stroke', '#2B2B2B');
            line.setAttribute('stroke-width', '1');
            line.style.opacity = '0.15';
          }
        });
        outputCircles.forEach(c => {
          c.querySelector('circle').setAttribute('fill', '#2E7D32');
          c.querySelector('circle').setAttribute('stroke', '#4CAF50');
        });
        networkState.path = [checkedKeywords[networkState.inputSelected], hiddenLabels[i], null];
        updatePathDisplay();
      });
      svg.appendChild(group);
      hiddenCircles.push(group);
    }

    const inputCircles = [];
    for (let i = 0; i < numInput; i++) {
      const group = svgEl('g', { 'data-input': i });
      group.style.cursor = 'pointer';
      const circle = svgEl('circle', { cx: inputNodes[i].x, cy: inputNodes[i].y, r: 28, fill: '#A40000', stroke: '#C00000', 'stroke-width': '2' });
      circle.style.transition = 'fill 0.3s, stroke 0.3s, stroke-width 0.3s';
      group.appendChild(circle);
      const displayText = checkedKeywords[i].length > 8 ? checkedKeywords[i].substring(0, 7) + '..' : checkedKeywords[i];
      const text = svgEl('text', { x: inputNodes[i].x, y: inputNodes[i].y + 4, 'text-anchor': 'middle', fill: '#FFFFFF', 'font-size': '10', 'font-weight