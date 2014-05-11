	
//*********************************************************************
var planeList = []; //main array that holds all of our pictures/planes

var w = window.innerWidth,
	h = window.innerHeight;

//Determines which overall state the application is in.
//0: regular exploration state with spotlight
//1: user has clicked a certain photo
var state = 0;

//Determines size of images (planes)
var imageSize = 500;
var maxZDepth = 30.0;

//Determine boundary percentage for moving camera
var boundaryPct = 0.25;
var outerBoundary = (imageSize*3) / 4;

//Boundary for edges of world
var horizBoundary = 1920;
var vertBoundary = 1200;

//Vectors for the minimum and maximum edges of the world. Used for clamping light and camera.
var boundaryMinVec = new THREE.Vector3( -1920, -1200, 0 );
var boundaryMaxVec = new THREE.Vector3( 1920, 1200, 0 );
var camMinVec = new THREE.Vector3( -1920 + w/2, -1200 + h/2, 1200);
var camMaxVec = new THREE.Vector3( 1920 - w/2, 1200 - h/2, 12500);

//Variable that controls the small rectangle in the HUD;
var HUD = document.getElementById("HUD");
var lightHUDSize = 45.0; //the size of the HUD_light.png file (px)
var bMap = true;

//Max speed for camera pan
var panMaxSpeed = 20;

//Variables for mouse coordinates
var mouse = new THREE.Vector2()

//Variable to keep track of if the mouse is down
var mouseDown = 0;
var mouseDownCount = 0;

//Boolean to keep track of whether we have turned the photo over or not.
var bIsFront = true;

//Boolean to keep track of whether our textbox is active or not
var bTextboxActive = false;

//We need to know if we have ever displayed the instructions before.
var bFirstTimeScrollInstruction = true;
var bFirstTimeClickInstruction = true;

//Stuff for animating plane, light, etc.
var moveSpeed = 0.35;
var bMoveToFront = false;
var putBackRotation = Math.random() * (Math.PI / 2) - (Math.PI/4);
var bFadeLight = false;
var bRotatePic = false;
var rotateSpeed = 0.3;
var whichRotate = -1;
var damping = new THREE.Vector3( 0.55, 0.55, 0.55);
var maxSpeed = new THREE.Vector3(10.0, 10.0, 0);

//Keep track of if we're dragging or rotation or not doing anything. -1 is nothing, 0 is drag, 1 is rotate
var dragState = -1;

//Keep track of our scrolling/zooming.
var bIsScrolling = false;

//Booleans to allow us to drag around our HUD
var bHUDActive = false;
var bHUDDraggable = false;

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
var container = document.getElementById("container");
container.appendChild(renderer.domElement);

//For stats/frame rate
// var stats = new Stats();
// 	stats.domElement.style.position = 'absolute';
// 	stats.domElement.style.top = '0px';
// 	container.appendChild( stats.domElement );

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

//Create a scene
var scene = new THREE.Scene();

//Light for state 0
//var light = new THREE.SpotLight(0xE8E0BE, 1.0, 5000.0, Math.PI/8, 75.0); //smaller
var light = new THREE.SpotLight(0xE8E0BE, 1.0, 10000.0, Math.PI/6, 40.0); //bigger
scene.add(light);

//Light for state 1
var clickedLight = new THREE.SpotLight(0xE8E0BE, 0.0, 10000.0, Math.PI/4, 15.0);
scene.add(clickedLight);

//Big light to illuminate space (for testing purposes)
var hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.135);
scene.add(hemiLight);

//Add something for the light to look at
var lookAtThisGeom = new THREE.Geometry(100, 100, 10, 10);
var lookAtThisText = new THREE.MeshLambertMaterial({ color: 0xFF0000, transparent: true });
var lookAtThis = new THREE.Mesh(lookAtThisGeom, lookAtThisText);
scene.add(lookAtThis);

var prevLookAtThis = new THREE.Vector3();

/***************************************************************************************/
/********************************META DATA + PLANE STUFF********************************/
/***************************************************************************************/
//Create plane for meta data
var metaPlaneGeo = new THREE.PlaneGeometry( imageSize, imageSize, 10, 10);
var metaPlaneTexture = THREE.ImageUtils.loadTexture("img/paper-back.jpg");
var metaPlaneBump = THREE.ImageUtils.loadTexture("img/paper-back-bump.jpg");
var metaPlaneMat = new THREE.MeshPhongMaterial( { map: metaPlaneTexture, bumpMap: metaPlaneBump, bumpScale: 1 } );
var metaPlane = new THREE.Mesh( metaPlaneGeo, metaPlaneMat );
metaPlane.rotation.y = Math.PI;
scene.add(metaPlane);

//CREATE NAME PLANE + CANVAS ELEMENT
var metaDataText_name = "Hello, World!";
var metaCanvas_name = document.createElement('canvas');
metaCanvas_name.width = 500;
metaCanvas_name.height = 500;
var metaContext_name = metaCanvas_name.getContext('2d');
metaContext_name.font = "36px Font";
metaContext_name.fillStyle = "rgba(40,40,40,0.9)";
metaContext_name.fillText(metaDataText_name, 0, 50);

