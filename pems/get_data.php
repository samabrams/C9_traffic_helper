<?php
    require('pems_config.php');

    $url = 'http://http://pems.dot.ca.gov/';
    
    //use network to what key and values are passed
    $postinfo = "username=".$pems_username."&password=".$pems_password."&login=Login&redirect=";

    $cookie_file_path = "cookiefile.data";

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_COOKIEJAR, 'cookiefile.data');  //could be empty, but cause problems on some hosts

    //set the cookie the site has for certain features, this is optional
    curl_setopt($ch, CURLOPT_COOKIE, "cookiename=0");

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_REFERER, $_SERVER['REQUEST_URI']);

    $verbose = fopen('log.txt', 'w+');
    curl_setopt($ch, CURLOPT_STDERR, $verbose);

    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postinfo);

    curl_setopt($ch, CURLOPT_URL, "http://pems.dot.ca.gov/?station_id=1118326&gn=minute&s_time_id=1472515200&lane1=1&dnode=VDS&content=loops&tab=det_timeseries");
    $html = curl_exec($ch);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
    curl_setopt($ch, CURLOPT_URL, "http://pems.dot.ca.gov/?report_form=1&dnode=VDS&content=loops&tab=det_q&export=text&station_id=1114708&s_time_id=1472428800&s_time_id_f=08%2F29%2F2016+00%3A00&e_time_id=1472515140&e_time_id_f=08%2F29%2F2016+23%3A59&tod=all&tod_from=0&tod_to=0&dow_0=on&dow_1=on&dow_2=on&dow_3=on&dow_4=on&dow_5=on&dow_6=on&holidays=on&agg=on&lane1=on&lane2=on&lane3=on&lane4=on&lane5=on&x=occ&y=flow");

    print('<pre>');
    $html = curl_exec($ch);
    print('</pre>');

    curl_close($ch);

?>