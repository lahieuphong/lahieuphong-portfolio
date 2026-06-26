/* ═══════════════════════════════════════════════════════════
   SVG LOADER — Fetch external SVG files and inject inline.
   Inline SVGs inherit CSS `color` via `currentColor`.

   Usage in HTML:
     <span data-svg-src="assets/svg/icon.svg"></span>

   The SVG content is injected inside the element.
   All classes/styles on the wrapper element are preserved.
═══════════════════════════════════════════════════════════ */

const svgCache = new Map();
const svgModules = import.meta.glob('../assets/svg/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const svgRegistry = new Map(
  Object.entries(svgModules).map(([path, raw]) => {
    const fileName = path.split('/').pop();
    return [`assets/svg/${fileName}`, raw];
  })
);

export async function fetchSVG(src) {
  if (svgCache.has(src)) return svgCache.get(src);

  let text = svgRegistry.get(src);
  if (!text) {
    const res = await fetch(src);
    text = await res.text();
  }
  const doc  = new DOMParser().parseFromString(text, 'image/svg+xml');
  const svg  = doc.querySelector('svg');

  svgCache.set(src, svg);
  return svg;
}

export async function injectSVGs(root = document) {
  const targets = [...root.querySelectorAll('[data-svg-src]')];
  if (!targets.length) return;

  await Promise.all(targets.map(async el => {
    const src = el.dataset.svgSrc;
    try {
      const svg = (await fetchSVG(src)).cloneNode(true);
      el.appendChild(svg);
      el.removeAttribute('data-svg-src');
    } catch (err) {
      console.warn(`[svg-loader] Failed to load: ${src}`, err);
    }
  }));
}
