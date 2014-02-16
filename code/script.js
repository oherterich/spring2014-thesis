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

//Determine boundary percentage for moving camera
var boundaryPct = 0.25;

//Max speed for camera pan
var panMaxSpeed = 10;

//Variables for mouse coordinates
var mouse = new THREE.Vector2()

//Variable to keep track of if the mouse is down
var mouseDown = 0;
var mouseDownCount = 0;

//This variable keeps track of which photo has been selected
//We need this in order to move, rotate, and get the meta information for that photo.
var selectedImage = -1;
var selectedImagePos = new THREE.Vector3();
selectedImagePos.set(0,0,0);

// CAMERA / MOUSE PROJECTION STUFF for moving spotlight
var ray = new THREE.Ray();
var projector = new THREE.Projector();
var directionVector = new THREE.Vector3();
 
var SCREEN_HEIGHT = window.innerHeight;
var SCREEN_WIDTH = window.innerWidth;

var moveInfo = {
  x: 0,
  y: 0,
};

//Variables for picking
var INTERSECTED;
var pickMouse = new THREE.Vector2();
var pickProjector = new THREE.Projector();
var pickRaycaster = new THREE.Raycaster();

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

//Variables for controlling speed of camera movement in x,y direction
var camSpeedX = 0.0;
var camSpeedY = 0.0;

//  var controls = new THREE.TrackballControls( camera, renderer.domElement );

// controls.rotateSpeed = 1.0;
// controls.zoomSpeed = 1.2;
// controls.panSpeed = 0.8;

// controls.noZoom = true;
// controls.noPan = true;
// controls.noRotate = true;

// controls.staticMoving = true;
// controls.dynamicDampingFactor = 0.3;

// controls.keys = [ 65, 83, 68 ];

// controls.addEventListener( 'change', render );

//Create a scene
var scene = new THREE.Scene();

//Light for state 0
var light = new THREE.SpotLight(0xE8E0BE, 1.0, 5000.0, Math.PI/8, 75.0); //smaller
//var light = new THREE.SpotLight(0xE8E0BE, 1.0, 10000.0, Math.PI/4, 10.0); //bigger
scene.add(light);

//Light for state 1
var clickedLight = new THREE.SpotLight(0xE8E0BE, 0.0, 10000.0, Math.PI/6, 18.0);
scene.add(clickedLight);

//Big light to illuminate space (for testing purposes)
var hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 1.0);
//scene.add(hemiLight);

//Add something for the light to look at
var lookAtThisGeom = new THREE.Geometry(100, 100, 10, 10);
var lookAtThisText = new THREE.MeshLambertMaterial({ color: 0xFF0000, transparent: true });
var lookAtThis = new THREE.Mesh(lookAtThisGeom, lookAtThisText);
scene.add(lookAtThis);

//enable shadows on the renderer
renderer.shadowMapEnabled = true;

//enable shadows for a light
light.castShadow = true;

//Create plane for meta data
var metaPlaneGeo = new THREE.PlaneGeometry( imageSize, imageSize, 10, 10);
var metaPlaneText = THREE.ImageUtils.loadTexture("instagram_img/paper-back.jpg");
var metaPlaneBump = THREE.ImageUtils.loadTexture("instagram_img/paper-back-bump.jpg");
var metaPlaneMat = new THREE.MeshPhongMaterial( { map: metaPlaneText, bumpMap: metaPlaneBump, bumpScale: 1 } );
var metaPlane = new THREE.Mesh( metaPlaneGeo, metaPlaneMat );
metaPlane.rotation.y = Math.PI;
scene.add(metaPlane);


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

