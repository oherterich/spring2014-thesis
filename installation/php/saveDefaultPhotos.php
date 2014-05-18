<?php
	$maxHoriz = 1920.0;
	$maxVert = 1200.0;
	$maxZ = 30.0;
	$baseNumberX = 0;
	$baseNumberY = 0;

	$mysql = mysql_connect('localhost', 'root', 'root');
	mysql_select_db('Thesis', $mysql);

	$d = $_POST;

	$idList = array();
	$sql = "SELECT photo_link FROM DefaultPhotos";
	$query = mysql_query($sql);

	while($photoLinks = mysql_fetch_assoc($query)){
		array_push($idList, $photoLinks['photo_link']);
	}
	 

	$uniqueId = $d['id'];
	$isUnique = true;

	for( $i = 0; $i < count($idList); $i=$i+1) {
		if ( strcmp($idList[$i], $uniqueId) == 0 ) {
			$isUnique = false;
		}
	}

  	$imageUrl = $d['link'];

	if ($isUnique && $imageUrl != "") {
  		if (strlen($imageUrl) > 1) {
  			$image = file_get_contents($imageUrl);
			file_put_contents("../default_img/" . $uniqueId . ".jpg", $image);
		}


		$userid = $d['userid'];
		$time = date('m/d/Y', $d['time']);
		$caption = $d['caption'];
		$name = $d['name'];

		global $baseNumberX, $baseNumberY, $maxZ;

		$randX = generateFloat( $baseNumberX - 1100, $baseNumberX + 1100);
		$randY = generateFloat( $baseNumberY - 800, $baseNumberY + 800);
		$randZ = generateFloat( 0, $maxZ );
		$rot = generateFloat( -M_PI, M_PI );

		//Insert the info into our database
		$sql = "INSERT INTO DefaultPhotos (userid, photo_link, url, time, caption, name, posX, posY, posZ, rot) VALUES ('$userid', '$uniqueId', '$imageUrl', '$time', '$caption', '$name', '$randX', '$randY', '$randZ', '$rot')";
		$query = mysql_query($sql);
		echo $query;
	}

	function generateFloat( $min, $max ) {
		$rand = mt_rand($min * 100, $max * 100) / 100;
		return $rand;
	}

?>

