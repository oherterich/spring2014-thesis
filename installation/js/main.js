//Variables for connecting with Instagram
var clientid = "3a4831a9152845bcb5caa94f713a8d00";
var redirectURL = "http://macaroni.local/GradSchool/ThesisSpring/spring2014-thesis/code/";
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
	userDeny.classList.remove('user-deny-hidden');
	userDeny.classList.remove('user-deny-visible');
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

/******************************************/
/*********GET DATA FROM INSTAGRAM**********/
/******************************************/
$(document).ready(function(){

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
					window.location="pastpresent.html?" + parsed_json['data'][0]['user']['id'];
				});
			}
		});
	}
});
