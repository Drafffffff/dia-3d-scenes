
import * as THREE from 'three';
import SceneInit from './lib/SceneInit';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import diff from '/src/textures/painted_concrete_diff_1k.jpg'
import disp from '/src/textures/painted_concrete_disp_1k.png'
import nor from '/src/textures/painted_concrete_nor_gl_1k.jpg'
import rough from '/src/textures/painted_concrete_rough_1k.jpg'


const test = new SceneInit('myThreeJsCanvas');
test.initialize();
test.animate();
const loader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()
const diffTexture = textureLoader.load(diff)
const dispTexture = textureLoader.load(disp)
const norTexture = textureLoader.load(nor)
const roughTexture = textureLoader.load(rough)
const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: diffTexture,
    // wireframe:true,
    // opacity:0.5,
    transparent:true,
    // alphaMap:roughTexture,
})
loader.load( '/src/cup.glb', function ( gltf ) {
    console.log()
    gltf.scene.scale.x = 0.2
    gltf.scene.scale.y = 0.2
    gltf.scene.scale.z = 0.2
    gltf.scene.position.y = -1
    gltf.scene.rotation.y = Math.PI
    gltf.scene.children[0].material = material
    console.log(gltf.scene.children[0])
    test.scene.add( gltf.scene );
} );
