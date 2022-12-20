
import * as THREE from '/scripts/node_modules/three';
import { OrbitControls } from '/scripts/node_modules/three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from '/scripts/node_modules/three/examples/jsm/loaders/GLTFLoader';
import { DragControls } from '/scripts/node_modules/three/examples/jsm/controls/DragControls'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight - 72 ); // 72 being the height of the top bar
document.body.appendChild( renderer.domElement );

scene.background = new THREE.Color( 0xd3d3d3 );

var pairList = []; 
var objects = []; // list of all loaded objects in the scene
var lmlem = []; // list of li elements for the sidebar

const gltfLoader = new GLTFLoader();
const jsonLoader = new THREE.ObjectLoader();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.mouseButtons = {
    // LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
}
controls.enablePan = false;

loadSpheres();

var rot = {
    'x': 0,
    'y': 0,
    'z': 0
}

var dot;

let isTyping = false;

const sideb = document.getElementById("sideboi");
const mainpage = document.getElementById("main");

const openButton = document.getElementById("openBtn");
openButton.addEventListener("click", function() {
    sideb.style.width = "250px";
    mainpage.style.marginLeft = "250px";
    isTyping = true;
});

const closeButton = document.getElementById("closeBtn");
closeButton.addEventListener("click", function() {
    sideb.style.width = "0";
    mainpage.style.marginLeft = "0";
    isTyping = false;
});

const backButton = document.getElementById("backBtn");
backButton.addEventListener("click", function () {
    // clear lists and remove last model
    if(model != null){
        scene.children.forEach((part, i) => {
            if(i > 1){
                scene.remove(part);
                console.log("removed");
            }
            console.log("iterate");
        });
        document.getElementById("elements").innerHTML = "";
        objects.length = 0;
        lmlem.length = 0;
        pairList.length = 0;
    }
    window.location.href = "index.html";
});

var editText = document.getElementById("nameID");

var model;

// since we passed in parameter for model name, now we extract the name and load it
// im using an array just in case we want to add more parameters later
var queryString = new Array();

window.onload = function (){
    if (queryString.length == 0){
        if (window.location.search.split('?').length > 1) {
            var params = window.location.search.split('?')[1].split('&');
            for (var i = 0; i < params.length; i++) {
                var key = params[i].split('=')[0];
                var value = decodeURIComponent(params[i].split('=')[1]);
                queryString[key] = value;
            }
        }
    }
    // check if we have a valid file extension passed, and print it
    if(queryString["id"] != null){
        const idURL = queryString["id"];
        // obtain file from database

        // in the database: model, name of model, author, potentially png?

        // make GET request to local server
        // it says axios is not defined but it is defined in our html file
        axios({
            method: 'get',
            url: 'http://localhost:8000/testdata',
        })
        .then(function (response) {
            // handle success
            console.log(response.data[idURL].filecall);
            const newURL = "/" + response.data[idURL].filecall;
            
            gltfLoader.load(newURL, (gltf) => {
                model = gltf.scene;
                scene.add(model);
                finalizeLoad(model);
            });
        })
        .catch(function (error) {
            // handle error
            console.log("There was an error from Axios: \n" + error);
        })
        .then(function () {
            // always executed
        })
    }
    else{
        const fileObtained = sessionStorage.getItem("json");
        if(fileObtained) {
            console.log(fileObtained);
            const bytes = new TextEncoder().encode(fileObtained);
            const blob = new Blob([bytes], { type: "application/json" });
            const newURL = URL.createObjectURL(blob);
            console.log(newURL);
            loadModel(newURL);
        }
    }
    
}

function loadModel(filepath){
    jsonLoader.load(filepath, (jsonModel) => {
        model = jsonModel;
        scene.add(model);
        finalizeLoad(model);
    });  
}

