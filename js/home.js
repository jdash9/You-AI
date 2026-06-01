// Home Screen Scroll Detection
let scrollSensitivity = 0;
const SCROLL_THRESHOLD = 50;
const SCROLL_LIMIT = 100; // Maximum scroll accumulation
let scrollState = 0;
let slideOffset = 0;
const SLIDE_SPEED = 1.5; // Adjust this value to control slide speed

document.addEventListener('wheel', (e) => {
  const homeScreen = document.getElementById('homeScreen');
  
  if (!homeScreen.classList.contains('active')) {
    return;
  }

  e.preventDefault();

  // State 0 → 1 slide animation
if (e.deltaY > 0 && scrollState === 0) {
  slideOffset = Math.min(window.innerHeight, slideOffset + Math.abs(e.deltaY) * SLIDE_SPEED);
  homeScreen.style.transform = `translateY(-${slideOffset}px)`;
  if (slideOffset >= window.innerHeight) {
    homeScreen.style.transform = '';
    slideOffset = 0;
    homeScreen.classList.add('scrolled-once');
    scrollState = 1;
    scrollSensitivity = 0;
    const rb = homeScreen.querySelector('.role-box');
    if (rb) rb.innerHTML = 'Here you will take the role of the AI';
  }
  return;
}

// Scroll up to return
if (slideOffset > 0 && e.deltaY < 0) {
  slideOffset = Math.max(0, slideOffset - Math.abs(e.deltaY) * SLIDE_SPEED);
  homeScreen.style.transform = slideOffset > 0 ? `translateY(-${slideOffset}px)` : '';
  return;
}

  scrollSensitivity += e.deltaY;
  
  // Limit scroll sensitivity to prevent excessive accumulation
  scrollSensitivity = Math.max(-SCROLL_LIMIT, Math.min(SCROLL_LIMIT, scrollSensitivity));

  const roleBox = homeScreen.querySelector('.role-box');
  const setScrollState = (state) => {
    homeScreen.classList.remove('scrolled-once', 'scrolled-twice', 'scrolled-thrice', 'scrolled-fourth');
    if (state === 1) homeScreen.classList.add('scrolled-once');
    if (state === 2) homeScreen.classList.add('scrolled-twice');
    if (state === 3) homeScreen.classList.add('scrolled-thrice');
    if (state === 4) homeScreen.classList.add('scrolled-fourth');
    scrollState = state;
    scrollSensitivity = 0;
  };

  const setRoleText = (text) => {
    if (roleBox) {
      roleBox.innerHTML = text;
    }
  };

  if (scrollSensitivity > SCROLL_THRESHOLD && scrollState === 0) {
    setScrollState(1);
    setRoleText('Here you will take the role of the AI');
  }

  else if (scrollSensitivity > SCROLL_THRESHOLD && scrollState === 1) {
    setScrollState(2);
    setRoleText('Here you will take the role of the AI');
  }

  else if (scrollSensitivity > SCROLL_THRESHOLD && scrollState === 2) {
    setScrollState(3);
    setRoleText('Playfully understand how <br>AI actually forms the <br>answer to a prompt');
  }

  else if (scrollSensitivity > SCROLL_THRESHOLD && scrollState === 3) {
    setScrollState(4);
    setRoleText('Get a simple overview of<br>how a Neural Network<br>function.');
  }

  else if (scrollSensitivity < -SCROLL_THRESHOLD && scrollState === 4) {
    setScrollState(3);
    setRoleText('Playfully understand how <br>AI actually forms the <br>answer to a prompt');
  }

  else if (scrollSensitivity < -SCROLL_THRESHOLD && scrollState === 3) {
    setScrollState(2);
    setRoleText('Here you will take the role of the AI');
  }

  else if (scrollSensitivity < -SCROLL_THRESHOLD && scrollState === 2) {
    setScrollState(1);
    setRoleText('Here you will take the role of the AI');
  }

  else if (scrollSensitivity < -SCROLL_THRESHOLD && scrollState === 1) {
    setScrollState(0);
    setRoleText('Here you will take the role of the AI');
  }
}, { passive: false });
