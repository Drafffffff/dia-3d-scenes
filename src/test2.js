import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {GUI} from "dat.gui";
import diff from '/src/textures/diff.png'
import disp from '/src/textures/disp.png'
import emiss from '/src/textures/emiss.png'
import rough from '/src/textures/disp.png'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

let scene, renderer, camera, stats;
let model, skeleton, mixer, clock;

const crossFadeControls = [];

let idleAction, walkAction, runAction, rotAction;
let idleWeight, walkWeight, runWeight;
let actions, settings;
let control;
let singleStepMode = false;
let sizeOfNextStep = 0;

settings = {
    w1: 0,
    w2: 0,
    w3: 0,
    w4: 0
}

const loader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()
const diffTexture = textureLoader.load(diff)
const dispTexture = textureLoader.load(disp)
const emissiveTexture = textureLoader.load(emiss)
init();

function init() {

    const container = document.getElementById('renderer');

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(1, 2, -3);
    camera.lookAt(0, 1, 0);

    clock = new THREE.Clock();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000022);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(-3, 10, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    scene.add(dirLight);

    scene.add(new THREE.CameraHelper(dirLight.shadow.camera));

    // ground

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({
        color: 0x999999,
        depthWrite: false
    }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    // scene.add(mesh);
    const mat = new THREE.MeshPhysicalMaterial()
    mat.map = diffTexture;
    mat.roughnessMap = dispTexture;
    // mat.displacementMap = dispTexture;
    mat.emissiveMap = emissiveTexture
    // mat.wireframe = true
    const loader = new GLTFLoader();
    loader.load('/src/展翅动画测试+材质--单基础色.glb', function (gltf) {
        model = gltf.scene;
        const cupGeo = gltf.scene.children[0]
        cupGeo.scale.x = 0.2
        cupGeo.scale.y = 0.2
        cupGeo.scale.z = 0.2
        cupGeo.position.y = 0.2
        scene.add(model);
        // cupGeo.children[1].material=mat
        // cupGeo.children[1].material.emissiveMap = emissiveTexture
        // cupGeo.children[1].material.displacementMap = dispTexture
        // cupGeo.children[1].material.displacementScale = 0.01

        model.traverse(function (object) {
            if (object.isMesh) object.castShadow = true;
        });

        //

        skeleton = new THREE.SkeletonHelper(model);
        skeleton.visible = false;
        scene.add(skeleton);
        const animations = gltf.animations;
        console.log(animations)
        mixer = new THREE.AnimationMixer(model);
        // idleAction = mixer.clipAction(animations[0]);
        walkAction = mixer.clipAction(animations[3]);
        // walkAction.setLoop(THREE.LoopOnce)
        walkAction.play()
        walkAction.paused = true
        mixer.addEventListener( 'loop', ()=>{
            console.log(walkAction)
            walkAction.paused = true
        } );
        // runAction = mixer.clipAction(animations[1]);
        // rotAction = mixer.clipAction(animations[2]);
        // idleAction.enabled = true
        // runAction.enabled = true
        // rotAction.enabled = true
        // idleAction.play()
        // walkAction.play()
        // runAction.play()
        // rotAction.play()
        // actions = [idleAction, walkAction, runAction];

    });


    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;


    control = new OrbitControls(camera, renderer.domElement)

    container.appendChild(renderer.domElement);
    // window.addEventListener( 'resize', onWindowResize );
    // const panel = new GUI({width:300});
    // panel.add(settings,'w1',0,1.0,0.01)
    // panel.add(settings,'w2',0,1.0,0.01)
    // panel.add(settings,'w3',0,1.0,0.01)
    // panel.add(settings,'w4',0,1.0,0.01)

    container.addEventListener("click", () => {
        console.log("a")
        if(walkAction.paused){
            walkAction.paused = false
        }
        // rotAction.enabled = false
    })
}

animate()
clock = new THREE.Clock()

//loop
function animate() {
    // Render loop
    requestAnimationFrame(animate);
    if (mixer) {
        // idleAction.setEffectiveWeight(settings.w1)
        // walkAction.setEffectiveWeight
        // runAction.setEffectiveWeight(settings.w3)
        // rotAction.setEffectiveWeight(settings.w4)
        mixer.update(clock.getDelta())
    }
    control.update()
    renderer.render(scene, camera);

}





