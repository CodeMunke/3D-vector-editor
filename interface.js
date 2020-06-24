let matr = document.getElementById('matr');


$('body').on('draw', function(){
	matr.innerHTML = '';
	points.forEach(function(i){
		matr.innerHTML += '('+ i.x.toFixed(3) +'; '+i.y.toFixed(3) + '; ' + i.z.toFixed(3) + '; ' + i.w.toFixed(3)+ ')<br/>';
	});
});

function mat_rx(r){
	r = r*Math.PI/180;
	return [[1, 0, 0, 0],
			[0, Math.cos(r), -Math.sin(r), 0],
			[0, Math.sin(r), Math.cos(r), 0],
			[0, 0, 0, 1]
	];
}

function mat_ry(r){
	r = r*Math.PI/180;
	return [[Math.cos(r), 0, Math.sin(r), 0],
			[0, 1, 0, 0],
			[-Math.sin(r), 0, Math.cos(r), 0],
			[0, 0, 0, 1]
	];
}


function mat_rz(r){
	r = r*Math.PI/180;
	return [[Math.cos(r), -Math.sin(r), 0, 0],
			[Math.sin(r), Math.cos(r), 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
	];
}


function mat_t(x, y, z){
	return [[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[x, y, z, 1]];
}


function mProc(r){
	return [[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 0, r],
			[0, 0, 0, 1]];
}


function sdvig(c, m){
	let ms = mx.mul(mat_t(-c.x, -c.y, -c.z), m);
	ms = mx.mul(ms, mat_t(c.x, c.y, c.z));
	return ms;
}

function center(m){
	let p = [0, 0, 0, 0];
	m.forEach(function(item){
		let a = item.toArray();
		for(let i = 0; i < 4; i++)
			p[i] += a[i];
		
	});
	for(let i = 0; i < 4; i++)
		p[i] = p[i]/m.length;
	let _p = new point();
	_p.fromArray(p);
	return _p;
}

function rotate(){
	perspective = !perspective;
	draw();
}