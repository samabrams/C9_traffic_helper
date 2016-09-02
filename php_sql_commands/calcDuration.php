<?php

function getCalc(){
    $link = mysqli_connect('iamleonhardt.com', 'Brian', 'ireallyliketraffic', 'traffichelper');
    //global $output, $link;
    $output['data']['calc'] = [];


    //TODO : fix sql query with with SUM() function

    //$startId = $_POST['startKey'];  //int coressponding to ID
    //$endId = $_POST['endKey'];      //int coressponding to ID
    //$date = $_POST['date'];         //day of week as number 1=Sun - 7=Sat
    $startId = 1204198;
    $endId =1204230;
    $date = 2;

    //$startKeyId = 'SELECT primaryKey FROM i5_stations WHERE ID=' . $startId;    //returns 1
    //$endKeyId = 'SELECT primaryKey FROM i5_stations WHERE ID=' . $endId;        //returns 3

    $stationIDQuery = 'SELECT ID FROM `i5_stations` WHERE primaryKey BETWEEN ' . 1 . ' AND ' . 3; //returns ID of 123


    $results = mysqli_query($link, $stationIDQuery);
    $rows = mysqli_num_rows($results);
    $stationIDarr = [];
    for ($i = 0; $i < $rows; $i++) {
        $data = mysqli_fetch_assoc($results);
        array_push($stationIDarr, $data);
    }



    $dateTime=[];
    for($j=0 ; $j < count($stationIDarr); $j++){
        $distanceQuery = 'SELECT duration_in_sec, time FROM i5_speed_5_stations WHERE station_Num = '.$stationIDarr[$j]['ID'].' AND DAYOFWEEK(date) ='.$date;
        $results = mysqli_query($link, $distanceQuery);
        $dateTime[] = $results;
    }

    $rows = count($dateTime);

    $outerArr = [];
    for($a = 0; $a < $rows; $a++){
        $innerRows = mysqli_num_rows($dateTime[$a]);
        $innerArr = [];
        for($b = 0; $b < $innerRows; $b++){
            $data = mysqli_fetch_assoc($dateTime[$a]);
            if($b%2 == 0){
                array_push($innerArr,[$data['time'] => $data['duration_in_sec']] );
            }
        }
        array_push($outerArr,$innerArr);
    }

//    $outputArr['data'] = [];
//    for ($x = 0; $x < $outerArr[0]; $x++){
//        //array_push($outputArr,[$data['time'] => $data['duration_in_sec']] );
//    }

    print_r("<pre>");
    print_r($outerArr);
    print_r("</pre>");

}

getCalc();
?>