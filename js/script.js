document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS
  AOS.init({
    duration: 800,
    easing: 'ease',
    once: true,
    offset: 100
  });

  // Toggle mobile navigation
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  navToggle.addEventListener('click', () => {
    siteNav.classList.toggle('show');
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-toggle') && !e.target.closest('.site-nav') && siteNav.classList.contains('show')) {
      siteNav.classList.remove('show');
    }
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      if(this.getAttribute('href') === '#') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      }

      // Close mobile menu after clicking a link
      if (siteNav.classList.contains('show')) {
        siteNav.classList.remove('show');
      }
    });
  });

  // Typing animation
  function typeText() {
    const text = "Cybersecurity Expert & Ethical Hacker";
    const typingElement = document.getElementById('typing-text');
    let i = 0;
    typingElement.innerHTML = '';
    
    function typeWriter() {
      if (i < text.length) {
        typingElement.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    }
    
    typeWriter();
  }
  
  // Start typing animation after a short delay
  setTimeout(typeText, 500);

  // Theme Switcher
  const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
  
  // Check for saved theme in localStorage
  if (localStorage.getItem('theme')) {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('theme'));
    if (localStorage.getItem('theme') === 'dark') {
      toggleSwitch.checked = true;
    }
  }

  function switchTheme(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }    
  }

  toggleSwitch.addEventListener('change', switchTheme);

  // Animate skill circles
  function animateSkills() {
    document.querySelectorAll('.skill-progress').forEach(skill => {
      const percent = skill.getAttribute('data-percent');
      const circle = skill.querySelector('.progress-circle-fill');
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      const offset = circumference - (percent / 100 * circumference);
      circle.style.strokeDashoffset = offset;
    });
  }

  // Trigger skill animation when skills section is in view
  const skillsSection = document.querySelector('#skills');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkills();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  if (skillsSection) {
    observer.observe(skillsSection);
  }

  // Form validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      
      if (name.value.trim() === '') {
        highlightError(name);
        isValid = false;
      } else {
        removeError(name);
      }
      
      if (email.value.trim() === '' || !isValidEmail(email.value)) {
        highlightError(email);
        isValid = false;
      } else {
        removeError(email);
      }
      
      if (message.value.trim() === '') {
        highlightError(message);
        isValid = false;
      } else {
        removeError(message);
      }
      
      if (isValid) {
        // Show success message (you would normally send data to server here)
        contactForm.innerHTML = `
          <div class="success-message" data-aos="zoom-in">
            <i class="fas fa-check-circle"></i>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for contacting me. I'll get back to you shortly.</p>
          </div>
        `;
      }
    });
  }
  
  function highlightError(field) {
    field.style.borderColor = 'red';
    field.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';
  }
  
  function removeError(field) {
    field.style.borderColor = '';
    field.style.backgroundColor = '';
  }
  
  function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
});
