var photoLinks;
var commentList;

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
            createNotes("1");
        }
    });

    function createNotes( userid ) {
        var notes = document.getElementById("notes");

        for ( var i = 0; i < commentList.length; i++) {
            if ( commentList[i]['userid'] == userid ) {
                var newComment = document.createElement('p');
                newComment.innerHTML = commentList[i]['comment'];
                notes.appendChild(newComment);
            }
        }
    }
});

//Functions for easily adding/removing the textbox from our page
var textContainer = document.getElementById("textContainer");
var textbox = document.getElementById("textbox");
var submit = document.getElementById("submit");
var bActiveTextbox = false;

function addTextbox() {
    textContainer.classList.add("textbox-visible");
    textContainer.classList.remove("textbox-hidden");
    bActiveTextbox = true;
}

function removeTextbox() {
    textContainer.classList.remove("textbox-visible");
    textContainer.classList.add("textbox-hidden");
    bActiveTextbox = false;
}

function saveComment( text ) {
    var input = { comment: text };

   $.ajax({
        type: "POST",
        url: "saveComment.php",
        dataType: "json",
        data : input,
        success : function( response ) {
            console.log( response );
        }
   }); 
}

textbox.addEventListener('keydown', function(evt) {
    if (evt.keyCode == 13) {
        var userComment = textbox.value;
        saveComment( userComment );
    }
});

submit.addEventListener('click', function(evt) {
    var userComment = textbox.value;
    saveComment( userComment );
});

