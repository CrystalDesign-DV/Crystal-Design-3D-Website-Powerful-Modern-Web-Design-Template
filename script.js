// Loader
window.addEventListener("load", () => {
  const loader = document.querySelector(".page-loader");
  setTimeout(() => loader.classList.add("hidden"), 500);
});

// Theme toggle
const toggleThemeBtn = document.getElementById("toggleTheme");
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("theme-light");
});

// Mobile menu
const menuToggle = document.querySelector(".menu-toggle");
const navMobile = document.querySelector(".nav-mobile");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  const isOpen = menuToggle.classList.contains("active");
  navMobile.style.display = isOpen ? "flex" : "none";
});

// Close mobile nav on link click
navMobile.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navMobile.style.display = "none";
  });
});

// Simple tilt effect
document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltX = ((y - rect.height / 2) / rect.height) * -10;
    const tiltY = ((x - rect.width / 2) / rect.width) * 10;
    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
  });
});

// HERO 3D SCENE
let heroScene, heroCamera, heroRenderer, heroCube, heroFrame = 0;
function initHeroScene() {
  const canvas = document.getElementById("heroScene");
  if (!canvas) return;

  heroScene = new THREE.Scene();
  heroScene.background = new THREE.Color(0x050814);

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  heroCamera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
  heroCamera.position.set(2.4, 1.6, 3.3);

  heroRenderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  heroRenderer.setSize(width, height, false);
  heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  heroScene.add(ambient);

  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(3, 4, 2);
  heroScene.add(dir);

  const planeGeo = new THREE.PlaneGeometry(8, 8, 16, 16);
  const planeMat = new THREE.MeshStandardMaterial({
    color: 0x111629,
    wireframe: false,
  });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.75;
  heroScene.add(plane);

  const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
  const cubeMat = new THREE.MeshStandardMaterial({
    color: 0x7b5cff,
    metalness: 0.4,
    roughness: 0.25,
  });
  heroCube = new THREE.Mesh(cubeGeo, cubeMat);
  heroScene.add(heroCube);

  // Some orbiting small cubes
  const group = new THREE.Group();
  heroScene.add(group);
  for (let i = 0; i < 8; i++) {
    const g = new THREE.BoxGeometry(0.24, 0.24, 0.24);
    const m = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0x00e6a8 : 0xffffff,
      metalness: 0.3,
      roughness: 0.3,
    });
    const c = new THREE.Mesh(g, m);
    const angle = (i / 8) * Math.PI * 2;
    c.position.set(Math.cos(angle) * 1.8, 0.6 + (i % 3) * 0.12, Math.sin(angle) * 1.8);
    group.add(c);
  }

  // OrbitControls (for demo)
  const controls = new THREE.OrbitControls(heroCamera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 5;

  const fpsEl = document.getElementById("heroFps");
  const objEl = document.getElementById("heroObjects");
  if (objEl) objEl.textContent = heroScene.children.length.toString();

  let lastTime = performance.now();
  function animate() {
    requestAnimationFrame(animate);
    heroFrame++;

    const now = performance.now();
    const delta = now - lastTime;
    const fps = Math.round(1000 / Math.max(delta, 1));
    if (fpsEl && heroFrame % 15 === 0) fpsEl.textContent = fps.toString();
    lastTime = now;

    if (heroCube) heroCube.rotation.y += 0.01;
    group.rotation.y -= 0.004;

    controls.update();
    heroRenderer.render(heroScene, heroCamera);
  }
  animate();

  window.addEventListener("resize", () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    heroCamera.aspect = w / h;
    heroCamera.updateProjectionMatrix();
    heroRenderer.setSize(w, h, false);
  });
}

// GALLERY 3D SCENE (simple)
function initGalleryScene() {
  const canvas = document.getElementById("galleryScene");
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050814);

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 50);
  camera.position.set(0, 1.3, 4);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const light = new THREE.HemisphereLight(0xffffff, 0x000010, 1.1);
  scene.add(light);

  const baseGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x111629,
    metalness: 0.2,
    roughness: 0.4,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -0.6;
  scene.add(base);

  const icoGeo = new THREE.IcosahedronGeometry(0.9, 0);
  const icoMat = new THREE.MeshStandardMaterial({
    color: 0x00e6a8,
    wireframe: true,
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  scene.add(ico);

  function animate() {
    requestAnimationFrame(animate);
    ico.rotation.y += 0.006;
    ico.rotation.x += 0.003;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  });
}

// GSAP Scroll animations
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".section").forEach((sec) => {
    gsap.from(sec, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sec,
        start: "top 80%",
      },
    });
  });

  gsap.to(".bg-grid", {
    y: 60,
    ease: "none",
    scrollTrigger: {
      scrub: true,
    },
  });
}

// Init scenes after DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initHeroScene();
  initGalleryScene();
});
