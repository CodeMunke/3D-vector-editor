<?php 

	if($_GET['id'] != ''){

		$str = explode("\n", file_get_contents('uploads/spisok.txt'));

		$str2 = '';

		foreach ($str as $s)
			if(strcmp($s, $_GET['id']) != 0){
				if($str2 != '')
					$str2 .= "\n";
				$str2 .= $s;
			}
		

		file_put_contents('uploads/spisok.txt', $str2);
		echo $str2;

	}

?>