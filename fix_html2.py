import sys, os, shutil
path = 'c:/Users/morla/Documents/GitHub/You-AI/index.html'
tmp = os.environ['TEMP'] + '\\index_modified.html'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_mid = '    <!-- DIL logo stays fixed in the corner across all game screens -->\n    <div class="game-dil-logo-wrap">\n      <img src="css/DIL_White 2.svg" alt="DIL">\n    </div>\n\n    <!-- Fast Answer Timer -------->\n    <div class="fast-timer" id="fast-timer">\n      <div class="fast-timer-bar">\n        <div class="fast-timer-fill" id="fast-timer-fill"></div>\n      </div>\n      <span class="fast-timer-text" id="fast-timer-text">60s</span>\n    </div>\n'

new_content = ''.join(lines[:68]) + new_mid + ''.join(lines[74:])

with open(tmp, 'w', encoding='utf-8') as f:
    f.write(new_content)

shutil.copy2(tmp, path)
print('Success! File updated.')
else:
    print('Old not found')
    import sys
    sys.exit(1)


