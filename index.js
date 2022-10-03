import * as THREE from './node_modules/three/src/Three.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

scene.background = new THREE.Color( 0xd3d3d3 );

const objects = []; // list of all loaded objects in the scene
const loadedObjs = [];  // booleans checking if those objects are loaded

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x444400 } );
const cube = new THREE.Mesh( geometry, material );

const gltfLoader = new GLTFLoader();

loadSpheres();

var rot = {
    'x': 0,
    'y': 0,
    'z': 0
}

var model;
var mesh;
var dot;

const btn1 = document.getElementById("switchModel");
btn1.addEventListener("click", function () { loadModel(0) });

const btn2 = document.getElementById("switchModel2");
btn2.addEventListener("click", function () { loadModel(1) });

const btn3 = document.getElementById("switchModel3");
btn3.addEventListener("click", function () { loadModel(2) });

const editText = document.get

// fix so that key presses work on last selected, and objects are toggleable
function loadModel(n){
    var url;
    if(n === 0 && !loadedObjs[0]) {
        url = '/Skull test 1.glb';
        loadedObjs[0] = !loadedObjs[0];
    } 
    if(n === 1 && !loadedObjs[1]) {
        url = '/Skull test 2.glb';
        loadedObjs[1] = !loadedObjs[1];
    }
    if(n === 2 && !loadedObjs[2]) {
        url = '/Skull test 3.glb';
        loadedObjs[2] = !loadedObjs[2];
    }

    if(!url){
        return; // in case the object we want to spawn is invalid for some reason
    }
    // may need to have array of objects later
    gltfLoader.load(url, (gltf) => {
        model = gltf.scene;
        model.side = THREE.MeshLambertMaterial;
        mesh = model.material;
        scene.add(model);
        objects.push(model);
        const dragControls = new DragControls([model], camera, renderer.domElement);
    })
}

function loadSpheres(){
    dot = new THREE.Mesh( new THREE.SphereGeometry(), new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    dot.position.x = 0;
    dot.position.y = 0;
    dot.position.z = 0;

    dot.scale.x = 0.05;
    dot.scale.y = 0.05;
    dot.scale.z = 0.05;

    scene.add( dot );
}

// add lock-in functionality

const directionalLight = new THREE.DirectionalLight( 0x404040, 10 ); // 0xFAEBD7, 20
scene.add( directionalLight );

camera.position.z = 5;

// maybe try to use right click to drag later?
function keyPressed(e){
    
	switch(e.key) {
        case 'Enter':
            if(scene.autoRotate){
                scene.autoRotate = false;
                //load last rotation so that we can return to it
                scene.rotation.x = rot.x;
                scene.rotation.y = rot.y;
                scene.rotation.z = rot.z;
            } else {
                scene.autoRotate = true;
                //save rotation so that when its stopped it goes back to old coordinates
                rot = {
                    'x': scene.rotation.x,
                    'y': scene.rotation.y,
                    'z': scene.rotation.z
                }
            }
        case 'ArrowUp':
            model.rotateX(-0.1);
            break;
        case 'ArrowDown':
            model.rotateX(0.1);
            break;
        case 'ArrowLeft':
            model.rotateY(-0.1);
            break;
        case 'ArrowRight':
            model.rotateY(0.1);
            break;
        case ' ':
            console.log("cube time");
            const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

            object.position.x = 0;
            object.position.y = 0;
            object.position.z = 0;

            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;

            object.scale.x = Math.random() + 0.5;
            object.scale.y = Math.random() + 0.5;
            object.scale.z = Math.random() + 0.5;

            scene.add( object );
            break;
	}
	e.preventDefault();
}

document.body.addEventListener('keydown', keyPressed);
document.body.addEventListener('click', onDocumentMouseDown);

// get the last clicked element
function onDocumentMouseDown( event ) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    console.log(scene.children[1].children);
    console.log("intersects: " + intersects);
    if (intersects.length > 0) {
        console.log('clicked :o');
        let n = new THREE.Vector3();
        n.copy(intersects[0].face.normal);
        n.transformDirection(intersects[0].object.matrixWorld);
        model = intersects[0].object;
    }

    //check for locking in
    if (checkLocationRange(model, dot, 1)){
        model.position.x = dot.position.x;
        model.position.y = dot.position.y;
        model.position.z = dot.position.z;
        console.log("fired");
    }
}

function checkLocationRange( obj1, obj2, range ){
    if(obj1.position.x > obj2.position.x - range && obj1.position.x < obj2.position.x + range){
        if(obj1.position.y > obj2.position.y - range && obj1.position.y < obj2.position.y + range){
            if(obj1.position.z > obj2.position.z - range && obj1.position.z < obj2.position.z + range){
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

const animate = function () {
    requestAnimationFrame( animate );

    if(scene.autoRotate){
        scene.rotation.x += 0.01;
        scene.rotation.y += 0.01;
        scene.rotation.z += 0.01;
    }

    renderer.render( scene, camera );
};

animate();