function finalizeLoad(model){
    // update object lists
    console.log(model.children.length);
    for(var i = 0; i < model.children.length; i++){
        objects.push(model.children[i]);
        const objPair = new Object();
        objPair.model = model.children[i];
        objPair.name = "Object " + (pairList.length + 1); 
        pairList.push(objPair);
    }
    const dragControls = new DragControls([model], camera, renderer.domElement);

    // fill the sidebar with names of each object
    let listElements = document.getElementById("elements");
    pairList.forEach((item) => {
        let li = document.createElement("li");
        li.setAttribute("contenteditable", true);
        li.innerText = item.name;
        li.addEventListener("click", function () { isTyping = true; });
        listElements.appendChild(li);
        lmlem.push(li);
        li.addEventListener("input", function () { 
            pairList[findIndex(lmlem, li)].name = li.innerText; 
        })
    });
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

const color = 0xEBDCC7;
const castColor = 0xEBDCC7;

const directionalLight = new THREE.DirectionalLight( color, 3 ); // 0xFAEBD7, 0x404040 20

var light2 = directionalLight.clone();
directionalLight.castShadow = true;
light2.castShadow = false;
directionalLight.intensity = 3;
light2.intensity = 0.5;

scene.add( directionalLight );

const bottomLight = new THREE.DirectionalLight( color, 1 );
bottomLight.position.set(0, -10, 0);
scene.add(bottomLight);

const leftLight = new THREE.DirectionalLight( castColor, 1 );
leftLight.position.set(-10, 0, 0);
scene.add(leftLight);

const rightLight = new THREE.DirectionalLight( castColor, 1 );
rightLight.position.set(10, 0, 0);
scene.add(rightLight);

const frontLight = new THREE.DirectionalLight( color, 1 );
frontLight.position.set(0, 0, 10);
scene.add(frontLight);

camera.position.z = 5;

function keyPressed(e){
    console.log("xd");
    if(!isTyping){
        switch(e.key) {
            case 'Enter':
                if(scene.autoRotate){
                    controls.enabled = true;
                    scene.autoRotate = false;
                    //load last rotation so that we can return to it
                    scene.rotation.x = rot.x;
                    scene.rotation.y = rot.y;
                    scene.rotation.z = rot.z;
                } else {
                    scene.autoRotate = true;
                    controls.enabled = false;
                    //save rotation so that when its stopped it goes back to old coordinates
                    rot = {
                        'x': scene.rotation.x,
                        'y': scene.rotation.y,
                        'z': scene.rotation.z
                    }
                }
                break;
            case 'i':
                model.rotateX(-0.1);
                break;
            case 'k':
                model.rotateX(0.1);
                break;
            case 'j':
                model.rotateY(-0.1);
                break;
            case 'l':
                model.rotateY(0.1);
                break;
            case 'u':
                model.rotateZ(-0.1)
                break;
            case 'o':
                model.rotateZ(0.1)
                break;
            case 'w':
                model.position.z -= 0.1;
                break;
            case 's':
                model.position.z += 0.1;
                break;
            case 'a':
                model.position.x -= 0.1;
                break;
            case 'd':
                model.position.x += 0.1;
                break;
            case 'q':
                model.position.y -= 0.1;
                break;
            case 'e':
                model.position.y += 0.1;
                break;
            case 'n':
                controls.zoomIn();
                break;
            case 'm':
                controls.zoomOut();
                break;
            case 'ArrowUp':
                scene.rotateX(0.1)
                break;
            case 'ArrowDown':
                scene.rotateX(-0.1)
                break;
            case 'ArrowLeft':
                scene.rotateY(-0.1);
                break;
            case 'ArrowRight':
                scene.rotateY(0.1);
                break;
            case 'Tab':
                // detect if out of range first
                var mInd = findModelIndex(model);
                if(e.shiftKey && mInd - 1 >= 0){
                    model = objects[mInd - 1];
                }
                else if(!e.shiftKey && mInd + 1 < objects.length){
                    model = objects[mInd + 1];
                }
                updateObjName(model);
                break;
        }
        e.preventDefault();
    }
}

renderer.domElement.addEventListener('click', onDocumentMouseDown);

window.addEventListener('keydown', keyPressed);

// get the last clicked element
function onDocumentMouseDown( event ) {
    isTyping = false;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
    var intersects;

    if(scene.children[6]){
        intersects = raycaster.intersectObjects(scene.children[6].children, true);
    }
    else{
        intersects = raycaster.intersectObjects(scene.children, true);
    }

    if (intersects.length > 0) {
        console.log('clicked :o');
        model = intersects[0].object;
        console.log("x: " + model.position.x + " y: " + model.position.y + " z: " + model.position.z);
    }

    //check for locking in
    if (checkLocationRange(model, dot, 0.5)){
        model.position.set(0,0,0);
    }

    updateObjName(model);

    // unbold all other text areas
    lmlem.forEach(element => {
        element.style.fontWeight = "normal";
    });

    console.log(model.children.length);
    console.log(lmlem[findModelIndex(model)]);
    console.log(model);
    // make text bold when object is selected
    lmlem[findModelIndex(model)].style.fontWeight = "bold";
}

function checkLocationRange( obj1, obj2, range ){
    if(obj1.position.x >= obj2.position.x - range && obj1.position.x <= obj2.position.x + range){
        if(obj1.position.y >= obj2.position.y - range && obj1.position.y <= obj2.position.y + range){
            if(obj1.position.z >= obj2.position.z - range && obj1.position.z <= obj2.position.z + range){
                console.log("bam");
                return true;
            }
        }
    }
    return false;
}

function findModelName(model){
    for(let i = 0; i < pairList.length; i++){
        if(pairList.at(i).model === model){
            return pairList.at(i).name;
        }
    }
    return "No object found";
}

function findModelIndex(model){
    for(let i = 0; i < objects.length; i++){
        if(objects.at(i) === model){
            return i;
        }
    }
    return -2;
}

function updateObjName(model){
    editText.innerHTML = findModelName(model);
}

function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
  
    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
      // you must pass false here or three.js sadly fights the browser
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
  
      // update any render target sizes here
    }
}

function findIndex(arr, obj){
    for (var i = 0; i < arr.length; i++){
        if (arr[i] === obj){
            console.log("found at " + i);
            return i;
        }
    }
    console.log("failed to find index");
}

const animate = function () {
    requestAnimationFrame( animate );

    resizeCanvasToDisplaySize();

    if(scene.autoRotate){
        scene.rotation.x += 0.01;
        scene.rotation.y += 0.01;
        scene.rotation.z += 0.01;
    }

    renderer.render( scene, camera );
};

animate();