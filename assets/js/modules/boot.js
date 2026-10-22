import { root, reduced, $ } from './utils.js';

const BOOT = [
  'PORTFOLIO-V2 BIOS (C) HONG KYUNGEUN',
  'PRESS ANY KEY ...... SKIP',
  '',
  'MEMORY TEST : 125 SCREENS ........ <span class="ok">OK</span>',
  'LOADING WORKS [11] ............... <span class="ok">OK</span>',
  'LOADING STACK [12] ............... <span class="ok">OK</span>',
  '',
  'PRESS <span class="key">ENTER↵</span> TO CONTINUE ....<span class="caret"></span>'
];

// BIOS 부팅 화면. 같은 탭에서 다시 들어오면 건너뜀 (head의 sessionStorage 확인)
export function initBoot(onDone) {
  const boot = $('.se-boot');
  const lines = $('.boot-lines');

  if (root.classList.contains('is-booted')) {
    boot.remove();
    onDone();
    return;
  }

  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    try { sessionStorage.setItem('booted', '1'); } catch (e) { }
    boot.style.transition = 'opacity .5s';
    boot.style.opacity = 0;
    setTimeout(() => {
      root.classList.add('is-booted');
      boot.remove();
      onDone();
    }, reduced ? 0 : 450);
  }

  BOOT.forEach((line, i) => {
    setTimeout(() => {
      const p = document.createElement('p');
      p.innerHTML = line;
      lines.appendChild(p);
    }, reduced ? 0 : 120 + i * (i > 2 ? 260 : 90));
  });

  boot.addEventListener('click', finish);
  addEventListener('keydown', finish, { once: true });
}
