var container = document.getElementById("container");
var photoLinks;
var commentList;
var notes = document.getElementById("notes");
var textContainer = document.getElementById("textContainer");
var textbox = document.getElementById("textbox");
var submit = document.getElementById("submit");
var bActiveTextbox = false;

var leftArrow = document.getElementById("left-arrow");
var rightArrow = document.getElementById("right-arrow");

//When the page loads, we want to get our photo links and notes from the database
$(document).ready( function() {
    var response = '';
    $.ajax({ 
        type: "REQUEST",   
        url: "getPhotoLinks.php",   
        async: false,
        success : function(links)
         {
            response = links;
            photoLinks = jQuery.parseJSON(response);
         }
    });

    $.ajax({ 
        type: "REQUEST",
        url: "getComments.php",
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
    textbox.classList.add("textbox-visible");
    textbox.classList.remove("textbox-hidden");
    submit.classList.add("textbox-visible");
    submit.classList.remove("textbox-hidden");
}

function removeTextbox() {
    textbox.classList.add("textbox-hidden");
    textbox.classList.remove("textbox-visible");
    submit.classList.add("textbox-hidden");
    submit.classList.remove("textbox-visible");
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

function addNotes() {
    notes.classList.add("notes-visible");
    notes.classList.remove("notes-hidden");
}

function removeNotes() {
    notes.classList.add("notes-hidden");
    notes.classList.remove("notes-visible");
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
        url: "saveComment.php",
        dataType: "json",
        data : input,
        //Kind of weird, but we need to request all of the comments again because we should 
        //include our latest comment in the page
        success : function( response ) {
                $.ajax({ 
                    type: "REQUEST",
                    url: "getComments.php",
                    success : function(comments) {
                        commentList = jQuery.parseJSON(comments);
                        clearNotes();
                        createNotes( photoLinks[selectedImage]['link'] );
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
    }
});

submit.addEventListener('click', function(evt) {
    var userComment = textbox.value;
    var userid = photoLinks[selectedImage]['link'];
    saveComment( userComment, userid );
    removeTextbox();
});

textbox.addEventListener('mouseover', function(evt) {
    bTextboxActive = true;
    console.log("mouseover");
});

textbox.addEventListener('mouseout', function(evt) {
    bTextboxActive = false;
    console.log("mouseoff");
});