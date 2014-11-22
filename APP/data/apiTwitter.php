<?php
include_once('twitteroauth/OAuth.php');
include_once('twitteroauth/twitteroauth.php');

function getConnectionWithAccessToken($oauth_token, $oauth_token_secret) {
    $connection = new TwitterOAuth('C6v2AzOS5LzgOOBttYbJHVoWN', 'Qif9JF3pLkwhGmag9vqTo0vsEUT65snyV8alW5Nt3b2eP5FDfe', $oauth_token, $oauth_token_secret);
    return $connection;
}

$connection = getConnectionWithAccessToken("340619227-Is94Y2d72IoxzqtSiNzypTgwOr2d6VFmzd2JxFgE", "J3btGgG3N8FJeoMZbnJEtsTS41PmKOjjWqcMNzH7031oX");

$qparam = $_GET['qparam'];

$q = '';
for($i=0; $i<count($qparam); $i++){
    if($i == 0){
        $q = $qparam[$i];
    } else{
        $q .= '+'.$qparam[$i];
    }
}

$lat = $_GET['latitude'];
$lon = $_GET['longitude'];
$radius = $_GET['radius'];

$geocode = $lat.','.$lon.','.$radius;
//echo $q;
$parameters = array(
    'q' => $q,
    'count' => '100',
    'geocode' => $geocode

);


$content = $connection->get('search/tweets', $parameters);

echo $content;


?>