/* ===================================================
   main.js — Bootstrap & Integrasi UI Efek Utama
   =================================================== */

function showLevelUpModal(levelNum, scoreEarned, accuracyVal, badgeName) {
  SoundManager.play("win");
  document.getElementById("modal-title").innerText =
    `MISI LEVEL ${levelNum} BERHASIL!`;
  document.getElementById("modal-score").innerText = `${scoreEarned}/20`;
  document.getElementById("modal-accuracy").innerText = `${accuracyVal}%`;
  document.getElementById("modal-badge").innerText = badgeName;

  // Show/hide next level button
  const btnNext = document.getElementById("btn-next-level");
  if (levelNum >= 5) {
    btnNext.style.display = "none";
  } else {
    btnNext.style.display = "block";
  }

  document.getElementById("level-up-modal").classList.remove("hidden");
  triggerConfetti();
}

function closeLevelUpModal() {
  document.getElementById("level-up-modal").classList.add("hidden");
  stopConfetti();
}

let confettiInterval = null;
function triggerConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  canvas.classList.remove("hidden");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 5 + 4,
      d: Math.random() * canvas.height,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 5,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, idx) => {
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();

      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.d) * 1.5;
      p.tilt = Math.sin(p.d - idx) * 3;

      if (p.y > canvas.height) {
        particles[idx] = {
          x: Math.random() * canvas.width,
          y: -20,
          r: p.r,
          d: p.d,
          color: p.color,
          tilt: p.tilt,
        };
      }
    });
  }

  confettiInterval = setInterval(draw, 24);
}

function stopConfetti() {
  clearInterval(confettiInterval);
  const canvas = document.getElementById("confetti-canvas");
  if (canvas) canvas.classList.add("hidden");
}

window.onload = function () {
  const canvas = document.getElementById("stars-canvas");
  const ctx = canvas.getContext("2d");
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  // ── Bintang latar diam dengan efek twinkle ──────────────
  const starArray = [];
  for (let i = 0; i < 120; i++) {
    starArray.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.6,
      opacity: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 0.005 + Math.random() * 0.012,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
    });
  }

  // ── Sistem komet / bintang jatuh ────────────────────────
  const comets = [];
  let cometFrame = 0;
  const COMET_INTERVAL = 180; // ~3 detik di 60fps

  function spawnComet() {
    const fromTop = Math.random() > 0.25;
    const angle   = (28 + Math.random() * 28) * (Math.PI / 180); // 28–56 deg diagonal
    const speed   = 7 + Math.random() * 11;

    comets.push({
      x:      fromTop ? Math.random() * w * 0.85 : -20,
      y:      fromTop ? -20 : Math.random() * h * 0.55,
      vx:     Math.cos(angle) * speed,
      vy:     Math.sin(angle) * speed,
      length: 90 + Math.random() * 200,
      size:   0.7 + Math.random() * 1.5,
      opacity: 0.85 + Math.random() * 0.15,
      trail:  [],
    });
  }

  function drawComet(c) {
    if (c.trail.length < 2) return;
    const maxLen = Math.min(c.trail.length, 35);
    const start  = c.trail.length - maxLen;

    for (let i = 1; i < maxLen; i++) {
      const t     = i / maxLen;
      const alpha = t * c.opacity * 0.85;
      const lw    = c.size * t * 1.2;
      const pt0   = c.trail[start + i - 1];
      const pt1   = c.trail[start + i];

      ctx.beginPath();
      ctx.strokeStyle = `rgba(200, 220, 255, ${alpha})`;
      ctx.lineWidth   = lw;
      ctx.lineCap     = "round";
      ctx.moveTo(pt0.x, pt0.y);
      ctx.lineTo(pt1.x, pt1.y);
      ctx.stroke();
    }

    // Kepala komet — glow bercahaya
    const grd = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.size * 5);
    grd.addColorStop(0,    `rgba(255, 255, 255, ${c.opacity})`);
    grd.addColorStop(0.35, `rgba(210, 235, 255, ${c.opacity * 0.65})`);
    grd.addColorStop(0.7,  `rgba(140, 180, 255, ${c.opacity * 0.25})`);
    grd.addColorStop(1,    "rgba(80, 120, 255, 0)");
    ctx.beginPath();
    ctx.fillStyle = grd;
    ctx.arc(c.x, c.y, c.size * 5, 0, Math.PI * 2);
    ctx.fill();

    // Titik inti terang
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${c.opacity})`;
    ctx.arc(c.x, c.y, c.size * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Loop animasi utama ───────────────────────────────────
  function animateBackground() {
    ctx.clearRect(0, 0, w, h);

    // Bintang latar — twinkle halus
    starArray.forEach((star) => {
      star.opacity += star.twinkleSpeed * star.twinkleDir;
      if (star.opacity >= 1)    { star.opacity = 1;    star.twinkleDir = -1; }
      if (star.opacity <= 0.08) { star.opacity = 0.08; star.twinkleDir =  1; }

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Spawn komet setiap COMET_INTERVAL frame
    cometFrame++;
    if (cometFrame >= COMET_INTERVAL) {
      cometFrame = 0;
      // Spawn 1–3 komet, selisih waktu acak agar tidak serentak persis
      const count = 1 + (Math.random() > 0.55 ? 1 : 0) + (Math.random() > 0.8 ? 1 : 0);
      for (let i = 0; i < count; i++) {
        setTimeout(spawnComet, i * (300 + Math.random() * 700));
      }
    }

    // Update & render komet aktif
    for (let i = comets.length - 1; i >= 0; i--) {
      const c = comets[i];
      c.trail.push({ x: c.x, y: c.y });
      c.x += c.vx;
      c.y += c.vy;

      drawComet(c);

      if (c.x > w + 60 || c.y > h + 60) {
        comets.splice(i, 1);
      }
    }

    requestAnimationFrame(animateBackground);
  }

  animateBackground();

  window.onresize = function () {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };

  GameState.load();
  GameState.updateGlobalHeader();
  SoundManager.init(); // Siapkan dan coba jalankan BGM
  Router.go("splash");
};
