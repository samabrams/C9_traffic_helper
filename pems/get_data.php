<?php
require('pems_config.php');

$url = 'http://http://pems.dot.ca.gov/';
$postinfo = "username=".$pems_username."&password=".$pems_password."&login=Login&redirect=";

$cookie_file_path = "cookiefile.data";

$ch = curl_init();
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_NOBODY, false);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

//curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie_file_path);
curl_setopt($ch, CURLOPT_COOKIEJAR, 'cookiefile.data');  //could be empty, but cause problems on some hosts
//curl_setopt($ch, CURLOPT_COOKIEFILE, ''); 
//set the cookie the site has for certain features, this is optional
curl_setopt($ch, CURLOPT_COOKIE, "cookiename=0");
curl_setopt($ch, CURLOPT_USERAGENT,
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_REFERER, $_SERVER['REQUEST_URI']);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 0);
curl_setopt($ch, CURLOPT_VERBOSE, true);

$verbose = fopen('log.txt', 'w+');
curl_setopt($ch, CURLOPT_STDERR, $verbose);
//added
//curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postinfo);
// print("THIS IS A TEST");
// if (curl_error($ch)) {
//     echo curl_error($ch);
// }
$test = curl_exec($ch);
//print_r($test);
//page with the content I want to grab
//curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
// curl_setopt($ch, CURLOPT_POST, 0);
curl_setopt($ch, CURLOPT_URL, "http://pems.dot.ca.gov/?fwy=5&dir=S&station_id=1118326&dnode=VDS");

//curl_setopt($ch, CURLOPT_HEADER, true);
// curl_setopt($ch, CURLOPT_NOBODY, true);

// //do stuff with the info with DomDocument() etc
$html = curl_exec($ch);

curl_setopt($ch, CURLOPT_URL, "http://pems.dot.ca.gov/?station_id=1118326&gn=minute&s_time_id=1472515200&lane1=1&dnode=VDS&content=loops&tab=det_timeseries");
$html = curl_exec($ch);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
curl_setopt($ch, CURLOPT_URL, "http://pems.dot.ca.gov/?report_form=1&dnode=VDS&content=loops&tab=det_q&export=text&station_id=1114708&s_time_id=1472428800&s_time_id_f=08%2F29%2F2016+00%3A00&e_time_id=1472515140&e_time_id_f=08%2F29%2F2016+23%3A59&tod=all&tod_from=0&tod_to=0&dow_0=on&dow_1=on&dow_2=on&dow_3=on&dow_4=on&dow_5=on&dow_6=on&holidays=on&agg=on&lane1=on&lane2=on&lane3=on&lane4=on&lane5=on&x=occ&y=flow");
$html = curl_exec($ch);
curl_close($ch);

?>