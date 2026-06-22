/* ============================================
   The HE Creative Agency — script.js
   ============================================ */

// ----- Custom Cursor -----

const cursorGlass = document.getElementById('cursor-glass');
let mouseX = 0, mouseY = 0;
let glassX = 0, glassY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  document.body.classList.add('cursor-on');
});
document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on'));
document.addEventListener('mouseenter', () => document.body.classList.add('cursor-on'));

function animateCursor() {
  glassX += (mouseX - glassX) * 0.12;
  glassY += (mouseY - glassY) * 0.12;
  cursorGlass.style.left = glassX + 'px';
  cursorGlass.style.top  = glassY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .service, .gallery-cell, .brand-card, .field-input, .field-textarea').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});


// ----- Navigation -----

const nav       = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});


// ----- Hero: word-by-word reveal -----

function wrapWords(element) {
  const html = element.innerHTML;
  const parts = html.split(/(<[^>]+>|\s+)/);
  element.innerHTML = parts.map(part => {
    if (part.startsWith('<') || part.trim() === '') return part;
    return `<span class="word"><span class="word-inner">${part}</span></span>`;
  }).join('');
}

const heroSlogan = document.getElementById('hero-slogan');
if (heroSlogan) {
  wrapWords(heroSlogan);
  const inners = heroSlogan.querySelectorAll('.word-inner');
  window.addEventListener('load', () => {
    setTimeout(() => {
      heroSlogan.classList.add('revealed');
      inners.forEach((inner, i) => {
        inner.style.transitionDelay = `${0.4 + i * 0.07}s`;
      });
    }, 300);
  });
}


// ----- Scroll Reveal -----

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

window.addEventListener('load', () => {
  document.querySelectorAll('.hero .fade-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 120);
  });
});


// ----- Smooth Scroll -----

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});


// ----- Parallax Scroll Text -----

const fwdText = document.getElementById('scroll-text-fwd');
const revText = document.getElementById('scroll-text-rev');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (fwdText) fwdText.style.transform = `translateX(${-y * 0.06}px)`;
  if (revText) revText.style.transform = `translateX(${y * 0.06}px)`;
}, { passive: true });


// ----- Parallax Images -----

const parallaxEls = document.querySelectorAll('.parallax-img img');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  parallaxEls.forEach(img => {
    const parent = img.closest('.parallax-img');
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.bottom < 0 || rect.top > vh) return;
    const progress = (vh - rect.top) / (vh + rect.height);
    const shift = (progress - 0.5) * 40;
    img.style.transform = `translateY(${shift}px) scale(1.06)`;
  });
}, { passive: true });


// ----- Stat Counters -----

function animateCounter(el) {
  const target   = parseInt(el.dataset.count, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1800;
  const start    = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));


// ----- Contact Form — SMS via sms: URI (Option 1) -----
// On mobile this opens the Messages app with the enquiry pre-filled.
// On desktop it shows a copy-ready message as fallback.

const form        = document.getElementById('form');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = (document.getElementById('f-name')?.value    || '').trim();
    const email   = (document.getElementById('f-email')?.value   || '').trim();
    const project = (document.getElementById('f-project')?.value || '').trim();
    const message = (document.getElementById('f-message')?.value || '').trim();

    const body = [
      'New enquiry — The HE Creative Agency',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      project ? `Project: ${project}` : null,
      '',
      message,
    ].filter(l => l !== null).join('\n');

    const phone   = '+61497860003';
    const encoded = encodeURIComponent(body);

    // sms: URI — works on iOS and Android; silently does nothing on desktop
    const smsLink = document.createElement('a');
    smsLink.href  = `sms:${phone}?body=${encoded}`;
    smsLink.style.display = 'none';
    document.body.appendChild(smsLink);
    smsLink.click();
    document.body.removeChild(smsLink);

    form.reset();
    formSuccess.textContent = 'On mobile, your Messages app will open with this enquiry pre-filled — just hit send. On desktop, please email hello@hecreativeagency.com.';
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 10000);
  });
}
