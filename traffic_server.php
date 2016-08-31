<?php
    //includes credentials to connect to db
    require_once('traffic_db_connect.php');
    //include all sql command pages
    require_once ('php_sql_commands/select.php');

    //initializes data obj to be returned to api call
    $output = [
        'success' => 'true',
        'data' => []
    ];

    //checks if DB link is valid
    if (!$link) {
        $output['success'] = "false";
        $output['message'] = "Unable to connect to database.";
    }

    switch($_POST['command']){
        case 'select';
            select();
            break;
        case 'get';
            
    }


    print_r(json_encode($output));
?>