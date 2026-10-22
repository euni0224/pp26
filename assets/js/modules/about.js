import { reduced, $, $$ } from './utils.js';
import { scramble, gibberish } from './scramble.js';
import { bringFront } from './panels.js';

let aboutP, aboutBtn, teaser, decodeEls;

// 닫혀 있을 땐 깨진 글자, 열면 소개 문장이 해독되듯 나타남
export function setAbout(open) {
  aboutP.classList.toggle('is-open', open);
  aboutBtn.setAttribute('aria-expanded', open);
  aboutBtn.setAttribute('aria-label', open ? '소개 닫기' : '소개 열기');
  teaser.hidden = open;
  if (open) {
    bringFront(aboutP);
    decodeEls.forEach((d, k) => scramble(d.el, d.text, 700 + k * 250));
  }
}

export const toggleAbout = () => setAbout(!aboutP.classList.contains('is-open'));

export function initAbout() {
  aboutP = $('.p-about');
  aboutBtn = $('.js-about-toggle');
  teaser = $('[data-teaser]');
  decodeEls = $$('[data-decode]').map((el) => ({ el, text: el.textContent }));

  const noiseTeaser = () => { teaser.textContent = gibberish(36) + '\n' + gibberish(40); };
  teaser.style.whiteSpace = 'pre-line';
  noiseTeaser();
  if (!reduced) setInterval(noiseTeaser, 140);

  aboutBtn.addEventListener('click', toggleAbout);
  $('.js-open-about').addEventListener('click', () => setAbout(true));
}
