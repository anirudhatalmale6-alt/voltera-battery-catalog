// TitanCell hero energy field — branded cyan branching lightning that
// radiates from behind the product image (matching the packaging artwork),
// now BIGGER: dense forked bolts, an ambient bloom flash on every strike,
// storm bursts, and a soft drifting spark field. Respects reduced-motion.
(function () {
  const canvas = document.getElementById('sparks');
  if (!canvas) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let w, h, dpr, particles = [], flashes = [], blooms = [], raf = null, origin = { x: 0, y: 0 };

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
    const count = Math.max(30, Math.min(70, Math.floor(w / 22)));
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
    (function recurse(ax, ay, bx, by, disp, depth) {
      if (disp < detail) { segs.push([ax, ay, bx, by]); return; }
      let mx = (ax + bx) / 2, my = (ay + by) / 2;
      const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const off = (Math.random() - 0.5) * disp;
      mx += nx * off; my += ny * off;
      recurse(ax, ay, mx, my, disp / 2, depth + 1);
      recurse(mx, my, bx, by, disp / 2, depth + 1);
      // forks — more frequent + can themselves branch, for dense plasma
      if (depth < 4 && Math.random() < 0.62) {
        const ang = Math.atan2(my - ay, mx - ax) + (Math.random() - 0.5) * 1.5;
        const blen = Math.hypot(bx - mx, by - my) * (0.6 + Math.random() * 0.6);
        recurse(mx, my, mx + Math.cos(ang) * blen, my + Math.sin(ang) * blen, disp / 1.7, depth + 1);
      }
    })(x1, y1, x2, y2, displace, 0);
    return segs;
  }

  function spawnFlash() {
    const n = 7 + Math.floor(Math.random() * 5); // 7-11 bolts radiating out
    const segs = [];
    for (let i = 0; i < n; i++) {
      // spread bolts around the full circle so branches sprawl across the
      // whole hero, well past the product card (bigger, storm-like reach)
      const ang = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      const reach = Math.min(w, h) * (0.7 + Math.random() * 0.6);
      const tx = origin.x + Math.cos(ang) * reach;
      const ty = origin.y + Math.sin(ang) * reach;
      segs.push(...boltSegments(origin.x, origin.y, tx, ty, reach * 0.34, 4));
    }
    flashes.push({ segs, life: 1 });
    // ambient bloom pulse — a big soft cyan flare that lights up the hero
    blooms.push({ life: 1, max: Math.min(w, h) * 1.35 });
  }

  function drawBloom(b) {
    const rad = b.max * (1.05 - b.life * 0.15);
    const g = ctx.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, rad);
    const a = b.life * 0.5;
    g.addColorStop(0, `rgba(120,225,255,${a * 0.7})`);
    g.addColorStop(0.25, `rgba(46,200,255,${a * 0.35})`);
    g.addColorStop(1, 'rgba(46,200,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function drawFlash(f) {
    // flicker: intensity jitters as the bolt fades, for a crackle feel
    const inten = f.life * (0.6 + 0.4 * Math.random());
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // wide outer cyan halo
    ctx.strokeStyle = `rgba(46,200,255,${0.22 * inten})`;
    ctx.lineWidth = 5;
    ctx.shadowColor = 'rgba(46,200,255,1)';
    ctx.shadowBlur = 24;
    strokeSegs(f.segs);
    // mid cyan body
    ctx.strokeStyle = `rgba(120,225,255,${0.55 * inten})`;
    ctx.lineWidth = 2.4;
    ctx.shadowBlur = 14;
    strokeSegs(f.segs);
    // white-hot core
    ctx.strokeStyle = `rgba(232,250,255,${0.95 * inten})`;
    ctx.lineWidth = 1.1;
    ctx.shadowColor = 'rgba(200,245,255,1)';
    ctx.shadowBlur = 7;
    strokeSegs(f.segs);
    ctx.shadowBlur = 0;
  }
  function strokeSegs(segs) {
    ctx.beginPath();
    for (const s of segs) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); }
    ctx.stroke();
  }

  let tick = 0, nextStrike = 30, burst = 0;
  function scheduleNext() {
    // storm bursts: sometimes fire a rapid volley, then a longer calm
    if (burst > 0) { burst--; nextStrike = tick + 8 + Math.floor(Math.random() * 12); return; }
    if (Math.random() < 0.35) { burst = 1 + Math.floor(Math.random() * 2); } // 2-3 shot volley
    nextStrike = tick + 45 + Math.floor(Math.random() * 70); // ~0.75-1.9s calm
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    tick++;

    // ambient bloom (drawn under the bolts)
    blooms = blooms.filter(b => (b.life -= 0.06) > 0);
    blooms.forEach(drawBloom);

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
    if (tick >= nextStrike) { spawnFlash(); scheduleNext(); }
    flashes = flashes.filter(f => (f.life -= 0.03) > 0); // ~0.55s fade with crackle
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
