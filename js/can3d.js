/* ============================================================
   pixels. — interactive 3D can
   Drag with the mouse (or arrow keys) to spin. Idles with a slow
   auto-rotation. Renders only while the hero is on screen.
   ============================================================ */
import * as THREE from './vendor/three.module.min.js';

const mount = document.getElementById('can3d');
if (mount) init(mount);

/* ------------------------------------------------------------
   Label artwork, drawn to a canvas and wrapped around the body.
   Texture aspect matches the body's circumference / height so the
   wordmark doesn't stretch.
   ------------------------------------------------------------ */
// A 330ml can is ~66mm across and ~122mm tall: a body ratio near 1.85:1.
const R = 0.68;          // body radius
const BODY_H = 2.5;      // body height
const REPEATS = 3;       // wordmarks around the circumference

function makeLabelTexture() {
  const w = 3072;
  const h = Math.round(w * BODY_H / (2 * Math.PI * R));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');

  // Deep purple rather than the page background, so the can separates
  // from the hero behind it instead of reading as a black cylinder.
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#2B1142');
  bg.addColorStop(0.5, '#200C31');
  bg.addColorStop(1, '#2B1142');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // thin brand stripes near the rims
  const stripe = (y, thickness) => {
    const g = ctx.createLinearGradient(0, 0, w, 0);
    for (let i = 0; i <= REPEATS * 2; i++) {
      g.addColorStop(i / (REPEATS * 2), i % 2 ? '#E0218A' : '#4AA3DF');
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, y, w, thickness);
  };
  stripe(h * 0.10, h * 0.011);
  stripe(h * 0.885, h * 0.011);

  const cell = w / REPEATS;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Fit the wordmark to its cell rather than guessing a size: measure at a
  // reference size, then scale so it fills ~72% of the cell width.
  const REF = 100;
  ctx.font = `800 ${REF}px Sora, system-ui, sans-serif`;
  const refW = ctx.measureText('pixels.').width;
  const fontPx = Math.min(Math.round(REF * (cell * 0.88) / refW), Math.round(h * 0.42));

  for (let i = 0; i < REPEATS; i++) {
    const cx = cell * (i + 0.5);
    const cy = h * 0.46;

    ctx.font = `800 ${fontPx}px Sora, system-ui, sans-serif`;
    const wordW = ctx.measureText('pixels').width;
    const dotW = ctx.measureText('.').width;
    const totalW = wordW + dotW;
    const left = cx - totalW / 2;

    // gradient runs across the wordmark, exactly like the logo
    const g = ctx.createLinearGradient(left, 0, left + wordW, 0);
    g.addColorStop(0, '#4AA3DF');
    g.addColorStop(1, '#E0218A');

    ctx.fillStyle = g;
    ctx.fillText('pixels', left + wordW / 2, cy);

    ctx.fillStyle = '#E0218A';
    ctx.fillText('.', left + wordW + dotW / 2, cy);

    // tagline, clear of the wordmark's descenders — "GRANDES" gets the
    // wordmark's gradient treatment, same as the hero headline.
    const tagPre = 'Creamos ideas que generan ';
    const tagHi = 'GRANDES';
    const tagPost = ' negocios';
    const tagY = cy + fontPx * 0.78;
    let tagPx = Math.round(fontPx * 0.2);

    const fontFor = (px, weight) => `${weight} ${px}px Manrope, system-ui, sans-serif`;
    let preW, hiW, postW, tagTotalW;
    const measure = () => {
      ctx.font = fontFor(tagPx, 700);
      preW = ctx.measureText(tagPre).width;
      postW = ctx.measureText(tagPost).width;
      ctx.font = fontFor(tagPx, 800);
      hiW = ctx.measureText(tagHi).width;
      tagTotalW = preW + hiW + postW;
    };
    measure();
    const maxTagW = cell * 0.92;
    if (tagTotalW > maxTagW) {
      tagPx = Math.round(tagPx * maxTagW / tagTotalW);
      measure();
    }

    ctx.textAlign = 'left';
    let tx = cx - tagTotalW / 2;

    ctx.font = fontFor(tagPx, 700);
    ctx.fillStyle = 'rgba(238,231,247,0.96)';
    ctx.fillText(tagPre, tx, tagY);
    tx += preW;

    ctx.font = fontFor(tagPx, 800);
    const hiGrad = ctx.createLinearGradient(tx, 0, tx + hiW, 0);
    hiGrad.addColorStop(0, '#4AA3DF');
    hiGrad.addColorStop(1, '#E0218A');
    ctx.fillStyle = hiGrad;
    ctx.fillText(tagHi, tx, tagY);
    tx += hiW;

    ctx.font = fontFor(tagPx, 700);
    ctx.fillStyle = 'rgba(238,231,247,0.96)';
    ctx.fillText(tagPost, tx, tagY);

    ctx.textAlign = 'center';
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

/* ------------------------------------------------------------
   A gradient equirect map, so the aluminium has something to
   reflect. Metal with no environment renders black.
   ------------------------------------------------------------ */
function makeEnvTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0.0, '#8FC4E8');
  g.addColorStop(0.45, '#4AA3DF');
  g.addColorStop(0.62, '#2A1140');
  g.addColorStop(1.0, '#E0218A');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 256);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildCan(labelTex) {
  const can = new THREE.Group();

  const metal = new THREE.MeshStandardMaterial({
    color: 0xdfe1ea, metalness: 0.98, roughness: 0.26
  });
  // Keep the label mostly dielectric — high metalness swallows the artwork.
  const label = new THREE.MeshStandardMaterial({
    map: labelTex, metalness: 0.18, roughness: 0.5
  });

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(R, R, BODY_H, 128, 1, true), label
  );
  can.add(body);

  const top = BODY_H / 2;

  // Short, shallow shoulder — a steep taper reads as a cone, not a can.
  const shoulder = new THREE.Mesh(
    new THREE.CylinderGeometry(R * 0.80, R, 0.18, 128, 1, true), metal
  );
  shoulder.position.y = top + 0.09;
  can.add(shoulder);

  const lidRim = new THREE.Mesh(
    new THREE.CylinderGeometry(R * 0.82, R * 0.80, 0.05, 128), metal
  );
  lidRim.position.y = top + 0.205;
  can.add(lidRim);

  const lid = new THREE.Mesh(
    new THREE.CircleGeometry(R * 0.80, 96),
    new THREE.MeshStandardMaterial({ color: 0xc9ccd6, metalness: 0.95, roughness: 0.38 })
  );
  lid.rotation.x = -Math.PI / 2;
  lid.position.y = top + 0.231;
  can.add(lid);

  // pull tab
  const tab = new THREE.Mesh(
    new THREE.TorusGeometry(R * 0.17, R * 0.035, 12, 32),
    new THREE.MeshStandardMaterial({ color: 0xb9bdc7, metalness: 1, roughness: 0.3 })
  );
  tab.rotation.x = -Math.PI / 2;
  tab.position.set(0, top + 0.245, R * 0.17);
  can.add(tab);

  // base taper + disc
  const heel = new THREE.Mesh(
    new THREE.CylinderGeometry(R, R * 0.86, 0.14, 128, 1, true), metal
  );
  heel.position.y = -top - 0.07;
  can.add(heel);

  const base = new THREE.Mesh(new THREE.CircleGeometry(R * 0.86, 96), metal);
  base.rotation.x = Math.PI / 2;
  base.position.y = -top - 0.14;
  can.add(base);

  return can;
}

