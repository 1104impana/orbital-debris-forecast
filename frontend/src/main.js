import "./style.css";

import scene from "./scene";
import earth from "./earth/Earth";
import stars from "./earth/stars";
import "./earth/lights";
import animate from "./animate";

import { createDebris } from "./debris/debrisRenderer";
import { getLiveDebris } from "./debris/liveDebris";

scene.add(earth);
// scene.add(stars);

animate();

let debrisPoints = null;

async function loadDebris() {

    // Fetch latest data from backend
    const data = await getLiveDebris();

    console.log("Fetched Objects:", data.count);

    // Remove old debris cloud
    if (debrisPoints) {

        scene.remove(debrisPoints);

        debrisPoints.geometry.dispose();
        debrisPoints.material.dispose();
    }

    // Create new debris cloud
    debrisPoints = createDebris(scene, data.debris);

    // Update status panel
    document.getElementById("timestamp").innerHTML = `
        <b>LIVE ORBITAL DEBRIS</b><br><br>

        Source : SPACE-TRACK<br>

        Objects : ${data.count}<br>

        GP Epoch : ${data.epoch}<br>

       Last Fetch : ${new Date(data.last_fetch).toLocaleString()}<br>

        Refresh : Every 1 Hour
    `;
}

// Initial load
await loadDebris();

// Refresh every hour
setInterval(loadDebris, 60 * 60 * 1000);