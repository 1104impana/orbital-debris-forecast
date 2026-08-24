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

// Current actual LIVE debris count
let liveDebrisCount = 0;


// =====================================================
// LOAD LIVE DEBRIS
// =====================================================

async function loadDebris() {

    try {

        const data = await getLiveDebris();

        console.log("Fetched Objects:", data.count);

        // Store actual live count
        liveDebrisCount = Number(data.count);


        // Remove old live debris
        if (debrisPoints) {

            scene.remove(debrisPoints);

            debrisPoints.geometry.dispose();
            debrisPoints.material.dispose();
        }


        // Create live debris
        debrisPoints = createDebris(
            scene,
            data.debris
        );


        // Update LIVE panel
        const timestamp =
            document.getElementById("timestamp");

        if (timestamp) {

            timestamp.innerHTML = `
                <b>LIVE ORBITAL DEBRIS</b><br>

                Source : SPACE-TRACK<br>

                Objects : ${liveDebrisCount.toLocaleString()}<br>

                GP Epoch : ${data.epoch}<br>

                Last Fetch :
                ${new Date(data.last_fetch).toLocaleString()}<br>

                Refresh : Every 1 Hour
            `;
        }


        // Update prediction display if currently on 2026
        const predictionDisplay =
            document.getElementById("predictionDisplay");

        const yearValue =
            document.getElementById("yearValue");

        if (
            predictionDisplay &&
            yearValue &&
            Number(yearValue.textContent) === 2026
        ) {

            predictionDisplay.innerHTML = `
                Live debris:
                ${liveDebrisCount.toLocaleString()}
            `;
        }


        console.log(
            "LIVE debris count:",
            liveDebrisCount
        );

    } catch (error) {

        console.error(
            "Live debris error:",
            error
        );
    }
}


// =====================================================
// LOAD FUTURE PREDICTION
// =====================================================

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


        // Convert prediction safely to number
        const predictedTotal =
            Math.round(
                Number(data.predicted)
            );


        if (!Number.isFinite(predictedTotal)) {

            throw new Error(
                "Invalid predicted debris value"
            );
        }


        // Calculate additional debris
        const additionalDebris =
            Math.max(
                0,
                predictedTotal - liveDebrisCount
            );


        console.log(
            "=============================="
        );

        console.log(
            "Prediction year:",
            year
        );

        console.log(
            "Live debris:",
            liveDebrisCount
        );

        console.log(
            "Predicted total:",
            predictedTotal
        );

        console.log(
            "Additional predicted:",
            additionalDebris
        );

        console.log(
            "=============================="
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


        // IMPORTANT:
        // debrisRenderer expects:
        // createPredictedDebris(scene, predictedTotal, liveCount)
        //
        // DO NOT pass additionalDebris here.
        predictedDebrisPoints =
            createPredictedDebris(
                scene,
                predictedTotal,
                liveDebrisCount
            );


        // Update prediction panel
        const predictionDisplay =
            document.getElementById(
                "predictionDisplay"
            );


        if (predictionDisplay) {

            predictionDisplay.innerHTML = `
                Live debris:
                ${liveDebrisCount.toLocaleString()}<br>

                Additional predicted:
                ${additionalDebris.toLocaleString()}<br>

                Future total:
                ${predictedTotal.toLocaleString()}
            `;
        }


    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );
    }
}


// =====================================================
// INITIAL LOAD
// =====================================================

await loadDebris();


// =====================================================
// REFRESH LIVE DATA EVERY HOUR
// =====================================================

setInterval(
    loadDebris,
    60 * 60 * 1000
);


// =====================================================
// YEAR SLIDER
// =====================================================

const yearSlider =
    document.getElementById(
        "yearSlider"
    );


const yearValue =
    document.getElementById(
        "yearValue"
    );


const predictionDisplay =
    document.getElementById(
        "predictionDisplay"
    );


const predictionYears = [
    2026,
    2030,
    2035,
    2040,
    2045
];


if (yearSlider) {

    yearSlider.min = 0;

    yearSlider.max = 4;

    yearSlider.step = 1;

    yearSlider.value = 0;


    yearValue.textContent =
        "2026";


    predictionDisplay.innerHTML = `
        Live debris:
        ${liveDebrisCount.toLocaleString()}
    `;


    yearSlider.addEventListener(
        "input",
        async () => {

            const index =
                Number(
                    yearSlider.value
                );


            const year =
                predictionYears[index];


            yearValue.textContent =
                year;


            // =========================================
            // 2026 = LIVE ONLY
            // =========================================

            if (year === 2026) {

                if (predictedDebrisPoints) {

                    scene.remove(
                        predictedDebrisPoints
                    );

                    predictedDebrisPoints.geometry.dispose();

                    predictedDebrisPoints.material.dispose();

                    predictedDebrisPoints = null;
                }


                predictionDisplay.innerHTML = `
                    Live debris:
                    ${liveDebrisCount.toLocaleString()}
                `;

                return;
            }


            // =========================================
            // 2030–2045 = FUTURE PREDICTION
            // =========================================

            await loadPredictedDebris(
                year
            );
        }
    );
}


// =====================================================
// RESPONSIVE THREE.JS
// =====================================================

window.addEventListener(
    "resize",
    () => {

        const camera =
            scene.userData.camera;


        const renderer =
            scene.userData.renderer;


        if (camera && renderer) {

            camera.aspect =
                window.innerWidth /
                window.innerHeight;


            camera.updateProjectionMatrix();


            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );


            renderer.setPixelRatio(
                Math.min(
                    window.devicePixelRatio,
                    2
                )
            );
        }
    }
);