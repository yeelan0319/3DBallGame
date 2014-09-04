KeyControl = function(sphere){		
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
	
	var keyDown = function(event){
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
			//send request to server
			var event = $.Event('serverReq');
			event.deltaForce = deltaForce;
			$(document).trigger(event);
		}
	}
	
	var keyUp = function(event){
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
			//send request to server
			var event = $.Event('serverReq');
			event.deltaForce = deltaForce;
			$(document).trigger(event);
		}
	}
	
	$(document).bind('keydown', keyDown);
	$(document).bind('keyup', keyUp);
	
	//should be a server logic
	$(document).bind('serverReq', function(event){
		force.x += event.deltaForce.x;
		force.y += event.deltaForce.y;
		
		$(document).trigger($.Event('forceChanged'));
	});
	//should be listen by socket event
	$(document).bind('forceChanged', function(event){
		//the event should actually receive from server response
		//should update current force
		if(calculateTimer){
			clearInterval(calculateTimer);
		}
		//about 30 frames per second
		prevTime = performance.now();
		i = 0;
		calculateTimer = setInterval(calculateObjTranslation, 33); 
	});	
	
	function calculateObjTranslation(){
		var translation = new THREE.Vector2();
		
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
	
		if(!(force.x || force.y || velocity.x || velocity.y)){
			clearInterval(calculateTimer);
		}		
	}
}