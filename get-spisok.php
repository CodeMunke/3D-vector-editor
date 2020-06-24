<?php
	if(file_exists('uploads/spisok.txt'))
		echo file_get_contents('uploads/spisok.txt');
	else
		echo 'false';

?>