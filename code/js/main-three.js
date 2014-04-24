var body = document.getElementsByTagName("body")[0];
var container = document.getElementById("container");
var photoLinks;
var commentList;
var HUD = document.getElementById("HUD");
var userPosition = document.getElementById("user-position");
var ping = document.getElementById("ping");
var notes = document.getElementById("notes");
var textContainer = document.getElementById("textContainer");
var textbox = document.getElementById("textbox");
//var submit = document.getElementById("submit");
var bActiveTextbox = false;

var leftArrow = document.getElementById("left-arrow");
var rightArrow = document.getElementById("right-arrow");
var instruction = document.getElementsByClassName("instruction");
instruction[0].style.opacity = 0.6;
instruction[2].style.opacity = 0.6;

var chime = new Audio('sound/chime.mp3');
var ambient = new Audio('sound/ambient.mp3');
var turnPaper = new Audio('sound/turnpaper.mp3');
var dropPaper = new Audio('sound/droppaper.mp3');
var pickPaper = new Audio('sound/pickpaper.mp3');

ambient.loop = true;
ambient.play();




var url = document.location.href;

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

    $.ajax({ 
        type: "REQUEST",
        url: "php/getComments.php",
        success : function(comments) {
            commentList = jQuery.parseJSON(comments);
        }
    });
});

//Functions for easily adding/removing the text container from our page
function addTextContainer() {
    textContainer.classList.add("textcontainer-visible");
    textContainer.classList.remove("textcontainer-hidden");
    bActiveTextbox = true;
}

function removeTextContainer() {
    textContainer.classList.remove("textcontainer-visible");
    textContainer.classList.add("textcontainer-hidden");
    bActiveTextbox = false;
}

function addTextbox() {
    textbox.classList.add("textbox-close");
    textbox.classList.remove("textbox-far");
}

function removeTextbox() {
    textbox.classList.add("textbox-far");
    textbox.classList.remove("textbox-close");
}

function showTextbox() {
    textbox.classList.add("textbox-visible");
    textbox.classList.remove("textbox-hidden");

}

function hideTextbox() {
    textbox.classList.add("textbox-hidden");
    textbox.classList.remove("textbox-visible");
}

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

//Adds your most recent note to the page
function addNote( note ) {
    var newNote = document.createElement("p");
    newNote.innerHTML = note;
    console.log(newNote);
    notes.appendChild(newNote);
}

//Function for adding specific notes to the back of the photo when it is selected
function createNotes( userid ) {
    for ( var i = 0; i < commentList.length; i++) {
        if ( commentList[i]['userid'] == userid ) {
            var newComment = document.createElement('p');
            newComment.innerHTML = commentList[i]['comment'];
            notes.appendChild(newComment);
        }
    }
}

function saveComment( text, userid ) {
    var input = { comment: text, id: userid };

   $.ajax({
        type: "POST",
        url: "php/saveComment.php",
        dataType: "json",
        data : input,
        //Kind of weird, but we need to request all of the comments again because we should 
        //include our latest comment in the page
        success : function( response ) {
                $.ajax({ 
                    type: "REQUEST",
                    url: "php/getComments.php",
                    success : function(comments) {
                        commentList = jQuery.parseJSON(comments);
                        clearNotes();
                        createNotes( photoLinks[selectedImage]['link'] );
                        removeInstruction(2);
                    }
                });
        }
   }); 
}

textbox.addEventListener('keydown', function(evt) {
    if (evt.keyCode == 13) {
        var userComment = textbox.value;
        var userid = photoLinks[selectedImage]['link'];
        saveComment( userComment, userid );
        removeTextbox();
        textbox.blur();
        removeInstruction(2);
    }
});

textbox.addEventListener('mouseover', function(evt) {
    bTextboxActive = true;
});

textbox.addEventListener('mouseout', function(evt) {
    bTextboxActive = false;
});

userPosition.addEventListener('mouseover', function(evt) {
    bHUDActive = true;
});

userPosition.addEventListener('mouseout', function(evt) {
    bHUDActive = false;
});

// userPosition.addEventListener('mousedown', function(evt) {
//     bHUDDraggable = true;
//     evt.preventDefault();
// });

// userPosition.addEventListener('mouseup', function(evt) {
//     bHUDDraggable = false;
// });

// userPosition.addEventListener('click', function(evt) {
//     bHUDDraggable = false;
// });
