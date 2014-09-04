var THREE = require('three');
var now = require('performance-now');

module.exports = function(app){
	var MASS = 0.1;
	var FICTION = 100; //for simplicity, set FICTION a fixed value at every direction

	var position = new THREE.Vector3(0,0,10);
	var velocity = new THREE.Vector2();
	var force = new THREE.Vector2();

	var calculateTimer, prevTime;

	app.io.on('connection', function(socket){
		console.log('socket link established');
		setInterval(function(){
			socket.emit('calibration', JSON.stringify({
				position: position,
				velocity: velocity,
				force: force
			}));
		}, 1000);

		socket.on('forceChange', function(data){
			try{
				var deltaForce = JSON.parse(data);
				force.x += deltaForce.x;
				force.y += deltaForce.y; 
				app.io.emit('forceChanged', JSON.stringify(force));

				if(calculateTimer){
					clearInterval(calculateTimer);
				}
				//about 30 frames per second
				prevTime = now();
				calculateTimer = setInterval(calculateObjTranslation, 33); 
			}
			catch(e){
				console.log('invalid json caught');
			}
		});
	});

	function calculateObjTranslation(){
		var time = now();
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
		
		position.x += velocity.x * delta;
		position.y += velocity.y * delta;
	
		if(!(force.x || force.y || velocity.x || velocity.y)){
			clearInterval(calculateTimer);
		}	
	}
}