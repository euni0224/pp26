import { root, $ } from './utils.js';
import { resetLayout } from './panels.js';

let gridBtn;

export function toggleTheme() {
  const dark = root.classList.toggle('dark');
  try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) { }
}

export function toggleGrid() {
  const on = root.classList.toggle('show-grid');
  gridBtn.setAttribute('aria-pressed', on);
}

// 상단 우측 도구: 그리드 · 레이아웃 초기화 · 테마
export function initTools() {
  gridBtn = $('.js-grid');
  gridBtn.addEventListener('click', toggleGrid);
  $('.js-theme').addEventListener('click', toggleTheme);
  $('.js-reset').addEventListener('click', resetLayout);
}
