// Subtle electric spark field for the hero — lightweight canvas, respects reduced-motion.
(function () {
  const canvas = document.getElementById('sparks');
  if (!canvas) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let w, h, dpr, particles = [], raf = null, arcs = [];

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.parentElement.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    const count = Math.max(24, Math.min(56, Math.floor(w / 26)));
    particles = Array.from({ length: count }, (_, i) => ({
      x: (i * 137.5) % w,
      y: (i * 89.3) % h,
      r: 0.6 + ((i * 7) % 10) / 8,
      vy: 0.12 + ((i * 13) % 10) / 40,
      vx: (((i % 5) - 2) / 40),
      a: 0.15 + ((i * 3) % 10) / 22,
      tw: ((i * 17) % 100) / 100
    }));
  }

  // occasional faint electric arc between two nearby points
  let tick = 0;
  function maybeArc() {
    if (particles.length < 2) return;
    const a = particles[(tick * 7) % particles.length];
    const b = particles[(tick * 13 + 3) % particles.length];
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (d < 150 && d > 20) {
      arcs.push({ a, b, life: 1 });
    }
  }

  function drawArc(seg) {
    const { a, b } = seg;
    const steps = 6;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const jitter = (Math.sin((tick + i * 30) * 0.5) * 8) * (1 - Math.abs(t - 0.5) * 2);
      ctx.lineTo(a.x + (b.x - a.x) * t + jitter, a.y + (b.y - a.y) * t - jitter);
    }
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(150,200,255,${0.25 * seg.life})`;
    ctx.lineWidth = 1;
    ctx.shadowColor = 'rgba(120,180,255,0.8)';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    tick++;
    if (tick % 42 === 0) maybeArc();

    for (const p of particles) {
      p.y -= p.vy; p.x += p.vx;
      if (p.y < -4) { p.y = h + 4; p.x = (p.x + 60) % w; }
      if (p.x < -4) p.x = w + 4; if (p.x > w + 4) p.x = -4;
      const tw = 0.6 + 0.4 * Math.sin((tick * 0.03) + p.tw * 6.28);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = `rgba(140,190,255,${p.a * tw})`;
      ctx.shadowColor = 'rgba(90,160,255,0.7)';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    arcs = arcs.filter(s => (s.life -= 0.08) > 0);
    arcs.forEach(drawArc);

    raf = requestAnimationFrame(frame);
  }

  function start() { size(); seed(); if (!raf) frame(); }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }

  start();
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { stop(); start(); }, 200); });
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
})();
