<?php
function select(){
    global $output, $link;
    $output['data']['onRamp'] = [];
    $output['data']['offRamp'] = [];

    $onRampQuery = 'SELECT DISTINCT a.name, a.ID, a.primaryKey, a.`Abs PM`, a.`lat`, a.`long` FROM `i5_stations` AS a JOIN `i5_speed_5_stations` as b ON a.`ID` = b.`Station Num`'; //todo: will require nick's list of on ramps to update query
    $offRampQuery = 'SELECT DISTINCT a.name, a.ID, a.primaryKey, a.`Abs PM`, a.`lat`, a.`long` FROM `i5_stations` AS a JOIN `i5_speed_5_stations` as b ON a.`ID` = b.`Station Num`'; //todo: will require nick's list of off ramps to update query
    
    $results = mysqli_query($link, $onRampQuery);
    $rows = mysqli_num_rows($results);

    for ($i = 0; $i < $rows; $i++) {
        $data = mysqli_fetch_assoc($results);
        array_push($output['data']['onRamp'], $data);
    }

    $results = mysqli_query($link, $offRampQuery);
    $rows = mysqli_num_rows($results);

    for ($i = 0; $i < $rows; $i++) {
        $data = mysqli_fetch_assoc($results);
        array_push($output['data']['offRamp'], $data);
    }

}
?>