import { THREE, G } from "./ink.js?v=1";
import { build } from "./worlds.js?v=1";
import { PROJECTS, EXPERIENCE, EDUCATION, ABOUT, CONTACT, STATS, PERSON } from "./content.js?v=1";
const $ = (i) => document.getElementById(i), h = (t, a = {}, ...k) => { const e = document.createElement(t); for (const [n, v] of Object.entries(a)) n.startsWith("on") ? e.addEventListener(n.slice(2), v) : e.setAttribute(n, v); e.append(...k.flat().filter((x) => x != null)); return e; };
const link = (t, u, two) => h("a", { href: u, ...(two ? { class: "two" } : {}), ...(u.startsWith("http") || u.endsWith("24") ? { target: "_blank", rel: "noopener" } : {}) }, t);
const ORDER = ["crate", "drape", "wrapped", "stepwise", "agentproof", "slotwise", "invites", "matchday", "tonight"], P = ORDER.map((k) => PROJECTS.find((p) => p.k === k)), N = 11, mod = (a, n) => ((a % n) + n) % n;
const LOOK = [ // paper, ink, text, yaw, pitch
  ["#2b3cff", "#0b0a3d", "#fff6df", -0.2, 0.14], ["#ff5a1f", "#2a0b18", "#2a0b18", -0.26, 0.2], ["#ffb7d8", "#4a0636", "#4a0636", -0.22, 0.06], ["#12c26b", "#03301c", "#03301c", -0.24, 0.1], ["#dff6f2", "#06303a", "#06303a", -0.2, 0.1], ["#6b3bf5", "#160447", "#ffffff", -0.24, 0.08], ["#ffd52e", "#1d2400", "#1d2400", -0.28, 0.16], ["#a3123f", "#36021a", "#ffeccb", -0.22, 0.1], ["#2fce6a", "#04240f", "#04240f", -0.2, -0.5], ["#0b0e3f", "#05061f", "#fff6df", -0.1, 0.1], ["#ff8a6b", "#3a0f2c", "#3a0f2c", -0.22, 0.16]];
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches, tall = innerWidth / innerHeight < 0.8, K = 10, D0 = 10;
const land = await fetch(new URL("./land.json?v=1", import.meta.url)).then((r) => r.json()), W = build(tall, land, (i) => stamp(i));
let rd; try { rd = new THREE.WebGLRenderer({ canvas: $("c"), antialias: true, stencil: true, alpha: false, powerPreference: "high-performance" }); } catch (e) { document.documentElement.classList.add("plain"); throw e; } rd.outputColorSpace = THREE.LinearSRGBColorSpace; rd.autoClear = false;
let q = Math.min(devicePixelRatio, tall ? 1.75 : 1.5), w = 1, ht = 1; const cam = new THREE.PerspectiveCamera(), eye = new THREE.PerspectiveCamera();
const size = () => { w = innerWidth; ht = innerHeight; rd.setPixelRatio(q); rd.setSize(w, ht, false); G.res.value.set(w * q, ht * q); }; size(); addEventListener("resize", size);
// which part of the screen each world is centred on, and how much of it must fit
const AX = (i) => (tall ? [i === 8 ? 0.4 : 0.56, i === 0 ? 0.26 : 0.31] : [i === 0 ? 0.385 : 0.68, i === 0 ? 0.42 : 0.53]), FIT = (i) => (tall ? (i === 0 ? 3.4 : 3.35) : i === 0 ? (innerHeight < 720 ? 5.9 : 5.15) : 4.1);
const at = (f, p) => { const i = Math.floor(p), t = p - i, s = t * t * (3 - 2 * t), a = f(mod(i, N)), b = f(mod(i + 1, N)); return Array.isArray(a) ? a.map((v, n) => v + (b[n] - v) * s) : a + (b - a) * s; };
const fine = matchMedia("(pointer: fine)").matches; let p = calm ? 0 : 4, to = 0, v = 0, mx = 0, my = 0, ox = 0, oy = 0, intro = calm ? 1 : 0, shown = -1, idle = 0, falling = false, T = 0;
function draw(dt) {
  T += dt; G.time.value = T; const b = Math.floor(p), t = p - b, [ax, ay] = at(AX, p), [, , , yaw, pit] = at((i) => [0, 0, 0, LOOK[i][3], LOOK[i][4]], p); ox += (mx - ox) * Math.min(1, dt * 5); oy += (my - oy) * Math.min(1, dt * 5);
  const asp = w / ht, fit = at(FIT, p); let tv = fit / D0; if (tall) tv = fit / D0 / asp; else if (asp < 1.6) tv *= 1.6 / asp; const th = tv * asp;
  const Y = yaw + ox * 0.22, X = pit + oy * 0.14; G.axis.value.set(ax * w * q, (1 - ay) * ht * q); G.sun.value.set(-0.45 + ox * 0.75, 0.72 - oy * 0.55, 0.62); rd.setRenderTarget(null); rd.clear();
  const unit = (ht * q) / (2 * tv);
  for (let L = 0; L < 3; L++) {
    if (L === 2 && t < 0.25) break; const wd = W[mod(b + L, N)], dist = D0 * K ** (L - t), roll = 0.22 * (t - L); wd.setLevel(L); if (L < 2) for (const f of wd.ticks) f(T);
    cam.position.set(Math.sin(Y) * Math.cos(X), Math.sin(X), Math.cos(Y) * Math.cos(X)).multiplyScalar(dist); cam.up.set(0, 1, 0); cam.lookAt(0, 0, 0); cam.rotateZ(roll); const n = Math.max(0.04, dist * 0.05); cam.projectionMatrix.makePerspective(-n * th * 2 * ax, n * th * 2 * (1 - ax), n * tv * 2 * ay, -n * tv * 2 * (1 - ay), n, dist + 60); cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert(); cam.updateMatrixWorld();
    const s = D0 / dist; G.cell.value = Math.max(0.8, 5.2 * q * s * (ht / 820)); G.ang.value = -roll; G.line.value = Math.min(9, Math.max(0.5, (unit / dist) * 0.034));
    const need = (D0 / K) * Math.hypot(Math.max(ax, 1 - ax) * 2 * th, Math.max(ay, 1 - ay) * 2 * tv) * 1.22, g = L === 0 ? Math.min(1, Math.max(0, (t - 0.4) / 0.5)) : 0; wd.hole.scale.setScalar(1 + Math.max(0, need / wd.r - 1) * g * g);
    G.mouse.value.set(((mx + 1) / 2) * w * q, (1 - (my + 1) / 2) * ht * q, L === 0 && fine ? Math.max(0, 1 - Math.abs(p - Math.round(p)) * 5) : 0); if (L === (t > 0.5 ? 1 : 0)) { eye.matrixWorld.copy(cam.matrixWorld); eye.projectionMatrix.copy(cam.projectionMatrix); eye.projectionMatrixInverse.copy(cam.projectionMatrixInverse); eye.position.copy(cam.position); }
    if (L) rd.clearDepth(); rd.render(wd.scene, cam);
  }
}
// words
function say(i, again) {
  if (i === shown && !again) return; shown = i; const [pa, ink, tx] = LOOK[i], r = document.documentElement.style; r.setProperty("--paper", pa); r.setProperty("--ink", ink); r.setProperty("--txt", tx); document.querySelector("meta[name=theme-color]").content = pa;
  const el = $("panel"); el.className = i === 0 ? "hero" : ""; $("home").style.visibility = i ? "" : "hidden"; const pr = P[i - 1];
  el.replaceChildren(...(i === 0 ? [h("h1", {}, "I’m Jash Parmar. I build small, clever products."), h("p", { class: "hook" }, "Software developer in India, open to SDE and FDE roles. Nine projects, each hiding inside the last. Scroll to fall in.")]
    : i === 10 ? [h("h2", {}, "Say hello"), h("p", { class: "hook" }, CONTACT.email), h("p", { class: "d" }, "I’m happy to talk about work, or about any of these projects. Keep scrolling and you fall back to the start."), h("div", { class: "links" }, link("Email me", `mailto:${CONTACT.email}`), ...CONTACT.resumes.map(([t, u]) => link(t === "Software developer" ? "SDE résumé" : "FDE résumé", u, 1)), link("GitHub", CONTACT.github, 1), link("LinkedIn", CONTACT.linkedin, 1))]
    : [h("h2", {}, pr.t), h("p", { class: "hook" }, pr.hook[0].toUpperCase() + pr.hook.slice(1)), h("p", { class: "d" }, pr.d), h("div", { class: "links" }, link(pr.l[0][0], pr.l[0][1]), h("button", { type: "button", class: "two", onclick: () => more(pr) }, "How I built it"))]), hintFor(i));
  $("zoom").lastChild.textContent = i === 0 ? "the surface" : i === 10 ? "the desk" : `${pr.t}, ${i} of 9`;
}
const slug = (i) => (i === 10 ? "hello" : P[i - 1].k === "stepwise" ? "drishi" : P[i - 1].k); let addr = -1; const address = (i) => { if (addr !== i) { addr = i; history.replaceState(null, "", i ? `#${slug(i)}` : location.pathname); } };
// games: one stamp per world, kept on this device
let got; try { got = new Set(JSON.parse(localStorage.getItem("stamps") ?? "[]")); } catch { got = new Set(); }
const verb = (s) => (fine ? s : s.replace(/^Click/, "Tap").replace("clicked", "tapped"));
function hintFor(i) { const t = verb(W[i].task ?? (i === 0 ? "Everything here can be clicked. Try the letters" : "")); if (!t) return null; const done = got.has(i); return h("p", { class: "try" + (done ? " done" : "") }, h("i", { "aria-hidden": "true" }, i && i < 10 ? (done ? "✓" : "★") : "★"), h("span", {}, done ? `Stamped. ${t}` : t)); }
const count = () => { $("stamps").textContent = `Stamps ${got.size}/9`; W[10].crown(got.size === 9); };
let toastT = 0; function toast(s) { const el = $("toast"); el.textContent = s; el.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("on"), 2600); }
function stamp(i) { if (got.has(i)) return; got.add(i); try { localStorage.setItem("stamps", JSON.stringify([...got])); } catch {} count(); toast(got.size === 9 ? "All nine stamps. The cat is wearing a crown" : `${P[i - 1].t} stamped, ${got.size} of 9`); const o = document.querySelector("#panel .try"); if (o && shown === i) o.replaceWith(hintFor(i)); if (got.size === 9) setTimeout(() => go(10), 2400); }
count(); $("stamps").onclick = () => open(h("h2", { id: "sh" }, "Stamps"), h("p", {}, "Every project has a small game inside its world. Play it and it gets stamped. They are just for fun, and nothing is hidden behind them."), h("ol", { class: "cards" }, P.map((pr, i) => h("li", {}, h("button", { type: "button", class: got.has(i + 1) ? "got" : "", style: `--k:${LOOK[i + 1][0]};--i:${LOOK[i + 1][2]}`, onclick: () => { $("sheet").close(); go(i + 1); } }, h("b", {}, pr.t), h("span", {}, got.has(i + 1) ? "Stamped" : verb(W[i + 1].task)))))), got.size ? h("div", { class: "links" }, h("button", { type: "button", class: "two", onclick: () => { got.clear(); try { localStorage.removeItem("stamps"); } catch {} count(); $("sheet").close(); say((shown + 0), true); } }, "Start again")) : null);
const open = (...k) => { const d = $("sheet"); d.className = "light"; d.replaceChildren(h("button", { class: "x", type: "button", "aria-label": "Close", onclick: () => d.close() }, "×"), ...k.flat().filter(Boolean)); d.scrollTop = 0; d.showModal(); };
const more = (pr) => open(h("img", { src: pr.img, alt: `${pr.t} screenshot`, width: 1280, height: 800 }), h("h2", { id: "sh" }, pr.t), ["The problem", "What I built", "How it turned out"].flatMap((t, i) => [h("h3", {}, t), h("p", {}, pr.cs[i])]), h("h3", {}, "Under the bonnet"), pr.b.map((x) => h("p", {}, x)), h("p", {}, pr.s.replaceAll(" · ", ", ")), h("div", { class: "links" }, pr.l.map(([t, u], i) => link(t, u, i))));
$("list").onclick = () => open(h("h2", { id: "sh" }, "All projects"), h("ol", {}, P.map((pr, i) => h("li", {}, h("button", { type: "button", style: `--k:${LOOK[i + 1][0]}`, onclick: () => { $("sheet").close(); go(i + 1); } }, h("img", { src: pr.img, alt: "", loading: "lazy" }), h("div", {}, h("b", {}, pr.t), h("span", {}, pr.hook[0].toUpperCase() + pr.hook.slice(1))))))), h("div", { class: "links" }, h("button", { type: "button", class: "two", onclick: about }, "About me")));
function about() { open(h("h2", { id: "sh" }, "About"), h("img", { class: "me", src: PERSON.portrait, alt: "Jash Parmar", width: 288, height: 318 }), h("p", {}, ABOUT), h("ul", { class: "stats" }, STATS.map(([n, l]) => h("li", {}, h("b", {}, n), l))), EXPERIENCE.flatMap((e) => [h("h3", {}, `${e.role}, ${e.org}`), h("p", {}, e.when.replace("·", "to")), h("p", {}, e.what)]), h("h3", {}, "Education"), h("p", {}, EDUCATION), h("div", { class: "links" }, ...CONTACT.resumes.map(([t, u], i) => link(i ? "FDE résumé" : "SDE résumé", u, i)), link("Classic site", "/classic/", 1))); } $("about").onclick = about;
$("contact").onclick = () => go(10); $("home").onclick = () => go(0);
// travel
const stop = () => { if (intro < 1) { intro = 1; to = Math.round(p); } falling = false; $("fall").textContent = "Fall through everything"; };
const step = (d) => { stop(); to = Math.round(Math.abs(to - Math.round(to)) < 0.02 ? to : to + d * 0.3) + d; idle = 9; };
function go(i) { stop(); let d = mod(i - Math.round(p) + 5, N) - 5; if (Math.abs(d) <= 1) { to = Math.round(p) + d; return; } if (calm) { p = to = i; v = 0; return; } $("c").classList.add("cut"); $("panel").classList.add("off"); setTimeout(() => { p = i - 0.85; to = i; v = 0; $("c").classList.remove("cut"); }, 170); }
addEventListener("wheel", (e) => { if ($("sheet").open) return; stop(); to += Math.max(-0.3, Math.min(0.3, (e.deltaMode ? e.deltaY * 30 : e.deltaY) * 0.0017)); to = Math.max(p - 1.6, Math.min(p + 1.6, to)); idle = 0; dir = Math.sign(e.deltaY); }, { passive: true }); let dir = 1;
let ty = null, moved = 0; const cv = $("c");
addEventListener("pointermove", (e) => { mx = (e.clientX / w) * 2 - 1; my = (e.clientY / ht) * 2 - 1; if (ty !== null) { const d = ty - e.clientY; ty = e.clientY; moved += Math.abs(d); to += d * (tall ? 0.0032 : 0.0022); dir = Math.sign(d) || dir; idle = 0; } });
// what is under the pointer
const ray = new THREE.Raycaster(), nd = new THREE.Vector2(), still = () => Math.abs(p - Math.round(p)) < 0.06 && intro >= 1 && !falling;
function pick(cx, cy) { if (!still()) return null; const wd = W[mod(Math.round(p), N)]; nd.set((cx / w) * 2 - 1, 1 - (cy / ht) * 2); ray.setFromCamera(nd, eye); ray.near = 0.1; ray.far = 80; wd.scene.updateMatrixWorld(); const f = ray.intersectObjects(wd.scene.children, true).find((x) => { for (let o = x.object; o; o = o.parent) if (!o.visible) return false; return true; }); if (!f) return null; if (f.object === wd.hole) return { door: true }; let o = f.object, on = null, top = o; while (o && o !== wd.scene) { on ??= o.userData.on ? ((top = o), o.userData.on) : null; if (!on) top = o; o = o.parent; } return { on, top, point: f.point, wd }; }
const hops = new Map(); function hop(o) { if (!hops.has(o)) hops.set(o, { t: T, s: o.scale.clone() }); else hops.get(o).t = T; }
function hopping() { hops.forEach((k, o) => { const u = T - k.t, a = Math.exp(-u * 5) * Math.sin(u * 22) * 0.16; o.scale.set(k.s.x * (1 - a * 0.7), k.s.y * (1 + a), k.s.z * (1 - a * 0.7)); if (u > 1.1) { o.scale.copy(k.s); hops.delete(o); } }); }
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), onPlane = (cx, cy) => { nd.set((cx / w) * 2 - 1, 1 - (cy / ht) * 2); ray.setFromCamera(nd, eye); return ray.ray.intersectPlane(plane, new THREE.Vector3()) ?? new THREE.Vector3(); };
let held = null, lx = 0, ly = 0, hoverAt = 0;
cv.addEventListener("pointermove", (e) => { if (held) { if (Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly) > 0) { moved += Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly); held.on.drag(e.clientX - lx, e.clientY - ly, onPlane(lx, ly), onPlane(e.clientX, e.clientY)); lx = e.clientX; ly = e.clientY; } return; } if (e.pointerType !== "mouse" || performance.now() - hoverAt < 60) return; hoverAt = performance.now(); const k = pick(e.clientX, e.clientY); cv.style.cursor = !k ? "default" : k.door ? "zoom-in" : k.on?.tip ?? "pointer"; });
let hit = null; cv.addEventListener("pointerdown", (e) => { if (e.button) return; const was = falling || intro < 1; stop(); moved = 0; hit = was ? null : pick(e.clientX, e.clientY); cv.setPointerCapture(e.pointerId); if (hit?.on?.drag) { held = hit; lx = e.clientX; ly = e.clientY; cv.style.cursor = "grabbing"; return; } ty = e.clientY; }); const up = () => { const k = hit; hit = null; if (held) { held.on.drop?.(); held = null; cv.style.cursor = "grab"; } else if (ty === null) return; ty = null; if (moved > 8 || !k) return; if (k.door) step(1); else { if (!k.on || !k.on.tip) hop(k.top); k.on?.click?.(k.point, k.top); } }; cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
let py = null; $("panel").addEventListener("touchstart", (e) => { py = e.touches[0].clientY; }, { passive: true }); $("panel").addEventListener("touchend", (e) => { const d = py - e.changedTouches[0].clientY; if (Math.abs(d) > 46) step(Math.sign(d)); }, { passive: true });
addEventListener("keydown", (e) => { if ($("sheet").open || e.metaKey || e.ctrlKey) return; const on = document.activeElement?.matches("button,a"); if (["ArrowDown", "ArrowRight", "PageDown"].includes(e.key) || (e.key === " " && !on)) step(1); else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) step(-1); else if (e.key === "Home") go(0); else if (e.key === "End") go(10); else return; e.preventDefault(); });
$("next").onclick = () => step(1); $("prev").onclick = () => step(-1); $("sheet").addEventListener("click", (e) => { if (e.target === $("sheet")) $("sheet").close(); });
$("fall").onclick = () => { if (falling) { stop(); to = Math.round(p + 0.2); return; } stop(); falling = true; to = p; $("fall").textContent = "Stop here"; };
let lastZ = "", slow = 0, seen = 0;
function frame(now) {
  const dt = Math.min(0.05, (now - (frame.l ?? now)) / 1000); frame.l = now; requestAnimationFrame(frame);
  if ($("sheet").open && !frame.force) { return; }
  if (intro < 1) { intro = Math.min(1, intro + dt / 3.2); const e = 1 - (1 - intro) ** 3 * (1 + 0.0); p = 4 * (1 - e); to = 0; v = 0; }
  else if (falling) { const f = mod(p, 1); p += dt * (0.16 + 0.62 * (0.5 - 0.5 * Math.cos(f * 6.2832))); to = p; v = 0; }
  else { if (ty === null) { idle += dt; if (idle > 0.14 && Math.abs(to - Math.round(to)) > 0.001) to = dir > 0 ? Math.ceil(to - 0.1) : Math.floor(to + 0.1); } if (calm) { p = Math.round(to); } else { const o = 8.5; v += ((to - p) * o * o - 2 * o * v) * dt; p += v * dt; } if (ty === null && idle > 0.2 && Math.abs(p - to) < 0.0004 && Math.abs(v) < 0.001) { p = to; v = 0; if (p < 0 || p >= N) { p = to = mod(p, N); } } }
  const r = Math.round(p), i = mod(r, N), off = p - r > 0.16 || r - p > 0.035 || (intro < 0.9 && intro > 0); if (i !== shown) { $("panel").classList.add("off"); say(i); } $("panel").classList.toggle("off", off); if (!off && Math.abs(p - to) < 0.01) address(i);
  const z = mod(p, N), zi = Math.floor(z), tx = z < 3 ? `${Math.round(10 ** z).toLocaleString("en-GB")}×` : `10<sup>${zi}</sup>×`; if (tx !== lastZ) $("zoom").firstChild.innerHTML = lastZ = tx;
  hopping(); draw(dt);
  if (++seen > 40 && dt > 0.024 && dt < 0.05) { if (++slow > 45 && q > 0.8) { q = Math.max(0.8, q - 0.2); slow = 0; size(); } } else slow = Math.max(0, slow - 0.4);
}
const hash = [null, ...ORDER, "hello"].indexOf(location.hash.slice(1).replace("drishi", "stepwise")); if (hash > 0) { p = to = hash; intro = 1; }
W.forEach((x) => rd.compile(x.scene, cam)); document.fonts.ready.then(() => requestAnimationFrame(frame));
window.__s = () => ({ p, to, q, calls: rd.info.render.calls, stamp, got, pick, W, set: (x) => { p = to = x; v = 0; intro = 1; }, step, go });
