// Home Screen Scroll Detection
let scrollSensitivity = 0;
const SCROLL_THRESHOLD = 50;
const SCROLL_LIMIT = 100;
let scrollState = 0;
let slideOffset = 0;
const SLIDE_SPEED = 1.5;

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

document.addEventListener('wheel', (e) => {
  const homeScreen = document.getElementById('homeScreen');
  if (!homeScreen.classList.contains('active')) return;
  e.preventDefault();

  // State 0 → 1: titleCard slides up
  if (e.deltaY > 0 && scrollState === 0) {
    homeScreen.classList.add('animating');
    const titleCard = document.getElementById('titleCard');
    slideOffset = Math.min(window.innerHeight, slideOffset + Math.abs(e.deltaY) * SLIDE_SPEED);
    titleCard.style.transform = `translateY(-${slideOffset}px)`;
    if (slideOffset >= window.innerHeight) {
      titleCard.style.display = 'none';
      titleCard.style.transform = '';
      slideOffset = 0;
      homeScreen.classList.remove('animating');
      homeScreen.classList.add('scrolled-once');
      scrollState = 1;
      scrollSensitivity = 0;
      startTextCycle();
    }
    return;
  }

  // State 1 → 0: titleCard comes back
  if (e.deltaY < 0 && scrollState === 1) {
    const titleCard = document.getElementById('titleCard');
    if (titleCard.style.display === 'none') {
      titleCard.style.display = 'flex';
      titleCard.style.transform = `translateY(-${window.innerHeight}px)`;
      slideOffset = window.innerHeight;
      homeScreen.classList.remove('scrolled-once');
      homeScreen.classList.add('animating');
      clearInterval(textInterval);
      textInterval = null;
      textIndex = 0;
    }
    slideOffset = Math.max(0, slideOffset - Math.abs(e.deltaY) * SLIDE_SPEED);
    titleCard.style.transform = slideOffset > 0 ? `translateY(-${slideOffset}px)` : '';
    if (slideOffset === 0) {
      scrollState = 0;
      homeScreen.classList.remove('animating');
    }
    return;
  }

}, { passive: false });