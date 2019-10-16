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
    walls = create_walls();
    cannons = create_cannons();
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

    }
    if(event.key == "2") {

    }
    if(event.key == "3") {

    }
    if(event.key == "q") {
        highlightCannon(0);
    }
}

function highlightCannon(cannonNumber) {
    for(i = 0; i < cannons.length(); i++) {
        cannons[i].userData.selected = false;
        cannons[i].color = 0xffff00;
    }
    cannons[cannonNumber].userData.selected = true;
    cannons[cannonNumber].color = 0x00ffff;
}

function create_walls() {
    'use strict';
}

function create_cannons() {
    'use strict';

    var geometry = new THREE.CylinderGeometry(2, 2, 8, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    
    var cannon1 = new THREE.Mesh(geometry, material);
    cannon1.userData = {
        "selected": false
    };
    var cannon2 = cannon1.clone();
    var cannon3 = cannon1.clone();
    
    var cannon_list = [cannon1, cannon2, cannon3];
    
    for(var cannon of cannon_list) {
        cannon.position.y += 2;
        cannon.rotation.x += Math.PI / 2;
        scene.add(cannon);
    }

    cannon_list[1].position.set(10, 0, 0);
    cannon_list[2].position.set(-10, 0, 0);
    return cannon_list;
}

function create_balls() {
    'use strict';

}