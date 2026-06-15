// home.js — handles the intro animation on the home screen
// the background fades in and the text cycles through different descriptions

// the three texts that rotate on the home screen
const roleTexts = [
  'Here you will take the role of the AI',
  'Playfully understand how AI actually forms the answer to a prompt',
  'Get a simple overview of how a Neural Network functions.'
];

let textIndex = 0;
let textInterval = null; // store the interval so we don't accidentally start it twice

// starts cycling through the role description texts every 4 seconds
function startTextCycle() {
  const roleBox = document.querySelector('.role-box');
  if (!roleBox || textInterval) return; // don't start if already running

  roleBox.innerHTML = roleTexts[textIndex];

  textInterval = setInterval(() => {
    // fade out, swap text, fade back in
    roleBox.style.opacity = '0';
    setTimeout(() => {
      textIndex = (textIndex + 1) % roleTexts.length;
      roleBox.innerHTML = roleTexts[textIndex];
      roleBox.style.opacity = '1';
    }, 400); // 400ms matches the CSS transition duration
  }, 4000);
}

// wait for the page to fully load before touching the DOM
document.addEventListener('DOMContentLoaded', () => {
  startTextCycle();
});
