<?php 
	header('Content-type:text/json');
 	$username	= $_POST['username'];
 	$password	= $_POST['password'];
 	$Eword 		= base64_encode($password);
 	$token		= time();
 	$dbc 		= mysqli_connect('localhost','root','','dict') or die ("error");
 	$result 	= mysqli_query($dbc,"SELECT * FROM `users` WHERE user = '$username'");
 	while( $row = mysqli_fetch_array($result)){

 		if($row ['user'] == $username && $row ['password'] == $Eword){
 	 		$state		= true;
 	 		mysqli_query($dbc,"UPDATE `users` SET token='$token' WHERE user='$username'");
 	 		$set        = mysqli_query($dbc,"SELECT * FROM `users` WHERE user = '$username'");
			while( $r   = mysqli_fetch_array($set)){
			   $data	= array ('state' => $state,'name'=>$username,'token'=>$r['token']);
			}
 	 		
 	 	}else{
 	 		$state		= false;
 	 		$data		= array ('state' => $state);
 	 	}
 	}
 	
 	echo json_encode($data,JSON_UNESCAPED_UNICODE);

    mysqli_close($dbc);
?>