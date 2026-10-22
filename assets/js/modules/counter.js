import { reduced, $$ } from './utils.js';

// .js-count[data-to] 숫자를 0부터 올림
export function countUp() {
  $$('.js-count').forEach((n) => {
    const to = +n.dataset.to;
    const t0 = performance.now();
    (function step(now) {
      const p = reduced ? 1 : Math.min((now - t0) / 1400, 1);
      n.textContent = Math.round((1 - Math.pow(1 - p, 3)) * to);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  });
}
