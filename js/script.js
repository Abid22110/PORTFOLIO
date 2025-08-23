/* ================== CONFIG ================== */

// Certificates array (ADD NEW HERE)
const CERTS = [
  { title: 'Pitman Training — CPD (Computer Basics)', src: 'assets/images/certificate.jpeg' },
  { title: 'Basic Computer Course', src: 'assets/images/cert-basic-computer.jpeg' },
  { title: 'Google Course', src: 'assets/images/cert-google-course.jpeg' },
  { title: 'Cisco Networking Course', src: 'assets/images/course.jpg' } // NEW
];

// Contact send mode priority:
// 1. EMAILJS (if EMAILJS_PUBLIC_KEY + EMAILJS_SERVICE_ID + EMAILJS_TEMPLATE_ID set)
// 2. FORMSPREE_ENDPOINT (if set)
// 3. Gmail compose fallback
const EMAILJS_PUBLIC_KEY   = ''; // e.g. "abcd123YOURPUBkey"
const EMAILJS_SERVICE_ID   = ''; // e.g. "service_xxxx"
const EMAILJS_TEMPLATE_ID  = ''; // e.g. "template_xxxx"
const FORMSPREE_ENDPOINT   = ''; // e.g. "https://formspree.io/f/xxxxxx"

/* ================== INIT AOS ================== */
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) AOS.init({ duration: 650, once: true, offset: 80 });
});

/* ================== NAV DRAWER ================== */
(function navDrawer(){
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');
  const overlay = document.querySelector('.nav-overlay');
  const closeBtn = document.querySelector('.drawer-close');

  if(!toggle || !drawer || !overlay) return;

  const open = () => {
    drawer.classList.add('open');
    overlay.classList.add('show');
    drawer.setAttribute('aria-hidden','false');
  };
  const close = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    drawer.setAttribute('aria-hidden','true');
  };

  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // ESC close
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') close();
  });
})();

/* ================== BACK TO TOP ================== */
document.getElementById('scroll-top')?.addEventListener('click', e=>{
  e.preventDefault(); window.scrollTo({ top:0, behavior:'smooth' });
});

/* ================== TYPING EFFECT ================== */
(function typing(){
  const el = document.getElementById('typing-text');
  const cursor = document.querySelector('.cursor');
  if(!el) return;
  const lines = ['Cybersecurity Expert','Ethical Hacker','Blue Team | Red Team','Security Automation'];
  let idx=0,pos=0,dir=1;
  function step(){
    const t = lines[idx];
    pos += dir;
    el.textContent = t.slice(0, Math.max(0, Math.min(pos, t.length)));
    if(pos >= t.length + 10) dir = -1;
    if(pos <= 0){ dir = 1; idx = (idx+1)%lines.length; }
    setTimeout(step, dir>0 ? 80 : 40);
  }
  step();
  if(cursor) setInterval(()=>cursor.classList.toggle('hidden'),500);
})();

/* ================== CERTIFICATES RENDER ================== */
(function renderCerts(){
  const list = document.getElementById('certList');
  if(!list) return;

  const frag = document.createDocumentFragment();
  CERTS.forEach(c=>{
    const li = document.createElement('li');
    li.innerHTML = `
      <a class="cert-link" href="${c.src}" target="_blank" rel="noopener noreferrer">
        ${c.title}
      </a>
    `;
    frag.appendChild(li);
  });
  list.appendChild(frag);
})();

/* ================== OWNER LOCAL (NON-PERSISTENT) CERT UPLOAD ================== */
(function ownerUpload(){
  const nameInput = document.getElementById('certName');
  const fileInput = document.getElementById('certFile');
  const btn = document.getElementById('addCertBtn');
  const list = document.getElementById('certList');
  if(!btn || !nameInput || !fileInput || !list) return;

  btn.addEventListener('click', ()=>{
    const name = nameInput.value.trim();
    const file = fileInput.files[0];
    if(!name || !file) { alert('Name & file required.'); return; }
    const reader = new FileReader();
    reader.onload = (e)=>{
      const li = document.createElement('li');
      li.innerHTML = `
        <a class="cert-link" href="${e.target.result}" target="_blank" rel="noopener noreferrer">
          ${name} (Preview)
        </a>
      `;
      list.appendChild(li);
      nameInput.value='';
      fileInput.value='';
    };
    reader.readAsDataURL(file);
  });
})();

