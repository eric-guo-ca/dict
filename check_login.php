<?php 
	header('Content-type:text/json');
 	$username	= $_POST['username'];
 	$token		= $_POST['token'];
 	$dbc = mysqli_connect('localhost','root','','dict') or die ("error");
 	$result = mysqli_query($dbc,"SELECT * FROM `users` WHERE user = '$username'");
 	while($row = mysqli_fetch_array($result)){

 		if($row ['user'] == $username && $row ['token'] == $token){
 	 		$state		= true;
 	 		$data		= array ('state' => $state,'name'=>$row ['user']);
 	 	}else{
 	 		$state		= false;
 	 		$data = array ('state' => $state,'name'=>$row ['user']);
 	 	}

 	 	//echo json_encode($data,JSON_UNESCAPED_UNICODE);
 	}
 	
 	echo json_encode($data,JSON_UNESCAPED_UNICODE);
 	mysqli_close($dbc);
?>