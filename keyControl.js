KeyControl = function(){
	var scope = this;
		
	var prevTime = performance.now();
	var force = THREE.Vector2();
	var velocity = THREE.Vector2();
	
	var key = {
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40
	}
	
	var keyDown = function(event){
		switch(event.keyCode){
			case key.LEFT:
				force.y += 10;
				break;
			case key.UP:
				force.x += 10;
				break;
			case key.RIGHT:
				force.y -= 10;
				break;
			case key.DOWN:
				force.x -= 10;
				break;
		}
		if(event.keyCode === key.LEFT || event.keyCode === key.UP || event.keyCode === key.RIGHT || event.keyCode === key.DOWN){
			//send request to server
			var event = $.Event('grid.update');
			event.kind = 'filter';
			event.tagSelected = "";
			event.isHidden = isHiddenSelected;
			$(document).trigger(event);

		}
	}
	
	var keyUp = function(event){
		switch(event.keyCode){
			case key.LEFT:
				force.y -= 10;
				break;
			case key.UP:
				force.x -= 10;
				break;
			case key.RIGHT:
				force.y += 10;
				break;
			case key.DOWN:
				force.x += 10;
				break;
		}
	}
	
	
}