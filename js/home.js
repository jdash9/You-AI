const roleTexts = [
  'You are the AI now.',
  'Watch a prompt become an answer.',
  'Explore the neural network logic.'
];

let textIndex = 0;
let isRunning = false;

const TYPING_SPEED = 70;
const DELETE_SPEED = 35;
const PAUSE_AFTER_TYPE = 3800;
const PAUSE_BEFORE_NEXT = 400;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typewriterLoop() {
  const roleBox = document.querySelector('.role-box');
  if (!roleBox || isRunning) return;
  isRunning = true;

  while (true) {
    const text = roleTexts[textIndex];

    for (let i = 0; i <= text.length; i++) {
      roleBox.textContent = text.slice(0, i);
      await sleep(TYPING_SPEED);
    }

    await sleep(PAUSE_AFTER_TYPE);

    for (let i = text.length; i >= 0; i--) {
      roleBox.textContent = text.slice(0, i);
      await sleep(DELETE_SPEED);
    }

    await sleep(PAUSE_BEFORE_NEXT);
    textIndex = (textIndex + 1) % roleTexts.length;
  }
}

function initNetworkBackground() {
  const canvas = document.getElementById('home-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 1920;
  canvas.height = 1080;

  const NODE_COUNT = 38;
  const MAX_DIST = 230;
  const nodes = Array.from({ length: NODE_COUNT }, () => ({
    x: Math.random() * 1920,
    y: Math.random() * 1080,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 2 + 1.5
  }));

  function frame() {
    ctx.clearRect(0, 0, 1920, 1080);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(80, 150, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 160, 255, 0.4)';
      ctx.fill();
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > 1920) n.vx *= -1;
      if (n.y < 0 || n.y > 1080) n.vy *= -1;
    });

    requestAnimationFrame(frame);
  }

  frame();
}

document.addEventListener('DOMContentLoaded', () => {
  initNetworkBackground();
  typewriterLoop();
});