var metaDataTexture_name = new THREE.Texture(metaCanvas_name);
metaDataTexture_name.needsUpdate = true;

var metaDataMat_name = new THREE.MeshPhongMaterial( { map: metaDataTexture_name } );
metaDataMat_name.transparent = true;

var metaData_name = new THREE.Mesh(
	new THREE.PlaneGeometry(metaCanvas_name.width, metaCanvas_name.height),
	metaDataMat_name
	);
metaData_name.position.set(0,0,10);
metaData_name.rotation.y = Math.PI;
scene.add( metaData_name );

//CREATE DATE PLANE + CANVAS ELEMENT
var metaDataText_date = "Hello, World!";
var metaCanvas_date = document.createElement('canvas');
metaCanvas_date.width = 500;
metaCanvas_date.height = 500;
var metaContext_date = metaCanvas_date.getContext('2d');
metaContext_date.font = "24px Font";
metaContext_date.fillStyle = "rgba(40,40,40,0.9)";
metaContext_date.fillText(metaDataText_date, 0, 50);

var metaDataTexture_date = new THREE.Texture(metaCanvas_date);
metaDataTexture_date.needsUpdate = true;

var metaDataMat_date = new THREE.MeshPhongMaterial( { map: metaDataTexture_date } );
metaDataMat_date.transparent = true;

var metaData_date = new THREE.Mesh(
	new THREE.PlaneGeometry(metaCanvas_date.width, metaCanvas_date.height),
	metaDataMat_date
	);
metaData_date.position.set(0,0,10);
metaData_date.rotation.y = Math.PI;
scene.add( metaData_date );

//CREATE CAPTION PLANE + CANVAS ELEMENT
var metaDataText_caption = "Hello, World!";
var metaCanvas_caption = document.createElement('canvas');
metaCanvas_caption.width = 500;
metaCanvas_caption.height = 500;
var metaContext_caption = metaCanvas_caption.getContext('2d');
metaContext_caption.font = "28px Font";
metaContext_caption.fillStyle = "rgba(40,40,40,0.9)";
metaContext_caption.fillText(metaDataText_caption, 0, 50);

var metaDataTexture_caption = new THREE.Texture(metaCanvas_caption);
metaDataTexture_caption.needsUpdate = true;

var metaDataMat_caption = new THREE.MeshPhongMaterial( { map: metaDataTexture_caption } );
metaDataMat_caption.transparent = true;

var metaData_caption = new THREE.Mesh(
	new THREE.PlaneGeometry(metaCanvas_caption.width, metaCanvas_caption.height),
	metaDataMat_caption
	);
metaData_caption.position.set(0,0,10);
metaData_caption.rotation.y = Math.PI;
scene.add( metaData_caption );

