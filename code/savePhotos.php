<?php
	$mysql = mysql_connect('localhost', 'root', 'machine12');
	mysql_select_db('thesis', $mysql);

	//$data = $_POST['object'];
	//print_r($_POST);
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

				//Insert the info into our database
				$sql = "INSERT INTO Photos (photo_link, url) VALUES ('$uniqueId', '$imageUrl')";
				$query = mysql_query($sql);
		}

	}

	$name = $data["data"][0]["images"]["standard_resolution"]["url"];

	//$name = "owen";

?>

