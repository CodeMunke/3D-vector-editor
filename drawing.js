var canvas = document.getElementById('can');
var ctx = canvas.getContext('2d');

function point(x, y, z = 0, w = 1){
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;

	this.toArray = function(){
		return [this.x, this.y, this.z, this.w];
	}

	this.fromArray = function(arr){
		this.x = arr[0];
		this.y = arr[1];
		this.z = arr[2];
		this.w = arr[3];
	}

	this.normalize = function(arr){
		if(this.w == 1) return;
		this.x /= this.w;
		this.y /= this.w;
		this.z /= this.w;
		this.w /= this.w;
	}
}


function line(p1, p2){
	if(!p1)
		p1 = new point(0, 0, 0);
	if(!p2)
		p2 = new point(p1.x+100, p1.y, p1.z);

	this.p1 = p1;
	this.p2 = p2;
}

let lines = new Array();
let points = new Array();

let edited = null;

var rb = null;

function draw(){
	rb = sdvig(center(points), mProc(0.002));
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();

	lines.forEach(function(item){
		let p1 = pp(item.p1);
		let p2 = pp(item.p2);
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
	});

	ctx.lineWidth = 2;
	ctx.stroke();

	
	points.forEach(function(item){
		ctx.beginPath();
		let p = pp(item);
		ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI, false);
	 	ctx.fillStyle = 'green';
      	ctx.fill();
	});

	$('body').trigger('draw');
}
let perspective = false;
function pp(p){
	if(perspective)
		return _fox(p, rb);
	else
		return p;
}

function _fox(x, m){
	let _x = x.toArray();
	let _m = [];
	for(let j = 0; j < 4; j++){
		let sum = 0;
		for(let i = 0; i < 4; i++){
			sum += _x[i]*m[i][j];
		}
		_m.push(sum);
	}
	let p = new point(0, 0, 0, 0);
	p.fromArray(_m);
	p.normalize();
	return p;
}

function fox(x, m){
	if(Array.isArray(x)){
		x.forEach(function(item){
			fox(item, m);
		});
		
	}else{
		let _x = x.toArray();
		let _m = [];
		for(let j = 0; j < 4; j++){
			let sum = 0;
			for(let i = 0; i < 4; i++){
				sum += _x[i]*m[i][j];
			}
			_m.push(sum);
		}
		x.fromArray(_m);
		x.normalize();
	}
	
}
