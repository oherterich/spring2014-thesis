<?php
	if (isset($_POST)) {
		$data = $_POST;
		$comment = $data['comment'];
		$userid = $data['id'];
	}
	else {
		$comment = null;
		$userid = null;
	}

	$mysql = mysql_connect("127.0.0.1", "root", "root");
	mysql_select_db("Thesis", $mysql);

	if ($comment != null && $comment != "" && $userid != null && $userid !="") {
		$time = date('m d Y');

		$sql = "INSERT INTO Comments (comment, time, userid) VALUES ('$comment', '$time', '$userid')";
		mysql_query($sql);
	}

	echo json_encode($data);
?>