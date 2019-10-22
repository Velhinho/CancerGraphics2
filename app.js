var cameras;
var camera_num = 0;
var scene, renderer

var walls;
var cannons = [];
var balls;
var ball_list = new Array();
var is_cannon_shooting = false;
var selected_cannon = -1;
var clock = new THREE.Clock();

function init() {
    'use strict';
    var i;
    var ball;
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    createScene();
    createStationaryCameras();
    
    // Lists with the respective elements

    createMovingCamera();;

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    window.addEventListener("keyup", onKeyUp);
}

function update() {
    'use strict';
}

function animate() {
    'use strict';

    //handle_collisions();
    //var delta = clock.getDelta();
    //update();
    render();
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    handle_collisions();
    if (is_cannon_shooting)
        shoot_ball();
    update_moving_camera();
    ball_movement_handler(delta);
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
    var i;
    var ball;
    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(10));

    create_walls();
    create_cannons();
    for (i = 0; i < 3; i++) {
        ball = create_balls(Math.floor(Math.random() * 10) - 10, 2, Math.floor(Math.random() * 20) - 20 );
        /*for(j=0;j<i;j++){
            another_ball = ball_list[j];
            if(ball.is)
        }*/
    }
}

function createStationaryCameras() {
    'use strict';
    cameras = [];
    cameras[0] = new THREE.OrthographicCamera(window.innerWidth / - 20,
        window.innerWidth / 20,
        window.innerHeight / 20,
        window.innerHeight / - 20,
        1,
        1000);
    cameras[0].position.x = 0;
    cameras[0].position.y = 100;
    cameras[0].position.z = 0;
    cameras[0].lookAt(scene.position);

    cameras[1] = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    cameras[1].position.x = 50;
    cameras[1].position.y = 50;
    cameras[1].position.z = 100;
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
    if (event.key == "w") {
        selected_cannon = 0;
        highlightCannon(selected_cannon);
    }

    if (event.key == "e") {
        selected_cannon = 1;
        highlightCannon(selected_cannon);
    }

    if (event.key == "q") {
        selected_cannon = 2;
        highlightCannon(selected_cannon);
    }

    if (event.key == "ArrowLeft"){
        cannons[selected_cannon].userData.anti_clock_wise = true;
        cannon_rotation();
    }
    if (event.key == "ArrowRight") {
        cannons[selected_cannon].userData.clock_wise = true;
        cannon_rotation();
    }
    if (event.which == 32) {
        is_cannon_shooting = true;
        shoot_ball();
    }
}
function onKeyUp(event){
    'use strict';
    if (event.key == "ArrowLeft") { //left
        cannons[selected_cannon].userData.anti_clock_wise = false;
        //break;
    }
    if (event.key == "ArrowRight") {
        cannons[selected_cannon].userData.clock_wise = false;
        //break;
    }
}

function shoot_ball(){
    is_cannon_shooting = false;
    console.log("here");
    ball = create_balls(cannons[selected_cannon].position.x, 2, cannons[selected_cannon].position.z);
    ball.speed += Math.random()*0.1;
    cannons[selected_cannon].getWorldDirection(ball.movement);
}

function handle_collisions(){
    'use strict';
    var i, j;
    var ball, another_ball;
    var point_of_colision;

    for(i=0; i<ball_list.length;i++){
        ball = ball_list[i];
        if(ball != undefined){
            if (ball.ball_wall_collision()) {
                ball.ball_wall_collision_process();
            }
            for (j = 0; j < ball_list.length; j++) {
                if (i != j)
                    another_ball = ball_list[j];
                    if (ball.ball_ball_collision(another_ball)) {
                        point_of_colision = ball.get_position_from_collision_ball_ball(another_ball);
                        ball.ball_ball_collision_process(another_ball, point_of_colision);
                    }
            }
        }
    }
}

function ball_is_out(ball){
    'use strict';
    if (ball.position.z > 32){
        scene.remove(ball);
        return -1;
    }
    return 0;
}

function ball_rotation_handler(ball){
    'use strict';
    var rotation_speed = 0.1;
    if(ball.speed >0){
        var rect_vec = new THREE.Vector3().copy(ball.movement);
        rect_vec.applyAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2); //vetor perpendicular ao movimento
        ball.rotateOnWorldAxis(rect_vec.normalize(), -rotation_speed);
    }
}

function ball_movement_handler(delta){
    'use strict';
    var i;
    var speed_value_to_reduce = 0.05;
    for(i=0; i<ball_list.length;i++){
        if(ball_list[i].speed >= 0)
            ball_list[i].speed -= speed_value_to_reduce;
        else{
            ball_list[i].speed=0;
            ball_list[i].movement= new THREE.Vector3(0,0,0);
        }
        ball_list[i].position.addScaledVector(ball_list[i].movement, -ball_list[i].speed);
        ball_rotation_handler(ball_list[i]);
        if(ball_is_out(ball_list[i]) == -1){
            ball_list.splice(i,i+1);
        }
    }
}

function create_walls() {
    'use strict';

    var walls_ = new THREE.Object3D();

    create_wall_unit(walls_, -30, 10, 0, 0);
    create_wall_unit(walls_, 30, 10, 0, 0);
    create_wall_unit(walls_, 0, 10, -30, Math.PI/2);

    scene.add(walls_);
}

