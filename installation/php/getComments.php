<?php

	$data = array();

	class Comment {
		public $comment = "";
		public $time = "";
		public $userid = "";
	}

	$mysql = mysql_connect('127.0.0.1', 'root', 'root');
	mysql_select_db("Thesis", $mysql);

	$sql = "SELECT comment, time, userid FROM Comments";
	$query = mysql_query($sql);

	while ( $comments = mysql_fetch_assoc($query) ) {
		$message = new Comment();
		$message->comment = $comments['comment'];
		$message->time = $comments['time'];
		$message->userid = $comments['userid'];
		array_push($data, $message);
	}

	echo json_encode($data);
?>