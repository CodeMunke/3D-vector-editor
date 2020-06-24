<?php
 
   $img = $_POST['img'];
   
   $name = 'uploads/img'.date("YmdHis");

   if (strpos($img, 'data:image/png;base64') === 0) {
       
      $img = str_replace('data:image/png;base64,', '', $img);
      $img = str_replace(' ', '+', $img);
      $data = base64_decode($img);
      $file = $name.'.png';
   
      if (file_put_contents($file, $data)) {
         echo "Изображение сохранено";
      } else {
         echo 'The canvas could not be saved.';
      }   
     
   }

   file_put_contents($name.'.json', $_POST['data']);

   if(file_exists ('uploads/spisok.txt')){
	   	$spisok = file_get_contents('uploads/spisok.txt');
		$spisok .= "\n";
	}else
		$spisok = "";

	$spisok .= $name;

	file_put_contents('uploads/spisok.txt', $spisok);

?>