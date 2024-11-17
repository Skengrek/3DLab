import * as THREE from "three";
import {OrbitControls} from "jsm/controls/OrbitControls.js"

const width = window.innerWidth
const height = window.innerHeight

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = width/height;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 4;

const scene = new THREE.Scene();

const geo = new THREE.IcosahedronGeometry(1.0, 2);
const mat = new THREE.MeshStandardMaterial({color: 0xffffff, flatShading:true});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);



// Lights
const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x000000, 2)
hemiLight.position.set(0, 5, 0)
scene.add(hemiLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

function animate(t=0){
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera)
}
animate()