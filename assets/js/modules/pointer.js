import { touchMQ, reduced } from './utils.js';

// 커서 · 배경 · 세션 정보가 함께 쓰는 마우스(손가락) 상태
export const pointer = {
  x: innerWidth / 2,
  y: innerHeight / 2,
  speed: 0, // px/s, 매 프레임 감쇠 (session.js)
  dist: 0
};

let last = null;
let lastTouch = 0;

function track(x, y, t) {
  if (last) {
    const d = Math.hypot(x - last.x, y - last.y);
    const dt = Math.max(t - last.t, 1);
    pointer.speed += (d / dt * 1000 - pointer.speed) * .2;
    pointer.dist += d;
  }
  last = { x, y, t };
  pointer.x = x;
  pointer.y = y;
}

// 손을 뗀 뒤에는 배경 덩어리가 화면 위를 천천히 떠다님
function drift() {
  const IDLE = 1500;
  (function loop(now) {
    if (now - lastTouch > IDLE) {
      const t = now / 1000;
      pointer.x = innerWidth * (.5 + Math.sin(t * .35) * .32);
      pointer.y = innerHeight * (.45 + Math.sin(t * .23 + 1.4) * .25);
    }
    requestAnimationFrame(loop);
  })(performance.now());
}

export function initPointer() {
  addEventListener('pointermove', (e) => track(e.clientX, e.clientY, e.timeStamp), { passive: true });

  if (!touchMQ.matches) return;

  // 스크롤이 시작되면 pointermove가 끊기므로 touch 이벤트로 손가락 위치를 계속 받음
  const onTouch = (e) => {
    const p = e.touches[0];
    if (!p) return;
    if (e.type === 'touchstart') last = null;
    lastTouch = performance.now();
    track(p.clientX, p.clientY, e.timeStamp);
  };
  addEventListener('touchstart', onTouch, { passive: true });
  addEventListener('touchmove', onTouch, { passive: true });
  if (!reduced) drift();
}
