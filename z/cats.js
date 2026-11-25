// Cats. One on the desk, nine kittens hidden in the other worlds.
import { THREE, G, geo, C } from "./ink.js?v=1";
const { box, sph, tor, cone, cap, cyl, ext, tube } = geo, { sin, cos, abs, min, max, PI } = Math, clamp = (v, a, b) => min(b, max(a, v));
export const COATS = [["#3d2148", "#fff3e2", "#c8f53a", "#1d0d26"], ["#ff9d2e", "#fff0d6", "#12b886", "#8f3a12"], ["#8f97bd", "#f4f4ff", "#ffd52e", "#3c426b"], ["#fff0dc", "#ffffff", "#3aa0ff", "#a88a6e"], ["#6b4630", "#ffd9ad", "#c8f53a", "#2c1a10"], ["#ffc24a", "#ffffff", "#3aa0ff", "#8f5a12"], ["#4a4f63", "#cfd5ea", "#5df2ff", "#1c1f2e"], ["#ff9fbf", "#fff0f5", "#8a5cff", "#9c3f63"], ["#f4f4ff", "#ffffff", "#12b886", "#8b8fb5"]];
export const KITTENS = ["Vinyl", "Pocket", "Emoji", "Pixel", "Patch", "Monday", "Laddu", "Offside", "Comet"];
const once = new Map();
const merge = (key, parts) => {
  if (once.has(key)) return once.get(key); const P = [], N = [], m = new THREE.Matrix4(), q = new THREE.Quaternion();
  for (const [g, p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1]] of parts) { const c = g.index ? g.toNonIndexed() : g.clone(); for (const k of Object.keys(c.attributes)) if (k !== "position" && k !== "normal") c.deleteAttribute(k); c.applyMatrix4(m.compose(new THREE.Vector3(...p), q.setFromEuler(new THREE.Euler(...r)), new THREE.Vector3(...(Array.isArray(s) ? s : [s, s, s])))); for (const v of c.attributes.position.array) P.push(v); for (const v of c.attributes.normal.array) N.push(v); }
  const o = new THREE.BufferGeometry(); o.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); o.setAttribute("normal", new THREE.Float32BufferAttribute(N, 3)); geo.smooth(o); once.set(key, o); return o;
};
export function kitten(w, coat, to) {
  const [a, l, e, d] = COATS[coat % COATS.length], g = w.group(0, 0, 0, to);
  w.add(merge("kbody", [[sph(0.36, 20), [0, 0.36, 0], [0, 0, 0], [1, 1.08, 0.9]], [sph(0.36, 22), [0, 0.95, 0.06], [0, 0, 0], [1.14, 0.94, 0.94]], [cone(0.17, 0.32, 14), [-0.23, 1.29, 0.04], [0, 0, 0.28], [1, 1, 0.6]], [cone(0.17, 0.32, 14), [0.23, 1.29, 0.04], [0, 0, -0.28], [1, 1, 0.6]], [tube([[0.25, 0.15, -0.1], [0.55, 0.12, 0], [0.62, 0.42, 0.05], [0.5, 0.66, 0.05]], 0.085, 16)]]), a, 0, 0, 0, { to: g, b: d });
  w.add(merge("klight", [[sph(0.14, 14), [-0.09, 0.85, 0.33], [0, 0, 0], [1, 0.85, 0.7]], [sph(0.14, 14), [0.09, 0.85, 0.33], [0, 0, 0], [1, 0.85, 0.7]], [sph(0.22, 14), [0, 0.46, 0.2], [0, 0, 0], [0.9, 1.1, 0.6]], [sph(0.12, 12), [-0.17, 0.08, 0.27]], [sph(0.12, 12), [0.17, 0.08, 0.27]]]), l, 0, 0, 0, { to: g, line: 0, b: d });
  w.add(merge("keye", [[sph(0.115, 14), [-0.17, 1.02, 0.3], [0, 0, 0], [1, 1.1, 0.6]], [sph(0.115, 14), [0.17, 1.02, 0.3], [0, 0, 0], [1, 1.1, 0.6]]]), e, 0, 0, 0, { to: g, line: 0, b: e }); w.add(merge("kpup", [[sph(0.068, 12), [-0.165, 1.02, 0.365], [0, 0, 0], [0.75, 1.15, 0.5]], [sph(0.068, 12), [0.165, 1.02, 0.365], [0, 0, 0], [0.75, 1.15, 0.5]], [sph(0.045, 10), [0, 0.92, 0.43], [0, 0, 0], [1.3, 0.8, 0.8]]]), "#1a0a14", 0, 0, 0, { to: g, line: 0, b: "#1a0a14" });
  return g;
}
// where each kitten hides: x, y, z, size, rotation
export const HIDE = { 1: [-1.75, 2.36, -1.35, 1.05, 0, 0.1, -0.1], 2: [2.35, -3.25, 0.7, 1.0, 0, -0.15, 0], 3: [-0.75, 1.66, -0.45, 0.95, 0, 0.1, 0.05], 4: [0.82, -3.1, 0.1, 1.0, 0, 0.2, 0], 5: [0, 0, 0, 0.8, 0, 0, 0], 6: [-1.55, 2.3, -1.5, 1.2, 0, 0.1, 0.06], 7: [-2.75, 0.75, -1.2, 1.15, 0, 0.1, 0.22], 8: [1.2, 3.65, 0.12, 0.75, PI / 2, 0, 0], 9: [4.15, 3.02, -2.4, 0.85, 0, -0.2, -0.05] };

