var socket = io.connect( 'http://localhost:8080' );

var userList = new Array();
var lights = new Array();

for (var i = 0; i < 5; i++) {
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

socket.on('init user', function (data) {
	newUser( data.userid, data.inst, data.initial );
	console.log("new user " + data.inst);
});

socket.on('disconnect', function (data) {
	for (var i = 0; i < userList.length; i++) {
		if ( userList[i].userid == data.userid ) {
			userList.splice(i, 1);
			console.log("The user " + data.userid + " has disconnected.");
		}
	}


	if ( userList.length == 0 ) {
    	numUsers.innerHTML = ''; 
	}
	else if ( userList.length == 1 ) {
    	numUsers.innerHTML = userList.length + ' fellow explorer.' 
	}
	else {
		numUsers.innerHTML = userList.length + ' fellow explorers.' 
	}

	userDisconnect.style.opacity = 0.7;
	exit.play();
});

socket.on('light movement', function (data) {
	updateLights( data.userid, data.lookX, data.lookY, data.camX, data.camY );
});

socket.on('pic movement', function (data) {
	for( var i = 0; i < planeList.length; i++ ) {
		if ( planeList[i].id == data.id ) {
			planeList[i].pic.position.x = data.posX;
			planeList[i].pic.position.y = data.posY;
			planeList[i].pic.rotation.z = data.rot;
		}
	}
});

socket.on('ping', function (data) {
	ping.classList.remove('ping-animation');
	ping.offsetWidth = ping.offsetWidth;
	ping.classList.add('ping-animation');

	var horiz = map_range(data.posX, -1920, 1920, 0, 256);
	var vert = map_range(data.posY, -1200, 1200, 0, 160);

	ping.style.left = horiz + 'px';
	ping.style.top = vert + 'px';

	chime.play();
});

var newUser = function( userid, inst, initial ) {
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

    userConnect.style.opacity = 0.7;

    if ( userList.length == 1 ) {
    	numUsers.innerHTML = userList.length + " fellow explorer." 
	}
	else {
		numUsers.innerHTML = userList.length + " fellow explorers." 
	}

    if (!initial) {
    	enter.play();
	}
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
		var id = data[i]['link'];

		planeList.push( new Plane( plane, vel, acc, id ) );
		scene.add(plane);

		photoLinks.push( data[i] );
		console.log( photoLinks );
	}
}

function Plane( pic, vel, acc, id ) {
	this.pic = pic;
	this.vel = vel;
	this.acc = acc;
	this.id = id;
}

//Simple function to map values (similar to Processing's map() function)
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
