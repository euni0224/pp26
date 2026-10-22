import { reduced, touchMQ, $$ } from './utils.js';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#$%&@ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const rand = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

// 앞 글자부터 차례로 원래 글자로 돌아오는 효과
export function scramble(el, text, dur = 500) {
  if (el._raf) cancelAnimationFrame(el._raf);
  if (reduced) { el.textContent = text; return; }
  const chars = Array.from(text);
  const t0 = performance.now();
  (function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    const done = Math.floor(p * chars.length);
    el.textContent = chars.map((c, i) => (i < done || c === ' ' ? c : rand())).join('');
    if (p < 1) el._raf = requestAnimationFrame(step);
  })(t0);
}

export function gibberish(len) {
  let s = '';
  for (let i = 0; i < len; i++) s += Math.random() < .14 ? ' ' : rand();
  return s;
}

// [data-scramble] 글자는 링크 · 버튼에 마우스를 올리면 섞였다 돌아옴.
// 터치 기기는 호버 대신 탭할 때 실행
export function initScramble() {
  const touch = touchMQ.matches;
  $$('[data-scramble]').forEach((el) => {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    const host = el.closest('a, button') || el;
    host.addEventListener(touch ? 'pointerdown' : 'pointerenter', () => scramble(el, text, 400));
  });
}

// 터치 기기: 부팅이 끝난 뒤, 글자가 화면에 처음 들어올 때 한 번 실행
export function observeScramble() {
  if (!touchMQ.matches) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      scramble(e.target, e.target.getAttribute('aria-label'), 600);
      io.unobserve(e.target);
    });
  }, { threshold: 1 });
  $$('[data-scramble]').forEach((el) => io.observe(el));
}