for (var i = 0; i < photoLinks.length; i++) {
	var x = Math.random() * 2000 - 1000;
	var y = Math.random() * 2000 - 1000;
	var z = Math.random() * 10;

	var rot = Math.random() * (Math.PI / 2) - (Math.PI/4);
	//var w = Math.random() * 10;

	var planeGeo = new THREE.PlaneGeometry(imageSize, imageSize, 10, 10);
	var planeMat = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
	
	//var	rand = Math.floor(Math.random() * photoLinks.length);
	//var rand = getRandomInt(photoLinks.length-18, photoLinks.length);
	var texture = THREE.ImageUtils.loadTexture("instagram_img/" + photoLinks[i]['link'] + ".jpg");
	var rand2 = Math.floor(Math.random() * 5);
	var rough = THREE.ImageUtils.loadTexture("instagram_img/texture_" + rand2 + ".jpg");
	var material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: rough, bumpScale: 5 });

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
	var texture = THREE.ImageUtils.loadTexture("instagram_img/" + photoLinks[rand]['link'] + ".jpg");
	var rand2 = Math.floor(Math.random() * 5);
	var rough = THREE.ImageUtils.loadTexture("instagram_img/texture_" + rand2 + ".jpg");
	var material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: rough, bumpScale: 5 });

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

	if (prevMouseX != moveInfo.x || prevMouseY != moveInfo.y) {
  		prevMouseX = moveInfo.x;
  		prevMouseY = moveInfo.y;
  	
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


/***************************************************************************************************************/
/***************************************************************************************************************/
/************************************************EVENT LISTENERS************************************************/
/***************************************************************************************************************/
/***************************************************************************************************************/

document.body.addEventListener('mousemove', function (evt) {
  moveInfo.x = evt.clientX;
  moveInfo.y = evt.clientY;

  mouse.x = evt.clientX;
  mouse.y = evt.clientY;

  pickMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pickMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  if (evt.clientX > w - w * boundaryPct || evt.clientX < w * boundaryPct || evt.clientY > h - h * boundaryPct || evt.clientY < h * boundaryPct) {
  	moveCamera(evt.clientX, evt.clientY);
  }
  else {
  	camSpeedX = 0.0;
  	camSpeedY = 0.0;
  }

}, false);

//Listen for key presses
window.addEventListener('keypress', function (evt) {
	
}, false);

//Listen for clicks
window.addEventListener('click', function (evt) {
	//If we're in the exploration state, we want to check whether or not the user has clicked a photo.
	if (state == 0) {
		if (mouseDownCount < 5) {
			checkPicClick( INTERSECTED.id );
		}
	}
	else if (state == 1) {
		manageSelectedPhotoClick( evt.clientX, evt.clientY );
	}
}, false);

document.addEventListener("mousedown", function (evt) {
  ++mouseDown;
  mouseDownCount = 0;

  if (state == 0) {
  	pickImage();
  	//setSelectedImage();
  }
}, false);

document.addEventListener("mouseup", function (evt) {
  --mouseDown;
}, false);

/***************************************************************************************************************/
/***************************************************************************************************************/
/***********************************************MAIN FUNCTIONS**************************************************/
/***************************************************************************************************************/
/***************************************************************************************************************/


function checkPicClick( id ) {
	for (var i = 0; i < planeList.length; i++) {

		// var d = lineLength(planeList[i].position.x, planeList[i].position.y, lookAtThis.position.x, lookAtThis.position.y);

		// if (d < imageSize / 2) {

		if ( planeList[i].id == id) {
			//If we have a match, make that image our "selected" image
			selectedImage = i;
			selectedImagePos.set(planeList[i].position.x, planeList[i].position.y, planeList[i].position.z);

			//Set the position of the plane so that it's right in front of the camera
			planeList[i].position.set(camera.position.x, camera.position.y, camera.position.z - 800);
			planeList[i].rotation.set(0,0,0);

			//Let's also set the position of the meta plane so that we can see it later.
			metaPlane.position.set(camera.position.x, camera.position.y, camera.position.z - 800);

			//Instead of removing original light, turn down intensity to 0. 
			//This removes the need to update the material later.
			light.intensity = 0.0;

			//Add the new light to illuminate selected photo.
			//scene.add(clickedLight);
			clickedLight.intensity = 1.0;
			clickedLight.position.set(camera.position.x, camera.position.y, 1000);
			clickedLight.target = lookAtThis;

			//In order to render the new light, we must update the material
			planeList[i].material.needsUpdate = true;

			//Change to the looking at image state.
			state = 1; 
		}
	//	}
	}
}

function manageSelectedPhotoClick(x, y) {

	if (x < w/2 - imageSize / 2 || x > w/2 + imageSize / 2 || y < h/2 - imageSize / 2 || y > h/2 + imageSize / 2) {
		state = 0;

		//Reset rotations
		metaPlane.rotation.y = Math.PI;

		//Reset light intensities back to normal.
		light.intensity = 1.0;
		clickedLight.intensity = 0.0;	

		//Set plane back to original position and rotation
		planeList[selectedImage].position.set(selectedImagePos.x, selectedImagePos.y, selectedImagePos.z);
		planeList[selectedImage].rotation.set(0, 0, Math.random() * (Math.PI / 2) - (Math.PI/4));

		//Set selectedImage back to a non-number
		selectImage = -1; 
	}
}

//This function lets us move around the scene when we hover on the edges of the screen.
function moveCamera(x, y) {
	var disX = Math.abs(w / 2 - x);
	var disY = Math.abs(h / 2 - y);

	if (x < w * boundaryPct) {
		camSpeedX = map_range(disX, w * boundaryPct, w/2, 0, -panMaxSpeed);
	}
	else if (x > w - w * boundaryPct) {
		camSpeedX = map_range(disX, w * boundaryPct, w/2, 0, panMaxSpeed);
	}
	
	if (y < h * boundaryPct) {
		camSpeedY = map_range(disY, h * boundaryPct, h/2, 0, panMaxSpeed);
	}
	else if (y > h - h * boundaryPct) {
		camSpeedY = map_range(disY, h * boundaryPct, h/2, 0, -panMaxSpeed);
	}

	console.log(camSpeedX + " | " + camSpeedY);
	//console.log(disX + " | " + disY);
}


function setProjection() {
	// The following will translate the mouse coordinates into a number
	// ranging from -1 to 1, where
	//      x == -1 && y == -1 means top-left, and
	//      x ==  1 && y ==  1 means bottom right
	var x = ( moveInfo.x / SCREEN_WIDTH ) * SCREEN_WIDTH / 2 - 1;
	var y = -( moveInfo.y / SCREEN_HEIGHT ) * SCREEN_HEIGHT / 2 + 1;

	// Now we set our direction vector to those initial values
	directionVector.set(x, y, 0.5);

	projector.unprojectVector( directionVector, camera );
}

//This function allows us to select images without picking the ones underneath
function pickImage() {
	// find intersections
	var vector = new THREE.Vector3( pickMouse.x, pickMouse.y, 1 );
	pickProjector.unprojectVector( vector, camera );

	pickRaycaster.set( camera.position, vector.sub( camera.position ).normalize() );

	//var intersects = pickRaycaster.intersectObjects( scene.children );
	var intersects = pickRaycaster.intersectObjects( planeList );

	if ( intersects.length > 0 ) {

		//if ( INTERSECTED != intersects[ 0 ].object ) {
			if ( INTERSECTED ) {
				//INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			}

			INTERSECTED = intersects[ 0 ].object;
			//INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			//INTERSECTED.material.emissive.setHex( 0xff0000 );

		//}

	} else {

		//if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

		INTERSECTED = null;

	}
}

function slideImages() {
	if (INTERSECTED != null) {
		for (var i = 0; i < planeList.length; i++) {
			if (planeList[i].id == INTERSECTED.id) {

				planeList[i].position.x = lookAtThis.position.x;
				planeList[i].position.y = lookAtThis.position.y;
			}
		}
	}
}

function setSelectedImage() {
	for (var i = 0; i < planeList.length; i++) {
		if ( planeList[i].id == INTERSECTED.id) {
			selectedImage = i;
			selectedImagePos.set(planeList[i].position.x, planeList[i].position.y, planeList[i].position.z);
		}
	}
}

/***************************************************************************************************************/
/***************************************************************************************************************/
/********************************************ANIMATION FUNCTIONS************************************************/
/***************************************************************************************************************/
/***************************************************************************************************************/

function rotateImage( direction ) {
	//If direction is equal to zero, rotate in a negative direction
	if (direction == 0) {
		if (planeList[selectedImage].rotation.y >= -Math.PI) {
			planeList[selectedImage].rotation.y -= 0.3;
			metaPlane.rotation.y -= 0.3;
		}
	}

	//If direction is equal to one, rotate in a positive direction
	else if (direction == 1) {
		if (planeList[selectedImage].rotation.y <= Math.PI) {
			planeList[selectedImage].rotation.y += 0.3;
			metaPlane.rotation.y += 0.3;
		}
	}

	else if (direction == 2) {
		if ( planeList[selectedImage].rotation.y < 0) {
			 planeList[selectedImage].rotation.y += 0.3;
			 metaPlane.rotation.y += 0.3;
		}
	}

	else if (direction == 3) {
		if ( planeList[selectedImage].rotation.y > 0 ) {
			planeList[selectedImage].rotation.y -= 0.3;
			metaPlane.rotation.y -= 0.3;
		}	
	}

	else if (direction == 4) {
		planeList[selectedImage].rotation.y = 0;
		metaPlane.rotation.y = Math.PI;
	}
}



/***************************************************************************************************************/
/***************************************************************************************************************/
/***********************************************HELPER FUNCTIONS************************************************/
/***************************************************************************************************************/
/***************************************************************************************************************/

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

//Simple function to map values (similar to Processing's map() function)
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function animate(t) {

	if (camera.position.z < 1000) {
		camera.position.z = 1000;
	}
	if (camera.position.z > 4500) {
		camera.position.z = 4500;
	}

	/***************************************************************************************/
	/***************************************STATE ZERO**************************************/
	/***************************************************************************************/
	if (state == 0) {

		// if (prevCamX != camera.position.x || prevCamY != camera.position.y) {
		// 	prevCamX = camera.position.x;
		// 	prevCamY = camera.position.y;
		// 	prevCamZ = camera.position.z;

		// 	planeAmountScale = map_range(camera.position.z, 1000, 4500, 1, 10);

		// 	for (var i = 0; i < planeAmountScale; i++) {
		// 		addPlane();	
		// 	}
			
		// 	checkPlaneDistance();
		// }

		camera.position.x += camSpeedX;
		camera.position.y += camSpeedY;

		var angle = map_range(camera.position.z, 1000, 4500, Math.PI/8, Math.PI/40);
		var exponent = map_range(camera.position.z, 1000, 4500, 75.0, 500.0);
		light.angle = angle;
		light.exponent = exponent;

		backgroundTexture.position.x = camera.position.x;
		backgroundTexture.position.y = camera.position.y;

		light.position.set( camera.position.x, camera.position.y, camera.position.z );
		light.target = lookAtThis;

		//controls.update();

		setProjection();

		if (mouseDown) {
			slideImages();
			mouseDownCount++;
		}

		lightOffsetX = map_range(moveInfo.x, 0, w, -120, -570);
		lightOffsetY = map_range(moveInfo.y, 0, h, 80, -200);

		lookAtThis.position.x = directionVector.x - SCREEN_WIDTH / 2 + lightOffsetX;
		lookAtThis.position.y = directionVector.y + SCREEN_HEIGHT / 2 + lightOffsetY;
		lookAtThis.position.z = directionVector.z - 1000;
	}

	/***************************************************************************************/
	/***************************************STATE ONE***************************************/
	/***************************************************************************************/
	else if (state == 1) {
		lookAtThis.position.set(camera.position.x, camera.position.y, camera.position.z - 1000);

		//Check to see if we need to rotate the image plane
		if ( mouse.x < w / 2 - imageSize / 3) {
			rotateImage(0);
		}
		else if ( mouse.x > w / 2 + imageSize / 3) {
			rotateImage(1);
		}
		else if ( mouse.x < w / 2) {
			rotateImage(2);
		}
		else if ( mouse.x > w / 2 ) {
			rotateImage(3);
		}
		else {
			rotateImage(4);
		}
	}

	window.requestAnimationFrame(animate, renderer.domElement);
	render();

};

function render() {
	    renderer.autoClear = false;
        renderer.clear();
		renderer.render( scene, camera );
	}

animate(new Date().getTime());

}