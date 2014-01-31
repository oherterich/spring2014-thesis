//**********************INSTAGRAM STUFF********************************

var photos = [];

window.onload = function() { //THIS FUNCTION WRAPS AROUND THE REST OF THE CODE. REMEMBER THIS.

//*********************************************************************

var w = window.innerWidth,
	h = window.innerHeight;

//Determines which overall state the application is in.
//0: regular exploration state with spotlight
//1: user has clicked a certain photo
var state = 0;

//Determines size of images (planes)
var imageSize = 500;

//Set up renderer
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);

renderer.setClearColorHex(0x020202, 1.0);
renderer.clear();

//Add the renderer to the page
document.body.appendChild(renderer.domElement);

//Variables for camera
var  FOV = 45,
	ASPECT = w/h,
	NEAR = 1,
	FAR = 50000;


// new THREE.PerspectiveCamera( FOV, viewAspectRatio, zNear, zFar );
var camera = new THREE.PerspectiveCamera( FOV, ASPECT, NEAR, FAR);
camera.position.z = 1200;
camera.position.y = 0;
camera.position.x = 0;


var prevCamX = camera.position.x;
var prevCamY = camera.position.y;
var prevCamZ = camera.position.z;

var controls = new THREE.TrackballControls( camera, renderer.domElement );

controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;

controls.noZoom = false;
controls.noPan = false;
controls.noRotate = true;

controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

controls.keys = [ 65, 83, 68 ];

controls.addEventListener( 'change', render );

//Create a scene
var scene = new THREE.Scene();

//Light for state 0
var light = new THREE.SpotLight(0xE8E0BE, 1.0, 5000.0, Math.PI/8, 75.0); //smaller
//var light = new THREE.SpotLight(0xE8E0BE, 1.0, 10000.0, Math.PI/4, 10.0); //bigger

//Light for state 1
var clickedLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 1.0);


//Big light to illuminate space (for testing purposes)
var hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 1.0);
//scene.add(hemiLight);


scene.add(light);

// var ambientLight = new THREE.AmbientLight(0xFFFFFF);
// scene.add(ambientLight);

//enable shadows on the renderer
renderer.shadowMapEnabled = true;

//enable shadows for a light
light.castShadow = true;


//INITIALIZE VARIABLES
var planeGenerateScale = 350;
var planeRemoveScale = 1000;
var planeAmountScale = 1;
var lightOffsetX = -120;
var lightOffsetY = -120;
var changeTextureScale = 1200;
var prevMouseX = 0;
var prevMouseY = 0;


// INITIALIZE GROUND PLANES
var planeList = [];

for (var i = 0; i < 30; i++) {
	var x = Math.random() * 2000 - 1000;
	var y = Math.random() * 2000 - 1000;
	var z = Math.random() * 10;

	var rot = Math.random() * (Math.PI / 2) - (Math.PI/4);
	//var w = Math.random() * 10;

	var planeGeo = new THREE.PlaneGeometry(imageSize, imageSize, 10, 10);
	var planeMat = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
	
	//var	rand = Math.floor(Math.random() * photoLinks.length);
	var rand = getRandomInt(photoLinks.length-18, photoLinks.length);
	var texture = THREE.ImageUtils.loadTexture("instagram_img/" + photoLinks[rand] + ".jpg");
	var rand2 = Math.floor(Math.random() * 5);
	var rough = THREE.ImageUtils.loadTexture("instagram_img/texture_" + rand2 + ".jpg");
	var material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: rough, bumpScale: 15 });

	// var c = new THREE.Color( 0xFFFFFF );
	// c.setRGB( Math.random(), Math.random(), Math.random() );
	// var material = new THREE.MeshLambertMaterial({ color: c });

	var plane = new THREE.Mesh(planeGeo, material);

	plane.position.x = x;
	plane.position.y = y;
	plane.position.z = z;

	plane.rotation.z = rot;

	planeList.push( plane );
}

for (var i = 0; i < planeList.length; i++) {
	scene.add(planeList[i]);
}


