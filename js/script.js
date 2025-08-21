// AOS animations
AOS.init({
  duration: 700,
  once: true,
  offset: 80
});

// Theme toggle: dark/neon by default
(function themeInit() {
  const checkbox = document.getElementById('theme-checkbox');
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  checkbox && (checkbox.checked = saved !== 'dark');

  checkbox && checkbox.addEventListener('change', () => {
    const next = checkbox.checked ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

// Mobile nav toggle
(function navToggle() {
  const btn = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => links.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!links.contains(e.target) && !btn.contains(e.target)) links.classList.remove('open');
  });
})();

// Smooth scroll to top
document.getElementById('scroll-top')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Typing effect for tagline
(function typingEffect() {
  const el = document.getElementById('typing-text');
  const cursor = document.querySelector('.cursor');
  if (!el) return;

  const lines = [
    'Cybersecurity Expert',
    'Ethical Hacker',
    'Blue Team | Red Team',
    'Security Automation',
  ];
  let idx = 0, pos = 0, dir = 1;

  function tick() {
    const text = lines[idx];
    pos += dir;
    el.textContent = text.slice(0, pos);

    if (pos === text.length + 12) dir = -1;            // hold
    if (pos === 0) { dir = 1; idx = (idx + 1) % lines.length; }

    setTimeout(tick, dir > 0 ? 80 : 40);
  }
  tick();

  // Blink cursor always
  if (cursor) setInterval(() => cursor.classList.toggle('hidden'), 500);
})();

// Animate radial skill circles when visible
(function skillsProgress() {
  const items = document.querySelectorAll('.skill-progress');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const wrap = e.target;
      const percent = parseInt(wrap.getAttribute('data-percent') || '0', 10);
      const circle = wrap.querySelector('.progress-circle-fill');
      const max = 2 * Math.PI * 50; // r = 50
      circle.style.strokeDashoffset = String(max - (percent / 100) * max);
      io.unobserve(wrap);
    });
  }, { threshold: 0.35 });

  items.forEach(i => io.observe(i));
})();

// Matrix rain background
(function matrixRain() {
  const canvas = document.getElementById('matrix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, cols, drops;
  const fontSize = 16;
  const chars = '01$#@*&%{}[]<>/\\|+=-_.';

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cols = Math.floor(w / fontSize);
    drops = Array(cols).fill(0);
  }
  window.addEventListener('resize', resize);
  resize();

  function draw() {
    // Fade the canvas
    ctx.fillStyle = 'rgba(10,15,13,0.14)';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#00ff88';
    ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

    for (let i = 0; i < cols; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillText(text, x, y);

      // Reset
      if (y > h && Math.random() > 0.975) drops[i] = 0;
      else drops[i]++;
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ===========================
   SEND MESSAGE -> GMAIL (mailto)
   =========================== */
(function contactMailto() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Yahan apna Gmail likhen (agar change karna ho)
  const TO = 'abidhussain15658@gmail.com';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();

    const subject = encodeURIComponent(`Portfolio Message from ${name || 'Visitor'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    // Gmail/mail client compose khulega
    window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;

    // Optional: form clear
    form.reset();
  });
})();
