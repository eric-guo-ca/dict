<?php

    $id     = $_POST['id'];  
    $list   = $_POST['list'];
    $dbc    = mysqli_connect('localhost','root','','dict') or die ("error");
    $dbc->query("SET NAMES 'UTF8'");  
 
    $query      = "UPDATE `words` SET list = '$list' WHERE id = '$id'";
        if (mysqli_query($dbc, $query)) {
                $data       = array ('state' => 'ok','message' =>'单词表已更新');    
            } else {
                $data       = array ('state' => 'error','message' =>'更新出错');   
            }
       



 	echo json_encode($data,JSON_UNESCAPED_UNICODE);

    mysqli_close($dbc);

?>