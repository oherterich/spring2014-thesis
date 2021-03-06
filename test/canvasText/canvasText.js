var w = window.innerWidth,
	h = window.innerHeight;

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
camera.position.z = 100;
camera.position.y = 0;
camera.position.x = 0;

var camSpeedX = 0.0;
var camSpeedY = 0.0;

var controls = new THREE.TrackballControls( camera, renderer.domElement );

controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;

// controls.noZoom = true;
// controls.noPan = true;
// controls.noRotate = true;

controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

controls.keys = [ 65, 83, 68 ];

controls.addEventListener( 'change', render );

//Create a scene
var scene = new THREE.Scene();

//Big light to illuminate space (for testing purposes)
var hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 1.0);
scene.add(hemiLight);

// for (var i = 0; i < 5; i++) {
// 	for (var j = 0; j < 5; j++) {
// 		var material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
// 		var geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
// 		var mesh = new THREE.Mesh(geometry, material);

// 		mesh.position.set(i * 15, j * 15, Math.random() * 2);

// 		scene.add(mesh);
// 	}
// }

var text = "Owen Herterich";

var canvas1 = document.createElement('canvas');
canvas1.width = 700;
canvas1.height = 500;
var context1 = canvas1.getContext('2d');
context1.font = "72px Georgia";
context1.fillStyle = "rgba(240,0,240,0.95)";
context1.fillText(text, 100, canvas1.height / 2);
console.log(canvas1);
console.log(context1);

var texture1 = new THREE.Texture(canvas1);
texture1.needsUpdate = true;

var material1 = new THREE.MeshBasicMaterial( { map: texture1, side: THREE.DoubleSide } );
//material1.transparent = true;

var mesh1 = new THREE.Mesh(
	new THREE.PlaneGeometry(canvas1.width, canvas1.height),
	material1
	);
mesh1.position.set(0,0,0);
scene.add( mesh1 );


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
	// camera.position.x += camSpeedX;
	// camera.position.y += camSpeedY;
	
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
