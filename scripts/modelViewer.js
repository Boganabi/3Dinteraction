import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";
import { DragControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/DragControls.js";

// import * as THREE from '/scripts/node_modules/three';
// import { OrbitControls } from '/scripts/node_modules/three/examples/jsm/controls/OrbitControls'
// import { GLTFLoader } from '/scripts/node_modules/three/examples/jsm/loaders/GLTFLoader';
// import { DragControls } from '/scripts/node_modules/three/examples/jsm/controls/DragControls'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight - 72 ); // 72 being the height of the top bar
document.body.appendChild( renderer.domElement );

scene.background = new THREE.Color( 0xd3d3d3 );

const pairList = []; 
const objects = []; // list of all loaded objects in the scene
const lmlem = []; // list of li elements for the sidebar
// const loadedObjs = [];  // booleans checking if those objects are loaded

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x444400 } );
// const cube = new THREE.Mesh( geometry, material );

const gltfLoader = new GLTFLoader();

// const controls = createControls(camera, renderer.domElement);
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

var model;
// var mesh;
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
    window.location.href = "index.html";
});

// const btn1 = document.getElementById("switchModel");
// btn1.addEventListener("click", function () { loadModel(0) });

// const btn2 = document.getElementById("switchModel2");
// btn2.addEventListener("click", function () { loadModel(1) });

// const btn3 = document.getElementById("switchModel3");
// btn3.addEventListener("click", function () { loadModel(2) });

var editText = document.getElementById("nameID");

// since we passed in parameter for model name, now we extract the name and load it
// im using an array just in case we want to add more parameters later
var queryString = new Array();
var modelName = "";
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
    // check if we have a valid name passed, and print it
    if(queryString["name"] != null){
        modelName = queryString["name"];
        console.log(modelName);

        const url = '/models/' + modelName + '.glb';

        gltfLoader.load(url, (gltf) => {
            model = gltf.scene;
            // model.side = THREE.MeshLambertMaterial;
            // model.material = new THREE.MeshPhongMaterial({
            //     color:      0xFFFFFF,
            //     specular:   0xFFFBF2,
            //     shininess:  60,
            //     map:        THREE.Texture,
            //     side:       THREE.DoubleSide
            // });
            model.material = new THREE.ShadowMaterial({opacity: .3, color: 0xFFFFFF});
            // mesh = model.material;

            // let listElements = document.getElementById("elements");

            scene.add(model);
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
                    // make text bold too
                })
            });
        })
    }
}

// fix so that key presses work on last selected, and objects are toggleable
// function loadModel(n){
    // var url;
    // if(n === 0 && !loadedObjs[0]) {
    //     url = '/fancyskull.glb';
    //     loadedObjs[0] = !loadedObjs[0];
    // } 
    // these are commented for now
    // if(n === 1 && !loadedObjs[1]) {
    //     url = '/Skull test 2.glb';
    //     loadedObjs[1] = !loadedObjs[1];
    // }
    // if(n === 2 && !loadedObjs[2]) {
    //     url = '/Skull test 3.glb';
    //     loadedObjs[2] = !loadedObjs[2];
    // }

    // if(!url){
    //     return; // in case the object we want to spawn is invalid for some reason
    // }
    // may need to have array of objects later
    // gltfLoader.load(url, (gltf) => {
    //     model = gltf.scene;
    //     // model.side = THREE.MeshLambertMaterial;
    //     // model.material = new THREE.MeshPhongMaterial({
    //     //     color:      0xFFFFFF,
    //     //     specular:   0xFFFBF2,
    //     //     shininess:  60,
    //     //     map:        THREE.Texture,
    //     //     side:       THREE.DoubleSide
    //     // });
    //     model.material = new THREE.ShadowMaterial({opacity: .3, color: 0xFFFFFF});
    //     mesh = model.material;
    //     scene.add(model);
    //     for(var i = 0; i < model.children.length; i++){
    //         objects.push(model.children[i]);
    //         const objPair = new Object();
    //         objPair.model = model.children[i];
    //         objPair.name = "Object " + (pairList.length + 1); 
    //         pairList.push(objPair);
    //     }
    //     const dragControls = new DragControls([model], camera, renderer.domElement);
    // })
// }

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

