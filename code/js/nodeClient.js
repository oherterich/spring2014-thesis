var socket = io.connect( 'http://localhost:8080' );

var userList = new Array();


var lights = new Array();

for (var i = 0; i < 6; i++) {
	spotlight = new THREE.SpotLight(0xE8E0BE, 1.0, 10000.0, Math.PI/4, 10.0);
	spotlight.castShadow = true;
	spotlight.intensity = 0.0;
	scene.add( spotlight );

	lights.push( spotlight );	
}

var looks = new Array();

var test = document.getElementById("test");

var User = function( posX, posY, userid ) {
	this.posX = posX;
	this.posY = posY;
	this.userid = userid;

	this.light = lights[userList.length];
	this.light.intensity = 1.0;

	var lookG = new THREE.Geometry(100, 100, 10, 10);
	var lookT = new THREE.MeshLambertMaterial({ color: 0xFF0000, transparent: true });
	look = new THREE.Mesh(lookG, lookT);
	this.look = look;
	scene.add( this.look );
}

socket.on("entrance", function (data) {
	newUser( data.userid );
	console.log( data.message );
});

socket.on('init', function (data) {
	//newUser( data.userid );
	console.log(data.userid);
	console.log(data.users);
});

socket.on('init user', function (data) {
	newUser( data.userid );
	console.log(userList.length);
});

socket.on('user disconnect', function (data) {
	for (var i = 0; i < userList.length; i++) {
		if ( userList[i].userid == data.userid ) {
			var element = document.getElementById("test").childNodes[i];
			element.parentNode.removeChild(element);
			userList.splice(i, 1);
			console.log("The user " + data.userid + " has disconnected.");
		}
	}
});

socket.on('movement', function (data) {
	//console.log( data.userid + " - " + data.lookX + " | " + data.lookY + " ... " + data.camX + " | " + data.camY);
	updateLights( data.userid, data.lookX, data.lookY, data.camX, data.camY );
});

var newUser = function( userid ) {
	var user = new User( 0, 0, userid );
	console.log(user);
	userList.push( user );
}

var updateLights = function( userid, lookX, lookY, camX, camY ) {
	for (var i = 0; i < userList.length; i++) {
		if ( userid == userList[i].userid ) {
			userList[i].look.position.set(lookX, lookY, 0);

			userList[i].light.position.set( camX, camY, 1200);
			userList[i].light.target = userList[i].look;
		}
	}
}
