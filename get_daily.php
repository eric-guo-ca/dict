<?php 
	$url  = "http://open.iciba.com/dsapi";
	$json = file_get_contents($url);
	echo $json;
?>