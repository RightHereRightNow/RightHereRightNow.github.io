<?php


$BASEADD = 'https://api.uber.com/v1/';
$PRODUCTS = 'products?';
$TIME = 'estimates/time?';
$PRICE = 'estimates/price?';

$token = 'server_token=D8-iEAt4izgYIKJsHaauXalkchbHQma6_8FgSfOu';
$filter = $_GET['filter'];

switch ($filter) {
	case 'products':
		$completeUrl = $BASEADD.$PRODUCTS;
		$lat = $_GET['latitude'];
		$lon = $_GET['longitude'];
		$completeUrl .= $token.'&latitude='.$lat.'&longitude='.$lon;
		break;
	case 'time':
		$completeUrl = $BASEADD.$TIME;
		$slat = $_GET['start_latitude'];
		$slon = $_GET['start_longitude'];
		// $elat = $_GET['end_latitude'];
		// $elon = $_GET['end_longitude'];
		$completeUrl .= $token.'&start_latitude='.$slat."&start_longitude=".$slon;
		//echo file_get_contents('https://api.uber.com/v1/estimates/time?server_token=D8-iEAt4izgYIKJsHaauXalkchbHQma6_8FgSfOu&start_latitude=41.8710629&start_longitude=%20-87.6758785&end_latitude=41.8747107&end_longitude=-87.6968277');
		break;
	case 'price':
		$completeUrl = $BASEADD.$PRICE;
		$slat = $_GET['start_latitude'];
		$slon = $_GET['start_longitude'];
		$elat = $_GET['end_latitude'];
		$elon = $_GET['end_longitude'];
		$completeUrl .= $token.'&start_latitude='.$slat."&start_longitude=".$slon."&end_latitude=".$elat."&end_longitude=".$elon;
		break;
	default:
		die("ERROR:FIltering");
		break;
}
// $lat = '41.8747107';
// $long = '-87.0';




// echo $completeUrl;
// echo $lat;
// echo $lon;
$res = file_get_contents($completeUrl);
echo $res;


?>
