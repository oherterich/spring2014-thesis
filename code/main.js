var clientid = "3a4831a9152845bcb5caa94f713a8d00";
var redirectURL = "http://macaroni.local/GradSchool/ThesisSpring/spring2014-thesis/code/";
var authURL = "https://api.instagram.com/oauth/authorize/?client_id=" + clientid + "&redirect_uri=" + redirectURL + "&response_type=token";

var instagramLogin = document.querySelector('#connect-link');
instagramLogin.href = authURL;

function getHashValue(key) {
  return location.hash.split('=')[1];
}

// usage
var hash = getHashValue('hash');
console.log("access token: " + hash);

/******************************************/
/**************DETECT CLICK****************/
/******************************************/

var beginButton = document.querySelector("#begin-link");
var login = document.querySelector("#login-hidden");

beginButton.addEventListener('click', function(evt) {
	login.id = "login-visible";
});

var exitButton = document.querySelector("#exit-button");

exitButton.addEventListener('click', function(evt) {
	login.id = "login-hidden";
})







/******************************************/
/*********GET DATA FROM INSTAGRAM**********/
/******************************************/
$(document).ready(function(){

	var userid = "";

	function getUserId() {

	}

	var URL = "https://api.instagram.com/v1/users/self/?access_token=" + hash;
	$.ajax({
		url : URL,
		dataType : "jsonp",
		success : function(parsed_json) {
			userid = parsed_json['data']['id'];
		},
		complete : function() {
			getUserPhotos();
		}
	});

	//getUserId();
	
	 function getUserPhotos() {
	 	var URL = "https://api.instagram.com/v1/users/" + userid + "/media/recent?access_token=" + hash;
		$.ajax({
			url : URL,
			dataType : "jsonp",
			success : function(parsed_json) {
				$.ajax({
					type : "POST",
					url : "savePhotos.php",
					dataType : "jsonp",
					data : parsed_json,
				})
				.always(function (data) {
					window.location="three.html";
				});
			}
		});
	}
});
