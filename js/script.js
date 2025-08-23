// ============ AOS ============
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) AOS.init({ duration: 650, once: true, offset: 80 });
});

// ============ Mobile nav + overlay ============
(function navToggle() {
  const btn = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');
  if (!btn || !links || !overlay) return;

  const close = () => { links.classList.remove('open'); overlay.classList.remove('show'); };
  const open = () => { links.classList.add('open'); overlay.classList.add('show'); };

  btn.addEventListener('click', () => links.classList.contains('open') ? close() : open());
  overlay.addEventListener('click', close);
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

// ============ Back to top ============
document.getElementById('scroll-top')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============ Typing effect ============
(function typingEffect() {
  const el = document.getElementById('typing-text');
  const cursor = document.querySelector('.cursor');
  if (!el) return;
  const lines = ['Cybersecurity Expert', 'Ethical Hacker', 'Blue Team | Red Team', 'Security Automation'];
  let i = 0, pos = 0, dir = 1;
  function tick() {
    const t = lines[i];
    pos += dir;
    el.textContent = t.slice(0, Math.max(0, Math.min(pos, t.length)));
    if (pos >= t.length + 10) dir = -1;
    if (pos <= 0) { dir = 1; i = (i + 1) % lines.length; }
    setTimeout(tick, dir > 0 ? 80 : 40);
  }
  tick();
  if (cursor) setInterval(() => cursor.classList.toggle('hidden'), 500);
})();

// ============ Skills: smooth radial fill + percent count-up ============
(function skillsProgress() {
  const items = document.querySelectorAll('.skill-progress');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;

      const wrap = e.target;
      const percentTarget = parseInt(wrap.getAttribute('data-percent') || '0', 10);

      const circle = wrap.querySelector('.progress-circle-fill');
      const text = wrap.querySelector('.skill-percent');
      if (!circle || !text) { io.unobserve(wrap); return; }

      const r = parseFloat(circle.getAttribute('r') || '55');
      const circumference = 2 * Math.PI * r;

      circle.style.strokeDasharray = String(circumference);
      circle.style.strokeDashoffset = String(circumference);

      requestAnimationFrame(() => {
        const targetOffset = circumference - (percentTarget / 100) * circumference;
        circle.style.strokeDashoffset = String(targetOffset);
      });

      const duration = 1200;
      let start = null;

      function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const current = Math.round(eased * percentTarget);
        text.textContent = `${current}%`;
        if (p < 1) requestAnimationFrame(step);
        else wrap.classList.add('filled');
      }
      requestAnimationFrame(step);

      io.unobserve(wrap);
    });
  }, { threshold: 0.35 });

  items.forEach(i => io.observe(i));
})();

// ============ Contact -> Gmail compose (Name + Email + Message) ============
(function contactMail() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const TO = 'abidhussain15658@gmail.com';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();

    const subject = encodeURIComponent(`Portfolio Message from ${name || 'Visitor'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    // Prefer Gmail web compose; fallback to mailto
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TO)}&su=${subject}&body=${body}`;
    const opened = window.open(gmailUrl, '_blank', 'noopener');
    if (!opened) window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
    form.reset();
  });
})();

// ============ External links security ============
(function externalLinksSafe() {
  document.querySelectorAll('a[target="_blank"]').forEach(a => a.setAttribute('rel', 'noopener noreferrer'));
})();

// ============ Matrix Rain (optimized) ============
const MatrixRain = (function () {
  const canvas = document.getElementById('matrix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, cols, drops;
  let fps = 42, now, then = performance.now(), interval = 1000 / fps, delta;
  const fontSize = 16;
  const chars = '01$#@*&%{}[]<>/\\|+=-_.';

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.floor(window.innerWidth / fontSize);
    drops = Array(cols).fill(0);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  function loop(timestamp) {
    requestAnimationFrame(loop);
    now = timestamp;
    delta = now - then;
    if (delta < interval) return;
    then = now - (delta % interval);

    ctx.fillStyle = 'rgba(10,15,13,0.14)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff88';
    ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

    for (let i = 0; i < cols; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillText(text, x, y);

      if (y > window.innerHeight && Math.random() > 0.975) drops[i] = 0;
      else drops[i]++;
    }
  }
  requestAnimationFrame(loop);
})();
