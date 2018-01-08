<?php
    
    $user   = $_POST['user'];
    $word   = $_POST['word'];  
    $list   = $_POST['list'];
    $toList = $_POST['toList'];
    $dbc    = mysqli_connect('localhost','root','','dict') or die ("error");
    $dbc->query("SET NAMES 'UTF8'");  
    $query  = "UPDATE `words` SET list = '$toList' WHERE user = '$user' and list ='$list' and word ='$word'";
        if (mysqli_query($dbc, $query)) {
                $data       = array ('state' => 'ok','message' =>'单词表已更新');    
            } else {
                $data       = array ('state' => 'error','message' =>'更新出错');   
            }
       



 	echo json_encode($data,JSON_UNESCAPED_UNICODE);

    mysqli_close($dbc);

?>