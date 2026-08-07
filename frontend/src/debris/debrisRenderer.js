import * as THREE from "three";
import { getXYZ } from "./orbit";

export function createDebris(scene, debris) {

    const positions = [];

    for (const object of debris) {
         // Temporary filter (optional)
    if (Number(object.APOAPSIS) > 3000) {
        continue;
    }

        const xyz = getXYZ(object);

        if (!xyz)
            continue;

        positions.push(
            xyz.x,
            xyz.y,
            xyz.z
        );

    }

    console.log("Rendered:", positions.length / 3);

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

        size: 0.02,

        transparent: true,

        opacity: 0.8

    });

    const points = new THREE.Points(
        geometry,
        material
    );

    scene.add(points);

    return points;

}

