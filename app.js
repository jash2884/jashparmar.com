import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import * as CANNON from './vendor/cannon-es.js?v=3';
import { PROJECTS as P, HOW, EXPERIENCE, EDUCATION, ABOUT, STATS, CONTACT, PERSON } from './content.js?v=4';
import { FORMS, POOL } from './forms.js?v=3';
import { vert, frag, blueprint } from './screens.js?v=3';

/* ================= helpers ================= */
const N = P.length;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const pad2 = n => String(n).padStart(2, '0');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const hash = new URLSearchParams(location.hash.slice(1));
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const wrapA = a => Math.atan2(Math.sin(a), Math.cos(a));
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const TOTAL_PARTS = Object.values(POOL).reduce((a, b) => a + b, 0);

/* ================= content into the page ================= */
$('.asm-t').textContent = TOTAL_PARTS;
for (const a of $$('.cv, .f-cv')) a.href = CONTACT.resume;
$('.f-gh').href = CONTACT.github; $('.f-li').href = CONTACT.linkedin; $('.f-cl').href = CONTACT.classic;
const mailA = $('.mail'); mailA.href = 'mailto:' + CONTACT.email; mailA.setAttribute('aria-label', CONTACT.email);
const mailSpan = mailA.querySelector('span');
for (const ch of CONTACT.email) { const s = document.createElement('i'); s.className = 'mc'; s.textContent = ch; mailSpan.appendChild(s); }
$('.rows').innerHTML = EXPERIENCE.map(e => `<li data-k="${e.key}" data-l="${e.keyLabel}"><span class="mono r-when">${e.when}</span><span class="r-role">${e.role}</span><span class="r-co">${e.org}</span><span class="r-what">${e.what}</span></li>`).join('');
$('.edu').textContent = EDUCATION;
$('.about .big').innerHTML = ABOUT.replace('run the real thing.', '<em>run the real thing.</em>');
$('.stats').innerHTML = STATS.map(([n, l]) => `<div><dt class="mono">${l}</dt><dd data-n="${parseInt(n, 10)}" data-s="${n.replace(/[0-9]/g, '')}">${n}</dd></div>`).join('');
$('.me img').src = PERSON.portrait;
const idx = $('.index');
P.forEach((p, i) => { const li = document.createElement('li'); li.innerHTML = `<b>${pad2(i + 1)}</b><span>${p.t}</span><i style="--c:${p.c}"></i>`; li.addEventListener('click', () => goProject(i)); idx.appendChild(li); });
$('.n-t').textContent = pad2(N);

const chars = (el, txt) => {
  el.innerHTML = '';
  txt.split(' ').forEach((word, wi, arr) => {
    const w = document.createElement('span'); w.className = 'wrd';
    for (const ch of word) { const s = document.createElement('span'); s.className = 'c'; s.textContent = ch; w.appendChild(s); }
    el.appendChild(w); if (wi < arr.length - 1) el.appendChild(document.createTextNode(' '));
  });
};
$$('.name .w').forEach(w => { const t = w.textContent; chars(w, t); [...w.querySelectorAll('.c')].forEach((c, i) => c.style.transitionDelay = (0.25 + i * 0.045) + 's'); });

/* about: words light up as you read */
const big = $('.about .big');
(() => { const walk = n => { for (const c of [...n.childNodes]) { if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) f.append(w); else { const s = document.createElement('span'); s.className = 'wd'; s.textContent = w; f.append(s); } }); c.replaceWith(f); } else walk(c); } }; walk(big); })();
const words = [...big.querySelectorAll('.wd')];

/* ================= layout of the type ================= */
let vw = innerWidth, vh = innerHeight, narrow = vw < 860;
const fitType = () => {
  const n = $('.name'); n.style.setProperty('--fs', '100px');
  const ws = [...n.querySelectorAll('.w')].map(e => e.getBoundingClientRect());
  const w = narrow ? Math.max(...ws.map(r => r.width)) : ws[ws.length - 1].right - ws[0].left;
  const target = vw - 2 * ($('.grid').getBoundingClientRect().left || 16) - 8;
  n.style.setProperty('--fs', (100 * target / w).toFixed(2) + 'px');
  const m = $('.mail'); m.style.setProperty('--mfs', '100px');
  const mw = mailSpan.getBoundingClientRect().width;
  const room = $('.mailwrap').getBoundingClientRect().width - (narrow ? 0 : 20);
  m.style.setProperty('--mfs', Math.min(100 * room / mw, 150).toFixed(2) + 'px');
};

/* ================= clock + day and night on India time ================= */
const tick = () => { $('.clock').textContent = new Intl.DateTimeFormat('en-GB', { timeZone: PERSON.tz, hour: '2-digit', minute: '2-digit' }).format(new Date()); };
tick(); setInterval(tick, 15000);
const istHour = () => +new Intl.DateTimeFormat('en-GB', { timeZone: PERSON.tz, hour: '2-digit', hourCycle: 'h23' }).format(new Date());
const PAPER = new THREE.Color('#ecebe6'), INKC = new THREE.Color('#141412');
let night = false, onTheme = () => {};
const themeB = $('.theme-b');
const setTheme = n => {
  night = n; document.documentElement.classList.toggle('night', n);
  themeB.textContent = n ? 'Lights on' : 'Lights off'; themeB.setAttribute('aria-pressed', String(n));
  PAPER.set(n ? '#10100f' : '#ecebe6'); INKC.set(n ? '#ecebe6' : '#141412');
  document.querySelector('meta[name=theme-color]').content = n ? '#10100f' : '#ecebe6';
  onTheme();
};
themeB.addEventListener('click', () => setTheme(!night));

/* ================= smooth scroll (fine pointers only) ================= */
let lenis = null;
if (!reduce && fine) { try { const { default: Lenis } = await import('./vendor/lenis.mjs?v=3'); lenis = new Lenis({ lerp: 0.085 }); } catch { lenis = null; } }
const scrollToY = (y, imm) => { if (lenis) lenis.scrollTo(y, { duration: imm ? 0 : 1.6, immediate: !!imm, force: true }); else window.scrollTo({ top: y, behavior: imm || reduce ? 'auto' : 'smooth' }); };
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href').slice(1); const el = id === 'top' ? null : document.getElementById(id);
  e.preventDefault(); scrollToY(el ? el.getBoundingClientRect().top + scrollY : 0);
}));

/* ================= scroll timeline (in vh) ================= */
const SEG = { ASM: 140, DIVE: 110, PJ: 150, OUT: 110 };
const TOTAL = SEG.ASM + SEG.DIVE + N * SEG.PJ + SEG.OUT;
const stageEl = $('.stage'), contactEl = $('#contact');
stageEl.style.height = `${100 + TOTAL}vh`;
let U = vh / 100, stageTop = 0, contactTop = 1e9;
const yAt = u => stageTop + u * U;
const projY = (i, t = 0.06) => yAt(SEG.ASM + SEG.DIVE + (i + t) * SEG.PJ);
function goProject(i) { scrollToY(projY(clamp(i, 0, N - 1))); }

/* ================= case sheet ================= */
const caseEl = $('.case');
function openCase(i) {
  const p = P[i];
  caseEl.querySelector('.case-img img').src = p.img;
  caseEl.querySelector('.case-n').textContent = `Project ${pad2(i + 1)} / ${pad2(N)}`;
  caseEl.querySelector('.case-t').textContent = p.t;
  const h = caseEl.querySelector('.case-hook'); h.textContent = p.hook; h.style.color = p.c;
  caseEl.querySelector('.case-d').textContent = p.d;
  caseEl.querySelector('.case-b').innerHTML = p.b.map(x => `<li>${x}</li>`).join('');
  caseEl.querySelector('.case-s').textContent = p.s;
  caseEl.querySelector('.case-l').innerHTML = p.l.map(([t, h2]) => `<a href="${h2}" target="_blank" rel="noopener">${t} ↗</a>`).join('');
  lenis?.stop();
  caseEl.hidden = false; requestAnimationFrame(() => caseEl.classList.add('on')); caseEl.querySelector('.case-x').focus({ preventScroll: true });
}
const closeCase = () => { caseEl.classList.remove('on'); lenis?.start(); setTimeout(() => { caseEl.hidden = true; }, 450); };
caseEl.querySelector('.case-x').addEventListener('click', closeCase);
caseEl.addEventListener('click', e => { if (e.target === caseEl) closeCase(); });

