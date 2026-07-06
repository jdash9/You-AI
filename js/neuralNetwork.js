/**
 * Neural network visualization, click handling, connections, and path display.
 * Depends on: state.js, svgHelpers.js
 */

(function () {
  'use strict';
  var GS = window.__GS;
  var SH = window.svgHelpers;

  // ─── Layout helpers ──────────────────────────────────────────────────

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
    return {
      base: 'rgba(0,8,20,0.85)',
      border: 'rgba(255,255,255,0.18)',
      active: 'rgba(0,40,100,0.65)',
      activeBorder: 'rgba(100,160,255,0.9)'
    };
  }

  function getNodeRadius(layerIndex) {
    return 42;
  }

  function calculateSvgHeight(nodeCount) {
    var CANVAS_HEIGHT = 1080;
    var SCREEN_PADDING = 60 + 60;
    var SAFETY_MARGIN = 20;
    var available = CANVAS_HEIGHT - SCREEN_PADDING - SAFETY_MARGIN;
    var MIN_SPACING = 175;
    var TOP_PAD = 130;
    var BOT_PAD = 30;
    var n = nodeCount || 3;
    var minNeeded = TOP_PAD + BOT_PAD + Math.max(0, n - 1) * MIN_SPACING;
    return Math.max(available, minNeeded);
  }

  // ─── Drawing ─────────────────────────────────────────────────────────

  function drawLayerNodes(layerIndex, items) {
    var cols = getLayerCols(GS.networkSvgWidth);
    var x = cols[layerIndex];
    var svgHeight = GS.networkSvgHeight;
    var count = items.length;
    var topPad = 130;
    var botPad = 30;
    var innerSpace = svgHeight - topPad - botPad;
    var spacing = innerSpace / Math.max(1, count - 1);
    spacing = Math.min(260, spacing);
    var nodeRadius = layerIndex === 0
      ? Math.min(getNodeRadius(layerIndex), Math.floor(spacing * 0.38))
      : GS.networkNodeRadius;
    if (layerIndex === 0) {
      GS.networkNodeRadius = nodeRadius;
      GS.networkNodeSpacing = spacing;
    }
    var startY = topPad;

    GS.networkAllNodes[layerIndex] = [];
    GS.networkAllData[layerIndex] = items.map(function (item) {
      return item.sourceData || item;
    });

    items.forEach(function (item, i) {
      var y = startY + i * spacing;
      var group = SH.svgEl('g', { 'data-layer': String(layerIndex), 'data-index': String(i) });
      group.style.cursor = 'pointer';
      group.style.opacity = '0';
      group.style.transition = 'opacity 0.3s';

      var colors = getNodeColors(layerIndex);
      var circle = SH.svgEl('circle', {
        'class': 'node-main',
        cx: x, cy: y, r: nodeRadius,
        fill: colors.base, stroke: colors.border, 'stroke-width': '2'
      });
      circle.style.transition = 'fill 0.3s, stroke 0.3s, stroke-width 0.3s';
      group.appendChild(circle);
      SH.appendNodePulse(group, x, y, nodeRadius);
      SH.appendNodeReticle(group, x, y, nodeRadius);

      if (item.prob !== null && item.prob !== undefined) {
        var probBadge = SH.svgEl('text', {
          x: x, y: y - nodeRadius - 10, 'text-anchor': 'middle',
          fill: 'rgba(255,255,255,0.3)', 'font-size': '13', 'font-weight': '600',
          'font-family': 'IBM Plex Mono, monospace'
        });
        probBadge.textContent = item.prob + '%';
        group.appendChild(probBadge);
      }

      var text = SH.svgEl('text', {
        'class': 'node-label', 'text-anchor': 'middle',
        fill: 'rgba(255,255,255,0.75)', 'font-size': '15', 'font-weight': '600',
        'font-family': 'IBM Plex Mono, monospace'
      });
      SH.drawWrappedNodeText(text, item.text, x, y + nodeRadius + 28, 130, 15);
      group.appendChild(text);

      (function (capturedIdx, capturedData) {
        group.addEventListener('click', function () {
          handleNodeClick(layerIndex, capturedIdx, capturedData);
        });
      })(i, item.sourceData || item);

      GS.networkSvg.appendChild(group);
      GS.networkAllNodes[layerIndex].push(group);

      setTimeout(function () { group.style.opacity = '1'; }, 40 + i * 70);
    });
  }

  // ─── Visual helpers ──────────────────────────────────────────────────

  function highlightNode(layerIndex, nodeIndex, isActive) {
    var node = GS.networkAllNodes[layerIndex] && GS.networkAllNodes[layerIndex][nodeIndex];
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
    var node = GS.networkAllNodes[layerIndex] && GS.networkAllNodes[layerIndex][nodeIndex];
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

  // ─── Connections ─────────────────────────────────────────────────────

  function drawConnection(fromLayer, fromIdx, toLayer, toIdx) {
    var fromNode = GS.networkAllNodes[fromLayer][fromIdx];
    var toNode = GS.networkAllNodes[toLayer][toIdx];
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

    var line = SH.svgEl('line', {
      x1: x1 + r1, y1: y1,
      x2: x2 - r2, y2: y2,
      stroke: 'rgba(100,160,255,1)', 'stroke-width': '2.5'
    });
    line.style.opacity = '0';
    line.style.transition = 'opacity 0.4s';
    line.setAttribute('data-conn-from', String(fromLayer));
    line.setAttribute('data-conn-to', String(toLayer));

    var firstGroup = GS.networkSvg.querySelector('g[data-layer]');
    if (firstGroup) {
      GS.networkSvg.insertBefore(line, firstGroup);
    } else {
      GS.networkSvg.appendChild(line);
    }

    GS.networkConnections.push({
      line: line,
      fromLayer: fromLayer, fromIdx: fromIdx,
      toLayer: toLayer, toIdx: toIdx
    });

    setTimeout(function () { line.style.opacity = '1'; }, 30);
  }

  function drawAllInputConnections() {
    GS.networkConnections = GS.networkConnections.filter(function (conn) {
      if (conn.fromLayer === 0 && conn.toLayer === 1) {
        conn.line.remove();
        return false;
      }
      return true;
    });

    if (GS.networkActiveContextIdx === null) return;

    GS.networkSelectedInputs.forEach(function (inputIdx) {
      drawConnection(0, inputIdx, 1, GS.networkActiveContextIdx);
    });
  }

  function removeConnectionsFromInput(inputIdx) {
    GS.networkConnections = GS.networkConnections.filter(function (conn) {
      if (conn.fromLayer === 0 && conn.fromIdx === inputIdx) {
        conn.line.remove();
        return false;
      }
      return true;
    });
  }

  function recalcConnectionPositions() {
    GS.networkConnections.forEach(function (conn) {
      var fromNode = GS.networkAllNodes[conn.fromLayer][conn.fromIdx];
      var toNode = GS.networkAllNodes[conn.toLayer][conn.toIdx];
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

  function removeConnectionsFromLayer(layerIndex) {
    GS.networkConnections = GS.networkConnections.filter(function (conn) {
      if (conn.fromLayer >= layerIndex || conn.toLayer >= layerIndex) {
        conn.line.remove();
        return false;
      }
      return true;
    });
  }

  function clearLayerNodes(layerIndex) {
    removeBackgroundMesh(layerIndex);
    if (GS.networkAllNodes[layerIndex]) {
      GS.networkAllNodes[layerIndex].forEach(function (node) { node.remove(); });
    }
    GS.networkAllNodes[layerIndex] = [];
    GS.networkAllData[layerIndex] = [];
  }

  // ─── Background mesh ─────────────────────────────────────────────────

  function drawBackgroundMesh(fromLayer, toLayer) {
    removeBackgroundMesh(toLayer);
    var fromNodes = GS.networkAllNodes[fromLayer];
    var toNodes = GS.networkAllNodes[toLayer];
    if (!fromNodes || !toNodes) return;

    fromNodes.forEach(function (fromNode) {
      var fromCircle = fromNode.querySelector('circle.node-main');
      if (!fromCircle) return;
      var fr = parseFloat(fromCircle.getAttribute('r'));
      var fx = parseFloat(fromCircle.getAttribute('cx')) + fr;
      var fy = parseFloat(fromCircle.getAttribute('cy'));

      toNodes.forEach(function (toNode) {
        var toCircle = toNode.querySelector('circle.node-main');
        if (!toCircle) return;
        var tr = parseFloat(toCircle.getAttribute('r'));
        var tx = parseFloat(toCircle.getAttribute('cx')) - tr;
        var ty = parseFloat(toCircle.getAttribute('cy'));

        var meshLine = SH.svgEl('line', {
          x1: fx, y1: fy, x2: tx, y2: ty,
          stroke: 'rgba(100,160,255,0.09)',
          'stroke-width': '1'
        });
        meshLine.setAttribute('data-mesh-to', String(toLayer));
        meshLine.style.opacity = '0';
        meshLine.style.transition = 'opacity 0.6s';
        var firstGroup = GS.networkSvg.querySelector('g[data-layer]');
        if (firstGroup) GS.networkSvg.insertBefore(meshLine, firstGroup);
        else GS.networkSvg.appendChild(meshLine);
        (function (el) { setTimeout(function () { el.style.opacity = '1'; }, 60); })(meshLine);
      });
    });
  }

  function removeBackgroundMesh(toLayer) {
    if (!GS.networkSvg) return;
    GS.networkSvg.querySelectorAll('[data-mesh-to="' + toLayer + '"]').forEach(function (el) { el.remove(); });
  }

  // ─── Show next layer options ─────────────────────────────────────────

  function showNextLayerOptions(layerIndex, nodeIndex, data) {
    var nextLayer = layerIndex + 1;
    if (nextLayer >= 4) return;

    clearLayerNodes(nextLayer);

    if (layerIndex > 0) {
      for (var l = nextLayer + 1; l < 4; l++) {
        clearLayerNodes(l);
      }
    }

    var options = [];

    if (layerIndex === 0 && data && data.options) {
      options = data.options.map(function (opt) {
        return { text: opt.text, prob: opt.prob, sourceData: opt };
      });
    } else if (layerIndex === 1 && data && data.next) {
      options = data.next.map(function (optText) {
        var match = optText.match(/^(.+?)\s+(\d+)%$/);
        var label = match ? match[1] : optText;
        var prob = match ? match[2] : '0';
        return { text: label, prob: prob, sourceData: { text: label, prob: prob, siblingOptions: data.next } };
      });
    } else if (layerIndex === 2) {
      showOutputOptions(nextLayer, data);
      return;
    }

    if (options.length > 0) {
      drawLayerNodes(nextLayer, options);
      setTimeout(function () {
        drawBackgroundMesh(layerIndex, nextLayer);
      }, 80);
    }
  }

  // ─── Output options ──────────────────────────────────────────────────

  function showOutputOptions(layerIndex, parentData) {
    var cols = getLayerCols(GS.networkSvgWidth);
    var x = cols[layerIndex];
    clearLayerNodes(layerIndex);

    function getAnswerTextForLabel(label) {
      if (!label) return '';
      var sourceQuestion = GS.currentQuestionRef || null;
      if (sourceQuestion && sourceQuestion.outputAnswers && sourceQuestion.outputAnswers.length > 0) {
        var match = sourceQuestion.outputAnswers.find(function (entry) {
          if (entry.label && entry.label.toLowerCase() === label.toLowerCase()) {
            return true;
          }
          var variants = [];
          if (entry.labels && entry.labels.length > 0) {
            variants = entry.labels;
          } else if (entry.aliases && entry.aliases.length > 0) {
            variants = entry.aliases;
          } else if (entry.text && !entry.label) {
            variants = [entry.text];
          }
          return variants.some(function (variant) {
            return (variant || '').toLowerCase() === label.toLowerCase();
          });
        });
        if (match) {
          return match.text || match.answer || '';
        }
      }
      return '';
    }

    var outputs = [];
    if (parentData && parentData.siblingOptions && parentData.siblingOptions.length > 0) {
      outputs = parentData.siblingOptions.map(function (optText) {
        var match = optText.match(/^(.+?)\s+(\d+)%$/);
        var label = match ? match[1] : optText;
        var prob = match ? parseInt(match[2]) : 5;
        return {
          text: label + ' (result)',
          prob: prob,
          sourceData: {
            text: label + ' (result)',
            answerText: getAnswerTextForLabel(label)
          }
        };
      });
    } else {
      var parentText = parentData ? (parentData.text || 'Result') : 'Result';
      outputs = [
        { text: parentText + ' (result)', prob: 75, sourceData: { text: parentText + ' (result)' } },
        { text: 'Alternative result', prob: 20, sourceData: { text: 'Alternative result' } },
        { text: 'Other possibility', prob: 5, sourceData: { text: 'Other possibility' } }
      ];
    }

    GS.networkAllData[layerIndex] = outputs.map(function (o) { return o.sourceData; });
    var svgHeight = GS.networkSvgHeight;
    var outCount = outputs.length;
    var outRadius = GS.networkNodeRadius;
    var topPad = 130;
    var innerSpace = svgHeight - topPad - 30;
    var spacing = Math.min(260, innerSpace / Math.max(1, outCount - 1));
    var startY = topPad;
    var colors = getNodeColors(layerIndex);

    outputs.forEach(function (out, i) {
      var y = startY + i * spacing;
      var group = SH.svgEl('g', { 'data-layer': String(layerIndex), 'data-index': String(i) });
      group.style.cursor = 'pointer';
      group.style.opacity = '0';
      group.style.transition = 'opacity 0.3s';
      var circle = SH.svgEl('circle', {
        'class': 'node-main',
        cx: x, cy: y, r: outRadius,
        fill: colors.base, stroke: colors.border, 'stroke-width': '2'
      });
      circle.style.transition = 'fill 0.3s, stroke 0.3s, stroke-width 0.3s';
      group.appendChild(circle);
      SH.appendNodePulse(group, x, y, outRadius);
      SH.appendNodeReticle(group, x, y, outRadius);

      var probBadgeEl = SH.svgEl('text', {
        x: x, y: y - outRadius - 10, 'text-anchor': 'middle',
        fill: 'rgba(255,255,255,0.3)', 'font-size': '13', 'font-weight': '600',
        'font-family': 'IBM Plex Mono, monospace'
      });
      probBadgeEl.textContent = out.prob + '%';
      group.appendChild(probBadgeEl);

      var text = SH.svgEl('text', {
        'class': 'node-label', 'text-anchor': 'middle',
        fill: 'rgba(255,255,255,0.75)', 'font-size': '15', 'font-weight': '600',
        'font-family': 'IBM Plex Mono, monospace'
      });
      SH.drawWrappedNodeText(text, out.text, x, y + outRadius + 28, 130, 15);
      group.appendChild(text);

      (function (capturedIdx, capturedData) {
        group.addEventListener('click', function () {
          handleNodeClick(layerIndex, capturedIdx, capturedData);
        });
      })(i, out.sourceData);

      GS.networkSvg.appendChild(group);
      GS.networkAllNodes[layerIndex].push(group);

      setTimeout(function () { group.style.opacity = '1'; }, 40 + i * 70);
    });

    setTimeout(function () {
      drawBackgroundMesh(2, layerIndex);
    }, 80);
  }

  // ─── Click handlers ──────────────────────────────────────────────────

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
    if (GS.networkSelectedInputs.has(nodeIndex)) {
      GS.networkSelectedInputs.delete(nodeIndex);
      resetNodeVisual(0, nodeIndex);
      removeConnectionsFromInput(nodeIndex);

      if (GS.networkActiveContextIdx !== null) {
        GS.networkConnections = GS.networkConnections.filter(function (conn) {
          if (conn.fromLayer === 1) {
            conn.line.remove();
            return false;
          }
          return true;
        });
        if (GS.networkActiveIntentIdx !== null) {
          resetNodeVisual(2, GS.networkActiveIntentIdx);
          GS.networkActiveIntentIdx = null;
        }
        if (GS.networkActiveOutputIdx !== null) {
          resetNodeVisual(3, GS.networkActiveOutputIdx);
          GS.networkActiveOutputIdx = null;
        }
        clearLayerNodes(3);
        if (GS.networkAllNodes[1] && GS.networkAllNodes[1][GS.networkActiveContextIdx]) {
          highlightNode(1, GS.networkActiveContextIdx, true);
        }
      }

      if (GS.networkActiveInputIdx === nodeIndex) {
        GS.networkActiveInputIdx = null;
        var newActiveIdx = null;
        GS.networkSelectedInputs.forEach(function (idx) {
          if (newActiveIdx === null) newActiveIdx = idx;
        });
        GS.networkActiveInputIdx = newActiveIdx;

        if (GS.networkActiveInputIdx !== null) {
          var activeData = GS.networkAllData[0][GS.networkActiveInputIdx];
          if (activeData) {
            showNextLayerOptions(0, GS.networkActiveInputIdx, activeData);
            if (GS.networkAllNodes[1] && GS.networkAllNodes[1][GS.networkActiveContextIdx]) {
              highlightNode(1, GS.networkActiveContextIdx, true);
            }
          }
        } else {
          removeConnectionsFromLayer(0);
          clearLayerNodes(1);
          clearLayerNodes(2);
          clearLayerNodes(3);
          GS.networkActiveContextIdx = null;
          GS.networkActiveIntentIdx = null;
          GS.networkActiveOutputIdx = null;
          updatePathDisplay();
        }
      }
    } else {
      GS.networkSelectedInputs.add(nodeIndex);
      GS.networkActiveInputIdx = nodeIndex;

      if (GS.networkSelectedInputs.size > 0 && GS.networkActiveContextIdx !== null) {
        GS.networkConnections = GS.networkConnections.filter(function (conn) {
          if (conn.fromLayer === 1) {
            conn.line.remove();
            return false;
          }
          return true;
        });
        if (GS.networkAllNodes[1] && GS.networkAllNodes[1][GS.networkActiveContextIdx]) {
          highlightNode(1, GS.networkActiveContextIdx, true);
        }
      }

      showNextLayerOptions(0, nodeIndex, data);

      if (GS.networkActiveContextIdx !== null && GS.networkAllNodes[1] && GS.networkAllNodes[1][GS.networkActiveContextIdx]) {
        highlightNode(1, GS.networkActiveContextIdx, true);
        var contextData = GS.networkAllData[1][GS.networkActiveContextIdx];
        if (contextData) {
          showNextLayerOptions(1, GS.networkActiveContextIdx, contextData);
        }
        GS.networkActiveIntentIdx = null;
        GS.networkActiveOutputIdx = null;
        clearLayerNodes(3);
      }
    }

    GS.networkAllNodes[0].forEach(function (node, idx) {
      if (GS.networkSelectedInputs.has(idx)) {
        highlightNode(0, idx, idx === GS.networkActiveInputIdx);
      } else {
        resetNodeVisual(0, idx);
      }
    });

    if (GS.networkActiveContextIdx !== null && GS.networkAllNodes[1][GS.networkActiveContextIdx]) {
      drawAllInputConnections();
    }

    updatePathDisplay();
  }

  function handleContextClick(nodeIndex, data) {
    if (GS.networkActiveContextIdx === nodeIndex) {
      resetNodeVisual(1, nodeIndex);
      GS.networkActiveContextIdx = null;
      removeConnectionsFromLayer(1);
      clearLayerNodes(2);
      clearLayerNodes(3);
      GS.networkActiveIntentIdx = null;
      GS.networkActiveOutputIdx = null;
    } else {
      if (GS.networkActiveContextIdx !== null) {
        resetNodeVisual(1, GS.networkActiveContextIdx);
      }
      GS.networkActiveContextIdx = nodeIndex;
      highlightNode(1, nodeIndex, true);

      removeConnectionsFromLayer(0);
      drawAllInputConnections();

      clearLayerNodes(2);
      clearLayerNodes(3);
      GS.networkActiveIntentIdx = null;
      GS.networkActiveOutputIdx = null;

      showNextLayerOptions(1, nodeIndex, data);
    }
    updatePathDisplay();
  }

  function handleIntentClick(nodeIndex, data) {
    if (GS.networkActiveIntentIdx === nodeIndex) {
      resetNodeVisual(2, nodeIndex);
      GS.networkActiveIntentIdx = null;
      removeConnectionsFromLayer(2);
      clearLayerNodes(3);
      GS.networkActiveOutputIdx = null;
    } else {
      if (GS.networkActiveIntentIdx !== null) {
        resetNodeVisual(2, GS.networkActiveIntentIdx);
      }
      GS.networkActiveIntentIdx = nodeIndex;
      highlightNode(2, nodeIndex, true);

      removeConnectionsFromLayer(2);
      clearLayerNodes(3);
      GS.networkActiveOutputIdx = null;

      if (GS.networkActiveContextIdx !== null) {
        drawConnection(1, GS.networkActiveContextIdx, 2, nodeIndex);
      }

      showNextLayerOptions(2, nodeIndex, data);
    }
    updatePathDisplay();
  }

  function handleOutputClick(nodeIndex, data) {
    if (GS.networkActiveIntentIdx === null) return;

    if (GS.networkActiveOutputIdx === nodeIndex) {
      resetNodeVisual(3, nodeIndex);
      GS.networkActiveOutputIdx = null;
      removeConnectionsFromLayer(2);
    } else {
      if (GS.networkActiveOutputIdx !== null) {
        resetNodeVisual(3, GS.networkActiveOutputIdx);
      }
      GS.networkActiveOutputIdx = nodeIndex;
      highlightNode(3, nodeIndex, true);

      drawConnection(2, GS.networkActiveIntentIdx, 3, nodeIndex);

      // Navigate to filter screen
      var r = document.getElementById('s-filter');
      if (r) { r.checked = true; GS.currentScreen = 's-filter'; }
      GS.selectedFilter = null;
      GS.filterExplanation = null;
      GS.filterChosen = false;
      if (typeof window.updateFilterControls === 'function') window.updateFilterControls();
    }
    updatePathDisplay();
  }

  // ─── Path display ────────────────────────────────────────────────────

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

    if (GS.networkSelectedInputs.size > 0) {
      var inputTexts = [];
      GS.networkSelectedInputs.forEach(function (idx) {
        if (GS.networkAllData[0][idx]) {
          inputTexts.push(GS.networkAllData[0][idx].text || GS.networkAllData[0][idx].word || '?');
        }
      });
      if (inputTexts.length > 0) inputText = inputTexts.join(', ');
    }

    if (GS.networkActiveContextIdx !== null && GS.networkAllData[1][GS.networkActiveContextIdx]) {
      contextText = GS.networkAllData[1][GS.networkActiveContextIdx].text;
    }
    if (GS.networkActiveIntentIdx !== null && GS.networkAllData[2][GS.networkActiveIntentIdx]) {
      intentText = GS.networkAllData[2][GS.networkActiveIntentIdx].text;
    }
    if (GS.networkActiveOutputIdx !== null && GS.networkAllData[3][GS.networkActiveOutputIdx]) {
      outputText = GS.networkAllData[3][GS.networkActiveOutputIdx].text;
    }

    pathEl.innerHTML = buildPathPlaceholders(inputText, contextText, intentText, outputText);
  }

  // ─── Public API ──────────────────────────────────────────────────────

  window.NeuralNetwork = {
    getLayerCols: getLayerCols,
    getNodeColors: getNodeColors,
    getNodeRadius: getNodeRadius,
    calculateSvgHeight: calculateSvgHeight,
    drawLayerNodes: drawLayerNodes,
    highlightNode: highlightNode,
    resetNodeVisual: resetNodeVisual,
    drawConnection: drawConnection,
    drawAllInputConnections: drawAllInputConnections,
    removeConnectionsFromInput: removeConnectionsFromInput,
    recalcConnectionPositions: recalcConnectionPositions,
    removeConnectionsFromLayer: removeConnectionsFromLayer,
    clearLayerNodes: clearLayerNodes,
    drawBackgroundMesh: drawBackgroundMesh,
    removeBackgroundMesh: removeBackgroundMesh,
    showNextLayerOptions: showNextLayerOptions,
    showOutputOptions: showOutputOptions,
    handleNodeClick: handleNodeClick,
    handleInputClick: handleInputClick,
    handleContextClick: handleContextClick,
    handleIntentClick: handleIntentClick,
    handleOutputClick: handleOutputClick,
    buildPathPlaceholders: buildPathPlaceholders,
    updatePathDisplay: updatePathDisplay
  };
})();