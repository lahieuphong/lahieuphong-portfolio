/* ═══════════════════════════════════════════════════════════
   THREE-CLOUDS — Realistic billboard cloud sprites for hero.
   Each cloud is a THREE.Sprite (always faces camera) rendered
   with a multi-puff canvas texture.  Sprites drift slowly and
   respond to mouse parallax via camera offset.
═══════════════════════════════════════════════════════════ */

// ── Texture factory ─────────────────────────────────────────
function makePuff(ctx, x, y, r, alpha) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0,    `rgba(255, 254, 252, ${alpha})`);
  g.addColorStop(0.38, `rgba(255, 252, 249, ${(alpha * 0.70).toFixed(2)})`);
  g.addColorStop(0.72, `rgba(254, 250, 246, ${(alpha * 0.28).toFixed(2)})`);
  g.addColorStop(1,    'rgba(253, 249, 244, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function makeCloudTexture(variant = 0) {
  const S = 512, h = S / 2;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const ctx = cv.getContext('2d');

  const layouts = [
    // variant 0 — wide horizontal cloud
    [ [h,         h+h*.14, h*.58, .78], [h,         h-.04*h, h*.50, .88],
      [h-h*.36,   h+h*.06, h*.40, .72], [h+h*.38,   h+h*.04, h*.42, .74],
      [h-h*.18,   h-h*.18, h*.35, .82], [h+h*.20,   h-h*.16, h*.36, .80],
      [h-h*.50,   h+h*.18, h*.28, .58], [h+h*.52,   h+h*.16, h*.30, .60],
      [h,         h-h*.27, h*.26, .90] ],
    // variant 1 — tall puffy cloud
    [ [h,         h,       h*.62, .80], [h-h*.22,   h-h*.22, h*.44, .84],
      [h+h*.24,   h-h*.18, h*.46, .82], [h,         h-h*.36, h*.38, .90],
      [h-h*.40,   h+h*.12, h*.34, .68], [h+h*.42,   h+h*.10, h*.36, .70],
      [h-h*.12,   h+h*.24, h*.28, .75], [h+h*.14,   h+h*.26, h*.28, .72] ],
    // variant 2 — wispy thin cloud
    [ [h,         h+h*.06, h*.70, .50], [h-h*.50,   h+h*.08, h*.48, .40],
      [h+h*.52,   h+h*.06, h*.50, .42], [h-h*.25,   h-.02*h, h*.38, .55],
      [h+h*.26,   h-.02*h, h*.40, .52], [h,         h-h*.15, h*.30, .60] ],
  ];

  const chosen = layouts[variant % layouts.length];
  chosen.forEach(([x, y, r, a]) => makePuff(ctx, x, y, r, a));
  return new THREE.CanvasTexture(cv);
}

