class point{
	constructor(x = 0, y = 0, z = 0, w = 1, color = 'green') {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		this.color = color;
	}

	static fromArray(arr){
		return new point(arr[0], arr[1], arr[2], arr[3]);
	}

	toArray(){
		return [this.x, this.y, this.z, this.w];
	}

	mul(matr){
		let pos = mx.mul([this.toArray()], matr)[0];
		
		this.x = pos[0];
		this.y = pos[1];
		this.z = pos[2];
		this.w = pos[3];

		this.normalize();
	}

	normalize(){
		if(this.w == 1) return;
		this.x /= this.w;
		this.y /= this.w;
		this.z /= this.w;
		this.w /= this.w;
	}

	clone(){
		return new point(this.x, this.y, this.z, this.w, this.color);
	}
}

class line{
	constructor(p1, p2, color = 'black', width = 2, canDraw = null) {
		if(!p1)
			p1 = new point(0, 0, 0);

		if(!p2)
			p2 = new point(p1.x, p1.y, p1.z);

		this.p1 = p1;
		this.p2 = p2;
		this.color = color;
		this.width = width;
		this.canDraw = canDraw;
	}
}

class dir{
	constructor(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
	}

	static from2Point(p2, p1){
		return new dir(p1.x-p2.x, p1.y-p2.y, p1.z-p2.z);
	}

	clone(){
		return new dir(this.x, this.y, this.z);
	}

	magnitude(){
		return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
	}

	normal(){
		let mag = this.magnitude();
		return new dir(this.x/mag, this.y/mag, this.z/mag);
	}

	normalize(){
		let mag = this.magnitude();
		this.x = this.x/mag;
		this.y = this.y/mag;
		this.z = this.z/mag;
	}

	mulN(k){
		return new dir(this.x*k, this.y*k, this.z*k);
	}

	static sum(a, b){
		return new dir(a.x+b.x, a.y+b.y, a.z+b.z);
	}

	static mul(a, b){
		return new dir(a.y*b.z-a.z*b.y, a.z*b.x-a.x*b.z, a.x*b.y-a.y*b.x);
	}

	static scalar(a, b){
		return a.x*b.x+a.y*b.y+a.z*b.z;
	}
}

class point2d{
	constructor(_point, matrix) {

		let s = point.fromArray(mx.mul([_point.toArray()], matrix)[0]);
		s.normalize();
		
		this.x = s.x;
		this.y = s.y;
		this.z = s.z;

		this.color = _point.color;

		this.point = _point;
	}

	toArray(){
		return [this.x, this.y];
	}
}

var fov = 1;

var cam = {
	pos : new point(0, 0, -20),
	target: new point(0, 0, 0),
	rn : {
		x: 0,
		y: 0,
		z: 0
	},

	distance: 20,

	matrix : function(){
		return mx.mul(fox.proc(-fov),
			mx.mul(fox.euler(this.rn.x, this.rn.y, this.rn.z), fox.t(this.pos.x, this.pos.y, this.pos.z))
			);
		
	},

	a_matrix : function(){
		return mx.inverse(this.matrix());
	}
}

var lines = [];
var points = [];
var points2d = [];
let link = new Map();

var grid = [
	new point(0, 0, 0),
	new point(1, 0, 0),
	new point(0, 1, 0),
	new point(0, 0, 1)
];

var showGrid = true;

var grid2d = [];

var gridLines = [];

for(let i = 0; i < 11; i++){
	let p = new point(-5, 0, i-5);
	let p2 = new point(5, 0, i-5);
	grid.push(p, p2);
	gridLines.push(new line(p, p2, "#C5C5C5", 1, ()=>showGrid));
}

for(let i = 0; i < 11; i++){
	let p = new point(i-5, 0, -5);
	let p2 = new point(i-5, 0, 5);
	grid.push(p, p2);
	gridLines.push(new line(p, p2, "#C5C5C5", 1, ()=>showGrid));
}

var moveZ = true;
var moveY = true;
var moveX = true;

gridLines.push(	new line(grid[0], grid[1], '#C10000', 2, ()=>moveX),
	new line(grid[0], grid[2], '#20C100', 2, ()=>moveY),
	new line(grid[0], grid[3], '#1B00C1', 2, ()=>moveZ));


function to2d(){
	points2d = [];
	grid2d = [];
	link = new Map();

	let matrix = cam.a_matrix();

	points.forEach(function(item, i){
		points2d[i] = new point2d(item, matrix);
		link.set(points[i], points2d[i]);
	});

	grid.forEach(function(item, i){
		grid2d[i] = new point2d(item, matrix);
		link.set(grid[i], grid2d[i]);
	});
}

