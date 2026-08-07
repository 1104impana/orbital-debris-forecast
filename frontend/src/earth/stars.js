import * as THREE from "three";

const geometry = new THREE.BufferGeometry();

const vertices = [];

const radius = 150;

for (let i = 0; i < 5000; i++) {

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    vertices.push(x, y, z);
}

geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
);

const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.04,
    transparent: true,
    opacity: 0.25,
    sizeAttenuation: true
});

const stars = new THREE.Points(geometry, material);

export default stars;