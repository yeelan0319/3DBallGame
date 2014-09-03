KeyControl = function(){		
	var prevTime = performance.now();
	
	var force = THREE.Vector2();
	var velocity = THREE.Vector2();
	
	var key = {
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40
	}
	var MASS = 1;
	var FICTION = 10; //for simplicity, set FICTION a fixed value at every direction
	
	var keyDown = function(event){
		if(event.keyCode === key.LEFT || event.keyCode === key.UP || event.keyCode === key.RIGHT || event.keyCode === key.DOWN){
			var deltaForce = THREE.Vector2();
			switch(event.keyCode){
				case key.LEFT:
					deltaForce.y = 10;
					break;
				case key.UP:
					deltaForce.x = 10;
					break;
				case key.RIGHT:
					deltaForce.y = -10;
					break;
				case key.DOWN:
					deltaForce.x = -10;
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
			var deltaForce = THREE.Vector2();
			switch(event.keyCode){
				case key.LEFT:
					deltaForce.y = -10;
					break;
				case key.UP:
					deltaForce.x = -10;
					break;
				case key.RIGHT:
					deltaForce.y = 10;
					break;
				case key.DOWN:
					deltaForce.x = 10;
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
			clearTimeout(calculateTimer);
		}
		//about 30 frames per second
		calculateTimer = setTimeout(calculateObjTranslation, 33); 
	});	
	
	function calculateObjTranslation(){
		var translation = THREE.Vector2();
		
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
				
		translation.x = velocity.x * delta;
		translation.y = velocity.y * delta;
		
		if(force.x || force.y || velocity.x || velocity.y){
			clearTimeout(calculateTimer);
		}
		return translation;
	}
}