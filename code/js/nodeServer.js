var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );

var app = express();
var server = http.createServer( app );

var io = socket.listen( server );

var clients = [];
var rooms = [];

var maxPlayers = 6;

io.sockets.on( 'connection', function( client ) {

	clients.push(client);

	//If we already have a room
	if ( rooms.length > 0 ) {
		//Loop through all of our rooms.
		for ( var i = 0; i < rooms.length; i++ ) {
			//Check to see if they've reached the max number of players.
			if ( io.sockets.clients( rooms[i] ).length >= maxPlayers) {
				//If we're on the last room and it's full, we should create a new one.\
				if ( i == rooms.length-1 ) {
					var roomName = "room" + rooms.length;
					client.join( roomName );
					rooms.push( roomName );
					console.log( "new room!" );	
				}			
			}
			//If we haven't reached the max number of players, join that room.
			else {
				client.join( rooms[i] );
				console.log( rooms[i] + " now has " + io.sockets.clients( rooms[i] ).length + " players!" );
				
				for (var i = 0; i < io.sockets.clients( rooms[i] ).length; i++) {
					client.emit( 'init user', { userid: io.sockets.clients( rooms[i] )[0].id } );
				}

				//socket.broadcast.to( rooms[i] ).emit( 'init user', { userid: io.sockets.clients( rooms[i] )[0].id } );
			}
		}
	}
	//If we don't have a room yet, create one.
	else {
		var roomName = "room" + rooms.length;
		client.join( roomName );
		rooms.push( roomName );
		console.log("first room!");
	}

	// client.emit('init', { userid: client.id, users: clients.length});

	// for (var i = 0; i < clients.length; i++) {
	// 	client.emit( 'init user', { userid: clients[i].id } );
	// }

	// clients.push(client);

	// client.broadcast.emit( 'entrance', { message: "A new user has joined!", userid: client.id });

	// client.on('disconnect', function( data ) {
	// 	for (var i = 0; i < clients.length; i++) {
	// 		if ( client.id === clients[i].id ) {
	// 			clients.splice(i, 1);
	// 		}
	// 	}
	// 	client.broadcast.emit( 'user disconnect', { message: "A user has disconnected", userid: client.id } );
	// });

	// client.on('movement', function( data ) {
	// 	//console.log( client.id + " - ( " + data.posX + ", " + data.posY + " )");
	// 	client.broadcast.emit( 'movement', { userid: client.id, lookX: data.lookX, lookY: data.lookY, camX: data.camX, camY: data.camY });
	// });

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