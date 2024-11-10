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
scene.fog = new THREE.FogExp2(0x000000, 0.3)
const geometry = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
const material = new THREE.MeshBasicMaterial({
    color:0xFF0000,
    side: THREE.DoubleSide,
    wireframe: true,
});
const tube = new THREE.Mesh(geometry, material);
// scene.add(tube);

const edges = new THREE.EdgesGeometry(geometry, 0.2);
const edgesMat = new THREE.LineBasicMaterial({color: 0x00FF00});
const tubeLine = new THREE.LineSegments(edges, edgesMat)
scene.add(tubeLine);

const numBoxes = 100;
const size = 0.075;
const boxGeo = new THREE.BoxGeometry(size, size, size);
for (let i = 0; i < numBoxes; i += 1) {
  const boxMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
  });
  const box = new THREE.Mesh(boxGeo, boxMat);
  const p = (i / numBoxes + Math.random() * 0.1) % 1;
  const pos = geometry.parameters.path.getPointAt(p);
  pos.x += Math.random() - 0.4;
  pos.z += Math.random() - 0.4;
  box.position.copy(pos);
  const rote = new THREE.Vector3(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  box.rotation.set(rote.x, rote.y, rote.z);
  const edges = new THREE.EdgesGeometry(boxGeo, 0.2);
  const color = new THREE.Color().setHSL(0.7 - p, 1, 0.5);
  const lineMat = new THREE.LineBasicMaterial({ color });
  const boxLines = new THREE.LineSegments(edges, lineMat);
  boxLines.position.copy(pos);
  boxLines.rotation.set(rote.x, rote.y, rote.z);
  scene.add(boxLines);
}


function updateCamera(t) {
    const time = t * 0.15;
    const looptime = 10 * 1000;
    const p = (time % looptime) / looptime;
    const pos = geometry.parameters.path.getPointAt(p);
    const lookAt = geometry.parameters.path.getPointAt((p + 0.03) % 1);
    camera.position.copy(pos);
    console.log(pos, lookAt)
    camera.lookAt(lookAt);
}

function animate(t=0){
    requestAnimationFrame(animate);
    updateCamera(t);
    // controls.update();
    renderer.render(scene, camera);
}
animate();