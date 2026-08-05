import { OrbitControls } from "three-stdlib";
import camera from "./camera";
import renderer from "./renderer";

const controls = new OrbitControls(camera, renderer.domElement);

// Smooth movement
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Allow zoom
controls.enableZoom = true;

// Don't allow panning
controls.enablePan = false;

// Limit zoom
controls.minDistance = 1.8;
controls.maxDistance = 6;

// Auto rotate when idle
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

export default controls;