async function init(mount) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    mount.remove();           // no WebGL: drop the slot, hero still reads fine
    return;
  }

  // Sora has to be resident before the label is rasterized.
  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch (e) { /* draw with fallback */ }
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.1, 6.6);

  const env = makeEnvTexture();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(env).texture;
  env.dispose();
  pmrem.dispose();

  scene.add(new THREE.AmbientLight(0x8a6bb0, 0.55));

  const key = new THREE.DirectionalLight(0x9fd0ef, 2.4);
  key.position.set(-3, 2.5, 4);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xE0218A, 2.2);
  rim.position.set(3.5, 1.2, -2.5);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0xffffff, 0.7);
  fill.position.set(0, -3, 2);
  scene.add(fill);

  const can = buildCan(makeLabelTexture());
  can.rotation.set(0.12, 0.6, 0.06);
  scene.add(can);

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  let lastW = 0, lastH = 0;
  function resize() {
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    if (!w || !h || (w === lastW && h === lastH)) return;
    lastW = w;
    lastH = h;
    renderer.setSize(w, h, false);   // CSS sizes the canvas; see styles.css
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(mount);

  /* ----------------------------------------------------------
     drag to spin, with inertia
     ---------------------------------------------------------- */
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IDLE_SPIN = reduced ? 0 : 0.0035;
  const MAX_TILT = 0.42;

  let targetY = can.rotation.y;
  let targetX = can.rotation.x;
  let velY = 0;
  let dragging = false;
  let lastX = 0, lastY = 0;
  let pointerId = null;

  const el = renderer.domElement;
  el.style.touchAction = 'pan-y';   // let vertical page scroll through
  el.style.cursor = 'grab';

  el.addEventListener('pointerdown', (e) => {
    dragging = true;
    pointerId = e.pointerId;
    lastX = e.clientX;
    lastY = e.clientY;
    velY = 0;
    el.setPointerCapture(pointerId);
    el.style.cursor = 'grabbing';
  });

  el.addEventListener('pointermove', (e) => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    velY = dx * 0.006;
    targetY += velY;
    targetX = Math.max(-MAX_TILT, Math.min(MAX_TILT, targetX + dy * 0.004));
  });

  function endDrag(e) {
    if (!dragging || (e && e.pointerId !== pointerId)) return;
    dragging = false;
    el.style.cursor = 'grab';
    if (pointerId !== null && el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
    pointerId = null;
  }
  el.addEventListener('pointerup', endDrag);
  el.addEventListener('pointercancel', endDrag);

  // keyboard: the can is focusable, so it has to be operable
  mount.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { targetY -= 0.25; e.preventDefault(); }
    if (e.key === 'ArrowRight') { targetY += 0.25; e.preventDefault(); }
    if (e.key === 'ArrowUp')    { targetX = Math.max(-MAX_TILT, targetX - 0.12); e.preventDefault(); }
    if (e.key === 'ArrowDown')  { targetX = Math.min(MAX_TILT, targetX + 0.12); e.preventDefault(); }
  });

  /* ----------------------------------------------------------
     render only while visible
     ---------------------------------------------------------- */
  let visible = true;
  new IntersectionObserver(
    ([entry]) => { visible = entry.isIntersecting; },
    { threshold: 0 }
  ).observe(mount);

  renderer.setAnimationLoop(() => {
    if (!visible) return;

    if (!dragging) {
      targetY += IDLE_SPIN + velY;
      velY *= 0.94;                       // inertia bleeds off
      if (Math.abs(velY) < 1e-4) velY = 0;
      targetX += (0.12 - targetX) * 0.03; // settle back to the resting tilt
    }

    can.rotation.y += (targetY - can.rotation.y) * 0.12;
    can.rotation.x += (targetX - can.rotation.x) * 0.12;

    renderer.render(scene, camera);
  });
}
