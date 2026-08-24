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

    // =========================
    // LIVE DEBRIS = RED
    // =========================

    const material = new THREE.PointsMaterial({
        color: 0xff3333,
        size: 0.015,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
        depthWrite: true
    });

    const points = new THREE.Points(
        geometry,
        material
    );

    points.renderOrder = 1;

    scene.add(points);

    return points;
}


export function createPredictedDebris(scene, predictedTotal, liveCount) {

    const positions = [];

    // Earth radius = 1
    // Put future debris on a thin orbital shell
    // around Earth instead of filling a spherical volume.
    const MIN_ALTITUDE = 160;
    const MAX_ALTITUDE = 1000;

    const MIN_RADIUS = 1 + (MIN_ALTITUDE / 6371);
    const MAX_RADIUS = 1 + (MAX_ALTITUDE / 6371);

    // Future prediction is TOTAL debris population.
    // Render only the additional debris.
    const additionalDebris = Math.max(
        0,
        Math.round(
            Number(predictedTotal) - Number(liveCount)
        )
    );

    for (let i = 0; i < additionalDebris; i++) {

        // Random direction over the whole sphere
        const theta = Math.random() * Math.PI * 2;

        const u = Math.random() * 2 - 1;
        const phi = Math.acos(u);

        // IMPORTANT:
        // Keep debris close to an orbital shell.
        // Do NOT distribute through the whole volume.
        const radius =
            MIN_RADIUS +
            Math.random() * (MAX_RADIUS - MIN_RADIUS);

        const sinPhi = Math.sin(phi);

        const x =
            radius *
            sinPhi *
            Math.cos(theta);

        const y =
            radius *
            sinPhi *
            Math.sin(theta);

        const z =
            radius *
            Math.cos(phi);

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
    color: 0x00ff66,
    size: 0.012,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,

    // IMPORTANT:
    // Earth must hide debris that is behind it.
    depthTest: true,
    depthWrite: false
});

const points = new THREE.Points(
    geometry,
    material
);

// Same depth/render behaviour as live debris
points.renderOrder = 1;
    

    scene.add(points);

    return points;

    console.log(
        "Predicted total:",
        predictedTotal
    );

    console.log(
        "Live debris:",
        liveCount
    );

    console.log(
        "Additional predicted debris:",
        additionalDebris
    );

    return points;
}