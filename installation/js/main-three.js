var body = document.getElementsByTagName("body")[0];
var container = document.getElementById("container");
var photoLinks;
var HUD = document.getElementById("HUD");
var userPosition = document.getElementById("user-position");
var ping = document.getElementById("ping");

var leftArrow = document.getElementById("left-arrow");
var rightArrow = document.getElementById("right-arrow");
var instruction = document.getElementsByClassName("instruction");
instruction[0].style.opacity = 0.6;
instruction[2].style.opacity = 0.6;

/**************************INSTAGRAM STUFF**************************/
var clientid = "afc4f345b34946d98cfbfcebe9581461";
var redirectURL = "http://pastpresent.local/spring2014-thesis/installation/pastpresent.php";
var authURL = "https://api.instagram.com/oauth/authorize/?client_id=" + clientid + "&redirect_uri=" + redirectURL + "&response_type=token";

var instagramLogin = document.querySelector('#connect-link');
instagramLogin.href = authURL;

//Used to get the Auth Token from the URL
function getHashValue(key) {
  return location.hash.split('=')[1];
}

// usage
var hash = getHashValue('hash');
console.log("access token: " + hash);


/***********************************************************************/
/******************************************/
/**************DETECT CLICK****************/
/******************************************/

var handler = document.querySelector("#handler");
var loading = document.querySelector(".loading-hidden");
var userDeny = document.querySelector('#user-deny');

function showHandler() {
    handler.classList.remove('handler-hidden');
    handler.classList.remove('handler-visible');
}

function showLoading() {
    loading.classList.remove("loading-hidden");
    loading.classList.add("loading-visible");
}

function showUserDeny() {
    userDeny.classList.remove('hidden');
    userDeny.classList.remove('visible');
}

/******************************************/
/*************CHECK FOR ERROR**************/
/******************************************/

//parses url and gets query
// from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

handleError( urlParams );

function handleError(error) {
    if ( error.error_reason ) {
        showHandler();
        showUserDeny();
    }
    else {
        //error-free :)
    }
}

/**************************************************************************************/
/******************************************/
/*********GET DATA FROM INSTAGRAM**********/
/******************************************/
$(document).ready(function(){

    logOut();

    var userid = "";

    var URL = "https://api.instagram.com/v1/users/self/?access_token=" + hash;
    $.ajax({
        url : URL,
        dataType : "jsonp",
        success : function(parsed_json) {
            userid = parsed_json['data']['id'];
            console.log( parsed_json );
        },
        complete : function() {
            getUserPhotos();
        }
    });
    
     function getUserPhotos() {
        showHandler();
        showLoading();

        var URL = "https://api.instagram.com/v1/users/" + userid + "/media/recent?count=12&access_token=" + hash;
        $.ajax({
            url : URL,
            dataType : "jsonp",
            success : function(parsed_json) {
                $.ajax({
                    type : "POST",
                    url : "php/savePhotos.php",
                    dataType : "jsonp",
                    data : parsed_json,
                    complete : function() {

                    }
                })
                .always(function (data) {
                    window.open("./pastpresent.php", "_blank");
                    window.open('','_self');
                    window.close();
                });
            }
        });
    }

    function logOut() {

    }
});

/**************************************************************************************/

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

instagramLogin.addEventListener('mouseover', function(evt) {
    bHUDActive = true;
});

instagramLogin.addEventListener('mouseout', function(evt) {
    bHUDActive = false;
});