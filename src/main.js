import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import "./style.css";

/* ------------------------------------------------------------------ */
/* ESCENA, CÁMARA, RENDERIZADOR                                        */
/* ------------------------------------------------------------------ */
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x010810, 0.045);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.5, 11);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById("app").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 3.5;
controls.maxDistance = 24;
controls.target.set(0, 1, 0);

const clock = new THREE.Clock();

/* ------------------------------------------------------------------ */
/* LUCES — ambiente abisal con destellos bioluminiscentes              */
/* ------------------------------------------------------------------ */
scene.add(new THREE.AmbientLight(0x0a1a2a, 1.2));

const eyeGlow = new THREE.PointLight(0x35e0e8, 8, 18, 2);
eyeGlow.position.set(0, 1.4, 0.3);
scene.add(eyeGlow);

const coralGlow = new THREE.PointLight(0xb43ce8, 3, 10, 2);
coralGlow.position.set(-3, 0.5, -1);
scene.add(coralGlow);

/* ------------------------------------------------------------------ */
/* LECHO MARINO — piso rocoso con relieve                              */
/* ------------------------------------------------------------------ */
const seabedGeo = new THREE.PlaneGeometry(40, 40, 60, 60);
const seabedPos = seabedGeo.attributes.position;
for (let i = 0; i < seabedPos.count; i++) {
  const x = seabedPos.getX(i);
  const y = seabedPos.getY(i);
  const bump =
    Math.sin(x * 0.6) * Math.cos(y * 0.5) * 0.35 +
    (Math.random() - 0.5) * 0.15;
  seabedPos.setZ(i, bump);
}
seabedGeo.computeVertexNormals();
const seabed = new THREE.Mesh(
  seabedGeo,
  new THREE.MeshStandardMaterial({
    color: 0x081418,
    roughness: 0.95,
    metalness: 0.05,
  })
);
seabed.rotation.x = -Math.PI / 2;
seabed.position.y = -1.6;
scene.add(seabed);

/* ------------------------------------------------------------------ */
/* CORALES BIOLUMINISCENTES — 2 formaciones rotando                    */
/* ------------------------------------------------------------------ */
const corales = [];
const coralConfig = [
  { pos: [-3.2, -0.6, -1], color: 0xff2fd0, scale: 0.6 },
  { pos: [3.4, -0.9, -1.6], color: 0x35e0e8, scale: 0.45 },
  { pos: [2.4, -1.1, 1.8], color: 0x7bff5a, scale: 0.35 },
];
coralConfig.forEach(({ pos, color, scale }) => {
  const geo = new THREE.TorusKnotGeometry(0.6, 0.2, 100, 16);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0a0a12,
    emissive: color,
    emissiveIntensity: 1.4,
    roughness: 0.5,
  });
  const coral = new THREE.Mesh(geo, mat);
  coral.position.set(...pos);
  coral.scale.setScalar(scale);
  scene.add(coral);
  corales.push(coral);
});

/* ------------------------------------------------------------------ */
/* ANÉMONAS — grupo de tentáculos que ondulan                          */
/* ------------------------------------------------------------------ */
const anemonaGroup = new THREE.Group();
anemonaGroup.position.set(-1.6, -1.4, 2.2);
const tentaculoMat = new THREE.MeshStandardMaterial({
  color: 0x140a1e,
  emissive: 0xff5fe0,
  emissiveIntensity: 0.9,
  roughness: 0.6,
});
const tentaculos = [];
const TENTACULO_COUNT = 9;
for (let i = 0; i < TENTACULO_COUNT; i++) {
  const geo = new THREE.ConeGeometry(0.06, 1.1, 6);
  const tentaculo = new THREE.Mesh(geo, tentaculoMat);
  const angle = (i / TENTACULO_COUNT) * Math.PI * 2;
  tentaculo.position.set(Math.cos(angle) * 0.25, 0.5, Math.sin(angle) * 0.25);
  tentaculo.geometry.translate(0, 0.55, 0);
  anemonaGroup.add(tentaculo);
  tentaculos.push({ mesh: tentaculo, offset: i * 0.6 });
}
scene.add(anemonaGroup);

