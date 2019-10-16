var cameras;
var camera_num = 0;
var scene, renderer

var walls;
var cannons;
var balls;

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    createScene();
    createStationaryCameras();
    
    // Lists with the respective elements
    create_walls();
    create_cannons();
    create_balls();

    createMovingCamera();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function update() {
    'use strict';
}

function animate() {
    'use strict';

    requestAnimationFrame(animate);
    update();
    render();
}

function render() {
    'use strict';

    renderer.render(scene, cameras[camera_num])
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0 && camera_num == 0) {
        cameras[camera_num].aspect = window.innerWidth / window.innerHeight;
        cameras[camera_num].updateProjectionMatrix();
    }
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(10));
}

function createStationaryCameras() {
    'use strict';
    
    cameras = [];

    cameras[0] = cameras[0] = new THREE.OrthographicCamera(window.innerWidth / - 20,
        window.innerWidth / 20,
        window.innerHeight / 20,
        window.innerHeight / - 20,
        1,
        1000);
    cameras[0].position.x = 0;
    cameras[0].position.y = 50;
    cameras[0].position.z = 0;
    cameras[0].lookAt(scene.position);

    cameras[1] = new THREE.PerspectiveCamera(
        45, 
        window.innerWidth / window.innerHeight, 
        1, 
        1000);
    cameras[1].position.x = 0;
    cameras[1].position.y = 100;
    cameras[1].position.z = 0;
    cameras[1].lookAt(scene.position);
}


function onKeyDown(event) {
    'use strict';
    if(event.key == "1") {
        camera_num = 0;
    }
    if(event.key == "2") {
        camera_num = 1;
    }
    if(event.key == "3") {
        camera_num = 2;
    }
    if(event.key == "q") {
        highlightCannon(0);
    }
}

function create_walls() {
    'use strict';
}

function create_cannons() {
    'use strict';

    cannons = [];
    
    for(var i = 0; i < 3; i++) {
        var geometry = new THREE.CylinderGeometry(2, 2, 8, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

        cannons[i] = new THREE.Mesh(geometry, material);
        cannons[i].userData = {
            "selected": false
        };

        cannons[i].position.y += 2;
        cannons[i].rotation.x += Math.PI / 2;
        scene.add(cannons[i]);
    }

    cannons[1].position.set(10, 0, 0);
    cannons[2].position.set(-10, 0, 0);
}

function highlightCannon(cannonNumber) {
    'use strict';

    for(var i = 0; i < cannons.length; i++) {
        cannons[i].userData.selected = false;
        cannons[i].material.setValues({ color: 0xffff00 });
    }
    cannons[cannonNumber].userData.selected = true;
    cannons[cannonNumber].material.setValues({ color: 0x00ffff });
}

function create_balls() {
    'use strict';

    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xf0f0f0});

    balls = [];

    for(var i = 0; i < 10; i++) {
        balls[i] = new THREE.Mesh(geometry, material);

        balls[i].position.z = 15;
        balls[i].position.x = 16 - i * 4;
        scene.add(balls[i]);
    }
}

function createMovingCamera() {
    cameras[2] = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    cameras[2].position.x = 0;
    cameras[2].position.y = 0;
    cameras[2].position.z = 0;
    cameras[2].lookAt(balls[0].position);
}