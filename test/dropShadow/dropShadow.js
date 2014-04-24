window.onscroll = function( evt ) {
	console.log("scrolL!");
}

var w = window.innerWidth,
	h = window.innerHeight;

//Set up renderer
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
renderer.setClearColorHex(0x020202, 1.0);
renderer.shadowMapEnabled = true;
renderer.shadowMapCullFace = THREE.CullFaceBack;
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
camera.position.z = 100;
camera.position.y = 0;
camera.position.x = 0;

var camSpeedX = 0.0;
var camSpeedY = 0.0;

//Trackball controls
var controls = new THREE.TrackballControls( camera );
controls.addEventListener( 'change', render );

//Create a scene
var scene = new THREE.Scene();

//Big light to illuminate space (for testing purposes)
var hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 1.0);
//scene.add(hemiLight);

var spotLight = new THREE.SpotLight( 0xFFFFFF, 1.0 );
spotLight.position.set(0, 0, 100);
spotLight.castShadow = true;
spotLight.shadowCameraVisible = true;
spotLight.shadowMapWidth = 512;
spotLight.shadowMapHeight = 512;
spotLight.shadowCameraNear = 10;
spotLight.shadowCameraFar = 300;
spotLight.shadowCameraFov = 60;
spotLight.shadowBias = -0.001;
scene.add(spotLight);

var spotLight2 = new THREE.SpotLight( 0xFFFFFF, 1.0 );
spotLight2.position.set(0, 0, -100);
spotLight2.castShadow = true;
spotLight2.shadowCameraVisible = true;
//scene.add(spotLight2);

for (var i = 0; i < 5; i++) {
	for (var j = 0; j < 5; j++) {

		var c = new THREE.Color( 0xFFFFFF );
		c.setRGB( Math.random(), Math.random(), Math.random() );
		var material = new THREE.MeshLambertMaterial({ color: c, side:THREE.DoubleSide });
		var geometry = new THREE.PlaneGeometry(10, 10, 1, 10);
		var mesh = new THREE.Mesh(geometry, material);

		mesh.position.set(Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 30);
		mesh.rotation.z = Math.random() * Math.PI * 2;

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		scene.add(mesh);
	}
}



document.body.addEventListener('mousemove', function (evt) {

  if (evt.clientX > w - w * 0.2 || evt.clientX < w * 0.2 || evt.clientY > h - h * 0.2 || evt.clientY < h * 0.2) {
  	moveCamera(evt.clientX, evt.clientY);
  }
  else {
  	camSpeedX = 0.0;
  	camSpeedY = 0.0;
  }

}, false);

function moveCamera(x, y) {
	var disX = w / 2 - x;
	var disY = h / 2 - y;

	camSpeedX = map_range(disX, -w/2, w/2, .5, -.5);
	camSpeedY = map_range(disY, -h/2, h/2, -.5, .5);
}

//Simple function to map values (similar to Processing's map() function)
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


function animate(t) {
	controls.update();
	render();
	window.requestAnimationFrame(animate, renderer.domElement);

}

function render() {
    renderer.autoClear = false;
    renderer.clear();
	renderer.render( scene, camera );
}

animate(new Date().getTime());
