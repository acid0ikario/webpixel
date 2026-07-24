/* ============================================================
   pixels. — interactive 3D can
   Drag with the mouse (or arrow keys) to spin. Idles with a slow
   auto-rotation. Renders only while the hero is on screen.
   ============================================================ */
import * as THREE from './vendor/three.module.min.js';

const mount = document.getElementById('can3d');
if (mount) init(mount);

/* ------------------------------------------------------------
   Label artwork: the real product label, un-projected from the
   studio renders into one flat 360° strip (see assets/can/). Its
   aspect (~1.08:1, w/h) sets the body proportions below so the
   artwork wraps without stretching.
   ------------------------------------------------------------ */
// Sleek 473ml proportions: a tall, slim body so the flat label wraps true.
const R = 0.66;          // body radius
const BODY_H = 3.6;      // body height
// Slide the strip so the `pixels.` panel faces the camera at rest.
const LABEL_OFFSET = 0.173;

function loadLabelTexture() {
  const url = new URL('../assets/can/label.png', import.meta.url).href;
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        tex.wrapS = THREE.RepeatWrapping;      // seam is the dark panel-fold
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.offset.x = LABEL_OFFSET;
        resolve(tex);
      },
      undefined,
      () => resolve(null)                       // missing art: plain body below
    );
  });
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
  // The label art already carries its own highlights and droplets, so keep the
  // surface mostly matte/dielectric — reflections on top would fight the print.
  const label = labelTex
    ? new THREE.MeshStandardMaterial({ map: labelTex, metalness: 0.12, roughness: 0.58 })
    : new THREE.MeshStandardMaterial({ color: 0x2B1142, metalness: 0.12, roughness: 0.58 });

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

  const labelTex = await loadLabelTexture();

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

  const can = buildCan(labelTex);
  can.scale.setScalar(0.82);          // the sleek body is tall; fit it to the frame
  can.rotation.set(0.10, 0.0, 0.04);
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
