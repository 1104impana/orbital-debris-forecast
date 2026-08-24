import * as THREE from "three";

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

document.body.appendChild(renderer.domElement);


// Keep renderer size updated
// when VS Code terminal/browser viewport changes
window.addEventListener("resize", () => {

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});


export default renderer;