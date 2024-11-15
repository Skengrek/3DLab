import * as THREE from "three";
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.11.2';

const width = window.innerWidth;
const height = window.innerHeight;
let mousePos = new THREE.Vector2();
const sceneMiddle = new THREE.Vector3(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = width/height;
const near = 0.1;
const far = 25;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 10;

await RAPIER.init()
let gravity = {x: 0, y:0, z:0}
const world = new RAPIER.World(gravity)

const scene = new THREE.Scene();

const geo = new THREE.IcosahedronGeometry(0.5, 2);
const mat = new THREE.MeshStandardMaterial({color: 0xffffff, flatShading:true});
const nbBalls = 20;
const bodies = [];
const range = 3
for (let i = 0; i<nbBalls; i++){
    let mesh = new THREE.Mesh(geo, mat)
    bodies.push(mesh);
    bodies[i].position.x = (Math.random() * 2 * range) - range;
    bodies[i].position.y = (Math.random() * 2 * range) - range;
    bodies[i].position.z = (Math.random() * 2 * range) - range;

    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(
            bodies[i].position.x,
            bodies[i].position.y,
            bodies[i].position.z
        );
    let rigid = world.createRigidBody(rigidBodyDesc);
    let colliderDesc = RAPIER.ColliderDesc.ball(0.5).setDensity(1);
    world.createCollider(colliderDesc, rigid);
    bodies[i].update = () => {
        rigid.resetForces(true); 
        let { x, y, z } = rigid.translation();
        let pos = new THREE.Vector3(x, y, z);
        let dir = pos.clone().sub(sceneMiddle).normalize();
        rigid.addForce(dir.multiplyScalar(-0.5), true);
        mesh.position.set(x, y, z);
    }
    
    scene.add(bodies[i])
}

const cursorMat = new THREE.MeshStandardMaterial({color: 0xff00ff, flatShading:true})
const cursorBall = new THREE.Mesh(geo, cursorMat)
scene.add(cursorBall)
// RIGID BODY
let bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 0, 0)
let mouseRigid = world.createRigidBody(bodyDesc);
let dynamicCollider = RAPIER.ColliderDesc.ball(0.2 * 3.0);
world.createCollider(dynamicCollider, mouseRigid);

// Lights
const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x000000, 2)
hemiLight.position.set(0, 5, 0)
scene.add(hemiLight);

function updateMouseBall(mousePos){
    mouseRigid.setTranslation({ x: mousePos.x * 5, y: mousePos.y * 5, z: 0.2 });
    let { x, y, z } = mouseRigid.translation();
    cursorBall.position.set(x,y,z);
}

function animate(t=0){
    requestAnimationFrame(animate);
    updateMouseBall(mousePos)
    for (let i = 0; i<nbBalls;i++){bodies[i].update()}
    world.step()
    renderer.render(scene, camera)
}
animate()

function handleMouseMove (evt) {
    mousePos.x = (evt.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = -(evt.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', handleMouseMove, false);