// The print: every surface is two inks, a halftone between them and a drawn outline.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
THREE.ColorManagement.enabled = false;
export const G = { axis: { value: new THREE.Vector2() }, cell: { value: 6 }, ang: { value: 0 }, res: { value: new THREE.Vector2(1, 1) }, line: { value: 3 }, time: { value: 0 } };
const C = (c) => new THREE.Color(c), lerp = (a, b, t) => C(a).lerp(C(b), t);
export const DOTS = `uniform vec2 axis; uniform float cell, ang;
float dots(float dark){ vec2 p=gl_FragCoord.xy-axis; float s=sin(ang+.5),c=cos(ang+.5); p=mat2(c,-s,s,c)*p/cell; float d=length(fract(p)-.5), r=sqrt(clamp(dark,0.,1.))*.73, aa=.8/cell;
 float m=smoothstep(r+aa,r-aa,d); if(dark<.015)m=0.; return mix(dark,m,smoothstep(1.6,3.2,cell)); }`;
const VERT = `varying vec3 vN, vC; attribute vec3 sn; uniform float line; uniform vec2 res;
void main(){ vec4 p=vec4(position,1.); vec3 n=normal, o=sn; vC=vec3(1.);
#ifdef USE_INSTANCING
 p=instanceMatrix*p; n=mat3(instanceMatrix)*n; o=mat3(instanceMatrix)*o;
#endif
#ifdef USE_INSTANCING_COLOR
 vC=instanceColor;
#endif
 vN=normalize(normalMatrix*n); gl_Position=projectionMatrix*modelViewMatrix*p;
#ifdef HULL
 vec3 q=normalize(normalMatrix*o); vec2 e=(projectionMatrix*vec4(q,0.)).xy; float l=length(e); if(l>.0001) gl_Position.xy+=e/l*line*2./res*gl_Position.w*min(1.,length(q.xy)*3.);
#endif
}`;
const FRAG = `uniform vec3 a,b,h; uniform float hl, bias; varying vec3 vN, vC; ${DOTS}
void main(){ vec3 n=normalize(vN); float l=dot(n,normalize(vec3(-.5,.72,.62))); float dark=smoothstep(.62,-.4,l+bias);
 vec3 c=mix(a*vC,b*mix(vec3(1.),vC,.8),dots(dark)); if(hl>.5) c=mix(c,h,smoothstep(.955,.965,l)); gl_FragColor=vec4(c,1.); }`;
