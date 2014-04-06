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

var loading = document.querySelector(".loading-hidden");
console.log(loading);

function showLoading() {
	loading.classList.remove("loading-hidden");
	loading.classList.add("loading-visible");
}




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
	
	 function getUserPhotos() {
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
					window.location="three.html?" + parsed_json['data'][0]['user']['id'];
				});
			}
		});
	}
});
