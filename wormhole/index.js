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

const wireMat = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe:true})
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.01)
mesh.add(wireMesh)

const geoSat = new THREE.IcosahedronGeometry(0.2, 2);
const matSat = new THREE.MeshStandardMaterial({color: 0xff00ff, flatShading:true});
const meshSat = new THREE.Mesh(geoSat, matSat);
meshSat.position.set(0, 1, 0)
mesh.add(meshSat)
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
    
    meshSat.position.x = 1*Math.cos(t*0.1*Math.PI/180)+1*Math.sin(t*0.1*Math.PI/180)
    meshSat.position.y = -1*Math.sin(t*0.1*Math.PI/180)+1*Math.cos(t*0.1*Math.PI/180)
    controls.update()
    renderer.render(scene, camera)
}
animate()