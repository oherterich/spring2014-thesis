var socket = io.connect('http://isharethereforeiam.com:9001');

var container = document.getElementById('container');
var boxes = document.querySelectorAll('.box');

var boxList = new Array();

socket.on('mouse', function (data) {
	for (var i = 0; i < boxList.length; i++) {
		if (data.userid === boxList[i].userid) {
			boxList[i].posX = data.mouseX;
			boxList[i].posY = data.mouseY;
		}
	}
});

socket.on('entrance', function ( data ) {
	addBox( data.id );
})

socket.on('onconnected', function ( data ) {
	console.log("Connect successfully. My id is " + data.id );
});

document.addEventListener('mousemove', function(evt) {
	socket.emit( 'mouse', { mouseX: evt.clientX, mouseY: evt.clientY, userid: boxList[0].userid } );
});

var moveBox = function( x, y, index ) {
	boxes[index].style.left = x;
	boxes[index].style.top = y;
}

var addBox = function( userid ) {
	var newBox = document.createElement('div');
	newBox.classList.add('box');
	container.appendChild( newBox );
	boxes = document.querySelectorAll('.box');

	var b = new Box(0, 0, userid);
	boxList.push( b );
}

var Box = function( posX, posY, userid) {
	this.posX = posX;
	this.posY = posY;
	this.userid= userid;
}

var update = function() {
	for (var i = 0; i < boxList.length; i++) {
		boxes[i].style.left = boxList[i].posX;
		boxes[i].style.top = boxList[i].posY;
	}
}

setInterval( update, 1000/100 );