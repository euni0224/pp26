import { deskMQ, $, $$ } from './utils.js';

let front = null;

// 클릭 · 선택한 패널을 맨 앞으로
export function bringFront(p) {
  if (front) front.classList.remove('is-front');
  front = p;
  p.classList.add('is-front');
}

// 드래그 이동량은 --dx · --dy로 저장해 원래 그리드 위치는 CSS가 유지
export function initPanels() {
  // 첫 패널의 점 아이콘을 다른 패널 핸들에도 복사
  const dots = $('.panel-handle svg').outerHTML;
  $$('.panel-handle:not([style])').forEach((h) => { if (!h.firstChild) h.innerHTML = dots; });

  $$('.panel').forEach((p) => {
    p.addEventListener('pointerdown', () => bringFront(p));
    const handle = $('.panel-handle', p);
    let sx, sy, ox, oy;
    handle.addEventListener('pointerdown', (e) => {
      if (!deskMQ.matches) return;
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      sx = e.clientX; sy = e.clientY;
      ox = parseFloat(p.style.getPropertyValue('--dx')) || 0;
      oy = parseFloat(p.style.getPropertyValue('--dy')) || 0;
      p.classList.add('is-dragging');
    });
    handle.addEventListener('pointermove', (e) => {
      if (!p.classList.contains('is-dragging')) return;
      p.style.setProperty('--dx', ox + e.clientX - sx + 'px');
      p.style.setProperty('--dy', oy + e.clientY - sy + 'px');
    });
    const end = () => p.classList.remove('is-dragging');
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  });
}

export function resetLayout() {
  $$('.panel').forEach((p) => {
    p.style.transition = 'translate .8s cubic-bezier(.65,0,.35,1)';
    p.style.setProperty('--dx', '0px');
    p.style.setProperty('--dy', '0px');
    setTimeout(() => { p.style.transition = ''; }, 800);
  });
}
