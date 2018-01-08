<?php

    $user   = $_POST['user'];
    $list   = $_POST['list'];

    $dbc    = mysqli_connect('localhost','root','','dict') or die ("error");
    $dbc->query("SET NAMES 'UTF8'");  
    $sql    = "SELECT * FROM `tables` WHERE user = '$user'";
    if (mysqli_query($dbc,$sql)){
        $query      = "INSERT INTO tables(user,list)VALUES('$user','$list')";
            if (mysqli_query($dbc, $query)) {
                    $data       = array ('state' => 'ok','message' =>'单词表添加成功');    
                } else {
                    $data       = array ('state' => 'error','message' =>'单词表已存在');   
                }
            }else{
                    $data       = array ('state' => 'error','message' =>'用户系统有错误');   
            }


 	
 	echo json_encode($data,JSON_UNESCAPED_UNICODE);

    mysqli_close($dbc);

?>