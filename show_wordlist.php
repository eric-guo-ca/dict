<?php
	$getpage = $_POST['page'];	
    $user    = $_POST['user'];
	$list    = $_POST['list'];
    $dbc     = mysqli_connect('localhost','root','','dict') or die ("error");
	$dbc->query("SET NAMES 'UTF8'");  
    //$result  = mysqli_query($dbc,"SELECT * FROM `words` WHERE user = '$user' and list ='$list'");

	// 获取当前页数 
	if( isset($getpage) ){ 
		$page = intval( $getpage ); 
	} 
	else{ 
		$page = 1; 
	} 
	// 每页数量 
	$page_size = 20; 
	// 获取总数据量 
	$sql 	   = "SELECT count(word) FROM `words` WHERE user = '$user' and list ='$list'"; 
	$result    = mysqli_query($dbc,$sql); 
	$row       = mysqli_fetch_array($result); 
	$amount    = $row['count(word)'];
	$arr 	   = array(); 
	// 记算总共有多少页 
	if( $amount ){ 
		if( $amount < $page_size ){ $page_count = 1; } //如果总数据量小于$PageSize，那么只	有一页 

		if( $amount % $page_size ){ //取总数据量除以每页数的余数 
			$page_count = (int)($amount / $page_size) + 1; //如果有余数，则页数等于总数据量除以每页数的结果取整再加一 
		}else{ 
			$page_count = $amount / $page_size; //如果没有余数，则页数等于总数据量除以每页数的	结果 
		} 
	} 
	else{ 
		$page_count = 0; 
	}
	// 获取数据，以二维数组格式返回结果 
	if( $amount ){ 
		$sql2 = "SELECT * FROM `words` WHERE user = '$user' and list ='$list' order by id desc limit ". ($page-1)*$page_size .",$page_size"; 
		$result2 = mysqli_query($dbc,$sql2);

		while ( $row2 = mysqli_fetch_array($result2) ){ 
				$new_data	= array ('id' => $row2['id'],'word' => $row2['word'],'learned'=>$row2['learned'],'list'=>$row2['list']);
    			array_push($arr, $new_data);
		} 
	}else{ 
		$arr = array(); 
	} 

	$data = array('words' => $arr, 'totalpage' => $page_count);
  //   $arr = array();
  //  	while(  $row = mysqli_fetch_array($result))
  //  	{
  //   	$new_data	= array ('id' => $row['id'],'word' => $row['word'],'learned'=>$row['learned'],'list'=>$row['list']);
  //   	array_push($arr, $new_data);
  //   }
 	   
    echo json_encode($data,JSON_UNESCAPED_UNICODE);

    mysqli_close($dbc);

?>