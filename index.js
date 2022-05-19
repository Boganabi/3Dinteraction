import * as THREE from './node_modules/three/src/Three.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// renderer.setClearColorHex( 0xffffff, 0 );
scene.background = new THREE.Color( 0xd3d3d3 );


const objects = [];

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x444400 } );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );
// objects.push( cube );

// const loader = new GLTFLoader();
// let model, mixer;

// loader.load( 'Skull test 1.glb', function ( gltf ) {
//     model = gltf.scene;

//     scene.add( model );
    
//     gltf.scene.traverse( function( object ) {

//         if ( object.isMesh) {
//             objects.push( object );
//         }
//     } );
// } );

var model1;
var model2;

const gltfLoader = new GLTFLoader();
        const url = 'Skull1.glb';
        gltfLoader.load(url, (gltf) => {
            model1 = gltf.scene;
            scene.add(model1);

            const url2 = 'Skull2.glb';
            gltfLoader.load(url2, (gltf) => {
                model2 = gltf.scene;
                scene.add(model2);
                // model2.position.set(10, 0, 0);

                // const dragcontrols = new Dragcontrols([root, root2], camera, renderer.domElement);
                const dragControls = new DragControls([model1, model2], camera, renderer.domElement);
            })
        })


const directionalLight = new THREE.DirectionalLight( 0xFAEBD7, 20 );
scene.add( directionalLight );

// const light = new THREE.AmbientLight( 0x404040 ); // soft white light
// scene.add( light );

camera.position.z = 5;

// let controlsDrag, group;

// controlsDrag = new DragControls( [ ... objects ], camera, renderer.domElement );


function keyPressed(e){
    
	switch(e.key) {
        case 'KeyS':
            controls.autoRotate = false;
        case 'Enter':
            controls.autoRotate = true;
	  case 'ArrowUp':
        model1.rotateX(-0.1);
		  break;
	  case 'ArrowDown':
        model1.autoRotate = false;
		  break;
	  case 'ArrowLeft':
        model1.rotateY(-0.1);
		  break;
	  case 'ArrowRight':
        model1.rotateY(0.1);
		  break;
	}
	e.preventDefault();
	animate();
  }

  document.body.addEventListener('keydown', keyPressed);

const animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();


