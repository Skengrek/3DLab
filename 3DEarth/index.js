import * as THREE from "three";
import {OrbitControls} from "jsm/controls/OrbitControls.js"

const width = window.innerWidth
const height = window.innerHeight

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(width, height);
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.outputColorSpace = THREE.SRGBColorSpace
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = width/height;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 4;

const scene = new THREE.Scene();

const earthGroup = new THREE.Group()
scene.add(earthGroup)
const loader = new THREE.TextureLoader()
const geo = new THREE.IcosahedronGeometry(1.0, 12);
const mat = new THREE.MeshStandardMaterial({
    map: loader.load("./assets/img/earthmap1k.jpg"),
    bumpMap: loader.load("./assets/img/earthbump1k.jpg")
});
const earth = new THREE.Mesh(geo, mat);
earthGroup.add(earth);

const lightsMat = new THREE.MeshStandardMaterial({
    lightMap: loader.load("./assets/img/earthlights1k.jpg"),
    blending: THREE.AdditiveBlending
})
const lightsMesh = new THREE.Mesh(geo, lightsMat)
earthGroup.add(lightsMesh)

// const cloudGeo = new THREE.IcosahedronGeometry(1.01, 12);
const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load("./assets/img/earthcloudmaptrans.jpg"),
    transparent:true,
    opacity:0.8,
    blending: THREE.AdditiveBlending
})
const cloudMesh = new THREE.Mesh(geo, cloudsMat)
cloudMesh.scale.setScalar(1.003)
earthGroup.add(cloudMesh)  

const geoSat = new THREE.IcosahedronGeometry(0.2, 2);
const matSat = new THREE.MeshStandardMaterial({color: 0xff00ff, flatShading:true});
const meshSat = new THREE.Mesh(geoSat, matSat);
meshSat.position.set(0, 1, 0)
earth.add(meshSat)

const sunLight = new THREE.DirectionalLight(0xffffff, 0.2);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);


const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.07)
scene.add(hemiLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

function animate(t=0){
    requestAnimationFrame(animate);
    earthGroup.rotation.y = t*0.0005
    cloudMesh.rotation.y += 0.0023
    
    meshSat.position.x = 1*Math.cos(t*0.1*Math.PI/180)+1*Math.sin(t*0.1*Math.PI/180)
    meshSat.position.y = -1*Math.sin(t*0.1*Math.PI/180)+1*Math.cos(t*0.1*Math.PI/180)
    controls.update()
    renderer.render(scene, camera)
}
animate()