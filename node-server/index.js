var socketio = require('socket.io');
var express = require('express');

var app = {};
var http;

var Server = function(){
	function serverInit(){
		app.io = socketio();
		app.express = express();

		app.express.use(express.static(__dirname + '/../public'));
		(require('./ioArbiter'))(app);

		http = require('http').Server(app.express);
		app.io.attach(http);
	}

	function portStartListening(){
		http.listen(80, function(err){
			console.log("http listening on port: 80");
		});
	}

	this.start = function(){
		serverInit();
		portStartListening();
	}
}

var server = new Server();
server.start();