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

let rotateMode = false;
canvas.onmousedown = function(e){
	if(e.button == 0){
		let { x, y } = calcCanvas(e);
		let op = null;
		points.forEach(function(item, i){
			if((item.x - x)*(item.x - x) + (item.y - y)*(item.y - y) < 30){
				op = item;
				return;
			}
				
		});

		if(op && !e.ctrlKey){

			edited = op;

		}else{

			let p1;
			if(op === null){
				p1 = new point(x, y);
				points.push(p1);
			}
			else
				p1 = op;

			edited = new point(p1.x, p1.y);

			points.push(edited);

			lines.push(new line(p1, edited));
			draw();
		}

	}

	if(e.button == 2){
		rotateMode = true;
		e.preventDefault();
	}
}

canvas.oncontextmenu = function(e){
	e.preventDefault();
}

canvas.onmouseup = function(e){
	if(e.button == 0){
		if(edited == null)
			return;
		let { x, y } = calcCanvas(e);

		let op = null;
		points.forEach(function(item, i){
			if(item != edited && (item.x - x)*(item.x - x) + (item.y - y)*(item.y - y) < 50){
				op = item;
				return;
			}
		});

		edited.x = x;
		edited.y = y;

		if(op && e.ctrlKey){
			lines.forEach(function(item){
				if(item.p1 == edited)
					item.p1 = op;
				if(item.p2 == edited)
					item.p2 = op;
			});
			points.splice(points.indexOf(edited), 1);
		}
		
		edited = null;
		draw();
	}

	if(e.button == 2){
		rotateMode = false;
		lastMousePos = null;
	}
}

let lastMousePos = null;
canvas.onmousemove = function(e){
	if(edited !== null){
		let { x, y } = calcCanvas(e);
		edited.x = x;
		edited.y = y;
		draw();
	}

	if(rotateMode){
		let c = center(points);
		if(lastMousePos != null){
			fox(points, sdvig(c, mat_ry(e.clientX-lastMousePos.x)));

		}

		lastMousePos = {x: e.clientX, y: e.clientY};
		draw();
	}
}
