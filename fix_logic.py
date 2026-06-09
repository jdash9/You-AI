import os

complete_code = '''        // Show the hidden layer
        hiddenCircles.forEach(c => { c.style.opacity = '1'; });
        inputToHiddenLines.forEach(line => {
          const idx = parseInt(line.getAttribute('data-i'));
          if (idx === i) {
            line.setAttribute('stroke', '#C00000');
            line.setAttribute('stroke-width', '2');
            line.style.opacity = '0.6';
          } else {
            line.setAttribute('stroke', '#2B2B2B');
            line.setAttribute('stroke-width', '1');
            line.style.opacity = '0.15';
          }
        });
        hiddenCircles.forEach(c => {
          c.querySelector('circle').setAttribute('fill', '#1E3A8A');
          c.querySelector('circle').setAttribute('stroke', '#3B82F6');
          c.querySelector('circle').setAttribute('stroke-width', '2');
        });
        outputCircles.forEach(c => {
          c.querySelector('circle').setAttribute('fill', '#2E7D32');
          c.querySelector('circle').setAttribute('stroke', '#4CAF50');
          c.style.opacity = '0.1';
        });
        hiddenToOutputLines.forEach(line => {
          line.setAttribute('stroke', '#2B2B2B');
          line.setAttribute('stroke-width', '1');
          line.style.opacity = '0.15';
        });
        networkState.path = [checkedKeywords[i], null, null];
        updatePathDisplay();
      });
      svg.appendChild(group);
      inputCircles.push(group);
    }

    container.appendChild(svg);

    const pathContainer = document.createElement('div');
    pathContainer.id = 'neural-path';
    pathContainer.style.cssText = 'margin-top:2rem;padding:1.5rem;background:var(--color-dark-panel);border:1px solid var(--color-dark-lighter);min-height:3rem;display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;justify-content:center;width:100%;max-width:800px;';
    pathContainer.innerHTML = '<span style="color:var(--color-text-secondary);font-size:0.875rem;">Click a red input node to start</span>';
    container.appendChild(pathContainer);

    const answerBtn = document.createElement('label');
    answerBtn.htmlFor = 's-answer';
    answerBtn.className = 'btn btn-full';
    answerBtn.style.cssText = 'margin-top:2rem;text-align:center;max-width:400px;width:100%;';
    answerBtn.textContent = 'Generate Answer';
    container.appendChild(answerBtn);
  }

  function updatePathDisplay() {
    const pathEl = document.getElementById('neural-path');
    if (!pathEl) return;
    const state = networkState;
    if (state.path[0] === null) {
      pathEl.innerHTML = '<span style="color:var(--color-text-secondary);font-size:0.875rem;">Click a red input node to start</span>';
      return;
    }
    pathEl.innerHTML = '';
    const headerSpan = document.createElement('span');
    headerSpan.style.cssText = 'font-size:0.75rem;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.05em;margin-right:0.5rem;';
    headerSpan.textContent = 'Path:';
    pathEl.appendChild(headerSpan);
    const colors = ['#A40000', '#1E3A8A', '#2E7D32'];
    state.path.forEach((word, idx) => {
      if (word !== null) {
        const node = document.createElement('span');
        node.style.cssText = 'padding:0.4rem 0.85rem;background:' + colors[idx] + ';color:#F2F2F2;border-radius:50px;font-size:0.875rem;font-weight:600;';
        node.textContent = word;
        pathEl.appendChild(node);
        if (idx < 2) {
          const arrowS = document.createElement('span');
          arrowS.style.cssText = 'color:var(--color-text-secondary);font-size:1rem;';
          arrowS.textContent = '\\u2192';
          pathEl.appendChild(arrowS);
        }
      } else {
        const placeholder = document.createElement('span');
        placeholder.style.cssText = 'padding:0.4rem 0.85rem;background:var(--color-dark-lighter);color:var(--color-text-secondary);border-radius:50px;font-size:0.875rem;font-style:italic;';
        placeholder.textContent = '?';
        pathEl.appendChild(placeholder);
        if (idx < 2) {
          const arrowS = document.createElement('span');
          arrowS.style.cssText = 'color:var(--color-text-secondary);font-size:1rem;';
          arrowS.textContent = '\\u2192';
          pathEl.appendChild(arrowS);
        }
      }
    });
  }

  function populateAnswerScreen(question, mode, type) {
    const badgeMode = document.getElementById('badge-mode');
    const badgeType = document.getElementById('badge-type');
    const badgeKeywords = document.getElementById('badge-keywords');
    const answerText = document.getElementById('answer-text');
    const keywordsCount = document.querySelectorAll('.keyword-toggle:checked').length;
    if (badgeMode) badgeMode.textContent = 'Mode: ' + (mode || 'Own Knowledge');
    if (badgeType) badgeType.textContent = 'Type: ' + (type || 'Accurate');
    if (badgeKeywords) badgeKeywords.textContent = 'Keywords: ' + keywordsCount;
    if (answerText && question) {
      const path = networkState.path;
      const pathText = path.filter(p => p !== null).join(' \\u2192 ');
      const checked = getCheckedKeywords();
      const mappings = {};
      if (path[0] && path[1] && networkState.inputSelected !== null && checked[networkState.inputSelected]) {
        mappings[checked[networkState.inputSelected]] = path[0];
      }
      let answer = question.answer || '';
      Object.keys(mappings).forEach(original => {
        const mapped = mappings[original];
        if (mapped && mapped.trim()) {
          const escaped = original.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
          const regex = new RegExp('\\\\b' + escaped + '\\\\b', 'gi');
          answer = answer.replace(regex, mapped.trim());
        }
      });
      let response = 'Neural Network Path: ' + pathText + '\\n\\n---\\n\\n' + answer;
      if (currentMode === 'internet') response += '\\n\\n[Sources: Synthesized from web references]';
      if (currentType === 'fast') {
        const ps = response.split('\\n\\n');
        response = ps[0] || response;
      }
      answerText.textContent = response;
    }
  }

  let currentMode = 'own';
  let currentType = 'accurate';

  window.updateKwCount = function() {
    const checked = document.querySelectorAll('.keyword-toggle:checked').length;
    const countEl = document.getElementById('kw-count');
    if (countEl) countEl.textContent = checked;
    const btn = document.getElementById('kw-continue');
    if (btn) {
      if (checked >= 3) btn.classList.remove('btn-disabled');
      else btn.classList.add('btn-disabled');
    }
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
    getNetworkState: getNetworkState,
    resetNetworkState: resetNetworkState,
    resetGame: resetGame,
    updateContinueBtn: updateContinueBtn,
    populatePromptScreen: populatePromptScreen,
    populateKeywordScreen: populateKeywordScreen,
    populateSemanticScreen: populateSemanticScreen,
    populateNeuralScreen: populateNeuralScreen,
    populateAnswerScreen: populateAnswerScreen,
    setMode: function(m) { currentMode = m; },
    setType: function(t) { currentType = t; },
    getMode: function() { return currentMode === 'own' ? 'Own Knowledge' : 'Internet'; },
    getType: function() { return currentType === 'accurate' ? 'Accurate' : 'Fast'; }
  };
})();
'''

path = r'c:\Users\morla\Documents\GitHub\You-AI\js\gameLogic.js'
with open(path, 'r', encoding='utf-8') as f:
    current = f.read()

# Remove the broken trailing line
if current.endswith('        // Show the hidden layer\n        hiddenCircles.forEach(c =>\n'):
    current = current[:-len('        // Show the hidden layer\n        hiddenCircles.forEach(c =>\n')]

with open(path, 'w', encoding='utf-8') as f:
    f.write(current + complete_code)

print('Lines now:', len((current + complete_code).split('\n')))
