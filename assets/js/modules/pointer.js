// 커서 · 배경 · 세션 정보가 함께 쓰는 마우스 상태
export const pointer = {
  x: innerWidth / 2,
  y: innerHeight / 2,
  speed: 0, // px/s, 매 프레임 감쇠 (session.js)
  dist: 0
};

let last = null;

export function initPointer() {
  addEventListener('pointermove', (e) => {
    if (last) {
      const d = Math.hypot(e.clientX - last.x, e.clientY - last.y);
      const dt = Math.max(e.timeStamp - last.t, 1);
      pointer.speed += (d / dt * 1000 - pointer.speed) * .2;
      pointer.dist += d;
    }
    last = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  }, { passive: true });
}
