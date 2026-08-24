import "./style.css";

import scene from "./scene";
import earth from "./earth/Earth";
import stars from "./earth/stars";
import "./earth/lights";
import animate from "./animate";

import {
    createDebris,
    createPredictedDebris
} from "./debris/debrisRenderer";
import { getLiveDebris } from "./debris/liveDebris";

scene.add(earth);
// scene.add(stars);

animate();

let debrisPoints = null;
let predictedDebrisPoints = null;

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
        <b>LIVE ORBITAL DEBRIS</b><br>

        Source : SPACE-TRACK<br>

        Objects : ${data.count}<br>

        GP Epoch : ${data.epoch}<br>

       Last Fetch : ${new Date(data.last_fetch).toLocaleString()}<br>

        Refresh : Every 1 Hour
    `;
}

async function loadPredictedDebris(year) {

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/future-debris?year=${year}`
        );

        if (!response.ok) {
            throw new Error(
                `Prediction API error: ${response.status}`
            );
        }

        const data = await response.json();

        console.log(
            "Prediction:",
            year,
            data.predicted
        );

        // Remove previous green prediction
        if (predictedDebrisPoints) {

            scene.remove(
                predictedDebrisPoints
            );

            predictedDebrisPoints.geometry.dispose();

            predictedDebrisPoints.material.dispose();

            predictedDebrisPoints = null;
        }

        // Create new green prediction
        predictedDebrisPoints =
            createPredictedDebris(
                scene,
                data.predicted
            );

        const predictionDisplay =
            document.getElementById(
                "predictionDisplay"
            );

        if (predictionDisplay) {

            predictionDisplay.innerHTML = `
                Predicted debris:
                ${Number(data.predicted).toLocaleString()}
            `;
        }

    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );
    }
}

// Initial load
await loadDebris();

// Refresh every hour
setInterval(loadDebris, 60 * 60 * 1000);

const yearSlider =
    document.getElementById("yearSlider");

const yearValue =
    document.getElementById("yearValue");

const predictionYears = [2026, 2030, 2035, 2040, 2045];

if (yearSlider) {

    // Slider positions: 0, 1, 2, 3, 4
    yearSlider.min = 0;
    yearSlider.max = 4;
    yearSlider.step = 1;
    yearSlider.value = 0;

    yearValue.textContent = "2026";

    document.getElementById(
        "predictionDisplay"
    ).textContent = "LIVE DEBRIS";


    yearSlider.addEventListener("input", async () => {

        // Convert slider position → actual year
        const index = Number(yearSlider.value);
        const year = predictionYears[index];

        yearValue.textContent = year;


        // =========================
        // 2026 = LIVE DEBRIS
        // =========================

        if (year === 2026) {

            if (predictedDebrisPoints) {

                scene.remove(predictedDebrisPoints);

                predictedDebrisPoints.geometry.dispose();
                predictedDebrisPoints.material.dispose();

                predictedDebrisPoints = null;
            }

            document.getElementById(
                "predictionDisplay"
            ).textContent = "LIVE DEBRIS";

            return;
        }


        // =========================
        // 2030–2045 = PREDICTION
        // =========================

        await loadPredictedDebris(year);
    });
}


// FIX: resize Three.js when browser window changes
window.addEventListener("resize", () => {
    const camera = scene.userData.camera;
    const renderer = scene.userData.renderer;

    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );
    }
});