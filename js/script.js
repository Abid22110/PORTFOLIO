// ============ AOS ============
AOS.init({ duration: 650, once: true, offset: 80 });

// ============ MODE (Hacker / Clean) ============
(function modeInit() {
  const select = document.getElementById('mode-select');
  const saved = localStorage.getItem('mode') || 'hacker';
  document.documentElement.setAttribute('data-mode', saved);
  if (select) select.value = saved;

  select?.addEventListener('change', () => {
    const val = select.value;
    document.documentElement.setAttribute('data-mode', val);
    localStorage.setItem('mode', val);
    // Start/stop matrix depending on mode
    window.MatrixRain && window.MatrixRain.toggle(val === 'hacker');
  });
})();

// ============ Mobile nav toggle + fix anchors ============
(function navToggle() {
  const btn = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => links.classList.toggle('open'));

  // Close menu on nav link click + smooth anchor handling
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!links.contains(e.target) && !btn.contains(e.target)) links.classList.remove('open');
  });
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
    el.textContent = text.slice(0, Math.max(0, Math.min(pos, text.length)));

    // hold after full
    if (pos >= text.length + 10) dir = -1;
    if (pos <= 0) { dir = 1; idx = (idx + 1) % lines.length; }

    setTimeout(tick, dir > 0 ? 80 : 40);
  }
  tick();

  if (cursor) setInterval(() => cursor.classList.toggle('hidden'), 500);
})();

// ============ Skill ring animation on view ============
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

// ============ Matrix rain (hacker mode only) ============
(function matrixRain() {
  const canvas = document.getElementById('matrix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let raf = null;

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
    if (delta < interval) return; // throttle
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
    if (!raf) raf = requestAnimationFrame(loop);
    canvas.style.display = 'block';
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    canvas.style.display = 'none';
  }

  // API
  window.MatrixRain = {
    toggle: (on) => on ? start() : stop()
  };

  // Start if mode is hacker
  const mode = document.documentElement.getAttribute('data-mode');
  if (mode === 'hacker') start();
})();

// ============ Contact: send to Gmail (mailto) or Formspree ============
(function contactHandler() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Config
  const CONTACT_MODE = 'mailto'; // 'mailto' | 'formspree'
  const TO = 'abidhussain15658@gmail.com';
  const FORMSPREE_ENDPOINT = ''; // e.g., "https://formspree.io/f/xxxxx"

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();

    if (CONTACT_MODE === 'formspree' && FORMSPREE_ENDPOINT) {
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        if (res.ok) {
          alert('Message sent successfully!');
          form.reset();
        } else {
          throw new Error('Failed to send');
        }
      } catch (err) {
        alert('Failed to send via form service. Falling back to email.');
        openMailto();
      }
      return;
    }

    // Default: open mail app with pre-filled details
    openMailto();

    function openMailto() {
      const subject = encodeURIComponent(`Portfolio Message from ${name || 'Visitor'}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
      form.reset();
    }
  });
})();

// ============ External links security ============
(function externalLinksSafe() {
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    a.setAttribute('rel', 'noopener noreferrer');
  });
})();
