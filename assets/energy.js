// TitanCell hero energy field — branded cyan branching lightning that
// radiates from behind the product image (matching the packaging artwork),
// plus a soft drifting spark field. Lightweight canvas, respects reduced-motion.
(function () {
  const canvas = document.getElementById('sparks');
  if (!canvas) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let w, h, dpr, particles = [], flashes = [], raf = null, origin = { x: 0, y: 0 };

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.parentElement.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // origin = centre of the product visual, so bolts radiate from behind it
    const vis = canvas.parentElement.querySelector('.hero-visual');
    if (vis) {
      const vr = vis.getBoundingClientRect();
      origin = { x: vr.left - r.left + vr.width / 2, y: vr.top - r.top + vr.height / 2 };
    } else {
      origin = { x: w * 0.72, y: h * 0.5 };
    }
  }

  // --- drifting spark field (constant subtle ambience) ---
  function seed() {
    const count = Math.max(22, Math.min(52, Math.floor(w / 28)));
    particles = Array.from({ length: count }, (_, i) => ({
      x: (i * 137.5) % w,
      y: (i * 89.3) % h,
      r: 0.6 + ((i * 7) % 10) / 8,
      vy: 0.12 + ((i * 13) % 10) / 40,
      vx: (((i % 5) - 2) / 40),
      a: 0.14 + ((i * 3) % 10) / 24,
      tw: ((i * 17) % 100) / 100
    }));
  }

  // --- branching lightning (matches the packaging's forked plasma) ---
  // midpoint-displacement fractal bolt with recursive branches
  function boltSegments(x1, y1, x2, y2, displace, detail) {
    const segs = [];
    (function recurse(ax, ay, bx, by, disp) {
      if (disp < detail) { segs.push([ax, ay, bx, by]); return; }
      let mx = (ax + bx) / 2, my = (ay + by) / 2;
      const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const off = (Math.random() - 0.5) * disp;
      mx += nx * off; my += ny * off;
      recurse(ax, ay, mx, my, disp / 2);
      recurse(mx, my, bx, by, disp / 2);
      // occasional fork off the midpoint
      if (Math.random() < 0.4) {
        const ang = Math.atan2(my - ay, mx - ax) + (Math.random() - 0.5) * 1.3;
        const blen = Math.hypot(bx - mx, by - my) * (0.55 + Math.random() * 0.4);
        recurse(mx, my, mx + Math.cos(ang) * blen, my + Math.sin(ang) * blen, disp / 2);
      }
    })(x1, y1, x2, y2, displace);
    return segs;
  }

  function spawnFlash() {
    const n = 4 + Math.floor(Math.random() * 4); // 4-7 bolts radiating out
    const segs = [];
    for (let i = 0; i < n; i++) {
      // spread bolts around the full circle so branches clearly exit the
      // product card into the dark hero space (like the packaging artwork)
      const ang = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.7;
      const reach = Math.min(w, h) * (0.5 + Math.random() * 0.4);
      const tx = origin.x + Math.cos(ang) * reach;
      const ty = origin.y + Math.sin(ang) * reach;
      segs.push(...boltSegments(origin.x, origin.y, tx, ty, reach * 0.3, 5));
    }
    flashes.push({ segs, life: 1 });
  }

  function drawFlash(f) {
    // flicker: intensity jitters as the bolt fades, for a crackle feel
    const inten = f.life * (0.55 + 0.45 * Math.random());
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // outer cyan glow pass
    ctx.strokeStyle = `rgba(46,200,255,${0.35 * inten})`;
    ctx.lineWidth = 2.4;
    ctx.shadowColor = 'rgba(46,200,255,0.9)';
    ctx.shadowBlur = 14;
    strokeSegs(f.segs);
    // bright near-white core
    ctx.strokeStyle = `rgba(210,245,255,${0.9 * inten})`;
    ctx.lineWidth = 1;
    ctx.shadowBlur = 6;
    strokeSegs(f.segs);
    ctx.shadowBlur = 0;
  }
  function strokeSegs(segs) {
    ctx.beginPath();
    for (const s of segs) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); }
    ctx.stroke();
  }

  let tick = 0, nextStrike = 45;
  function frame() {
    ctx.clearRect(0, 0, w, h);
    tick++;

    // drifting sparks
    for (const p of particles) {
      p.y -= p.vy; p.x += p.vx;
      if (p.y < -4) { p.y = h + 4; p.x = (p.x + 60) % w; }
      if (p.x < -4) p.x = w + 4; if (p.x > w + 4) p.x = -4;
      const tw = 0.6 + 0.4 * Math.sin((tick * 0.03) + p.tw * 6.28);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = `rgba(120,220,255,${p.a * tw})`;
      ctx.shadowColor = 'rgba(46,200,255,0.7)';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // periodic lightning strikes radiating from the product
    if (tick >= nextStrike) {
      spawnFlash();
      nextStrike = tick + 105 + Math.floor(Math.random() * 130); // ~1.7-3.9s @60fps
    }
    flashes = flashes.filter(f => (f.life -= 0.035) > 0); // ~0.5s fade with crackle
    flashes.forEach(drawFlash);

    raf = requestAnimationFrame(frame);
  }

  function start() { size(); seed(); if (!raf) frame(); }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }

  start();
  window.__titanStrike = spawnFlash; // manual trigger (used for QA screenshots)
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { stop(); start(); }, 200); });
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
})();
