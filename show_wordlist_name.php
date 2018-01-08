<?php

    $user   = $_POST['user'];

    $dbc    = mysqli_connect('localhost','root','','dict') or die ("error");
	$dbc->query("SET NAMES 'UTF8'");  
    $result = mysqli_query($dbc,"SELECT * FROM `tables` WHERE user = '$user'");
   	$arr    = array();
    	while($row = mysqli_fetch_assoc($result)){
        $new_data = array($row['list']);
        $arr = array_merge($arr, $new_data);
    }
 	
 	echo json_encode($arr,JSON_UNESCAPED_UNICODE);

    mysqli_close($dbc);

?>