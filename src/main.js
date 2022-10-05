import * as THREE from 'three';
import SceneInit from './lib/SceneInit';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import diff from '/src/textures/diff.png'
import disp from '/src/textures/disp.png'
import emiss from '/src/textures/emiss.png'
import rough from '/src/textures/disp.png'
import {GUI} from "dat.gui";


const test = new SceneInit('myThreeJsCanvas');
test.initialize();

const loader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()
const diffTexture = textureLoader.load(diff)
const dispTexture = textureLoader.load(disp)
const emissiveTexture = textureLoader.load(emiss)
const roughTexture = textureLoader.load(rough)
const material = new THREE.MeshStandardMaterial()
material.map = diffTexture
// material.displacementMap = dispTexture
// material.roughnessMap = roughTexture
// material.emissiveMap = diffTexture
// material.transparent =false



//let
let mixer = undefined;
let idleAction=undefined
let walkAction=undefined
let runAction =undefined
let actions


loader.load('/src/展翅动画测试+材质--单基础色.glb', function (gltf) {
    console.log(gltf)
    const skeleton = new THREE.SkeletonHelper(gltf.scene);
    skeleton.visible = true;
    const cupGeo = gltf.scene.children[0]
    cupGeo.scale.x = 0.2
    cupGeo.scale.y = 0.2
    cupGeo.scale.z = 0.2
    cupGeo.position.y = 0
    cupGeo.rotation.y = Math.PI
    // cupGeo.children[1].material = material
    console.log(111,cupGeo)
    const animations = gltf.animations;
    mixer = new THREE.AnimationMixer(cupGeo);

    idleAction = mixer.clipAction( animations[ 0 ] );
    walkAction = mixer.clipAction( animations[ 3 ] );
    runAction = mixer.clipAction( animations[ 1 ] );
    actions = [ idleAction, walkAction, runAction ];
    idleAction.play()
    walkAction.weight = 0;
    runAction.weight = 0;
    console.log(idleAction)
    idleAction.paused = false
    walkAction.play()
    runAction.play()
    test.mixers.push(mixer);
    test.scene.add(gltf.scene, skeleton);
});
test.animate();