/* ================= pointer, cursor, magnetic buttons ================= */
const cur = $('.cursor'), curS = cur.querySelector('span');
let px = -1e4, py = -1e4, cx = -100, cy = -100, hasMouse = false;
const mouse = new THREE.Vector2(-9, -9), mouseS = new THREE.Vector2();
addEventListener('pointermove', e => {
  px = e.clientX; py = e.clientY; hasMouse = e.pointerType === 'mouse';
  mouse.set(e.clientX / vw * 2 - 1, -(e.clientY / vh) * 2 + 1);
  if (!fine) return;
  for (const b of $$('.mag, .links a, .links button, .case-x, .totop, .tgl')) {
    const r = b.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) continue;
    const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2), d = Math.hypot(dx, dy);
    const k = d < 90 ? (1 - d / 90) : 0;
    b.style.transform = k ? `translate(${(dx * k * .3).toFixed(1)}px,${(dy * k * .3).toFixed(1)}px)` : '';
  }
});
const weigh = (els, base, peak, sig) => {
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
    const w = Math.round(base + (peak - base) * Math.exp(-(dx * dx + dy * dy) / (sig * sig)));
    if (el._w !== w) { el._w = w; el.style.fontWeight = w; }
  }
};
const nameCs = $$('.name .c'), mailCs = [...mailSpan.children];

/* experience: the number that matters follows you */
const flt = $('.float'), fltB = flt.querySelector('b'), fltS = flt.querySelector('span');
let fx = 0, fy = 0, frot = 0, fOn = false;
$$('.rows li').forEach(li => {
  li.addEventListener('pointerenter', () => { fltB.textContent = li.dataset.k; fltS.textContent = li.dataset.l; fOn = true; flt.classList.add('on'); });
  li.addEventListener('pointerleave', () => { fOn = false; flt.classList.remove('on'); });
});

