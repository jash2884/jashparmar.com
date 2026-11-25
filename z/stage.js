// A single world on a full screen canvas: camera, pointer, loop.
import { THREE, G } from "./ink.js?v=1";
export function stage(cv, w, o) {
  const rd = new THREE.WebGLRenderer({ canvas: cv, antialias: true, stencil: true, preserveDrawingBuffer: false, powerPreference: "high-performance" }); rd.outputColorSpace = THREE.LinearSRGBColorSpace; rd.autoClear = false; const cam = new THREE.PerspectiveCamera(), ray = new THREE.Raycaster(), nd = new THREE.Vector2(), fine = matchMedia("(pointer: fine)").matches, calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let q = Math.min(devicePixelRatio, innerWidth < 760 ? 1.75 : 1.5), W = 1, H = 1, T = 0, last = 0, ox = 0, oy = 0, slow = 0, n = 0; const ms = { x: 0, y: 0, px: innerWidth / 2, py: innerHeight / 2, over: false };
  w.portalMat ??= { stencilRef: 0 }; w.setLevel(0);
  const size = () => { W = innerWidth; H = innerHeight; rd.setPixelRatio(q); rd.setSize(W, H, false); }; size(); addEventListener("resize", size);
  // the part of the screen the panel and the menu leave free
  let box = null, hb = 0; const look = () => { box = document.querySelector('section.box')?.getBoundingClientRect(); hb = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0; }; look(); addEventListener('resize', () => setTimeout(look, 60)); document.fonts?.ready.then(look); setInterval(look, 1500);
  const rect = (v) => { if (!box) return { x: 0, y: 0, w: W, h: H }; if (box.width > W * 0.7) return { x: 0, y: hb - 6, w: W, h: Math.max(80, box.top - hb - 2) }; if (v.side || box.width > W * 0.36) return { x: box.right + 12, y: H < 520 ? hb : 70, w: W - box.right - 24, h: H - (H < 520 ? hb + 6 : 84) }; return { x: 0, y: 0, w: W, h: H }; };
  function draw(W2 = W, H2 = H, scale = q, pan = true) {
    const v = o.view(W2 / H2, W2, H2), asp = W2 / H2, R = pan ? rect(v) : { x: W2 * 0.03, y: H2 * 0.04, w: W2 * 0.94, h: H2 * 0.92 }, [el, er, et, eb] = v.ext, sc = Math.min(R.w / (el + er), R.h / (et + eb)), tv = H2 / (2 * v.dist * sc), Y = v.yaw + (pan ? ox * (v.sway ?? 0.16) : 0), X = v.pitch + (pan ? oy * (v.sway ?? 0.16) * 0.5 : 0), ax = (R.x + el * sc + (R.w - (el + er) * sc) / 2) / W2, ay = (R.y + et * sc + (R.h - (et + eb) * sc) / 2) / H2, n2 = 0.2; const at = v.at ?? [0, 0, 0];
    G.res.value.set(W2 * scale, H2 * scale); G.axis.value.set(ax * W2 * scale, (1 - ay) * H2 * scale); G.cell.value = 5.2 * scale * Math.min(1.3, Math.max(0.66, Math.min(R.w, R.h) / 760)); G.ang.value = 0; G.line.value = Math.min(9, (H2 * scale) / (2 * tv) / v.dist * 0.034 * (v.line ?? 1)); G.time.value = T; G.sun.value.set(-0.45 + (pan ? ox * 0.75 : 0), 0.72 - (pan ? oy * 0.5 : 0), 0.62); G.mouse.value.set(ms.px * q, (H - ms.py) * q, pan && fine ? 1 : 0);
    cam.position.set(at[0] + Math.sin(Y) * Math.cos(X) * v.dist, at[1] + Math.sin(X) * v.dist, at[2] + Math.cos(Y) * Math.cos(X) * v.dist); cam.up.set(0, 1, 0); cam.lookAt(...at); const th = tv * asp; cam.projectionMatrix.makePerspective(-n2 * th * 2 * ax, n2 * th * 2 * (1 - ax), n2 * tv * 2 * ay, -n2 * tv * 2 * (1 - ay), n2, 120); cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert(); cam.updateMatrixWorld(); rd.setRenderTarget(null); rd.clear(); rd.render(w.scene, cam);
  }
  const cast = (x, y) => { nd.set((x / W) * 2 - 1, 1 - (y / H) * 2); ray.setFromCamera(nd, cam); };
  const api = { ms, cam, rd, fine, calm, get T() { return T; },
    plane(x, y, pl) { cast(x, y); return ray.ray.intersectPlane(pl, new THREE.Vector3()); },
    pick(x, y) { cast(x, y); w.scene.updateMatrixWorld(); const f = ray.intersectObjects(w.scene.children, true).find((h) => { for (let k = h.object; k; k = k.parent) if (!k.visible) return false; return true; }); if (!f) return null; let k = f.object, on = null, top = k; while (k && k !== w.scene) { if (!on && k.userData.on) { on = k.userData.on; top = k; } if (!on) top = k; k = k.parent; } return { on, top, point: f.point }; },
    photo(pw, ph, name, after) { const keep = q; rd.setPixelRatio(1); rd.setSize(pw, ph, false); draw(pw, ph, 1, false); const c = document.createElement("canvas"); c.width = pw; c.height = ph; c.getContext("2d").drawImage(cv, 0, 0); q = keep; size(); draw(); after?.(c); save(c, name); },
  };
  addEventListener("pointermove", (e) => { ms.px = e.clientX; ms.py = e.clientY; ms.x = (e.clientX / W) * 2 - 1; ms.y = (e.clientY / H) * 2 - 1; ms.over = e.target === cv; });
  const frame = (now) => { requestAnimationFrame(frame); const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now; T += dt; ox += (ms.x - ox) * Math.min(1, dt * 5); oy += (ms.y - oy) * Math.min(1, dt * 5); o.tick?.(T, dt); for (const f of w.ticks) f(T); draw(); if (++n > 60 && dt > 0.026 && dt < 0.05) { if (++slow > 45 && q > 0.8) { q -= 0.2; slow = 0; size(); } } else slow = Math.max(0, slow - 0.4); };
  (document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(frame)); return api;
}
export function save(c, name) { c.toBlob((b) => { const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, "image/png"); }
