var images = ['IMG_9425.jpg']; // use any image
var currentIndex = 0;
var totalClicks = 0;

function randomizeImage() {
  let root = document.documentElement;
  root.style.setProperty('--image', 'url(' + images[currentIndex] + ')');
  currentIndex = (currentIndex + 1) % images.length;
  document.querySelectorAll('#puzz i').forEach(item => {
    item.style.left = Math.random() * (window.innerWidth - 100) + 'px';
    item.style.top = Math.random() * (window.innerHeight - 100) + 'px';
  });
}

randomizeImage();

function reloadPuzzle() {
  document.querySelectorAll('.done, .dropped').forEach(el => {
    el.classList.remove('done', 'dropped');
  });
  let puz = document.querySelector('#puz');
  puz.classList.remove('allDone');
  puz.style.border = '3px dashed lightgray';
}

document.querySelectorAll('#puzz i').forEach(item => {
  item.addEventListener('mousedown', () => {
    totalClicks++;
    document.querySelector('#clicks').innerHTML = totalClicks;
  });
  item.addEventListener('click', () => {
    document.querySelector('.clicked')?.classList.remove('clicked');
    item.classList.toggle('clicked');
  });
});

document.querySelectorAll('#puz i').forEach(slot => {
  slot.addEventListener('click', () => {
    let clicked = document.querySelector('.clicked');
    if (clicked && clicked.classList.contains(slot.classList[0])) {
      slot.classList.add('dropped');
      clicked.classList.add('done');
      clicked.classList.remove('clicked');

      if (document.querySelectorAll('.dropped').length === 9) {
        document.querySelector('#puz').classList.add('allDone');
        setTimeout(() => {
          showLoveMessage();
        }, 1000);
      }
    }
  });
});

function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) { ev.dataTransfer.setData("text", ev.target.className); }

function drop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  if (ev.target.className === data) {
    ev.target.classList.add('dropped');
    document.querySelector(`.${data}[draggable='true']`).classList.add('done');

    if (document.querySelectorAll('.dropped').length === 9) {
      document.querySelector('#puz').classList.add('allDone');
      setTimeout(() => {
        showLoveMessage();
      }, 1000);
    }
  }
}

// ❤️ Show final romantic message
function showLoveMessage() {
  document.getElementById("loveMessage").style.display = "flex";
  document.getElementById("loveAudio").play();
  startConfetti();
  createFloatingHearts();
}

// 🎉 Confetti animation
function startConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const pieces = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 6 + 4,
    c: `hsl(${Math.random() * 360},100%,70%)`,
    s: Math.random() * 3 + 2
  }));
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y += p.s;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fillStyle = p.c;
      ctx.fill();
    });
    requestAnimationFrame(update);
  }
  update();
}

// 💗 Floating heart particles
function createFloatingHearts() {
  for (let i = 0; i < 50; i++) {
    const heart = document.createElement("div");
    heart.innerText = "💗";
    heart.style.position = "fixed";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.bottom = "-50px";
    heart.style.fontSize = Math.random() * 20 + 20 + "px";
    heart.style.animation = `floatHeart ${Math.random() * 3 + 3}s linear infinite`;
    heart.style.zIndex = "10001";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 8000);
  }

  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes floatHeart {
    0% { transform: translateY(0) rotate(0); opacity: 1; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }`;
  document.head.appendChild(style);
}
