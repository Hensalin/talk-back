/* =====================================================================
   Talk Back — inner pages and the Journal
   Menu, nav state, smooth scroll, reveals, FAQ, blog filter, article table
   of contents, reading progress, copy link. Every page works without it.
   ===================================================================== */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lenis = null;

  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var nav = $('#nav'), toggle = $('#navToggle'), links = $('#navLinks');
  function setMenu(open) {
    if (!links || !toggle) return;
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    var sr = $('.sr-only', toggle); if (sr) sr.textContent = open ? 'Close menu' : 'Open menu';
  }
  if (toggle) toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && links && links.classList.contains('is-open')) { setMenu(false); toggle.focus(); } });
  document.addEventListener('click', function (e) { if (links && links.classList.contains('is-open') && nav && !nav.contains(e.target)) setMenu(false); });

  /* ---------- Nav state + reading progress ---------- */
  var bar = $('.progress span'), lastY = window.scrollY, ticking = false;
  function onScroll() {
    var sy = window.scrollY;
    if (nav) {
      nav.classList.toggle('is-scrolled', sy > 20);
      if (!links || !links.classList.contains('is-open')) {
        if (sy > 600 && sy > lastY + 6) nav.classList.add('is-hidden');
        else if (sy < lastY - 6 || sy < 600) nav.classList.remove('is-hidden');
      }
    }
    if (bar) { var max = document.documentElement.scrollHeight - window.innerHeight; bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, sy / max) : 0) + ')'; }
    lastY = sy; ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  if (nav) nav.addEventListener('focusin', function () { nav.classList.remove('is-hidden'); });
  onScroll();

  /* ---------- Anchor links ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var t = document.getElementById(decodeURIComponent(id.slice(1))); if (!t) return;
    if (links && links.contains(a)) setMenu(false);
    if (lenis) { e.preventDefault(); lenis.scrollTo(t, { offset: -90, duration: 1.2 }); history.replaceState(null, '', id); }
  });

  /* ---------- Spotlight on tiles ---------- */
  $$('.ptile, .jcard').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- How it works: highlight the step in view ---------- */
  var steps = $$('.step');
  if (steps.length && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { steps.forEach(function (s) { s.classList.toggle('is-on', s === x.target); }); } }); }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { so.observe(s); });
  }

  /* ---------- FAQ side menu ---------- */
  var fnav = $$('.faqx__nav a');
  if (fnav.length && 'IntersectionObserver' in window) {
    var fo = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) fnav.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + x.target.id); }); }); }, { rootMargin: '-30% 0px -60% 0px' });
    $$('.faqx__group').forEach(function (g) { fo.observe(g); });
  }

  /* ---------- Journal: filter by topic (reads the label on each card, so new articles from the CMS work too) ---------- */
  var filter = $('.jfilter');
  if (filter) {
    var cards = $$('.jfeat__card, .jcard'), empty = $('.jempty');
    var topics = [];
    cards.forEach(function (c) { var t = $('.jcard__tag', c); var n = t ? t.textContent.trim() : ''; if (n && topics.indexOf(n) < 0) topics.push(n); });
    topics.forEach(function (t) { var b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.setAttribute('aria-pressed', 'false'); filter.appendChild(b); });
    filter.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', filter).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      var want = b.getAttribute('data-all') !== null ? '' : b.textContent.trim(), shown = 0;
      cards.forEach(function (c) { var t = $('.jcard__tag', c); var ok = !want || (t && t.textContent.trim() === want); c.hidden = !ok; if (ok) shown++; });
      if (empty) empty.style.display = shown ? 'none' : 'block';
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  }

  /* ---------- Article: table of contents from the headings, copy link ---------- */
  var body = $('.art-body'), toc = $('.toc ol');
  if (body && toc) {
    var hs = $$('h2', body);
    if (!hs.length) { var tw = $('.toc'); if (tw) tw.style.display = 'none'; }
    hs.forEach(function (h, i) {
      if (!h.id) h.id = (h.textContent || 'part').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || ('part-' + i);
      var li = document.createElement('li'), a = document.createElement('a'); a.href = '#' + h.id; a.textContent = h.textContent; li.appendChild(a); toc.appendChild(li);
    });
    if ('IntersectionObserver' in window) {
      var ta = $$('a', toc);
      var to = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) ta.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + x.target.id); }); }); }, { rootMargin: '-20% 0px -70% 0px' });
      hs.forEach(function (h) { to.observe(h); });
    }
  }
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var done = function () { var t = b.innerHTML; b.textContent = 'Link copied'; setTimeout(function () { b.innerHTML = t; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, done); else done();
    });
  });

  /* ---------- Motion (GSAP + Lenis when available, never for reduced motion) ---------- */
  if (reduce || !window.gsap) return;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  if (ST) gsap.registerPlugin(ST);
  if (window.Lenis && window.innerWidth >= 1024) {
    lenis = new window.Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    if (ST) lenis.on('scroll', ST.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0);
  }
  // hero entrance
  var hero = $('.phero, .art-hero');
  if (hero) gsap.from($$('.crumbs, .eyebrow, .phero__title, .jhero__title span, .art-hero h1, .lead, .art-meta, .art-hero .art__tag, .phero__actions, .phero__ui, .art-cover', hero),
    { y: 34, opacity: 0, duration: 1, ease: 'expo.out', stagger: .07, delay: .05, clearProps: 'transform,opacity' });
  if (!ST) return;
  $$('[data-reveal]').forEach(function (el) {
    var kids = el.hasAttribute('data-stagger') ? el.children : [el];
    gsap.from(kids, { y: 40, opacity: 0, duration: .9, ease: 'power3.out', stagger: .08, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
  });
  var cover = $('.art-cover img, .jfeat__media img');
  if (cover && window.innerWidth >= 1024) gsap.fromTo(cover, { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: cover, start: 'top bottom', end: 'bottom top', scrub: true } });
  window.addEventListener('load', function () { ST.refresh(); });
})();
