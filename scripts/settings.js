var mode = 0; //0 - выделять, 1 - создавать 3 - настройки

function chmode(_mode){
	mode = _mode;
	$('.toolWindow.active').removeClass('active');
	if(mode == 2){
		$('#settings').addClass('active');
	}

	if(mode == 0){
		$('#cursor').addClass('active');
	}
	if(_mode == 3){
		mode = 0;
		$('#morphing').addClass('active');
	}

	if(_mode == 4){
		$('#saving').addClass('active');
	}

	if(_mode == 5){
		mode = 0;
		$('#pointOperations').addClass('active');
	}

	if(_mode == 1){
		// mode = 0;
		$('#pointCreation').addClass('active');
	}
}


$('#camFov').on("input", function(e){
	fov = $(this).val()/100;
	$('#camFovP').text(fov);
	let proc = fox.proc(fov);
	let str = '';

	for(let i = 0; i < proc.length; i++){
		for(let j = 0; j < proc[i].length; j++){
			str += proc[i][j]+ '  ';
		}
		str += '<br/>';
	}
		
	$('#camFovMatrix').html(str);
	draw();
});

$('.points').on('changePoints', function(e){
	let _this = $(this);
	_this.empty();
	group.forEach(function(item){
		_this.append($('<p>').text(
			'('+item.x.toFixed(2) + '; ' + 
				item.y.toFixed(2) + '; ' + 
				item.z.toFixed(2) + '; '+ 
				item.w.toFixed(2) + ')'));
	});

	_group.forEach(function(item){
		if(!group.includes(item))
			_this.append($('<p>').text(
			'('+item.x.toFixed(2) + '; ' + 
				item.y.toFixed(2) + '; ' + 
				item.z.toFixed(2) + '; '+ 
				item.w.toFixed(2) + ')'));
	});

});

$(canvas).on('wheel', function(e){
	if(!e.deltaY)
		e = window.event;

	e.preventDefault();

	cam.distance += e.deltaY/3;
	if(cam.distance < 2)
		cam.distance = 2;

	let d = dir.from2Point(cam.pos, cam.target);
	d.normalize();
	cam.pos = new point(cam.target.x-d.x*cam.distance, cam.target.y-d.y*cam.distance, cam.target.z-d.z*cam.distance);

	draw();
});

function cancel(){
	alert('ctrl Z');
}

$(document).on('keydown', function(e){

	if(e.code == 'KeyS'){

		let center = new point(0, 0, 0);
		if(group.length > 0){
			center = findCenter();

		}

		let d = dir.from2Point(cam.target, center);

		cam.target.mul(fox.t(d.x, d.y, d.z));
		cam.pos.mul(fox.t(d.x, d.y, d.z));
		cam.distance = 15;
		d = dir.from2Point(cam.pos, cam.target);
		d.normalize();
		cam.pos = new point(cam.target.x-d.x*cam.distance, cam.target.y-d.y*cam.distance, cam.target.z-d.z*cam.distance);
		draw();
	}

	if(e.code == 'KeyX'){
		moveX = !moveX;
		_draw();
	}

	if(e.code == 'KeyY'){
		moveY = !moveY;
		_draw();
	}

	if(e.code == 'KeyZ'){
		if(e.ctrlKey){
			cancel();
			return;
		}else
		moveZ = !moveZ;
		_draw();
	}

	if(e.code == 'KeyG'){
		showGrid = !showGrid;
		_draw();
	}

	if(e.code == 'KeyA' && e.ctrlKey){
		e.preventDefault();
		group = [];
		points.forEach(function(item){
			group.push(item);
		});
		_draw();
	}

	if(e.code == 'Delete'){
		if(group.length > 0){
			group.forEach(function(item){
				points.splice(points.indexOf(item), 1);
				for(let i = 0; i < lines.length; i++){
					if(lines[i].p1 == item || lines[i].p2 == item){
						lines.splice(i, 1);
						i--;
					}
				}
			});
			$(canvas).trigger('deletePoints');
			group = [];
			$('.points').trigger('changePoints');
			draw();
		}
	}

});
