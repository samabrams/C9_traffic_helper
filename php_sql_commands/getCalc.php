<?php
function getCalc(){
    $link = mysqli_connect('iamleonhardt.com', 'Brian', 'ireallyliketraffic', 'traffichelper');
    //global $output, $link;
    $output['data']['calc'] = ['test'];

    //$startId = $_POST['startKey'];  //int coressponding to ID
    //$endId = $_POST['endKey'];      //int coressponding to ID
    //$date = $_POST['date'];         //day of week as number 1=Sun - 7=Sat
    $startId = 1204198;
    $endId =1204230;
    $date =2;

    $startKeyId = 'SELECT primaryKey FROM i5_stations WHERE ID=' . $startId;    //returns 1
    $endKeyId = 'SELECT primaryKey FROM i5_stations WHERE ID=' . $endId;        //returns 3

    $stationIDQuery = 'SELECT ID FROM `i5_stations` WHERE primaryKey BETWEEN ' . $startKeyId . ' AND ' . $endKeyId; //returns ID of 123

    $timeDuration = 'SELECT * FROM i5_speed_5_stations WHERE DAYOFWEEK(time_date) = ' . $date; //returns all rows corresponding to the day of week


//    $results = mysqli_query($link, $speedQuery);
//    $rows = mysqli_num_rows($results);
//
//    for ($i = 0; $i < $rows; $i++) {
//        $data = mysqli_fetch_assoc($results);
//        array_push($output['data']['onRamp'], $data);
//    }

    //$callStartKeyID = mysqli_query($link, $startKeyId);
    //$callEndKeyID = mysqli_query($link, $endKeyId);



}

?>