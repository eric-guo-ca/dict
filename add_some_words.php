<?php

    $words   = $_POST['words'];
    $user    = $_POST['user'];
    $list    = $_POST['list'];

    $dbc     = mysqli_connect('localhost','root','','dict') or die ("error");
    $dbc->query("SET NAMES 'UTF8'");  
    $sql     = "SELECT * FROM `tables` WHERE user = '$user' and list ='$list'";
    if (mysqli_query($dbc,$sql)){
        foreach ($words as $word) {
                 $query      = "INSERT INTO words(word,user,list)VALUES('$word','$user','$list')";
                 $result     = mysqli_query($dbc,$query);
            }
       
            if ($result) {
                    $data       = array ('state' => 'ok','message' =>'单词已添加成功');    
                } else {
                    $data       = array ('state' => 'error','message' =>'单词已存在');   
                }
            }else{
                    $data       = array ('state' => 'error','message' =>'单词表或用户有错误');   
            }

 	
 	echo json_encode($data,JSON_UNESCAPED_UNICODE);

    mysqli_close($dbc);

?>