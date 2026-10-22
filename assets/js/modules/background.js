import { root, reduced } from './utils.js';
import { pointer } from './pointer.js';
import { VERTEX, FRAGMENT } from './shaders.js';

// 저해상도로 그려 성능 확보 (그레인 질감과도 어울림)
const SCALE = .5;

function hexToRgb(hex) {
  hex = hex.trim().replace('#', '');
  if (hex.length === 3) hex = hex.replace(/./g, '$&$&');
  const n = parseInt(hex, 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}

function createProgram(gl) {
  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(prog);
  return gl.getProgramParameter(prog, gl.LINK_STATUS) ? prog : null;
}

// WebGL 배경: 커서를 따라 일렁이는 노이즈 그라디언트
export function initBackground() {
  const canvas = document.getElementById('gl');
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  const prog = gl && createProgram(gl);
  if (!prog) { root.classList.add('no-gl'); return; }
  gl.useProgram(prog);

  // 화면 전체를 덮는 삼각형 하나
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = {};
  ['uRes', 'uMouse', 'uTime', 'uScroll', 'uBg', 'uAccent', 'uDark'].forEach((n) => { u[n] = gl.getUniformLocation(prog, n); });

  // 테마 전환 시 색을 부드럽게 보간
  const target = { bg: [0, 0, 0], accent: [0, 0, 0], dark: 0 };
  function readTheme() {
    const cs = getComputedStyle(root);
    target.bg = hexToRgb(cs.getPropertyValue('--bg'));
    target.accent = hexToRgb(cs.getPropertyValue('--accent'));
    target.dark = root.classList.contains('dark') ? 1 : 0;
  }
  readTheme();
  const colors = { bg: target.bg.slice(), accent: target.accent.slice(), dark: target.dark };
  new MutationObserver(readTheme).observe(root, { attributes: true, attributeFilter: ['class'] });

  function resize() {
    canvas.width = Math.round(innerWidth * SCALE);
    canvas.height = Math.round(innerHeight * SCALE);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  addEventListener('resize', resize);

  const sm = { x: .5, y: .5 };
  let smScroll = 0;
  const t0 = performance.now();

  function render(now) {
    const max = document.documentElement.scrollHeight - innerHeight;
    const scrollP = max > 0 ? scrollY / max : 0;
    sm.x += (pointer.x / innerWidth - sm.x) * .05;
    sm.y += (1 - pointer.y / innerHeight - sm.y) * .05;
    smScroll += (scrollP - smScroll) * .08;
    for (let i = 0; i < 3; i++) {
      colors.bg[i] += (target.bg[i] - colors.bg[i]) * .08;
      colors.accent[i] += (target.accent[i] - colors.accent[i]) * .08;
    }
    colors.dark += (target.dark - colors.dark) * .08;

    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    gl.uniform2f(u.uMouse, sm.x, sm.y);
    gl.uniform1f(u.uTime, reduced ? 0 : (now - t0) / 1000);
    gl.uniform1f(u.uScroll, smScroll);
    gl.uniform3fv(u.uBg, colors.bg);
    gl.uniform3fv(u.uAccent, colors.accent);
    gl.uniform1f(u.uDark, colors.dark);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