function create_wall_unit(walls_, x, y, z, pos) {
    'use strict';

    var material = new THREE.MeshBasicMaterial({ color: 0x292929, wireframe: true });
    var geometry = new THREE.CubeGeometry(2, 10, 60);
    var mesh = new THREE.Mesh(geometry, material); 

    mesh.position.set(x, y-10, z);
    mesh.rotation.y = pos;
    walls_.add(mesh);
    scene.add(walls_);

}

function create_cannons() {
    'use strict';
    
    for(var i = 0; i < 3; i++) {
        var geometry = new THREE.CylinderGeometry(4, 2, 15, 15);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true  });

        cannons[i] = new THREE.Mesh(geometry, material);
        cannons[i].userData = {
            "selected": false,
            "clock_wise": false,
            "anti_clock_wise": false
        };
        cannons[i].rotation.x += Math.PI / 2;
        scene.add(cannons[i]);
    }

    cannons[0].position.set(0, 0, 40);
    cannons[1].position.set(10, 0, 40);
    cannons[2].position.set(-10, 0, 40);
}

function highlightCannon(cannonNumber) {
    'use strict';

    for(var i = 0; i < cannons.length; i++) {
        cannons[i].userData.selected = false;
        cannons[i].material.setValues({ color: 0xffff00, wireframe: true });
    }
    cannons[cannonNumber].userData.selected = true;
    cannons[cannonNumber].material.setValues({ color: 0x7FFFD4, wireframe: true });
}

function cannon_rotation(){
    'use strict';

    var rotation_speed = 0.1
    if(cannons[selected_cannon].userData.clock_wise){
        if (cannons[selected_cannon].rotation.z > -Math.PI /2)
            cannons[selected_cannon].rotation.z -= rotation_speed;
    }
    if (cannons[selected_cannon].userData.anti_clock_wise) {
        if (cannons[selected_cannon].rotation.z < Math.PI / 2)
            cannons[selected_cannon].rotation.z += rotation_speed;
    }

}

function create_balls(x,y,z) {
    'use strict';

    var ball = new THREE.Object3D();
    var random_color = new THREE.Color(0xffffff);
    random_color.setHex(Math.random()*0xffffff);
    var geometry = new THREE.SphereGeometry(2, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: random_color, wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);
    ball.raio = 2;
    ball.movement = new THREE.Vector3(Math.random(), 0, Math.random());
    ball.speed = ball.movement.length();
    ball.axis = new THREE.AxesHelper(10);
    ball.add(ball.axis);

    ball.position.set(x,y,z);
    ball_list.push(ball);
    ball.add(mesh);
    scene.add(ball);

    console.log(ball.position);

    ball.ball_ball_collision = function(balls){
        'use strict';

        var distance_for_collision = 4;
        var real_distance = Math.pow(this.position.x - ball.position.x, 2) + Math.pow(this.position.z - ball.position.z, 2);
        if(distance_for_collision >= real_distance && this.position.y == ball.position.y){
            return true;
        }
        else
            return false;
    };

    ball.ball_ball_collision_process = function (ball, point_of_colision) {
        'use strict';

        var next_position = 4 - point_of_colision.length(); //ball diameter
        if(ball != undefined){
            ball.position.addScaledVector(point_of_colision.normalize(), next_position+0.05);

            var point_of_colision_normal = point_of_colision.normalize();

            this.movement.copy(point_of_colision_normal);
            ball.movement.copy(point_of_colision_normal.negate());

            this.speed = ball.speed;
        }
    };


    ball.ball_wall_collision = function(){
        'use strict';

        if(this.position.z <= 31){
            if((this.position.x >= 28 && this.position.x <=32) || (this.position.x <= -28 && this.position.x >= -32)){
                return true
            }
        }
        if(this.position.x <=32 && this.position.x >= -32){
            if(this.position.z <=-28 && this.position.z >= -32){
                return true;
            }
        }
        return false;
    };

    ball.ball_wall_collision_process = function(){
        if (this.position.z <= 32 && this.position.y >= 0 && this.position.z >= -32){
            if((this.position.x >= 28 && this.position.x <=32) || (this.position.x <= -28 && this.position.x >= -32)){
                this.movement.x = -this.movement.x;
            }
        }
        if(this.position.x <= 7.5 && this.position.x >= -7.5 && this.position.y >= 0){
            if (this.position.z <= -28 && this.position.z >= -32){
                this.movement.z = -this.movement.z;
            }
        }
    };

    //finds the point where the 2 balls toutch
    ball.get_position_from_collision_ball_ball= function(ball) {
        var point_of_colision = new THREE.Vector3(0, 0, 0);
        if(ball != undefined){
            point_of_colision.x = ball.position.x - this.position.x;
            point_of_colision.z = ball.position.z - this.position.z;
        }
        return point_of_colision ;
    };

    return ball;

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
    cameras[2].lookAt(ball_list[ball_list.length-1].position);
}

//meio que funciona. Se a bola sair da vista, o gajo continua a segui-la
function update_moving_camera(){ 
    var ball_to_follow = ball_list[ball_list.length-1];
    cameras[2].position.x = ball_to_follow.position.x + 15;
    cameras[2].position.y = ball_to_follow.position.y + 15;
    cameras[2].position.z = ball_to_follow.position.z + 15;
    cameras[2].lookAt(ball_to_follow.position);
}