<?php 
 	$word	= $_POST['word'];
 	$user	= $_POST['user'];
 	header('Content-type:text/json');
 	$dbc = mysqli_connect('localhost','root','','dict') or die ("error");
?>