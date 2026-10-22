export const root = document.documentElement;
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// SCSS의 desk 믹스인과 같은 조건 (abstracts/_variables.scss)
export const deskMQ = matchMedia('(min-width: 1100px) and (min-height: 700px)');

// 호버가 없는 기기 (SCSS의 touch 믹스인과 같은 조건)
export const touchMQ = matchMedia('(hover: none)');

export const $ = (s, c) => (c || document).querySelector(s);
export const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

export const pad = (n) => String(n).padStart(2, '0');
