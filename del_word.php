<?php

    $id     = $_POST['id'];  

    $dbc    = mysqli_connect('localhost','root','','dict') or die ("error");
    $dbc->query("SET NAMES 'UTF8'");  
 
    $query      = "DELETE FROM `words` WHERE id = '$id'";
        if (mysqli_query($dbc, $query)) {
                $data       = array ('state' => 'ok','message' =>'单词已删除');    
            } else {
                $data       = array ('state' => 'error','message' =>'单词不存在');   
            }
       



 	echo json_encode($data,JSON_UNESCAPED_UNICODE);

    mysqli_close($dbc);

?>