/* ================== SKILLS PROGRESS ================== */
(function skillsProgress(){
  const items = document.querySelectorAll('.skill-progress');
  if(!items.length) return;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const wrap = e.target;
      const percentTarget = parseInt(wrap.getAttribute('data-percent')||'0',10);
      const circle = wrap.querySelector('.progress-circle-fill');
      const text = wrap.querySelector('.skill-percent');
      if(!circle || !text){ io.unobserve(wrap); return; }

      const r = parseFloat(circle.getAttribute('r')||'55');
      const circumference = 2*Math.PI*r;
      circle.style.strokeDasharray = String(circumference);
      circle.style.strokeDashoffset = String(circumference);

      requestAnimationFrame(()=>{
        const targetOffset = circumference - (percentTarget/100)*circumference;
        circle.style.strokeDashoffset = String(targetOffset);
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

/* ================== CONTACT FORM ================== */
(function contact(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  const TO = 'abidhussain15658@gmail.com';

  // Init EmailJS if keys present
  document.addEventListener('DOMContentLoaded', ()=>{
    if(EMAILJS_PUBLIC_KEY && window.emailjs){
      try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(err){ console.warn('EmailJS init failed', err); }
    }
  });

  form.addEventListener('submit', async e=>{
    e.preventDefault();
    const honeypot = (document.getElementById('hp_field')?.value||'').trim();
    if(honeypot){ return; } // spam bot

    const name = (document.getElementById('name')?.value||'').trim();
    const email = (document.getElementById('email')?.value||'').trim();
    const message = (document.getElementById('message')?.value||'').trim();

    if(!name || !email || !message){
      alert('Please fill all fields.');
      return;
    }

    // Option A: EmailJS
    if(EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && window.emailjs){
      try{
        const resp = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: name,
            reply_to: email,
          user_email: email,
          message: message,
          to_email: TO
        });
        if(resp.status===200){
          form.reset();
          alert('Message sent successfully (EmailJS)!');
          return;
        }
      }catch(err){
        console.warn('EmailJS failed, trying next fallback.', err);
      }
    }

    // Option B: Formspree or other endpoint
    if(FORMSPREE_ENDPOINT){
      try{
        const fd = new FormData();
        fd.append('name', name);
        fd.append('email', email);
        fd.append('message', message);
        const res = await fetch(FORMSPREE_ENDPOINT,{
          method:'POST',
          headers:{'Accept':'application/json'},
          body:fd
        });
        if(res.ok){
          form.reset();
          alert('Message sent successfully (Form service)!');
          return;
        } else {
          console.warn('Form service error status', res.status);
        }
      }catch(err){
        console.warn('Form service failed, fallback to Gmail.', err);
      }
    }

    // Option C: Gmail compose fallback
    const subject = encodeURIComponent(`Portfolio Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TO)}&su=${subject}&body=${body}`;
    const opened = window.open(gmailUrl,'_blank','noopener');
    if(!opened){
      window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
    }
    form.reset();
  });
})();

/* ================== EXTERNAL LINKS SECURITY ================== */
(function secureLinks(){
  document.querySelectorAll('a[target="_blank"]').forEach(a=>a.setAttribute('rel','noopener noreferrer'));
})();

/* ================== MATRIX RAIN ================== */
(function matrix(){
  const canvas = document.getElementById('matrix');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h,cols,drops;
  const fontSize=16;
  const chars='01$#@*&%{}[]<>/\\|+=-_.';
  let fps=42, now, then=performance.now(), interval=1000/fps, delta;

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

/* ================== EMAILJS USAGE NOTE ==================
1. Sign up at https://www.emailjs.com/
2. Create service, template.
3. Put public key in EMAILJS_PUBLIC_KEY.
4. Put service id, template id.
5. Template variables used: from_name, reply_to, user_email, message, to_email
========================================================== */
