// The curved screens: a cover-fit, auto-scrolling screenshot on the front, a blueprint on the back.
import * as THREE from 'three';

export const vert = /* glsl */`
uniform float uVel, uMirror, uFlip;
varying vec2 vUv; varying float vDepth;
void main(){
  vUv = uv;
  vec3 p = position;
  float fa = uFlip * 3.14159;
  p.x *= cos(fa);
  p.z -= sin(fa) * 1.1;
  float bend = sin(uv.x * 3.14159);
  p.y += bend * uVel * 0.32 * (uMirror > .5 ? -1. : 1.);
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

export const frag = /* glsl */`
uniform sampler2D uTex, uBack; uniform float uFlip, uIA, uPA, uHover, uActive, uVel, uMirror, uFogN, uFogF;
uniform vec3 uPaper, uInk, uAcc; uniform vec2 uMouse; uniform float uDim, uScroll, uFade, uLit, uFlash;
varying vec2 vUv; varying float vDepth;
float sdRB(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
void main(){
  vec2 uv = vUv;
  if (!gl_FrontFacing) uv.x = 1. - uv.x;
  vec2 q = (uv - .5) * vec2(uPA, 1.);
  float d = sdRB(q, vec2(uPA * .5, .5), .028);
  float aa = fwidth(d) * 1.2;
  float a = 1. - smoothstep(-aa, aa, d);
  vec2 t = uv - .5;
  float z = 1. + .05 * uHover - .03 * uActive;
  t /= z; t += .5;
  if (uPA > uIA) { float fr = uIA / uPA; t.y = (1. - uScroll * (1. - fr)) - fr * (1. - t.y); }
  else t.x = (t.x - .5) * uPA / uIA + .5;
  vec2 m = (t - uMouse) * vec2(uPA, 1.);
  float r = length(m);
  t += normalize(m + 1e-5) * sin(r * 40.) * .003 * uHover * smoothstep(.5, 0., r);
  float sh = uVel * .0035;
  vec3 col;
  col.r = texture2D(uTex, t + vec2(sh, 0.)).r;
  col.g = texture2D(uTex, t).g;
  col.b = texture2D(uTex, t - vec2(sh, 0.)).b;
  if (uFlip > .5) col = texture2D(uBack, uv).rgb;
  col *= .55 + .45 * abs(cos(uFlip * 3.14159));
  float grey = dot(col, vec3(.3, .59, .11));
  col = mix(col, vec3(grey), .55 * (1. - uActive));
  // unlit: a pale ghost of the screen, waiting for its frame
  col = mix(mix(uPaper, vec3(grey), .16), col, uLit);
  float f = smoothstep(uFogN, uFogF, vDepth);
  col = mix(col, uPaper, clamp(f * .9 + (1. - uActive) * uDim, 0., .94));
  col += uAcc * uFlash * .35 + uFlash * .12;
  float edge = 1. - smoothstep(0., aa * 1.6, abs(d + aa * 1.2));
  col = mix(col, uInk, edge * (.35 + .25 * (1. - uLit)) * (1. - uMirror));
  if (uMirror > .5) {
    float fade = pow(1. - vUv.y, 3.) * .2;
    col = mix(uPaper, col, .55);
    a *= fade;
  }
  gl_FragColor = vec4(col, a * uFade);
  #include <colorspace_fragment>
}`;

const pad2 = n => String(n).padStart(2, '0');

// the back of every screen: how it works, drawn on a canvas
export function blueprint(p, i, nodes, maxAniso) {
  const cv = document.createElement('canvas'); cv.width = 1600; cv.height = 1000;
  const c = cv.getContext('2d');
  c.fillStyle = '#121211'; c.fillRect(0, 0, 1600, 1000);
  c.strokeStyle = 'rgba(236,235,230,.05)'; c.lineWidth = 1;
  for (let x = 0; x <= 1600; x += 40) { c.beginPath(); c.moveTo(x + .5, 0); c.lineTo(x + .5, 1000); c.stroke(); }
  for (let y = 0; y <= 1000; y += 40) { c.beginPath(); c.moveTo(0, y + .5); c.lineTo(1600, y + .5); c.stroke(); }
  c.fillStyle = 'rgba(236,235,230,.55)'; c.font = '500 22px "JetBrains Mono", monospace';
  c.fillText('HOW IT WORKS  /  ' + pad2(i + 1), 80, 96);
  c.fillStyle = '#ecebe6'; c.font = '600 84px "Inter Tight", sans-serif'; c.fillText(p.t, 76, 186);
  c.fillStyle = p.c; c.font = 'italic 40px "Instrument Serif", serif'; c.fillText(p.hook, 80, 240);
  const bw = 400, bh = 150, gx = 110, x0 = 80, rows = [330, 640];
  const pos = nodes.map((_, j) => { const r = j < 3 ? 0 : 1, col = r === 0 ? j : 5 - j; return [x0 + col * (bw + gx), rows[r]]; });
  c.lineWidth = 3; c.strokeStyle = p.c; c.fillStyle = p.c;
  const arrow = (x1, y1, x2, y2) => { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); const a = Math.atan2(y2 - y1, x2 - x1); c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - 16 * Math.cos(a - .45), y2 - 16 * Math.sin(a - .45)); c.lineTo(x2 - 16 * Math.cos(a + .45), y2 - 16 * Math.sin(a + .45)); c.closePath(); c.fill(); };
  for (let j = 0; j < pos.length - 1; j++) {
    const [ax, ay] = pos[j], [bx, by] = pos[j + 1];
    if (ay === by) { const dir = bx > ax ? 1 : -1; arrow(dir > 0 ? ax + bw + 8 : ax - 8, ay + bh / 2, dir > 0 ? bx - 10 : bx + bw + 10, by + bh / 2); }
    else { c.setLineDash([10, 8]); arrow(ax + bw / 2, ay + bh + 8, bx + bw / 2, by - 10); c.setLineDash([]); }
  }
  nodes.forEach(([t, sub], j) => {
    const [x, y] = pos[j];
    c.fillStyle = '#1b1b19'; c.strokeStyle = 'rgba(236,235,230,.55)'; c.lineWidth = 2;
    c.beginPath(); c.roundRect(x, y, bw, bh, 18); c.fill(); c.stroke();
    c.fillStyle = p.c; c.font = '500 20px "JetBrains Mono", monospace'; c.fillText(pad2(j + 1), x + 24, y + 42);
    c.fillStyle = '#ecebe6';
    for (let fs = 31; fs >= 22; fs--) { c.font = `600 ${fs}px "Inter Tight", sans-serif`; if (c.measureText(t).width <= bw - 48) break; }
    c.fillText(t, x + 24, y + 86);
    c.fillStyle = 'rgba(236,235,230,.6)'; c.font = '400 18px "JetBrains Mono", monospace';
    const words = sub.split(' '), ln = [''];
    for (const w of words) { const tryL = (ln[ln.length - 1] + ' ' + w).trim(); if (c.measureText(tryL).width > bw - 48 && ln[ln.length - 1]) ln.push(w); else ln[ln.length - 1] = tryL; }
    ln.slice(0, 2).forEach((l, n) => c.fillText(l, x + 24, y + 118 + n * 22));
  });
  c.fillStyle = 'rgba(236,235,230,.45)'; c.font = '400 20px "JetBrains Mono", monospace';
  c.fillText('FRONT: THE PRODUCT.  BACK: THE ENGINEERING.', 80, 930);
  c.textAlign = 'right'; c.fillText(p.s.toUpperCase(), 1520, 930);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = Math.min(8, maxAniso);
  return tex;
}
