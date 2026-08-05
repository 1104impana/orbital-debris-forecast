import * as THREE from "three";
import scene from "../scene";

const ambient = new THREE.AmbientLight(0xffffff,0.4);

const directional = new THREE.DirectionalLight(0xffffff,2);

directional.position.set(5,3,5);

scene.add(ambient);
scene.add(directional);