/* ------------------------------------------------------------------ */
/* PARTÍCULAS — plancton / burbujas bioluminiscentes ascendiendo       */
/* ------------------------------------------------------------------ */
const PARTICLE_COUNT = 500;
const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particlePositions[i * 3] = (Math.random() - 0.5) * 20;
  particlePositions[i * 3 + 1] = Math.random() * 10 - 2;
  particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute(
  "position",
  new THREE.BufferAttribute(particlePositions, 3)
);
const particleMat = new THREE.PointsMaterial({
  color: 0x5ff2ff,
  size: 0.045,
  transparent: true,
  opacity: 0.8,
  depthWrite: false,
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

/* ------------------------------------------------------------------ */
/* FASE 2 — OJO ABISAL: textura de video sobre geometría circular       */
/* ------------------------------------------------------------------ */
const video = document.createElement("video");
video.src = "/assets/video.mp4";
video.loop = true;
video.muted = true; // el audio del clip no se usa: el sonido espacial viene de audio.mp3
video.playsInline = true;
video.crossOrigin = "anonymous";
video.classList.add("video-fullscreen"); // overlay 2D que cubre la ventana al reproducir
document.body.appendChild(video);

const videoTexture = new THREE.VideoTexture(video);
videoTexture.colorSpace = THREE.SRGBColorSpace;

const ojoGeo = new THREE.CircleGeometry(4.2, 48);
const ojoMat = new THREE.MeshBasicMaterial({
  map: videoTexture,
  side: THREE.DoubleSide,
  toneMapped: false,
});
const ojoMesh = new THREE.Mesh(ojoGeo, ojoMat);
ojoMesh.position.set(0, 1.4, 0);
scene.add(ojoMesh);

// Anillo emisivo que enmarca el "ojo" y refuerza la ambientación
const anilloMesh = new THREE.Mesh(
  new THREE.TorusGeometry(4.32, 0.1, 16, 64),
  new THREE.MeshStandardMaterial({
    color: 0x061018,
    emissive: 0x35e0e8,
    emissiveIntensity: 2,
  })
);
anilloMesh.position.copy(ojoMesh.position);
scene.add(anilloMesh);

/* ------------------------------------------------------------------ */
/* MODO CINE — la cámara se acerca al reproducir para que el video      */
/* llene la pantalla, y se aleja al pausar mostrando el entorno 3D      */
/* ------------------------------------------------------------------ */
const wideCamPos = camera.position.clone();
const wideTarget = controls.target.clone();
const closeCamPos = new THREE.Vector3(0, ojoMesh.position.y, controls.minDistance);
const closeTarget = new THREE.Vector3(0, ojoMesh.position.y, 0);

const TRANSITION_DURATION = 1.4;
let transition = null;

function goToShot(toPos, toTarget) {
  transition = {
    fromPos: camera.position.clone(),
    fromTarget: controls.target.clone(),
    toPos,
    toTarget,
    start: clock.getElapsedTime(),
  };
}

/* ------------------------------------------------------------------ */
/* FASE 3 — AUDIO ESPACIAL POSICIONAL                                   */
/* ------------------------------------------------------------------ */
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.PositionalAudio(listener);
sound.setRefDistance(1.2);
sound.setMaxDistance(14);
sound.setRolloffFactor(2);
sound.setLoop(true);
sound.setVolume(0.9);

const audioLoader = new THREE.AudioLoader();
audioLoader.load(
  "/assets/audio.mp3",
  (buffer) => sound.setBuffer(buffer),
  undefined,
  (err) =>
    console.warn(
      "No se pudo cargar /assets/audio.mp3 — coloca tu archivo de audio ahí.",
      err
    )
);
ojoMesh.add(sound);

/* ------------------------------------------------------------------ */
/* INTERACCIÓN DE USUARIO — botón + tecla Espacio                       */
/* ------------------------------------------------------------------ */
const toggleBtn = document.getElementById("toggleBtn");
let playing = false;

async function togglePlayback() {
  if (listener.context.state === "suspended") {
    await listener.context.resume();
  }

  if (!playing) {
    video.play().catch((e) => console.warn("No se pudo reproducir el video:", e));
    if (sound.buffer && !sound.isPlaying) sound.play();
    toggleBtn.textContent = "⏸ Pausar y ver escena 3D";
    video.classList.add("active");
    goToShot(closeCamPos, closeTarget);
  } else {
    video.pause();
    if (sound.isPlaying) sound.pause();
    toggleBtn.textContent = "▶ Iniciar transmisión";
    video.classList.remove("active");
    goToShot(wideCamPos, wideTarget);
  }
  playing = !playing;
}

toggleBtn.addEventListener("click", togglePlayback);
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePlayback();
  }
});

/* ------------------------------------------------------------------ */
/* FASE 1 — BUCLE DE ANIMACIÓN (60 FPS vía requestAnimationFrame)       */
/* ------------------------------------------------------------------ */
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Ojo Abisal: flota y rota suavemente
  ojoMesh.position.y = 1.4 + Math.sin(t * 0.6) * 0.08;
  ojoMesh.rotation.z = Math.sin(t * 0.3) * 0.05;
  anilloMesh.position.y = ojoMesh.position.y;
  anilloMesh.rotation.z += 0.002;
  eyeGlow.intensity = 5 + Math.sin(t * 3) * 1.5;

  // Corales: rotación continua propia de cada formación
  corales.forEach((coral, i) => {
    coral.rotation.x += 0.003 + i * 0.001;
    coral.rotation.y += 0.005;
  });

  // Anémonas: ondulación tipo tentáculo
  tentaculos.forEach(({ mesh, offset }) => {
    mesh.rotation.x = Math.sin(t * 1.5 + offset) * 0.25;
    mesh.rotation.z = Math.cos(t * 1.2 + offset) * 0.25;
  });

  // Partículas: ascienden y reciclan al llegar arriba
  const pos = particleGeo.attributes.position;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    let y = pos.getY(i) + 0.012;
    if (y > 8) y = -2;
    pos.setY(i, y);
  }
  pos.needsUpdate = true;

  // Transición cinematográfica entre la vista general y el primer plano del video
  if (transition) {
    const p = Math.min((t - transition.start) / TRANSITION_DURATION, 1);
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    camera.position.lerpVectors(transition.fromPos, transition.toPos, ease);
    controls.target.lerpVectors(transition.fromTarget, transition.toTarget, ease);
    if (p >= 1) transition = null;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

/* ------------------------------------------------------------------ */
/* RESIZE                                                              */
/* ------------------------------------------------------------------ */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
