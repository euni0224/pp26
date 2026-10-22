import { touchMQ, reduced, $, $$ } from './utils.js';

// 터치 기기: [STACK]이 화면에 들어오면 타일이 순서대로 한 번 반짝임 (호버 대신)
export function observeStack() {
  const list = $('.stack-list');
  $$('li', list).forEach((li, i) => li.style.setProperty('--i', i));
  if (!touchMQ.matches || reduced) return;

  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    list.classList.add('is-wave');
    io.disconnect();
  }, { threshold: .5 });
  io.observe(list);
}
