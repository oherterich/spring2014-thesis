var util = require("util"),
	fs = require("fs"),
	connect = require("connect"),
	http = require("http"),
	port = 9000,
	io = require('socket.io'),
	chat_room = io.listen(9001);

connect.createServer( //Call createServer function
	connect.static(__dirname + "/public") //two underscores
	).listen(port);
//util.log is like console.log _ a time stamp (only in node environment)
util.log('the server is running on port: ' + port); //will be printed to the terminal
////we have a server! 

chat_room.sockets.on('connection', function (client) {

	//Let's generate a unique id for each person taht joins.
	client.userid = guid();

	//Send the player their id
	client.emit( "onconnected", { id: client.userid } );

	chat_room.sockets.emit( 'entrance', {message: 'Someone joined!', id: client.userid } );

	//Useful to know when someone connects
	console.log( '\t socket.io:: player ' + client.userid + ' connected' );

	//When this client disconnects
	client.on('disconnect', function() {
		console.log('\t sockiet.io:: client disconnected ' + client.userid );
	});

 	//Listen for any mouse movement, and send that back to all of the pages.
	client.on('mouse', function (data) {
		chat_room.sockets.emit('mouse', { mouseX: data.mouseX, mouseY: data.mouseY, userid: data.userid });
	});

});

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}