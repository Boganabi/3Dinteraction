
import { OBJLoader } from '/scripts/node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from '/scripts/node_modules/three/examples/jsm/loaders/GLTFLoader';

const objLoader = new OBJLoader();
const gltfLoader = new GLTFLoader();

var globalCounter = 0;

// handle file upload events, including drag n drop
var fileInput = document.querySelector('input[type=file]');
var filenameContainer = document.querySelector('#filename');
var dropzone = document.querySelector('div[class=fileUpload]');

fileInput.addEventListener('change', function() {
    filenameContainer.innerText = fileInput.value.split('\\').pop();
    const fileObtained = fileInput.files[0];
    const newURL = URL.createObjectURL(fileObtained);
    const extension = fileObtained.name.split(".").pop();

    fileToViewPage(newURL, extension);
});

function fileToViewPage(createdURL, ext){
    // find which extension it is and convert it to json to add it to browser cache
    sessionStorage.removeItem("json");
    if(ext === "glb"){
        gltfLoader.load(createdURL, (gltf) => {
            const jsonified = gltf.scene.toJSON();

            const stringification = JSON.stringify(jsonified);
            console.log(jsonified);

            sessionStorage.setItem("json", stringification);
        });
    }
    else if(ext === "obj"){
        objLoader.load(createdURL, (jsonfile) => {
            const jsonified = jsonfile.toJSON();

            const stringification = JSON.stringify(jsonified);

            sessionStorage.setItem("json", stringification);
        });
    }

    window.location.href = "modelViewer.html";
}

window.addEventListener('unload', function() {
    window.unload = null;
});

fileInput.addEventListener('dragenter', function() {
    dropzone.classList.add('dragover');
});

fileInput.addEventListener('dragleave', function() {
    dropzone.classList.remove('dragover');
});

let cards = document.getElementById("cards");

function addNewModelCard(filename) {
    let li = document.createElement("li");
    li.className = "row";
    li.id = globalCounter;
    globalCounter++;

    li.innerHTML = `
        <div class="column">
            <div class="card" id="cardSelection">
                <img src="assets/img/portfolio/safe.png" alt="preview" width="140" height="120">
                <div class="container">
                    <h4><b>` + filename + `</b></h4>
                </div>
            </div>
        </div>`;


    li.addEventListener("click", function () {
        window.location.href = "modelViewer.html?id=" + li.id;
    });
    cards.appendChild(li);
}

addNewModelCard("diamond");
addNewModelCard("fancyskull");
addNewModelCard("milw-ep2");

function keyPressed(e) {

    switch(e.key){
        case 'b':
            
            console.log("spawned");
            break;
    }

    e.preventDefault();
}

document.addEventListener('keydown', keyPressed);

// in the database: model, name of model, author, potentially png?
