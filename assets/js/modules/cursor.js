import { $ } from './utils.js';
import { pointer } from './pointer.js';

// 좌표가 붙은 사각 커서 + 호버한 요소를 감싸는 모서리 프레임
export function initCursor() {
  const dot = $('.se-cursor');
  const xy = $('.js-xy');
  const frame = $('.cursor-frame');
  const cur = { x: pointer.x, y: pointer.y };
  const fr = { x: 0, y: 0, w: 0, h: 0 };
  let hoverEl = null;

  addEventListener('pointermove', (e) => {
    xy.innerHTML = Math.round(e.clientX) + '<br>' + Math.round(e.clientY);
  }, { passive: true });

  document.addEventListener('pointerover', (e) => {
    hoverEl = e.target.closest('a, button, .stack-list li');
    frame.classList.toggle('is-on', !!hoverEl);
  });

  (function loop() {
    cur.x += (pointer.x - cur.x) * .35;
    cur.y += (pointer.y - cur.y) * .35;
    dot.style.transform = 'translate(' + cur.x + 'px,' + cur.y + 'px)';
    if (hoverEl) {
      const r = hoverEl.getBoundingClientRect();
      fr.x += (r.left - fr.x) * .3;
      fr.y += (r.top - fr.y) * .3;
      fr.w += (r.width - fr.w) * .3;
      fr.h += (r.height - fr.h) * .3;
      frame.style.transform = 'translate(' + fr.x + 'px,' + fr.y + 'px)';
      frame.style.width = fr.w + 'px';
      frame.style.height = fr.h + 'px';
    }
    requestAnimationFrame(loop);
  })();
}
