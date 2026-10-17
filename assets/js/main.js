(function () {
  'use strict';

  var P = window.PROFILE || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 개인 정보 반영 ---------- */
  function applyProfile() {
    var name = (P.name || '').trim();
    var label = name || 'Portfolio';
    $$('[data-profile="logo"]').forEach(function (el) { el.innerHTML = name ? name + '<small>' + (P.role || '') + '</small>' : 'Portfolio'; });
    $$('[data-profile="loader"]').forEach(function (el) { el.textContent = name ? name + ' — Portfolio' : 'Portfolio'; });
    $$('[data-profile="role"]').forEach(function (el) { if (P.role) el.textContent = P.role; });
    $$('[data-profile="copy"]').forEach(function (el) { el.textContent = '© ' + new Date().getFullYear() + ' ' + label; });
    if (P.intro && P.intro.trim()) $$('[data-profile="intro"]').forEach(function (el) { el.textContent = P.intro.trim(); });
    if (name) document.title = name + ' · ' + (P.role || 'Web Publisher') + ' Portfolio';

    var box = $('[data-profile="links"]');
    if (!box) return;
    var links = [];
    if (P.email) links.push({ href: 'mailto:' + P.email, text: P.email, primary: true });
    if (P.github) links.push({ href: P.github, text: 'GitHub ↗', ext: true });
    if (P.blog) links.push({ href: P.blog, text: 'Blog ↗', ext: true });
    if (P.phone) links.push({ href: 'tel:' + P.phone.replace(/[^0-9+]/g, ''), text: P.phone });
    if (!links.length) { box.remove(); return; }
    links.forEach(function (l) {
      var a = document.createElement('a');
      a.className = 'link-box' + (l.primary ? ' is-primary' : '');
      a.href = l.href;
      if (l.ext) { a.target = '_blank'; a.rel = 'noopener'; }
      a.innerHTML = '<span>' + l.text + '</span>';
      box.appendChild(a);
    });
  }
  applyProfile();

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || reduced) { var ld = $('.se-loader'); if (ld) ld.remove(); return; }

  gsap.registerPlugin(ScrollTrigger, SplitText);
  var INK = '#111214';
  var html = document.documentElement;

  /* ---------- 커서 ---------- */
  function initCursor() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var c = $('.se-cursor'), label = $('.cursor-label', c);
    var xTo = gsap.quickTo(c, 'x', { duration: .45, ease: 'power3' });
    var yTo = gsap.quickTo(c, 'y', { duration: .45, ease: 'power3' });
    var shown = false;
    window.addEventListener('mousemove', function (e) {
      if (!shown) { shown = true; gsap.to(c, { opacity: 1, duration: .3 }); gsap.set(c, { x: e.clientX, y: e.clientY }); }
      xTo(e.clientX); yTo(e.clientY);
    });
    document.addEventListener('mouseleave', function () { gsap.to(c, { opacity: 0, duration: .3 }); shown = false; });

    $$('[data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        label.textContent = el.dataset.cursor;
        c.classList.add('is-label');
        gsap.to(c, { width: 104, height: 104, marginLeft: -52, marginTop: -52, backgroundColor: el.dataset.ac || '#ff5b14', duration: .45, ease: 'expo.out' });
        gsap.to(label, { opacity: 1, color: el.dataset.bg || '#fff', duration: .3 });
      });
      el.addEventListener('mouseleave', function () {
        c.classList.remove('is-label');
        gsap.to(c, { width: 14, height: 14, marginLeft: -7, marginTop: -7, backgroundColor: '#ffffff', duration: .45, ease: 'expo.out' });
        gsap.to(label, { opacity: 0, duration: .2 });
      });
    });
    $$('.menu-box, .header-logo, .link-box').forEach(function (el) {
      el.addEventListener('mouseenter', function () { gsap.to(c, { scale: 2.6, duration: .35 }); });
      el.addEventListener('mouseleave', function () { gsap.to(c, { scale: 1, duration: .35 }); });
    });
  }

  /* ---------- 자석 버튼 ---------- */
  function initMagnets() {
    if (!matchMedia('(hover: hover)').matches) return;
    $$('.link-box').forEach(function (el) {
      var inner = $('span', el);
      var xTo = gsap.quickTo(el, 'x', { duration: .6, ease: 'power3' }), yTo = gsap.quickTo(el, 'y', { duration: .6, ease: 'power3' });
      var ixTo = gsap.quickTo(inner, 'x', { duration: .6, ease: 'power3' }), iyTo = gsap.quickTo(inner, 'y', { duration: .6, ease: 'power3' });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * .35); yTo(dy * .35); ixTo(dx * .15); iyTo(dy * .15);
      });
      el.addEventListener('mouseleave', function () {
        gsap.to([el, inner], { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, .35)' });
      });
    });
  }

  /* ---------- 글자 굴리기 (SplitText) ---------- */
  function makeRoll(el, trigger) {
    var label = el.textContent;
    el.textContent = '';
    var box = document.createElement('span');
    box.className = 'roll-box';
    box.innerHTML = '<span class="roll-text"></span><span class="roll-text" aria-hidden="true"></span>';
    box.children[0].textContent = label;
    box.children[1].textContent = label;
    el.appendChild(box);
    var a = SplitText.create(box.children[0], { type: 'chars' }).chars;
    var b = SplitText.create(box.children[1], { type: 'chars' }).chars;
    gsap.set(b, { yPercent: 100 });
    var tl = gsap.timeline({ paused: true, defaults: { duration: .5, ease: 'power3.inOut', stagger: .025 } });
    tl.to(a, { yPercent: -100 }, 0).to(b, { yPercent: 0 }, 0);
    (trigger || el).addEventListener('mouseenter', function () { tl.timeScale(1).play(); });
    (trigger || el).addEventListener('mouseleave', function () { tl.timeScale(1.4).reverse(); });
  }
  function initRolls(mm) {
    mm.add('(hover: hover)', function () {
      $$('.menu-box').forEach(function (el) { makeRoll(el); });
      $$('.archive-wrap').forEach(function (row) { makeRoll($('.archive-name', row), row); });
    });
  }

  /* ---------- 내비게이션 ---------- */
  function initNav() {
    var nav = $('.se-header');
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: function (s) {
        var y = s.scroll();
        nav.classList.toggle('is-scrolled', y > 40);
        gsap.to(nav, { yPercent: (s.direction === 1 && y > 500) ? -100 : 0, duration: .4, ease: 'power3.out', overwrite: 'auto' });
      }
    });
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        var t = id === '#top' ? document.body : $(id);
        if (!t) return;
        e.preventDefault();
        window.scrollTo({ top: id === '#top' ? 0 : t.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
      });
    });
  }

  /* ---------- 히어로 ---------- */
  var heroSplit;
  function heroIntro() {
    heroSplit = SplitText.create('.hero-line', { type: 'chars' });
    var tl = gsap.timeline();
    tl.from(heroSplit.chars, { yPercent: 115, rotate: 6, duration: 1.1, stagger: .028, ease: 'power4.out' })
      .from('.hero-kicker', { y: 20, autoAlpha: 0, duration: .7, ease: 'power3.out' }, .1)
      .from('.hero-sub', { y: 28, autoAlpha: 0, duration: .9, ease: 'power3.out' }, .45)
      .from('.thumb-box', { y: 120, scale: .7, autoAlpha: 0, rotate: function () { return gsap.utils.random(-10, 10); }, duration: 1.3, stagger: .09, ease: 'expo.out' }, .2)
      .from('.group-header > *, .scroll-area', { y: -16, autoAlpha: 0, duration: .7, stagger: .08, ease: 'power3.out' }, .5);
    return tl;
  }

  function initHeroScroll() {
    gsap.to('.group-hero', { yPercent: -22, autoAlpha: .15, ease: 'none', scrollTrigger: { trigger: '.se-hero', start: 'top top', end: 'bottom top', scrub: true } });
    $$('.thumb-box').forEach(function (t) {
      var d = parseFloat(t.dataset.depth) || 1;
      gsap.to(t, { y: -160 * d, ease: 'none', scrollTrigger: { trigger: '.se-hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
    if (matchMedia('(hover: hover)').matches) {
      var movers = $$('.thumb-box img').map(function (img) {
        var d = parseFloat(img.parentNode.dataset.depth) || 1;
        return { d: d, x: gsap.quickTo(img.parentNode, 'x', { duration: 1, ease: 'power3' }), r: gsap.quickTo(img.parentNode, 'rotation', { duration: 1, ease: 'power3' }) };
      });
      $('.se-hero').addEventListener('mousemove', function (e) {
        var nx = e.clientX / window.innerWidth - .5;
        movers.forEach(function (m) { m.x(nx * 60 * m.d); m.r(nx * 6 * m.d); });
      });
    }
  }

  /* ---------- 마키 ---------- */
  function initMarquee() {
    var track = $('.group-marquee'), group = $('.marquee-area', track);
    track.appendChild(group.cloneNode(true));
    var tween = gsap.to(track, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });
    var boost = 1;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: function (s) { boost = Math.max(boost, 1 + Math.min(Math.abs(s.getVelocity()) / 220, 7)); }
    });
    gsap.ticker.add(function () {
      boost += (1 - boost) * .06;
      tween.timeScale(boost);
    });
    gsap.from('.se-marquee', { yPercent: 40, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.se-marquee', start: 'top 95%' } });
  }

  /* ---------- 소개 ---------- */
  function initAbout() {
    var s = SplitText.create('.about-text', { type: 'words', wordsClass: 'word' });
    gsap.to(s.words, { color: INK, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.about-text', start: 'top 82%', end: 'bottom 45%', scrub: true } });

    gsap.from('.stat-box', { y: 50, autoAlpha: 0, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.stat-area', start: 'top 85%' } });
    $$('.stat-num').forEach(function (el) {
      var to = +el.dataset.to;
      var o = { v: 0 };
      el.textContent = '0';
      gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: '.stat-area', start: 'top 85%', once: true }, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
  }

  /* ---------- 공통 제목 ---------- */
  function revealTitle(sel) {
    $$(sel).forEach(function (el) {
      var s = SplitText.create(el, { type: 'lines,chars', mask: 'lines' });
      gsap.from(s.chars, { yPercent: 110, duration: 1, stagger: .022, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
  }

  /* ---------- 프로젝트 ---------- */
  function initWork(mm) {
    var work = $('.se-work'), track = $('.project-area'), panels = $$('.project-wrap');
    var bar = $('.progress-area i'), cur = $('.work-current');
    var DEF = { '--wbg': getComputedStyle(html).getPropertyValue('--bg').trim() || '#f3f2ee', '--wfg': INK, '--wac': '#ff5b14' };
    var active = -1;
    function colorTo(i) {
      var p = panels[i];
      var v = p ? { '--wbg': p.dataset.bg, '--wfg': p.dataset.fg, '--wac': p.dataset.ac } : DEF;
      gsap.to(work, Object.assign({ duration: .7, ease: 'power2.out', overwrite: 'auto' }, v));
    }

    mm.add('(min-width: 900px)', function () {
      var pin = $('.group-work');
      gsap.set(pin, { minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' });
      var dist = function () { return track.scrollWidth - window.innerWidth; };

      var hz = gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: {
          trigger: pin, start: 'top top', end: function () { return '+=' + dist(); },
          pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function (s) { gsap.set(bar, { scaleX: s.progress }); }
        }
      });

      ScrollTrigger.create({
        trigger: work, start: 'top 55%', end: 'bottom 45%',
        onToggle: function (s) { if (s.isActive) { colorTo(Math.max(active, 0)); } else { colorTo(-1); } }
      });

      panels.forEach(function (p, i) {
        var media = $('.media-box', p), img = $('img', media), info = $$('.info-box > *', p);
        ScrollTrigger.create({
          trigger: p, containerAnimation: hz, start: 'left 55%', end: 'right 55%',
          onToggle: function (s) {
            if (!s.isActive) return;
            active = i; colorTo(i);
            cur.textContent = String(i + 1).padStart(2, '0');
          }
        });
        if (i === 0) {
          gsap.from(media, { clipPath: 'inset(0 0 100% 0 round 18px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: pin, start: 'top 75%' } });
          gsap.from(img, { scale: 1.35, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: pin, start: 'top 75%' } });
          gsap.from(info, { y: 50, autoAlpha: 0, duration: .9, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: pin, start: 'top 70%' } });
        } else {
          gsap.fromTo(media, { clipPath: 'inset(0 100% 0 0 round 18px)' }, { clipPath: 'inset(0 0% 0 0 round 18px)', ease: 'none', scrollTrigger: { trigger: p, containerAnimation: hz, start: 'left 95%', end: 'left 35%', scrub: true } });
          gsap.fromTo(img, { scale: 1.35, xPercent: 8 }, { scale: 1, xPercent: 0, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: hz, start: 'left right', end: 'center center', scrub: true } });
          gsap.from(info, { x: 90, autoAlpha: 0, duration: .9, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: p, containerAnimation: hz, start: 'left 80%', toggleActions: 'play none none reverse' } });
        }
      });

      return function () { gsap.set(work, DEF); };
    });

    mm.add('(max-width: 899px)', function () {
      panels.forEach(function (p) {
        var media = $('.media-box', p);
        gsap.from(media, { clipPath: 'inset(100% 0 0 0 round 18px)', duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 85%' } });
        gsap.from($('img', media), { scale: 1.3, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 85%' } });
        gsap.from($$('.info-box > *', p), { y: 40, autoAlpha: 0, duration: .8, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 70%' } });
      });
    });
  }

  /* ---------- More Works ---------- */
  function initArchive(mm) {
    gsap.from('.archive-area li', { y: 60, autoAlpha: 0, duration: .9, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.archive-area', start: 'top 82%' } });
    gsap.from('.archive-area', { clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.archive-area', start: 'top 85%' } });

    mm.add('(hover: hover) and (min-width: 761px)', function () {
      var area = $('.preview-area'), wrap = $('.preview-wrap'), list = $('.archive-area');
      gsap.set(area, { xPercent: -50, yPercent: -50, scale: .6 });
      var xTo = gsap.quickTo(area, 'x', { duration: .65, ease: 'power3' });
      var yTo = gsap.quickTo(area, 'y', { duration: .65, ease: 'power3' });
      var rTo = gsap.quickTo(area, 'rotation', { duration: .8, ease: 'power3' });
      var lastX = 0, shown = false;
      function move(e) {
        if (!shown) { gsap.set(area, { x: e.clientX, y: e.clientY }); }
        xTo(e.clientX); yTo(e.clientY);
        rTo(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * .8));
        lastX = e.clientX;
      }
      function enterRow(e) {
        var i = +e.currentTarget.dataset.index;
        shown = true;
        gsap.to(area, { autoAlpha: 1, scale: 1, duration: .45, ease: 'expo.out', overwrite: 'auto' });
        gsap.to(wrap, { yPercent: -100 * i, duration: .7, ease: 'expo.out', overwrite: 'auto' });
      }
      function leaveList() {
        shown = false;
        gsap.to(area, { autoAlpha: 0, scale: .6, duration: .4, ease: 'power3.out', overwrite: 'auto' });
      }
      var rows = $$('.archive-wrap');
      list.addEventListener('mousemove', move);
      list.addEventListener('mouseleave', leaveList);
      rows.forEach(function (r) { r.addEventListener('mouseenter', enterRow); });
      return function () {
        list.removeEventListener('mousemove', move);
        list.removeEventListener('mouseleave', leaveList);
        rows.forEach(function (r) { r.removeEventListener('mouseenter', enterRow); });
      };
    });
  }

  /* ---------- AI ---------- */
  function initAi() {
    var prompt = $('.terminal-line.is-prompt');
    var text = prompt.textContent;
    var rest = $$('.terminal-line:not(.is-prompt)');
    prompt.textContent = '';
    gsap.set(rest, { autoAlpha: 0, y: 10 });
    var o = { n: 0 };
    var tl = gsap.timeline({ scrollTrigger: { trigger: '.terminal-wrap', start: 'top 75%' } });
    tl.from('.terminal-wrap', { y: 60, autoAlpha: 0, duration: .9, ease: 'power3.out' })
      .call(function () { prompt.classList.add('is-typing'); })
      .to(o, { n: text.length, duration: text.length * .045, ease: 'none', onUpdate: function () { prompt.textContent = text.slice(0, Math.round(o.n)); } })
      .call(function () { prompt.classList.remove('is-typing'); })
      .to(rest, { autoAlpha: 1, y: 0, duration: .45, stagger: .45, ease: 'power2.out' }, '+=.3');

    gsap.from('.ai-box', { y: 60, autoAlpha: 0, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.ai-list', start: 'top 80%' } });
  }

  /* ---------- 기술 스택 ---------- */
  function initStack() {
    gsap.from('.stack-wrap h3', { y: 20, autoAlpha: 0, duration: .7, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.stack-area', start: 'top 82%' } });
    gsap.from('.stack-box', { y: 44, autoAlpha: 0, duration: .8, stagger: .045, ease: 'power3.out', scrollTrigger: { trigger: '.stack-area', start: 'top 80%' } });
  }

  /* ---------- 연락처 ---------- */
  function initContact() {
    var cs = SplitText.create('.contact-line', { type: 'chars' });
    gsap.from(cs.chars, { yPercent: 120, rotate: 8, duration: 1, stagger: .035, ease: 'power4.out', scrollTrigger: { trigger: '.contact-title', start: 'top 85%' } });
    gsap.from('.contact-note, .link-area .link-box', { y: 30, autoAlpha: 0, duration: .8, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.contact-note', start: 'top 92%' } });
    gsap.from('.contact-title', { y: 120, ease: 'none', scrollTrigger: { trigger: '.se-contact', start: 'top bottom', end: 'top top', scrub: true } });
  }

  /* ---------- 페이지 전환 ---------- */
  function initTransition() {
    var wipe = $('.se-wipe');
    $$('a.project-wrap').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        var href = a.getAttribute('href');
        gsap.set(wipe, { backgroundColor: a.dataset.bg, transformOrigin: 'bottom' });
        gsap.to(wipe, { scaleY: 1, duration: .75, ease: 'power4.inOut', onComplete: function () { window.location.href = href; } });
      });
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) gsap.set(wipe, { scaleY: 0 }); });
  }

  /* ---------- 로딩 ---------- */
  function runLoader(done) {
    var loader = $('.se-loader'), num = $('.loader-count', loader);
    var quick = false;
    try { quick = sessionStorage.getItem('pf-seen') === '1'; sessionStorage.setItem('pf-seen', '1'); } catch (err) { }
    var dur = quick ? .5 : 1.6;
    document.body.style.overflow = 'hidden';
    var o = { v: 0 };
    var tl = gsap.timeline({ onComplete: function () { loader.remove(); document.body.style.overflow = ''; done(); } });
    tl.to(o, { v: 100, duration: dur, ease: 'power2.inOut', onUpdate: function () { num.textContent = Math.round(o.v); } })
      .to('.loader-bar', { scaleX: 1, duration: dur, ease: 'power2.inOut' }, 0)
      .to(loader, { yPercent: -100, duration: .9, ease: 'power4.inOut' }, '+=.12')
      .add(heroIntro(), '-=.45');
  }

  /* ---------- 시작 ---------- */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  function start() {
  var mm = gsap.matchMedia();
  initCursor();
  initNav();
  initHeroScroll();
  initMarquee();
  initAbout();
  revealTitle('.group-work-head h2, .section-title');
  initWork(mm);
  initArchive(mm);
  initRolls(mm);
  initStack();
  initAi();
  initContact();
  initMagnets();
  initTransition();

  runLoader(function () {
    ScrollTrigger.refresh();
    if (location.hash) {
      var t = $(location.hash);
      if (t) window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY);
    }
  });
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
  var fontsReady = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 1500); })]) : Promise.resolve();
  fontsReady.then(start);
})();
