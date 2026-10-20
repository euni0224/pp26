/*
 * 프로젝트 페이지 공통 이미지 크게 보기
 * 썸네일을 누르면 원본 크기로 열리고, 좌우 버튼 · 방향키 · 스와이프로 넘깁니다.
 */
(function () {
  'use strict';

  var SEL = '.hero-shot img, .card-thumb img, .shot > img';
  var imgs = [], seen = {};
  document.querySelectorAll(SEL).forEach(function (img) {
    var src = img.getAttribute('src');
    if (seen[src]) { bind(img, seen[src].index); return; }
    seen[src] = { index: imgs.length };
    imgs.push({ src: src, cap: caption(img) });
    bind(img, imgs.length - 1);
  });
  if (!imgs.length) return;

  // 카드 제목 → 캡션, 없으면 alt
  function caption(img) {
    var box = img.closest('.card, .shot');
    var t = box && box.querySelector('.card-title, .shot-cap b');
    return (t ? t.textContent : img.alt || '').trim();
  }

  function bind(img, i) {
    var trigger = img.parentElement;
    // 이미지 말고 캡션도 같이 든 카드(.shot)는 이미지만 감싸서 누르는 영역으로 사용
    if (trigger.children.length > 1) {
      var wrap = document.createElement('span');
      wrap.className = 'lb-wrap';
      trigger.insertBefore(wrap, img);
      wrap.appendChild(img);
      trigger = wrap;
    }
    trigger.classList.add('lb-trigger');
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('aria-label', (imgs[i].cap || '화면') + ' 크게 보기');
    trigger.addEventListener('click', function (e) { e.preventDefault(); open(i); });
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  }

  var css = document.createElement('style');
  css.textContent = [
    '.lb-trigger{position:relative;cursor:zoom-in}',
    '.lb-wrap{display:block}',
    '.lb-trigger:focus-visible{outline:2px solid #3d68ee;outline-offset:-2px}',
    '.lb-trigger::after{content:"";position:absolute;right:12px;top:12px;width:36px;height:36px;border-radius:50%;background:rgba(17,18,20,.72) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'18\' height=\'18\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2.2\' stroke-linecap=\'round\'%3E%3Cpath d=\'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7\'/%3E%3C/svg%3E") center/18px no-repeat;opacity:0;transform:scale(.8);transition:opacity .25s,transform .25s;pointer-events:none;z-index:2}',
    '.lb-trigger:hover::after,.lb-trigger:focus-visible::after{opacity:1;transform:none}',
    '@media (hover:none){.lb-trigger::after{opacity:1;transform:none;width:30px;height:30px;background-size:15px}}',
    '.lb{position:fixed;inset:0;z-index:10000;display:flex;flex-direction:column;background:rgba(10,11,13,.95);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;font-family:"Pretendard",system-ui,sans-serif;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s}',
    '.lb.is-open{opacity:1;visibility:visible;transition:opacity .3s,visibility 0s}',
    '.lb-bar{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 16px 14px 24px;font-size:14px}',
    '.lb-cap{font-weight:700;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.lb-count{color:rgba(255,255,255,.6);font-variant-numeric:tabular-nums;margin-left:10px;font-weight:600}',
    '.lb-stage{position:relative;flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:0 72px 32px;touch-action:pan-y}',
    '.lb-img{max-width:100%;max-height:100%;width:auto;height:auto;border-radius:10px;box-shadow:0 30px 80px rgba(0,0,0,.5);transition:opacity .2s,transform .3s cubic-bezier(.22,1,.36,1);user-select:none;-webkit-user-drag:none}',
    '.lb-img.is-loading{opacity:0;transform:scale(.97)}',
    '.lb button{display:grid;place-items:center;width:48px;height:48px;border:0;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;cursor:pointer;transition:background .2s}',
    '.lb button:hover{background:rgba(255,255,255,.24)}',
    '.lb button:focus-visible{outline:2px solid #fff;outline-offset:3px}',
    '.lb-close{flex-shrink:0}',
    '.lb-prev,.lb-next{position:absolute;top:50%;margin-top:-40px}',
    '.lb-prev{left:12px}.lb-next{right:12px}',
    '@media (max-width:760px){.lb-stage{padding:0 12px 80px}.lb-prev,.lb-next{top:auto;bottom:16px;margin-top:0}.lb-prev{left:calc(50% - 60px)}.lb-next{right:calc(50% - 60px)}.lb-bar{padding-left:16px}}',
    '@media (prefers-reduced-motion:reduce){.lb,.lb-img{transition:none}}',
    'html.lb-lock{overflow:hidden}'
  ].join('\n');
  document.head.appendChild(css);

  var arrow = function (d) { return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="' + d + '" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'; };
  var lb = document.createElement('div');
  lb.className = 'lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', '이미지 크게 보기');
  lb.innerHTML =
    '<div class="lb-bar"><p class="lb-cap"></p><button class="lb-close" type="button" aria-label="닫기">' + arrow('M6 6l12 12M18 6L6 18') + '</button></div>' +
    '<div class="lb-stage"><img class="lb-img" alt="">' +
    '<button class="lb-prev" type="button" aria-label="이전 이미지">' + arrow('M15 5l-7 7 7 7') + '</button>' +
    '<button class="lb-next" type="button" aria-label="다음 이미지">' + arrow('M9 5l7 7-7 7') + '</button></div>';
  document.body.appendChild(lb);

  var stage = lb.querySelector('.lb-stage'), view = lb.querySelector('.lb-img'), cap = lb.querySelector('.lb-cap');
  var btnClose = lb.querySelector('.lb-close'), btnPrev = lb.querySelector('.lb-prev'), btnNext = lb.querySelector('.lb-next');
  var cur = 0, lastFocus = null;
  if (imgs.length < 2) { btnPrev.hidden = true; btnNext.hidden = true; }

  function show(i) {
    cur = (i + imgs.length) % imgs.length;
    var item = imgs[cur];
    view.classList.add('is-loading');
    view.onload = function () { view.classList.remove('is-loading'); };
    view.src = item.src;
    view.alt = item.cap;
    cap.innerHTML = '';
    cap.appendChild(document.createTextNode(item.cap));
    var n = document.createElement('span');
    n.className = 'lb-count';
    n.textContent = (cur + 1) + ' / ' + imgs.length;
    cap.appendChild(n);
    // 다음 이미지 미리 받아 두기
    new Image().src = imgs[(cur + 1) % imgs.length].src;
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add('is-open');
    document.documentElement.classList.add('lb-lock');
    // 열 때는 visibility 트랜지션을 0으로 둬서 바로 포커스가 들어가게 함
    btnClose.focus();
  }
  function close() {
    lb.classList.remove('is-open');
    document.documentElement.classList.remove('lb-lock');
    if (lastFocus) lastFocus.focus();
  }

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { show(cur - 1); });
  btnNext.addEventListener('click', function () { show(cur + 1); });
  stage.addEventListener('click', function (e) { if (e.target === stage) close(); });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(cur - 1);
    else if (e.key === 'ArrowRight') show(cur + 1);
    else if (e.key === 'Tab') {
      // 포커스를 팝업 안에 가둠
      var f = Array.prototype.filter.call(lb.querySelectorAll('button'), function (b) { return !b.hidden; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // 스와이프
  var sx = 0, sy = 0;
  stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(cur + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
