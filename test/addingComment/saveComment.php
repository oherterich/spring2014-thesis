<?php
	if (isset($_POST)) {
		$data = $_POST;
		$comment = $data['comment'];
	}
	else {
		$comment = null;
	}

	$mysql = mysql_connect("127.0.0.1", "root", "root");
	mysql_select_db("Thesis", $mysql);

	if ($comment != null && $comment != "") {
		$time = date('m d Y');

		$sql = "INSERT INTO Comments (comment, time) VALUES ('$comment', '$time')";
		mysql_query($sql);
	}

	class Comment {
		public $comment = '';
		public $time = '';
	}

	$sql = "SELECT * FROM Comments";
	$query = mysql_query($sql);

	$data = array();

	while( $comments = mysql_fetch_assoc($query) ) {
		$thisComment = new Comment();
		$thisComment->comment = $comments['comment'];
		$thisComment->time = $comments['time'];
		array_push($data, $thisComment);
	}

	echo json_encode($data);
?>