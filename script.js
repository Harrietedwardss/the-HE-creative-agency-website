/* ============================================
   The HE Creative Agency — script.js
   ============================================ */

// ----- Custom Cursor -----

const cursorGlass = document.getElementById('cursor-glass');
const cursorDot   = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0;
let glassX = 0, glassY = 0;
let dotX   = 0, dotY   = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  document.body.classList.add('cursor-on');
});

document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on'));
document.addEventListener('mouseenter', () => document.body.classList.add('cursor-on'));

function animateCursor() {
  dotX   += (mouseX - dotX)   * 0.88;
  dotY   += (mouseY - dotY)   * 0.88;
  glassX += (mouseX - glassX) * 0.14;
  glassY += (mouseY - glassY) * 0.14;

  cursorDot.style.left   = dotX   + 'px';
  cursorDot.style.top    = dotY   + 'px';
  cursorGlass.style.left = glassX + 'px';
  cursorGlass.style.top  = glassY + 'px';

  requestAnimationFrame(animateCursor);
}

animateCursor();

document.querySelectorAll('a, button, .service, .work-cell, .field-input, .field-textarea').forEach(el => {
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


// ----- Scroll Reveal -----

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -56px 0px' });

// Stagger siblings within the same parent
document.querySelectorAll('.section-wrap, .about-grid, .about-right, .services-list, .work-grid, .process-row, .quotes-grid, .contact-grid').forEach(parent => {
  const children = parent.querySelectorAll(':scope > .reveal, :scope > .fade-up');
  children.forEach((el, i) => {
    if (i > 0) el.style.transitionDelay = `${i * 0.1}s`;
  });
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Hero fades in on load
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .fade-up').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 200);
  });
});


// ----- Smooth Scroll -----

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ----- Work Lightbox -----

const lightbox      = document.getElementById('lightbox');
const lightboxBody  = document.getElementById('lightbox-body');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.work-cell').forEach(cell => {
  cell.addEventListener('click', () => {
    const title = cell.dataset.title || '';
    const cat   = cell.dataset.cat   || '';

    lightboxBody.innerHTML = `
      <p>${cat}</p>
      <h3>${title}</h3>
    `;

    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  });
});

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
});


// ----- Contact Form -----

const form        = document.getElementById('form');
const formSuccess = document.getElementById('form-success');

form.addEventListener('submit', e => {
  e.preventDefault();

  const btn = form.querySelector('.form-btn');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    form.reset();
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    formSuccess.textContent = 'Message sent — we\'ll be in touch soon.';
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1200);
});
