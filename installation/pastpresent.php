<?php
    header('X-Frame-Options: GOFORIT');

    $cookie_name = 'pontikis_net_php_cookie';
unset($_COOKIE[$cookie_name]);
// empty value and expiration one hour before
$res = setcookie($cookie_name, '', time() - 3600); 
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
    <title>Past &amp; Present</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <link rel="shortcut icon" type="image/png" href="img/favicon.png"/>

    <link rel="stylesheet" href="css/style-three.css">

	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>	
    <script src="js/three.min.js"></script>
    <script src="js/stats.min.js"></script>
    <script src='js/THREEx.FullScreen.js'></script>
</head>
<body>
    <!--<iframe src="https://instagram.com/accounts/logout/" width="0" 
height="0">-->
	<div id="container"></div>
    <div id="login">
        <a id="connect-link" href="#"><img src="img/instagram.png" alt="Connect to Instagram"></a>
    </div>    
    <section id="instructions">
        <img src="img/left-arrow.png" id="left-arrow" class="arrow-left-hidden" alt="Left arrow">
        <img src="img/right-arrow.png" id="right-arrow" class="arrow-right-hidden" alt="Right arrow">
        <p class="instruction instruction-visible">Use your mouse to explore.</p>
        <p class="instruction instruction-hidden">Drag photos around to dig deeper, or click to get a closer look.</p>
        <p class="instruction instruction-hidden">Scroll to see things differently.</p>
    </section>
    <section id="HUD">
        <div id="user-position"></div>
    </section>
    <section id="handler" class="handler-hidden">
        <div class="loading-hidden">
            <img src="img/loader.gif" alt="Loading">
            <h2>Loading your photos</h2>
            <p>Please be patient</p>
        </div>
        <div id="user-deny" class="hidden">
            <h2>Oh no!</h2>
            <p>There seems to be an error. We'd hate for you to miss out.</p>
            <a href="./">Try again?</a>
        </div>
    </section>
	<script src="js/script.js"></script>
    <script src="js/main-three.js"></script>
</body>
</html>