<?php
function getCalc($startKey, $endKey, $day){
    global $output, $link;
    $output['data']['calc'] = [];

    $speedQuery = 'SELECT * FROM `i5_speed_5_stations` WHERE';

    $results = mysqli_query($link, $speedQuery);
    $rows = mysqli_num_rows($results);

    for ($i = 0; $i < $rows; $i++) {
        $data = mysqli_fetch_assoc($results);
        array_push($output['data']['onRamp'], $data);
    }
}
?>