<?php
    //includes credentials to connect to db
    require_once('traffic_db_connect.php');
    //include all sql command pages
    require('php_sql_commands/select.php');
    require ('php_sql_commands/getCalc.php');

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
        case 'getCalc';
            function array_change_key(&$array, $old_key, $new_key)
            {
                $array[$new_key] = $array[$old_key];
                unset($array[$old_key]);
                return;

            };
            for ($i = 1; $i < 8; $i++) {
                getCalc($i);
            }
            break;
    }

    print_r(json_encode($output));

?>
