import * as satellite from "satellite.js";

export function getXYZ(object) {

    const satrec = satellite.json2satrec(object);

    const pv = satellite.propagate(
        satrec,
        new Date()
    );

    if (!pv.position)
        return null;

    

    const earthRadius = 1;          // Three.js Earth radius
    const earthRadiusKm = 6371;

    const scale = earthRadius / earthRadiusKm;

    return {
        x: pv.position.x * scale,
        y: pv.position.z * scale,
        z: -pv.position.y * scale
    };
}