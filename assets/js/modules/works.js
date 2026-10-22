import { WORKS } from '../data/works.js';
import { reduced, deskMQ, $, $$, pad } from './utils.js';
import { scramble } from './scramble.js';
import { bringFront } from './panels.js';

const TROPHY = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" aria-label="수상"><path d="M3.5 1.5h5v3a2.5 2.5 0 0 1-5 0v-3ZM6 7v2.5M4 10.5h4M3.5 2.5H1.5a2 2 0 0 0 2 2M8.5 2.5h2a2 2 0 0 1-2 2"/></svg>';
const ARROW = '<span class="chip-icon" aria-hidden="true"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 9 9 1M3 1h6v6" stroke="currentColor"/></svg></span>';

let listEl, stripEl, colMid, detailP, imagesP;
let current = -1;

const target = (w) => (w.ext ? ' target="_blank" rel="noopener"' : '');

function detailHTML(w, i) {
  return '<p class="detail-meta"><span>[' + pad(i) + '] ' + w.type + '</span><span>' + w.year + '</span></p>' +
    '<h3 class="detail-title"></h3>' +
    '<p class="detail-desc">' + w.desc + '</p>' +
    '<dl class="detail-dl"><dt>Role</dt><dd>' + w.role + '</dd><dt>Scope</dt><dd>' + w.size + '</dd></dl>' +
    '<div class="tag-list">' + w.tags.map((t) => '<span>' + t + '</span>').join('') + '</div>' +
    '<a class="chip" href="' + w.href + '"' + target(w) + '>' + (w.ext ? 'Visit site' : 'Open project') + ARROW + '</a>';
}

// [WORK/LIST] · [WORK/GRID]에서 고른 작업을 DETAILS · IMAGES 패널에 표시
export function selectWork(i) {
  if (i === current || !WORKS[i]) return;
  current = i;
  const w = WORKS[i];
  $$('.btn-work, .btn-strip').forEach((b) => b.classList.toggle('is-on', +b.dataset.i === i));
  listEl.classList.add('has-selected');
  colMid.classList.add('has-work');
  [detailP, imagesP].forEach((p) => {
    p.classList.remove('is-empty');
    p.classList.add('is-open');
    bringFront(p);
  });
  $('.detail-box').innerHTML = detailHTML(w, i);
  scramble($('.detail-title'), w.name, 450);
  $('.image-list').innerHTML = w.imgs.map((src) =>
    '<a href="' + w.href + '"' + target(w) + ' tabindex="-1"><img src="' + src + '" alt=""></a>'
  ).join('');

  const behavior = reduced ? 'auto' : 'smooth';
  if (deskMQ.matches) stripEl.scrollTo({ top: stripEl.children[i].offsetTop - 8, behavior });
  else detailP.scrollIntoView({ behavior, block: 'start' });
}

export function closeWork() {
  current = -1;
  $$('.btn-work, .btn-strip').forEach((b) => b.classList.remove('is-on'));
  listEl.classList.remove('has-selected');
  colMid.classList.remove('has-work');
  [detailP, imagesP].forEach((p) => {
    p.classList.remove('is-open');
    p.classList.add('is-empty');
  });
}

export function initWorks() {
  listEl = $('.work-list');
  stripEl = $('.strip-list');
  colMid = $('.col-mid');
  detailP = $('.p-detail');
  imagesP = $('.p-images');

  WORKS.forEach((w, i) => {
    const li = document.createElement('li');
    li.innerHTML = '<button class="btn-work" type="button" data-i="' + i + '"><span class="work-no">[' + i + ']</span><span class="work-name">' + w.name + (w.award ? TROPHY : '') + '</span></button>';
    listEl.appendChild(li);

    const s = document.createElement('button');
    s.type = 'button';
    s.className = 'btn-strip';
    s.dataset.i = i;
    s.setAttribute('aria-label', w.name + ' 보기');
    s.innerHTML = '<img src="' + w.imgs[0] + '" alt="" loading="lazy">';
    stripEl.appendChild(s);
  });

  document.addEventListener('click', (e) => {
    const b = e.target.closest('.btn-work, .btn-strip');
    if (b) selectWork(+b.dataset.i);
    if (e.target.closest('.js-close-work')) closeWork();
  });
}
