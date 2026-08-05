import "./style.css";

import scene from "./scene";
import earth from "./earth/Earth";
import stars from "./earth/stars";

import "./earth/lights";

import animate from "./animate";

import { createDebris } from "./debris/debrisRenderer";

scene.add(earth);
scene.add(stars);

animate();


import { getLiveDebris } from "./debris/liveDebris.js";

const debris = await getLiveDebris();


console.log(debris.length);

createDebris(scene, debris.length);