// maybe try to use right click to drag later?
function keyPressed(e){
    
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
                //model.rotation.z -= 0.1;
                model.rotateZ(-0.1)
                break;
            case 'o':
                //model.rotation.z += 0.1;
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
        // e.preventDefault();
    }
}

// document.body.addEventListener('keydown', keyPressed);
// document.body.addEventListener('click', onDocumentMouseDown);
renderer.domElement.addEventListener('click', onDocumentMouseDown);
renderer.domElement.addEventListener('keydown', keyPressed);

// get the last clicked element
function onDocumentMouseDown( event ) {
    isTyping = false;
    // https://stackoverflow.com/questions/26250810/three-js-get-object-name-with-mouse-click
    // console.log("start func");
    // var getMeshes = function(parents) {
    //     var meshes = [];
    //     console.log("length: " + parents.length)
    //     for (var i = 0; i < parents.length; i++) 
    //     {
    //         console.log("instance of: " + parents[i].type)
    //         // console.log("instance check: " + parents[i].geometry)
    //         if (parents[i].children.length > 0) {
    //             meshes = meshes.concat(getMeshes(parents[i].children));
                
    //             console.log(getMeshes(parents[i].children))
    //             console.log("more parents plz")
    //         } else if (parents[i] instanceof THREE.Mesh) {
    //             console.log("it's a mesh!")
    //             meshes.push(parents[i]);
    //         }
    //     }
    //     console.log("end loop");
    //     return meshes;
    // };
    // function attributeValues(o) 
    // {
    //     var out = [];
    //     for (var key in o) {
    //         if (!o.hasOwnProperty(key))
    //             continue;
    //             out.push(o[key]);
    //     }
    //     return out;
    // }
    // var objects = attributeValues(this.o3dByEntityId);
    // var meshes = getMeshes(scene.children);
    const index = 6;
    console.log("length: " + scene.children[index].children.length)
    for(let i = 0; i < scene.children[index].children.length; i++){
        console.log("type of number " + i + ": " + scene.children[index].children[i].geometry);
    }

    // console.log(meshes);

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    // var canvasBounds = scene.rendererModelling.domElement.getBoundingClientRect();
    // mouse.x = (event.clientX - canvasBounds.left / (canvasBounds.right - canvasBounds.left )) * 2 - 1;
    // mouse.y = - (event.clientY - canvasBounds.top / (canvasBounds.bottom - canvasBounds.top )) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // const camInverseProjection = new THREE.Matrix4().getInverse(this.camera.projectionMatrix);
    // const cameraPosition = new THREE.Vector3().applyMatrix4(camInverseProjection);
    // const mousePosition = new THREE.Vector3(mouse.x, mouse.y, 1).applyMatrix4(camInverseProjection);
    // const viewDirection = mousePosition.clone().sub(cameraPosition).normalize();

    // this.raycaster.set(cameraPosition, viewDirection);
    
    const intersects = raycaster.intersectObjects(scene.children[6].children, true);

    // console.log("detecting: " + scene.children[2].children);
    // console.log("intersects: " + intersects);
    if (intersects.length > 0) {
        console.log('clicked :o');
        // let n = new THREE.Vector3();
        // n.copy(intersects[0].face.normal);
        // n.transformDirection(intersects[0].object.matrixWorld);
        model = intersects[0].object;
        console.log("type of obj: " + model.geometry);
        console.log("x: " + model.position.x + " y: " + model.position.y + " z: " + model.position.z);
    }

    //check for locking in
    if (checkLocationRange(model, dot, 0.5)){
        // model.position.x = dot.position.x;
        // model.position.y = dot.position.y;
        // model.position.z = dot.position.z;
        model.position.set(0,0,0);
        // console.log("fired");
    }

    updateObjName(model);

    // unbold all other text areas
    lmlem.forEach(element => {
        element.style.fontWeight = "normal";
    });
    // make text bold when object is selected
    lmlem[findModelIndex(model)].style.fontWeight = "bold";

    // close dropdown menu when clicked off of
    // if(!event.target.matches('.dropbtn')) {
    //     var dropdowns = document.getElementsByClassName("dropdown-content");
    //     for( var i = 0; i < dropdowns.length; i++ ) {
    //         var openDropdown = dropdowns[i];
    //         if (openDropdown.classList.contains('show')) {
    //             openDropdown.classList.remove('show');
    //         }
    //     }
    // }
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