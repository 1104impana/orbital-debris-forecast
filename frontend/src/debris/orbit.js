import * as satellite from "satellite.js";

export function getXYZ(object) {
    try {
        // Check object exists
        if (!object) {
            console.warn("Invalid debris object");
            return null;
        }

        // Convert TLE/JSON data to satellite record
        const satrec = satellite.json2satrec(object);

        if (!satrec) {
            console.warn(
                "Could not create satrec:",
                object.OBJECT_NAME || "Unknown"
            );
            return null;
        }

        // Propagate satellite position
        const pv = satellite.propagate(
            satrec,
            new Date()
        );

        // IMPORTANT:
        // pv itself can be null
        if (!pv || !pv.position) {
            console.warn(
                "No valid position:",
                object.OBJECT_NAME || "Unknown"
            );
            return null;
        }

        const position = pv.position;

        // Check coordinates are valid numbers
        if (
            !Number.isFinite(position.x) ||
            !Number.isFinite(position.y) ||
            !Number.isFinite(position.z)
        ) {
            console.warn(
                "Invalid coordinates:",
                object.OBJECT_NAME || "Unknown"
            );
            return null;
        }

        // Earth radius
        const earthRadius = 1;
        const earthRadiusKm = 6371;

        // Convert km → globe radius
        const scale = earthRadius / earthRadiusKm;

        return {
            x: position.x * scale,
            y: position.z * scale,
            z: -position.y * scale
        };

    } catch (error) {
        console.warn(
            "ERROR:",
            object?.OBJECT_NAME || "Unknown object",
            error
        );

        // Skip invalid debris instead of crashing
        return null;
    }
}