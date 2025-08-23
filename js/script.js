// ========== AOS ==========
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) AOS.init({ duration: 650, once: true, offset: 80 });
});

// ========== Mobile Drawer ==========
(function drawerNav(){
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');
  const overlay= document.querySelector('.nav-overlay');
  const closeBtn= document.querySelector('.drawer-close');
  if(!toggle || !drawer || !overlay) return;

  function open(){
    drawer.classList.add('open');
    overlay.classList.add('show');
    drawer.setAttribute('aria-hidden','false');
    drawer.querySelectorAll('.drawer-links a').forEach((a,i)=>a.style.setProperty('--delay', i+1));
  }
  function close(){
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    drawer.setAttribute('aria-hidden','true');
  }
  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click', close));
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });
})();

// ========== Back to top ==========
document.getElementById('scroll-top')?.addEventListener('click', e=>{
  e.preventDefault();
  window.scrollTo({ top:0, behavior:'smooth' });
});

// ========== Typing Effect ==========
(function typing(){
  const el = document.getElementById('typing-text');
  const cursor = document.querySelector('.cursor');
  if(!el) return;
  const lines=['Cybersecurity Expert','Ethical Hacker','Blue Team | Red Team','Security Automation'];
  let i=0,pos=0,dir=1;
  function step(){
    const t = lines[i];
    pos += dir;
    el.textContent = t.slice(0, Math.max(0, Math.min(pos, t.length)));
    if(pos >= t.length + 10) dir = -1;
    if(pos <= 0){ dir = 1; i = (i+1)%lines.length; }
    setTimeout(step, dir>0 ? 80 : 40);
  }
  step();
  if(cursor) setInterval(()=>cursor.classList.toggle('hidden'),500);
})();

// ========== Skills Progress ==========
(function skillsProgress(){
  const items = document.querySelectorAll('.skill-progress');
  if(!items.length) return;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const wrap = e.target;
      const pct = parseInt(wrap.getAttribute('data-percent')||'0',10);
      const circle = wrap.querySelector('.progress-circle-fill');
      const text = wrap.querySelector('.skill-percent');
      if(!circle || !text){ io.unobserve(wrap); return; }
      const r = parseFloat(circle.getAttribute('r')||'55');
      const C = 2*Math.PI*r;
      circle.style.strokeDasharray = C;
      circle.style.strokeDashoffset = C;
      requestAnimationFrame(()=>{
        const target = C - (pct/100)*C;
        circle.style.strokeDashoffset = target;
      });
      let start=null; const dur=1200;
      function animate(ts){
        if(!start) start=ts;
        const p = Math.min((ts-start)/dur,1);
        const eased = 1 - Math.pow(1-p,3);
        text.textContent = `${Math.round(eased*pct)}%`;
        if(p<1) requestAnimationFrame(animate);
        else wrap.classList.add('filled');
      }
      requestAnimationFrame(animate);
      io.unobserve(wrap);
    });
  },{threshold:.35});
  items.forEach(i=>io.observe(i));
})();

// ========== Contact Form -> Gmail compose ==========
(function contact(){
  const form = document.getElementById('contact-form');
  if(!form) return;

  const TO = 'abidhussain15658@gmail.com';
  const gmailBtn = document.getElementById('open-gmail');
  const mailtoBtn= document.getElementById('open-mailto');

  function build(subjectName, email, message){
    const subject = encodeURIComponent(`Portfolio Message from ${subjectName||'Visitor'}`);
    const bodyTxt = `Name: ${subjectName || '(not provided)'}\nEmail: ${email || '(not provided)'}\n\nMessage:\n${message || '(No message)'}`;
    const body = encodeURIComponent(bodyTxt);
    return {subject, body};
  }

  function openGmail(subject, body){
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TO)}&su=${subject}&body=${body}`;
    const w = window.open(url,'_blank','noopener');
    if(!w){ // fallback
      window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
    }
  }

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const userEmail = document.getElementById('email').value.trim();
    const msg = document.getElementById('message').value.trim();
    const {subject, body} = build(name, userEmail, msg);
    openGmail(subject, body);
    form.reset();
  });

  gmailBtn?.addEventListener('click', ()=>{
    const name = document.getElementById('name').value.trim();
    const userEmail = document.getElementById('email').value.trim();
    const msg = document.getElementById('message').value.trim();
    const {subject, body} = build(name, userEmail, msg);
    openGmail(subject, body);
  });

  mailtoBtn?.addEventListener('click', ()=>{
    const name = document.getElementById('name').value.trim();
    const userEmail = document.getElementById('email').value.trim();
    const msg = document.getElementById('message').value.trim();
    const {subject, body} = build(name, userEmail, msg);
    window.location.href = `mailto:${encodeURIComponent(TO)}?subject=${subject}&body=${body}`;
  });
})();

// ========== Scrollspy (Desktop + Drawer) ==========
(function scrollSpy(){
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = Array.from(document.querySelectorAll('.site-nav-desktop a, .drawer-links a'));
  if(!sections.length || !navLinks.length) return;

  const map = {};
  navLinks.forEach(a=>{
    const hash = a.getAttribute('href');
    if(hash && hash.startsWith('#')) map[hash.slice(1)] = navLinks.filter(l=>l.getAttribute('href')===hash);
  });

  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = entry.target.id;
        Object.values(map).flat().forEach(l=>l.classList.remove('active'));
        (map[id]||[]).forEach(l=>l.classList.add('active'));
      }
    });
  },{threshold:.45});

  sections.forEach(sec=>io.observe(sec));
})();

// ========== External Links rel security ==========
(function secureLinks(){
  document.querySelectorAll('a[target="_blank"]').forEach(a=>a.setAttribute('rel','noopener noreferrer'));
})();

// ========== Matrix Rain ==========
(function matrix(){
  const canvas = document.getElementById('matrix');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h,cols,drops;
  const fontSize = 16;
  const chars = '01$#@*&%{}[]<>/\\|+=-_.';
  let fps=42, then=performance.now(), interval=1000/fps;

  function resize(){
    const dpr = Math.min(window.devicePixelRatio||1,1.5);
    w = canvas.width = Math.floor(window.innerWidth*dpr);
    h = canvas.height= Math.floor(window.innerHeight*dpr);
    canvas.style.width = window.innerWidth+'px';
    canvas.style.height= window.innerHeight+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    cols = Math.floor(window.innerWidth / fontSize);
    drops = Array(cols).fill(0);
  }
  window.addEventListener('resize', resize,{passive:true});
  resize();

  function loop(ts){
    requestAnimationFrame(loop);
    const delta = ts - then;
    if(delta < interval) return;
    then = ts - (delta % interval);

    ctx.fillStyle = 'rgba(10,15,13,0.14)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#00ff88';
    ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

    for(let i=0;i<cols;i++){
      const ch = chars[Math.floor(Math.random()*chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(ch,x,y);
      if(y > window.innerHeight && Math.random() > 0.975) drops[i]=0;
      else drops[i]++;
    }
  }
  requestAnimationFrame(loop);
})();
