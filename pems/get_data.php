<?php
    require ('pems_config.php');
    function fetch_data($pems_username, $pems_password, $stationID)
    {
        $url = 'http://http://pems.dot.ca.gov/';

        //use network to what key and values are passed
        $postinfo = "username=" . $pems_username . "&password=" . $pems_password . "&login=Login&redirect=";

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
        //curl_setopt($ch, CURLOPT_URL, "http://pems.dot.ca.gov/?report_form=1&dnode=VDS&content=loops&tab=det_timeseries&export=text&station_id=1204198&s_time_id=1473206400&s_time_id_f=09%2F07%2F2016+00%3A00&e_time_id=1473278340&e_time_id_f=09%2F07%2F2016+19%3A59&tod=all&tod_from=0&tod_to=0&dow_0=on&dow_1=on&dow_2=on&dow_3=on&dow_4=on&dow_5=on&dow_6=on&holidays=on&q=q&q2=&gn=5min&agg=on&lane1=on&lane2=on&lane3=on&lane4=on");

        //todo: needs to be synced with crontab on apache server
        $startTime = 1473206400; //do not change - will always be 00:00
        $startDate = date('m-d-Y', strtotime('-1 week'));
        $startDate = str_replace("-", "%2F", $startDate);

        $endTime = 1473292740;   //do not change - will always be 23:59
        $endDate = date('m-d-Y', strtotime('-13 days'));
        $endDate = str_replace("-", "%2F", $endDate);

        $exportType = 'text'; //or xls file
        
        $templateURL = "http://pems.dot.ca.gov/?report_form=1&dnode=VDS&content=loops&tab=det_timeseries&export={$exportType}&station_id={$stationID}&s_time_id={$startTime}&s_time_id_f={$startDate}+00%3A00&e_time_id={$endTime}&e_time_id_f={$endDate}%3A59&tod=all&tod_from=0&tod_to=0&dow_0=on&dow_1=on&dow_2=on&dow_3=on&dow_4=on&dow_5=on&dow_6=on&holidays=on&q=q&q2=&gn=5min&agg=on&lane1=on&lane2=on&lane3=on&lane4=on";

        curl_setopt($ch, CURLOPT_URL, $templateURL);

        //todo: determine if xls or txt is better to upload to DB
        //todo: talk to team about using only aggregates for calculations
        
    print('<pre>');
        $html = curl_exec($ch);
    print('</pre>');

        curl_close($ch);
    }

    //todo: send data to DB code

?>