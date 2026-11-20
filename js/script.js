/* =====================================================================
   Talk Back — interactions & motion
   - Works without JavaScript (all content is in the HTML).
   - Smooth scrolling (Lenis) and all GSAP motion are skipped for
     prefers-reduced-motion.
   - Heavy effects (pinning, parallax, magnetic buttons) are desktop-only.
   ===================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var lenis = null;

  /* ---------- Year ---------- */
  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var nav = $('#nav'), toggle = $('#navToggle'), links = $('#navLinks');
  function setMenu(open) {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    $('.sr-only', toggle).textContent = open ? 'Close menu' : 'Open menu';
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (links.classList.contains('is-open') && !nav.contains(e.target)) setMenu(false);
  });

  /* ---------- Anchor links (smooth with Lenis when active) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (links.contains(a)) setMenu(false);
    if (!lenis || id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    history.replaceState(null, '', id);
  });

  /* ---------- Nav state on scroll ---------- */
  var lastY = window.scrollY, ticking = false;
  function onScroll() {
    var sy = window.scrollY;
    nav.classList.toggle('is-scrolled', sy > 20);
    if (!links.classList.contains('is-open')) {
      if (sy > 700 && sy > lastY + 6) nav.classList.add('is-hidden');
      else if (sy < lastY - 6 || sy < 700) nav.classList.remove('is-hidden');
    }
    lastY = sy; ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  nav.addEventListener('focusin', function () { nav.classList.remove('is-hidden'); });
  onScroll();

  /* ---------- Current section in nav ---------- */
  if ('IntersectionObserver' in window) {
    var map = {};
    $$('a[href^="#"]', links).forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || !map[en.target.id]) return;
        Object.keys(map).forEach(function (k) { map[k].classList.remove('is-current'); map[k].removeAttribute('aria-current'); });
        map[en.target.id].classList.add('is-current');
        map[en.target.id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) secObs.observe(el); });
  }

  /* ---------- FAQ: animated <details> ---------- */
  $$('.qa').forEach(function (item) {
    var sum = $('summary', item), body = $('.qa__body', item), anim = null;
    sum.addEventListener('click', function (e) {
      if (reduce.matches || !body.animate) return;
      e.preventDefault();
      if (anim) anim.cancel();
      var opening = !item.open;
      if (opening) item.open = true;
      var full = body.scrollHeight;
      anim = body.animate(
        [{ height: (opening ? 0 : full) + 'px', opacity: opening ? 0 : 1 },
         { height: (opening ? full : 0) + 'px', opacity: opening ? 1 : 0 }],
        { duration: 420, easing: 'cubic-bezier(.22,.8,.24,1)' });
      anim.onfinish = function () {
        anim = null;
        if (!opening) item.open = false;
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      };
    });
  });

  /* ---------- Card spotlight (follows the pointer) ---------- */
  $$('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Hub connector lines (desktop layout only) ---------- */
  function drawHub() {
    var hub = $('.hub'), svg = $('.hub__lines');
    if (!hub || !svg) return;
    svg.innerHTML = '';
    if (window.innerWidth < 1101) return;
    var core = $('.hub__core', hub), cx = core.offsetLeft, cy = core.offsetTop;
    var NS = 'http://www.w3.org/2000/svg';
    $$('.hub__node', hub).forEach(function (n, i) {
      var nx = n.offsetLeft + n.offsetWidth / 2, ny = n.offsetTop + n.offsetHeight / 2;
      var mx = (cx + nx) / 2, my = (cy + ny) / 2 + (i % 2 ? 40 : -40);
      var d = 'M' + cx + ',' + cy + ' Q' + mx + ',' + my + ' ' + nx + ',' + ny;
      var path = document.createElementNS(NS, 'path'); path.setAttribute('d', d); svg.appendChild(path);
      if (!reduce.matches) {
        var dot = document.createElementNS(NS, 'circle'); dot.setAttribute('r', '3.5');
        var am = document.createElementNS(NS, 'animateMotion');
        am.setAttribute('dur', (2.6 + i * .35) + 's'); am.setAttribute('repeatCount', 'indefinite'); am.setAttribute('path', d);
        dot.appendChild(am); svg.appendChild(dot);
      }
    });
  }
  drawHub();
  var hubTimer;
  window.addEventListener('resize', function () { clearTimeout(hubTimer); hubTimer = setTimeout(drawHub, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawHub);

  /* ---------- Text splitting helpers ---------- */
  function splitChars(el) {
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    // chars are grouped per word so lines only break between words
    el.innerHTML = text.split(' ').map(function (w) {
      return '<span class="wd" aria-hidden="true">' + w.split('').map(function (c) {
        return '<span class="ch">' + c + '</span>';
      }).join('') + '</span>';
    }).join(' ');
  }
  function splitWordsMasked(el) {
    var text = el.textContent.trim();
    el.innerHTML = text.split(/\s+/).map(function (w) {
      return '<span class="wm"><span class="wm__in">' + w + '</span></span>';
    }).join(' ');
  }

  /* =====================================================================
     Motion
     ===================================================================== */
  function motion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST || reduce.matches) {
      root.classList.remove('pre', 'motion'); root.classList.add('loaded');
      return;
    }
    gsap.registerPlugin(ST);

    /* Smooth scroll */
    if (window.Lenis) {
      lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* After any resize (incl. opening DevTools) re-measure everything and re-apply pins at the current scroll */
    ST.config({ ignoreMobileResize: true });
    /* Pause smooth scrolling while ScrollTrigger re-measures, otherwise Lenis pushes the page back
       mid-measurement and pinned sections get offset by the current scroll position */
    ST.addEventListener('refreshInit', function () { if (lenis) lenis.stop(); });
    ST.addEventListener('refresh', function () {
      if (lenis) { lenis.start(); lenis.resize(); }
      requestAnimationFrame(function () { ST.update(); window.dispatchEvent(new Event('scroll')); });
    });
    /* Re-measure once everything has loaded and the intro has finished (fixes reload mid-page) */
    var remeasure = function () { ST.refresh(); ST.update(); };
    if (document.readyState === 'complete') setTimeout(remeasure, 100); else window.addEventListener('load', function () { setTimeout(remeasure, 100); });
    setTimeout(remeasure, 2700);
    setTimeout(remeasure, 4000);
    if (location.hash && location.hash.length > 1) {
      setTimeout(function () {
        var tgt = document.querySelector(location.hash);
        if (!tgt) return;
        if (lenis) lenis.scrollTo(tgt, { offset: 0, duration: 1.2 }); else tgt.scrollIntoView();
      }, 2800);
    }
    var rsT;
    window.addEventListener('resize', function () {
      clearTimeout(rsT);
      rsT = setTimeout(function () { ST.refresh(); ST.update(); }, 250);
    });

    var once = function (trigger, start) {
      return { trigger: trigger, start: start || 'top 85%', end: 'bottom -100000px', once: true };
    };

    /* Split text once */
    $$('.hero .line__in').forEach(splitChars);
    $$('.h2__a, .h2__b, .cta__title').forEach(splitWordsMasked);
    var st = $('[data-words]');
    if (st) st.innerHTML = st.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');

    /* Scroll progress bar */
    gsap.to('.progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

    var mm = gsap.matchMedia();
    mm.add({
      desk: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      mob: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)'
    }, function (ctx) {
      var desk = ctx.conditions.desk;
      var cleanups = [];

      /* ---- Intro: loader curtain, then hero ---- */
      gsap.set('.hero .line__in', { yPercent: 0, y: 0 });
      var intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
      if ($('.loader') && !root.classList.contains('loaded')) {
        intro.from('.loader__mark', { scale: .4, rotate: -20, opacity: 0, duration: .6, ease: 'back.out(2)' })
             .from('.loader__word span', { yPercent: 110, duration: .6, stagger: .08 }, .1)
             .to('.loader', { yPercent: -100, duration: .9, ease: 'expo.inOut' }, .75)
             .add(function () { root.classList.add('loaded'); });
      } else {
        root.classList.add('loaded');
      }
      var h0 = intro.duration() ? intro.duration() - .35 : 0;
      intro
        .from('.hero .ch', { yPercent: 115, rotate: 8, opacity: 0, duration: 1.1, stagger: .018 }, h0)
        .from('.hero__cta', { y: 20, opacity: 0, duration: .9 }, h0 + .45)
        .from('.hero__right > *', { y: 24, opacity: 0, duration: 1, stagger: .1 }, h0 + .4)
        .from('.plus', { scale: 0, rotate: 90, duration: 1, stagger: .15 }, h0 + .5)
        .from('.app--hero', { y: 90, opacity: 0, duration: 1.4 }, h0 + .3)
        .from('.band__words span', { yPercent: 60, opacity: 0, duration: 1.2, stagger: .08 }, h0 + .7)
        .from('.app--hero .tile', { y: 20, opacity: 0, duration: .8, stagger: .07 }, h0 + .8)
        .from('.app--hero .app__spark i', { scaleY: 0, duration: .9, stagger: .06 }, h0 + .9)
        .from('.app--hero .tbl__row:not(.tbl__row--head)', { x: -14, opacity: 0, duration: .7, stagger: .08 }, h0 + 1)
        .from('.app--hero .feed li', { x: 14, opacity: 0, duration: .7, stagger: .1 }, h0 + 1.05)
        .from('.hfloat', { scale: .6, opacity: 0, duration: .9, stagger: .15, ease: 'back.out(1.8)' }, h0 + 1.2);
      root.classList.remove('pre');

      $$('.app--hero [data-count]').forEach(function (el) {
        var o = { v: 0 }, end = +el.dataset.count;
        intro.to(o, { v: end, duration: 1.4, ease: 'power2.out', onUpdate: function () { el.textContent = Math.round(o.v); } }, h0 + .9);
      });

      /* Dashboard: tilted, flattens as it scrolls into place (ends at identity, so text stays crisp) */
      if (desk) {
        gsap.fromTo('.app--hero', { rotateX: 16, scale: .92, transformPerspective: 1800 },
          { rotateX: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.hero__stage', start: 'top 85%', end: 'top 12%', scrub: 1 } });
        gsap.fromTo('.band__words', { xPercent: 1.5 }, { xPercent: -1.5, ease: 'none', scrollTrigger: { trigger: '.hero__stage', start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.to('.band__beam', { yPercent: -30, scale: 1.2, ease: 'none', scrollTrigger: { trigger: '.hero__stage', start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.to('.glow--a', { y: 160, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('.glow--b', { y: 80, x: -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

        // floating chips: idle float + follow the pointer a little
        gsap.to('.hfloat--a', { y: -10, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to('.hfloat--b', { y: 12, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        var qa = [gsap.quickTo('.hfloat--a', 'x', { duration: .8 }), gsap.quickTo('.hfloat--b', 'x', { duration: 1 })];
        var onMove = function (e) {
          var dx = (e.clientX / window.innerWidth - .5);
          qa[0](dx * -30); qa[1](dx * 40);
        };
        window.addEventListener('pointermove', onMove);
        cleanups.push(function () { window.removeEventListener('pointermove', onMove); });
      }

      /* ---- Statement: pinned, centred stage. 8 cards fly in from the edges while the sentence colours in ---- */
      var chips = $$('.sc');
      if (desk) {
        var stl = gsap.timeline({
          scrollTrigger: { trigger: '.statement__stage', start: 'top top', end: '+=120%', pin: true, scrub: 1, anticipatePin: 1 }
        });
        chips.forEach(function (c, i) {
          var left = c.offsetLeft + c.offsetWidth / 2 < window.innerWidth / 2;
          var top = c.offsetTop + c.offsetHeight / 2 < c.parentNode.offsetHeight / 2;
          stl.from(c, { x: (left ? -1 : 1) * (260 + (i % 3) * 60), y: (top ? -1 : 1) * 180, rotate: (left ? -1 : 1) * 24, scale: .55, opacity: 0, ease: 'power3.out', duration: 1 }, i * .12);
        });
        stl.fromTo('.statement__text .w', { color: '#c9d7fb' }, { color: '#1458f0', stagger: .06, ease: 'none', duration: .6 }, .15)
           .from('.statement__inner .eyebrow', { y: 20, opacity: 0, duration: .5 }, 0)
           .from('.statement__sub, .statement .pill', { y: 30, opacity: 0, stagger: .1, duration: .6 }, 1.2)
           .to({}, { duration: .4 });
      } else {
        gsap.fromTo('.statement__text .w', { color: '#c9d7fb' }, {
          color: '#1458f0', stagger: .05, ease: 'none',
          scrollTrigger: { trigger: '.statement__text', start: 'top 85%', end: 'bottom 55%', scrub: true }
        });
        gsap.from(chips, { y: 24, scale: .8, opacity: 0, duration: .8, stagger: .08, ease: 'back.out(2)', scrollTrigger: once('.statement__chips', 'top 90%') });
        gsap.from('.statement__sub, .statement .pill', { y: 24, opacity: 0, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: once('.statement__sub', 'top 92%') });
      }

      /* ---- Comment stream: endless 3D marquee whose speed and direction follow your scroll ---- */
      var tracks = $$('.stream__track');
      var loops = tracks.map(function (t, i) {
        return gsap.fromTo(t, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: i ? 46 : 40, ease: 'none', repeat: -1 });
      });
      var speed = { v: 1, base: 1 };
      ST.create({
        trigger: '.stream', start: 'top bottom', end: 'bottom top',
        onUpdate: function (self) {
          speed.base = self.direction;
          var boost = self.direction * (1 + Math.min(Math.abs(self.getVelocity()) / 300, 6));
          if (Math.abs(boost) > Math.abs(speed.v) || Math.sign(boost) !== Math.sign(speed.v)) speed.v = boost;
        }
      });
      var tick = function () {
        speed.v += (speed.base - speed.v) * .05;
        loops.forEach(function (l) { l.timeScale(speed.v); });
      };
      gsap.ticker.add(tick);
      cleanups.push(function () { gsap.ticker.remove(tick); });
      gsap.from('.stream__row', { x: function (i) { return i ? 260 : -260; }, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.stream', start: 'top bottom', end: 'top 45%', scrub: true } });
      gsap.from('.stream__cap', { y: 20, opacity: 0, duration: .9, ease: 'expo.out', scrollTrigger: once('.stream__cap', 'top 92%') });

      /* ---- Section headings: word masks rise ---- */
      $$('.head').forEach(function (h) {
        var t = gsap.timeline({ scrollTrigger: once(h, 'top 85%') });
        t.from($$('.eyebrow', h), { y: 16, opacity: 0, duration: .8, ease: 'expo.out' })
         .from($$('.wm__in', h), { yPercent: 110, duration: 1.1, stagger: .05, ease: 'expo.out' }, .05);
      });

      /* ---- Feature cards: rise in, UI sits tilted in 3D and follows the pointer ---- */
      $$('.card').forEach(function (card, i) {
        var ui = $('.card__ui > .mini', card);
        var rest = { rx: 0, ry: 0 };
        if (desk && ui) gsap.set(ui, { rotationX: rest.rx, rotationY: rest.ry, transformPerspective: 1400 });
        var t = gsap.timeline({ scrollTrigger: once(card, 'top 85%'), defaults: { ease: 'expo.out' } });
        t.from(card, { y: 90, opacity: 0, scale: .95, duration: 1.2, delay: (i % 2) * .08 })
         .from($$('.card__badge, .card__text h3, .card__text p, .card__chips li, .card__text .pill', card), { y: 20, opacity: 0, duration: .8, stagger: .06 }, .2)
         .from($$('.card__ui', card), { clipPath: 'inset(10% 10% 10% 10% round 40px)', duration: 1.3 }, .1);
        var minis = $$('.mini, .ucard', card);
        if (minis.length) t.from(minis, { y: 60, opacity: 0, duration: 1.1, stagger: .08 }, .3);
        var rws = $$('.ctbl__row:not(.ctbl__row--head), .conn__row, .conn__btn, .draft__foot', card);
        if (rws.length) t.from(rws, { y: 12, opacity: 0, duration: .6, stagger: .06 }, .5);
        var tags = $$('.scene-tag', card);
        if (tags.length) t.from(tags, { y: -14, opacity: 0, duration: .7 }, .6);
        var ovl = $$('.ovl', card);
        if (ovl.length) t.from(ovl, { scale: .6, opacity: 0, duration: .9, ease: 'back.out(2.2)', stagger: .1 }, .9);
        if (desk && ui) {
          gsap.fromTo(ui, { y: 30 }, { y: -30, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
          if (finePointer.matches) {
            var qrx = gsap.quickTo(ui, 'rotationX', { duration: .7, ease: 'power3' }), qry = gsap.quickTo(ui, 'rotationY', { duration: .7, ease: 'power3' });
            var mv = function (e) {
              var r = card.getBoundingClientRect();
              qry(((e.clientX - r.left) / r.width - .5) * 10);
              qrx(-((e.clientY - r.top) / r.height - .5) * 8);
            };
            var lv = function () { qrx(rest.rx); qry(rest.ry); };
            card.addEventListener('pointermove', mv); card.addEventListener('pointerleave', lv);
            cleanups.push(function () { card.removeEventListener('pointermove', mv); card.removeEventListener('pointerleave', lv); });
          }
        }
      });

      // Assignment demo: the unassigned video gets an owner
      var row = $('[data-assign-row]');
      if (row) {
        var name = $('[data-assign-name]', row), sel = $('[data-assign-select]', row), tag = $('[data-assign-tag]', row);
        var una = $('[data-unassigned]'), asg = $('[data-assigned]');
        gsap.timeline({ scrollTrigger: once(row, 'top 75%'), delay: 1.2 })
          .add(function () { sel.classList.add('is-flash'); })
          .add(function () {
            name.textContent = 'Ana M.'; sel.classList.remove('is-flash');
            tag.textContent = 'Assigned'; tag.className = 'tag tag--blue';
            una.textContent = '0'; asg.textContent = '4';
          }, '+=.8')
          .from(tag, { scale: .6, duration: .6, ease: 'back.out(3)' });
      }

      /* ---- "…and more": giant MORE / INSIDE words slide, cards pop in ---- */
      if ($('.more2')) {
        gsap.fromTo('.more2__giant span:first-child', { xPercent: -14 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: '.more2', start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.fromTo('.more2__giant span:last-child', { xPercent: 14 }, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '.more2', start: 'top bottom', end: 'bottom top', scrub: true } });
        var mt = gsap.timeline({ scrollTrigger: once('.more2', 'top 70%'), defaults: { ease: 'expo.out' } });
        mt.fromTo('.more2__title span', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, stagger: .07 })
          .fromTo('.more2__list li', { y: 70, scale: .85, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1.1, stagger: .09 }, .3)
          .fromTo('.more2__list .more__ic', { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: .9, stagger: .09, ease: 'back.out(2.4)' }, .6);
      }

      /* ---- Benefits: stacked sticky cards ---- */
      var cards = $$('.stack__card');
      if (desk) {
        cards.forEach(function (card, i) {
          if (i === cards.length - 1) return;
          var trig = { trigger: cards[i + 1], start: 'top 85%', end: 'top 150px', scrub: true };
          gsap.to(card, { scale: .92 - (cards.length - 2 - i) * .02, ease: 'none', scrollTrigger: trig });
          gsap.to(card.children, { opacity: .3, ease: 'none', scrollTrigger: trig });
        });
      }
      cards.forEach(function (card) {
        gsap.from($$('.stack__ui .mini', card), { y: 60, rotate: 3, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: once(card, 'top 70%') });
        gsap.from($$('.ticks li', card), { x: -16, opacity: 0, duration: .7, stagger: .08, ease: 'expo.out', scrollTrigger: once(card, 'top 65%') });
      });

      // Draft reply types itself
      var typed = $('[data-type]');
      if (typed) {
        var full = typed.dataset.type, box = typed.closest('.compose__box');
        typed.textContent = '';
        var tw = { n: 0 };
        gsap.to(tw, {
          n: full.length, duration: 2.6, ease: 'none',
          scrollTrigger: once(box, 'top 75%'),
          onStart: function () { box.classList.add('typing'); },
          onUpdate: function () { typed.textContent = full.slice(0, Math.round(tw.n)); },
          onComplete: function () { setTimeout(function () { box.classList.remove('typing'); }, 1200); }
        });
        cleanups.push(function () { typed.textContent = full; });
      }

      /* ---- How it works: dark arc stage. Pinned on desktop; scrolling walks the 5 steps along the arc ---- */
      var flow = $('.flow');
      if (flow && desk) {
        flow.classList.add('is-arc');
        cleanups.push(function () { flow.classList.remove('is-arc'); });
        var fNodes = $$('.flow__node', flow), fPanels = $$('.flow__panel', flow), fTabs = $$('.flow__tab', flow);
        var prog = $('.arc--progress', flow), head = $('.arc__head', flow), len = prog.getTotalLength();
        gsap.set(prog, { strokeDasharray: len, strokeDashoffset: len });
        var current = -1;
        var setStep = function (i) {
          if (i === current) return;
          var prev = current; current = i;
          fNodes.forEach(function (n, k) { n.classList.toggle('is-on', k === i); n.classList.toggle('is-done', k < i); });
          fTabs.forEach(function (t, k) { t.classList.toggle('is-on', k === i); });
          fPanels.forEach(function (p, k) { p.classList.toggle('is-on', k === i); });
          var panel = fPanels[i];
          if (panel && prev !== -1) {
            gsap.fromTo($$('.flow__step, h3, .flow__desc', panel), { y: i > prev ? 26 : -26, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: .7, stagger: .06, ease: 'expo.out', overwrite: true });
            var fui = $('.flow__ui', panel);
            if (fui) {
              gsap.fromTo(fui, { y: 36, scale: .97, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .8, ease: 'expo.out', delay: .12, overwrite: true });
              gsap.fromTo($$('.mini > *', fui), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .07, delay: .3, ease: 'power3.out', overwrite: true });
            }
            var dot = $('.flow__dot', fNodes[i]);
            if (dot) gsap.fromTo(dot, { rotate: -25 }, { rotate: 0, duration: .8, ease: 'back.out(3)' });
          }
        };
        setStep(0);
        var fst = ST.create({
          trigger: flow, pin: '.flow__pin', start: 'top 92px', end: '+=320%', scrub: true, anticipatePin: 1,
          onUpdate: function (self) {
            var p = Math.min(1, self.progress * 1.04);
            gsap.set(prog, { strokeDashoffset: len * (1 - p) });
            var pt = prog.getPointAtLength(len * p);
            head.setAttribute('cx', pt.x); head.setAttribute('cy', pt.y);
            var i = Math.min(fNodes.length - 1, Math.floor(self.progress * fNodes.length));
            setStep(i);
            var within = self.progress * fNodes.length - i;
            fTabs.forEach(function (t, k) { $('.flow__tabbar', t).style.transform = 'scaleX(' + (k < i ? 1 : k === i ? Math.min(1, within) : 0) + ')'; });
          }
        });
        // clicking a node scrolls to that step
        $$('[data-go]', flow).forEach(function (btn) {
          var go = function () {
            var i = +btn.dataset.go, y = fst.start + (fst.end - fst.start) * ((i + .5) / fNodes.length);
            if (lenis) lenis.scrollTo(y, { duration: 1.2 }); else window.scrollTo(0, y);
          };
          btn.addEventListener('click', go);
          cleanups.push(function () { btn.removeEventListener('click', go); });
        });
        // entrance: arcs draw, nodes and chips pop in along them
        var ft = gsap.timeline({ scrollTrigger: once(flow, 'top 70%'), defaults: { ease: 'expo.out' } });
        var outer = $('.arc--outer', flow), olen = outer.getTotalLength();
        ft.fromTo(outer, { strokeDasharray: olen, strokeDashoffset: olen }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' })
          .fromTo('.arc--inner', { opacity: 0 }, { opacity: 1, duration: 1 }, .5)
          .fromTo('.flow__node button', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .9, stagger: .14, ease: 'back.out(2)' }, .3)
          .fromTo('.flow__tab', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .06 }, .7)
          .fromTo('.fd', { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: .8, stagger: .08, ease: 'back.out(2)' }, .7)
          .fromTo('.flow__center', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, .6);
        // gentle floating of the decorative chips
        $$('.fd', flow).forEach(function (d, i) {
          gsap.to(d, { y: (i % 2 ? 6 : -6), duration: 2.4 + (i % 3) * .4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        });
        gsap.to('.flow__glow', { scale: 1.25, opacity: .8, ease: 'none', scrollTrigger: { trigger: flow, start: 'top 92px', end: '+=320%', scrub: true } });
      } else if (flow) {
        $$('.flow__panel').forEach(function (p) {
          gsap.from(p, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: once(p) });
        });
      }

      /* Giant words behind the comment stream slide in opposite directions */
      gsap.fromTo('.stream__giant span:first-child', { xPercent: -18 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: '.stream', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('.stream__giant span:last-child', { xPercent: 18 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: '.stream', start: 'top bottom', end: 'bottom top', scrub: true } });

      /* ---- Roles: smooth fade-up, ticks follow in the same timeline ---- */
      (function () {
        var roles = $$('.roles__grid .role');
        if (!roles.length) return;
        gsap.set(roles, { y: 48, opacity: 0, force3D: true });
        gsap.set($$('.roles__grid .role .role__top, .role .role__body > *'), { y: 16, opacity: 0 });
        gsap.set($$('.roles__grid .role .ticks li'), { y: 10, opacity: 0 });
        var rt = gsap.timeline({ scrollTrigger: once('.roles__grid', 'top 82%'), defaults: { ease: 'power3.out' },
          onComplete: function () { gsap.set(roles, { clearProps: 'transform,opacity,willChange' }); } });
        rt.to(roles, { y: 0, opacity: 1, duration: .9, stagger: .12 })
          .to($$('.roles__grid .role .role__top, .role .role__body > *'), { y: 0, opacity: 1, duration: .7, stagger: .05 }, .15)
          .to($$('.roles__grid .role .ticks li'), { y: 0, opacity: 1, duration: .5, stagger: .035 }, .35);
      })();

      /* ---- Audience ---- */
      gsap.from('.aud li', { y: 70, opacity: 0, duration: 1.1, stagger: .1, ease: 'expo.out', scrollTrigger: once('.aud') });
      gsap.from('.aud__art > *', { scale: .5, opacity: 0, duration: .9, stagger: .05, ease: 'back.out(2)', scrollTrigger: once('.aud', 'top 75%') });

      /* ---- FAQ ---- */
      gsap.from('.qa', { y: 30, opacity: 0, duration: .9, stagger: .07, ease: 'expo.out', scrollTrigger: once('.faq__list') });

      /* ---- CTA ---- */
      var ct = gsap.timeline({ scrollTrigger: once('.cta__band', 'top 80%'), defaults: { ease: 'expo.out' } });
      ct.fromTo('.cta__band', { clipPath: 'inset(8% 6% 8% 6% round 60px)' }, { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.4 })
        .from('.cta__title .wm__in', { yPercent: 110, duration: 1.1, stagger: .04 }, .2)
        .from('.cta__copy > p, .cta__actions', { y: 24, opacity: 0, duration: .9, stagger: .08 }, .5)
        .from('.mini--signin', { y: 80, rotate: 4, opacity: 0, duration: 1.2 }, .35)
        .from('.toast', { y: 20, scale: .8, opacity: 0, duration: .8, ease: 'back.out(2)' }, 1);
      if (desk) gsap.to('.mini--signin', { y: -40, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });

      /* ---- Footer wordmark ---- */
      gsap.from('.wordmark span', { yPercent: 105, duration: 1.2, stagger: .05, ease: 'expo.out', scrollTrigger: once('.wordmark', 'top 98%') });

      /* ---- Magnetic buttons (desktop, fine pointer) ---- */
      if (desk && finePointer.matches) {
        $$('.pill').forEach(function (b) {
          var qx = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' }), qy = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
          var mv = function (e) { var r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .22); qy((e.clientY - r.top - r.height / 2) * .35); };
          var lv = function () { qx(0); qy(0); };
          b.addEventListener('pointermove', mv); b.addEventListener('pointerleave', lv);
          cleanups.push(function () { b.removeEventListener('pointermove', mv); b.removeEventListener('pointerleave', lv); });
        });
      }
      // sections were reordered: let ScrollTrigger recalc pins top-to-bottom
      ST.sort(); ST.refresh();
      return function () { cleanups.forEach(function (f) { f(); }); };
    });

    // Fonts can change layout after load; re-measure pinned sections once they're ready
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
  }

  if (window.gsap) motion();
  else window.addEventListener('load', motion);
})();

/* ---------- Roles swimlanes: draw connectors between the boxes ---------- */
(function () {
  var wrap = document.querySelector('[data-lanes]');
  if (!wrap) return;
  var body = wrap.querySelector('.lanes__body'), svg = wrap.querySelector('.lanes__svg');
  var NS = 'http://www.w3.org/2000/svg';
  var edges = [
    { a: 'ln-connect', b: 'ln-users', k: 'flow', t: 'h' },
    { a: 'ln-users', b: 'ln-assign', k: 'flow', t: 'h' },
    { a: 'ln-assign', b: 'ln-see', k: 'flow', t: 'v', tag: 'assign' },
    { a: 'ln-see', b: 'ln-draft', k: 'flow', t: 'h' },
    { a: 'ln-draft', b: 'ln-submit', k: 'flow', t: 'h' },
    { a: 'ln-submit', b: 'ln-review', k: 'flow', t: 'v', tag: 'submit' },
    { a: 'ln-review', b: 'ln-post', k: 'ok', t: 'h' },
    { a: 'ln-review', b: 'ln-draft', k: 'no', t: 'reject', tag: 'reject' }
  ];
  var marker = { flow: 'url(#lnArrow)', ok: 'url(#lnArrowOk)', no: 'url(#lnArrowNo)' };
  var drawn = false;

  function box(id, base) {
    var r = document.getElementById(id).getBoundingClientRect();
    return { l: r.left - base.left, r: r.right - base.left, t: r.top - base.top, b: r.bottom - base.top, cx: (r.left + r.right) / 2 - base.left, cy: (r.top + r.bottom) / 2 - base.top, w: r.width };
  }

  function draw() {
    if (getComputedStyle(svg).display === 'none') return;
    var base = body.getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + base.width + ' ' + base.height);
    Array.prototype.slice.call(svg.querySelectorAll('path.ln, circle.pk')).forEach(function (p) { p.remove(); });
    var reduceM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    edges.forEach(function (e, ei) {
      var A = box(e.a, base), B = box(e.b, base), d, mid;
      if (e.t === 'h') {
        d = 'M ' + (A.r + 3) + ' ' + A.cy + ' L ' + (B.l - 4) + ' ' + B.cy;
        mid = [(A.r + B.l) / 2, A.cy];
      } else if (e.t === 'v') {
        var down = B.cy > A.cy, x = A.cx;
        var y1 = down ? A.b + 3 : A.t - 3, y2 = down ? B.t - 4 : B.b + 4;
        d = 'M ' + x + ' ' + y1 + ' L ' + x + ' ' + y2;
        mid = [x, (y1 + y2) / 2];
      } else {
        var sx = A.l + A.w * .22, sy = A.b + 3, ex = B.l + B.w * .78, ey = B.t - 4;
        d = 'M ' + sx + ' ' + sy + ' C ' + sx + ' ' + (sy + 40) + ' ' + ex + ' ' + (ey - 40) + ' ' + ex + ' ' + ey;
        mid = [(sx + ex) / 2, (sy + ey) / 2];
      }
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d); p.setAttribute('class', 'ln ln--' + e.k); p.setAttribute('marker-end', marker[e.k]);
      p.setAttribute('id', 'lnp-' + ei);
      svg.appendChild(p);
      var plen = p.getTotalLength ? p.getTotalLength() : 100;
      if (!reduceM && plen > 50) {
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('r', '5'); c.setAttribute('class', 'pk pk--' + e.k);
        var am = document.createElementNS(NS, 'animateMotion');
        am.setAttribute('dur', (e.t === 'reject' ? 2.4 : 1.8) + 's'); am.setAttribute('repeatCount', 'indefinite');
        am.setAttribute('begin', (-ei * 0.45) + 's'); am.setAttribute('calcMode', 'spline'); am.setAttribute('keyTimes', '0;1'); am.setAttribute('keySplines', '.45 0 .25 1');
        var mp = document.createElementNS(NS, 'mpath'); mp.setAttribute('href', '#lnp-' + ei);
        am.appendChild(mp); c.appendChild(am); svg.appendChild(c);
      }
      if (e.tag) {
        var tag = wrap.querySelector('[data-tag="' + e.tag + '"]');
        var dx = e.tag === 'reject' ? -18 : (e.tag === 'submit' ? 52 : -50);
        tag.style.left = (mid[0] + dx) + 'px'; tag.style.top = mid[1] + 'px';
      }
    });
    if (!drawn) { drawn = true; reveal(); }
  }

  function reveal() {
    var paths = svg.querySelectorAll('path.ln');
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!window.gsap || !window.ScrollTrigger || reduce) { wrap.classList.add('is-drawn'); return; }
    var nodes = wrap.querySelectorAll('.lane__who, .lnode');
    gsap.set(nodes, { y: 18, opacity: 0 });
    gsap.set(paths, { opacity: 0 });
    gsap.timeline({ scrollTrigger: { trigger: wrap, start: 'top 78%', once: true } })
      .to(nodes, { y: 0, opacity: 1, duration: .6, stagger: .05, ease: 'power3.out' })
      .to(paths, { opacity: 1, duration: .5, stagger: .08 }, .4)
      .add(function () { draw(); wrap.classList.add('is-drawn'); });
  }

  var order = ['ln-connect', 'ln-users', 'ln-assign', 'ln-see', 'ln-draft', 'ln-submit', 'ln-review', 'ln-post'], live = 0;
  if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    setInterval(function () {
      order.forEach(function (id, k) { var el = document.getElementById(id); if (el) el.classList.toggle('is-live', k === live); });
      live = (live + 1) % order.length;
    }, 1100);
  }

  var t;
  function later() { clearTimeout(t); t = setTimeout(draw, 80); }
  window.addEventListener('resize', later);
  if (window.ResizeObserver) new ResizeObserver(later).observe(body);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  window.addEventListener('load', draw);
  draw();
})();
