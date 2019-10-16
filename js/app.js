var camera, scene, renderer

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
    createCamera();
    
    // Lists with the respective elements
    create_walls();
    create_cannons();
    balls = create_balls();

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

    renderer.render(scene, camera)
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(10));
}

function createCamera() {
    'use strict';

    camera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    camera.position.x = 40;
    camera.position.y = 40;
    camera.position.z = 40;
    camera.lookAt(scene.position);
}


function onKeyDown(event) {
    'use strict';
    if(event.key == "1") {
        camera.position.x = 0;
        camera.position.y = 100;
        camera.position.z = 0;
        camera.lookAt(cannons[0].position);
    }
    if(event.key == "2") {

    }
    if(event.key == "3") {

    }
    if(event.key == "q") {
        highlightCannon(2);
    }
    if(event.key == "w") {
        highlightCannon(0);
    }
    if(event.key == "e") {
        highlightCannon(1);
    }
}

function create_walls() {
    'use strict';

    walls = []

    for(var i = 0; i < 2; i++) {
        var geometry = new THREE.BoxGeometry(35, 20, 1);
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        walls[i] = new THREE.Mesh(geometry, material);
        scene.add(walls[i]);
    }

    var geometry = new THREE.BoxGeometry(75, 20, 1);
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    walls[2] = new THREE.Mesh(geometry, material);
    scene.add(walls[2]);

    walls[2].position.set(0, 8, -50);
    walls[0].rotation.y += Math.PI / 2;
    walls[0].position.set(37, 8, -32);
    walls[1].rotation.y += Math.PI / 2;
    walls[1].position.set(-37, 8, -32);

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

        cannons[i].rotation.x += Math.PI / 2;
        scene.add(cannons[i]);
    }

    cannons[1].position.set(10, 0, 0);
    cannons[2].position.set(-10, 0, 0);
}

function highlightCannon(cannonNumber) {
    for (i = 0; i < cannons.length; i++) {
        cannons[i].userData.selected = false;
        cannons[i].material.setValues({ color: 0xffff00 });
    }
    cannons[cannonNumber].userData.selected = true;
    cannons[cannonNumber].material.setValues({ color: 0x00ffff });
}

function create_balls() {
    'use strict';

}