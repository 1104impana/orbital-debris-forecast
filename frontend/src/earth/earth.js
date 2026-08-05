import * as THREE from "three";

const loader = new THREE.TextureLoader();

const earthTexture = loader.load("/textures/earth-daymap-4k.jpg");

const bumpTexture = loader.load("/textures/earth-bump-4k.jpg");

const specularTexture = loader.load("/textures/earth-specular-4k.jpg");

const geometry = new THREE.SphereGeometry(
    1,
    64,
    64
);

const material = new THREE.MeshPhongMaterial({

    map: earthTexture,

    bumpMap: bumpTexture,

    bumpScale:0.05,

    specularMap: specularTexture,

    shininess:15

});

const earth = new THREE.Mesh(
    geometry,
    material
);

export default earth;