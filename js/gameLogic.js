const GameLogic = (function () {
  let currentScreen = 'intro';
  let selectedKeywords = [];
  let promptTypeToken = 0;
  let resultTypeTokens = { you: 0, ai: 0 };
  let modeSelected = false;
  let typeSelected = false;
  const SVGNS = 'http://www.w3.org/2000/svg';

  // Weak keywords that cannot alone lead to correct answer
  const WEAK_KEYWORDS = new Set([
    'what', 'who', 'where', 'when', 'why', 'how',
    'is', 'are', 'am', 'was', 'were', 'be', 'being', 'been',
    'the', 'a', 'an', 'and', 'or', 'but', 'not', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'if', 'then', 'else', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'must',
    'this', 'that', 'these', 'those', 'it', 'them', 'us', 'you', 'me', 'he', 'she', 'we', 'they',
    'your', 'his', 'her', 'their', 'our', 'my', 'its'
  ]);

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
  let selectedFilter = null; // 'nsfw', 'dangerous', 'racism', or null
  let filterExplanation = null; // generated humorous explanation string
  let filterChosen = false; // whether the user clicked a filter option (including nofilter)

  function svgEl(name, attrs) {
    const el = document.createElementNS(SVGNS, name);
    if (attrs) Object.keys(attrs).forEach(k => el.setAttribute(k, attrs[k]));
    return el;
  }

  // HUD-style corner brackets framing a node, like a camera/target reticle
  function appendNodeReticle(group, cx, cy, r) {
    var off = r * 1.5;
    var len = r * 0.6;
    var reticle = svgEl('g', { 'class': 'node-reticle' });
    var corners = [
      { dx: -off, dy: -off, hx: 1, vy: 1 },
      { dx: off, dy: -off, hx: -1, vy: 1 },
      { dx: -off, dy: off, hx: 1, vy: -1 },
      { dx: off, dy: off, hx: -1, vy: -1 }
    ];
    corners.forEach(function (c) {
      var px = cx + c.dx;
      var py = cy + c.dy;
      var d = 'M ' + (px + c.hx * len) + ' ' + py + ' L ' + px + ' ' + py + ' L ' + px + ' ' + (py + c.vy * len);
      reticle.appendChild(svgEl('path', { d: d }));
    });
    group.appendChild(reticle);
  }

  // Expanding ping ring shown while a node is selected
  function appendNodePulse(group, cx, cy, r) {
    var pulse = svgEl('circle', { 'class': 'node-pulse', cx: cx, cy: cy, r: r });
    group.appendChild(pulse);
  }

  // Wrap text inside a circle using <tspan> elements, vertically centred at cy
  function drawWrappedNodeText(textEl, rawText, cx, cy, nodeRadius, fontSize) {
    var lineHeight = fontSize * 1.3;
    var maxWidth = nodeRadius * 1.85; // use ~92% of diameter
    var avgCharWidth = fontSize * 0.5;
    var charsPerLine = Math.max(4, Math.floor(maxWidth / avgCharWidth));

    var words = rawText.split(' ');
    var lines = [];
    var current = '';
    words.forEach(function (word) {
      var candidate = current ? current + ' ' + word : word;
      if (candidate.length <= charsPerLine) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        // never truncate — start a new line for the word instead
        current = word;
      }
    });
    if (current) lines.push(current);

    var totalHeight = (lines.length - 1) * lineHeight;
    lines.forEach(function (line, i) {
      var tspan = document.createElementNS(SVGNS, 'tspan');
      tspan.setAttribute('x', String(Math.round(cx)));
      tspan.setAttribute('y', String(Math.round(cy - totalHeight / 2 + i * lineHeight)));
      tspan.textContent = line;
      textEl.appendChild(tspan);
    });
  }

  // Types `text` into the element with id `spanId`, one char at a time.
  // `channel` lets a fresh call cancel a still-running loop for the same target.
  function typeIntoResultSpan(spanId, channel, text, delay) {
    var el = document.getElementById(spanId);
    if (!el || !text) return;
    resultTypeTokens[channel]++;
    var myToken = resultTypeTokens[channel];
    el.textContent = '';
    setTimeout(function () {
      if (resultTypeTokens[channel] !== myToken) return;
      var i = 0;
      function step() {
        if (resultTypeTokens[channel] !== myToken) return;
        if (i < text.length) {
          el.textContent += text[i];
          i++;
          setTimeout(step, 6);
        }
      }
      step();
    }, delay || 0);
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

  function isValidKeywordSelection() {
    // Check if at least one strong (non-weak) keyword is actually SELECTED in the Neural Network's Input Layer
    // It's not enough that a strong keyword is available - it must be actively selected
    var hasStrongKeywordSelected = false;

    networkSelectedInputs.forEach(function (idx) {
      if (networkAllData[0] && networkAllData[0][idx]) {
        var keyword = networkAllData[0][idx].word || networkAllData[0][idx].text;
        if (keyword && !WEAK_KEYWORDS.has(keyword.toLowerCase())) {
          hasStrongKeywordSelected = true;
        }
      }
    });

    return hasStrongKeywordSelected;
  }

  function resetGame() {
    resetNetworkState();
    modeSelected = false; typeSelected = false;
    selectedFilter = null;
    filterExplanation = null;
    document.querySelectorAll('.choice-radio').forEach(r => r.checked = false);
    document.querySelectorAll('.keyword-toggle').forEach(cb => cb.checked = false);
    document.querySelectorAll('.filter-btn').forEach(function (btn) { btn.classList.remove('filter-btn-active'); });
    var statusEl = document.getElementById('filter-status');
    if (statusEl) statusEl.innerHTML = '';
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
    const cursor = el ? el.nextElementSibling : null;
    const card = document.querySelector('.prompt-card');
    if (!el) return;
    const text = q.prompt;

    // invalidate any still-running typewriter loop from a previous call
    promptTypeToken++;
    const myToken = promptTypeToken;

    // measure final height with full text, then clear for typing
    el.textContent = text;
    const body = document.querySelector('.prompt-terminal-body');
    if (body) body.style.minHeight = body.offsetHeight + 'px';
    el.textContent = '';

    // fade card in
    if (card) { card.style.opacity = '0'; card.style.transition = 'opacity 0.4s ease'; }
    if (cursor) cursor.style.opacity = '0';

    setTimeout(function() {
      if (myToken !== promptTypeToken) return;
      if (card) card.style.opacity = '1';
      let i = 0;
      function typeNext() {
        if (myToken !== promptTypeToken) return;
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
      checkbox.addEventListener('change', function () { window.updateKwCount(); });
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
    return { base: 'rgba(0,8,20,0.85)', border: 'rgba(255,255,255,0.18)', active: 'rgba(0,40,100,0.65)', activeBorder: 'rgba(100,160,255,0.9)' };
  }

  function getNodeRadius(layerIndex) {
    return 42;
  }

  function calculateSvgHeight() {
    // the whole game runs on a fixed 1080px-tall design canvas that just gets
    // visually scaled to fit the real screen (see the script in index.html's
    // <head>), so this must use that fixed height — not window.innerHeight —
    // otherwise the network would size itself differently per screen.
    // budget everything that shares .screen-neural's height with the SVG so
    // the whole thing always fits without needing to scroll:
    var CANVAS_HEIGHT = 1080;
    var SCREEN_PADDING = 60 + 60;   // .screen-neural padding top + bottom (60px each)
    var PATH_BOX = 170;             // path container margin-top (40px) + header + body
    var SAFETY_MARGIN = 20;
    var available = CANVAS_HEIGHT - SCREEN_PADDING - PATH_BOX - SAFETY_MARGIN;
    return Math.max(400, available);
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
    var layers = allLayers.filter(function (layerItem) {
      return checkedKeywords.some(function (kw) { return kw.toLowerCase() === layerItem.word.toLowerCase(); });
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
    desc.innerHTML = '&gt; Select one node per layer to build a path from input to output.';
    leftCol.appendChild(termHeader);
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

    // Dot-grid background
    var defs = svgEl('defs', {});
    var gridPat = svgEl('pattern', { id: 'dot-grid', x: '0', y: '0', width: '48', height: '48', patternUnits: 'userSpaceOnUse' });
    var gridDot = svgEl('circle', { cx: '24', cy: '24', r: '1.5', fill: 'rgba(255,255,255,0.06)' });
    gridPat.appendChild(gridDot);
    defs.appendChild(gridPat);
    networkSvg.appendChild(defs);
    var bgRect = svgEl('rect', { x: '0', y: '0', width: String(networkSvgWidth), height: String(networkSvgHeight), fill: 'url(#dot-grid)' });
    networkSvg.appendChild(bgRect);

    var cols = getLayerCols(networkSvgWidth);
    var colLabels = ['input.layer', 'context.layer', 'intent.layer', 'output'];

    // Draw vertical dashed lines to separate layers (behind everything)
    for (var i = 1; i < cols.length; i++) {
      var line = svgEl('line', {
        x1: (cols[i - 1] + cols[i]) / 2, y1: 0,
        x2: (cols[i - 1] + cols[i]) / 2, y2: networkSvgHeight,
        stroke: '#ffffff', 'stroke-width': '1', 'stroke-dasharray': '6,6'
      });
      line.style.opacity = '0.08';
      networkSvg.appendChild(line);
    }

    // Draw input layer (layer 0) — always visible
    networkAllData[0] = layers.slice();
    drawLayerNodes(0, layers.map(function (l) {
      return { text: l.word, prob: null, sourceData: l };
    }));

    // Layer title labels drawn LAST so they always appear on top of nodes
    colLabels.forEach(function (label, i) {
      var txt = svgEl('text', { x: cols[i], y: 32, 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.3)', 'font-size': '14', 'font-weight': '700', 'font-family': 'IBM Plex Mono, monospace', 'letter-spacing': '2' });
      txt.textContent = label.toUpperCase();
      networkSvg.appendChild(txt);
    });

    // Path display — shows step placeholders that fill in as the user clicks
    var pathContainer = document.createElement('div');
    pathContainer.id = 'neural-path';
    var pathHeader = '<div style="font-family:\'IBM Plex Mono\',monospace;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.25);padding:0.5rem 1.25rem;background:rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.08);">path.trace</div>';
    var pathBody = '<div id="neural-path-body" style="padding:0.85rem 1.25rem;display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;justify-content:center;font-family:\'IBM Plex Mono\',monospace;">' + buildPathPlaceholders(null, null, null, null) + '</div>';
    pathContainer.style.cssText = 'margin-top:2.5rem;background:rgba(0,8,20,0.82);border:1px solid rgba(255,255,255,0.12);border-radius:8px;overflow:hidden;align-self:center;width:80%;';
    pathContainer.innerHTML = pathHeader + pathBody;
    rightCol.appendChild(pathContainer);

    // Handle window resize — recalculate connection line positions
    window.addEventListener('resize', function () {
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
      : networkNodeRadius;
    if (layerIndex === 0) { networkNodeRadius = nodeRadius; networkNodeSpacing = spacing; }
    // centre the node group within the inner space, always below column headers
    var startY = topPad + (innerSpace - spacing * (count - 1)) / 2;

    networkAllNodes[layerIndex] = [];
    networkAllData[layerIndex] = items.map(function (item) { return item.sourceData || item; });

    items.forEach(function (item, i) {
      var y = startY + i * spacing;
      var group = svgEl('g', { 'data-layer': String(layerIndex), 'data-index': String(i) });
      group.style.cursor = 'pointer';
      group.style.opacity = '0';
      group.style.transition = 'opacity 0.3s';

      var colors = getNodeColors(layerIndex);
      var circle = svgEl('circle', {
        'class': 'node-main',
        cx: x, cy: y, r: nodeRadius,
        fill: colors.base, stroke: colors.border, 'stroke-width': '2'
      });
      circle.style.transition = 'fill 0.3s, stroke 0.3s, stroke-width 0.3s';
      group.appendChild(circle);
      appendNodePulse(group, x, y, nodeRadius);
      appendNodeReticle(group, x, y, nodeRadius);

      // Probability badge above circle
      if (item.prob !== null && item.prob !== undefined) {
        var probBadge = svgEl('text', {
          x: x, y: y - nodeRadius - 10, 'text-anchor': 'middle',
          fill: 'rgba(255,255,255,0.3)', 'font-size': '13', 'font-weight': '600',
          'font-family': 'IBM Plex Mono, monospace'
        });
        probBadge.textContent = item.prob + '%';
        group.appendChild(probBadge);
      }

      // Label text below the circle
      var text = svgEl('text', {
        'class': 'node-label', 'text-anchor': 'middle',
        fill: 'rgba(255,255,255,0.75)', 'font-size': '15', 'font-weight': '600',
        'font-family': 'IBM Plex Mono, monospace'
      });
      drawWrappedNodeText(text, item.text, x, y + nodeRadius + 28, 130, 15);
      group.appendChild(text);

      // Click handler
      (function (capturedIdx, capturedData) {
        group.addEventListener('click', function () {
          handleNodeClick(layerIndex, capturedIdx, capturedData);
        });
      })(i, item.sourceData || item);

      networkSvg.appendChild(group);
      networkAllNodes[layerIndex].push(group);

      // Staggered fade-in
      setTimeout(function () { group.style.opacity = '1'; }, 40 + i * 70);
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

      // If the user has already progressed past the context layer (e.g. they
      // picked a context + intent), removing an input keyword must also wipe
      // the context -> intent line so the network stays consistent. The
      // currently selected context node itself stays selected, and the
      // intent/output options stay on screen (i.e. the intent layer is not
      // touched — only the line is removed). The intent layer's SVG nodes
      // remain rendered for the still-active context.
      if (networkActiveContextIdx !== null) {
        networkConnections = networkConnections.filter(function (conn) {
          if (conn.fromLayer === 1) {
            conn.line.remove();
            return false;
          }
          return true;
        });
        // Reset downstream state but DO NOT clear or re-render the intent
        // layer nodes. The intent knots (and their output knots) stay on
        // screen so the user keeps seeing them.
        // Deselect the currently selected intent node (keep it visible)
        if (networkActiveIntentIdx !== null) {
          resetNodeVisual(2, networkActiveIntentIdx);
          networkActiveIntentIdx = null;
        }

        // Deselect the currently selected output node (keep it visible)
        if (networkActiveOutputIdx !== null) {
          resetNodeVisual(3, networkActiveOutputIdx);
          networkActiveOutputIdx = null;
        }
        // When the active intent is cleared, the current output options are no longer valid.
        clearLayerNodes(3);

        // Re-apply the active highlight to the still-selected context node,
        // because the input-layer re-render below may have rebuilt the
        // context layer for the new active input, replacing the old group.
        if (networkAllNodes[1] && networkAllNodes[1][networkActiveContextIdx]) {
          highlightNode(1, networkActiveContextIdx, true);
        }
      }

      // If we deselected the active input, switch to another selected one
      if (networkActiveInputIdx === nodeIndex) {
        networkActiveInputIdx = null;
        var newActiveIdx = null;

        // Pick the first remaining selected input
        networkSelectedInputs.forEach(function (idx) {
          if (newActiveIdx === null) newActiveIdx = idx;
        });

        networkActiveInputIdx = newActiveIdx;

        // If there are still selected inputs, update context layer to show their options
        if (networkActiveInputIdx !== null) {
          var activeData = networkAllData[0][networkActiveInputIdx];
          if (activeData) {
            showNextLayerOptions(0, networkActiveInputIdx, activeData);
            // Re-apply the active highlight to the still-selected context node
            // because showNextLayerOptions above may have rebuilt the context
            // layer for the new active input.
            if (networkAllNodes[1] && networkAllNodes[1][networkActiveContextIdx]) {
              highlightNode(1, networkActiveContextIdx, true);
            }
          }
        } else {
          // No inputs are selected anymore -> remove everything downstream.
          removeConnectionsFromLayer(0);

          clearLayerNodes(1); // Context
          clearLayerNodes(2); // Intent
          clearLayerNodes(3); // Output

          networkActiveContextIdx = null;
          networkActiveIntentIdx = null;
          networkActiveOutputIdx = null;

          updatePathDisplay();
        }
      }
    } else {
      // Select this input
      networkSelectedInputs.add(nodeIndex);
      networkActiveInputIdx = nodeIndex;

      // If the user has already progressed past the context layer (e.g. they
      // picked a context + intent), adding another input must NOT silently
      // introduce a new context->intent line. Clear downstream connections
      // from the context layer so any pre-existing lines to the intent layer
      // disappear until the user explicitly re-picks context + intent.
      // The context node stays selected and the intent/output knots stay on
      // screen — only the line between context and intent is removed.
      if (
        networkSelectedInputs.size > 0 &&
        networkActiveContextIdx !== null
      ) {
        networkConnections = networkConnections.filter(function (conn) {
          if (conn.fromLayer === 1) {
            conn.line.remove();
            return false;
          }
          return true;
        });
        // Reset downstream state but DO NOT clear or re-render the intent
        // layer nodes. The intent knots (and their output knots) stay on
        // screen so the user keeps seeing them.
        // Keep the intent/output nodes visible.
        // Only remove the connection.
        // Re-apply the active highlight to the still-selected context node,
        // because the input-layer re-render below may have rebuilt the
        // context layer for the new active input, replacing the old group.
        if (networkAllNodes[1] && networkAllNodes[1][networkActiveContextIdx]) {
          highlightNode(1, networkActiveContextIdx, true);
        }
      }

      // Always update context layer to show options for this newly selected input
      showNextLayerOptions(0, nodeIndex, data);

      // Restore the selected context
      if (networkActiveContextIdx !== null && networkAllNodes[1] && networkAllNodes[1][networkActiveContextIdx]) {
        highlightNode(1, networkActiveContextIdx, true);

        // Rebuild the intent layer from the updated context
        var contextData = networkAllData[1][networkActiveContextIdx];
        if (contextData) {
          showNextLayerOptions(1, networkActiveContextIdx, contextData);
        }

        // Nothing in the intent/output layer should remain selected
        networkActiveIntentIdx = null;
        networkActiveOutputIdx = null;
        clearLayerNodes(3);
      }
    }

    // Visual: highlight all selected inputs
    networkAllNodes[0].forEach(function (node, idx) {
      if (networkSelectedInputs.has(idx)) {
        highlightNode(0, idx, idx === networkActiveInputIdx);
      } else {
        resetNodeVisual(0, idx);
      }
    });

    // Only redraw connections if context is already active (user clicked it)
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
    if (networkActiveIntentIdx === null) {
      return;
    }

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
      drawConnection(2, networkActiveIntentIdx, 3, nodeIndex);

      // Navigate to filter screen instead of directly to result
      goToScreen('s-filter');

      // Reset filter state when a new output is selected
      selectedFilter = null;
      filterExplanation = null;
      filterChosen = false;
      updateFilterControls();
    }

    updatePathDisplay();
  }

  // ─── Result Screen ─────────────────────────────────────────────────

  function showResultScreen(outputIdx, outputData, isCorrectAnswer, mode, type) {
    var youText = document.getElementById('result-you-text');
    var aiText = document.getElementById('result-ai-text');
    var wrapper = document.getElementById('result-comparison-wrapper');
    var youBadge = document.getElementById('result-you-badge');
    var aiBadge = document.getElementById('result-ai-badge');
    if (!youText || !aiText) return;

    // If not explicitly provided, default to checking if outputIdx is 0
    if (isCorrectAnswer === undefined) {
      isCorrectAnswer = outputIdx === 0;
    }

    var isCorrect = isCorrectAnswer;
    var label = outputData.text ? outputData.text.replace(' (result)', '') : 'This answer';

    // Reset wrapper classes
    if (wrapper) {
      wrapper.className = isCorrect ? 'result-correct' : 'result-wrong';
    }

    // Set badges
    if (youBadge) {
      youBadge.textContent = 'Your Answer';
      youBadge.style.cssText = isCorrect
        ? 'background:rgba(107,203,119,0.15);color:#6BCB77;border:1px solid rgba(107,203,119,0.3);'
        : 'background:rgba(255,107,107,0.15);color:#FF6B6B;border:1px solid rgba(255,107,107,0.3);';
    }
    if (aiBadge) {
      aiBadge.textContent = 'AI Answer';
      aiBadge.style.cssText = 'background:rgba(107,203,119,0.15);color:#6BCB77;border:1px solid rgba(107,203,119,0.3);';
    }

    // Get the real answer text from the question data
    var realAnswer = (currentQuestionRef && currentQuestionRef.answer) ? currentQuestionRef.answer : '';
    var promptText = (currentQuestionRef && currentQuestionRef.prompt) ? currentQuestionRef.prompt : '';

    // Determine if the selected filter is the CORRECT one for this prompt
    var filterIsCorrect = false;
    if (selectedFilter === 'nofilter') {
      filterIsCorrect = !currentQuestionRef || !currentQuestionRef.recommendedFilter;
    } else {
      filterIsCorrect = selectedFilter && currentQuestionRef && currentQuestionRef.recommendedFilter && selectedFilter === currentQuestionRef.recommendedFilter;
    }

    // If a filter was selected, show the filter explanation in the You panel
    // AI panel shows the real answer if filter is correct, or a funny wrong-filter text if wrong
    if (selectedFilter && filterExplanation) {
      var filterColors = {
        nsfw: { bg: 'rgba(255,80,80,0.15)', border: 'rgba(255,80,80,0.3)', icon: '🔞' },
        dangerous: { bg: 'rgba(255,165,0,0.15)', border: 'rgba(255,165,0,0.3)', icon: '⚠️' },
        racism: { bg: 'rgba(197,48,48,0.15)', border: 'rgba(197,48,48,0.3)', icon: '🚫' }
      };
      var fc = filterColors[selectedFilter] || filterColors.nsfw;

      var youHtml = '<div style="margin-top:0.5rem;padding:1rem;background:' + fc.bg + ';border:1px solid ' + fc.border + ';border-radius:8px;font-size:var(--font-xs);color:#F2F2F2;">' +
        '<div style="font-size:var(--font-s);text-align:center;margin-bottom:0.75rem;">' + fc.icon + ' <strong>' + selectedFilter.toUpperCase() + ' FILTER ACTIVE</strong></div>' +
        '<hr style="border-color:' + fc.border + ';margin:0.5rem 0;">' +
        '<div style="font-size:var(--font-xs);color:var(--color-text-secondary);margin-bottom:0.5rem;">Input: ' + promptText + '</div>' +
        '<div style="line-height:1.7;" id="youTypeSpan"></div>' +
        '</div>';

      youText.innerHTML = youHtml;
      typeIntoResultSpan('youTypeSpan', 'you', filterExplanation, 0);

      aiText.innerHTML = '<span id="aiTypeSpan"></span>';
      if (aiBadge) {
        aiBadge.textContent = 'AI Answer';
        aiBadge.style.cssText = 'background:rgba(107,203,119,0.15);color:#6BCB77;border:1px solid rgba(107,203,119,0.3);';
      }

      if (wrapper) wrapper.className = '';
      if (youBadge) youBadge.textContent = 'Your Answer';
      if (youBadge) youBadge.style.cssText = 'background:' + fc.bg + ';color:white;border:1px solid ' + fc.border + ';';
    } else if (isCorrect) {
      // CORRECT: Both panels show the same real answer text
      var youHtml = '<em style="font-size:var(--font-xs);color:var(--color-text-secondary);display:block;margin-bottom:0.5rem;">You selected ' + label + ' \u2014 that\u2019s correct!</em>' +
        '<span id="youTypeSpan" style="font-size:var(--font-s);line-height:1.85;"></span>';
      youText.innerHTML = youHtml;
      typeIntoResultSpan('youTypeSpan', 'you', realAnswer, 0);
      aiText.innerHTML = '<em style="font-size:var(--font-xs);color:var(--color-text-secondary);display:block;margin-bottom:0.5rem;">Verified:</em>' +
        '<span id="aiTypeSpan" style="font-size:var(--font-s);line-height:1.85;"></span>';
    } else {
      // WRONG: Selected shows convincing creative text, AI shows the real answer
      var fakeAns = generateCreativeFictionalAnswer(outputData, currentQuestionRef);
      var youHtml = '<em style="font-size:var(--font-xs);color:var(--color-text-secondary);display:block;margin-bottom:0.5rem;">You selected ' + label + '</em>' +
        '<span id="youTypeSpan" style="font-size:var(--font-s);line-height:1.85;"></span>';
      youText.innerHTML = youHtml;
      typeIntoResultSpan('youTypeSpan', 'you', fakeAns, 0);
      aiText.innerHTML = '<em style="font-size:var(--font-xs);color:var(--color-text-secondary);display:block;margin-bottom:0.5rem;">AI Answer</em>' +
        '<span id="aiTypeSpan" style="font-size:var(--font-s);line-height:1.85;"></span>';
    }

    var pathEl = document.getElementById('result-path');
    if (pathEl) {
      var steps = getNetworkSteps();
      if (steps.length > 0) {
        pathEl.innerHTML = '';
        var header = document.createElement('span');
        header.className = 'result-path-header';
        header.textContent = 'Path:';
        pathEl.appendChild(header);

        var parts = [];
        if (networkSelectedInputs.size > 0) {
          var inputTexts = [];
          networkSelectedInputs.forEach(function (idx) {
            if (networkAllData[0][idx]) {
              inputTexts.push(networkAllData[0][idx].text || networkAllData[0][idx].word || '?');
            }
          });
          if (inputTexts.length > 0) {
            parts.push({ text: inputTexts.join(', '), color: '#004284' });
          }
        }
        if (networkActiveContextIdx !== null && networkAllData[1][networkActiveContextIdx]) {
          parts.push({ text: networkAllData[1][networkActiveContextIdx].text, color: '#004284' });
        }
        if (networkActiveIntentIdx !== null && networkAllData[2][networkActiveIntentIdx]) {
          parts.push({ text: networkAllData[2][networkActiveIntentIdx].text, color: '#004284' });
        }
        if (networkActiveOutputIdx !== null && networkAllData[3][networkActiveOutputIdx]) {
          parts.push({ text: networkAllData[3][networkActiveOutputIdx].text, color: '#004284' });
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
            arrow.textContent = '→';
            pathEl.appendChild(arrow);
          }
        });
      } else {
        pathEl.innerHTML = '';
      }
    }

    goToScreen('s-result');

    // ── Stat line ──────────────────────────────────────────────────────────
    var kws = getCheckedKeywords();
    var pathParts = [];
    networkSelectedInputs.forEach(function(idx) {
      if (networkAllData[0][idx]) pathParts.push(networkAllData[0][idx].text || networkAllData[0][idx].word || '?');
    });
    if (networkActiveContextIdx !== null && networkAllData[1][networkActiveContextIdx]) pathParts.push(networkAllData[1][networkActiveContextIdx].text);
    if (networkActiveIntentIdx !== null && networkAllData[2][networkActiveIntentIdx]) pathParts.push(networkAllData[2][networkActiveIntentIdx].text);
    if (networkActiveOutputIdx !== null && networkAllData[3][networkActiveOutputIdx]) pathParts.push(networkAllData[3][networkActiveOutputIdx].text);

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
      var filterLabel = selectedFilter ? selectedFilter.toUpperCase() : 'NONE';
      statFilter.textContent = '[ FILTER: ' + filterLabel + ' ]';
      statFilter.setAttribute('data-tooltip', selectedFilter ? selectedFilter + ' filter active' : 'No filter applied');
    }
    if (statPath) {
      statPath.textContent = '[ PATH: ' + pathParts.length + ' NODES ]';
      statPath.setAttribute('data-tooltip', pathParts.length ? pathParts.join(' → ') : 'no path');
    }
    if (statMode) {
      var modeLabel = mode ? mode.toUpperCase() : '—';
      var typeLabel = type ? type.toUpperCase() : '—';
      statMode.textContent = '[ MODE: ' + modeLabel + ' / ' + typeLabel + ' ]';
      statMode.setAttribute('data-tooltip', 'Answer mode: ' + (mode || '—') + '  |  Type: ' + (type || '—'));
    }

    // ── Score ──────────────────────────────────────────────────────────────
    var filterOk = filterIsCorrect;
    var pickedTop = networkActiveOutputIdx === 0;
    var hasKw = isValidKeywordSelection();
    var score = (pickedTop ? 40 : 0) + (hasKw ? 30 : 0) + (filterOk ? 30 : 0);
    if (scoreLbl) scoreLbl.textContent = '[ MATCH: ' + score + '% ]';
    if (scoreFill) {
      scoreFill.classList.remove('score-flash');
      scoreFill.classList.toggle('score-high', score >= 70);
      scoreFill.classList.toggle('score-low', score < 40);
      setTimeout(function() { scoreFill.style.width = score + '%'; }, 100);
      scoreFill.addEventListener('transitionend', function onFillDone(e) {
        if (e.propertyName !== 'width') return;
        scoreFill.removeEventListener('transitionend', onFillDone);
        scoreFill.classList.add('score-flash');
        setTimeout(function() { scoreFill.classList.remove('score-flash'); }, 650);
      });
    }

    // ── AI panel reveal after delay ────────────────────────────────────────
    var aiPanel = document.querySelector('.ai-panel');
    if (aiPanel) {
      aiPanel.classList.remove('revealed');
      setTimeout(function() {
        aiPanel.classList.add('revealed');
        typeIntoResultSpan('aiTypeSpan', 'ai', realAnswer, 0);
      }, 750);
    }
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
    var circle = node.querySelector('circle.node-main');
    if (!circle) return;
    circle.setAttribute('fill', colors.active);
    circle.setAttribute('stroke', colors.activeBorder);
    circle.setAttribute('stroke-width', isActive ? '3' : '2');
    var label = node.querySelector('.node-label');
    if (label) label.setAttribute('fill', 'rgba(255,255,255,1)');
    node.classList.add('node-selected');
  }

  function resetNodeVisual(layerIndex, nodeIndex) {
    var node = networkAllNodes[layerIndex] && networkAllNodes[layerIndex][nodeIndex];
    if (!node) return;
    var colors = getNodeColors(layerIndex);
    var circle = node.querySelector('circle.node-main');
    if (!circle) return;
    circle.setAttribute('fill', colors.base);
    circle.setAttribute('stroke', colors.border);
    circle.setAttribute('stroke-width', '2');
    node.classList.remove('node-selected');
    var label = node.querySelector('.node-label');
    if (label) label.setAttribute('fill', 'rgba(255,255,255,0.75)');
  }

  // ─── Connections ────────────────────────────────────────────────────

  function drawConnection(fromLayer, fromIdx, toLayer, toIdx) {
    var fromNode = networkAllNodes[fromLayer][fromIdx];
    var toNode = networkAllNodes[toLayer][toIdx];
    if (!fromNode || !toNode) return;

    var fromCircle = fromNode.querySelector('circle.node-main');
    var toCircle = toNode.querySelector('circle.node-main');
    if (!fromCircle || !toCircle) return;

    var x1 = parseFloat(fromCircle.getAttribute('cx'));
    var y1 = parseFloat(fromCircle.getAttribute('cy'));
    var x2 = parseFloat(toCircle.getAttribute('cx'));
    var y2 = parseFloat(toCircle.getAttribute('cy'));
    var r1 = parseFloat(fromCircle.getAttribute('r'));
    var r2 = parseFloat(toCircle.getAttribute('r'));

    var line = svgEl('line', {
      x1: x1 + r1, y1: y1,
      x2: x2 - r2, y2: y2,
      stroke: 'rgba(100,160,255,1)', 'stroke-width': '2.5'
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
    setTimeout(function () { line.style.opacity = '1'; }, 30);
  }

  // Draw connections from ALL selected inputs to the active context bubble
  function drawAllInputConnections() {
    // Remove existing layer 0→1 connections
    networkConnections = networkConnections.filter(function (conn) {
      if (conn.fromLayer === 0 && conn.toLayer === 1) {
        conn.line.remove();
        return false;
      }
      return true;
    });

    if (networkActiveContextIdx === null) return;

    networkSelectedInputs.forEach(function (inputIdx) {
      drawConnection(0, inputIdx, 1, networkActiveContextIdx);
    });
  }

  // Remove connections from a specific input node
  function removeConnectionsFromInput(inputIdx) {
    networkConnections = networkConnections.filter(function (conn) {
      if (conn.fromLayer === 0 && conn.fromIdx === inputIdx) {
        conn.line.remove();
        return false;
      }
      return true;
    });
  }

  function recalcConnectionPositions() {
    networkConnections.forEach(function (conn) {
      var fromNode = networkAllNodes[conn.fromLayer][conn.fromIdx];
      var toNode = networkAllNodes[conn.toLayer][conn.toIdx];
      if (!fromNode || !toNode) return;

      var fromCircle = fromNode.querySelector('circle.node-main');
      var toCircle = toNode.querySelector('circle.node-main');
      if (!fromCircle || !toCircle) return;
      var r1 = parseFloat(fromCircle.getAttribute('r'));
      var r2 = parseFloat(toCircle.getAttribute('r'));

      conn.line.setAttribute('x1', parseFloat(fromCircle.getAttribute('cx')) + r1);
      conn.line.setAttribute('y1', fromCircle.getAttribute('cy'));
      conn.line.setAttribute('x2', parseFloat(toCircle.getAttribute('cx')) - r2);
      conn.line.setAttribute('y2', toCircle.getAttribute('cy'));
    });
  }

  function removeConnectionBetweenLayers(fromLayer, toLayer) {
    networkConnections = networkConnections.filter(function (conn) {
      if (conn.fromLayer === fromLayer && conn.toLayer === toLayer) {
        conn.line.remove();
        return false;
      }
      return true;
    });
  }

  function removeConnectionsFromLayer(layerIndex) {
    networkConnections = networkConnections.filter(function (conn) {
      if (conn.fromLayer >= layerIndex || conn.toLayer >= layerIndex) {
        conn.line.remove();
        return false;
      }
      return true;
    });
  }

  function clearLayerNodes(layerIndex) {
    removeBackgroundMesh(layerIndex);
    if (networkAllNodes[layerIndex]) {
      networkAllNodes[layerIndex].forEach(function (node) { node.remove(); });
    }
    networkAllNodes[layerIndex] = [];
    networkAllData[layerIndex] = [];
  }

  // ─── Show Next Layer Options ────────────────────────────────────────

  function showNextLayerOptions(layerIndex, nodeIndex, data) {
    var nextLayer = layerIndex + 1;
    if (nextLayer >= 4) return;

    // Always redraw the next layer
    clearLayerNodes(nextLayer);

    // Only clear deeper layers when the user changes
    // Context or Intent. Input changes should leave the
    // Intent and Output nodes visible.
    if (layerIndex > 0) {
      for (var l = nextLayer + 1; l < 4; l++) {
        clearLayerNodes(l);
      }
    }

    var options = [];

    if (layerIndex === 0 && data && data.options) {
      // Input → Context
      options = data.options.map(function (opt) {
        return { text: opt.text, prob: opt.prob, sourceData: opt };
      });
    } else if (layerIndex === 1 && data && data.next) {
      // Context → Intent
      options = data.next.map(function (optText) {
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
      setTimeout(function() {
        drawBackgroundMesh(layerIndex, nextLayer);
      }, 80);
    }
  }

  function drawBackgroundMesh(fromLayer, toLayer) {
    removeBackgroundMesh(toLayer);
    var fromNodes = networkAllNodes[fromLayer];
    var toNodes = networkAllNodes[toLayer];
    if (!fromNodes || !toNodes) return;

    fromNodes.forEach(function(fromNode) {
      var fromCircle = fromNode.querySelector('circle.node-main');
      if (!fromCircle) return;
      var fr = parseFloat(fromCircle.getAttribute('r'));
      var fx = parseFloat(fromCircle.getAttribute('cx')) + fr;
      var fy = parseFloat(fromCircle.getAttribute('cy'));

      toNodes.forEach(function(toNode) {
        var toCircle = toNode.querySelector('circle.node-main');
        if (!toCircle) return;
        var tr = parseFloat(toCircle.getAttribute('r'));
        var tx = parseFloat(toCircle.getAttribute('cx')) - tr;
        var ty = parseFloat(toCircle.getAttribute('cy'));

        var meshLine = svgEl('line', {
          x1: fx, y1: fy, x2: tx, y2: ty,
          stroke: 'rgba(100,160,255,0.09)',
          'stroke-width': '1'
        });
        meshLine.setAttribute('data-mesh-to', String(toLayer));
        meshLine.style.opacity = '0';
        meshLine.style.transition = 'opacity 0.6s';
        var firstGroup = networkSvg.querySelector('g[data-layer]');
        if (firstGroup) networkSvg.insertBefore(meshLine, firstGroup);
        else networkSvg.appendChild(meshLine);
        (function(el) { setTimeout(function() { el.style.opacity = '1'; }, 60); })(meshLine);
      });
    });
  }

  function removeBackgroundMesh(toLayer) {
    if (!networkSvg) return;
    networkSvg.querySelectorAll('[data-mesh-to="' + toLayer + '"]').forEach(function(el) { el.remove(); });
  }

  function showOutputOptions(layerIndex, parentData) {
    var cols = getLayerCols(networkSvgWidth);
    var x = cols[layerIndex];
    clearLayerNodes(layerIndex);

    // Generate contextual outputs from sibling intent options
    var outputs = [];
    if (parentData && parentData.siblingOptions && parentData.siblingOptions.length > 0) {
      outputs = parentData.siblingOptions.map(function (optText) {
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

    networkAllData[layerIndex] = outputs.map(function (o) { return o.sourceData; });
    var svgHeight = networkSvgHeight;
    var outCount = outputs.length;
    var spacing = networkNodeSpacing;
    var outRadius = networkNodeRadius;
    var topPad = 170;
    var innerSpace = svgHeight - topPad - 30;
    var startY = topPad + (innerSpace - spacing * (outCount - 1)) / 2;
    var colors = getNodeColors(layerIndex);

    outputs.forEach(function (out, i) {
      var y = startY + i * spacing;
      var group = svgEl('g', { 'data-layer': String(layerIndex), 'data-index': String(i) });
      group.style.cursor = 'pointer';
      group.style.opacity = '0';
      group.style.transition = 'opacity 0.3s';
      var circle = svgEl('circle', {
        'class': 'node-main',
        cx: x, cy: y, r: outRadius,
        fill: colors.base, stroke: colors.border, 'stroke-width': '2'
      });
      circle.style.transition = 'fill 0.3s, stroke 0.3s, stroke-width 0.3s';
      group.appendChild(circle);
      appendNodePulse(group, x, y, outRadius);
      appendNodeReticle(group, x, y, outRadius);

      var probBadgeEl = svgEl('text', {
        x: x, y: y - outRadius - 10, 'text-anchor': 'middle',
        fill: 'rgba(255,255,255,0.3)', 'font-size': '13', 'font-weight': '600',
        'font-family': 'IBM Plex Mono, monospace'
      });
      probBadgeEl.textContent = out.prob + '%';
      group.appendChild(probBadgeEl);

      var text = svgEl('text', {
        'class': 'node-label', 'text-anchor': 'middle',
        fill: 'rgba(255,255,255,0.75)', 'font-size': '15', 'font-weight': '600',
        'font-family': 'IBM Plex Mono, monospace'
      });
      drawWrappedNodeText(text, out.text, x, y + outRadius + 28, 130, 15);
      group.appendChild(text);

      (function (capturedIdx, capturedData) {
        group.addEventListener('click', function () {
          handleNodeClick(layerIndex, capturedIdx, capturedData);
        });
      })(i, out.sourceData);

      networkSvg.appendChild(group);
      networkAllNodes[layerIndex].push(group);

      setTimeout(function () { group.style.opacity = '1'; }, 40 + i * 70);
    });

    // Full background mesh from all intent nodes to all output nodes
    setTimeout(function() {
      drawBackgroundMesh(2, layerIndex);
    }, 80);
  }

  // ─── Path Display ───────────────────────────────────────────────────

  function buildPathPlaceholders(inputText, contextText, intentText, outputText) {
    var arrowHtml = '<span style="color:rgba(255,255,255,0.2);font-family:\'IBM Plex Mono\',monospace;font-size:14px;"> → </span>';
    function chip(label, filled) {
      if (filled) {
        return '<span style="padding:0.3rem 0.9rem;background:rgba(0,40,100,0.6);color:white;border-radius:4px;font-size:14px;font-weight:600;font-family:\'IBM Plex Mono\',monospace;border:1px solid rgba(100,160,255,0.6);">' + label + '</span>';
      }
      return '<span style="padding:0.3rem 0.9rem;background:transparent;color:rgba(255,255,255,0.25);border-radius:4px;font-size:14px;font-weight:500;font-family:\'IBM Plex Mono\',monospace;border:1px dashed rgba(255,255,255,0.15);">' + label + '</span>';
    }
    return [
      chip(inputText || 'Input', !!inputText),
      arrowHtml,
      chip(contextText || 'Context', !!contextText),
      arrowHtml,
      chip(intentText || 'Intent', !!intentText),
      arrowHtml,
      chip(outputText || 'Output', !!outputText)
    ].join(' ');
  }

  function updatePathDisplay() {
    var pathEl = document.getElementById('neural-path-body');
    if (!pathEl) return;

    var inputText = null, contextText = null, intentText = null, outputText = null;

    if (networkSelectedInputs.size > 0) {
      var inputTexts = [];
      networkSelectedInputs.forEach(function (idx) {
        if (networkAllData[0][idx]) {
          inputTexts.push(networkAllData[0][idx].text || networkAllData[0][idx].word || '?');
        }
      });
      if (inputTexts.length > 0) inputText = inputTexts.join(', ');
    }

    if (networkActiveContextIdx !== null && networkAllData[1][networkActiveContextIdx]) {
      contextText = networkAllData[1][networkActiveContextIdx].text;
    }
    if (networkActiveIntentIdx !== null && networkAllData[2][networkActiveIntentIdx]) {
      intentText = networkAllData[2][networkActiveIntentIdx].text;
    }
    if (networkActiveOutputIdx !== null && networkAllData[3][networkActiveOutputIdx]) {
      outputText = networkAllData[3][networkActiveOutputIdx].text;
    }

    pathEl.innerHTML = buildPathPlaceholders(inputText, contextText, intentText, outputText);
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

  // ─── Filter Functions ──────────────────────────────────────────────

  function setFilter(filterName) {
    filterChosen = true;
    if (filterName === 'nofilter') {
      selectedFilter = null;
      filterExplanation = null;
    } else {
      selectedFilter = filterName;
      filterExplanation = generateFilterExplanation();
    }

    // Update button visuals
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      if (btn.getAttribute('data-filter') === filterName) {
        btn.classList.add('filter-btn-active');
      } else {
        btn.classList.remove('filter-btn-active');
      }
    });

    updateFilterControls();
  }

  function getSelectedFilter() {
    return selectedFilter;
  }

  function getFilterExplanation() {
    return filterExplanation;
  }

  function updateFilterControls() {
    var filterContinue = document.getElementById('btn-filter-continue');
    if (!filterContinue) return;

    // Visual reset for filter buttons when no filter is selected
    if (!filterChosen) {
      document.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.classList.remove('filter-btn-active');
      });
      filterContinue.classList.add('btn-disabled');
      return;
    }

    filterContinue.classList.remove('btn-disabled');
  }

  function generateFilterExplanation() {
    if (!selectedFilter || !currentQuestionRef) return '';

    var prompt = currentQuestionRef.prompt || 'the input';
    // Extract the first key subject from the prompt for humorous context
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
    if (selectedFilter === 'nsfw') explanations = nsfwExplanations;
    else if (selectedFilter === 'dangerous') explanations = dangerousExplanations;
    else if (selectedFilter === 'racism') explanations = racismExplanations;
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
    getActiveOutputIdx: function () { return networkActiveOutputIdx; },
    resetNetworkState: resetNetworkState,
    resetGame: resetGame,
    updateContinueBtn: updateContinueBtn,
    updateSaContinue: updateSaContinue,
    updateKwCount: updateKwCount,
    isValidKeywordSelection: isValidKeywordSelection,
    populatePromptScreen: populatePromptScreen,
    populateKeywordScreen: populateKeywordScreen,
    populateSemanticScreen: populateSemanticScreen,
    populateNeuralScreen: populateNeuralScreen,
    populateAnswerScreen: populateAnswerScreen,
    showResultScreen: showResultScreen,
    setFilter: setFilter,
    getSelectedFilter: getSelectedFilter,
    getFilterExplanation: getFilterExplanation
  };
})();