//CREATE INITIAL BACKGROUND TEXTURE PLANE
var planeGeo = new THREE.PlaneGeometry(7280,3700,10,10);
var texture = THREE.ImageUtils.loadTexture("instagram_img/background_texture_large.jpg");
var planeMat = new THREE.MeshPhongMaterial({ map: texture });
var backgroundTexture = new THREE.Mesh(planeGeo, planeMat);
backgroundTexture.position.z = -1;
scene.add( backgroundTexture );


//This function adds a plane to the scene based where the camera and mouse is located.
function addPlane() {

	planeGenerateScale = map_range(camera.position.z, 1000, 4500, 500, 2000);

	var x = lookAtThis.position.x;
	var y = lookAtThis.position.y;

	while (lineLength(lookAtThis.position.x, lookAtThis.position.y, x, y) < planeGenerateScale) {

		x = camera.position.x + Math.cos(Math.random() * Math.PI * 2) * planeGenerateScale;
		y = camera.position.y + Math.sin(Math.random() * Math.PI * 2) * planeGenerateScale;

	}

	var z = Math.random() * 10;

	var rot = Math.random() * (Math.PI / 2) - (Math.PI/4);

	var planeGeo = new THREE.PlaneGeometry(imageSize, imageSize, 10, 10);
	var planeMat = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
	
	var rand = Math.floor(Math.random() * photoLinks.length);
	var texture = THREE.ImageUtils.loadTexture("instagram_img/" + photoLinks[rand] + ".jpg");
	var rand2 = Math.floor(Math.random() * 5);
	var rough = THREE.ImageUtils.loadTexture("instagram_img/texture_" + rand2 + ".jpg");
	var material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: rough, bumpScale: 15 });

	// var c = new THREE.Color( 0xFFFFFF );
	// c.setRGB( Math.random(), Math.random(), Math.random() );
	// var material = new THREE.MeshLambertMaterial({ color: c });

	var plane = new THREE.Mesh(planeGeo, material);

	plane.position.x = x;
	plane.position.y = y;
	plane.position.z = z;

	plane.rotation.z = rot;

	planeList.push( plane );
	scene.add( planeList[planeList.length - 1])
}

//This function is used to remove planes that are too far away to see, removing unnecessary rendering.
function checkPlaneDistance() {
	planeRemoveScale = map_range(camera.position.z, 1000, 4500, 1000, 3000);

	for (var i = 0; i < planeList.length; i++) {
		var d = lineLength(planeList[i].position.x, planeList[i].position.y, camera.position.x, camera.position.y);
		if (d > planeRemoveScale) {
			scene.remove( planeList[i] );
			planeList.splice(i,1);
		}
	}
}

//This function will change the texture of a plane when the mouse is moved away.
function changeTexture() {

	if (prevMouseX != clickInfo.x || prevMouseY != clickInfo.y) {
  		prevMouseX = clickInfo.x;
  		prevMouseY = clickInfo.y;
  	
		changeTextureScale = map_range(camera.position.z, 1000, 4500, 1200, 1400);
		for (var i = 0; i < planeList.length; i++) {
			var d = lineLength(planeList[i].position.x, planeList[i].position.y, lookAtThis.position.x, lookAtThis.position.y);
			if (d < changeTextureScale && d > changeTextureScale / 2) {
				// planeList[i].material.color.r = Math.random();
				// planeList[i].material.color.g = Math.random();
				// planeList[i].material.color.b = Math.random();

				var rand = Math.floor(Math.random() * 31);
				var texture = THREE.ImageUtils.loadTexture("img/instagram_" + rand + ".jpg");
				planeList[i].material.map = texture;

				//console.log(lookAtThis.position.x + " " + lookAtThis.position.y + " " + lookAtThis.position.z);
			}
		}
	}
	window.setTimeout(changeTexture, 2000);
}

//window.setTimeout(changeTexture, 2000);


//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/math/line-length [rev. #1]
//DISTANCE FUNCTION
lineLength = function(x, y, x0, y0){
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
};


/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 * From Mozilla Developer Center
 */
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



// CAMERA / MOUSE PROJECTION STUFF
var ray = new THREE.Ray();
var projector = new THREE.Projector();
var directionVector = new THREE.Vector3();
 
var SCREEN_HEIGHT = window.innerHeight;
var SCREEN_WIDTH = window.innerWidth;

var clickInfo = {
  x: 0,
  y: 0,
};