/***************************************************************************************/
window.onload = function() { //THIS FUNCTION WRAPS AROUND THE REST OF THE CODE. REMEMBER THIS.


//INITIALIZE VARIABLES
var planeGenerateScale = 350;
var planeRemoveScale = 1000;
var planeAmountScale = 1;
var changeTextureScale = 1200;
var prevMouseX = 0;
var prevMouseY = 0;


function Plane( pic, vel, acc, id ) {
	this.pic = pic;
	this.vel = vel;
	this.acc = acc;
	this.id = id;
}

// INITIALIZE GROUND PLANES
for (var i = 0; i < photoLinks.length; i++) {
	
	var x = photoLinks[i]['posX'] * 1;
	var y = photoLinks[i]['posY'] * 1;
	var z = photoLinks[i]['posZ'] * 1;
	var rot = photoLinks[i]['rot'] * 1;

	var planeGeo = new THREE.PlaneGeometry(imageSize, imageSize, 1, 1);

	if ( i < 40 ) {
		var photourl = "default_img/" + photoLinks[i]['link'] + ".jpg";
	}
	else {
		var photourl = "instagram_img/" + photoLinks[i]['link'] + ".jpg";
	}

	var request;
	if(window.XMLHttpRequest)
		request = new XMLHttpRequest();
	else
		request = new ActiveXObject("Microsoft.XMLHTTP");
		request.open('GET', photourl, false);
		request.send(); // there will be a 'pause' here until the response to come.
		// the object request will be actually modified
	if (request.status != 404) {
		var texture = THREE.ImageUtils.loadTexture(photourl);
		var material = new THREE.MeshPhongMaterial({ map: texture });
		var plane = new THREE.Mesh(planeGeo, material);

		plane.position.x = x;
		plane.position.y = y;
		plane.position.z = z;

		plane.rotation.z = rot;

		var vel = new THREE.Vector3( 0, 0, 0 );
		var acc = new THREE.Vector3( 0, 0, 0 );
		var id = photoLinks[i]['link'];

		planeList.push( new Plane( plane, vel, acc, id ) );
		scene.add(plane);
	}

 //    var texture = THREE.ImageUtils.loadTexture(photourl);
	// var material = new THREE.MeshPhongMaterial({ map: texture });
	// var plane = new THREE.Mesh(planeGeo, material);

	// plane.position.x = x;
	// plane.position.y = y;
	// plane.position.z = z;

	// plane.rotation.z = rot;

	// var vel = new THREE.Vector3( 0, 0, 0 );
	// var acc = new THREE.Vector3( 0, 0, 0 );
	// var id = photoLinks[i]['link'];

	// planeList.push( new Plane( plane, vel, acc, id ) );
	// scene.add(plane);

}

//CREATE INITIAL BACKGROUND TEXTURE PLANE
var planeGeo = new THREE.PlaneGeometry(4800,3000,10,10);
var texture = THREE.ImageUtils.loadTexture("img/background_texture_1920.jpg");
var planeMat = new THREE.MeshPhongMaterial({ map: texture });
var backgroundTexture = new THREE.Mesh(planeGeo, planeMat);
backgroundTexture.position.z = -1;
scene.add( backgroundTexture );

//This function is used to remove planes that are too far away to see, removing unnecessary rendering.
function checkPlaneDistance() {
	planeRemoveScale = map_range(camera.position.z, 1000, 4500, 1000, 3000);

	for (var i = 0; i < planeList.length; i++) {
		var d = lineLength(planeList[i].pic.position.x, planeList[i].pic.position.y, camera.position.x, camera.position.y);
		if (d > planeRemoveScale) {
			scene.remove( planeList[i].pic );
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
			var d = lineLength(planeList[i].pic.position.x, planeList[i].pic.position.y, lookAtThis.position.x, lookAtThis.position.y);
			if (d < changeTextureScale && d > changeTextureScale / 2) {
				// planeList[i].pic.material.color.r = Math.random();
				// planeList[i].pic.material.color.g = Math.random();
				// planeList[i].pic.material.color.b = Math.random();

				var rand = Math.floor(Math.random() * 31);
				var texture = THREE.ImageUtils.loadTexture("img/instagram_" + rand + ".jpg");
				planeList[i].pic.material.map = texture;
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

	evt.preventDefault();

	moveInfo.x = evt.clientX;
  	moveInfo.y = evt.clientY;

 	mouse.x = evt.clientX;
  	mouse.y = evt.clientY;

	pickMouse.x = ( evt.clientX / window.innerWidth ) * 2 - 1;
	pickMouse.y = - ( evt.clientY / window.innerHeight ) * 2 + 1;

	if (mouseDown < 1) {
	  if (evt.clientX > w - w * boundaryPct || evt.clientX < w * boundaryPct || evt.clientY > h - h * boundaryPct || evt.clientY < h * boundaryPct) {
	  	moveCamera(evt.clientX, evt.clientY);
	  }
	  else {
	  	camSpeedX = 0.0;
	  	camSpeedY = 0.0;
	  }
	}

	if (instruction[0].style.opacity > 0.0) {
		instruction[0].style.opacity -= 0.01;
		if (instruction[0].style.opacity <= 0.01){
			instruction[0].style.opacity = 0;
			removeInstruction(0);
			if (bFirstTimeClickInstruction) {
				addInstruction(1);
			}
		}
	}
}, false);

//Listen for key presses
window.addEventListener('keypress', function (evt) {
	if (evt.keyCode == 77 || evt.keyCode == 109) {
		bMap = !bMap;
	}
}, false);

//Listen for clicks
container.addEventListener('click', function (evt) {
	evt.preventDefault();
	//If we're in the exploration state, we want to check whether or not the user has clicked a photo.
	if (state == 0) {
		if (mouseDownCount < 10) {
			checkPicClick( INTERSECTED.id );
			removeInstruction(0);
			removeInstruction(1);
			bFirstTimeClickInstruction = false;
		}
	}
	else if (state == 1) {
		manageSelectedPhotoClick( evt.clientX, evt.clientY );


	}
}, false);

container.addEventListener("mousedown", function (evt) {
	evt.preventDefault();

  ++mouseDown;
  mouseDownCount = 0;

  if (state == 0) {
  	pickImage();
  }
}, false);

container.addEventListener("mouseup", function (evt) {
	evt.preventDefault();

	--mouseDown;
	mouseDown = 0;
	
	//Reset some of our drag things when we release the mouse
	dragState = -1;
	addAutoCursor();
  	
  	//Set the draggable to false, just in case the user has moved outside of the original HUD
	bHUDDraggable = false;
}, false);

window.addEventListener("mouseup", function (evt) {
	mouseDown = 0;
});

container.addEventListener('mousewheel', function (evt) {
	bIsScrolling = true;

	if (state == 0) {
		var zoom = map_range( evt.wheelDeltaY, -500, 500, -50, 50);
		camera.position.z += zoom;


		if (instruction[2].style.opacity > 0.0) {
			instruction[2].style.opacity -= 0.03;
			if (instruction[2].style.opacity <= 0.01){
				instruction[2].style.opacity = 0;
				removeInstruction(2);
			}
		}

	}

	console.log( lookAtThis.position.x + " | " + lookAtThis.position.y + " | " + lookAtThis.position.z );
});

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

/***************************************************************************************************************/
/***************************************************************************************************************/
/***********************************************MAIN FUNCTIONS**************************************************/
/***************************************************************************************************************/
/***************************************************************************************************************/


function checkPicClick( id ) {
	for (var i = 0; i < planeList.length; i++) {
		if ( planeList[i].pic.id == id) {
			//If we have a match, make that image our "selected" image
			selectedImage = i;
			selectedImagePos.set(planeList[i].pic.position.x, planeList[i].pic.position.y, planeList[i].pic.position.z);

			//Set the position of the plane so that it's right in front of the camera
			//planeList[i].pic.position.set(camera.position.x, camera.position.y, camera.position.z - 800);
			//planeList[i].pic.rotation.set(0,0,0);

			bMoveToFront = true;

			//Let's also set the position of the meta plane so that we can see it later.
			//We don't need to animate this, as it's invisible.
			metaPlane.position.set(camera.position.x, camera.position.y, camera.position.z - 800);

			//Set the position of the text on the back on the photo
			metaData_name.position.set(camera.position.x, camera.position.y, camera.position.z - 799.9);
			metaData_date.position.set(camera.position.x, camera.position.y, camera.position.z - 799.9);
			metaData_caption.position.set(camera.position.x, camera.position.y, camera.position.z - 799.9);

			//Instead of removing original light, turn down intensity to 0. 
			//This removes the need to update the material later.
			//light.intensity = 0.0;
			bFadeLight = true;

			//Add the new light to illuminate selected photo.
			//scene.add(clickedLight);
			//clickedLight.intensity = 1.0;
			clickedLight.position.set(camera.position.x, camera.position.y, camera.position.z - 200);
			clickedLight.target = lookAtThis;

			//In order to render the new light, we must update the material
			planeList[i].pic.material.needsUpdate = true;

			//Change to the looking at image state.
			state = 1;

			//Solution to clearing canvas found at: 
			//http://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing
			//Set the text for the meta data to the correct stuff.
			metaDataText_name = photoLinks[selectedImage]['name']; //Set the text to the selected name
			metaContext_name.save(); //We need to clear the canvas properly, so we do some crazy stuff.
			metaContext_name.setTransform(1,0,0,1,0,0); //Reset the transformation matrix
			metaContext_name.clearRect(0, 0, metaCanvas_name.width, metaCanvas_name.height); //Clear it!!!!!!
			metaContext_name.restore(); //Let's get it back
			metaContext_name.font = Math.floor(Math.random()*4) + 24 + "px Font";
			metaContext_name.fillText(metaDataText_name, 30, 80); //Change the fill text to our new text
			metaDataTexture_name.needsUpdate = true; //Update dat texture

			metaDataText_date = photoLinks[selectedImage]['time']; //Set the text to the selected name
			metaContext_date.save(); //We need to clear the canvas properly, so we do some crazy stuff.
			metaContext_date.setTransform(1,0,0,1,0,0); //Reset the transformation matrix
			metaContext_date.clearRect(0, 0, metaCanvas_date.width, metaCanvas_date.height); //Clear it!!!!!!
			metaContext_date.restore(); //Let's get it back
			metaContext_name.font = Math.floor(Math.random()*2) + 16 + "px Font";
			metaContext_date.fillText(metaDataText_date, 30, 50); //Change the fill text to our new text
			metaDataTexture_date.needsUpdate = true; //Update dat texture

			metaDataText_caption = photoLinks[selectedImage]['caption']; //Set the text to the selected name
			if (metaDataText_caption == "n" || metaDataText_caption == "" || metaDataText_caption == " ") { //We need this because blank captions are set to say "n" by default
				metaDataText_caption = ". . .";
			}

			//We want to take out the hashtags in our captions because they are obnoxious and jarring.
			var noHashTags = metaDataText_caption.split(" ");
			for ( var s = 0; s < noHashTags.length; s++ ) {
				if ( noHashTags[s][0] == "#" ) {
					noHashTags.splice(s, 1); //If there's a hashtag at the start of the word, remove that word.
					s--;
				}
				else {
					noHashTags[s] = noHashTags[s] + " "; //If the word is ok, add a space at the end.
				}
			}
			metaDataText_caption = noHashTags.join(""); //Put the string back together.


			var metrics = metaContext_caption.measureText(metaDataText_caption);
			var width = metrics.width;
			metaContext_caption.save(); //We need to clear the canvas properly, so we do some crazy stuff.
			metaContext_caption.setTransform(1,0,0,1,0,0); //Reset the transformation matrix
			metaContext_caption.clearRect(0, 0, metaCanvas_caption.width, metaCanvas_caption.height); //Clear it!!!!!!
			metaContext_caption.restore(); //Let's get it back
			metaContext_caption.font = Math.floor(Math.random()*4) + 22 + "px Font";
			metaContext_caption.textAlign = 'center';
			metaContext_caption.globalCompositeOperation = 'multiply';
			wrapText(metaContext_caption, metaDataText_caption, imageSize/2, imageSize/2, 400, 32 );
			metaDataTexture_caption.needsUpdate = true; //Update dat texture



			//We're also going to send a signal to the other users that you've picked up the photo.
	        posX = planeList[selectedImage].pic.position.x;
	        posY = planeList[selectedImage].pic.position.y;

	        socket.emit( 'selected photo', { posX: posX, posY: posY } );

	        pickPaper.play();
		}
	}
}

function manageSelectedPhotoClick(x, y) {

	//Turn image on right
	if (x > w / 2 + imageSize / 3 && x < w / 2 + outerBoundary) {
		turnPaper.play();

		if (bIsFront) {
			//rotateImage(1);

			bRotatePic = true;
			whichRotate = 0;

			bIsFront = false;
		}

		else {
			//rotateImage(0);

			bRotatePic = true;
			whichRotate = 1;

			bIsFront = true;
		}

		return;
	}

	//Turn image on left
	else if (x < w / 2 - imageSize / 3 && x > w / 2 - outerBoundary) {
		turnPaper.play();

		if (bIsFront) {
			//rotateImage(1);

			bRotatePic = true;
			whichRotate = 2;

			bIsFront = false;
		}

		else {
			//rotateImage(0);

			bRotatePic = true;
			whichRotate = 3;

			bIsFront = true;
		}

		return;
	}

	//Put image down.
	else {
		state = 0;

		dropPaper.play();

		//Reset rotations
		metaPlane.rotation.y = Math.PI;
		metaData_name.rotation.y = Math.PI;
		metaData_date.rotation.y = Math.PI;
		metaData_caption.rotation.y = Math.PI;


		//Reset light intensities back to normal.
		//light.intensity = 1.0;
		//clickedLight.intensity = 0.0;	
		bFadeLight = true;

		//Set plane back to original position and rotation
		//planeList[selectedImage].pic.position.set(selectedImagePos.x, selectedImagePos.y, selectedImagePos.z);
		//planeList[selectedImage].pic.rotation.set(0, 0, Math.random() * (Math.PI / 2) - (Math.PI/4));
		planeList[selectedImage].pic.rotation.x = 0;
		planeList[selectedImage].pic.rotation.y = 0;
		bMoveToFront = true;
		putBackRotation = Math.random() * (Math.PI / 2) - (Math.PI/4);
		maxZDepth += 1.0;

		//Set selectedImage back to a non-number
		//selectedImage = -1; 

		//Set our boolean to its "front" state, because when we first click it always faces front.
		bIsFront = true;

		if (bFirstTimeScrollInstruction) {
			addInstruction(2);
			bFirstTimeScrollInstruction = false;
		}
	}
}

//This function lets us move around the scene when we hover on the edges of the screen.
function moveCamera(x, y) {
	var disX = Math.abs(w / 2 - x);
	var disY = Math.abs(h / 2 - y);

	if (x < w * boundaryPct && camera.position.x >= -horizBoundary + w/2) {
		camSpeedX = map_range(disX, w * boundaryPct, w/2, 0, -panMaxSpeed);
	}
	else if (x > w - w * boundaryPct && camera.position.x <= horizBoundary - w/2) {
		camSpeedX = map_range(disX, w * boundaryPct, w/2, 0, panMaxSpeed);
	}
	
	if (y < h * boundaryPct && camera.position.y >= -vertBoundary + h/2) {
		camSpeedY = map_range(disY, h * boundaryPct, h/2, 0, panMaxSpeed);
	}
	else if (y > h - h * boundaryPct && camera.position.y <= vertBoundary - h/2) {
		camSpeedY = map_range(disY, h * boundaryPct, h/2, 0, -panMaxSpeed);
	}
}

function setProjection() {
	//For some reason, the following code accurately sets the position of the mouse in 3D space.
	//I don't really know how projection vectors work, so I'm just gonna go with it.
	var vector = new THREE.Vector3(
    ( mouse.x / window.innerWidth ) * 2 - 1,
    - ( mouse.y / window.innerHeight ) * 2 + 1,
    0.5 );

	projector.unprojectVector( vector, camera );

	var dir = vector.sub( camera.position ).normalize();

	var distance = - camera.position.z / dir.z;

	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

	directionVector.x = pos.x;
	directionVector.y = pos.y;
	directionVector.z = pos.z;
}

//This function allows us to select images without picking the ones underneath
function pickImage() {
	// find intersections
	var vector = new THREE.Vector3( pickMouse.x, pickMouse.y, 1 );
	pickProjector.unprojectVector( vector, camera );

	pickRaycaster.set( camera.position, vector.sub( camera.position ).normalize() );

	var intersects = pickRaycaster.intersectObjects( scene.children );

	if ( intersects.length > 0 ) {
		INTERSECTED = intersects[ 0 ].object;

		addAutoCursor();

		for (var i = 0; i < planeList.length; i++) {
			if (planeList[i].pic.id == INTERSECTED.id) {
				var d = lineLength( lookAtThis.position.x, lookAtThis.position.y, planeList[i].pic.position.x, planeList[i].pic.position.y );
				
				if ( d < imageSize / 2 ) {
					dragState = 0;
					addTranslateCursor();
				}
				else {
					dragState = 1;

					//We should also change the cursor.
					checkRotateCursor( i );
				}
			}
		}
	}
	else {
		INTERSECTED = null;
	}
}

function slideImages() {
	if (INTERSECTED != null) {
		for (var i = 0; i < planeList.length; i++) {
			if (planeList[i].pic.id == INTERSECTED.id) {
				var d = lineLength( lookAtThis.position.x, lookAtThis.position.y, planeList[i].pic.position.x, planeList[i].pic.position.y );
				//If we're within the middle of our picture, translate.
				if ( d < imageSize / 2 && dragState == 0) {
					addTranslateCursor();

					var diff = new THREE.Vector3( lookAtThis.position.x - prevLookAtThis.x, lookAtThis.position.y - prevLookAtThis.y );
					
					planeList[i].pic.position.x += diff.x;
					planeList[i].pic.position.y += diff.y;
					planeList[i].vel = diff.divide( new THREE.Vector3(4,4,4));
					planeList[i].vel.clamp( new THREE.Vector3(-10.0, -10.0, -10.0), new THREE.Vector3(10.0, 10.0, 10.0) );
				}
				//If we're on one of the edges, rotate.
				else if (dragState == 1) {
					//Find the angle between the current mouse and previous mouse. This will give us the rotation.
					var angleA = Math.atan2( lookAtThis.position.y - planeList[i].pic.position.y, lookAtThis.position.x - planeList[i].pic.position.x);
					var angleB = Math.atan2( prevLookAtThis.y - planeList[i].pic.position.y, prevLookAtThis.x - planeList[i].pic.position.x );
					var angleC = angleA - angleB;
					planeList[i].pic.rotation.z += angleC;

					//We should also change the cursor.
					checkRotateCursor( i );
				}

				socket.emit('pic movement', { id: planeList[i].id, posX: planeList[i].pic.position.x, posY: planeList[i].pic.position.y, rot: planeList[i].pic.rotation.z });
			}
		}
	}
}

function setSelectedImage() {
	for (var i = 0; i < planeList.length; i++) {
		if ( planeList[i].pic.id == INTERSECTED.id) {
			selectedImage = i;
			selectedImagePos.set(planeList[i].pic.position.x, planeList[i].pic.position.y, planeList[i].pic.position.z);
		}
	}
}

//This function moves the rectangle inside the HUD
function setHUD() {
	if (bMap) {
		var horiz = map_range(camera.position.x, -horizBoundary, horizBoundary, -lightHUDSize/2, 256+lightHUDSize/2) - lightHUDSize/2;
		var vert = map_range(camera.position.y, vertBoundary, -vertBoundary, 0, 160) - lightHUDSize/2;

		userPosition.style.left = horiz + "px";
	 	userPosition.style.top = vert + "px";

	 	HUD.style.right = "10px";
	 	HUD.style.bottom = "10px";
 	}
 	else {
 		userPosition.style.left = "-9999px";
 		userPosition.style.top = "-9999px";

 		HUD.style.right = "-9999px";
	 	HUD.style.bottom = "-9999px";
 	}
}

function checkTextbox() {
	if (document.activeElement.nodeName == "TEXTAREA" || document.activeElement.nodeName == "INPUT") {
		bTextboxActive = true;
	}
}

function checkRotateCursor( i ) {
	if ( lookAtThis.position.x < planeList[i].pic.position.x && lookAtThis.position.y >= planeList[i].pic.position.y) {
		addRotateTopCursor();
	}
	else if ( lookAtThis.position.x > planeList[i].pic.position.x && lookAtThis.position.y >= planeList[i].pic.position.y) {
		addRotateRightCursor();
	}
	else if ( lookAtThis.position.x > planeList[i].pic.position.x && lookAtThis.position.y < planeList[i].pic.position.y) {
		addRotateBottomCursor();
	}
	else if ( lookAtThis.position.x < planeList[i].pic.position.x && lookAtThis.position.y < planeList[i].pic.position.y) {
		addRotateLeftCursor();
	}	
}

/***************************************************************************************************************/
/***************************************************************************************************************/
/********************************************ANIMATION FUNCTIONS************************************************/
/***************************************************************************************************************/
/***************************************************************************************************************/
function tiltImage() {
	if(bIsFront) {
		if (mouse.x > w / 2 + imageSize / 3 && mouse.x < w / 2 + outerBoundary) {
			if (planeList[selectedImage].pic.rotation.y < Math.PI / 12) {
				planeList[selectedImage].pic.rotation.y += 0.1;
				metaPlane.rotation.y += 0.1;
				metaData_name.rotation.y += 0.1;
				metaData_date.rotation.y += 0.1;
				metaData_caption.rotation.y += 0.1;
			}

			addRotateCursor();
		}
		else if (mouse.x < w / 2 - imageSize / 3 && mouse.x > w / 2 - outerBoundary) {
			if (planeList[selectedImage].pic.rotation.y > -Math.PI / 12) {
				planeList[selectedImage].pic.rotation.y -= 0.1;
				metaPlane.rotation.y -= 0.1;
				metaData_name.rotation.y -= 0.1;
				metaData_date.rotation.y -= 0.1;
				metaData_caption.rotation.y -= 0.1;
			}

			addRotateCursor();
		}

		else {
			if (planeList[selectedImage].pic.rotation.y > 0.1) {
				planeList[selectedImage].pic.rotation.y -= 0.1;
				metaPlane.rotation.y -= 0.1;
				metaData_name.rotation.y -= 0.1;
				metaData_date.rotation.y -= 0.1;
				metaData_caption.rotation.y -= 0.1;
			}
			else if (planeList[selectedImage].pic.rotation.y < 0.0) {
				planeList[selectedImage].pic.rotation.y += 0.1;
				metaPlane.rotation.y += 0.1;
				metaData_name.rotation.y += 0.1;
				metaData_date.rotation.y += 0.1;
				metaData_caption.rotation.y += 0.1;
			}
			addAutoCursor();
		}
	}
	//Photo is on back
	else {
		//Right side
		if (mouse.x > w / 2 + imageSize / 2 && mouse.x < w / 2 + outerBoundary && !bTextboxActive) {

			if (planeList[selectedImage].pic.rotation.y < Math.PI + Math.PI / 12 && planeList[selectedImage].pic.rotation.y > 0) {
				planeList[selectedImage].pic.rotation.y += 0.1;
				metaPlane.rotation.y += 0.1;
				metaData_name.rotation.y += 0.1;
				metaData_date.rotation.y += 0.1;
				metaData_caption.rotation.y += 0.1;
			}
			else if ( planeList[selectedImage].pic.rotation.y < -Math.PI + Math.PI/12 && planeList[selectedImage].pic.rotation.y < 0 ) {
				planeList[selectedImage].pic.rotation.y += 0.1;
				metaPlane.rotation.y += 0.1;
				metaData_name.rotation.y += 0.1;
				metaData_date.rotation.y += 0.1;
				metaData_caption.rotation.y += 0.1;
			}

			addRotateCursor();
		}
		//Left side
		else if (mouse.x < w / 2 - imageSize / 2 && mouse.x > w / 2 - outerBoundary && !bTextboxActive) {

			if (planeList[selectedImage].pic.rotation.y > Math.PI - Math.PI / 12 && planeList[selectedImage].pic.rotation.y > 0) {
				planeList[selectedImage].pic.rotation.y -= 0.1;
				metaPlane.rotation.y -= 0.1;
				metaData_name.rotation.y -= 0.1;
				metaData_date.rotation.y -= 0.1;
				metaData_caption.rotation.y -= 0.1;
			}
			else if (planeList[selectedImage].pic.rotation.y > -Math.PI - Math.PI/12 && planeList[selectedImage].pic.rotation.y < 0) {
				planeList[selectedImage].pic.rotation.y -= 0.1;
				metaPlane.rotation.y -= 0.1;
				metaData_name.rotation.y -= 0.1;
				metaData_date.rotation.y -= 0.1;
				metaData_caption.rotation.y -= 0.1;
			}

			addRotateCursor();
		}
		//Center
		else {
			if (planeList[selectedImage].pic.rotation.y > Math.PI) {
				planeList[selectedImage].pic.rotation.y -= 0.1;
				metaPlane.rotation.y -= 0.1;
				metaData_name.rotation.y -= 0.1;
				metaData_date.rotation.y -= 0.1;
				metaData_caption.rotation.y -= 0.1;
			}

			else if (planeList[selectedImage].pic.rotation.y < Math.PI - 0.1 && planeList[selectedImage].pic.rotation.y > 0) {
				planeList[selectedImage].pic.rotation.y += 0.1;
				metaPlane.rotation.y += 0.1;
				metaData_name.rotation.y += 0.1;
				metaData_date.rotation.y += 0.1;
				metaData_caption.rotation.y += 0.1;
			}

			if (planeList[selectedImage].pic.rotation.y < -Math.PI) {
				planeList[selectedImage].pic.rotation.y += 0.1;
				metaPlane.rotation.y += 0.1;
				metaData_name.rotation.y += 0.1;
				metaData_date.rotation.y += 0.1;
				metaData_caption.rotation.y += 0.1;
			}

			else if (planeList[selectedImage].pic.rotation.y > -Math.PI + 0.1 && planeList[selectedImage].pic.rotation.y < 0) {
				planeList[selectedImage].pic.rotation.y -= 0.1;
				metaPlane.rotation.y -= 0.1;
				metaData_name.rotation.y -= 0.1;
				metaData_date.rotation.y -= 0.1;
				metaData_caption.rotation.y -= 0.1;
			}

			addAutoCursor();
		}

	}
}

function animateToFront( destX, destY, destZ, rotateZ) {
	var d = lineLength(planeList[selectedImage].pic.position.x, planeList[selectedImage].pic.position.y, destX, destY );

	if (d > 0.01 && bMoveToFront) {
		//Change the position of our selected photo ( destination is camera position )
		planeList[selectedImage].pic.position.x = moveSpeed * destX + (1 - moveSpeed) * planeList[selectedImage].pic.position.x;
		planeList[selectedImage].pic.position.y = moveSpeed * destY + (1 - moveSpeed) * planeList[selectedImage].pic.position.y;
		planeList[selectedImage].pic.position.z = moveSpeed * destZ + (1 - moveSpeed) * planeList[selectedImage].pic.position.z;

		//Change the rotation of our selected photo ( destination is 0 rotation in all axes )
		planeList[selectedImage].pic.rotation.z = moveSpeed * rotateZ + (1 - moveSpeed) * planeList[selectedImage].pic.rotation.z;
	}


	else {
		bMoveToFront = false;
	}

}

function rotateImage( speed, dest ) {
	if ( Math.abs( planeList[selectedImage].pic.rotation.y - dest ) > 0.01 && bRotatePic ) {
		planeList[selectedImage].pic.rotation.y = speed * dest + (1 - speed) * planeList[selectedImage].pic.rotation.y;
		metaPlane.rotation.y = speed * (dest+Math.PI) + (1 - speed) * metaPlane.rotation.y;
		metaData_name.rotation.y = speed * (dest+Math.PI) + (1 - speed) * metaData_name.rotation.y;
		metaData_date.rotation.y = speed * (dest+Math.PI) + (1 - speed) * metaData_date.rotation.y;
		metaData_caption.rotation.y = speed * (dest+Math.PI) + (1 - speed) * metaData_caption.rotation.y;

	}
	else {
		bRotatePic = false;
		whichRotate = -1;
	}
}


function animateLight( whichLight, speed, brightness ) {
	if ( Math.abs(whichLight.intensity - brightness) > 0.001 && bFadeLight) {
		whichLight.intensity = speed * brightness + (1 - speed) * whichLight.intensity;
	}

	else {
		bFadeLight = false;
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
function lineLength(x, y, x0, y0){
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

//From http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
function wrapText(context, text, x, y, maxWidth, lineHeight) {
	var words = text.split(' ');
	var line = '';

	for(var n = 0; n < words.length; n++) {
	  var testLine = line + words[n] + ' ';
	  var metrics = context.measureText(testLine);
	  var testWidth = metrics.width;
	  if (testWidth > maxWidth && n > 0) {
	    context.fillText(line, x, y);
	    line = words[n] + ' ';
	    y += lineHeight;
	  }
	  else {
	    line = testLine;
	  }
	}
	context.fillText(line, x, y);
}

/***************************************************************************************************************/
/***************************************************************************************************************/
/**********************************************ANIMATION FUNCTION***********************************************/
/***************************************************************************************************************/
/***************************************************************************************************************/

function animate(t) {

	/***************************************************************************************/
	/***************************************STATE ZERO**************************************/
	/***************************************************************************************/
	if (state == 0) {
		socket.emit( 'light movement', { lookX: lookAtThis.position.x, lookY: lookAtThis.position.y, camX: camera.position.x, camY: camera.position.y } );

		removeUserConnectDisconnect();

		//Make sure the camera has not gone out of the boundary
		camera.position.clamp( camMinVec, camMaxVec );

		//Only update the light position vector if we aren't scrolling. Fixes flickering.
		if (!bIsScrolling) setProjection();
		bIsScrolling = false;
		
		pickImage();

		camera.position.x += camSpeedX;
		camera.position.y += camSpeedY;

		setHUD();

		if (bHUDActive) {
			camSpeedX = 0;
			camSpeedY = 0;
		}

		var angle = map_range(camera.position.z, 1000, 4500, Math.PI/8, Math.PI/40);
		var exponent = map_range(camera.position.z, 1000, 4500, 75.0, 500.0);
		light.angle = angle;
		light.exponent = exponent;

		light.position.set( camera.position.x, camera.position.y, camera.position.z );
		light.target = lookAtThis;

		if (selectedImage != -1) {
			animateToFront(selectedImagePos.x, selectedImagePos.y, maxZDepth, putBackRotation);
			animateLight( light, 0.1, 1.0 );
			animateLight( clickedLight, 0.1, 0.0 );
		}

		for (var i = 0; i < planeList.length; i++) {
			planeList[i].vel.x += planeList[i].acc.x;
			planeList[i].vel.y += planeList[i].acc.y;
			planeList[i].pic.position.x += planeList[i].vel.x;
			planeList[i].pic.position.y += planeList[i].vel.y;

			planeList[i].acc.set(0,0,0);
			planeList[i].vel.multiply( damping );
		}

		if (mouseDown) {
			slideImages(); //Function to drag images.

			//Set the camera speed to zero
			camSpeedX = 0;
			camSpeedY = 0;

			//Make light bigger when you're dragging an image.
			light.intensity = 1.5;
			light.angle = Math.PI / 4;
			light.exponent = 30.0;

			mouseDownCount++;
		}

		prevLookAtThis.x = lookAtThis.position.x;
		prevLookAtThis.y = lookAtThis.position.y;
		prevLookAtThis.z = lookAtThis.position.z;

		lookAtThis.position.x = directionVector.x;
		lookAtThis.position.y = directionVector.y;
		lookAtThis.position.z = directionVector.z;

		lookAtThis.position.clamp( boundaryMinVec, boundaryMaxVec );
	}

	/***************************************************************************************/
	/***************************************STATE ONE***************************************/
	/***************************************************************************************/
	else if (state == 1) {
		lookAtThis.position.set(camera.position.x, camera.position.y, camera.position.z - 1000);

		animateToFront( camera.position.x, camera.position.y, camera.position.z - 800, 0);

		animateLight( light, 0.02, 0.0 );
		animateLight( clickedLight, 0.02, 1.0 );

		checkTextbox();

		if (whichRotate == 0) {
			rotateImage( rotateSpeed, Math.PI);
		}

		if (whichRotate == 1) {
			rotateImage( rotateSpeed, 0);
		}

		if (whichRotate == 2) {
			rotateImage( rotateSpeed, -Math.PI);
		}

		if (whichRotate == 3) {
			rotateImage( rotateSpeed, 0);
		}

		if (!bRotatePic) {
			tiltImage();
		}
		
	}

	//stats.update();

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