<?php 
	$key  = $_POST['key'];
	$url  = "http://dict-co.iciba.com/api/dictionary.php?type=json&w=". $key ."&key=9500E35057B63F1A2C34B3430429954B";
	$json = file_get_contents($url);
	echo $json;
?>