// ── Cloud placement definitions ──────────────────────────────
// [x,    y,    z,    scaleW, scaleH, opacity, driftSpeed, textureVariant]
const CLOUD_DEFS = [
  // ── FAR layer  z -7 to -10  (small, very transparent) ───
  [-16,  4.0, -9.5,  14, 5.0, 0.19, 0.00040, 0],
  [ -5,  4.5, -10,   16, 5.5, 0.17, 0.00032, 1],
  [  6,  4.2, -9.0,  15, 5.2, 0.20, 0.00048, 2],
  [ 17,  4.0, -9.5,  14, 5.0, 0.18, 0.00038, 0],
  [-16,  1.5, -8.5,  13, 4.8, 0.22, 0.00050, 1],
  [ -4,  2.0, -9.0,  15, 5.2, 0.20, 0.00042, 2],
  [  8,  1.8, -8.0,  14, 5.0, 0.22, 0.00052, 0],
  [ 18,  1.5, -9.0,  13, 4.8, 0.19, 0.00040, 1],
  [-16, -0.5, -8.5,  12, 4.5, 0.16, 0.00038, 2],
  [  3, -0.2, -9.5,  13, 4.8, 0.17, 0.00034, 0],
  [ 16, -0.8, -8.5,  12, 4.5, 0.16, 0.00040, 1],

  // ── MID layer  z -4 to -6  (medium, moderate opacity) ───
  [-15,  3.2, -5.5,  16, 5.8, 0.28, 0.00068, 2],
  [ -3,  3.8, -5.0,  20, 6.5, 0.26, 0.00060, 0],
  [ 10,  3.4, -5.5,  18, 6.2, 0.30, 0.00072, 1],
  [ 22,  3.0, -5.0,  16, 5.8, 0.25, 0.00058, 2],
  [-15,  0.8, -4.5,  16, 5.8, 0.30, 0.00080, 0],
  [  1,  1.4, -5.0,  20, 6.8, 0.28, 0.00072, 1],
  [ 13,  1.0, -4.5,  18, 6.2, 0.32, 0.00082, 2],
  [-15, -1.5, -5.5,  14, 5.2, 0.23, 0.00062, 0],
  [  5, -1.0, -5.0,  16, 5.8, 0.25, 0.00068, 1],
  [ 19, -1.5, -5.5,  14, 5.2, 0.23, 0.00060, 2],

  // ── NEAR layer  z -2 to -3  (large, most opaque) ────────
  [-14,  1.0, -2.5,  20, 7.5, 0.40, 0.00100, 0],
  [  2,  1.5, -2.0,  24, 8.0, 0.36, 0.00105, 1],
  [ 16,  1.2, -2.5,  22, 7.8, 0.42, 0.00095, 2],
  [-14,  3.5, -3.0,  18, 7.0, 0.34, 0.00085, 0],
  [  5,  4.0, -2.5,  22, 8.0, 0.36, 0.00100, 1],
  [ 19,  3.5, -3.0,  20, 7.5, 0.38, 0.00092, 2],
  [-14, -1.0, -2.5,  18, 6.5, 0.32, 0.00090, 0],
  [  7, -0.5, -2.0,  22, 7.5, 0.35, 0.00098, 1],
  [ 20, -1.0, -2.5,  20, 7.0, 0.34, 0.00088, 2],
];

export function initThreeClouds() {
  const heroCanvas = document.getElementById('hero-canvas');
  if (!heroCanvas || typeof THREE === 'undefined') return;

  const hero = document.getElementById('hero');
  const W = heroCanvas.offsetWidth  || window.innerWidth;
  const H = heroCanvas.offsetHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: false });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(W, H);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(54, W / H, 0.1, 60);
  camera.position.z = 6;

  // Pre-build 3 texture variants
  const textures = [
    makeCloudTexture(0),
    makeCloudTexture(1),
    makeCloudTexture(2),
  ];

  // Instantiate sprites
  const clouds = CLOUD_DEFS.map(([x, y, z, sw, sh, op, spd, tv]) => {
    const mat = new THREE.SpriteMaterial({
      map: textures[tv],
      transparent: true,
      opacity: op,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, y, z);
    sprite.scale.set(sw, sh, 1);
    scene.add(sprite);
    return { sprite, vx: spd };
  });

  // Mouse parallax
  let tx = 0, ty = 0, cx = 0, cy = 0;
  const lerp = (a, b, t) => a + (b - a) * t;

  if (hero) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width  - 0.5;
      ty = (e.clientY - r.top)  / r.height - 0.5;
    });
    hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
  }

  // Resize
  const ro = new ResizeObserver(() => {
    const w = heroCanvas.offsetWidth, h = heroCanvas.offsetHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  ro.observe(heroCanvas);

  // Render loop
  (function tick() {
    requestAnimationFrame(tick);

    // Drift each cloud slowly to the right, wrap when offscreen
    clouds.forEach(c => {
      c.sprite.position.x += c.vx;
      if (c.sprite.position.x > 26) c.sprite.position.x -= 48;
    });

    // Smooth camera parallax follows mouse
    cx = lerp(cx, tx, 0.028);
    cy = lerp(cy, ty, 0.028);
    camera.position.x =  cx * 1.4;
    camera.position.y = -cy * 0.6;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  })();
}