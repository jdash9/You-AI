import sys
path = 'c:/Users/morla/Documents/GitHub/You-AI/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
print('File read, length:', len(content))

# Use repr to see actual characters
idx = content.find('game-dil-logo-wrap')
print('Found at:', idx)
print(repr(content[idx:idx+250]))
