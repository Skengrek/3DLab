import * as THREE from "three";
import spline from './spline.js'

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
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 4;

const scene = new THREE.Scene();

const geometry = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
const material = new THREE.MeshStandardMaterial({
    color:0xFF0000,
    side: THREE.DoubleSide,
    wireframe: true,
});
const line = new THREE.Mesh(geometry, material);
scene.add(line);

function updateCamera(t) {
    const time = t * 0.2;
    const looptime = 10 * 1000;
    const p = (time % looptime) / looptime;
    const pos = geometry.parameters.path.getPointAt(p);
    const lookAt = geometry.parameters.path.getPointAt((p + 0.03) % 1);
    camera.position.copy(pos);
    console.log(pos, lookAt)
    camera.lookAt(lookAt);
}



// Lights
const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x000000, 2);
hemiLight.position.set(0, 5, 0);
scene.add(hemiLight);

function animate(t=0){
    requestAnimationFrame(animate);
    updateCamera(t);
    // controls.update();
    renderer.render(scene, camera);
}
animate();