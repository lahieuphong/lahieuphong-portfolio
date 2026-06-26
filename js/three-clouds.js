/* ═══════════════════════════════════════════════════════════
   THREE-CLOUDS — Realistic billboard cloud sprites for hero.
   Each cloud is a THREE.Sprite (always faces camera) rendered
   with a multi-puff canvas texture.  Sprites drift slowly and
   respond to mouse parallax via camera offset.
═══════════════════════════════════════════════════════════ */

import * as THREE from 'three';
import cloudscapeUrl from '../assets/images/hero/unesco-cloudscape.png';

const ATMOSPHERE_VERTEX_SHADER = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.52;
    mat2 m = mat2(1.62, 1.18, -1.18, 1.62);

    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p = m * p + 9.7;
      a *= 0.52;
    }

    return v;
  }

  float ellipseCloud(vec2 uv, vec2 center, vec2 scale, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    vec2 p = uv - center;
    p = mat2(c, -s, s, c) * p;
    p /= scale;
    float d = dot(p, p);
    return 1.0 - smoothstep(0.36, 1.18, d);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = max(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 auv = vec2((uv.x - 0.5) * aspect + 0.5, uv.y);
    float t = uTime * 0.025;

    vec3 baseTop = vec3(0.965, 0.902, 0.870);
    vec3 baseMid = vec3(0.988, 0.950, 0.920);
    vec3 baseBot = vec3(0.960, 0.875, 0.825);
    vec3 col = mix(baseBot, baseMid, smoothstep(0.03, 0.58, uv.y));
    col = mix(col, baseTop, smoothstep(0.68, 1.0, uv.y) * 0.88);

    float largeNoise = fbm(auv * 2.0 + vec2(t, -t * 0.55));
    float detailNoise = fbm(auv * 7.0 + vec2(-t * 1.7, t * 0.9));
    float threadNoise = fbm(auv * 16.0 + vec2(t * 2.0, -t * 1.4));

    float mass = 0.0;
    mass += ellipseCloud(auv, vec2(0.36, 0.69), vec2(0.50, 0.30), -0.04) * 0.74;
    mass += ellipseCloud(auv, vec2(0.62, 0.66), vec2(0.58, 0.34),  0.05) * 0.82;
    mass += ellipseCloud(auv, vec2(0.18, 0.52), vec2(0.44, 0.30),  0.02) * 0.88;
    mass += ellipseCloud(auv, vec2(0.82, 0.54), vec2(0.50, 0.31), -0.08) * 0.76;
    mass += ellipseCloud(auv, vec2(0.46, 0.42), vec2(0.50, 0.25),  0.06) * 0.62;
    mass += ellipseCloud(auv, vec2(0.36, 0.20), vec2(0.46, 0.22), -0.02) * 0.74;

    float turbulent = mass + largeNoise * 0.42 + detailNoise * 0.18 - 0.34;
    float cloud = smoothstep(0.16, 0.78, turbulent);
    float dense = smoothstep(0.46, 1.04, turbulent + threadNoise * 0.10);
    float breaks = smoothstep(0.58, 0.92, detailNoise + largeNoise * 0.22);

    vec3 cloudWhite = vec3(1.0, 0.985, 0.965);
    vec3 cloudWarm = vec3(0.965, 0.840, 0.790);
    vec3 cloudCool = vec3(0.720, 0.770, 0.780);
    vec3 shadow = vec3(0.640, 0.650, 0.640);

    float coolPatch = ellipseCloud(auv, vec2(0.30, 0.62), vec2(0.28, 0.20), 0.18)
                    + ellipseCloud(auv, vec2(0.84, 0.66), vec2(0.30, 0.18), -0.10);
    float warmPatch = ellipseCloud(auv, vec2(0.55, 0.40), vec2(0.45, 0.24), 0.04)
                    + ellipseCloud(auv, vec2(0.24, 0.25), vec2(0.30, 0.18), -0.04);

    col = mix(col, cloudWhite, cloud * 0.78);
    col = mix(col, cloudWarm, warmPatch * cloud * 0.16);
    col = mix(col, cloudCool, coolPatch * cloud * 0.13);
    col = mix(col, shadow, (dense * (1.0 - breaks) * 0.20));

    float centerLight = ellipseCloud(auv, vec2(0.48, 0.32), vec2(0.31, 0.17), 0.02);
    col = mix(col, vec3(1.0, 0.990, 0.965), centerLight * 0.36);

    float shadowMass = smoothstep(0.12, 0.92, mass + largeNoise * 0.52 - 0.18);
    float topShadow = ellipseCloud(auv, vec2(0.58, 0.73), vec2(0.64, 0.26), 0.02);
    float rightShadow = ellipseCloud(auv, vec2(0.86, 0.60), vec2(0.34, 0.24), -0.05);
    float leftBlue = ellipseCloud(auv, vec2(0.26, 0.52), vec2(0.32, 0.22), 0.10);
    float shadowLayer = clamp((topShadow * 0.75 + rightShadow * 0.70 + leftBlue * 0.55) * shadowMass, 0.0, 1.0);
    col = mix(col, vec3(0.660, 0.710, 0.715), shadowLayer * 0.32);
    col = mix(col, vec3(1.0, 0.995, 0.980), dense * 0.30);

    float topHaze = smoothstep(0.36, 0.92, uv.y);
    col = mix(col, vec3(0.995, 0.940, 0.905), topHaze * 0.14);

    float vignette = smoothstep(0.95, 0.16, distance(uv, vec2(0.50, 0.48)));
    col = mix(col * 0.94, col, vignette);

    gl_FragColor = vec4(col, 0.98);
  }
`;

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
  const texture = new THREE.CanvasTexture(cv);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeMistTexture(variant = 0) {
  const W = 1024, H = 512;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d');

  const tint = variant % 2
    ? [255, 244, 236]
    : [231, 235, 233];

  const puffs = [
    [0.08, 0.58, 0.30, 0.30],
    [0.22, 0.48, 0.38, 0.48],
    [0.38, 0.44, 0.42, 0.56],
    [0.55, 0.49, 0.46, 0.60],
    [0.72, 0.43, 0.40, 0.50],
    [0.88, 0.55, 0.34, 0.34],
  ];

  puffs.forEach(([x, y, r, alpha], index) => {
    const px = (x + Math.sin(variant + index) * 0.025) * W;
    const py = (y + Math.cos(variant * 1.7 + index) * 0.04) * H;
    const radius = r * W;
    const g = ctx.createRadialGradient(px, py, 0, px, py, radius);
    g.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    g.addColorStop(0.36, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, ${(alpha * 0.62).toFixed(2)})`);
    g.addColorStop(0.72, `rgba(247, 239, 232, ${(alpha * 0.22).toFixed(2)})`);
    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(px, py, radius, radius * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  const fade = ctx.createLinearGradient(0, 0, W, 0);
  fade.addColorStop(0, 'rgba(0, 0, 0, 0)');
  fade.addColorStop(0.16, 'rgba(0, 0, 0, 1)');
  fade.addColorStop(0.84, 'rgba(0, 0, 0, 1)');
  fade.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';

  const texture = new THREE.CanvasTexture(cv);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeGlowTexture() {
  const S = 512, h = S / 2;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const ctx = cv.getContext('2d');

  const g = ctx.createRadialGradient(h, h, 0, h, h, h);
  g.addColorStop(0, 'rgba(255, 244, 214, 0.92)');
  g.addColorStop(0.24, 'rgba(247, 214, 194, 0.58)');
  g.addColorStop(0.5, 'rgba(194, 216, 225, 0.28)');
  g.addColorStop(0.74, 'rgba(211, 160, 145, 0.16)');
  g.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);

  const texture = new THREE.CanvasTexture(cv);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function rand(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function drawCloudBlob(ctx, width, height, x, y, rx, ry, rgb, alpha, blur = 28, rotation = 0) {
  const px = x * width;
  const py = y * height;
  const rw = rx * width;
  const rh = ry * height;
  const radius = Math.max(rw, rh);

  ctx.save();
  ctx.filter = `blur(${blur}px)`;

  const g = ctx.createRadialGradient(px, py, 0, px, py, radius);
  g.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`);
  g.addColorStop(0.46, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha * 0.56})`);
  g.addColorStop(0.78, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha * 0.18})`);
  g.addColorStop(1, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`);

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(px, py, rw, rh, rotation, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function makeCloudscapeTexture() {
  const W = 2048, H = 1152;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d');

  const sky = ctx.createLinearGradient(0, 0, W, H);
  sky.addColorStop(0, '#EFDAD1');
  sky.addColorStop(0.30, '#F8ECE6');
  sky.addColorStop(0.58, '#FFF6EE');
  sky.addColorStop(1, '#E8C8BD');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Cool shadow beds first, then warm highlights and white mist.
  [
    [0.52, 0.22, 0.44, 0.18, [150, 161, 164], 0.48, 36, -0.08],
    [0.80, 0.23, 0.34, 0.16, [145, 150, 150], 0.40, 42, -0.03],
    [0.30, 0.36, 0.34, 0.19, [156, 179, 184], 0.36, 38, 0.08],
    [0.64, 0.53, 0.42, 0.20, [172, 162, 156], 0.32, 42, -0.04],
    [0.90, 0.55, 0.26, 0.20, [160, 158, 156], 0.34, 48, 0.03],
  ].forEach(args => drawCloudBlob(ctx, W, H, ...args));

  [
    [0.17, 0.48, 0.44, 0.28, [255, 255, 252], 1.00, 24, 0.02],
    [0.40, 0.41, 0.46, 0.27, [255, 255, 252], 0.98, 28, -0.06],
    [0.57, 0.35, 0.44, 0.24, [255, 253, 249], 0.92, 28, 0.05],
    [0.79, 0.43, 0.42, 0.25, [255, 248, 241], 0.90, 30, -0.04],
    [0.43, 0.57, 0.48, 0.24, [255, 255, 255], 1.00, 26, 0.03],
    [0.31, 0.78, 0.36, 0.18, [255, 255, 255], 0.98, 22, -0.05],
    [0.58, 0.74, 0.34, 0.17, [255, 247, 237], 0.82, 28, 0.06],
  ].forEach(args => drawCloudBlob(ctx, W, H, ...args));

  [
    [0.30, 0.26, 0.28, 0.13, [226, 199, 188], 0.46, 36, 0.02],
    [0.70, 0.36, 0.32, 0.17, [224, 184, 171], 0.42, 38, -0.05],
    [0.75, 0.72, 0.34, 0.18, [218, 174, 160], 0.36, 44, 0.02],
    [0.12, 0.70, 0.34, 0.18, [232, 198, 186], 0.38, 40, -0.02],
  ].forEach(args => drawCloudBlob(ctx, W, H, ...args));

  const clusters = [
    { cx: 0.50, cy: 0.31, sx: 0.33, sy: 0.13, count: 54, rgb: [235, 241, 241], alpha: 0.34 },
    { cx: 0.43, cy: 0.48, sx: 0.45, sy: 0.17, count: 72, rgb: [255, 255, 255], alpha: 0.52 },
    { cx: 0.19, cy: 0.57, sx: 0.30, sy: 0.17, count: 42, rgb: [255, 255, 255], alpha: 0.56 },
    { cx: 0.77, cy: 0.52, sx: 0.28, sy: 0.16, count: 38, rgb: [238, 226, 219], alpha: 0.36 },
    { cx: 0.40, cy: 0.78, sx: 0.32, sy: 0.12, count: 36, rgb: [255, 255, 255], alpha: 0.46 },
  ];

  clusters.forEach((cluster, clusterIndex) => {
    for (let i = 0; i < cluster.count; i += 1) {
      const a = rand(clusterIndex * 100 + i * 2.1);
      const b = rand(clusterIndex * 100 + i * 3.7 + 12.4);
      const c = rand(clusterIndex * 100 + i * 5.9 + 41.2);
      const x = cluster.cx + (a - 0.5) * cluster.sx;
      const y = cluster.cy + (b - 0.5) * cluster.sy;
      const r = 0.035 + Math.abs(c) * 0.060;
      drawCloudBlob(
        ctx,
        W,
        H,
        x,
        y,
        r * (1.2 + Math.abs(a) * 0.9),
        r * (0.48 + Math.abs(b) * 0.32),
        cluster.rgb,
        cluster.alpha * (0.55 + Math.abs(c) * 0.9),
        10 + Math.abs(a) * 14,
        (a - 0.5) * 0.7
      );
    }
  });

  drawCloudBlob(ctx, W, H, 0.50, 0.58, 0.24, 0.13, [255, 255, 255], 0.80, 22, 0.02);
  drawCloudBlob(ctx, W, H, 0.50, 0.84, 0.48, 0.13, [255, 255, 255], 0.62, 28, 0);

  const texture = new THREE.CanvasTexture(cv);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
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

// [x, y, z, scaleW, scaleH, opacity, driftSpeed, textureVariant, renderOrder]
const MIST_DEFS = [
  [-14,  4.5, -8.8, 30, 10.5, 0.38, 0.00020, 0, 0],
  [  0,  4.1, -8.0, 34, 11.2, 0.44, 0.00016, 1, 0],
  [ 14,  4.0, -7.4, 30, 10.4, 0.38, 0.00018, 2, 0],
  [-15,  1.8, -5.8, 30,  9.8, 0.44, 0.00028, 2, 1],
  [  0,  1.4, -5.0, 36, 10.8, 0.52, 0.00024, 3, 1],
  [ 15,  1.2, -5.4, 30,  9.8, 0.44, 0.00026, 0, 1],
  [-14, -1.7, -2.2, 30,  8.8, 0.58, 0.00046, 1, 4],
  [  1, -1.8, -1.8, 36,  9.8, 0.68, 0.00042, 0, 4],
  [ 15, -1.6, -2.0, 30,  8.8, 0.56, 0.00044, 2, 4],
  [  0,  0.3, -1.4, 32,  8.6, 0.50, 0.00030, 3, 5],
];

// [x, y, z, scaleW, scaleH, opacity, driftSpeed, textureVariant, color, renderOrder]
const FEATURE_CLOUD_DEFS = [
  [-8.8,  3.0, -1.7, 22.0, 7.4, 0.70, 0.00034, 1, 0xc1cdce, 6],
  [-2.8,  2.8, -1.5, 21.0, 7.2, 0.90, 0.00028, 0, 0xffffff, 7],
  [ 3.8,  2.9, -1.6, 22.5, 7.4, 0.84, 0.00030, 2, 0xe3d5cf, 7],
  [ 9.0,  2.7, -1.8, 20.0, 6.8, 0.66, 0.00026, 1, 0xbfc6c6, 6],
  [-9.2,  0.7, -1.1, 23.5, 7.0, 0.88, 0.00042, 0, 0xffffff, 8],
  [-1.0,  0.7, -1.0, 27.0, 7.7, 0.96, 0.00038, 1, 0xffffff, 10],
  [ 6.8,  0.6, -1.1, 23.5, 7.2, 0.78, 0.00040, 2, 0xe7d7d2, 8],
  [-6.2, -1.3, -0.9, 24.0, 6.7, 0.96, 0.00050, 1, 0xffffff, 11],
  [ 2.7, -1.2, -0.9, 26.5, 6.9, 0.92, 0.00047, 0, 0xfffbf5, 11],
  [ 9.4, -1.2, -1.0, 22.0, 6.4, 0.72, 0.00044, 2, 0xe0d0ca, 10],
];

function createAtmosphere(scene, width, height) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
    },
    vertexShader: ATMOSPHERE_VERTEX_SHADER,
    fragmentShader: ATMOSPHERE_FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  plane.frustumCulled = false;
  plane.renderOrder = -20;
  scene.add(plane);

  return { material };
}

