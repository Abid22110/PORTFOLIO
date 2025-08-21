// Toggle mobile nav
document.querySelector('.nav-toggle').addEventListener('click', () => {
  const nav = document.querySelector('.site-nav');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});
