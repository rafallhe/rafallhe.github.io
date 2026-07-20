
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      if (entry.target.classList.contains('stat')) animateCounter(entry.target.querySelector('strong'));
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal, .stat').forEach(el => observer.observe(el));

function animateCounter(el) {
  if (!el || el.dataset.done) return;
  el.dataset.done = 'true';
  const target = Number(el.dataset.count || 0);
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 35));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current + '+';
  }, 35);
}

const phrases = [
  'responsive web applications',
  'database-driven systems',
  'clean user experiences',
  'practical business solutions'
];
const typingEl = document.getElementById('typingText');
let phraseIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const phrase = phrases[phraseIndex];
  if (!deleting) {
    typingEl.textContent = phrase.slice(0, ++charIndex);
    if (charIndex === phrase.length) {
      deleting = true;
      return setTimeout(typeLoop, 1200);
    }
  } else {
    typingEl.textContent = phrase.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 60);
}
typeLoop();

const themeBtn = document.getElementById('themeBtn');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') document.body.classList.add('light');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

const glow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', e => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * .08}px, ${y * .08}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});


// Final UX polish
const header = document.querySelector('.site-header');
const progress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${docHeight > 0 ? (scrollTop / docHeight) * 100 : 0}%`;
  header.classList.toggle('scrolled', scrollTop > 10);
  backToTop.classList.toggle('show', scrollTop > 600);

  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 140;
    if (scrollTop >= top) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Disable cursor glow on touch devices
if (window.matchMedia('(pointer: coarse)').matches) {
  glow.style.display = 'none';
}

// Tilt effect for project cards on precise pointers
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(1200px) rotateX(${y * -2.5}deg) rotateY(${x * 2.5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
}
