 function KeyControl(sphere){		
	var prevTime = performance.now();
	
	var force = new THREE.Vector2();
	var velocity = new THREE.Vector2();
	
	var key = {
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		leftPressed: false,
		upPressed: false,
		rightPressed: false,
		downPressed: false
	}
	var calculateTimer;

	var MASS = 0.1;
	var FICTION = 100; //for simplicity, set FICTION a fixed value at every direction
	var CAMERAPOS = new THREE.Vector3(0,-40,50);
	
	function keyDown(event){
		if(event.keyCode === key.LEFT || event.keyCode === key.UP || event.keyCode === key.RIGHT || event.keyCode === key.DOWN){
			var deltaForce = new THREE.Vector2();
			switch(event.keyCode){
				case key.LEFT:
					if(!key.leftPressed){
						key.leftPressed = true;
						deltaForce.x = -100;
					}
					else{
						return;
					}
					break;
				case key.UP:
					if(!key.upPressed){
						key.upPressed = true;
						deltaForce.y = 100;
					}
					else{
						return;
					}
					break;
				case key.RIGHT:
					if(!key.rightPressed){
						key.rightPressed = true;
						deltaForce.x = 100;
					}
					else{
						return;
					}
					break;
				case key.DOWN:
					if(!key.downPressed){
						key.downPressed = true;
						deltaForce.y = -100;
					}
					else{
						return;
					}
					break;
			}
			socket.emit('forceChange', JSON.stringify(deltaForce));
		}
	}
	
	function keyUp(event){
		if(event.keyCode === key.LEFT || event.keyCode === key.UP || event.keyCode === key.RIGHT || event.keyCode === key.DOWN){
			var deltaForce = new THREE.Vector2();
			switch(event.keyCode){
				case key.LEFT:
					key.leftPressed = false;
					deltaForce.x = 100;
					break;
				case key.UP:
					key.upPressed = false;
					deltaForce.y = -100;
					break;
				case key.RIGHT:
					key.rightPressed = false;
					deltaForce.x = -100;
					break;
				case key.DOWN:
					key.downPressed = false;
					deltaForce.y = 100;
					break;
			}
			socket.emit('forceChange', JSON.stringify(deltaForce));
		}
	}
	
	$(document).bind('keydown', keyDown);
	$(document).bind('keyup', keyUp);
	
	socket.on('forceChanged', function(data){
		data = JSON.parse(data);
		force.x = data.x;
		force.y = data.y;
		if(calculateTimer){
			clearInterval(calculateTimer);
		}
		//about 30 frames per second
		prevTime = performance.now();
		calculateTimer = setInterval(calculateObjTranslation, 33); 
	});
	socket.on('calibration', function(data){
		data = JSON.parse(data);
		force.x = data.force.x;
		force.y = data.force.y;
		sphere.position.set(data.position.x, data.position.y, data.position.z);
		velocity.x = data.velocity.x;
		velocity.y = data.velocity.y;
		camera.position.set(sphere.position.x + CAMERAPOS.x, sphere.position.y + CAMERAPOS.y, sphere.position.z + CAMERAPOS.z);
		camera.lookAt(sphere.position);
	});	
	
	function calculateObjTranslation(){
		var time = performance.now();
		var delta = (time - prevTime) / 1000;
		prevTime = time;
		
		if(velocity.x){
			velocity.x =  Math.max(0, velocity.x - FICTION / MASS * delta);
		}
		if(velocity.y){
			velocity.y = Math.max(0, velocity.y - FICTION / MASS * delta);
		}
		velocity.x += force.x / MASS * delta;
		velocity.y += force.y / MASS * delta;
				
		sphere.translateX( velocity.x * delta );
		sphere.translateY( velocity.y * delta );
		if(sphere.position.x > PLANEWIDTH/2 - SPHERERADIUS){
			sphere.position.x = PLANEWIDTH/2 - SPHERERADIUS;
			velocity.x = 0;
		}
		if(sphere.position.x < -PLANEWIDTH/2 + SPHERERADIUS){
			sphere.position.x = -PLANEWIDTH/2 + SPHERERADIUS;
			velocity.x = 0;
		}
		if(sphere.position.y > PLANELENGTH/2 - SPHERERADIUS){
			sphere.position.y = PLANELENGTH/2 - SPHERERADIUS;
			velocity.y = 0;
		}
		if(sphere.position.y < -PLANELENGTH/2 + SPHERERADIUS){
			sphere.position.y = -PLANELENGTH/2 + SPHERERADIUS;
			velocity.y = 0;
		}
		camera.position.set(sphere.position.x + CAMERAPOS.x, sphere.position.y + CAMERAPOS.y, sphere.position.z + CAMERAPOS.z);
		camera.lookAt(sphere.position); 
	
		if(!(force.x || force.y || velocity.x || velocity.y)){
			clearInterval(calculateTimer);
		}		
	}
}