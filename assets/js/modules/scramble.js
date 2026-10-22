import { reduced, $$ } from './utils.js';

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

// [data-scramble] 글자는 링크 · 버튼에 마우스를 올리면 섞였다 돌아옴
export function initScramble() {
  $$('[data-scramble]').forEach((el) => {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    const host = el.closest('a, button') || el;
    host.addEventListener('pointerenter', () => scramble(el, text, 400));
  });
}
