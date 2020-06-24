function connect(){
	if(group.length > 1){
		let center = {x: 0, y: 0, z: 0};

		group.forEach(function(item, i){
			center.x += item.x;
			center.y += item.y;
			center.z += item.z;
			if(i > 0){
				lines.forEach(function(l){
					if(l.p1 == item)
						l.p1 = group[0];
					if(l.p2 == item)
						l.p2 = group[0];
				});
				points.splice(points.indexOf(item), 1);
			}
		});

		center.x /= group.length;
		center.y /= group.length;
		center.z /= group.length;

		Object.assign(group[0], center);

		draw();
	}
}

let pointToolsMode = '';

function disconnect(){
	group.forEach(function(item, i){
		let first = true;
		lines.forEach(function(l){
			if(l.p1 == item){
				if(!first){
					let p = item.clone();
					l.p1 = p;
					points.push(p);
				}
				first = false;
			}
			if(l.p2 == item){
				if(!first){
					let p = item.clone();
					l.p2 = p;
					points.push(p);
				}
				first = false;
			}
		});
	});

	group = [];

	draw();
}

function translate(){
	if(pointToolsMode == 'translate'){
		pointToolsMode = '';
		operation = null;
		$('.operate.active').removeClass('active');
		return;
	}
	pointToolsMode = 'translate';

	operation = null;

	$('.operate.active').removeClass('active');
	$('#translate').addClass('active');
}

let globalSystem = false;

$('#cbx').on('change', function(e){
	globalSystem = $(this).prop('checked');
});

function rotate(){

	if(pointToolsMode == 'rotate'){
		pointToolsMode = '';
		operation = null;
		$('.operate.active').removeClass('active');
		return;
	}
	pointToolsMode = 'rotate';

	operation = function(p, _dir, r, center){
		let d = dir.from2Point(cam.pos, cam.target);
		d.normalize();

		let d1 = new dir(0, 1, 0);

		let d2 = dir.mul(d, d1);
		d2.normalize();

		d = dir.sum(d1.mulN(r.x*200), d2.mulN(r.y*200));

		if(globalSystem)
			p.mul(fox.euler(d.x, d.y, d.z));
		else
			p.mul(fox.sdvig(fox.t(center.x, center.y, center.z), fox.euler(d.x, d.y, d.z)));
	}

	$('.operate.active').removeClass('active');
	$('#rotate').addClass('active');
}

function scaling(){

	if(pointToolsMode == 'scaling'){
		pointToolsMode = '';
		operation = null;
		$('.operate.active').removeClass('active');
		return;
	}
	pointToolsMode = 'scaling';

	operation = function(p, _dir, r, center){
		let d = dir.from2Point(cam.pos, cam.target);
		d.normalize();

		let d1 = new dir(0, 1, 0);

		let d2 = dir.mul(d, d1);
		d2.normalize();

		d = dir.sum(d1.mulN(r.y*2), d2.mulN(-r.x*2));
		
		if(globalSystem)
			p.mul(fox.scale(1+d.x, 1+d.y, 1+d.z));
		else
			p.mul(fox.sdvig(fox.t(center.x, center.y, center.z), fox.scale(1+d.x, 1+d.y, 1+d.z)));
		
	}

	$('.operate.active').removeClass('active');
	$('#scaling').addClass('active');
}

function extrude(){

	if(pointToolsMode == 'extrude'){
		pointToolsMode = '';
		operation = null;
		$('.operate.active').removeClass('active');
		return;
	}
	pointToolsMode = 'extrude';

	if(group.length > 0){
		let newG = [];

		let copyLine = [];
		lines.forEach(function(l){
			if(group.includes(l.p1) && group.includes(l.p2))
				copyLine.push([group.indexOf(l.p1), group.indexOf(l.p2)]);
	
		});

		group.forEach(function(item){
			let p = item.clone();
			let l = new line(p, item);

			newG.push(p);
			points.push(p);
			lines.push(l);
		});

		copyLine.forEach(function(l){
			lines.push(new line(newG[l[0]], newG[l[1]]));
		});

		group = newG;
		draw();
	}
}

function fullScaling(){

	if(pointToolsMode == 'fullScaling'){
		pointToolsMode = '';
		operation = null;
		$('.operate.active').removeClass('active');
		return;
	}
	pointToolsMode = 'fullScaling';

	operation = function(p, _dir, r, center, chp){
		
		if(globalSystem)
			center = new point(0, 0, 0);
		else
			center = new point(center.x, center.y, center.z);
		let center2d = new point2d(center, cam.a_matrix());

		let f1 = new dir((chp.x-center2d.x),  (chp.y-center2d.y), 0);
		let f2 = new dir((chp.x+r.x-center2d.x),  (chp.y+r.y-center2d.y), 0);

		//let d = new dir((chp.x-center2d.x)/(chp.x+r.x-center2d.x),  (chp.y-center2d.y)/(chp.y+r.y-center2d.y), 0);

		let f = f2.magnitude()/f1.magnitude();

		if(globalSystem)
			p.mul(fox.scale(f, f, f));
		else
			p.mul(fox.sdvig(fox.t(center.x, center.y, center.z), fox.scale(f, f, f)));

		//let _dir2d = dir.from2Point(p2d, p2d2);
	};

	$('.operate.active').removeClass('active');
	$('#fullScaling').addClass('active');
}

function findCenter(){
	let center = {x: 0, y: 0, z: 0};
	group.forEach(function(item){
		center.x += item.x;
		center.y += item.y;
		center.z += item.z;
	});
	center.x /= group.length;
	center.y /= group.length;
	center.z /= group.length;

	return center;
}

function mirrorHorizontal(){
	if(group.length > 0){

		let center = findCenter();

		group.forEach(function(p){
			if(globalSystem){
				
				p.mul(fox.sdvig(fox.euler(cam.rn.x, cam.rn.y, cam.rn.z), fox.scale(-1, 1, 1)));
			}
			else{
				p.mul(fox.sdvig(fox.t(center.x, center.y, center.z), 
					fox.sdvig(fox.euler(cam.rn.x, cam.rn.y, cam.rn.z), fox.scale(-1, 1, 1))));
			}
		});

		draw();
	}
}

function mirrorVertical(){
	if(group.length > 0){

		let center = findCenter();

		group.forEach(function(p){
			if(globalSystem){
				
				p.mul(fox.sdvig(fox.euler(cam.rn.x, cam.rn.y, cam.rn.z), fox.scale(1, -1, 1)));
			}
			else{
				p.mul(fox.sdvig(fox.t(center.x, center.y, center.z), 
					fox.sdvig(fox.euler(cam.rn.x, cam.rn.y, cam.rn.z), fox.scale(1, -1, 1))));
			}
		});

		draw();
	}
}

function zeroX(){
	let center = findCenter();

	group.forEach(function(item){
		item.x = center.x;
	});

	draw();
}

function zeroY(){
	let center = findCenter();

	group.forEach(function(item){
		item.y = center.y;
	});

	draw();
}

function zeroZ(){
	let center = findCenter();

	group.forEach(function(item){
		item.z = center.z;
	});

	draw();
}