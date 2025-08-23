/* ===== Keep your previous JS (typing, skills, matrix, nav, certificates) as-is =====
   Only replacing the contact (old form) logic with simpler buttons below.
*/

/* -------- Existing code from previous script.js ABOVE this line remains unchanged -------- */

/* ============== Simple Contact Buttons (Replace old contact handler) ============== */
(function simpleContact(){
  const gmailBtn  = document.getElementById('gmail-btn');/* =========================================================
   ABID HUSSAIN PORTFOLIO
   CYBER / HACKER THEME - FULL SCRIPT (UPDATED)
   =========================================================
   Modules:
   01. Config / Data
   02. AOS Init
   03. Navigation Drawer
   04. Back To Top
   05. Typing Effect
   06. Certificates Render
   07. Skills Radial Progress
   08. Contact Action Buttons (Gmail / Mail / Copy)
   09. External Links Security
   10. Matrix Rain Background
   ========================================================= */

/* 01. Config / Data ------------------------------------------------ */
const CERTS = [
  { title: 'Pitman Training — CPD (Computer Basics)', src: 'assets/images/certificate.jpeg' },
  { title: 'Basic Computer Course', src: 'assets/images/cert-basic-computer.jpeg' },
  { title: 'Google Course', src: 'assets/images/cert-google-course.jpeg' },
  { title: 'Cisco Networking Course', src: 'assets/images/course.jpg' }
];

/* 02. AOS Init ----------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) {
    AOS.init({ duration:650, once:true, offset:80 });
  }
});

/* 03. Navigation Drawer -------------------------------------------- */
(function navDrawer(){
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');
  const overlay= document.querySelector('.nav-overlay');
  const closeBtn= document.querySelector('.drawer-close');
  if(!toggle || !drawer || !overlay) return;

  function open(){
    drawer.classList.add('open');
    overlay.classList.add('show');
    drawer.setAttribute('aria-hidden','false');
    drawer.querySelectorAll('.drawer-links a').forEach((a,i)=> a.style.setProperty('--delay', i+1));
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

/* 04. Back To Top -------------------------------------------------- */
document.getElementById('scroll-top')?.addEventListener('click', e=>{
  e.preventDefault();
  window.scrollTo({ top:0, behavior:'smooth' });
});

/* 05. Typing Effect ------------------------------------------------ */
(function typing(){
  const el = document.getElementById('typing-text');
  const cursor = document.querySelector('.cursor');
  if(!el) return;
  const lines = [
    'Cybersecurity Expert',
    'Ethical Hacker',
    'Blue Team | Red Team',
    'Security Automation'
  ];
  let idx=0,pos=0,dir=1;

  function step(){
    const t = lines[idx];
    pos += dir;
    el.textContent = t.slice(0, Math.max(0, Math.min(pos, t.length)));
    if(pos >= t.length + 10) dir = -1;
    if(pos <= 0){
      dir = 1;
      idx = (idx+1) % lines.length;
    }
    setTimeout(step, dir>0 ? 80 : 40);
  }
  step();
  if(cursor) setInterval(()=> cursor.classList.toggle('hidden'), 500);
})();

/* 06. Certificates Render ------------------------------------------ */
(function renderCerts(){
  const list = document.getElementById('certList');
  if(!list) return;
  CERTS.forEach((c,i)=>{
    const li = document.createElement('li');
    const delay = i * 90;
    li.innerHTML = `
      <a class="cert-link" href="${c.src}" target="_blank" rel="noopener noreferrer" data-anim
         style="animation-delay:${delay}ms">
        ${c.title}
      </a>`;
    list.appendChild(li);
  });
})();

/* 07. Skills Radial Progress --------------------------------------- */
(function skillsProgress(){
  const items = document.querySelectorAll('.skill-progress');
  if(!items.length) return;

  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const wrap = e.target;
      const percentTarget = parseInt(wrap.getAttribute('data-percent')||'0',10);
      const circle = wrap.querySelector('.progress-circle-fill');
      const text   = wrap.querySelector('.skill-percent');
      if(!circle || !text){ io.unobserve(wrap); return; }

      const r = parseFloat(circle.getAttribute('r')||'55');
      const C = 2*Math.PI*r;
      circle.style.strokeDasharray = C;
      circle.style.strokeDashoffset= C;

      requestAnimationFrame(()=>{
        const target = C - (percentTarget/100)*C;
        circle.style.strokeDashoffset = target;
      });

      let start=null;
      const dur=1200;
      function animate(ts){
        if(!start) start=ts;
        const p = Math.min((ts-start)/dur,1);
        const eased = 1 - Math.pow(1-p,3);
        text.textContent = `${Math.round(eased*percentTarget)}%`;
        if(p<1) requestAnimationFrame(animate);
        else wrap.classList.add('filled');
      }
      requestAnimationFrame(animate);

      io.unobserve(wrap);
    });
  },{threshold:.35});

  items.forEach(i=>io.observe(i));
})();

/* 08. Contact Action Buttons -------------------------------------- */
(function contactButtons(){
  const TO = 'abidhussain15658@gmail.com';
  const gmailBtn  = document.getElementById('btn-gmail');
  const mailBtn   = document.getElementById('btn-mailto');
  const copyBtn   = document.getElementById('btn-copy');
  const msgBox    = document.getElementById('hub-message');
  const count     = document.getElementById('msg-count');
  const toast     = document.getElementById('copy-toast');
  const MAX = 500;

  if(msgBox && count){
    msgBox.addEventListener('input', ()=>{
      if(msgBox.value.length > MAX) msgBox.value = msgBox.value.slice(0,MAX);
      count.textContent = `${msgBox.value.length} / ${MAX}`;
    });
  }

  function getBody(){
    const raw = (msgBox?.value || '').trim();
    return encodeURIComponent(raw);
  }

  function gmailCompose(){
    const subject = encodeURIComponent('Message for Abid');
    const body = getBody();
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TO)}&su=${subject}&body=${body}`;
    const w = window.open(url,'_blank','noopener');
    if(!w){
      window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
    }
  }

  gmailBtn?.addEventListener('click', gmailCompose);

  mailBtn?.addEventListener('click', ()=>{
    const subject = encodeURIComponent('Message for Abid');
    const body = getBody();
    window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
  });

  copyBtn?.addEventListener('click', ()=>{
    navigator.clipboard.writeText(TO).then(()=>{
      if(toast){
        toast.classList.add('show');
        setTimeout(()=>toast.classList.remove('show'),1800);
      }
    }).catch(()=>alert('Copy failed'));
  });
})();

/* 09. External Links Security ------------------------------------- */
(function secureLinks(){
  document.querySelectorAll('a[target="_blank"]').forEach(a=>{
    a.setAttribute('rel','noopener noreferrer');
  });
})();

/* 10. Matrix Rain Background --------------------------------------- */
(function matrix(){
  const canvas = document.getElementById('matrix');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  let w,h,cols,drops;
  const fontSize=16;
  const chars='01$#@*&%{}[]<>/\\|+=-_.';
  let fps=42;
  let now, then=performance.now(), interval=1000/fps, delta;

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
    now = ts;
    delta = now - then;
    if(delta < interval) return;
    then = now - (delta % interval);

    ctx.fillStyle='rgba(10,15,13,0.14)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle='#00ff88';
    ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

    for(let i=0;i<cols;i++){
      const ch= chars[Math.floor(Math.random()*chars.length)];
      const x= i*fontSize;
      const y= drops[i]*fontSize;
      ctx.fillText(ch,x,y);
      if(y > window.innerHeight && Math.random()>0.975) drops[i]=0;
      else drops[i]++;
    }
  }
  requestAnimationFrame(loop);
})();

/* ================= END OF FILE ================= */
  const mailtoBtn = document.getElementById('mailto-btn');
  const copyBtn   = document.getElementById('copy-btn');
  const msgBox    = document.getElementById('quick-message');
  const toast     = document.getElementById('copy-toast');
  const TO        = 'abidhussain15658@gmail.com';

  if(gmailBtn){
    gmailBtn.addEventListener('click', ()=>{
      const body = encodeURIComponent((msgBox?.value || '').trim());
      const subject = encodeURIComponent('Message for Abid');
      const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TO)}&su=${subject}&body=${body}`;
      const win = window.open(url,'_blank','noopener');
      if(!win){
        // fallback
        window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
      }
    });
  }

  if(mailtoBtn){
    mailtoBtn.addEventListener('click', ()=>{
      const body = encodeURIComponent((msgBox?.value || '').trim());
      const subject = encodeURIComponent('Message for Abid');
      window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
    });
  }

  if(copyBtn){
    copyBtn.addEventListener('click', ()=>{
      navigator.clipboard.writeText(TO).then(()=>{
        if(toast){
          toast.classList.add('show');
          setTimeout(()=>toast.classList.remove('show'),1800);
        }
      }).catch(()=>alert('Copy failed'));
    });
  }
})();
