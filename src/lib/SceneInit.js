import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

export default class SceneInit {
    constructor(canvasId, width = 500, height = 500) {
        this.scene = undefined;
        this.camera = undefined;
        this.renderer = undefined;
        this.width = width;
        this.height = height;

        this.fov = 45;
        this.nearPlane = 1;
        this.farPlane = 1000;
        this.canvasId = canvasId;

        this.clock = undefined;
        this.stats = undefined;
        this.controls = undefined;

        this.spotLight = undefined;
        this.ambientLight = undefined;
        this.mixers = []
    }

    initialize() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            this.width / this.height,
            0.1,
            200
        );
        this.camera.position.z = 4;
        const canvas = document.getElementById(this.canvasId);
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
        // document.body.appendChild(this.renderer.domElement);
        this.clock = new THREE.Clock();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.stats = Stats();
        document.body.appendChild(this.stats.dom);
        this.ambientLight = new THREE.AmbientLight()
        this.ambientLight.color = new THREE.Color(0xffffff)
        this.ambientLight.intensity = 1.0
        this.ambientLight.castShadow = true
        this.scene.add(this.ambientLight);
        this.spotLight = new THREE.SpotLight(0xffffff, 1);
        this.spotLight.castShadow = true;
        this.spotLight.position.set(0, 4, 2);
        const spotLightHelper = new THREE.SpotLightHelper(this.spotLight, 0xffffff)
        this.scene.add(this.spotLight, spotLightHelper);
        window.addEventListener('resize', () => this.onWindowResize(), false);
        this.uniforms = {
            u_time: {type: 'f', value: 1.0},
            colorB: {type: 'vec3', value: new THREE.Color(0xfff000)},
            colorA: {type: 'vec3', value: new THREE.Color(0xffffff)},
        };
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
        this.controls.update();
    }

    render() {
        this.uniforms.u_time.value += this.clock.getDelta();

        // for (const mixer of this.mixers) mixer.update(this.clock.getDelta());
        // console.log(this.mixers)
        if(this.mixers.length>0) this.mixers[0].update(this.clock.getDelta())
        this.stats.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }
}
