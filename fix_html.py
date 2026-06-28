import sys
with open('c:/Users/morla/Documents/GitHub/You-AI/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the duplicate DIL logo section
old = '''    <!-- DIL logo stays fixed in the corner across all game screens -->
    <div class="game-dil-logo-wrap">
    <!-- DIL logo stays fixed in the corner across all game screens -->
    <div class="game-dil-logo-wrap">
      <img src="css/DIL_White 2.svg" alt="DIL">
    </div>'''

new = '''    <!-- DIL logo stays fixed in the corner across all game screens -->
    <div class="game-dil-logo-wrap">
      <img src="css/DIL_White 2.svg" alt="DIL">
    </div>

    <!-- ── Fast Answer Timer ────────────────────────────────────────────────── -->
    <div class="fast-timer" id="fast-timer">
      <div class="fast-timer-bar">
        <div class="fast-timer-fill" id="fast-timer-fill"></div>
      </div>
      <span class="fast-timer-text" id="fast-timer-text">60s</span>
    </div>'''

if old in content:
    content = content.replace(old, new, 1)
    with open('c:/Users/morla/Documents/GitHub/You-AI/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Success: Fixed duplicate and added timer HTML')
else:
    print('Warning: Old text not found')
    # Debug: show what's around that area
    idx = content.find('game-dil-logo-wrap')
    if idx >= 0:
        print(content[idx-50:idx+200])
