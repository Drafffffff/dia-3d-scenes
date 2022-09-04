
import * as THREE from 'three';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import SceneInit from './lib/SceneInit';
const test = new SceneInit('myThreeJsCanvas');
test.initialize();
test.animate();
const roundedBoxGeometry = new RoundedBoxGeometry(1, 1, 1, 4, 0.1);
const roundedBoxMaterial = new THREE.MeshNormalMaterial({
  wireframe: true,
});
const roundedBoxMesh = new THREE.Mesh(
  roundedBoxGeometry,
  roundedBoxMaterial
);
roundedBoxMesh.position.x = -1;
test.scene.add(roundedBoxMesh);

const teapotGeometry = new TeapotGeometry(0.5, 8);
const teapotMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
const teapotMesh = new THREE.Mesh(teapotGeometry, teapotMaterial);
teapotMesh.position.x = 1;
test.scene.add(teapotMesh);