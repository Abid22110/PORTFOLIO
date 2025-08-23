/* ===== Keep your previous JS (typing, skills, matrix, nav, certificates) as-is =====
   Only replacing the contact (old form) logic with simpler buttons below.
*/

/* -------- Existing code from previous script.js ABOVE this line remains unchanged -------- */

/* ============== Simple Contact Buttons (Replace old contact handler) ============== */
(function simpleContact(){
  const gmailBtn  = document.getElementById('gmail-btn');
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
