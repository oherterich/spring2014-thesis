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

socket.emit('inst_id', { inst: url.split('?')[1] });

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
	newUser( data.userid, data.inst );
	//console.log("new user " + data.userid);
	console.log("new user " + data.inst);
	//console.log(userList.length);
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
	updateLights( data.userid, data.lookX, data.lookY, data.camX, data.camY );
});

var newUser = function( userid, inst ) {
	var user = new User( 0, 0, userid );
	console.log(user);
	userList.push( user );

	$.ajax({ 
        type: "GET",   
        url: "php/getNewUserPhotos.php",   
        async: false,
        dataType: "text",
        data: inst,
        success : function(links)
         {
            response = links;
            newPhotoLinks = jQuery.parseJSON(response);
            newPhotos( newPhotoLinks );
         }
    });
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

var newPhotos = function( data ) {
	for (var i = 0; i < data.length; i++) {
		var x = data[i]['posX'] * 1;
		var y = data[i]['posY'] * 1;
		var z = data[i]['posZ'] * 1;
		var rot = data[i]['rot'] * 1;

		var planeGeo = new THREE.PlaneGeometry(imageSize, imageSize, 10, 10);
		var texture = THREE.ImageUtils.loadTexture("instagram_img/" + data[i]['link'] + ".jpg");
		var rand2 = Math.floor(Math.random() * 5);
		var rough = THREE.ImageUtils.loadTexture("img/texture_" + rand2 + ".jpg");
		var material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: rough, bumpScale: 5 });

		var plane = new THREE.Mesh(planeGeo, material);

		plane.position.x = x;
		plane.position.y = y;
		plane.position.z = z;
		plane.rotation.z = rot;

		var vel = new THREE.Vector3( 0, 0, 0 );
		var acc = new THREE.Vector3( 0, 0, 0 );

		//console.log(planeList);
		planeList.push( new Plane( plane, vel, acc ) );
		scene.add(plane);
	}
}

function Plane( pic, vel, acc ) {
	this.pic = pic;
	this.vel = vel;
	this.acc = acc;
}
