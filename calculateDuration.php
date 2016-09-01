<?php
require_once('traffic_db_connect.php');

$retrieveAvgSpeed = 'SELECT * FROM `avg_speed`';
$results = mysqli_query($link, $retrieveAvgSpeed);
$arr = [];  //array of id, station_num time_mark,speed, duration, distance
$length = mysqli_num_rows($results);

for($i = 0; $i < $length; $i++){
    $eachRow = mysqli_fetch_assoc($results);
    array_push($arr,$eachRow);
}

$stationListing = 'SELECT `id`,`length` FROM `station_listing_i5_n`';
$listingAnswer = mysqli_query($link, $stationListing);
$listingArr = []; //array of  stationID and distance
$listingLength = mysqli_num_rows($listingAnswer);

for($i = 0; $i < $listingLength; $i++){
    $row = mysqli_fetch_assoc($listingAnswer);
    array_push($listingArr,$row);
}
// $arr - longer one
// $listingArr - short list
foreach($listingArr as $k=>$v){
    foreach ($arr as $k2=>$v2){
        if($v2['station_Num'] == $v['id']){
            $arr[$k2]['distance'] = $v['length'];
        }
    }
}


foreach( $arr as &$value){
    //miles / (miles/hour) * 60 * 60 == duration in sec
    $value['duration'] = ($value['distance']/$value['speed'])*3600; //in seconds
    //$updateDistance = 'UPDATE `avg_speed` SET distance = $value["distance"] WHERE station_Num IN($value["station_Num"]) ';
    $distance = $value['distance'];
    $station = $value['station_Num'];
    //mysqli_query($link, "UPDATE `avg_speed` SET `distance` = '$distance' WHERE `station_Num` = $station");
}


echo '<pre>';
print_r($arr);
echo '</pre>';


?>