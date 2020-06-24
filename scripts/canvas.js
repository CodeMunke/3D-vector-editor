var canvas = document.getElementById('can');
var ctx = canvas.getContext('2d');

var _scale = 500;

$('.toolIcon').click(function(){
	$('.toolIcon.active').removeClass('active');
	$(this).addClass('active');
});

function draw(){
	scale = _scale*(fov+0.05);
	to2d();
	_draw();

	$('body').trigger('draw');
}

function drawLine(item){
	if(item.canDraw == null || item.canDraw()){
		ctx.beginPath();

		ctx.moveTo(link.get(item.p1).x*scale+canvas.width/2, canvas.height/2-link.get(item.p1).y*scale);
		ctx.lineTo(link.get(item.p2).x*scale+canvas.width/2, canvas.height/2-link.get(item.p2).y*scale);
		ctx.strokeStyle = item.color;
		ctx.lineWidth = item.width;
		ctx.stroke();
	}
}

function _draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	points2d.sort((a,b) => b.z-a.z);

	gridLines.forEach(function(item){
		drawLine(item);
	});

	lines.forEach(function(item){
		drawLine(item);
	});

	points2d.forEach(function(p){
		if(p.z < 0)
			return;
		ctx.beginPath();
		ctx.arc(p.x*scale+canvas.width/2, canvas.height/2-p.y*scale, 5, 0, 2 * Math.PI, false);
		if(_group.includes(p.point) || group.includes(p.point))
			ctx.fillStyle = '#240051';
		else
 			ctx.fillStyle = p.color;
      	ctx.fill();
	});
}

function calcCanvas(e){
	let x, y;
	if (e.pageX || e.pageY) { 
	  x = e.pageX;
	  y = e.pageY;
	}
	else { 
	  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
	  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	} 
	x -= e.target.offsetLeft+2;
	y -= e.target.offsetTop+2;
	return {x, y};
}

let rotateMode = false,
	lastMousePos = null,
	moveMode = false;
let chPoint = null;

let startPoint = null;


canvas.onmousedown = function(e){
	e.preventDefault();

	if(e.button == 0){
		let { x, y } = calcCanvas(e);
		x = (x-canvas.width/2)/scale;
		y = (canvas.height/2-y)/scale;

		if(mode == 0 || mode == 1 && e.shiftKey){
			lastPos2d = {x, y};
			chPoint = null;
			points2d.forEach(function(item){
				let d = dir.from2Point(new point(item.x, item.y), new point(x, y));
				if(d.magnitude() < 10/scale)
					chPoint = item;
			});
			if(!chPoint){
				startPoint = {x, y};
				if (!e.shiftKey){
					group = [];
					$('.points').trigger('changePoints');
				}
			}else{ 
				if (!e.shiftKey || mode == 1){
					if(group.includes(chPoint.point)){

					}else{
						group = [chPoint.point];
						$('.points').trigger('changePoints');
					}
				}else{
					if(!group.includes(chPoint.point))
						group.push(chPoint.point);
					else
						group.splice(group.indexOf(chPoint.point), 1);
					$('.points').trigger('changePoints');
					chPoint = null;
				}

				_draw();
			}
		}

		if(mode == 1 && !e.shiftKey){
			chPoint = null;

			points2d.forEach(function(item){
				let d = dir.from2Point(new point(item.x, item.y), new point(x, y));
				if(d.magnitude() < 10/scale)
					chPoint = item;
			});

			let p = null;
			if(chPoint == null){
				let zero = point.fromArray(mx.mul([[0, 0, 0, 1]], cam.a_matrix())[0]);
				zero.normalize();

				p = point.fromArray(mx.mul([[x, y, zero.z, 1]], cam.matrix())[0]);
				p.normalize();

				
				let dd = dir.from2Point(cam.pos, p);

				p.x = cam.pos.x+dd.x;
				p.y = cam.pos.y+dd.y;
				p.z = cam.pos.z+dd.z;

				points.push(p);
			}else{
				p = chPoint.point;
			}
			let p2 = new point(p.x, p.y, p.z);
			points.push(p2);
			lines.push(new line(p, p2));
			group = [p2];
			draw();

			chPoint = link.get(p2);
		}
	}

	if(e.button == 2){
		rotateMode = true;
	}
}


canvas.onmouseup = function(e){

	let { x, y } = calcCanvas(e);
		x = (x-canvas.width/2)/scale;
		y = (canvas.height/2-y)/scale;

	if(e.button == 0){
		lastPos2d = null;
		if(chPoint){

			let chPoint2 = null;
			points2d.forEach(function(item){
				let d = dir.from2Point(new point(item.x, item.y), new point(x, y));
				if(d.magnitude() < 10/scale && item.point != chPoint.point)
					chPoint2 = item;
			});

			let dels = false;

			if(chPoint2 != null && e.ctrlKey){
				lines.forEach(function(item2){
					if(item2.p1 == chPoint.point){
						item2.p1 = chPoint2.point;
						dels = true;
						return;
					}

					if(item2.p2 == chPoint.point){
						item2.p2 = chPoint2.point;
						dels = true;
						return;
					}
				});
				if(dels){
					$(canvas).trigger('deletePoints');
					points.splice(points.indexOf(chPoint.point), 1);
				}
			}
			chPoint = null;
			draw();
		}

		if(startPoint){

			startPoint = null;
			if(!e.shiftKey){
				group = _group;
				_group = [];
				$('.points').trigger('changePoints');
			}else{
				_group.forEach(function(item){
					if(!group.includes(item)){
						group.push(item);
					}
				});
			}
			$('.points').trigger('changePoints');
			_draw();
		}
	}
	e.preventDefault();
	if(e.button == 2){
		rotateMode = false;
		moveMode = false;
		lastMousePos = null;
	}
}

