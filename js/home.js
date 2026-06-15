const roleTexts = [
  'Here you will take the role of the AI',
  'Playfully understand how AI actually forms the answer to a prompt',
  'Get a simple overview of how a Neural Network functions.'
];
let textIndex = 0;
let textInterval = null;

function startTextCycle() {
  const roleBox = document.querySelector('.role-box');
  if (!roleBox || textInterval) return;
  roleBox.innerHTML = roleTexts[textIndex];
  textInterval = setInterval(() => {
    roleBox.style.opacity = '0';
    setTimeout(() => {
      textIndex = (textIndex + 1) % roleTexts.length;
      roleBox.innerHTML = roleTexts[textIndex];
      roleBox.style.opacity = '1';
    }, 400);
  }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
  startTextCycle();
});