<?php
	$maxHoriz = 2560.0;
	$maxVert = 1600.0;
	$maxZ = 25.0;
	$baseNumberX = mt_rand( ($maxHoriz * -1) + 500, $maxHoriz - 500 );
	$baseNumberY = mt_rand( ($maxVert * -1) + 500, $maxVert - 500 );

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

	  	$imageUrl = $d['images']['standard_resolution']['url'];

  		if ($isUnique && $imageUrl != "") {
	  		if (strlen($imageUrl) > 1) {
	  			$image = file_get_contents($imageUrl);
				file_put_contents("instagram_img/" . $uniqueId . ".jpg", $image);
			}

				$time = date('m/d/Y', $d['created_time']);
				$caption = $d['caption']['text'];
				$name = $d['user']['full_name'];

				global $baseNumberX, $baseNumberY, $maxZ;

				$randX = generateFloat( $baseNumberX - 500, $baseNumberX + 500);
				$randY = generateFloat( $baseNumberY - 500, $baseNumberY + 500);
				$randZ = generateFloat( 0, $maxZ );
				$rot = rand( -M_PI, M_PI );

				//Insert the info into our database
				$sql = "INSERT INTO Photos (photo_link, url, time, caption, name, posX, posY, posZ, rot) VALUES ('$uniqueId', '$imageUrl', '$time', '$caption', '$name', '$randX', '$randY', '$randZ', '$rot')";
				$query = mysql_query($sql);
		}
	}

	$name = $data["data"][0]["images"]["standard_resolution"]["url"];

	function generateFloat( $min, $max ) {
		$rand = mt_rand($min * 100, $max * 100) / 100;
		return $rand;
	}

?>