/* counters */
const nums = $$('.stats dd');
let counted = false;
const countUp = () => {
  counted = true; const t0c = performance.now();
  const step = now => { const k = Math.min(1, (now - t0c) / 1600), e = 1 - Math.pow(1 - k, 3);
    nums.forEach(n => { n.textContent = Math.round(+n.dataset.n * e) + n.dataset.s; }); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
};

/* things that run every frame, with or without WebGL */
const progC = $('.prog .pv');
function domTick(y) {
  cx = lerp(cx, px, 0.22); cy = lerp(cy, py, 0.22);
  cur.style.transform = `translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px)`;
  { const nx = px + 34, ny = py - 40; const vx = nx - fx; fx = lerp(fx, nx, .16); fy = lerp(fy, ny, .16); frot = lerp(frot, clamp(vx * .25, -14, 14), .12);
    if (fOn) flt.style.transform = `translate(${fx.toFixed(1)}px,${fy.toFixed(1)}px) translateY(-100%) rotate(${frot.toFixed(2)}deg)`; }
  if (!counted && nums[0].getBoundingClientRect().top < vh * .9) countUp();
  const br = big.getBoundingClientRect();
  if (br.top < vh && br.bottom > 0) {
    const wp = clamp((vh * .85 - br.top) / (br.height + vh * .3));
    const lit = Math.floor(wp * words.length * 1.05);
    words.forEach((w, i) => w.classList.toggle('lit', i < lit));
  }
  if (fine) weigh(mailCs, 500, 300, vw * 0.06);
  const mx = document.documentElement.scrollHeight - vh;
  progC.style.strokeDashoffset = (56.55 * (1 - clamp(y / Math.max(1, mx)))).toFixed(2);
}

/* ================= WebGL ================= */
const canvas = $('#stage');
let renderer = null;
try {
  const probe = document.createElement('canvas');
  if (hash.get('gl') === '0' || !(probe.getContext('webgl2') || probe.getContext('webgl'))) throw new Error('no webgl');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch { renderer = null; }

const measureBase = () => {
  vw = innerWidth; vh = innerHeight; narrow = vw < 860;
  U = stageEl.offsetHeight / (100 + TOTAL);
  stageTop = stageEl.offsetTop; contactTop = contactEl.offsetTop;
  fitType();
};

if (!renderer) {
  /* no WebGL: the same facts, as a plain list */
  document.documentElement.classList.add('no3d');
  stageEl.style.height = 'auto';
  const fb = $('.fallback'); fb.hidden = false;
  fb.innerHTML = P.map((p, i) => `<article><img src="${p.img}" alt="${p.t}" loading="lazy"><p class="mono">${pad2(i + 1)} / ${pad2(N)}</p><h3>${p.t}</h3><p class="hook" style="color:${p.c}">${p.hook}</p><p>${p.d}</p><p class="links">${p.l.map(([t, h]) => `<a href="${h}" target="_blank" rel="noopener">${t} ↗</a>`).join('')}</p></article>`).join('');
  $('.loader').classList.add('done'); document.documentElement.classList.add('ready');
  { const hh = istHour(); const q = hash.get('theme'); setTheme(q ? q === 'night' : (hh >= 19 || hh < 6)); }
  measureBase(); addEventListener('resize', measureBase); document.fonts?.ready.then(measureBase);
  const loop = now => { requestAnimationFrame(loop); lenis?.raf(now); domTick(scrollY); };
  requestAnimationFrame(loop);
} else {
  run3D();
}

function run3D() {
  const weak = !fine || (navigator.hardwareConcurrency || 8) <= 4;
  const PR_MAX = Math.min(devicePixelRatio || 1, fine ? 1.75 : 1.3);
  let pr = PR_MAX;
  renderer.setPixelRatio(pr);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.85;
  const camera = new THREE.PerspectiveCamera(34, 1, 0.08, 120);
  const maxAniso = renderer.capabilities.getMaxAnisotropy();

  /* ---------- the ring of screens ---------- */
  const R = 6, STEP = Math.PI * 2 / N, ARC = STEP * 0.8;
  const W = 2 * R * Math.sin(ARC / 2), H = W / 1.6;
  const FLOOR = -H / 2 - 0.12;            // ring-local, and world when the ring is grounded
  const TOP = H / 2 + 0.26, HUBY = TOP + 1.3, HUBR = 0.66;
  const ring = new THREE.Group(); scene.add(ring);
  const geo = new THREE.CylinderGeometry(R, R, H, 64, 12, true, -ARC / 2, ARC);
  const panels = [];
  const loader = new THREE.TextureLoader();
  const BLANK = new THREE.DataTexture(new Uint8Array([236, 235, 230, 255]), 1, 1); BLANK.needsUpdate = true;
  let loaded = 0;
  const countEl = $('.loader .count'); const LOAD_T0 = performance.now(); const NEED = Math.min(3, N);
  const lParts = [...document.querySelectorAll('.l-parts li')];
  let shownP = 0, targetP = 0;
  function loadProgress(f, name) { targetP = f; if (name) $('.lname').textContent = 'Unpacking: ' + name; }
  requestAnimationFrame(function tickLoader() {
    shownP += (targetP - shownP) * 0.12; if (targetP - shownP < 0.002) shownP = targetP;
    countEl.textContent = String(Math.round(shownP * 100)).padStart(3, '0');
    $('.l-rule i').style.width = (shownP * 100).toFixed(1) + '%';
    lParts.forEach((li, k) => { const n = +li.dataset.n, v = Math.round(n * Math.min(1, shownP * 1.25 - k * 0.04)); li.querySelector('i').textContent = Math.max(0, v); li.classList.toggle('full', v >= n); });
    if (!started || shownP < 1) requestAnimationFrame(tickLoader);
  });
  P.forEach((p, i) => {
    const u = {
      uTex: { value: BLANK }, uBack: { value: null }, uIA: { value: 1.6 }, uPA: { value: W / H }, uHover: { value: 0 }, uActive: { value: 0.6 }, uVel: { value: 0 },
      uMirror: { value: 0 }, uFogN: { value: 12 }, uFogF: { value: 34 }, uPaper: { value: PAPER }, uInk: { value: INKC }, uAcc: { value: new THREE.Color(p.c) },
      uMouse: { value: new THREE.Vector2(.5, .5) }, uDim: { value: .18 }, uScroll: { value: 0 }, uFade: { value: 1 }, uFlip: { value: 0 }, uLit: { value: 0 }, uFlash: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: vert, fragmentShader: frag, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat);
    const mu = { ...u, uMirror: { value: 1 }, uFade: { value: 0 } };
    const mirror = new THREE.Mesh(geo, new THREE.ShaderMaterial({ uniforms: mu, vertexShader: vert, fragmentShader: frag, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    mirror.scale.y = -1; mirror.position.y = 2 * FLOOR;
    const g = new THREE.Group(); g.rotation.y = -i * STEP; g.add(mesh, mirror); ring.add(g);
    mesh.userData.i = i;
    panels.push({ mesh, mirror, u, mu, g, hover: 0, act: .6, sc: 0, since: 0, flip: 0, hy: null, lit: 0, flash: 0 });
    loader.load(p.img, tex => {
      tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = Math.min(8, maxAniso); tex.minFilter = THREE.LinearMipmapLinearFilter;
      u.uTex.value = tex; u.uIA.value = tex.image.width / tex.image.height;
      loaded++; loadProgress(Math.min(1, loaded / NEED), p.t);
      if (loaded === NEED) setTimeout(start, Math.max(600, 2300 - (performance.now() - LOAD_T0)));
    }, undefined, () => { loaded++; if (loaded === NEED) setTimeout(start, 350); });
  });
  const floorRing = new THREE.Mesh(new THREE.TorusGeometry(R, 0.012, 6, 240), new THREE.MeshBasicMaterial({ color: INKC.clone(), transparent: true, opacity: 0.18, toneMapped: false }));
  floorRing.rotation.x = Math.PI / 2; floorRing.position.y = FLOOR; ring.add(floorRing);

  /* ---------- light, shadow, floor ---------- */
  const sun = new THREE.DirectionalLight(0xffffff, 1.7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(weak ? 1024 : 2048, weak ? 1024 : 2048);
  sun.shadow.bias = -0.0006; sun.shadow.radius = 6;
  scene.add(sun, sun.target, new THREE.HemisphereLight(0xffffff, 0xd8d8de, 0.35));
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.14 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = FLOOR; floor.receiveShadow = true; scene.add(floor);
  const setShadowBox = (fx, fz, half) => {
    sun.target.position.set(fx, FLOOR, fz); sun.position.set(fx + 3.5, FLOOR + 11, fz + 5);
    const c = sun.shadow.camera;
    if (c.right !== half) { c.left = -half; c.right = half; c.top = half; c.bottom = -half; c.near = 1; c.far = 34; c.updateProjectionMatrix(); }
  };

  /* ---------- the kit of parts ---------- */
  const GEO = {
    rbox: new RoundedBoxGeometry(1, 1, 1, 4, 0.14),
    cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 40),
    sph: new THREE.SphereGeometry(0.5, 40, 28),
    cap: new THREE.CapsuleGeometry(0.25, 0.5, 8, 20),
    tor: new THREE.TorusGeometry(0.5, 0.14, 20, 64),
  };
  const FIN = {
    w: { col: '#f3f2ef', rough: 0.34, metal: 0, op: 1 },
    k: { col: '#141416', rough: 0.24, metal: 0, op: 1 },
    g: { col: '#a9a9b0', rough: 0.3, metal: 0, op: 1 },
    m: { col: '#e4e4e9', rough: 0.12, metal: 1, op: 1 },
    o: { col: '#ff4d1c', rough: 0.3, metal: 0, op: 1 },
    glass: { col: '#ffffff', rough: 0.04, metal: 0, op: 0.26 },
  };
  const finOf = (key, accent) => key === 'a' ? { col: accent, rough: 0.3, metal: 0, op: 1 } : key === 'glow' ? { col: accent, rough: 0.3, metal: 0, op: 1, emi: 1.4 } : FIN[key] || FIN.w;
  const mkState = () => ({ p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3(1, 1, 1), col: new THREE.Color('#f3f2ef'), rough: 0.34, metal: 0, op: 1, emi: 0 });
  const copyState = (a, b) => { a.p.copy(b.p); a.q.copy(b.q); a.s.copy(b.s); a.col.copy(b.col); a.rough = b.rough; a.metal = b.metal; a.op = b.op; a.emi = b.emi; return a; };
  const setFin = (out, f) => { out.col.set(f.col); out.rough = f.rough; out.metal = f.metal; out.op = f.op ?? 1; out.emi = f.emi || 0; return out; };
  const UP = new THREE.Vector3(0, 1, 0), E = new THREE.Euler();

  const PILE_S = narrow ? 0.7 : 0.8;
  const pieces = [];
  for (const [type, n] of Object.entries(POOL)) for (let i = 0; i < n; i++) {
    const mat = new THREE.MeshPhysicalMaterial({ color: '#f3f2ef', roughness: 0.34, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.14, transparent: true, emissive: '#000' });
    const mesh = new THREE.Mesh(GEO[type], mat);
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.userData.k = pieces.length;
    scene.add(mesh);
    const u = (0.55 + rnd() * 0.35) * PILE_S;
    const hs = type === 'rbox' ? new THREE.Vector3(u * (0.8 + rnd() * 0.6), u * (0.6 + rnd() * 0.5), u) : type === 'cyl' ? new THREE.Vector3(u, u * (0.4 + rnd() * 1.1), u) : type === 'cap' ? new THREE.Vector3(u * 1.4, u * 1.5, u * 1.4) : type === 'tor' ? new THREE.Vector3(u * 1.5, u * 1.5, u * 1.5) : new THREE.Vector3(u, u, u);
    const heroFin = rnd() < 0.06 ? 'o' : ['w', 'w', 'k', 'g', 'w', 'k', 'm'][Math.floor(rnd() * 7)];
    pieces.push({ type, mesh, mat, hs, heroFin, delay: rnd() * 0.38, lift: 0.4 + rnd() * 1.4, axis: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(), tumble: 1.2 + rnd() * 2.4, cur: mkState(), tgt: mkState(), from: mkState(), to: mkState(), pile: mkState(), slot: null, snap: 0 });
  }
  const byType = t => pieces.filter(p => p.type === t);

  /* the frame: every piece has a place on the ring (ring-local) */
  const onR = (a, y, r = R) => new THREE.Vector3(Math.sin(a) * r, y, Math.cos(a) * r);
  const slotQ = new THREE.Quaternion();
  const FR = { rbox: [], cyl: [], sph: [], cap: [], tor: [] };
  const linkSlot = (a, b, rad, fin, ang) => { const d = b.clone().sub(a); return { p: a.clone().add(b).multiplyScalar(0.5), q: new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize()), s: new THREE.Vector3(rad * 2, d.length(), rad * 2), fin, ang }; };
  const yawQ = a => new THREE.Quaternion().setFromAxisAngle(UP, a);
  for (let s = 0; s < N; s++) { // the seams between screens
    const a = -(s + 0.5) * STEP;
    FR.cyl.push({ p: onR(a, (FLOOR + TOP) / 2), q: new THREE.Quaternion(), s: new THREE.Vector3(0.07, TOP - FLOOR, 0.07), fin: FIN.m, ang: a, seam: s });
    FR.rbox.push({ p: onR(a, FLOOR + 0.1), q: yawQ(a), s: new THREE.Vector3(0.4, 0.2, 0.4), fin: FIN.w, ang: a });
    FR.sph.push({ p: onR(a, TOP), q: new THREE.Quaternion(), s: new THREE.Vector3(0.24, 0.24, 0.24), fin: FIN.k, ang: a, seam: s });
  }
  for (let s = 0; s < N; s++) { const a = -(s + 0.5) * STEP; FR.cyl.push(linkSlot(onR(a, TOP), onR(a, HUBY, HUBR), 0.03, FIN.m, a)); }
  for (let i = 0; i < N; i++) { // each screen: an accent rail on top, a shoe below
    const a = -i * STEP, tan = new THREE.Vector3(Math.cos(a), 0, -Math.sin(a));
    FR.cap.push({ p: onR(a, H / 2 + 0.07, R), q: new THREE.Quaternion().setFromUnitVectors(UP, tan), s: new THREE.Vector3(0.24, 1.7, 0.24), fin: finOf('a', P[i].c), ang: a, screen: i });
    FR.rbox.push({ p: onR(a, FLOOR + 0.11, R), q: yawQ(a), s: new THREE.Vector3(0.8, 0.22, 0.3), fin: FIN.k, ang: a });
  }
  // the hub the ring hangs from
  FR.cyl.push(linkSlot(new THREE.Vector3(0, HUBY + 0.5, 0), new THREE.Vector3(0, HUBY + 3.4, 0), 0.04, FIN.m, null));
  FR.sph.push({ p: new THREE.Vector3(0, HUBY, 0), q: new THREE.Quaternion(), s: new THREE.Vector3(0.5, 0.5, 0.5), fin: FIN.o, ang: null });
  FR.sph.push({ p: new THREE.Vector3(0, HUBY + 3.4, 0), q: new THREE.Quaternion(), s: new THREE.Vector3(0.3, 0.3, 0.3), fin: FIN.m, ang: null });
  FR.sph.push({ p: new THREE.Vector3(0, HUBY + 0.5, 0), q: new THREE.Quaternion(), s: new THREE.Vector3(0.15, 0.15, 0.15), fin: FIN.m, ang: null });
  FR.sph.push({ p: new THREE.Vector3(0, HUBY - 0.5, 0), q: new THREE.Quaternion(), s: new THREE.Vector3(0.15, 0.15, 0.15), fin: FIN.m, ang: null });
  FR.rbox.push({ p: new THREE.Vector3(0, HUBY + 0.85, 0), q: new THREE.Quaternion(), s: new THREE.Vector3(0.52, 0.3, 0.52), fin: FIN.w, ang: null });
  FR.rbox.push({ p: new THREE.Vector3(0, HUBY + 1.15, 0), q: new THREE.Quaternion(), s: new THREE.Vector3(0.36, 0.24, 0.36), fin: FIN.k, ang: null });
  FR.tor.push({ p: new THREE.Vector3(0, HUBY, 0), q: new THREE.Quaternion().setFromEuler(E.set(Math.PI / 2, 0, 0)), s: new THREE.Vector3(1.32, 1.32, 1.1), fin: FIN.w, ang: null });
  FR.tor.push({ p: new THREE.Vector3(0, HUBY, 0), q: new THREE.Quaternion(), s: new THREE.Vector3(0.8, 0.8, 0.8), fin: FIN.m, ang: null, spin: 1 });
  FR.tor.push({ p: new THREE.Vector3(0, HUBY, 0), q: new THREE.Quaternion().setFromEuler(E.set(0, Math.PI / 2, 0)), s: new THREE.Vector3(0.8, 0.8, 0.8), fin: FIN.k, ang: null, spin: 1 });
  for (const t of Object.keys(FR)) { const list = byType(t); if (list.length !== FR[t].length) console.warn('frame slots', t, list.length, FR[t].length); list.forEach((pc, j) => { pc.slot = FR[t][j]; }); }
  const railOf = []; pieces.forEach(pc => { if (pc.slot?.screen !== undefined) railOf[pc.slot.screen] = pc; });

  /* the objects: shapes from forms.js, normalised to one size */
  const FORM_SIZE = narrow ? 1.35 : 1.3;
  const angDiff = (a, b) => Math.abs(wrapA(a - b));
  const forms = FORMS.map((f, fi) => {
    const p = P.find(x => x.k === f.k), how = HOW[f.k];
    const mn = new THREE.Vector3(1e9, 1e9, 1e9), mx = new THREE.Vector3(-1e9, -1e9, -1e9);
    const parts = f.parts.map(part => {
      const st = { t: part.t, p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3(), e: new THREE.Vector3(...(part.e || [0, 0, 0])), fin: finOf(part.c, p.c), h: part.h };
      if (part.link) {
        const a = new THREE.Vector3(...part.link[0]), b = new THREE.Vector3(...part.link[1]), d = b.clone().sub(a);
        st.p.copy(a).add(b).multiplyScalar(0.5); st.q.setFromUnitVectors(UP, d.clone().normalize()); st.s.set(part.rad * 2, d.length(), part.rad * 2);
      } else { st.p.set(...part.p); st.s.set(...part.s); if (part.r) st.q.setFromEuler(E.set(...part.r)); }
      const hx = Math.max(st.s.x, st.s.z) / 2, hy = (part.t === 'cap' || part.link) ? 0.15 : st.s.y / 2;
      mn.min(new THREE.Vector3(st.p.x - hx, st.p.y - hy, st.p.z - hx)); mx.max(new THREE.Vector3(st.p.x + hx, st.p.y + hy, st.p.z + hx));
      return st;
    });
    const size = mx.clone().sub(mn), c = mx.clone().add(mn).multiplyScalar(0.5);
    const S = FORM_SIZE / Math.max(size.x, size.y);
    for (const st of parts) st.p.sub(c);
    // borrow parts from the far side of the ring, so the frame around this screen stays whole
    const scrA = -fi * STEP, assign = new Map(), pools = {};
    for (const t of Object.keys(POOL)) pools[t] = byType(t).slice().sort((a, b) => (b.slot.ang == null ? 1.9 : angDiff(b.slot.ang, scrA)) - (a.slot.ang == null ? 1.9 : angDiff(a.slot.ang, scrA)));
    parts.forEach(st => { const pc = pools[st.t].shift(); if (pc) assign.set(pc.mesh.userData.k, st); else console.warn('not enough', st.t, f.k); });
    const labels = []; for (const [k, st] of assign) if (st.h !== undefined) labels[st.h] = k;
    return { k: f.k, p, how, parts, S, half: size.y * S / 2, assign, labels };
  });

  /* ---------- physics: only the hero pile and the contact pile ---------- */
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -22, 0) });
  world.allowSleep = true;
  world.defaultContactMaterial.friction = 0.32;
  world.defaultContactMaterial.restitution = 0.22;
  world.solver.iterations = 8;
  const addPlane = (euler) => { const b = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() }); b.quaternion.setFromEuler(...euler); world.addBody(b); return b; };
  const ground = addPlane([-Math.PI / 2, 0, 0]); ground.position.set(0, FLOOR, 0);
  const wallL = addPlane([0, Math.PI / 2, 0]), wallR = addPlane([0, -Math.PI / 2, 0]), wallB = addPlane([0, 0, 0]), wallF = addPlane([0, Math.PI, 0]);
  const box = { x0: -4, x1: 4, z0: 4.6, z1: 7.8 };
  const setBox = (x0, x1, z0, z1) => { Object.assign(box, { x0, x1, z0, z1 }); wallL.position.set(x0, 0, 0); wallR.position.set(x1, 0, 0); wallB.position.set(0, 0, z0); wallF.position.set(0, 0, z1); };
  for (const pc of pieces) {
    const h = pc.hs; let shape, ori;
    if (pc.type === 'rbox') shape = new CANNON.Box(new CANNON.Vec3(h.x / 2, h.y / 2, h.z / 2));
    else if (pc.type === 'sph') shape = new CANNON.Sphere(h.x / 2);
    else if (pc.type === 'cyl') shape = new CANNON.Cylinder(h.x / 2, h.x / 2, h.y, 14);
    else if (pc.type === 'cap') shape = new CANNON.Cylinder(h.x * 0.25, h.x * 0.25, h.y, 12);
    else { shape = new CANNON.Cylinder(h.x * 0.64, h.x * 0.64, h.x * 0.28, 16); ori = new CANNON.Quaternion().setFromEuler(Math.PI / 2, 0, 0); }
    const body = new CANNON.Body({ mass: 1 + h.x * h.y, linearDamping: 0.08, angularDamping: 0.12, sleepSpeedLimit: 0.15 });
    body.addShape(shape, new CANNON.Vec3(), ori);
    world.addBody(body); pc.body = body;
  }
  const hand = new CANNON.Body({ mass: 0, type: CANNON.Body.KINEMATIC, shape: new CANNON.Sphere(0.75 * PILE_S) });
  hand.position.set(0, -50, 0); world.addBody(hand);
  const dropAll = () => {
    for (const pc of pieces) {
      const b = pc.body, w = (box.x1 - box.x0) / 2, c = (box.x0 + box.x1) / 2;
      b.position.set(c + (rnd() - 0.5) * 2 * w * 0.8, FLOOR + 3 + rnd() * 9, (box.z0 + box.z1) / 2 + (rnd() - 0.5) * (box.z1 - box.z0) * 0.8);
      b.quaternion.setFromEuler(rnd() * 6, rnd() * 6, rnd() * 6);
      b.velocity.set(0, 0, 0); b.angularVelocity.set((rnd() - 0.5) * 6, (rnd() - 0.5) * 6, (rnd() - 0.5) * 6);
      b.wakeUp();
    }
  };
  // let the parts fall out of wherever they are now
  const releaseFromCur = () => {
    for (const pc of pieces) {
      const b = pc.body, c = pc.cur.p, m = 0.45;
      b.position.set(clamp(c.x, box.x0 + m, box.x1 - m), Math.max(c.y, FLOOR + 0.6), clamp(c.z, box.z0 + m, box.z1 - m));
      b.quaternion.set(pc.cur.q.x, pc.cur.q.y, pc.cur.q.z, pc.cur.q.w);
      b.velocity.set((rnd() - 0.5) * 1.5, rnd() * 1.5, (rnd() - 0.5) * 1.5); b.angularVelocity.set((rnd() - 0.5) * 3, (rnd() - 0.5) * 3, (rnd() - 0.5) * 3);
      b.wakeUp();
    }
  };
  const shake = (x, z, all) => {
    for (const pc of pieces) {
      const b = pc.body, dx = b.position.x - x, dz = b.position.z - z, d = Math.hypot(dx, dz);
      if (all || d < 3) { const k = (all ? 0.7 : 1 - d / 3) * 14; b.wakeUp(); b.applyImpulse(new CANNON.Vec3(dx / (d + .3) * k * .5, k, dz / (d + .3) * k * .5)); }
    }
  };

  /* ---------- views, per screen size ---------- */
  const V = {};
  const views = () => {
    const a = vw / vh;
    if (!narrow) {
      const hw = clamp(a * 2.2, 2.8, 3.8);
      Object.assign(V, {
        heroCam: [0, 2.3, 17.5], heroLook: [0, 0.9, 1.5], heroFov: 34, heroOff: [0, 0],
        halo: { p: [0, 2.1, -2.6], tilt: 0.2, s: 1 },
        pile: [-hw + 1.3, hw + 0.9, 4.6, 7.4],
        asmCam: [0, 4.3, 15.6], asmLook: [0, -0.9, 0], asmFov: 34,
        inCam: [0, 0.3, 0.9], inLook: [0, -0.2, -R], inWant: 0.5, inOff: [-0.085, 0],
        obj: [0, -3.2], objLift: 0.3,
        outCam: [0, 5.2, 17.5], outLook: [0, -0.4, 0], outFov: 34,
        conCam: [0, 2.3, 17.5], conLook: [0, 0.9, 1.5], conFov: 34, conOff: [0, 0],
        conRing: { p: [3.25, 3.75, 3.4], tilt: 0.26, s: 0.3 },
        conPile: [1.6, 4.75, 4.0, 7.4],
      });
    } else {
      Object.assign(V, {
        heroCam: [0, 3.2, 21], heroLook: [0, 1.6, 1.5], heroFov: 50, heroOff: [0, 0],
        halo: { p: [0, 2.4, -3.2], tilt: 0.22, s: 1 },
        pile: [-1.85, 1.85, 4.6, 7.4],
        asmCam: [0, 7.4, 24.5], asmLook: [0, -0.4, 0], asmFov: 50,
        inCam: [0, 0.5, 1.1], inLook: [0, -0.05, -R], inWant: 0.92, inOff: [0, 0.17],
        obj: [0, -2.6], objLift: 0.35,
        outCam: [0, 7, 22], outLook: [0, 0, 0], outFov: 50,
        conCam: [0, 3.2, 21], conLook: [0, 1.6, 1.5], conFov: 50, conOff: [0, -0.04],
        conRing: { p: [0, 1.3, 4.6], tilt: 0.3, s: 0.26 },
        conPile: [-1.85, 1.85, 4.4, 7.4],
      });
    }
  };
  const insideFov = () => {
    const dist = R * Math.cos(ARC / 2) + V.inCam[2];
    const th = (W / 2) / V.inWant / dist;
    return THREE.MathUtils.radToDeg(2 * Math.atan(th / camera.aspect));
  };

  /* ---------- layout ---------- */
  const measure = () => {
    measureBase();
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh; camera.updateProjectionMatrix();
    views();
    if (phase === 'contact') setBox(...V.conPile); else setBox(...V.pile);
  };

  /* ---------- the info card ---------- */
  const info = $('.info'), titleEl = $('.info .t'), pinEl = $('.pin'), phaseEl = $('.n-phase');
  let shown = -1, swapT = 0;
  const showInfo = i => {
    if (i === shown) return;
    const first = shown < 0; shown = i;
    const p = P[i];
    info.classList.add('swap'); titleEl.classList.remove('in');
    clearTimeout(swapT);
    swapT = setTimeout(() => {
      $('.n-i').textContent = pad2(i + 1);
      chars(titleEl, p.t); [...titleEl.querySelectorAll('.c')].forEach((c, j) => c.style.transitionDelay = (j * 0.022) + 's');
      $('.info .hook').textContent = p.hook; $('.info .d').textContent = p.d; $('.info .s').textContent = p.s;
      const l = $('.info .links');
      l.innerHTML = p.l.map(([t, h]) => `<a href="${h}" target="_blank" rel="noopener">${t} ↗</a>`).join('') + `<button type="button" class="flipb">How it works ⟲</button><button type="button" class="more">Read more</button>`;
      l.querySelector('.more').addEventListener('click', () => openCase(i));
      l.querySelector('.flipb').addEventListener('click', toggleApart);
      requestAnimationFrame(() => { titleEl.classList.add('in'); info.classList.remove('swap'); });
    }, first ? 0 : 260);
    document.documentElement.style.setProperty('--pc', p.c);
    [...idx.children].forEach((li, j) => li.classList.toggle('on', j === i));
  };
  // F, the button, or a click on the object: take it apart, or put it back
  let manual = null, manualS = 0;
  function toggleApart() { if (active < 0) return; const now = apartNow > 0.5; manual = { i: active, v: now ? 0 : 1 }; }
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && !caseEl.hidden) closeCase();
    if (!caseEl.hidden || e.metaKey || e.ctrlKey || e.altKey) return;
    const inProj = phase === 'proj' || phase === 'dive' && diveK > 0.8;
    if (!inProj) return;
    if (/^[1-9]$/.test(e.key) && +e.key <= N) goProject(+e.key - 1);
    if (e.key === 'ArrowRight') { e.preventDefault(); goProject(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goProject(active - 1); }
    if (e.key === 'f' || e.key === 'F') toggleApart();
  });

  /* ---------- labels for the exploded view ---------- */
  const labBox = $('.labels'), svg = $('.leaders');
  const labEls = [], lines = [];
  for (let i = 0; i < 6; i++) {
    const d = document.createElement('div'); d.className = 'lab'; d.style.opacity = 0; labBox.appendChild(d); labEls.push(d);
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line'), c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('r', '3'); l.style.opacity = 0; c.style.opacity = 0; svg.append(l, c); lines.push([l, c]);
  }
  let labFor = -1;

  /* ---------- pointer on the canvas ---------- */
  const ray = new THREE.Raycaster(), handPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3();
  const ndc = new THREE.Vector2();
  let hoverPanel = -1, hoverObj = false, dragging = false, spin = Math.PI, spinV = 0, dragX = 0, moved = 0, downAt = null;
  const toNdc = e => ndc.set(e.clientX / vw * 2 - 1, -(e.clientY / vh) * 2 + 1);
  const physPhase = () => phase === 'hero' || phase === 'contact';
  addEventListener('pointerdown', e => {
    if (e.target.closest('a,button,li,.case,.top,.exp,.about,.lab')) return;
    downAt = { x: e.clientX, y: e.clientY }; moved = 0;
    if (phase === 'hero' && hoverPanel >= 0 && fine) { dragging = true; dragX = e.clientX; spinV = 0; return; }
  });
  addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - dragX; dragX = e.clientX; moved += Math.abs(dx);
    spin += dx * 0.005; spinV = dx * 0.005;
  });
  addEventListener('pointerup', e => {
    const wasDrag = dragging; dragging = false;
    if (!downAt) return;
    const d = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y); downAt = null;
    if (wasDrag && moved > 6) return;
    if (d > 8 || e.target.closest('a,button,li,.case,.top,.exp,.about')) return;
    if (physPhase()) {
      handPlane.constant = -(FLOOR + 0.7);
      ray.setFromCamera(toNdc(e), camera);
      if (ray.ray.intersectPlane(handPlane, hit)) shake(hit.x, hit.z, false);
    } else if (phase === 'proj' || phase === 'dive') {
      if (!fine) { ray.setFromCamera(toNdc(e), camera); hoverObj = ray.intersectObjects(pieces.filter(pc => inForm(pc, active)).map(pc => pc.mesh), false).length > 0; }
      if (hoverObj) toggleApart();
      else if (hoverPanel >= 0 && hoverPanel === active) openCase(active);
    } else if ((phase === 'asm') && hoverPanel >= 0) goProject(hoverPanel);
  });

  /* ---------- theme ---------- */
  onTheme = () => {
    floor.material.opacity = night ? 0.42 : 0.14;
    scene.environmentIntensity = night ? 0.6 : 0.85;
    floorRing.material.color.copy(INKC);
  };

  /* ---------- the back of every screen ---------- */
  const buildBlueprints = () => panels.forEach((pn, i) => { if (!pn.u.uBack.value) { pn.u.uBack.value = blueprint(P[i], i, HOW[P[i].k], maxAniso); renderer.initTexture(pn.u.uBack.value); } });

  /* ---------- per-frame state ---------- */
  let phase = 'hero', lastPhase = 'hero', active = -1, diveK = 0, apartNow = 0;
  let started = false, startAt = 0, intro = 0, t0 = performance.now(), raf = 0, frames = 0, slow = 0, level = weak ? 3 : 0, shadowEvery = weak ? 12 : 1;
  let ringY = Math.PI, vel = 0, lastY = scrollY;
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3(), tv = new THREE.Vector3(), tv2 = new THREE.Vector3();
  const ringQ = new THREE.Quaternion(), ringS = new THREE.Vector3(), spinQ = new THREE.Quaternion(), tiltQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.16, 0, 0)), formQ = new THREE.Quaternion();
  const objC = new THREE.Vector3();
  const v3 = a => tv.set(a[0], a[1], a[2]);
  const pose = { p: new THREE.Vector3(), tilt: 0, s: 1 };
  const setPose = (o, a, k = 1) => { o.p.lerp(tv2.set(...a.p), k); o.tilt = lerp(o.tilt, a.tilt, k); o.s = lerp(o.s, a.s, k); };

  function frameState(pc, t, out) {
    const sl = pc.slot;
    out.p.copy(sl.p).applyMatrix4(ring.matrixWorld);
    out.q.copy(ringQ);
    if (sl.spin) out.q.multiply(spinQ);
    out.q.multiply(sl.q);
    out.s.copy(sl.s).multiplyScalar(ringS.x);
    return setFin(out, sl.fin);
  }
  function formState(pc, fi, ex, t, out) {
    const f = forms[fi], st = f.assign.get(pc.mesh.userData.k);
    const yaw = -0.5 + Math.sin(t * 0.22 + fi) * 0.38 + (fine ? mouseS.x * 0.35 : 0);
    formQ.setFromAxisAngle(UP, yaw).premultiply(tiltQ);
    out.p.copy(st.e).multiplyScalar(ex * 0.85).add(st.p).multiplyScalar(f.S).applyQuaternion(formQ);
    out.p.x += V.obj[0]; out.p.z += V.obj[1]; out.p.y += FLOOR + V.objLift + f.half + Math.sin(t * 0.9 + fi) * 0.03;
    out.q.copy(formQ).multiply(st.q);
    out.s.copy(st.s).multiplyScalar(f.S);
    return setFin(out, st.fin);
  }
  const inForm = (pc, fi) => fi >= 0 && fi < N && forms[fi].assign.has(pc.mesh.userData.k);
  const stateOf = (pc, fi, ex, t, out) => inForm(pc, fi) ? formState(pc, fi, ex, t, out) : frameState(pc, t, out);
  const tumQ = new THREE.Quaternion();
  function blend(a, b, k, lift, out, pc) {
    out.p.lerpVectors(a.p, b.p, k); out.p.y += Math.sin(Math.PI * k) * lift;
    out.q.slerpQuaternions(a.q, b.q, k);
    if (pc && !reduce) out.q.multiply(tumQ.setFromAxisAngle(pc.axis, Math.sin(Math.PI * k) * pc.tumble));
    out.s.lerpVectors(a.s, b.s, k);
    out.col.copy(a.col).lerp(b.col, k);
    out.rough = lerp(a.rough, b.rough, k); out.metal = lerp(a.metal, b.metal, k); out.op = lerp(a.op, b.op, k); out.emi = lerp(a.emi, b.emi, k);
    return out;
  }
  const stag = (pc, k) => ease(clamp((k - pc.delay) / (1 - 0.38)));
  const snapPulse = k => 1 + 0.28 * Math.sin(Math.PI * clamp((k - 0.82) / 0.18));

  const nameEl = $('.name'), heroCopy = $('.hero-copy'), heroHint = $('.hero-hint'), asmNote = $('.asm-note'), asmN = $('.asm-n'), cueT = $('.cue-t');
  const outroEl = $('.outro'), hintEl = $('.hint'), topEl = $('.top');
  let snapped = 0;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    lenis?.raf(now);
    const dt = Math.min(0.05, (now - t0) / 1000); t0 = now;
    const t = now / 1000;
    if (started) intro = Math.min(1, (now - startAt) / 2600);
    const y = scrollY;
    domTick(y);
    if (fine && mouse.x > -2) mouseS.lerp(mouse, 0.05);
    const v = lenis ? lenis.velocity : (y - lastY); lastY = y;
    vel = lerp(vel, clamp(v / 60, -1, 1), 0.12);

    /* where are we */
    const u = (y - stageTop) / U;
    const asmU = clamp(u / SEG.ASM);
    const diveU = clamp((u - SEG.ASM) / SEG.DIVE);
    const pf = (u - SEG.ASM - SEG.DIVE) / SEG.PJ;
    const outU = clamp((u - SEG.ASM - SEG.DIVE - N * SEG.PJ) / SEG.OUT);
    const inContact = contactTop - y < vh * 0.55;
    const covered = !inContact && u > TOTAL + 100 && contactTop - y > vh;
    phase = inContact ? 'contact' : u < 0.004 ? 'hero' : asmU < 1 ? 'asm' : diveU < 1 ? 'dive' : pf < N ? 'proj' : u <= TOTAL + 100 ? 'out' : 'between';

    if (phase !== lastPhase) {
      if (lastPhase === 'hero' || lastPhase === 'contact') for (const pc of pieces) copyState(pc.pile, pc.cur);
      if (phase === 'hero') { setBox(...V.pile); if (lastPhase !== 'contact') releaseFromCur(); else dropAll(); }
      if (phase === 'contact') { setBox(...V.conPile); releaseFromCur(); }
      if (phase === 'asm' && lastPhase !== 'hero') for (const pc of pieces) copyState(pc.pile, pc.cur);
      lastPhase = phase;
    }

    /* the ring: a dim halo, then grounded, then a small halo above the contact pile */
    let groundK = 0;
    if (phase === 'hero') { pose.p.set(...V.halo.p); pose.tilt = V.halo.tilt; pose.s = V.halo.s; }
    else if (phase === 'asm') { pose.p.set(...V.halo.p); pose.tilt = V.halo.tilt; pose.s = V.halo.s; const k = ease(sm(0.05, 0.78, asmU)); setPose(pose, { p: [0, 0, 0], tilt: 0, s: 1 }, k); groundK = sm(0.6, 1, k); }
    else if (phase === 'between' || phase === 'contact') { pose.p.set(...V.conRing.p); pose.tilt = V.conRing.tilt; pose.s = V.conRing.s; }
    else { pose.p.set(0, 0, 0); pose.tilt = 0; pose.s = 1; groundK = 1; }
    // turning
    if (!dragging) { spin += spinV; spinV *= 0.94; }
    let ringT;
    const kk = phase === 'proj' ? Math.floor(pf) + sm(0.7, 1, pf - Math.floor(pf)) : phase === 'out' ? N - 1 : 0;
    if (phase === 'hero') { if (!dragging && !reduce) spin += dt * 0.08 * intro; spin = Math.PI + wrapA(spin - Math.PI); ringT = spin - Math.PI * (1 - ease(intro)); }
    else if (phase === 'asm') ringT = Math.PI + wrapA(spin - Math.PI) * (1 - ease(sm(0, 0.85, asmU)));
    else if (phase === 'dive') ringT = Math.PI;
    else if (phase === 'proj') ringT = Math.PI + kk * STEP;
    else if (phase === 'out') ringT = Math.PI + kk * STEP + ease(outU) * STEP * 0.6;
    else ringT = Math.PI + (reduce ? 0 : t * 0.12);
    if (phase === 'hero' || phase === 'between') ringY = ringT; else ringY += (ringT - ringY) * (1 - Math.exp(-dt * 9));
    ring.position.copy(pose.p); ring.rotation.set(pose.tilt, ringY, 0); ring.scale.setScalar(pose.s);
    ring.updateMatrixWorld(true);
    ring.matrixWorld.decompose(tv2, ringQ, ringS);
    spinQ.setFromAxisAngle(UP, reduce ? 0.6 : t * 0.7);

    /* camera */
    const D = diveU, dE = ease(D);
    let fov, offX = 0, offY = 0;
    if (phase === 'hero' || phase === 'between' || phase === 'contact') {
      const c = phase === 'hero' ? V : { heroCam: V.conCam, heroLook: V.conLook, heroFov: V.conFov, heroOff: V.conOff };
      const iE = phase === 'hero' ? ease(intro) : 1;
      camPos.set(...c.heroCam); camPos.y += (1 - iE) * 2.5; camPos.z += (1 - iE) * 4;
      camLook.set(...c.heroLook);
      if (fine) { camPos.x += mouseS.x * 0.5; camPos.y += mouseS.y * 0.25; }
      fov = c.heroFov; [offX, offY] = c.heroOff;
    } else if (phase === 'asm') {
      const k = ease(asmU);
      camPos.set(...V.heroCam).lerp(v3(V.asmCam), k); camLook.set(...V.heroLook).lerp(v3(V.asmLook), k);
      if (fine) { camPos.x += mouseS.x * 0.5 * (1 - k); }
      fov = lerp(V.heroFov, V.asmFov, k);
    } else {
      // dive into the centre of the ring, like stepping inside
      const a = V.asmCam, b = V.inCam;
      const zc = lerp(a[2], b[2], dE), yc = b[1] + (a[1] - b[1]) * Math.pow(1 - dE, 0.55);
      camPos.set(0, yc, zc);
      camLook.set(...V.asmLook).lerp(v3(V.inLook), dE);
      fov = lerp(V.asmFov, insideFov(), dE);
      offX = V.inOff[0] * dE; offY = V.inOff[1] * dE;
      if (fine) { camLook.x += mouseS.x * 0.18 * dE; camLook.y += mouseS.y * 0.08 * dE; }
      if (phase === 'out') {
        const k = ease(sm(0.05, 0.9, outU));
        camPos.lerp(v3(V.outCam), k); camLook.lerp(v3(V.outLook), k); fov = lerp(fov, V.outFov, k); offX *= 1 - k; offY *= 1 - k;
      }
    }
    camera.position.copy(camPos); camera.lookAt(camLook);
    camera.fov = fov;
    if (offX || offY) camera.setViewOffset(vw, vh, offX * vw, offY * vh, vw, vh); else camera.clearViewOffset();
    camera.updateProjectionMatrix();

    /* where the object stands */
    objC.set(V.obj[0], FLOOR + 1, V.obj[1]);

    /* project progress */
    let pi = 0, pt = 0, ex = 0, tr = 0, flipA = 0;
    if (phase === 'proj') { pi = Math.min(N - 1, Math.floor(pf)); pt = pf - pi; ex = sm(0.2, 0.42, pt); tr = pi < N - 1 ? sm(0.64, 1, pt) : 0; flipA = sm(0.22, 0.4, pt) * (1 - sm(0.6, 0.72, pi < N - 1 ? pt : 0)); }
    if (phase === 'out') { pi = N - 1; ex = 1 - sm(0, 0.3, outU); flipA = 1 - sm(0, 0.25, outU); }
    diveK = D;
    active = phase === 'proj' ? (tr > 0.55 ? pi + 1 : pi) : (phase === 'dive' && D > 0.55) ? 0 : -1;
    if (manual && manual.i !== active) manual = null;
    manualS = lerp(manualS, manual ? manual.v : 0, 0.08);
    const manualOn = manual ? 1 : 0;
    // F flips and explodes together; scroll does it on its own
    let exE = ex, flipE = flipA;
    if (phase === 'proj' && pi === active) { exE = manual ? manualS : ex; flipE = manual ? manualS : flipA; }
    if (phase === 'dive' && manual && active === 0) { exE = manualS; flipE = manualS; }
    apartNow = (phase === 'proj' || phase === 'dive') && active >= 0 ? (pi === active || phase === 'dive' ? exE : 0) : 0;

    /* targets for every part */
    if (phase === 'hero' || phase === 'contact') {
      if (started) {
        if (fine && hasMouse) {
          handPlane.constant = -(FLOOR + 0.7);
          ray.setFromCamera(mouse, camera);
          if (ray.ray.intersectPlane(handPlane, hit)) {
            const hx = clamp(hit.x, box.x0 - 1, box.x1 + 1), hz = clamp(hit.z, box.z0 - 0.5, box.z1 + 0.5);
            hand.velocity.set((hx - hand.position.x) / Math.max(dt, 1 / 120), 0, (hz - hand.position.z) / Math.max(dt, 1 / 120));
            hand.position.set(hx, hit.y, hz);
          }
        }
        world.step(1 / 60, dt, 3);
      }
      for (const pc of pieces) {
        const b = pc.body, g = pc.tgt;
        g.p.set(b.position.x, b.position.y, b.position.z); g.q.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w); g.s.copy(pc.hs);
        setFin(g, FIN[pc.heroFin]);
      }
    } else if (phase === 'asm') {
      const k = sm(0.06, 0.9, asmU);
      snapped = 0;
      for (const pc of pieces) {
        const s = stag(pc, k);
        blend(pc.pile, frameState(pc, t, pc.to), s, pc.lift * 1.6, pc.tgt, pc);
        pc.tgt.s.multiplyScalar(snapPulse(s));
        if (s > 0.98) snapped++;
      }
    } else if (phase === 'dive') {
      const k = sm(0.3, 1, D);
      for (const pc of pieces) {
        frameState(pc, t, pc.from);
        if (inForm(pc, 0)) blend(pc.from, formState(pc, 0, exE, t, pc.to), stag(pc, k), pc.lift * 1.8, pc.tgt, pc);
        else copyState(pc.tgt, pc.from);
      }
    } else if (phase === 'proj') {
      const nx = pi + 1;
      for (const pc of pieces) {
        const a = inForm(pc, pi), b = inForm(pc, nx);
        stateOf(pc, pi, exE, t, pc.from);
        if (tr <= 0 || (!a && !b)) copyState(pc.tgt, pc.from);
        else blend(pc.from, stateOf(pc, nx, 0, t, pc.to), stag(pc, tr), a && b ? pc.lift * 0.6 : pc.lift * 1.8, pc.tgt, pc);
      }
    } else if (phase === 'out') {
      const k = sm(0.05, 0.75, outU);
      for (const pc of pieces) {
        frameState(pc, t, pc.to);
        if (inForm(pc, N - 1)) blend(formState(pc, N - 1, ex, t, pc.from), pc.to, stag(pc, k), pc.lift * 1.8, pc.tgt, pc);
        else copyState(pc.tgt, pc.to);
      }
    } else for (const pc of pieces) frameState(pc, t, pc.tgt);

    /* follow the targets */
    const snap = covered;
    const kf = snap ? 1 : 1 - Math.exp(-dt * (physPhase() ? 18 : 11));
    for (const pc of pieces) {
      const c = pc.cur, g = pc.tgt;
      c.p.lerp(g.p, kf); c.q.slerp(g.q, kf); c.s.lerp(g.s, kf); c.col.lerp(g.col, kf);
      c.rough = lerp(c.rough, g.rough, kf); c.metal = lerp(c.metal, g.metal, kf); c.op = lerp(c.op, g.op, kf); c.emi = lerp(c.emi, g.emi, kf);
      pc.mesh.position.copy(c.p); pc.mesh.quaternion.copy(c.q); pc.mesh.scale.copy(c.s);
      pc.mat.color.copy(c.col); pc.mat.roughness = c.rough; pc.mat.metalness = c.metal; pc.mat.opacity = c.op;
      pc.mat.emissive.copy(c.col).multiplyScalar(c.emi); pc.mat.depthWrite = c.op > 0.9;
    }

    /* shadows follow the action */
    if (phase === 'hero') setShadowBox(0, 6, 6);
    else if (phase === 'contact' || phase === 'between') setShadowBox((V.conPile[0] + V.conPile[1]) / 2, 5.5, 5.5);
    else if (phase === 'asm') setShadowBox(0, lerp(4, 0, asmU), lerp(7, 8.5, asmU));
    else setShadowBox(0, V.obj[1] - 1, 5);
    if (level >= 2) { renderer.shadowMap.autoUpdate = false; if (frames % shadowEvery === 0) renderer.shadowMap.needsUpdate = true; }

    /* hover */
    hoverPanel = -1; hoverObj = false;
    if (fine && hasMouse && caseEl.hidden && (phase === 'hero' || phase === 'asm' || phase === 'proj' || phase === 'dive' && D > 0.9)) {
      ray.setFromCamera(mouse, camera);
      if ((phase === 'proj' || phase === 'dive') && active >= 0) {
        const objHits = ray.intersectObjects(pieces.filter(pc => inForm(pc, active)).map(pc => pc.mesh), false);
        if (objHits.length) hoverObj = true;
      }
      if (!hoverObj) {
        const hits = ray.intersectObjects(panels.map(p => p.mesh), false);
        if (hits.length) {
          const h = (phase === 'proj' || phase === 'dive') ? hits.find(h => h.object.userData.i === active) : hits[0];
          if (h) {
            hoverPanel = h.object.userData.i;
            if (hoverPanel === active) { panels[active].u.uMouse.value.copy(h.uv); panels[active].hy = clamp((0.85 - h.uv.y) / 0.7); }
          }
        }
      }
    }
    document.documentElement.classList.toggle('hot', hoverPanel >= 0 || hoverObj);

    /* screens */
    const inside = phase === 'dive' || phase === 'proj' || phase === 'out';
    const insideK = phase === 'dive' ? D : phase === 'proj' ? 1 : phase === 'out' ? 1 - sm(0.1, 0.8, outU) : 0;
    panels.forEach((pn, i) => {
      // lit when its rail has snapped into place
      let lit = 1, flash = 0;
      if (phase === 'hero') lit = 0.0;
      else if (phase === 'asm') { const s = stag(railOf[i], sm(0.06, 0.9, asmU)); lit = sm(0.84, 1, s); flash = Math.sin(Math.PI * clamp((s - 0.86) / 0.14)); }
      pn.lit = lerp(pn.lit, lit, phase === 'hero' ? 0.05 : 0.25); pn.u.uLit.value = pn.lit; pn.u.uFlash.value = flash;
      const isA = inside && i === active;
      pn.act = lerp(pn.act, inside ? (isA ? 1 : 0) * insideK + 0.6 * (1 - insideK) : 0.6, 0.08);
      pn.hover = lerp(pn.hover, hoverPanel === i ? 1 : 0, 0.1);
      const fT = i === active || (phase === 'out' && i === N - 1) ? flipE : 0;
      pn.flip = lerp(pn.flip, fT, 0.12); if (Math.abs(pn.flip - fT) < .002) pn.flip = fT;
      if (pn.flip > 0.01 && !pn.u.uBack.value) buildBlueprints();
      pn.u.uFlip.value = pn.flip;
      const live = isA && insideK > 0.6;
      if (!live) pn.since = t;
      let target = 0;
      if (live) target = hoverPanel === i && pn.hy != null ? pn.hy : reduce ? 0 : 0.5 - 0.5 * Math.cos(Math.max(0, t - pn.since - 1.2) * 0.32);
      pn.sc = lerp(pn.sc, target, live ? 0.04 : 0.06);
      pn.u.uScroll.value = pn.sc;
      pn.u.uActive.value = pn.act; pn.u.uHover.value = pn.hover; pn.u.uVel.value = reduce ? 0 : vel;
      const dimOut = phase === 'hero' ? 0.42 : phase === 'contact' || phase === 'between' ? 0.3 : 0.18;
      pn.u.uDim.value = lerp(dimOut, 0.8, insideK);
      pn.u.uFogN.value = lerp(12, 6.5, insideK); pn.u.uFogF.value = lerp(34, 13, insideK);
      pn.mu.uFade.value = groundK;
      pn.mirror.visible = level < 3 && groundK > 0.01;
    });
    floorRing.material.opacity = 0.18 * groundK;

    /* the exploded view labels */
    const labOn = (phase === 'proj' || phase === 'out' || phase === 'dive') && active >= 0 || phase === 'out';
    const lf = phase === 'out' ? N - 1 : active;
    const la = labOn && lf >= 0 ? sm(0.55, 0.85, phase === 'proj' && lf !== pi ? 0 : exE) * (1 - sm(0, 0.2, tr)) * (phase === 'out' ? 1 - sm(0, 0.15, outU) : 1) : 0;
    drawLabels(lf, la);

    /* the page around it */
    const heroK = phase === 'hero' ? 0 : phase === 'asm' ? asmU : 1;
    nameEl.style.transform = `translate3d(0,${(-(phase === 'dive' ? dE : phase === 'asm' ? 0 : heroK) * 22).toFixed(2)}vh,0)`;
    nameEl.style.opacity = String(phase === 'hero' || phase === 'asm' ? 1 : phase === 'dive' ? 1 - sm(0.1, 0.6, D) : 0);
    heroCopy.style.opacity = String(1 - sm(0, 0.12, heroK));
    heroHint.style.visibility = heroK > 0.1 ? 'hidden' : '';
    asmNote.style.opacity = String(phase === 'asm' ? sm(0.03, 0.12, asmU) * (1 - sm(0.9, 1, asmU)) : 0);
    if (phase === 'asm') asmN.textContent = pad2(snapped);
    const inProj = phase === 'proj' || (phase === 'dive' && D > 0.85);
    info.classList.toggle('on', inProj); idx.classList.toggle('on', inProj && !narrow);
    if (inProj && active >= 0) showInfo(active);
    phaseEl.textContent = apartNow > 0.5 ? 'Taken apart' : 'Assembled';
    const fb = $('.info .flipb'); if (fb) { const tx = apartNow > 0.5 ? 'Put it back' : 'How it works ⟲'; if (fb.textContent !== tx) fb.textContent = tx; }
    pinEl.style.setProperty('--tint', (inProj ? 1 : phase === 'dive' ? sm(0.6, 1, D) : 0).toFixed(3));
    hintEl.classList.toggle('on', inProj && fine);
    if (inProj && fine && !hintEl.textContent) hintEl.textContent = '← → turn  ·  F take apart  ·  1 to 8 jump';
    outroEl.style.opacity = String(phase === 'out' ? sm(0.45, 0.8, outU) : 0);
    outroEl.style.transform = `translateY(${lerp(24, 0, sm(0.45, 1, outU)).toFixed(1)}px)`;
    topEl.classList.toggle('solid', u > TOTAL);
    canvas.style.opacity = covered ? '0' : '1';

    /* cursor */
    const showBig = hoverPanel >= 0 || hoverObj;
    cur.classList.toggle('big', showBig && !dragging);
    cur.classList.toggle('grab', dragging);
    curS.textContent = dragging ? '' : hoverObj ? (apartNow > 0.5 ? 'Rebuild' : 'Take apart') : hoverPanel >= 0 ? (phase === 'hero' ? 'Drag' : hoverPanel === active ? 'Open' : 'View') : '';
    if (fine && phase === 'hero') weigh(nameCs, 500, 800, vw * 0.11);

    if (!covered) renderer.render(scene, camera);

    /* keep it smooth: lower resolution, then shadows, then reflections */
    frames++; if (dt > 1 / 40) slow++;
    if (frames % 90 === 0) {
      if (slow > 35) {
        if (pr > 1) { pr = Math.max(1, pr - 0.25); renderer.setPixelRatio(pr); renderer.setSize(vw, vh, false); }
        else if (level < 2) { level = 2; shadowEvery = 3; }
        else if (level < 3) { level = 3; shadowEvery = 12; }
      }
      slow = 0;
    }
  }

  const labRect = { l: 0, r: 0, t: 0, b: 0 };
  function drawLabels(fi, la) {
    if (fi < 0 || la < 0.02) {
      if (labFor !== -2) { labEls.forEach(el => el.style.opacity = 0); lines.forEach(([l, c]) => { l.style.opacity = 0; c.style.opacity = 0; }); labFor = -2; }
      return;
    }
    const f = forms[fi];
    if (labFor !== fi) {
      labFor = fi;
      labEls.forEach((el, j) => { const [tt, sub] = f.how[j]; el.innerHTML = `<b><i>${pad2(j + 1)}</i>${tt}</b><span>${sub}</span>`; el._w = el.offsetWidth; el._h = el.offsetHeight; });
      svg.style.setProperty('--pc', f.p.c);
    }
    const ir = info.getBoundingClientRect(), xr = idx.getBoundingClientRect();
    let cxs = 0, cys = 0; const pts = [];
    for (let j = 0; j < 6; j++) {
      const k = f.labels[j]; if (k === undefined) { pts.push(null); continue; }
      tv.copy(pieces[k].mesh.position).project(camera);
      const sx = (tv.x * 0.5 + 0.5) * vw, sy = (-tv.y * 0.5 + 0.5) * vh;
      pts.push({ j, sx, sy }); cxs += sx; cys += sy;
    }
    const valid = pts.filter(Boolean); cxs /= valid.length; cys /= valid.length;
    const top = 76, bot = vh - (narrow ? ir.height + 30 : 20);
    for (const p of valid) {
      const el = labEls[p.j], w = el._w, h = el._h;
      let dx = p.sx - cxs, dy = p.sy - cys; const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
      const reach = narrow ? 44 : 84;
      p.side = dx >= 0 ? 1 : -1;
      p.lx = p.sx + dx * reach + p.side * 10; p.ly = p.sy + dy * reach * 0.7;
      p.x = p.side > 0 ? p.lx : p.lx - w; p.y = p.ly - h / 2; p.w = w; p.h = h;
    }
    // keep labels apart, and off the card and the index
    for (let it = 0; it < 4; it++) {
      for (const side of [-1, 1]) {
        const s = valid.filter(p => p.side === side).sort((a, b) => a.y - b.y);
        for (let n = 1; n < s.length; n++) { const a = s[n - 1], b = s[n]; const over = a.y + a.h + 6 - b.y; if (over > 0) { a.y -= over / 2; b.y += over / 2; } }
      }
      for (const p of valid) {
        p.x = clamp(p.x, 10, vw - p.w - 10); p.y = clamp(p.y, top, bot - p.h);
        if (!narrow) {
          if (p.y + p.h > ir.top - 8 && p.x < ir.right + 12 && info.classList.contains('on')) p.x = ir.right + 12;
          if (p.y + p.h > xr.top - 8 && p.x + p.w > xr.left - 12 && idx.classList.contains('on')) p.x = xr.left - 12 - p.w;
        }
      }
    }
    for (let j = 0; j < 6; j++) {
      const el = labEls[j], [ln, dot] = lines[j], p = pts[j];
      if (!p) { el.style.opacity = 0; ln.style.opacity = 0; dot.style.opacity = 0; continue; }
      const stg = clamp(la * 1.6 - j * 0.1);
      el.style.transform = `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px)`;
      el.style.opacity = stg.toFixed(3);
      const ex2 = p.x + (p.side > 0 ? 0 : p.w), ey2 = p.y + p.h / 2;
      ln.setAttribute('x1', p.sx.toFixed(1)); ln.setAttribute('y1', p.sy.toFixed(1)); ln.setAttribute('x2', ex2.toFixed(1)); ln.setAttribute('y2', ey2.toFixed(1));
      dot.setAttribute('cx', p.sx.toFixed(1)); dot.setAttribute('cy', p.sy.toFixed(1));
      ln.style.opacity = (stg * 0.7).toFixed(3); dot.style.opacity = stg.toFixed(3);
    }
  }

  /* ---------- start ---------- */
  function start() {
    if (started) return; started = true; startAt = performance.now();
    measure();
    for (const pc of pieces) { const b = pc.body; pc.cur.p.set(b.position.x, b.position.y + 4, b.position.z); pc.cur.s.copy(pc.hs); setFin(pc.cur, FIN[pc.heroFin]); }
    renderer.compile(scene, camera);
    $('.loader').classList.add('done');
    document.documentElement.classList.add('ready');
    if (hash.has('p')) scrollToY(yAt(parseFloat(hash.get('p')) * TOTAL), true);
    if (hash.has('i')) scrollToY(projY(+hash.get('i'), hash.has('t') ? parseFloat(hash.get('t')) : 0.06), true);
    if (hash.has('y')) scrollToY(+hash.get('y'), true);
    (window.requestIdleCallback || (f => setTimeout(f, 300)))(() => document.fonts.ready.then(buildBlueprints));
  }
  setTimeout(start, 7000);

  { const hh = istHour(); const q = hash.get('theme'); setTheme(q ? q === 'night' : (hh >= 19 || hh < 6)); }
  measure();
  setBox(...V.pile); dropAll();
  addEventListener('resize', measure);
  document.fonts?.ready.then(measure);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(frame); }
  });
  raf = requestAnimationFrame(frame);
  window.__a = { pieces, forms, panels, camera, ring, get phase() { return phase; }, get active() { return active; }, projY, yAt, TOTAL, go: y => scrollToY(y, true) };
}
