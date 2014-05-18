var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );

var app = express();
var server = http.createServer( app );

var io = socket.listen( server );

var clients = [];
var rooms = [];

var maxPlayers = 6;
var roomNum = 0;

io.sockets.on( 'connection', function( client ) {

	clients.push(client);

	client.on( 'inst_id', function( data ) {
		client.inst = data.inst;
		console.log (client.inst);

		joinRoom( client );
	});

	client.on('light movement', function( data ) {
		client.broadcast.to( client.room ).emit( 'light movement', { userid: client.id, lookX: data.lookX, lookY: data.lookY, camX: data.camX, camY: data.camY });
	});

	client.on('pic movement', function( data ) {
		client.broadcast.to( client.room ).emit( 'pic movement', { id: data.id, posX: data.posX, posY: data.posY, rot: data.rot } );
	});

	client.on('selected photo', function( data ) {
		client.broadcast.to( client.room ).emit( 'ping', { posX: data.posX, posY: data.posY });
	});

	client.on('disconnect', function() {
		console.log( 'user ' + client.id + ' has disconnected');
		client.broadcast.to( client.room ).emit( 'disconnect', { userid: client.id } ); 
	});

});

server.listen( 8080 );

function joinRoom( client ) {
	//If we already have a room
	if ( rooms.length > 0 ) {
		//Loop through all of our rooms.
		for ( var i = 0; i < rooms.length; i++ ) {
			//Check to see if they've reached the max number of players.
			if ( io.sockets.clients( rooms[i] ).length >= maxPlayers) {
				//If we're on the last room and it's full, we should create a new one.\
				if ( i == rooms.length-1 ) {
					var roomName = "room" + roomNum;
					roomNum++;
					client.join( roomName );
					client.room = roomName;
					rooms.push( roomName );
					console.log( "new room!" );	
				}			
			}
			//If we haven't reached the max number of players, join that room.
			else {
				//Tell our newly joined player who is in the room.
				//We do this before joining the room so that we don't send a message about ourselves.
				for (var j = 0; j < io.sockets.clients( rooms[i] ).length; j++) {
					client.emit( 'init user', { userid: io.sockets.clients( rooms[i] )[j].id, inst: io.sockets.clients( rooms[i] )[j].inst, initial: true  } );
				}

				//Join the room
				client.join( rooms[i] );
				client.room = roomName;
				console.log( rooms[i] + " now has " + io.sockets.clients( rooms[i] ).length + " players!" );

				//Tell everyone else that someone has joined.
				client.broadcast.to( rooms[i] ).emit( 'init user', { userid: client.id, inst: client.inst, initial: false } );
			}
		}
	}
	//If we don't have a room yet, create one.
	else {
		roomNum = 0;
		var roomName = "room" + roomNum;
		roomNum++;
		client.join( roomName );
		client.room = roomName;
		rooms.push( roomName );
		console.log("first room!");
	}
}