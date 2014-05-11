var body = document.getElementsByTagName("body")[0];
var container = document.getElementById("container");
var photoLinks;
var commentList;
var HUD = document.getElementById("HUD");
var userPosition = document.getElementById("user-position");
var ping = document.getElementById("ping");

var leftArrow = document.getElementById("left-arrow");
var rightArrow = document.getElementById("right-arrow");
var instruction = document.getElementsByClassName("instruction");
instruction[0].style.opacity = 0.6;
instruction[2].style.opacity = 0.6;

var numUsers = document.getElementById('num-users');
var userConnect = document.getElementById('user-connect');
var userDisconnect = document.getElementById('user-disconnect');

var chime = new Audio('sound/chime.mp3');
var ambient = new Audio('sound/ambient.mp3');
var turnPaper = new Audio('sound/turnpaper.mp3');
var dropPaper = new Audio('sound/droppaper.mp3');
var pickPaper = new Audio('sound/pickpaper.mp3');
var enter = new Audio('sound/enter.mp3');
var exit = new Audio('sound/exit.mp3');

ambient.loop = true;
ambient.play();

var url = document.location.href;

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

//When the page loads, we want to get our photo links and notes from the database
$(document).ready( function() {
    var response = '';
    var instId = url.split('?')[1];

    $.ajax({ 
        type: "GET",   
        url: "php/getPhotoLinks.php",   
        async: false,
        dataType: "text",
        data: instId,
        success : function(links)
         {
            response = links;
            photoLinks = jQuery.parseJSON(response);
            console.log(photoLinks);
         }
    });
});

function addLeftArrow() {
    leftArrow.classList.add("arrow-left-visible");
    leftArrow.classList.remove("arrow-left-hidden");
}

function removeLeftArrow() {
    leftArrow.classList.add("arrow-left-hidden");
    leftArrow.classList.remove("arrow-left-visible");
}

function addRightArrow() {
    rightArrow.classList.add("arrow-right-visible");
    rightArrow.classList.remove("arrow-right-hidden");
}

function removeRightArrow() {
    rightArrow.classList.add("arrow-right-hidden");
    rightArrow.classList.remove("arrow-right-visible");
}

function addInstruction( index ) {
    instruction[index].classList.add("instruction-visible");
    instruction[index].classList.remove("instruction-hidden");
}

function removeInstruction( index ) {
    instruction[index].classList.add("instruction-hidden");
    instruction[index].classList.remove("instruction-visible");
}

function addRotateCursor() {
    body.classList.add("cursor-rotate");
    body.classList.remove("cursor-auto");
    body.classList.remove("cursor-write");
    body.classList.remove("cursor-rotate-top");
    body.classList.remove("cursor-rotate-right");
    body.classList.remove("cursor-rotate-bottom");
    body.classList.remove("cursor-rotate-left");
    body.classList.remove("cursor-translate");
}

function addRotateTopCursor() {
    body.classList.add("cursor-rotate-top");
    body.classList.remove("cursor-auto");
    body.classList.remove("cursor-write");
    body.classList.remove("cursor-rotate");
    body.classList.remove("cursor-rotate-right");
    body.classList.remove("cursor-rotate-bottom");
    body.classList.remove("cursor-rotate-left");
    body.classList.remove("cursor-translate");
}

function addRotateRightCursor() {
    body.classList.add("cursor-rotate-right");
    body.classList.remove("cursor-auto");
    body.classList.remove("cursor-write");
    body.classList.remove("cursor-rotate");
    body.classList.remove("cursor-rotate-top");
    body.classList.remove("cursor-rotate-bottom");
    body.classList.remove("cursor-rotate-left");
    body.classList.remove("cursor-translate");
}

function addRotateBottomCursor() {
    body.classList.add("cursor-rotate-bottom");
    body.classList.remove("cursor-auto");
    body.classList.remove("cursor-write");
    body.classList.remove("cursor-rotate");
    body.classList.remove("cursor-rotate-right");
    body.classList.remove("cursor-rotate-top");
    body.classList.remove("cursor-rotate-left");
    body.classList.remove("cursor-translate");
}

function addRotateLeftCursor() {
    body.classList.add("cursor-rotate-left");
    body.classList.remove("cursor-auto");
    body.classList.remove("cursor-write");
    body.classList.remove("cursor-rotate");
    body.classList.remove("cursor-rotate-right");
    body.classList.remove("cursor-rotate-bottom");
    body.classList.remove("cursor-rotate-top");
    body.classList.remove("cursor-translate");
}

function addWriteCursor() {
    body.classList.add("cursor-write");
    body.classList.remove("cursor-auto");
    body.classList.remove("cursor-rotate");
    body.classList.remove("cursor-rotate-top");
    body.classList.remove("cursor-rotate-right");
    body.classList.remove("cursor-rotate-bottom");
    body.classList.remove("cursor-rotate-left");
    body.classList.remove("cursor-translate");
}

function addAutoCursor() {
    body.classList.add("cursor-auto");
    body.classList.remove("cursor-rotate");
    body.classList.remove("cursor-write");
    body.classList.remove("cursor-rotate-top");
    body.classList.remove("cursor-rotate-right");
    body.classList.remove("cursor-rotate-bottom");
    body.classList.remove("cursor-rotate-left");
    body.classList.remove("cursor-translate");
}

function addTranslateCursor() {
    body.classList.add("cursor-translate");
    body.classList.remove("cursor-auto");
    body.classList.remove("cursor-rotate");
    body.classList.remove("cursor-write");
    body.classList.remove("cursor-rotate-top");
    body.classList.remove("cursor-rotate-right");
    body.classList.remove("cursor-rotate-bottom");
    body.classList.remove("cursor-rotate-left");
}

function addNotes() {
    notes.classList.add("notes-visible");
    notes.classList.remove("notes-hidden");
    notes.classList.remove("notes-rotateLeft");
    notes.classList.remove("notes-rotateRight");
}

function removeNotes() {
    notes.classList.add("notes-hidden");
    notes.classList.remove("notes-visible");
}

function rotateLeftNotes() {
    notes.classList.add("notes-rotateLeft");
    notes.classList.remove("notes-rotateRight");
}

function rotateRightNotes() {
    notes.classList.add("notes-rotateRight");
    notes.classList.remove("notes-rotateLeft");
}

function clearNotes() {
    notes.innerHTML = "";
}

function removeUserConnectDisconnect() {
    if (userConnect.style.opacity > 0.0) {
        userConnect.style.opacity -= 0.01;
        if (userConnect.style.opacity <= 0.01){
            userConnect.style.opacity = 0;
        }
    }
    if (userDisconnect.style.opacity > 0.0) {
        userDisconnect.style.opacity -= 0.01;
        if (userDisconnect.style.opacity <= 0.01){
            userDisconnect.style.opacity = 0;
        }
    }
}

userPosition.addEventListener('mouseover', function(evt) {
    bHUDActive = true;
});

userPosition.addEventListener('mouseout', function(evt) {
    bHUDActive = false;
});