<?php
    $mysql = mysql_connect('localhost', 'root', 'root');
    mysql_select_db('Thesis', $mysql);

    $idList = array();
    $sql = "SELECT photo_link FROM Photos";
    $query = mysql_query($sql);

    while($photoLinks = mysql_fetch_assoc($query)){
        array_push($idList, $photoLinks['photo_link']);
    }

    echo json_encode($idList);
?>