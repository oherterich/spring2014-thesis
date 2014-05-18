<?php
    //Initial connection to SQL DB
    $mysql = mysql_connect('localhost', 'root', 'root');
    mysql_select_db('Thesis', $mysql);

    $data = array(); //holds the Photo object which has all of our meta data
    $default = array(); //temporarily holds our default/curated photos
    $curated = array(); //holds our final set of curated photos
    $user = array(); //holds our user photos

    $randomList = array(); //holds the numbers of the random photos we picked.

    $numDefault = 40; //variable that controls how many default/curated photos that we have.

    //This class will hold all of our meta data that we'll be sending to three.js
    class Photo {
        public $link = '';
        public $time = '';
        public $caption = '';
        public $name = '';
        public $posX = '';
        public $posY = '';
        public $posZ = '';
        public $rot = '';
    }

    //First SQL query for default/curated photos
    $sql = "SELECT * FROM DefaultPhotos";
    $query = mysql_query($sql);

    //Go through the DefaultPhoto table and add the info to an array.
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

        array_push($default, $photo);

    }

    //Next, we want to just select a certain number of random default/curated photos and
    //pass them into final data array.

    //This function gets a list of unique random numbers - no repeats.
    function randomGen($min, $max, $quantity) {
        $numbers = range($min, $max);
        shuffle($numbers);
        return array_slice($numbers, 0, $quantity);
    }


    $numbers = randomGen(0, count($default) - 1, $numDefault);;

    //Get our curated photos and add them to the data list.
    for ( $i = 0; $i < $numDefault; $i += 1 ) {
        $num = $numbers[$i];
        array_push( $curated , $default[$num]);
    }

     //Second SQL query for user's photos
    $sql = "SELECT * FROM Photos";
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

        array_push($user, $photo);
    }

    //Add our default and user arrays to the main array
    array_push($data, $curated);
    array_push($data, $user);

    //Send dat shit back as a JSON object
    echo json_encode($data);
?>