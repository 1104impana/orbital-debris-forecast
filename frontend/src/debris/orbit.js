import * as satellite from "satellite.js";

export function getXYZ(object) {

    try {

        const satrec = satellite.json2satrec(object);

        console.log(object.OBJECT_NAME, satrec.error);

        const pv = satellite.propagate(
            satrec,
            new Date()
        );

        if (!pv.position) {
            console.log("No position:", object.OBJECT_NAME);
            return null;
        }

        const earthRadius = 1;
        const earthRadiusKm = 6371;
        const scale = earthRadius / earthRadiusKm;

        return {
            x: pv.position.x * scale,
            y: pv.position.z * scale,
            z: -pv.position.y * scale
        };

    } catch (e) {

        console.log("ERROR:", object.OBJECT_NAME, e);

        return null;
    }

}