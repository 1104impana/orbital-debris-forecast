import * as THREE from "three";

const geometry = new THREE.BufferGeometry();

const vertices = [];

for(let i=0;i<5000;i++){

    vertices.push(
        (Math.random()-0.5)*200,
        (Math.random()-0.5)*200,
        (Math.random()-0.5)*200
    );

}

geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices,3)
);

const material = new THREE.PointsMaterial({

    color:0xffffff,

    size:0.15,

    transparent: true,
    
    opacity: 0.25 

});

const stars = new THREE.Points(
    geometry,
    material
);

export default stars;