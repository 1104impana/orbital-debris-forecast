import * as THREE from "three";
import { getXYZ } from "./orbit";

export function createDebris(scene, debris) {

    const positions = [];

    let skipped = 0;

    // Earth radius = 1 in our Three.js scene
    // Keep debris approximately 160–1000 km above Earth.
    const MIN_RADIUS = 1 + (160 / 6371);
    const MAX_RADIUS = 1 + (1000 / 6371);

    for (const object of debris) {

        const xyz = getXYZ(object);

        if (!xyz) {
            skipped++;
            continue;
        }

        // Calculate distance from Earth's center
        const radius = Math.sqrt(
            xyz.x * xyz.x +
            xyz.y * xyz.y +
            xyz.z * xyz.z
        );

        // Keep only near-Earth / LEO debris
        if (radius < MIN_RADIUS || radius > MAX_RADIUS) {
            skipped++;
            continue;
        }

        positions.push(
            xyz.x,
            xyz.y,
            xyz.z
        );
    }

    console.log("==============================");
    console.log("Total objects:", debris.length);
    console.log("Rendered LEO debris:", positions.length / 3);
    console.log("Skipped:", skipped);
    console.log("==============================");

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            positions,
            3
        )
    );

    const material = new THREE.PointsMaterial({
        color: 0xff3333,
        size: 0.015,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true
    });

    const points = new THREE.Points(
        geometry,
        material
    );

    scene.add(points);

    return points;
}

export function createPredictedDebris(scene, count) {

    const positions = [];

    // Earth radius = 1
    const MIN_RADIUS = 1 + (160 / 6371);
    const MAX_RADIUS = 1 + (1000 / 6371);

    // Number of debris points to display
    const debrisCount = Math.round(count);

    for (let i = 0; i < debrisCount; i++) {

        // Random spherical position
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        // Random orbital altitude
        const radius =
            MIN_RADIUS +
            Math.random() * (MAX_RADIUS - MIN_RADIUS);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            positions,
            3
        )
    );

    const material = new THREE.PointsMaterial({
        color: 0x00FF66,
        size: 0.012,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const points = new THREE.Points(
        geometry,
        material
    );

    scene.add(points);

    console.log(
        `Predicted debris rendered: ${debrisCount}`
    );

    return points;
}