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

	echo $comment;
?>