<?php

    $user    = $_POST['user'];
	$list    = $_POST['list'];
    $dbc     = mysqli_connect('localhost','root','','dict') or die ("error");
	$dbc->query("SET NAMES 'UTF8'");  
    $result  = mysqli_query($dbc,"SELECT * FROM `words` WHERE user = '$user' and list ='$list'");
    $arr 	 = array(); 
	while ( $row = mysqli_fetch_array($result) ){ 
			array_push($arr, $row['word']);
	} 

  //   $arr = array();
  //  	while(  $row = mysqli_fetch_array($result))
  //  	{
  //   	$new_data	= array ('id' => $row['id'],'word' => $row['word'],'learned'=>$row['learned'],'list'=>$row['list']);
  //   	array_push($arr, $new_data);
  //   }
 	   
    echo json_encode($arr,JSON_UNESCAPED_UNICODE);

    mysqli_close($dbc);

?>