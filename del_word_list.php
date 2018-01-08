<?php

    $user   = $_POST['user'];
    $list   = $_POST['list'];

    $dbc    = mysqli_connect('localhost','root','','dict') or die ("error");
    $dbc->query("SET NAMES 'UTF8'");  
    $sql    = "SELECT count(list) FROM `words` WHERE user = '$user' and list = '$list'";
    $count  = mysqli_query($dbc,$sql);
    $row    = mysqli_fetch_array($count);

    if ($row['count(list)'] =='0'){
        $query      = "DELETE FROM tables WHERE user = '$user' and list = '$list'";
            if (mysqli_query($dbc, $query)) {
                    $data       = array ('state' => 'ok','message' =>'单词表已删除');    
                } else {
                    $data       = array ('state' => 'error','message' =>'单词表或用户不存在');   
                }
            }else{
                    $data       = array ('state' => 'error','message' =>'单词表中有单词不能删除');   
            }


 	echo json_encode($data,JSON_UNESCAPED_UNICODE);

    mysqli_close($dbc);

?>