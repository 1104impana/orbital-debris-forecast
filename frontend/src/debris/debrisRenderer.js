import * as THREE from "three";

export function createDebris(scene, count = 1932) {

    const positions = [];

    for (let i = 0; i < count; i++) {

        const r = 6 + Math.random() * 4;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions.push(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta)
        );
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
        color: 0xff4444,
        size: 0.03
    });

    const points = new THREE.Points(geometry, material);

    scene.add(points);

    return points;
}