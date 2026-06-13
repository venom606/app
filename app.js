// Basic Three.js viewer: load a GLB model, simple orbit controls, subtle animation.
import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.157.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.157.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('viewer');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 1.2, 2.5);

const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(5, 10, 7);
scene.add(dir);

// ground plane subtle
const ground = new THREE.Mesh(new THREE.PlaneGeometry(10,10), new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.0}));
ground.rotation.x = -Math.PI/2;
scene.add(ground);

// load model (replace with your .glb)
const loader = new GLTFLoader();
let model;
loader.load('models/dress.glb', (g) => {
  model = g.scene;
  scene.add(model);
  model.position.y = 0;
  model.traverse((c)=>{ if (c.isMesh) c.castShadow = true; });
}, undefined, (err)=> console.error(err));

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI/2.2;
controls.enablePan = false;

// animate loop
function animate(t){
  requestAnimationFrame(animate);
  if(model) model.rotation.y = Math.sin(t/3000) * 0.2;
  controls.update();
  renderer.render(scene, camera);
}
animate();