// phones: clear of the menu and the words
export const HIDE_TALL = { ...HIDE, 1: [-2.15, -2.35, 0.1, 1.0, 0, 0.1, 0], 2: [-2.35, -2.35, 0.6, 1.0, 0, 0.1, 0], 4: [-2.1, -2.45, 0.3, 1.0, 0, 0.2, 0], 6: [2.0, -2.4, 0.1, 1.0, 0, -0.1, 0], 7: [-2.2, -2.35, 0.3, 1.0, 0, 0.1, 0], 9: [-2.45, -2.4, -0.4, 1.0, 0, 0.2, 0] };

export function deskCat(w, { heart, tell, tall, mug, mugHome, steam }) {
  const Y = -2.65, Z = 2.15, HOME = tall ? 1.35 : 2.35, LO = tall ? -2.2 : -1.9, HI = tall ? 1.75 : 3.0, cat = w.group(HOME, Y, Z), B = w.group(0, 0, 0, cat), S = 0.82; cat.scale.setScalar(S);
  const skin = [[], [], [], []], put = (k, g, x, y, z, o = {}) => { const m = w.add(g, COATS[0][k], x, y, z, o); skin[k].push([m, o]); return m; };
  const body = w.group(0, 0, 0, B); put(0, merge("cbody", [[sph(0.95, 30), [0, 0.95, 0], [0, 0, 0], [1, 1.06, 0.86]], [sph(0.46, 20), [-0.62, 0.42, 0.2]], [sph(0.46, 20), [0.62, 0.42, 0.2]]]), 0, 0, 0, { to: body }); const belly = put(1, sph(0.62, 24), 0, 0.92, 0.42, { to: body, s: [0.95, 1.15, 0.72], line: 0 });
  const leg = (s) => { const g = w.group(s * 0.31, 0.95, 0.55, B); put(0, cap(0.2, 0.6), 0, -0.42, 0.06, { to: g }); put(1, sph(0.24, 18), 0, -0.79, 0.2, { to: g, s: [1, 0.7, 1.2] }); return g; }, pl = leg(-1), pr = leg(1);
  const tail = [0, 1, 2].reduce((a, i) => { const g = w.group(i ? 0 : 0.62, i ? 0.62 : 0.22, i ? 0 : -0.35, i ? a[i - 1] : B); put(i === 2 ? 1 : 0, cap(0.15 - i * 0.012, 0.5), 0, 0.32, 0, { to: g }); a.push(g); return a; }, []); tail[0].rotation.z = -1.15;
  const coll = w.add(tor(0.56, 0.1, 40), "#ff4757", 0, 1.62, 0.12, { to: B, r: [PI / 2 - 0.12, 0, 0] }), bell = w.add(sph(0.17, 18), "#ffd52e", 0, 1.48, 0.68, { to: B, hl: 1, b: "#a86a1a" });
  const H = w.group(0, 2.2, 0.2, B); put(0, merge("chead", [[sph(0.78, 32), [0, 0, 0], [0, 0, 0], [1.14, 0.94, 0.94]], [cone(0.34, 0.66, 20), [-0.5, 0.72, -0.02], [0, 0, 0.3], [1, 1, 0.55]], [cone(0.34, 0.66, 20), [0.5, 0.72, -0.02], [0, 0, -0.3], [1, 1, 0.55]]]), 0, 0, 0, { to: H });
  w.add(merge("cear", [[cone(0.19, 0.4, 16), [-0.49, 0.7, 0.13], [0, 0, 0.3], [1, 1, 0.4]], [cone(0.19, 0.4, 16), [0.49, 0.7, 0.13], [0, 0, -0.3], [1, 1, 0.4]]]), "#ff8fb4", 0, 0, 0, { to: H, line: 0 }); put(1, merge("cmuz", [[sph(0.3, 20), [-0.2, -0.25, 0.58], [0, 0, 0], [1, 0.82, 0.7]], [sph(0.3, 20), [0.2, -0.25, 0.58], [0, 0, 0], [1, 0.82, 0.7]], [sph(0.2, 16), [0, -0.44, 0.5]]]), 0, 0, 0, { to: H, line: 0 }); w.add(sph(0.1, 16), "#ff6f9c", 0, -0.1, 0.8, { to: H, s: [1.35, 0.85, 0.8] });
  w.add(merge("cwh", [-1, 1].flatMap((s) => [-0.14, 0, 0.14].map((k) => [cyl(0.014, 0.75, 0.014, 5), [s * 0.78, -0.22 + k * 0.9, 0.56], [0, 0, PI / 2 + s * k * 1.3]]))), "#fff3e2", 0, 0, 0, { to: H, line: 0, b: "#cbb8c8" });
  const eyes = w.group(0, 0, 0, H), balls = [-1, 1].map((s) => { const e = w.group(s * 0.35, 0.13, 0.56, eyes); put(2, sph(0.25, 24), 0, 0, 0, { to: e, s: [1, 1.12, 0.6] }); const pu = w.add(sph(0.15, 18), "#12060f", 0, 0, 0.1, { to: e, line: 0, b: "#12060f", s: [0.62, 1.2, 0.5] }); w.add(sph(0.05, 10), "#ffffff", -0.06, 0.1, 0.17, { to: e, line: 0, b: "#ffffff" }); return { e, pu }; });
  const smile = w.group(0, 0, 0, H); [-1, 1].forEach((s) => w.add(tor(0.17, 0.05, 20, PI), "#fff3e2", s * 0.35, 0.06, 0.72, { to: smile, line: 0, b: "#fff3e2" })); smile.visible = false;
  const mouth = w.add(sph(0.13, 16), "#7a1230", 0, -0.42, 0.68, { to: H, line: 0, s: [1, 0.01, 0.6], b: "#7a1230" });
  // things to play with
  const yarn = w.group(-9, 0, Z + 0.1); w.add(sph(0.42, 26), "#ff4f8b", 0, 0, 0, { to: yarn }); [0, 0.7, 1.4, 2.1].forEach((a, i) => w.add(tor(0.41, 0.035, 34), "#ffa9c9", 0, 0, 0, { to: yarn, line: 0, r: [a, a * 1.7, i] })); yarn.visible = false;
  const fish = w.group(0, 9, Z + 0.2); w.add(sph(0.3, 20), "#5db8ff", 0, 0, 0, { to: fish, s: [1.35, 0.8, 0.5] }); w.add(cone(0.24, 0.34, 4), "#5db8ff", -0.5, 0, 0, { to: fish, r: [0, 0, -PI / 2], s: [1, 1, 0.35] }); w.add(sph(0.05, 8), "#12060f", 0.22, 0.06, 0.13, { to: fish, line: 0 }); fish.visible = false;
  const dot = w.add(sph(0.16, 18), "#ff2e43", 0, 0, Z + 0.5, { line: 0, s: [1, 1, 0.3], b: "#ff2e43" }), halo = w.add(tor(0.26, 0.04, 26), "#ff8a95", 0, 0, 0, { to: dot, line: 0, b: "#ff8a95" }); dot.visible = false;
  const zs = [0, 1, 2].map(() => { const s = new THREE.Shape(); [[-0.3, 0.32], [0.3, 0.32], [0.3, 0.16], [-0.05, -0.18], [0.3, -0.18], [0.3, -0.34], [-0.3, -0.34], [-0.3, -0.18], [0.05, 0.16], [-0.3, 0.16]].forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y))); return w.add(ext(s, 0.08, 0.03), "#fff3e2", 0, 0, 0); });
  const hg = ext(heart(), 0.16, 0.06), hs = Array.from({ length: 16 }, () => ({ x: 0, y: 0, z: -90, s: 0, l: 0, r: [0, 0, 0], c: ["#ff4f8b", "#ff2e43", "#ffd52e"][Math.floor(Math.random() * 3)] })), hm = w.many(hg, hs, { b: "#8f1f4a" }); hm.raycast = () => {}; let hi = 0; const love = (n = 1) => { for (let k = 0; k < n; k++) Object.assign(hs[hi++ % 16], { x: cat.position.x + (Math.random() - 0.5) * 1.6, y: cat.position.y + 2.2 + Math.random() * 0.5, z: Z + 0.6, l: 1.5, v: 1 + Math.random() }); };
  let last = 0, now = 0, act = 0, vy = 0, jy = 0, purr = 0, purrs = 0, chub = 0, eaten = 0, flop = 0, wide = 0, laser = false, pounces = 0, cool = 0, bats = 0, yv = [0, 0], fv = 0, chew = 0, step = 0, mugT = -1, going = false, swipe = 0, stroke = 0, coat = 0, sneaky = 0;
  const wake = () => { act = now; going = false; };
  const toys = {
    treat() { wake(); laser = false; fish.visible = true; fish.position.set(clamp(cat.position.x + (Math.random() - 0.5) * 3.4, LO, HI), 3.4, Z + 0.2); fv = 0; },
    yarn() { wake(); laser = false; yarn.visible = !yarn.visible; yarn.position.set(clamp(G.point.x, LO, HI), 2.6, Z + 0.1); yv = [(Math.random() - 0.5) * 5, 0]; bats = 0; return yarn.visible; },
    laser() { wake(); laser = !laser; yarn.visible = false; pounces = 0; return laser; },
    coat(n) { coat = n ?? (coat + 1) % 6; skin.forEach((l, k) => l.forEach(([m, o]) => { m.material = w.mat(COATS[coat][k], { ...o, b: k === 2 ? undefined : COATS[coat][3] }); })); love(2); return coat; },
  };
  w.on(cat, { tip: "grab", drag: (dx, dy) => { wake(); stroke = 0.25; purr = min(1, purr + (abs(dx) + abs(dy)) * 0.0016); if (Math.random() < 0.12) love(1); if (purr >= 1 && flop <= 0) { purr = 0; purrs++; flop = 3.2; love(10); tell(`Full purr, ${purrs} ${purrs === 1 ? "time" : "times"}`, purrs); } else tell(`Purr ${Math.round(purr * 100)}%`); }, click: (pt) => { wake(); const l = pt.y - cat.position.y; if (l > 1.35 * S) { wide = 0.8; vy = 3.4; tell("Boop"); } else { purr = min(1, purr + 0.08); love(2); } } });
  w.on(yarn, { click: () => { wake(); yv = [(Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 3), 6]; } }); w.on(mug, { click: () => { if (mugT < 0) { act = now; going = true; tell("Oh no. The mug"); } } }); w.on(fish, { click: () => { fv = 4; } });
  toys.coat(0);
  w.each((t) => {
    const dt = min(0.05, t - last); last = now = t; const c = cat.position, idle = t - act, asleep = idle > 34 && !laser && !yarn.visible && !fish.visible && !going && flop <= 0; if (act === 0) act = t;
    if (idle > 13 && idle < 13.2 && mugT < 0 && !going && !laser && !yarn.visible && sneaky !== act) { going = true; sneaky = act; }
    // falling fish, rolling yarn, laser dot
    if (fish.visible) { fv -= 14 * dt; fish.position.y += fv * dt; fish.rotation.z += dt * 2; if (fish.position.y < Y + 0.3) { fish.position.y = Y + 0.3; fv = abs(fv) > 2 ? -fv * 0.4 : 0; } }
    if (yarn.visible) { const p = yarn.position; yv[1] -= 14 * dt; p.x += yv[0] * dt; p.y += yv[1] * dt; yv[0] *= 1 - 0.5 * dt; yarn.rotation.z -= yv[0] * dt * 2.2; if (p.y < Y + 0.42) { p.y = Y + 0.42; yv[1] = abs(yv[1]) > 1.4 ? -yv[1] * 0.55 : 0; } if (p.x < LO - 0.9 || p.x > HI + 0.5) { yv[0] = -yv[0]; p.x = clamp(p.x, LO - 0.9, HI + 0.5); } }
    dot.visible = laser; if (laser) { dot.position.x += (clamp(G.point.x, LO - 0.7, HI + 0.4) - dot.position.x) * 0.35; dot.position.y += (clamp(G.point.y, Y + 0.2, 0.9) - dot.position.y) * 0.35; halo.scale.setScalar(1 + sin(t * 9) * 0.15); }
    // what the cat wants
    let goal = HOME, sp = 1.5, lookAt = G.point; cool -= dt; flop -= dt; wide -= dt; chew -= dt; swipe -= dt; stroke -= dt; purr = max(0, purr - dt * 0.015); chub = max(0, chub - dt * 0.006);
    if (flop > 0 || asleep) { goal = c.x; }
    else if (fish.visible) { lookAt = fish.position; goal = clamp(fish.position.x - 0.1, LO, HI); sp = 3.4; if (abs(c.x - goal) < 0.35 && fish.position.y < Y + 0.6) { fish.visible = false; chew = 1.5; eaten++; chub = min(0.42, chub + 0.085); love(3); tell(eaten > 5 ? `${eaten} treats. Very round` : `${eaten} ${eaten === 1 ? "treat" : "treats"}`, eaten); } }
    else if (laser) { lookAt = dot.position; goal = clamp(dot.position.x, LO, HI); sp = 5; wide = 0.1; if (abs(c.x - goal) < 0.45 && cool < 0) { cool = 0.9; vy = 4.2 + clamp((dot.position.y - Y) * 1.1, 0, 3.6); swipe = 0.35; pounces++; tell(`${pounces} pounces`, pounces); } }
    else if (yarn.visible) { lookAt = yarn.position; const side = yarn.position.x > c.x ? 1 : -1; goal = clamp(yarn.position.x - side * 0.75, LO, HI); sp = 3.8; if (abs(yarn.position.x - c.x) < 1.05 && yarn.position.y < Y + 1.5 && cool < 0) { cool = 0.55; swipe = 0.3; yv = [side * (3 + Math.random() * 3.5) * (c.x * side > HI - 0.5 ? -1 : 1), 3 + Math.random() * 3]; bats++; tell(`${bats} yarn hits`, bats); } }
    else if (going) { lookAt = mug.position; goal = LO - 0.05; sp = 1.7; if (abs(c.x - goal) < 0.2 && mugT < 0) { swipe = 0.5; mugT = t + 0.25; going = false; tell("The mug has left the desk"); } }
    const dx = goal - c.x, v = clamp(dx * 6, -sp, sp); if (abs(dx) > 0.04) { c.x += v * dt; step += abs(v) * dt * 5; } const walk = min(1, abs(v) / 1.5);
    vy -= 15 * dt; jy = max(0, jy + vy * dt); if (jy === 0 && vy < 0) vy = 0;
    // mug
    if (mugT > 0) { const u = t - mugT; if (u > 0 && u < 1.6) { mug.position.x = mugHome[0] - u * 1.6; mug.position.y = mugHome[1] + (u < 0.25 ? 0 : -9 * (u - 0.25) ** 2); mug.rotation.z = u * 4; } else if (u > 4.5) { mug.position.set(...mugHome); mug.rotation.z = 0; mug.scale.setScalar(min(1, (u - 4.5) * 3)); if (u > 4.9) { mugT = -1; mug.scale.setScalar(1); } } }
    steam.forEach((s, i) => { s.visible = mugT < 0; s.position.y = 0.75 + ((t * 0.4 + i * 0.5) % 1) * 0.3; s.scale.setScalar(1 - ((t * 0.4 + i * 0.5) % 1) * 0.4); });
    // pose
    const on = flop > 0 ? 1 : 0, happy = stroke > 0 || on || chew > 0.1 && chew < 0.3, shut = asleep; B.rotation.z += ((on ? 1.25 : sin(step) * 0.05 * walk) - B.rotation.z) * 0.14; B.position.x += ((on ? 1.0 : 0) - B.position.x) * 0.14; B.position.y = abs(sin(step)) * 0.14 * walk + jy / S + (stroke > 0 ? sin(t * 60) * 0.012 : 0) + (on ? 0.55 : 0); const sq = asleep ? 0.86 + sin(t * 1.6) * 0.025 : 1 + sin(t * 2.2) * 0.012 + clamp(vy * 0.015, -0.06, 0.08); B.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq)); body.scale.set(1 + chub, 1 + chub * 0.2, 1 + chub);
    B.rotation.y += (clamp(dx * 0.6, -0.75, 0.75) * walk - B.rotation.y) * 0.15; pl.rotation.x = sin(step) * 0.5 * walk; pr.rotation.x = -sin(step) * 0.5 * walk - (swipe > 0 ? 1.3 : 0); if (swipe > 0) pr.rotation.z = sin(swipe * 20) * 0.5; else pr.rotation.z = 0;
    const hx = clamp((lookAt.x - c.x) * 0.22, -0.75, 0.75), hy = clamp(((c.y + 2) - lookAt.y) * 0.16, -0.45, 0.5); H.rotation.y += ((shut || on ? 0 : hx) - H.rotation.y) * 0.16; H.rotation.x += ((shut ? 0.5 : happy ? -0.12 : hy) - H.rotation.x) * 0.16; H.rotation.z = stroke > 0 ? sin(t * 5) * 0.1 : sin(t * 0.9) * 0.03; H.position.y = 2.2 + chub * 0.15 - (shut ? 0.42 : 0);
    eyes.visible = !happy && !shut; smile.visible = happy || shut; smile.rotation.x = 0; const bl = t % 4.2 < 0.12 ? 0.08 : 1; balls.forEach(({ e, pu }) => { e.scale.y = bl; pu.position.x = clamp(hx * 0.16, -0.09, 0.09); pu.position.y = clamp(-hy * 0.2, -0.08, 0.08); const k = wide > 0 ? 1.15 : 0.62; pu.scale.x += (k - pu.scale.x) * 0.2; });
    mouth.scale.y = chew > 0 ? 0.3 + abs(sin(t * 16)) * 0.6 : wide > 0.4 ? 0.8 : 0.01; tail.forEach((g, i) => { g.rotation.z = (i ? 0.45 : -1.15) + sin(t * (laser || yarn.visible ? 6 : 1.7) - i * 0.8) * (asleep ? 0.05 : 0.28); }); bell.position.x = sin(t * 8) * 0.04 * walk;
    zs.forEach((z, i) => { const u = (t * 0.35 + i / 3) % 1; z.visible = asleep; z.position.set(c.x + 0.6 + u * 0.8 + sin(u * 6) * 0.1, c.y + 2.2 + u * 1.8, Z); z.scale.setScalar(0.4 + u * 0.8); });
    hs.forEach((h, i) => { h.l -= dt; h.y += (h.v ?? 0) * dt; h.s = clamp(h.l * 1.6, 0, 0.34); h.r[2] = sin(t * 4 + i) * 0.3; if (h.l < -0.2) h.z = -90; hm.set(i, h); });
  });
  return { cat, head: H, toys, busy: () => laser || yarn.visible };
}
