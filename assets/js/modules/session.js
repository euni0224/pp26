import { touchMQ, $, $$, pad } from './utils.js';
import { pointer } from './pointer.js';

const stat = {};
const counts = { clicks: 0, hovers: 0, keys: 0 };
const started = Date.now();
const seoul = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

// SESSION 시계 · 세션 시간 + [NOW] 패널 시계
function tickClock() {
  const t = seoul.format(new Date());
  stat.time.textContent = t;
  $('.js-now-hm').textContent = t.slice(0, 5);
  $('.js-now-s').textContent = t.slice(6);
  const s = Math.floor((Date.now() - started) / 1000);
  stat.dur.textContent = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60);
}

// SYSTEM · NETWORK: 한 번만 채우는 값
function fillSystem() {
  const ua = navigator.userAgent;
  stat.browser.textContent = /Edg\//.test(ua) ? 'Edge' : /Whale/.test(ua) ? 'Whale' : /SamsungBrowser/.test(ua) ? 'Samsung' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Other';
  stat.os.textContent = /Windows/.test(ua) ? 'Windows' : /iPhone|iPad/.test(ua) ? 'iOS' : /Mac OS/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' : /Linux/.test(ua) ? 'Linux' : 'Other';
  stat.dpr.textContent = (devicePixelRatio || 1) + 'x';
  stat.lang.textContent = (navigator.language || 'ko').toUpperCase();
  try { stat.tz.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { }
  stat.http.textContent = location.protocol.replace(':', '');
  const conn = navigator.connection;
  stat.net.textContent = conn && conn.effectiveType ? conn.effectiveType : (navigator.onLine ? 'Online' : 'Offline');

  const vp = () => { stat.vp.textContent = innerWidth + ' × ' + innerHeight; };
  vp();
  addEventListener('resize', vp);

  // 작은 파일을 한 번 받아 대략적인 응답 시간을 보여 줌
  const p0 = performance.now();
  fetch('assets/img/favicon-32.png', { cache: 'no-store' })
    .then(() => { stat.ping.textContent = Math.round(performance.now() - p0) + ' ms'; })
    .catch(() => { });
}

// FPS · 마우스 속도 · 이동 거리는 0.5초마다 갱신
function startMeter() {
  let frames = 0, fpsT = performance.now();
  const hzSamples = [];
  (function loop(now) {
    pointer.speed *= .94;
    frames++;
    if (now - fpsT > 500) {
      const fps = frames * 1000 / (now - fpsT);
      stat.fps.textContent = Math.round(fps);
      stat.speed.textContent = Math.round(pointer.speed) + ' px/s';
      stat.dist.textContent = Math.round(pointer.dist).toLocaleString('en') + ' px';
      if (hzSamples.length < 6) {
        hzSamples.push(fps);
        const best = Math.max(...hzSamples);
        stat.hz.textContent = (best > 100 ? Math.round(best / 10) * 10 : 60) + ' Hz';
      }
      frames = 0;
      fpsT = now;
    }
    requestAnimationFrame(loop);
  })(performance.now());
}

export function initSession() {
  $$('[data-stat]').forEach((el) => { stat[el.dataset.stat] = el; });

  tickClock();
  setInterval(tickClock, 1000);
  fillSystem();
  startMeter();

  addEventListener('click', () => { stat.clicks.textContent = ++counts.clicks; });
  addEventListener('keydown', () => { stat.keys.textContent = ++counts.keys; });

  if (touchMQ.matches) {
    useTouchLabels();
    return;
  }
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest('a, button')) stat.hovers.textContent = ++counts.hovers;
  });
}

// 터치 기기: 마우스 · 호버 항목을 손가락 · 스크롤 기준으로 바꿔 표시
function useTouchLabels() {
  const label = (key, text) => { stat[key].previousElementSibling.textContent = text; };
  label('speed', 'Touch speed :');
  label('dist', 'Distance swiped :');
  label('clicks', 'Taps :');
  label('hovers', 'Scrolled :');
  stat.hovers.textContent = '0 px';

  let lastY = scrollY, scrolled = 0;
  addEventListener('scroll', () => {
    scrolled += Math.abs(scrollY - lastY);
    lastY = scrollY;
    stat.hovers.textContent = Math.round(scrolled).toLocaleString('en') + ' px';
  }, { passive: true });
}
