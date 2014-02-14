<?php
	$mysql = mysql_connect('localhost', 'root', 'root');
	mysql_select_db('Thesis', $mysql);

	$data = $_POST;

	$idList = array();
	$sql = "SELECT photo_link FROM Photos";
	$query = mysql_query($sql);

	while($photoLinks = mysql_fetch_assoc($query)){
		array_push($idList, $photoLinks['photo_link']);
	}
	 

  	foreach( $data['data'] as $d) {
  		$uniqueId = $d['id'];
  		$isUnique = true;

  		for( $i = 0; $i < count($idList); $i=$i+1) {
  			if ( strcmp($idList[$i], $uniqueId) == 0 ) {
  				$isUnique = false;
  			}
  		}

  		if ($isUnique) {
	  		$imageUrl = $d['images']['standard_resolution']['url'];
	  		if (strlen($imageUrl) > 1) {
	  			$image = file_get_contents($imageUrl);
				file_put_contents("instagram_img/" . $uniqueId . ".jpg", $image);
			}

				$time = $d['created_time'];
				$caption = $d['caption']['text'];
				$name = $d['user']['full_name'];

				//Insert the info into our database
				$sql = "INSERT INTO Photos (photo_link, url, time, caption, name) VALUES ('$uniqueId', '$imageUrl', '$time', '$caption', '$name')";
				$query = mysql_query($sql);
		}

	}

	$name = $data["data"][0]["images"]["standard_resolution"]["url"];

	//$name = "owen";

?>