document.body.addEventListener('mousemove', function (evt) {
  // The user has clicked; let's note this event
  // and the click's coordinates so that we can
  // react to it in the render loop
  clickInfo.x = evt.clientX;
  clickInfo.y = evt.clientY;

  //changeTexture();

}, false);

//Listen for key presses
window.addEventListener('keypress', function (e) {
	
}, false);

//Listen for clicks
window.addEventListener('click', function (e) {
	//console.log(lookAtThis.position.x + " " + lookAtThis.position.y);
	checkPicClick();
}, false);


function checkPicClick() {
	for (var i = 0; i < planeList.length; i++) {
		//console.log(planeList[i].position.x + " | " + planeList[i].position.y);

		var d = lineLength(planeList[i].position.x, planeList[i].position.y, lookAtThis.position.x, lookAtThis.position.y);
		
		if (d < imageSize / 2) {
			console.log(i);
			planeList[i].position.set(0, 0, camera.position.z - 800);
			planeList[i].rotation.set(0,0,0);

			//scene.remove(light);
			scene.add(clickedLight);
		}
	}
}


function setProjection() {
	// The following will translate the mouse coordinates into a number
	// ranging from -1 to 1, where
	//      x == -1 && y == -1 means top-left, and
	//      x ==  1 && y ==  1 means bottom right
	var x = ( clickInfo.x / SCREEN_WIDTH ) * SCREEN_WIDTH / 2 - 1;
	var y = -( clickInfo.y / SCREEN_HEIGHT ) * SCREEN_HEIGHT / 2 + 1;

	// Now we set our direction vector to those initial values
	directionVector.set(x, y, 0.5);

	projector.unprojectVector( directionVector, camera );
}

//Simple function to map values (similar to Processing's map() function)
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


//Add something for the light to look at
var lookAtThisGeom = new THREE.Geometry(100, 100, 10, 10);
var lookAtThisText = new THREE.MeshLambertMaterial({ color: 0xFF0000, transparent: true });
var lookAtThis = new THREE.Mesh(lookAtThisGeom, lookAtThisText);
scene.add(lookAtThis);

function animate(t) {

	//renderer automatically clears unless autoClear = false

	// 	var vector = new THREE.Vector3( 0, 0, -1 );
	// 	vector = vector * camera.position;
	// vector.applyQuaternion( camera.quaternion );

	if (camera.position.z < 1000) {
		camera.position.z = 1000;
	}
	if (camera.position.z > 4500) {
		camera.position.z = 4500;
	}


	if (prevCamX != camera.position.x || prevCamY != camera.position.y) {
		prevCamX = camera.position.x;
		prevCamY = camera.position.y;
		prevCamZ = camera.position.z;

		planeAmountScale = map_range(camera.position.z, 1000, 4500, 1, 10);

		for (var i = 0; i < planeAmountScale; i++) {
			addPlane();	
		}
		
		checkPlaneDistance();
	}

		//	console.log(camera.position.x + " " + prevCamX + " | " + camera.position.y + " " + prevCamY);

	var angle = map_range(camera.position.z, 1000, 4500, Math.PI/8, Math.PI/40);
	var exponent = map_range(camera.position.z, 1000, 4500, 75.0, 500.0);
	light.angle = angle;
	light.exponent = exponent;

	backgroundTexture.position.x = camera.position.x;
	backgroundTexture.position.y = camera.position.y;

	light.position.set( camera.position.x, camera.position.y, camera.position.z );
	light.target = lookAtThis;

	window.requestAnimationFrame(animate, renderer.domElement);

	controls.update();

	setProjection();

	lightOffsetX = map_range(clickInfo.x, 0, w, -120, -570);
	lightOffsetY = map_range(clickInfo.y, 0, h, 80, -200);

	lookAtThis.position.x = directionVector.x - SCREEN_WIDTH / 2 + lightOffsetX;
	lookAtThis.position.y = directionVector.y + SCREEN_HEIGHT / 2 + lightOffsetY;
	lookAtThis.position.z = directionVector.z - 1000;

	render();

};

function render() {
	    renderer.autoClear = false;
        renderer.clear();
		//renderer.render(bgScene, bgCam);
		renderer.render( scene, camera );
	}

animate(new Date().getTime());

}