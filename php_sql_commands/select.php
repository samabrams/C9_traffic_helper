<?php
function select(){
    global $output, $link;

    $query = 'SELECT name FROM `i5_stations`'; //todo: will require nick's list of exits to update query

    $results = mysqli_query($link, $query);
    $rows = mysqli_num_rows($results);

    for ($i = 0; $i < $rows; $i++) {
        $data = mysqli_fetch_assoc($results);
        array_push($output['data'], $data);
    }
}
?>