canvas.oncontextmenu = function(e){
	e.preventDefault();
}

function toCanvas(obj){
	return {
		x: obj.x*scale+canvas.width/2, 
		y: canvas.height/2-obj.y*scale};
}

let group = [];
let _group = [];
var operation = null;

let lastPos2d = null;
canvas.onmousemove = function(e){

	let { x, y } = calcCanvas(e);
	x = (x-canvas.width/2)/scale;
	y = (canvas.height/2-y)/scale;

	if(startPoint){

		let point1 = toCanvas({x, y});
		let point2 = toCanvas(startPoint);

		let x1 = Math.min(point1.x, point2.x);
		let x2 = Math.abs(point1.x-point2.x);

		let y1 = Math.min(point1.y, point2.y);
		let y2 = Math.abs(point1.y-point2.y);
		_group = [];

		let ch =false;
		points2d.forEach(function(item){

			if(item.z > 0){
				let pos = toCanvas(item);
				if(pos.x > x1 && pos.x < x1+x2 && pos.y > y1 && pos.y < y1+y2){
					_group.push(item.point);
					ch = true;
				}
			}
		});

		if(ch)
			$('.points').trigger('changePoints');

		_draw();
		ctx.beginPath();
		ctx.rect(x1, y1, x2, y2);
		ctx.strokeStyle = "#444444";
		ctx.lineWidth = "1";
		ctx.stroke();

	}

	if(chPoint){
		let p = point.fromArray(mx.mul([[x, y, chPoint.z, 1]], cam.matrix())[0]);
		p.normalize();
		
		let _point = chPoint.point;

		let _dir = dir.from2Point(_point, p);

		if(operation != null){
			let center = {x: 0, y: 0, z: 0};
			group.forEach(function(item){
				center.x += item.x;
				center.y += item.y;
				center.z += item.z;
			});
			center.x /= group.length;
			center.y /= group.length;
			center.z /= group.length;

			group.forEach(function(item){
				operation(item, _dir, {x: x-lastPos2d.x, y: y-lastPos2d.y}, center, chPoint);
			});

		}else{
			if(!moveX)
				_dir.x = 0;
			if(!moveY)
				_dir.y = 0;
			if(!moveZ)
				_dir.z = 0;
			group.forEach(function(item){
				item.mul(fox.t(_dir.x, _dir.y, _dir.z));
			});

		}


		//_point.x = p.x;
		//_point.y = p.y;
		//_point.z = p.z;

		draw();
		$('.points').trigger('changePoints');
		chPoint = link.get(_point);
	}

	if(rotateMode){

		moveMode = e.ctrlKey;

		if(lastMousePos != null){
			let x = e.clientX-lastMousePos.x;
			let y = e.clientY-lastMousePos.y;

			let oldDir = dir.from2Point(cam.pos, cam.target);

			let right = dir.mul(oldDir, new dir(0, 1, 0));

			right.normalize();

			let up = dir.mul(right, oldDir);
			up.normalize();
			speed = 0.08;
			if(moveMode){
				speed = 0.02;
				cam.target.x = cam.target.x+ right.x*x* speed + up.x*y*speed;
				cam.target.y = cam.target.y+ right.y*x* speed + up.y*y*speed;
				cam.target.z = cam.target.z+ right.z*x* speed + up.z*y*speed;
				$('#matr').text(cam.target.x + ' '+ cam.target.y + ' ' + cam.target.z);
			}

			cam.pos.x = cam.pos.x+ right.x*x* speed + up.x*y*speed;
			cam.pos.y = cam.pos.y+ right.y*x* speed + up.y*y*speed;
			cam.pos.z = cam.pos.z+ right.z*x* speed + up.z*y*speed;

			let d = dir.from2Point(cam.pos, cam.target);
			d.normalize();
			cam.pos = new point(cam.target.x-d.x*cam.distance, cam.target.y-d.y*cam.distance, cam.target.z-d.z*cam.distance);

			d.y = 0;
			let d2 = dir.from2Point(cam.pos, cam.target);

			d.normalize();
			d2.normalize();
			
			cam.rn.y = -Math.acos(d.z)/Math.PI*180;
			if(d.x < 0)
				cam.rn.y = -cam.rn.y;

			cam.rn.x = Math.asin(d2.y)/Math.PI*180;
		}

		lastMousePos = {x: e.clientX, y: e.clientY};
		draw();
	}

	if(lastPos2d != null){
		lastPos2d.x = x;
		lastPos2d.y = y; 
	}
}



points.push(new point(-2.5, -2.5, -2.5, 1, 'orange'));
points.push(new point(-2.5, 2.5, -2.5, 1, 'orange'));
points.push(new point(-2.5, -2.5, 2.5));
points.push(new point(-2.5, 2.5, 2.5));

points.push(new point(2.5, -2.5,  -2.5, 1,  'orange'));
points.push(new point(2.5, 2.5,  -2.5, 1,  'orange'));
points.push(new point(2.5, -2.5, 2.5));
points.push(new point(2.5, 2.5, 2.5));

draw();

function rotate(){
	cam.pos.x = parseInt($('#sdvigx').val());
	cam.pos.y = parseInt($('#sdvigy').val());
	cam.pos.z = parseInt($('#sdvigz').val());
	console.log(cam.pos);
	draw();
}