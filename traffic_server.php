<?php
    //includes credentials to connect to db
    require_once('traffic_db_connect.php');

    //initializes data obj to be returned to api call
    $output = [
        'success' => 'true',
        'data' => []
    ];

    if (!$link) {
        $output['success'] = "false";
        $output['message'] = "Unable to connect to database.";
    }

    switch($_POST['command']){
        case 'select';
            select();
    }

    function select(){
        global $output, $link;

        $query = 'SELECT name FROM `i5_stations`';

        $results = mysqli_query($link, $query);
        $rows = mysqli_num_rows($results);

        for ($i = 0; $i < $rows; $i++) {
            $data = mysqli_fetch_assoc($results);
            array_push($output['data'], $data);
        }
    }

    print_r(json_encode($output));
?>