const st = { stencilWrite: true, stencilFunc: THREE.EqualStencilFunc, stencilRef: 0, stencilZPass: THREE.KeepStencilOp };
const smooth = (g) => {
  if (g.attributes.sn) return g; const p = g.attributes.position, n = g.attributes.normal, m = new Map(), k = []; for (let i = 0; i < p.count; i++) { const s = [p.getX(i), p.getY(i), p.getZ(i)].map((v) => Math.round(v * 500)).join(); k.push(s); const a = m.get(s) ?? [0, 0, 0]; a[0] += n.getX(i); a[1] += n.getY(i); a[2] += n.getZ(i); m.set(s, a); }
  const o = new Float32Array(p.count * 3); k.forEach((s, i) => { const a = m.get(s), l = Math.hypot(...a) || 1; o.set([a[0] / l, a[1] / l, a[2] / l], i * 3); }); g.setAttribute("sn", new THREE.BufferAttribute(o, 3)); return g;
};
const cache = new Map(), once = (k, f) => { if (!cache.has(k)) cache.set(k, smooth(f())); return cache.get(k); };
export const geo = {
  box: (w, h, d, r = 0.12) => once(`b${[w, h, d, r]}`, () => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.01, h / 2.01, d / 2.01))),
  cyl: (r, h, r2 = r, s = 40) => once(`c${[r, h, r2, s]}`, () => new THREE.CylinderGeometry(r2, r, h, s)),
  disc: (r, h, s = 56) => once(`d${[r, h, s]}`, () => new THREE.CylinderGeometry(r, r, h, s).rotateX(Math.PI / 2)),
  sph: (r, s = 28) => once(`s${[r, s]}`, () => new THREE.SphereGeometry(r, s, Math.round(s * 0.7))),
  tor: (r, t, s = 56, a = Math.PI * 2) => once(`t${[r, t, s, a]}`, () => new THREE.TorusGeometry(r, t, 12, s, a)),
  cone: (r, h, s = 24) => once(`k${[r, h, s]}`, () => new THREE.ConeGeometry(r, h, s)),
  cap: (r, l) => once(`p${[r, l]}`, () => new THREE.CapsuleGeometry(r, l, 6, 18)),
  ext: (shape, d, bev = 0.07, seg = 18) => smooth(new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: bev > 0, bevelSize: bev, bevelThickness: bev, bevelSegments: 3, curveSegments: seg })),
  tube: (pts, r, s = 40) => smooth(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), s, r, 10)),
};
export class World {
  constructor({ paper, paper2, pattern = 0, ink, shade = 0.5 }) {
    this.scene = new THREE.Scene(); this.paper = paper; this.ink = ink; this.shade = shade; this.mats = []; this.ticks = []; this.byColour = new Map();
    this.hull = this.keep(new THREE.ShaderMaterial({ vertexShader: "#define HULL\n" + VERT, fragmentShader: `uniform vec3 a; varying vec3 vN, vC; void main(){ gl_FragColor=vec4(a,1.); }`, uniforms: { a: { value: C(ink) }, line: G.line, res: G.res }, side: THREE.BackSide, ...st }));
    const bg = new THREE.Mesh(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3)), this.keep(new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, ...st, uniforms: { a: { value: C(paper) }, b: { value: C(paper2 ?? paper) }, axis: G.axis, cell: G.cell, ang: G.ang, res: G.res, time: G.time },
      vertexShader: "void main(){ gl_Position=vec4(position.xy,1.,1.); }",
      fragmentShader: `uniform vec3 a,b; uniform vec2 res; uniform float time; ${DOTS}
void main(){ vec2 p=gl_FragCoord.xy-axis; float s=sin(ang),c=cos(ang); p=mat2(c,-s,s,c)*p; float u=cell*26., r=length(p)/u, t=atan(p.y,p.x), k=0.;
 ${["k=smoothstep(.2,7.,r)*.8;", "k=step(.5,fract(t/6.28318*14.+time*.012));", "k=step(.5,fract(r*.55-time*.05));", "k=step(.5,fract(p.x/u*.5));", "k=dot(p,vec2(.0,-1.))/u*.12+.45;", "vec2 g=p/u*.9, f=floor(g); float n=fract(sin(dot(f,vec2(12.9,78.2)))*43758.5); vec2 q=fract(g)-.5-vec2(n-.5,fract(n*7.)-.5)*.6; k=step(length(q),.015+.035*fract(n*13.));", "k=step(.5,fract((p.x+p.y)/u*.35));", "vec2 q=p/u*1.1; vec2 f=floor(q); k=mod(f.x+f.y,2.);"][pattern]}
 ${[0, 4].includes(pattern) ? "gl_FragColor=vec4(mix(a,b,dots(clamp(k,0.,.95))),1.);" : "gl_FragColor=vec4(mix(a,b,k),1.);"} }` }))); bg.frustumCulled = false; bg.renderOrder = -999; this.scene.add(bg);
  }
  keep(m) { this.mats.push(m); return m; }
  mat(c, { b, hl = 0, bias = 0 } = {}) {
    const k = [c, b, hl, bias].join(); if (!this.byColour.has(k)) this.byColour.set(k, this.keep(new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, side: THREE.DoubleSide, ...st, uniforms: { a: { value: C(c) }, b: { value: b ? C(b) : lerp(c, this.ink, this.shade) }, h: { value: lerp(c, "#ffffff", 0.8) }, hl: { value: hl }, bias: { value: bias }, axis: G.axis, cell: G.cell, ang: G.ang, res: G.res, line: G.line } })));
    return this.byColour.get(k);
  }
  // add a mesh: colour, position, rotation, options
  add(g, c, x = 0, y = 0, z = 0, o = {}) {
    const m = new THREE.Mesh(g, this.mat(c, o)); m.position.set(x, y, z); if (o.r) m.rotation.set(...o.r); if (o.s) Array.isArray(o.s) ? m.scale.set(...o.s) : m.scale.setScalar(o.s);
    if (o.line !== 0) m.add(new THREE.Mesh(g, this.hull)); (o.to ?? this.scene).add(m); return m;
  }
  many(g, list, o = {}) { // list of {x,y,z,r,s,c}
    if (!g.attributes.sn) smooth(g); const mat = this.mat("#ffffff", { b: o.b ?? "#8a8a9a", hl: o.hl ?? 0 }), m = new THREE.InstancedMesh(g, mat, list.length), d = new THREE.Object3D(); m.frustumCulled = false;
    m.set = (i, q) => { d.position.set(q.x, q.y, q.z ?? 0); d.rotation.set(...(q.r ?? [0, 0, 0])); Array.isArray(q.s) ? d.scale.set(...q.s) : d.scale.setScalar(q.s ?? 1); d.updateMatrix(); m.setMatrixAt(i, d.matrix); m.instanceMatrix.needsUpdate = true; };
    list.forEach((q, i) => { m.set(i, q); m.setColorAt(i, C(q.c)); }); if (o.line !== 0) { const l = new THREE.InstancedMesh(g, this.hull, list.length); l.instanceMatrix = m.instanceMatrix; l.frustumCulled = false; m.add(l); } (o.to ?? this.scene).add(m); return m;
  }
  group(x = 0, y = 0, z = 0, to = this.scene) { const g = new THREE.Group(); g.position.set(x, y, z); to.add(g); return g; }
  // the way into the next world
  portal(shape, r = 0.95, z = 0.02) {
    this.r = r; this.portalMat = new THREE.ShaderMaterial({ vertexShader: "void main(){ gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }", fragmentShader: "uniform vec3 a; void main(){ gl_FragColor=vec4(a,1.); }", uniforms: { a: { value: C("#000") } }, side: THREE.DoubleSide, ...st, stencilZPass: THREE.IncrementStencilOp });
    const g = shape ? new THREE.ShapeGeometry(shape, 40) : new THREE.CircleGeometry(r, 72), m = new THREE.Mesh(g, this.portalMat); m.position.z = z; m.renderOrder = 999; this.scene.add(m); this.hole = m; return m;
  }
  setLevel(l) { for (const m of this.mats) m.stencilRef = l; this.portalMat.stencilRef = l; }
  each(f) { this.ticks.push(f); }
}
export { THREE, C, lerp };
