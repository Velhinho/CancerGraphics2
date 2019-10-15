/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var base;
var arm;
var target;
var carrinho;

var toggle_wireframe = false;
var keys_pressed = {
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53
};
var current_camera = 0;


function Vector(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.add_to_vector = function (vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }

    this.normalize = function () {
        let vector_size = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);

        if (vector_size != 0) {
            this.x /= (vector_size * 10);
            this.y /= (vector_size * 10);
            this.z /= (vector_size * 10);
        }
    }
}

function onKeyDown(event) {
    switch(event.keyCode) {
        case keys_pressed["1"]:
            current_camera = 1;
            break;
        case keys_pressed["2"]:
            current_camera = 2;
            break;
        case keys_pressed["3"]:
            current_camera = 3;
            break;
        case keys_pressed["4"]:
            toggle_wireframe = true;
            break;
        case keys_pressed["5"]:
            current_camera = 4;
            break;
    }
}

function onKeyUp(event) {

}

function Carrinho(x, y, z) {

    this.object = new THREE.Group;

    this.object.add(base.object);
    this.object.add(arm.object);

    this.object.position.set(x, y, z);

    this.toggle_wireframe = function() {
        base.toggle_wireframe();
        arm.toggle_wireframe();
    }

    scene.add(this.object);
}

function Base(x,y,z) {

    this.object = new THREE.Object3D();

    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    this.object.position.set(x, y, z);

    this.toggle_wireframe = function () {
        this.material.wireframe = !this.material.wireframe;
    }

    this.addBaseBalls = function (base, x, y, z) {

        let geometry = new THREE.SphereGeometry(2, 20, 60);

        let mesh = new THREE.Mesh(geometry, base.material);

        mesh.position.set(x, y - 2, z);

        base.object.add(mesh);

    };

    this.addBaseTop = function (base, x, y, z) {

        let geometry = new THREE.CubeGeometry(60, 2, 20);

        let mesh = new THREE.Mesh(geometry, base.material);

        mesh.position.set(x, y, z);

        base.object.add(mesh);

    };

    this.addRolling = function (base, x, y, z) {

        let geometry = new THREE.SphereGeometry(5, 12, 12, 0, 2 * Math.PI, 0, 0.5 * Math.PI);

        let mesh = new THREE.Mesh(geometry, base.material);

        mesh.position.set(x, y, z);

        base.object.add(mesh);
    }

    this.addBaseBalls(this, 25, -1, -8);
    this.addBaseBalls(this, -25, -1, -8);
    this.addBaseBalls(this, 25, -1, 8);
    this.addBaseBalls(this, -25, -1, 8);
    this.addRolling(this, 0, 1, 0);
    this.addBaseTop(this, 0, 0 ,0);
    scene.add(this.object);
}

function Arm(x,y,z){

    this.object = new THREE.Object3D();

    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    this.object.position.set(x, y, z);

    this.toggle_wireframe = function () {
        this.material.wireframe = !this.material.wireframe;
    }

    this.addFirstArm = function(arm, x,y,z){

        let geometry = new THREE.CubeGeometry(3, 20, 3);

        let mesh = new THREE.Mesh(geometry, arm.material);

        mesh.position.set(x,y,z);

        arm.object.add(mesh);
    }

    this.addSecondArm = function (arm, x, y, z) {

        let geometry = new THREE.CubeGeometry(3, 3, 20);

        let mesh = new THREE.Mesh(geometry, arm.material);

        mesh.position.set(x, y, z);

        arm.object.add(mesh);
    }

    this.addSphere = function (arm, x, y, z) {

        let geometry = new THREE.SphereGeometry(2, 20, 60);

        let mesh = new THREE.Mesh(geometry, arm.material);

        mesh.position.set(x, y, z);

        arm.object.add(mesh);
    }

    this.addHandV = function (arm, x, y, z){

        let geometry = new THREE.CubeGeometry(1,1,3);

        let mesh = new THREE.Mesh(geometry, arm.material);

        mesh.position.set(x, y, z);

        arm.object.add(mesh);

    }

    this.addHandH = function (arm, x, y, z) {

        let geometry = new THREE.CubeGeometry(3, 1, 1);

        let mesh = new THREE.Mesh(geometry, arm.material);

        mesh.position.set(x, y, z);

        arm.object.add(mesh);

    }

    this.addSecondArm(this, 0, 10, 10);
    this.addFirstArm(this, 0,0,0);
    this.addSphere(this, 0, 10 ,0);
    this.addSphere(this, 0, 10, 20);
    this.addHandV(this, -1, 10, 23);
    this.addHandV(this, 1, 10, 23);
    this.addHandH(this, 0, 10, 23);
    scene.add(this.object);
}

function Target(x,y,z){

    this.object = new THREE.Object3D();

    this.material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

    this.object.position.set(x, y, z);

    this.addTorus = function (target, x, y, z) {

        let geometry = new THREE.TorusGeometry(1.5, 0.5, 20, 60);

        let mesh = new THREE.Mesh(geometry, target.material);

        mesh.position.set(x, y, z);

        target.object.add(mesh);

    }

    this.addTower = function (target, x, y, z) {

        let geometry = new THREE.CubeGeometry(5, 10, 5);

        let mesh = new THREE.Mesh(geometry, target.material);

        mesh.position.set(x, y, z);

        target.object.add(mesh);

    }

    this.addTower(this, 10,2,20);
    this.addTorus(this, 10, 8, 20);
    scene.add(this.object);

}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));
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

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

    base = new Base(0, 0, 0);
    arm = new Arm(0,10,0);
    target = new Target(0,0,0);
    carrinho = new Carrinho(0, 0, 0);

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function update() {

    switch(current_camera) {
        case 1:
            camera.position.x = 0;
            camera.position.y = 60;
            camera.position.z = 0;
            onResize();
            camera.lookAt(scene.position);
            break;
        case 2:
            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = 60;
            onResize();
            camera.lookAt(scene.position);
            break;
        case 3:
            camera.position.x = 60;
            camera.position.y = 0;
            camera.position.z = 0;
            onResize();
            camera.lookAt(scene.position);
            break;
        case 4:
            camera.position.x = 20;
            camera.position.y = 20;
            camera.position.z = 20;
            onResize();
            camera.lookAt(scene.position);
        default: break;       
    }

    if(toggle_wireframe) {
        base.material.wireframe = !base.material.wireframe;
        arm.material.wireframe = !arm.material.wireframe;
        target.material.wireframe = !target.material.wireframe;
        toggle_wireframe = false;     
    }
}

function animate() {
    'use strict';

    update();
    render();
    requestAnimationFrame(animate);
}