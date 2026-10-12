/* ── PROJECT OME — Landing Page Animations ── */

const root = document.documentElement;

const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
  root.classList.remove('anim');
}

const ANIM = root.classList.contains('anim');

if (!ANIM && root.classList.contains('reduce-motion')) {
  const video = document.querySelector('.cell-video');
  if (video) {
    video.removeAttribute('autoplay');
    video.pause();
  }
}

/* Nav scrolled state (independent of GSAP) */
(function initNavState() {
  const nav = document.getElementById('nav');
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

if (ANIM) initAnimations();
initForm();

function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  const EASE_OUT   = 'power3.out';
  const EASE_INOUT = 'power2.inOut';

  /* ARC SETUP — set dasharray on every ring */
  document.querySelectorAll('.arc-ring').forEach(ring => {
    const c = 2 * Math.PI * parseFloat(ring.getAttribute('r'));
    ring.style.strokeDasharray  = c;
    ring.style.strokeDashoffset = c;
  });

  /* NAV — fade in on load */
  gsap.to(['.nav-logo', '.nav-links', '.nav-cta'], {
    opacity: 1,
    y: 0,
    duration: 0.9,
    delay: 0.2,
    stagger: 0.12,
    ease: EASE_OUT,
  });

  /* HERO — typewriter */
  (function initTypewriter() {
    const preEl    = document.getElementById('hero-pre');
    const mainEl   = document.getElementById('hero-main');
    const cursorEl = document.getElementById('hero-cursor');

    const line1 = preEl.textContent.trim();
    const line2 = mainEl.textContent.trim();
    preEl.textContent  = '';
    mainEl.textContent = '';
    let phase = 1;
    let idx   = 0;

    function revealHero() {
      cursorEl.style.display = 'none';
      gsap.to(['.hero-headline', '.hero-ctas'], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: EASE_OUT,
      });
      gsap.to('.hero-stat', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0.45,
        ease: EASE_OUT,
      });
    }

    function tick() {
      if (phase === 1) {
        if (idx < line1.length) {
          preEl.textContent += line1[idx++];
          setTimeout(tick, 90);
        } else {
          phase = 2;
          idx   = 0;
          setTimeout(tick, 220);
        }
      } else if (idx < line2.length) {
        mainEl.textContent += line2[idx++];
        setTimeout(tick, 160);
      } else {
        setTimeout(revealHero, 400);
      }
    }

    gsap.to('.s-hero .arc-ring', {
      strokeDashoffset: 0,
      duration: 2.2,
      delay: 0.5,
      ease: EASE_INOUT,
    });

    setTimeout(tick, 700);
  })();

  /* SECTION REVEALS — each [data-reveal] section */
  document.querySelectorAll('[data-reveal]').forEach(section => {
    const arc       = section.querySelector('.arc-ring');
    const title     = section.querySelector('.reveal-title');
    const rule      = section.querySelector('.reveal-rule');
    const items     = section.querySelectorAll('.reveal-item');
    const stats     = section.querySelectorAll('.reveal-stat');
    const timelines = section.querySelectorAll('.reveal-timeline');
    const whos      = section.querySelectorAll('.reveal-who');
    const form      = section.querySelector('.reveal-form');
    const cadence   = section.querySelector('.protocol-cadence');

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 72%', once: true },
    });

    if (arc)   tl.to(arc,   { strokeDashoffset: 0, duration: 1.4, ease: EASE_INOUT }, 0);
    if (items.length) tl.to(items, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: EASE_OUT }, 0.1);
    if (title) tl.to(title, { opacity: 1, rotation: 0, scale: 1, duration: 0.8, ease: EASE_OUT }, 0.2);
    if (rule)  tl.to(rule,  { scaleX: 1, duration: 0.5, ease: EASE_OUT }, 0.5);
    if (stats.length)     tl.to(stats,     { opacity: 1, y: 0, duration: 0.65, stagger: 0.14, ease: EASE_OUT }, 0.4);
    if (timelines.length) tl.to(timelines, { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: EASE_OUT }, 0.45);
    if (whos.length)      tl.to(whos,      { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: EASE_OUT }, 0.45);
    if (form)    tl.to(form,    { opacity: 1, y: 0, duration: 0.7, ease: EASE_OUT }, 0.6);
    if (cadence) tl.to(cadence, { opacity: 1, y: 0, duration: 0.5, ease: EASE_OUT }, 0.9);
  });

  /* NUMERIC COUNTERS — final value is in the HTML; animate up to it */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const final  = el.textContent;
    const proxy  = { val: 0 };
    el.textContent = prefix + '0' + suffix;

    ScrollTrigger.create({
      trigger: el,
      start:   'top 80%',
      once:    true,
      onEnter: () => {
        gsap.to(proxy, {
          val:      target,
          duration: 1.8,
          ease:     'power2.out',
          snap:     { val: 1 },
          onUpdate: () => {
            el.textContent = prefix + Math.round(proxy.val).toLocaleString() + suffix;
          },
          onComplete: () => { el.textContent = final; },
        });
      },
    });
  });
}

/* CONTACT FORM — Formspree AJAX submit */
function initForm() {
  const form   = document.getElementById('contact-form');
  if (!form) return;
  const fields = document.getElementById('form-fields');
  const btn    = document.getElementById('form-btn');
  const status = document.getElementById('form-status');
  const name   = document.getElementById('form-name');
  const email  = document.getElementById('form-email');
  const BTN_LABEL = btn.textContent;
  const FALLBACK  = 'Please email arda@projectome.com directly.';

  function setStatus(text, state) {
    status.textContent = text;
    status.dataset.state = state || '';
  }

  function validate() {
    const problems = [];
    const nameOk  = name.value.trim() !== '';
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    name.setAttribute('aria-invalid', String(!nameOk));
    email.setAttribute('aria-invalid', String(!emailOk));
    if (!nameOk)  problems.push('your name');
    if (!emailOk) problems.push('a valid email');
    if (problems.length) {
      setStatus('Please add ' + problems.join(' and ') + '.', 'error');
      (nameOk ? email : name).focus();
      return false;
    }
    return true;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    btn.textContent = 'SENDING…';
    btn.disabled    = true;
    setStatus('Sending…', 'pending');

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(form),
      });

      if (!res.ok) throw new Error('server error');

      fields.hidden = true;
      setStatus('Thank you. Your message has been sent, and we will be in touch.', 'success');
      status.setAttribute('tabindex', '-1');
      status.focus();
    } catch {
      btn.textContent = BTN_LABEL;
      btn.disabled    = false;
      setStatus('Sorry, your message could not be sent. ' + FALLBACK, 'error');
    }
  });
}
