import { root } from './utils.js';
import { toggleTheme, toggleGrid } from './tools.js';
import { resetLayout } from './panels.js';
import { toggleAbout } from './about.js';
import { selectWork, closeWork } from './works.js';

// SHORTCUTS 블록에 적힌 키 (부팅 화면이 끝난 뒤에만)
const KEYS = {
  d: toggleTheme,
  g: toggleGrid,
  l: resetLayout,
  a: toggleAbout,
  escape: closeWork
};

export function initShortcuts() {
  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || !root.classList.contains('is-booted')) return;
    if (e.target.closest && e.target.closest('input, textarea')) return;
    const k = e.key.toLowerCase();
    if (KEYS[k]) KEYS[k]();
    else if (/^[0-9]$/.test(k)) selectWork(+k);
  });
}
