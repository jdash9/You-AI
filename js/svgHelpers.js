/**
 * Pure SVG DOM helper functions.
 * Depends on: state.js (for __GS.SVGNS)
 */

(function () {
  'use strict';
  var GS = window.__GS;

  /**
   * Create an SVG element with attributes.
   */
  function svgEl(name, attrs) {
    var el = document.createElementNS(GS.SVGNS, name);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        el.setAttribute(k, attrs[k]);
      });
    }
    return el;
  }

  /**
   * HUD-style corner brackets framing a node, like a camera/target reticle.
   */
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

  /**
   * Expanding ping ring shown while a node is selected.
   */
  function appendNodePulse(group, cx, cy, r) {
    var pulse = svgEl('circle', {
      'class': 'node-pulse',
      cx: cx, cy: cy, r: r
    });
    group.appendChild(pulse);
  }

  /**
   * Wrap text inside a circle using <tspan> elements, vertically centred at cy.
   */
  function drawWrappedNodeText(textEl, rawText, cx, cy, nodeRadius, fontSize) {
    var lineHeight = fontSize * 1.3;
    var maxWidth = nodeRadius * 1.85;
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
        current = word;
      }
    });
    if (current) lines.push(current);

    var totalHeight = (lines.length - 1) * lineHeight;
    lines.forEach(function (line, i) {
      var tspan = document.createElementNS(GS.SVGNS, 'tspan');
      tspan.setAttribute('x', String(Math.round(cx)));
      tspan.setAttribute('y', String(Math.round(cy - totalHeight / 2 + i * lineHeight)));
      tspan.textContent = line;
      textEl.appendChild(tspan);
    });
  }

  // Export helpers to the global namespace for other modules
  window.svgHelpers = {
    svgEl: svgEl,
    appendNodeReticle: appendNodeReticle,
    appendNodePulse: appendNodePulse,
    drawWrappedNodeText: drawWrappedNodeText
  };
})();