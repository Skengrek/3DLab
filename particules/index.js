import * as THREE from "three";
import {OrbitControls} from "jsm/controls/OrbitControls.js"

const width = window.innerWidth
const height = window.innerHeight
const loader = new THREE.TextureLoader()

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
const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.02,
});
const mesh = new THREE.Points(geo, mat);
scene.add(mesh);

const nbParticule = 50000;
const particuleGeom = new THREE.BufferGeometry;

const posArray = new Float32Array(nbParticule*3);

for (let i=0; i<nbParticule*3; i++){
    posArray[i] = (Math.random()-0.5) * (Math.random()*10);
}
particuleGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const starImg = loader.load('./assets/redStar.png')
const pointsMat = new THREE.PointsMaterial({
    size: 0.05,
    map: starImg,
    transparent: true,
})

const particuleMesh = new THREE.Points(particuleGeom, pointsMat);
scene.add(particuleMesh)
// Lights
const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x000000, 2)
hemiLight.position.set(0, 5, 0)
scene.add(hemiLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

function animate(t=0){
    requestAnimationFrame(animate);
    mesh.rotation.y = t*0.0005
    particuleMesh.rotation.y = t*0.00005
    controls.update()
    renderer.render(scene, camera)
}
animate()