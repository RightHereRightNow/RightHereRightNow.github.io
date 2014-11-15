<?php

require_once('OAuth.php');

$CONSUMER_KEY = 'vQDt1XRP96cp8PKpSoTjng';
$CONSUMER_SECRET = '0eM9MxRUlXL4o47m7cpQEPgR_p8';
$TOKEN = 'zUTnrBovkPeORRyRWdDcrjY7jS_L2h29';
$TOKEN_SECRET = 'A5L5DIi0t6B_AJEi16jcxUUCheE';


$API_HOST = 'api.yelp.com';
$SEARCH_PATH = '/v2/search';
$BUSINESS_PATH = '/v2/business/';

/** 
 * Makes a request to the Yelp API and returns the response
 * 
 * @param    $host    The domain host of the API 
 * @param    $path    The path of the APi after the domain
 * @return   The JSON response from the request      
 */
function request($host, $path) {
    $unsigned_url = "http://" . $host . $path;

    // Token object built using the OAuth library
    $token = new OAuthToken($GLOBALS['TOKEN'], $GLOBALS['TOKEN_SECRET']);

    // Consumer object built using the OAuth library
    $consumer = new OAuthConsumer($GLOBALS['CONSUMER_KEY'], $GLOBALS['CONSUMER_SECRET']);

    // Yelp uses HMAC SHA1 encoding
    $signature_method = new OAuthSignatureMethod_HMAC_SHA1();

    $oauthrequest = OAuthRequest::from_consumer_and_token(
        $consumer, 
        $token, 
        'GET', 
        $unsigned_url
    );
    
    // Sign the request
    $oauthrequest->sign_request($signature_method, $consumer, $token);
    
    // Get the signed URL
    $signed_url = $oauthrequest->to_url();
    

    // Send Yelp API Call
    $ch = curl_init($signed_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $data = curl_exec($ch);
    curl_close($ch);
    
    return $data;
}


/**
 * Query the Search API by a search term and location 
 * 
 * @param    $term        The search term passed to the API 
 * @param    $location    The search location passed to the API 
 * @param 	 $sort 		  0=Best Matched, 1=Distance, 2=Highest Rated. 
 * @param    $radius_filter	max 4000(m) (25miles)
 * @param 	 $cll 		  =>latitude,longitude
 * @param 	 $bounds 	  =>sw_latitude,sw_longitude|ne_latitude,ne_longitude (geographical bounding box)
 * @return   The JSON response from the request 
 * put or cll or bounds....
 */
function search($term, $location, $sort, $radius_filter, $cll, $bounds) {
    $url_params = array();
    if(($location!= '' && $bounds != '') || ($cll != '' && $bounds != '')){
    	echo 'error!';
    	die("apiYELP :: Can't select all this filters! mutually exclusive!");
    }
    if($term != ''){
    	$url_params['term'] = $term;
    }
    if($location != ''){
    	$url_params['location'] = $location;
    }
    if($sort != ''){
    	$url_params['sort'] = $sort;
    }
    if($radius_filter != ''){
    	$url_params['radius_filter'] = $radius_filter;
    }
    if($cll != ''){
    	$url_params['cll'] = $cll;
    }
    if($bounds != ''){
    	$url_params['bounds'] = $bounds;
    }
   
    //echo "<br> params...";
    //var_dump($url_params);
    $search_path = $GLOBALS['SEARCH_PATH'] . "?" . http_build_query($url_params);
    
    return request($GLOBALS['API_HOST'], $search_path);
}

$term = $_GET['term'];
$location = $_GET['location'];
$sort = $_GET['sort'];
$radius_filter = $_GET['radius'];
$cllLat = $_GET['cllLat'];
$cllLong = $_GET['cllLong'];
$ne_long = $_GET['nelong'];
$ne_lat = $_GET['nelat'];
$sw_lat = $_GET['swlat'];
$sw_long = $_GET['swlong'];

if($ne_long == '' || $ne_lat == '' || sw_lat == '' || sw_long == ''){
    $bounds = '';
}else{
    $bounds = $sw_lat.",".$sw_long." | ".$ne_lat.",".$ne_long;
}

if($cllLat == '' || cllLong == ''){
    $cll = '';
}else{
    $cll = $cllLat.','.$cllLong;
}
//echo "bounds ->".$bounds;
//echo "cll ->".$cll;

$sort = intval($sort);

//echo "bounds -> ".$bounds;
//41.8747107, -87.0, 41.8710629, -87.9
//$response = (search('', '', '0','4000','','41.8747107, -87.0 | 41.8710629, -87.9'));
$response = search($term, $location, $sort, $radius_filter, $cll, $bounds);

echo $response;

?>