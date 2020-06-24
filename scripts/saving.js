function saving(){

	let linesInd = [];
	for(let i = 0; i < lines.length; i++)
		linesInd.push([points.indexOf(lines[i].p1), points.indexOf(lines[i].p2)]);

	let obj = {
		points,
		lines: linesInd,
		cam
	};

	let str = JSON.stringify(obj);

	let dataURL = canvas.toDataURL();

	console.log(str);

	$.ajax({
		type: "POST", 
	  	url: 'getfile.php',
	  	data: { img: dataURL, data:str},
	  	success: function(msg){
	    	alert(msg);
	    	loads();
  		}
	});
}

function saveLocally() {
	let linesInd = [];
	for(let i = 0; i < lines.length; i++)
		linesInd.push([points.indexOf(lines[i].p1), points.indexOf(lines[i].p2)]);

	let obj = {
		points,
		lines: linesInd,
		cam
	};

	let str = JSON.stringify(obj);

	// let dataURL = canvas.toDataURL();

	console.log(str);

	var fileName = prompt('Введите, пожалуйста, имя файла без расширения:');

	  if (fileName == null)
		  return;

    var a = document.createElement("a");
	  document.body.appendChild(a);
	  a.style = "display: none";

	  var blob = new Blob([str], {type: "octet/stream"}),
	      url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = fileName + ".json";
    a.click();

    window.URL.revokeObjectURL(url);
}

$( document ).ready(function() {
    loads();
});

$('#loads').on('click', 'a', function(e){
	e.preventDefault();

	$.ajax({
		type: "GET", 
		url: $(e.target).parent().attr('href'),
		dataType: "json",
		success: function(msg){
	    	Object.assign(cam, msg.cam);
	    	cam.pos = new point(cam.pos.x, cam.pos.y, cam.pos.z);
	    	cam.target = new point(cam.target.x, cam.target.y, cam.target.z);
	    	
	    	points = [];
	    	for(let i = 0; i<msg.points.length; i++){
	    		points[i] = new point();
	    		Object.assign(points[i] , msg.points[i]);
	    	}
	    	lines = [];
	    	group = [];
	    	_group = [];
	    	for(let i = 0; i<msg.lines.length; i++){
	    		lines.push(new line(points[msg.lines[i][0]], points[msg.lines[i][1]]));
	    	}

	    	draw();
  		}
	});
});

function loads(){
	$.ajax({
		type: "GET", 
		url: "get-spisok.php",
		success: loaded
	});
}

let nowObject = -1;
$('#loads').on('contextmenu', 'img',  function(e){
	e.preventDefault();
	$('#save-menu').css({
		display: 'block',
		top: e.clientY,
		left: e.clientX
	});
	nowObject = $(e.target).parent().data('id');
	$(document).one('click', function(){
		$('#save-menu').css('display', '');
	});
});

const loadLocally = (evt) => {
	const f = evt.target.files[0];
     
	const reader = new FileReader();
	
	reader.onload = function(e) {
		let jsonStr = e.target.result;
		let jsonObj = JSON.parse(jsonStr);

		Object.assign(cam, jsonObj.cam);
		cam.pos = new point(cam.pos.x, cam.pos.y, cam.pos.z);
		cam.target = new point(cam.target.x, cam.target.y, cam.target.z);
		
		points = [];
		for(let i = 0; i<jsonObj.points.length; i++){
			points[i] = new point();
			Object.assign(points[i] , jsonObj.points[i]);
		}
		lines = [];
		group = [];
		_group = [];
		for(let i = 0; i<jsonObj.lines.length; i++){
			lines.push(new line(points[jsonObj.lines[i][0]], points[jsonObj.lines[i][1]]));
		}

		draw();
		// $('#loads').empty();
	// 	for(let i = 0; i < s.length; i++){
	// 		$('#loads').append($('<a><img src = "'+s[i]+'.png"/></a>').attr('data-id', s[i]).attr('href', s[i]+'.json'));
	// }
	};
	reader.readAsText(f);
}

document.getElementById('file-input').addEventListener('change', loadLocally);

function loaded(msg){
	if(msg == 'false')
	{
		$('#loads').empty();
		$('#loads').append('<p class = "center">Сохраните файл с помощью кнопки выше</p>');
		return;
	}
		
	let s = msg.split("\n");
	$('#loads').empty();
	for(let i = 0; i < s.length; i++){
		$('#loads').append($('<a><img src = "'+s[i]+'.png"/></a>').attr('data-id', s[i]).attr('href', s[i]+'.json'));
	}
}

function deleteSaving(){

	if(nowObject != ''){
		$.ajax({
			url: 'delete-file.php',
			type: "GET", 
			data: {id: nowObject},
			success: loaded
		});
	}
}