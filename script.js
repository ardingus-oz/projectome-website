/* ── PROJECT OME — Landing Page Animations ── */

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const EASE_OUT   = 'power3.out';
const EASE_INOUT = 'power2.inOut';
// r=180 → C = 2πr ≈ 1131  |  r=230 → C ≈ 1445
const CIRC_180   = 2 * Math.PI * 180;
const CIRC_230   = 2 * Math.PI * 230;

/* ─────────────────────────────────────────
   ARC SETUP — set dasharray on every ring
───────────────────────────────────────── */
document.querySelectorAll('.arc-ring').forEach(ring => {
  const r = parseFloat(ring.getAttribute('r'));
  const c = 2 * Math.PI * r;
  ring.style.strokeDasharray  = c;
  ring.style.strokeDashoffset = c;
});

/* ─────────────────────────────────────────
   NAV — fade in on load + scrolled state
───────────────────────────────────────── */
gsap.to(['.nav-logo', '.nav-cta'], {
  opacity: 1,
  y: 0,
  duration: 0.9,
  delay: 0.2,
  stagger: 0.12,
  ease: EASE_OUT,
});

ScrollTrigger.create({
  start: 'top -80',
  onEnter:     () => document.getElementById('nav').classList.add('scrolled'),
  onLeaveBack: () => document.getElementById('nav').classList.remove('scrolled'),
});

/* ─────────────────────────────────────────
   HERO — typewriter
───────────────────────────────────────── */
(function initTypewriter() {
  const preEl    = document.getElementById('hero-pre');
  const mainEl   = document.getElementById('hero-main');
  const cursorEl = document.getElementById('hero-cursor');

  const line1 = 'PROJECT';
  const line2 = 'OME';
  let phase = 1;
  let idx   = 0;

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
    } else {
      if (idx < line2.length) {
        mainEl.textContent += line2[idx++];
        setTimeout(tick, 160);
      } else {
        // Typing done — hide cursor, reveal sub-elements
        setTimeout(() => {
          cursorEl.style.display = 'none';

          gsap.to('.hero-tagline', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: EASE_OUT,
          });
          gsap.to('.hero-stat', {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.3,
            ease: EASE_OUT,
          });
        }, 400);
      }
    }
  }

  // Hero arc draws in on load
  gsap.to('.s-hero .arc-ring', {
    strokeDashoffset: 0,
    duration: 2.2,
    delay: 0.5,
    ease: EASE_INOUT,
  });

  setTimeout(tick, 700);
})();

/* ─────────────────────────────────────────
   SECTION REVEALS — each [data-reveal] section
───────────────────────────────────────── */
document.querySelectorAll('[data-reveal]').forEach(section => {
  const arc       = section.querySelector('.arc-ring');
  const kicker    = section.querySelector('.kicker');
  const title     = section.querySelector('.reveal-title');
  const rule      = section.querySelector('.reveal-rule');
  const items     = section.querySelectorAll('.reveal-item');
  const stats     = section.querySelectorAll('.reveal-stat');
  const timelines = section.querySelectorAll('.reveal-timeline');
  const whos      = section.querySelectorAll('.reveal-who');
  const form      = section.querySelector('.reveal-form');
  const formNote  = section.querySelector('.form-note');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start:   'top 72%',
      once:    true,
    },
  });

  // 1. Arc draws
  if (arc) {
    tl.to(arc, {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: EASE_INOUT,
    }, 0);
  }

  // 2. Kicker fades in
  if (kicker && kicker.classList.contains('reveal-item')) {
    tl.to(kicker, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: EASE_OUT,
    }, 0.1);
  }

  // 3. Title: circular / rotation reveal
  if (title) {
    tl.to(title, {
      opacity: 1,
      rotation: 0,
      scale: 1,
      duration: 0.8,
      ease: EASE_OUT,
    }, 0.2);
  }

  // 4. Rule slides in
  if (rule) {
    tl.to(rule, {
      scaleX: 1,
      duration: 0.5,
      ease: EASE_OUT,
    }, 0.5);
  }

  // 5. Body items stagger
  if (items.length) {
    const filteredItems = [...items].filter(el =>
      !el.classList.contains('reveal-title') &&
      el !== kicker
    );
    if (filteredItems.length) {
      tl.to(filteredItems, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: EASE_OUT,
      }, 0.45);
    }
  }

  // 6. Stat blocks
  if (stats.length) {
    tl.to(stats, {
      opacity: 1,
      y: 0,
      duration: 0.65,
      stagger: 0.14,
      ease: EASE_OUT,
    }, 0.4);
  }

  // 7. Timeline items slide in from left
  if (timelines.length) {
    tl.to(timelines, {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: EASE_OUT,
    }, 0.45);
  }

  // 8. Who items
  if (whos.length) {
    tl.to(whos, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.12,
      ease: EASE_OUT,
    }, 0.45);
  }

  // 9. Form
  if (form) {
    tl.to(form, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: EASE_OUT,
    }, 0.6);
  }

  // 10. Form note
  if (formNote) {
    tl.to(formNote, {
      opacity: 1,
      duration: 0.5,
      ease: EASE_OUT,
    }, 1.0);
  }

  // 11. Protocol cadence line
  const cadence = section.querySelector('.protocol-cadence');
  if (cadence) {
    tl.to(cadence, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: EASE_OUT,
    }, 0.9);
  }
});

/* ─────────────────────────────────────────
   NUMERIC COUNTERS
───────────────────────────────────────── */
document.querySelectorAll('[data-count]').forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const proxy  = { val: 0 };

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
          el.textContent = Math.round(proxy.val).toLocaleString() + suffix;
        },
      });
    },
  });
});

/* ─────────────────────────────────────────
   WAITLIST FORM — Formspree AJAX submit
───────────────────────────────────────── */
(function initForm() {
  const form   = document.getElementById('waitlist-form');
  const btn    = document.getElementById('form-btn');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const email = form.querySelector('#form-email').value.trim();
    if (!email) return;

    btn.textContent        = 'SENDING...';
    btn.style.pointerEvents = 'none';
    status.textContent     = '';
    status.style.color     = '';

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(form),
      });

      if (res.ok) {
        // Success state — replace form row, show confirmation
        form.querySelector('.form-row').style.display = 'none';
        status.textContent = 'MONITORING REQUEST RECEIVED. WE\'LL BE IN TOUCH SHORTLY.';
        status.style.color  = 'var(--accent)';
        status.style.opacity = '1';
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.errors?.[0]?.message || 'server error');
      }
    } catch {
      btn.textContent        = 'SUBMIT';
      btn.style.pointerEvents = '';
      status.textContent     = 'SUBMISSION FAILED. PLEASE EMAIL ARDA_OZ@PROJECTOME.COM DIRECTLY.';
      status.style.color     = '#c0392b';
      status.style.opacity   = '1';
    }
  });
})();

