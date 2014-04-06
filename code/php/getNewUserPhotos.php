<?php
    //Initial connection to SQL DB
    $mysql = mysql_connect('localhost', 'root', 'root');
    mysql_select_db('Thesis', $mysql);

    $data = array(); //holds the Photo object which has all of our meta data

    $instId = $_GET; //Get our Instagram Id via the GET method

    //This class will hold all of our meta data that we'll be sending to three.js
    class Photo {
        public $link = '';
        public $time = '';
        public $caption = '';
        public $name = '';
    }

    //First SQL query
    $sql = "SELECT * FROM Photos WHERE userid = " . key($instId);
    $query = mysql_query($sql);

    //Go through the Photo table and add the info to an array.
    while($metadata = mysql_fetch_assoc($query)){
        $photo = new Photo();
        $photo->link = $metadata['photo_link'];
        $photo->caption = $metadata['caption'];
        $photo->time = $metadata['time'];
        $photo->name = $metadata['name'];
        $photo->posX = $metadata['posX'];
        $photo->posY = $metadata['posY'];
        $photo->posZ = $metadata['posZ'];
        $photo->rot = $metadata['rot'];

        array_push($data, $photo);
    }

    //Send dat shit back as a JSON object
    echo json_encode($data);
?>