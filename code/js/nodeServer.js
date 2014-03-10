var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );

var app = express();
var server = http.createServer( app );

var io = socket.listen( server );

var clients = [];

io.sockets.on( 'connection', function( client ) {

	client.emit('init', { userid: client.id, users: clients.length});

	for (var i = 0; i < clients.length; i++) {
		client.emit( 'init user', { userid: clients[i].id } );
	}

	clients.push(client);

	client.broadcast.emit( 'entrance', { message: "A new user has joined!", userid: client.id });

	client.on('disconnect', function( data ) {
		for (var i = 0; i < clients.length; i++) {
			if ( client.id === clients[i].id ) {
				clients.splice(i, 1);
			}
		}
		client.broadcast.emit( 'user disconnect', { message: "A user has disconnected", userid: client.id } );
	});

	client.on('movement', function( data ) {
		//console.log( client.id + " - ( " + data.posX + ", " + data.posY + " )");
		client.broadcast.emit( 'movement', { userid: client.id, lookX: data.lookX, lookY: data.lookY, camX: data.camX, camY: data.camY });
	});

});

server.listen( 8080 );

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}