function createCloudscape(scene) {
  const fallbackTexture = makeCloudscapeTexture();
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: fallbackTexture },
      uOpacity: { value: 1 },
    },
    vertexShader: ATMOSPHERE_VERTEX_SHADER,
    fragmentShader: `
      precision highp float;

      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float uOpacity;

      void main() {
        vec4 texel = texture2D(uTexture, vUv);
        gl_FragColor = vec4(texel.rgb, texel.a * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  plane.frustumCulled = false;
  plane.renderOrder = -19;
  scene.add(plane);

  new THREE.TextureLoader().load(cloudscapeUrl, texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    material.uniforms.uTexture.value = texture;
    fallbackTexture.dispose();
  });

  return { material, texture: fallbackTexture };
}

function createMuseumArtifact(scene, glowTexture) {
  const group = new THREE.Group();
  group.position.set(0.45, 1.28, -3.9);
  group.scale.setScalar(0.46);
  group.renderOrder = 2;
  scene.add(group);

  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture,
    transparent: true,
    opacity: 0.10,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  }));
  glow.scale.set(7.9, 5.8, 1);
  glow.renderOrder = 1;
  group.add(glow);

  const glassMaterial = new THREE.MeshBasicMaterial({
    color: 0xffc798,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 4), glassMaterial);
  core.scale.set(1.22, 1.34, 0.76);
  core.rotation.set(0.5, -0.72, 0.22);
  core.renderOrder = 2;
  group.add(core);

  const shell = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.58, 1),
    new THREE.MeshBasicMaterial({
      color: 0xfff2dd,
      transparent: true,
      opacity: 0.06,
      wireframe: true,
      depthWrite: false,
    })
  );
  shell.scale.set(1.02, 1.08, 0.72);
  shell.rotation.set(-0.24, 0.58, -0.18);
  shell.renderOrder = 2;
  group.add(shell);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xd09382,
    transparent: true,
    opacity: 0.08,
    depthWrite: false,
  });

  const rings = [
    new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.018, 16, 140), ringMaterial),
    new THREE.Mesh(new THREE.TorusGeometry(1.28, 0.014, 16, 120), ringMaterial.clone()),
  ];

  rings[0].rotation.set(1.22, 0.1, -0.22);
  rings[1].rotation.set(0.38, 1.26, 0.2);
  rings[1].material.opacity = 0.05;
  rings.forEach(ring => {
    ring.scale.set(1.05, 0.72, 1);
    ring.renderOrder = 2;
    group.add(ring);
  });

  const shardMaterial = new THREE.MeshBasicMaterial({
    color: 0xbedbe5,
    transparent: true,
    opacity: 0.06,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const shards = [
    [-1.18, 0.48, -0.18, 0.28, 0.1],
    [ 1.02, 0.18,  0.08, 0.22, 1.4],
    [-0.34,-0.88,  0.18, 0.18, 2.2],
  ].map(([x, y, z, s, r]) => {
    const shard = new THREE.Mesh(new THREE.TetrahedronGeometry(s, 0), shardMaterial.clone());
    shard.position.set(x, y, z);
    shard.rotation.set(r, r * 0.45, -r * 0.28);
    shard.renderOrder = 2;
    group.add(shard);
    return shard;
  });

  return { group, core, shell, rings, shards, glow };
}

export function initThreeClouds() {
  const heroCanvas = document.getElementById('hero-canvas');
  if (!heroCanvas) return;

  const hero = document.getElementById('hero');
  const getStageSize = () => ({
    width: hero?.clientWidth || heroCanvas.clientWidth || window.innerWidth,
    height: hero?.clientHeight || heroCanvas.clientHeight || window.innerHeight,
  });
  const { width: W, height: H } = getStageSize();

  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: false });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(W, H, false);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(54, W / H, 0.1, 60);
  camera.position.z = 6;
  const atmosphere = createAtmosphere(scene, W, H);
  const cloudscape = createCloudscape(scene);

  // Pre-build 3 texture variants
  const textures = [
    makeCloudTexture(0),
    makeCloudTexture(1),
    makeCloudTexture(2),
  ];
  const mistTextures = [
    makeMistTexture(0),
    makeMistTexture(1),
    makeMistTexture(2),
    makeMistTexture(3),
  ];
  const glowTexture = makeGlowTexture();
  const mistColors = [0xfff5ee, 0xe4e8e6, 0xf7dfd6, 0xffffff];
  const cloudColors = [0xffffff, 0xf3e4dc, 0xd9dfde];

  const mists = MIST_DEFS.map(([x, y, z, sw, sh, op, spd, tv, renderOrder]) => {
    const baseOpacity = op * 0.18;
    const mat = new THREE.SpriteMaterial({
      map: mistTextures[tv],
      color: mistColors[tv],
      transparent: true,
      opacity: baseOpacity,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, y, z);
    sprite.scale.set(sw, sh, 1);
    sprite.renderOrder = renderOrder;
    scene.add(sprite);
    return { sprite, material: mat, baseOpacity, vx: spd, phase: tv * 0.77 };
  });

  const artifact = createMuseumArtifact(scene, glowTexture);

  // Instantiate sprites
  const clouds = CLOUD_DEFS.map(([x, y, z, sw, sh, op, spd, tv]) => {
    const baseOpacity = Math.min(op + 0.12, 0.62) * 0.22;
    const mat = new THREE.SpriteMaterial({
      map: textures[tv],
      color: cloudColors[tv],
      transparent: true,
      opacity: baseOpacity,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, y, z);
    sprite.scale.set(sw, sh, 1);
    sprite.renderOrder = z > -3 ? 4 : 2;
    scene.add(sprite);
    return { sprite, material: mat, baseOpacity, vx: spd, phase: tv * 0.61 };
  });

  const featureClouds = FEATURE_CLOUD_DEFS.map(([x, y, z, sw, sh, op, spd, tv, color, renderOrder], index) => {
    const baseOpacity = op * 0.14;
    const mat = new THREE.SpriteMaterial({
      map: textures[tv],
      color,
      transparent: true,
      opacity: baseOpacity,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, y, z);
    sprite.scale.set(sw, sh, 1);
    sprite.renderOrder = renderOrder;
    scene.add(sprite);
    return { sprite, material: mat, baseOpacity, vx: spd, phase: index * 0.43 + tv * 0.35 };
  });

  const startedAt = performance.now();

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
    const { width: w, height: h } = getStageSize();
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    atmosphere.material.uniforms.uResolution.value.set(w, h);
  });
  ro.observe(hero || heroCanvas);

  // Render loop
  (function tick() {
    requestAnimationFrame(tick);
    const elapsed = (performance.now() - startedAt) / 1000;
    atmosphere.material.uniforms.uTime.value = elapsed;
    cloudscape.material.uniforms.uOpacity.value = 0.99;

    mists.forEach(m => {
      m.sprite.position.x += m.vx;
      if (m.sprite.position.x > 24) m.sprite.position.x -= 46;
      m.sprite.position.y += Math.sin(elapsed * 0.22 + m.phase) * 0.0009;
      m.material.opacity = m.baseOpacity + Math.sin(elapsed * 0.42 + m.phase) * 0.035;
    });

    // Drift each cloud slowly to the right, wrap when offscreen
    clouds.forEach(c => {
      c.sprite.position.x += c.vx;
      if (c.sprite.position.x > 26) c.sprite.position.x -= 48;
      c.material.opacity = c.baseOpacity + Math.sin(elapsed * 0.36 + c.phase) * 0.025;
    });

    featureClouds.forEach(c => {
      c.sprite.position.x += c.vx;
      if (c.sprite.position.x > 24) c.sprite.position.x -= 44;
      c.sprite.position.y += Math.sin(elapsed * 0.17 + c.phase) * 0.0008;
      c.material.opacity = c.baseOpacity + Math.sin(elapsed * 0.28 + c.phase) * 0.04;
    });

    artifact.group.rotation.y = Math.sin(elapsed * 0.18) * 0.08;
    artifact.group.rotation.x = Math.sin(elapsed * 0.14) * 0.04;
    artifact.group.position.y = 1.28 + Math.sin(elapsed * 0.28) * 0.06;
    artifact.core.rotation.y += 0.0015;
    artifact.shell.rotation.y -= 0.001;
    artifact.rings[0].rotation.z += 0.0016;
    artifact.rings[1].rotation.x -= 0.0012;
    artifact.shards.forEach((shard, index) => {
      shard.rotation.x += 0.001 + index * 0.0005;
      shard.rotation.y -= 0.0008 + index * 0.0003;
    });
    artifact.glow.material.opacity = 0.08 + Math.sin(elapsed * 0.5) * 0.02;

    // Smooth camera parallax follows mouse
    cx = lerp(cx, tx, 0.028);
    cy = lerp(cy, ty, 0.028);
    camera.position.x =  cx * 1.4;
    camera.position.y = -cy * 0.6;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  })();
}
