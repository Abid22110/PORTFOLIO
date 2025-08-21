// ========= Config: Certificates =========
// Add your certificates here. Just push an object with title and src.
// Make sure the image exists in assets/images/.
const CERTS = [
  { title: 'Pitman Training — CPD (Computer Basics)', src: 'assets/images/certificate.jpeg' },
  { title: 'Basic Computer Course', src: 'assets/images/cert-basic-computer.jpeg' },   // add this image
  { title: 'Google Course', src: 'assets/images/cert-google-course.jpeg' }             // add this image
];

// ========= AOS =========
AOS.init({ duration: 650, once: true, offset: 80 });

// ========= Theme (Hacker / Light) =========
(function themeInit() {
  const select = document.getElementById('theme-select');
  const saved = localStorage.getItem('theme') || 'hacker';
  document.documentElement.setAttribute('data-theme', saved);
  if (select) select.value = saved;

  function apply(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
    // Toggle matrix effect visibility
    if (mode === 'hacker') MatrixRain.start(); else MatrixRain.stop();
  }

  select?.addEventListener('change', () => apply(select.value));
  apply(saved);
})();

// ========= Mobile nav + anchors =========
(function navToggle() {
  const btn = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  document.addEventListener('click', (e) => {
    if (!links.contains(e.target) && !btn.contains(e.target)) links.classList.remove('open');
  });
})();

// ========= Back to top =========
document.getElementById('scroll-top')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========= Typing effect =========
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

// ========= Skills progress rings =========
(function skillsProgress() {
  const items = document.querySelectorAll('.skill-progress');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const wrap = e.target;
      const percent = parseInt(wrap.getAttribute('data-percent') || '0', 10);
      const circle = wrap.querySelector('.progress-circle-fill');
      const max = 2 * Math.PI * 50; // r=50
      circle.style.strokeDashoffset = String(max - (percent / 100) * max);
      io.unobserve(wrap);
    });
  }, { threshold: 0.35 });
  items.forEach(i => io.observe(i));
})();

// ========= Certificates grid + modal =========
(function certificates() {
  const grid = document.getElementById('cert-grid');
  if (!grid) return;

  // Render cards
  const frag = document.createDocumentFragment();
  CERTS.forEach((c, idx) => {
    const card = document.createElement('article');
    card.className = 'cert-card';
    card.setAttribute('data-index', String(idx));
    card.innerHTML = `
      <img class="cert-thumb" src="${c.src}" alt="${c.title} thumbnail" loading="lazy" decoding="async">
      <div class="cert-body">
        <p class="cert-title">${c.title}</p>
        <span class="cert-view">View</span>
      </div>
    `;
    frag.appendChild(card);
  });
  grid.appendChild(frag);

  // Modal behavior
  const modal = document.getElementById('cert-modal');
  const title = document.getElementById('cert-title');
  const image = document.getElementById('cert-image');
  const closeBtn = modal?.querySelector('.cert-modal__close');

  function open(idx) {
    const c = CERTS[idx];
    if (!c || !modal) return;
    title.textContent = c.title;
    image.src = c.src;
    image.alt = c.title;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    image.src = '';
  }

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.cert-card');
    if (!card) return;
    const idx = parseInt(card.getAttribute('data-index'), 10);
    open(idx);
  });
  closeBtn?.addEventListener('click', close);
  modal?.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// ========= Contact -> Gmail compose (only message required) =========
(function contactMail() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const TO = 'abidhussain15658@gmail.com';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = (document.getElementById('message')?.value || '').trim();
    const subject = encodeURIComponent('Portfolio Inquiry');
    const body = encodeURIComponent(message);

    // Prefer Gmail compose (web/app), fallback to mailto
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TO)}&su=${subject}&body=${body}`;
    const opened = window.open(gmailUrl, '_blank', 'noopener');
    if (!opened) {
      window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
    }
    form.reset();
  });
})();

// ========= External links security =========
(function externalLinksSafe() {
  document.querySelectorAll('a[target="_blank"]').forEach(a => a.setAttribute('rel', 'noopener noreferrer'));
})();

// ========= Matrix Rain (Hacker theme only) =========
const MatrixRain = (function () {
  const canvas = document.getElementById('matrix');
  if (!canvas) return { start(){}, stop(){} };
  const ctx = canvas.getContext('2d');
  let raf = null, running = false;

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
    raf = requestAnimationFrame(loop);
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

  function start() {
    if (running) return;
    running = true;
    canvas.style.display = 'block';
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    canvas.style.display = 'none';
  }

  return { start, stop };
})();
