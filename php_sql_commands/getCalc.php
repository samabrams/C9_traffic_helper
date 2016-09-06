<?php
function getCalc(){
    global $link, $output;
    
    $output['data'] = [];

    //TODO : fix sql query with with SUM() function

    $startId = $_POST['startKey'];
    $endId = $_POST['endKey'];
    $date = $_POST['date'];

    $startKeyId = 'SELECT primaryKey FROM i5_stations WHERE ID=' . $startId;
    $startResults = mysqli_query($link, $startKeyId);
    $startData = mysqli_fetch_assoc($startResults);

    $endKeyId = 'SELECT primaryKey FROM i5_stations WHERE ID=' . $endId;
    $endResults = mysqli_query($link, $endKeyId);
    $endData = mysqli_fetch_assoc($endResults);

    $stationIDQuery = 'SELECT ID FROM `i5_stations` WHERE primaryKey BETWEEN ' . $startData . ' AND ' . $endData; //returns ID of 1,2,3
    $results = mysqli_query($link, $stationIDQuery);
    $rows = mysqli_num_rows($results);
    $stationIDarr = [];
    for ($i = 0; $i < $rows; $i++) {
        $data = mysqli_fetch_assoc($results);
        array_push($stationIDarr, $data);
    }

    $dateTime=[];
    for($j=0 ; $j < count($stationIDarr); $j++){
        $distanceQuery = 'SELECT duration_in_sec, time FROM i5_speed_5_stations WHERE station_Num = '.$stationIDarr[$j]['ID'].' AND DAYOFWEEK(date) ='.$date;//returns duration and time based on the ID
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
        array_push($outerArr,$innerArr);// creates arrays inside an array based on all traveled stations. each inner array has key => value (time(every 10min increment) and duration)
    }

    $timeQuery = 'SELECT time FROM i5_speed_5_stations WHERE station_Num = '.$startId.' AND DAYOFWEEK(date) ='.$date;//returns time
    //because $innerArr's key (time value) does not have a var name associated with it, cannot actually call time that would be used as a key for final output array.
    //$data['time'] has already been used(which is currently 23:55:00), cannot be reset to 00:00:00
    $time = mysqli_query($link,$timeQuery);
    $timeRow = mysqli_num_rows($time);
    $timeArr = [];
    for($h = 0; $h < $timeRow;$h++){
        $timeVal = mysqli_fetch_assoc($time);
        if($h % 2 == 0){
            $timeArr[]=$timeVal; //returns an array of key => value (number position and time)
        }
    }

    $finalOutput = []; //will hold time as key and summed up duration as value
    for($k=0; $k < count($timeArr); $k++){
        $finalOutput[] = [$timeArr[$k]['time'] => 0];
    }

    for($o = 0; $o < count($outerArr); $o++){
        for($l = 0; $l < count($outerArr[0]);$l++){
            $finalOutput[$l][$timeArr[$l]['time']] += $outerArr[$o][$l][$timeArr[$l]['time']];
        }
    }

    function array_change_key(&$array, $old_key, $new_key)
    {
        $array[$new_key] = $array[$old_key];
        unset($array[$old_key]);
        return;

    };

    foreach($finalOutput as $key => &$value){
        foreach($value as $innerKey => $innerValue){
            $oldKey = $innerKey;    //key
            $newKey = substr(str_replace(":","",$innerKey),0,4);
            //array_change_key($finalOutput[0],$oldKey,$newKey);
            array_change_key($value, $oldKey, $newKey);
        }
    }
    
    $output['data'] = $finalOutput;
}
?>