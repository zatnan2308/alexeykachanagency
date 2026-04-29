/**
 * Site-wide animation system.
 *
 * Stack:
 *  - Lenis  — buttery smooth scroll, synced with GSAP ticker
 *  - GSAP + ScrollTrigger  — reveals, staggers, counters
 *  - Vanilla DOM events  — magnetic CTA effect
 *
 * Conventions (declarative, via data-* attributes — no per-page wiring):
 *  data-reveal                — element fades & slides up on scroll into view
 *  data-reveal="fade"         — fade only (no Y translate)
 *  data-reveal="fade-left"    — fade + slide from the left
 *  data-reveal="fade-right"   — fade + slide from the right
 *  data-reveal="scale"        — fade + scale up
 *  data-reveal-delay="0.15"   — delay in seconds
 *  data-reveal-stagger        — stagger direct children on scroll into view
 *  data-counter="180"         — animate text from 0 → 180 on scroll into view
 *  data-counter-suffix="+"    — append after the number (e.g. "180+")
 *  data-magnetic              — cursor-following magnetic effect on the element
 *  data-magnetic-strength="0.4" — pull strength (default 0.3)
 *
 * Accessibility: full pass-through when prefers-reduced-motion is set.
 * Lifecycle: idempotent init + Astro view-transitions aware cleanup.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION_MQ = '(prefers-reduced-motion: reduce)';
const reducedMotion = () => window.matchMedia(REDUCED_MOTION_MQ).matches;

// =============================================================================
// 1. Lenis smooth scroll (synced with GSAP)
// =============================================================================

let lenis: Lenis | null = null;

function initSmoothScroll() {
  if (reducedMotion()) return;
  if (lenis) return;

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });

  // Sync with GSAP ticker for perfect frame alignment
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Update ScrollTrigger when Lenis scrolls
  lenis.on('scroll', ScrollTrigger.update);
}

// =============================================================================
// 2. Scroll reveals
// =============================================================================

interface RevealVars {
  opacity: number;
  y?: number;
  x?: number;
  scale?: number;
}

const revealVariants: Record<string, RevealVars> = {
  'fade-up':    { opacity: 0, y: 40 },
  'fade':       { opacity: 0 },
  'fade-left':  { opacity: 0, x: -40 },
  'fade-right': { opacity: 0, x: 40 },
  'scale':      { opacity: 0, scale: 0.92 },
};

function initScrollReveals() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-init])');
  els.forEach((el) => {
    el.dataset.revealInit = '1';

    if (reducedMotion()) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const variant = el.dataset.reveal || 'fade-up';
    const from = revealVariants[variant] ?? revealVariants['fade-up'];
    const delay = parseFloat(el.dataset.revealDelay || '0');

    // Use fromTo (not from) — CSS sets opacity:0 on .js [data-reveal] to prevent
    // FOUC, so gsap.from() would read current opacity (0) as the destination
    // value, animating from 0 to 0. fromTo is explicit about both endpoints.
    gsap.fromTo(
      el,
      from,
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.95,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });
}

function initStaggerReveals() {
  const parents = document.querySelectorAll<HTMLElement>('[data-reveal-stagger]:not([data-stagger-init])');
  parents.forEach((parent) => {
    parent.dataset.staggerInit = '1';
    const children = Array.from(parent.children) as HTMLElement[];
    if (children.length === 0) return;

    if (reducedMotion()) {
      gsap.set(children, { opacity: 1, y: 0 });
      return;
    }

    const delay = parseFloat(parent.dataset.staggerDelay || '0');
    const stagger = parseFloat(parent.dataset.staggerInterval || '0.08');

    // fromTo so it works against CSS-pre-hidden children (see initScrollReveals).
    gsap.fromTo(
      children,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: parent,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });
}

// =============================================================================
// 3. Number counter
// =============================================================================

function initCounters() {
  const els = document.querySelectorAll<HTMLElement>('[data-counter]:not([data-counter-init])');
  els.forEach((el) => {
    el.dataset.counterInit = '1';
    const target = parseFloat(el.dataset.counter || '0');
    const suffix = el.dataset.counterSuffix || '';
    const prefix = el.dataset.counterPrefix || '';
    const decimals = parseInt(el.dataset.counterDecimals || '0', 10);

    // CRITICAL: HTML already contains the final value (crawlers / no-JS
    // visitors must always see real numbers). Animation must NOT pre-zero
    // the text. It only resets to 0 inside the ScrollTrigger onEnter
    // callback and animates back up. If the user never scrolls into view,
    // the original final number stays visible.
    if (reducedMotion()) return; // leave HTML value intact

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        el.textContent = `${prefix}0${suffix}`;
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`;
          },
        });
      },
    });
  });
}

// =============================================================================
// 4. Magnetic effect (CTAs, social icons, etc.)
// =============================================================================

function initMagnetic() {
  if (reducedMotion()) return;
  // Skip on touch — no cursor to follow
  if (window.matchMedia('(hover: none)').matches) return;

  const els = document.querySelectorAll<HTMLElement>('[data-magnetic]:not([data-magnetic-init])');
  els.forEach((el) => {
    el.dataset.magneticInit = '1';
    const strength = parseFloat(el.dataset.magneticStrength || '0.3');

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: 'power3.out',
      });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });
}

// =============================================================================
// 5. Custom cursor (non-touch pointers only) + 6. Intro loader
// =============================================================================

let cursorBound = false;
function initCustomCursor() {
  if (cursorBound) return;
  if (reducedMotion()) return;
  if (window.matchMedia('(hover: none)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.querySelector<HTMLElement>('[data-cursor]');
  const ring   = document.querySelector<HTMLElement>('[data-cursor-ring]');
  const dot    = document.querySelector<HTMLElement>('[data-cursor-dot]');
  if (!cursor || !ring || !dot) return;
  cursorBound = true;

  const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
  const dotX  = gsap.quickTo(dot, 'x', { duration: 0.06, ease: 'none' });
  const dotY  = gsap.quickTo(dot, 'y', { duration: 0.06, ease: 'none' });

  document.addEventListener('mousemove', (e) => {
    ringX(e.clientX); ringY(e.clientY); dotX(e.clientX); dotY(e.clientY);
  });
  document.addEventListener('mousedown', () => cursor.dataset.state = 'click');
  document.addEventListener('mouseup',   () => cursor.dataset.state = '');

  const ACTIVE = 'a, button, [role="button"], [data-magnetic], input, textarea, select, summary, label';
  document.body.addEventListener('mouseover', (e) => {
    if ((e.target as HTMLElement).closest(ACTIVE)) cursor.dataset.state = 'active';
  });
  document.body.addEventListener('mouseout', (e) => {
    if ((e.target as HTMLElement).closest(ACTIVE)) cursor.dataset.state = '';
  });
}

function initIntroLoader() {
  const loader = document.querySelector<HTMLElement>('[data-intro-loader]');
  if (!loader) return;

  // Show only on first visit per session
  let alreadyShown = false;
  try { alreadyShown = sessionStorage.getItem('intro-shown') === '1'; } catch {}
  if (alreadyShown || reducedMotion()) {
    loader.remove();
    return;
  }
  try { sessionStorage.setItem('intro-shown', '1'); } catch {}

  // Brief, subtle, then fade out
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to(loader.querySelector('[data-intro-bar]'), { width: '100%', duration: 1.0 })
    .to(loader.querySelector('[data-intro-text]'), { opacity: 0, y: -8, duration: 0.4 }, '-=0.2')
    .to(loader, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '-=0.1')
    .add(() => {
      loader.remove();
      // Layout may have shifted now that the loader is gone — refresh
      // ScrollTrigger so reveal elements use correct positions.
      ScrollTrigger.refresh();
    });
}

// =============================================================================
// 7. Hero entrance timeline (homepage only)
// =============================================================================

function initHeroEntrance() {
  const hero = document.querySelector<HTMLElement>('[data-hero-entrance]');
  if (!hero) return;
  if (hero.dataset.heroInit) return;
  hero.dataset.heroInit = '1';

  if (reducedMotion()) {
    gsap.set(hero.querySelectorAll('.hero__kicker, .hero__title-line, .hero__subtitle, .hero__ctas > *, .hero__scroll'), { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo(hero.querySelector('.hero__kicker'),        { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 })
    .fromTo(hero.querySelectorAll('.hero__title-line'), { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.95, stagger: 0.12 }, '-=0.3')
    .fromTo(hero.querySelector('.hero__subtitle'),      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .fromTo(hero.querySelectorAll('.hero__ctas > *'),   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.4')
    .fromTo(hero.querySelector('.hero__scroll'),        { opacity: 0 },        { opacity: 1, duration: 0.5 }, '-=0.2');
}

// =============================================================================
// Lifecycle
// =============================================================================

function initAll() {
  initSmoothScroll();
  initIntroLoader();
  initCustomCursor();
  initHeroEntrance();
  initScrollReveals();
  initStaggerReveals();
  initCounters();
  initMagnetic();

  // Fix race condition: ScrollTrigger caches element positions at registration
  // time, but fonts/images can shift the layout afterward, leaving reveal
  // elements stuck at opacity:0 because their cached Y positions are now wrong.
  // Recalculate after fonts and after full window.load.
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  } else {
    // Already loaded — refresh on next frame to catch late layout shifts.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
}

function teardown() {
  // Kill all triggers + Lenis on view-transition navigate-out
  ScrollTrigger.getAll().forEach((t) => t.kill());
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

// Boot
if (typeof window !== 'undefined') {
  // Mark JS available so CSS can hide [data-reveal] before init
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }

  // Astro view transitions: re-init on every page-load, teardown on swap
  document.addEventListener('astro:before-swap', teardown);
  document.addEventListener('astro:page-load', initAll);
}
