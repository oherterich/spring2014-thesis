//Send comment to our database via AJAX
$(document).ready(function() {
	//Detect for keypress inside of textbox
	var textbox = document.getElementById("textbox");

	textbox.addEventListener('keydown', function(evt) {
		if (evt.keyCode == 13) {
			var userComment = textbox.value;
			saveComment(userComment);

			textbox.classList.remove("textbox-visible");
			textbox.classList.add("textbox-hidden");
		}
	});

	var saveComment = function(text) {
		var input = { comment: text };

		$.ajax({
			type: "POST",
			url: "saveComment.php",
			dataType: "json",
			data: input,
			success: function(response) {
				createComments(response);
			}
		});
	}

	var createComments = function(commentList) {
		var allComments = document.getElementById("all-comments");

		for (var i = 0; i < commentList.length; i++) {
			var thisComment = document.createElement('div');

			var comment = document.createElement('h2');
			comment.innerHTML = commentList[i]['comment'];
			thisComment.appendChild(comment);

			var time = document.createElement('h3');
			time.innerHTML = commentList[i]['time'];
			thisComment.appendChild(time);

			allComments.appendChild(thisComment);
		}
	}
});