
// import necessary libraries
import { OBJLoader } from '/scripts/node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from '/scripts/node_modules/three/examples/jsm/loaders/GLTFLoader';

// init loaders for obj and glb so that it can be transferred to json to put in the cache
const objLoader = new OBJLoader();
const gltfLoader = new GLTFLoader();

// counter to keep track of id in database
var globalCounter = 0;

// handle file upload events, including drag n drop
var fileInput = document.querySelector('input[type=file]');
var filenameContainer = document.querySelector('#filename');
var dropzone = document.querySelector('div[class=fileUpload]');

// listens for change to file input (i.e. upload)
fileInput.addEventListener('change', function() {
    filenameContainer.innerText = fileInput.value.split('\\').pop();
    const fileObtained = fileInput.files[0];
    const newURL = URL.createObjectURL(fileObtained);
    const extension = fileObtained.name.split(".").pop();

    fileToViewPage(newURL, extension);
});

// converts uploaded file to json and changes to modelviewer page
function fileToViewPage(createdURL, ext){
    // find which extension it is and convert it to json to add it to browser cache
    // remove last item from cache
    sessionStorage.removeItem("json");
    if(ext === "glb"){
        // "loads" a glb model so that it can be properly put in JSON format
        gltfLoader.load(createdURL, (gltf) => {
            const jsonified = gltf.scene.toJSON();

            const stringification = JSON.stringify(jsonified);
            console.log(jsonified);

            sessionStorage.setItem("json", stringification);
        });
    }
    else if(ext === "obj"){
        // "loads" an obj model so that it can be properly put in JSON format
        objLoader.load(createdURL, (jsonfile) => {
            const jsonified = jsonfile.toJSON();

            const stringification = JSON.stringify(jsonified);

            sessionStorage.setItem("json", stringification);
        });
    }

    // switch to modelviewer page
    window.location.href = "modelViewer.html";
}

// check for unload to prevent cache issues
window.addEventListener('unload', function() {
    window.unload = null;
});

// listens for dragover on file uploader
fileInput.addEventListener('dragenter', function() {
    dropzone.classList.add('dragover');
});

// listens for user to take dragged file off
fileInput.addEventListener('dragleave', function() {
    dropzone.classList.remove('dragover');
});

// the parent of the li array
let cards = document.getElementById("cards");

function addNewModelCard(filename) {
    // create li element with row class and id
    let li = document.createElement("li");
    li.className = "row";
    li.id = globalCounter;
    globalCounter++;

    // the actual HTML of this li element
    li.innerHTML = `
        <div class="column">
            <div class="card" id="cardSelection">
                <img src="assets/img/portfolio/safe.png" alt="preview" width="140" height="120">
                <div class="container">
                    <h4><b>` + filename + `</b></h4>
                </div>
            </div>
        </div>`;

    // add click listener to see when user clicks on one of these cards
    li.addEventListener("click", function () {
        window.location.href = "modelViewer.html?id=" + li.id;
    });

    // appends li element to ul list
    cards.appendChild(li);
}

// the models that this will use
addNewModelCard("fancyskull");
addNewModelCard("diamond");
addNewModelCard("milw-ep2");

// listen for keypress (not doing much at the moment, but might later)
function keyPressed(e) {

    switch(e.key){
        case 'b':
            
            console.log("spawned");
            break;
    }

    e.preventDefault();
}

// listens for keypress
document.addEventListener('keydown', keyPressed);

// in the database: model, name of model, author, potentially png?
