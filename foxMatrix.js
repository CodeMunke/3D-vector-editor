var fox = {

rx : function(r){
	r = r*Math.PI/180;
	return [[1, 0, 0, 0],
			[0, Math.cos(r), -Math.sin(r), 0],
			[0, Math.sin(r), Math.cos(r), 0],
			[0, 0, 0, 1]
	];
},

ry: function (r){
	r = r*Math.PI/180;
	return [[Math.cos(r), 0, Math.sin(r), 0],
			[0, 1, 0, 0],
			[-Math.sin(r), 0, Math.cos(r), 0],
			[0, 0, 0, 1]
	];
},


rz: function(r){
	r = r*Math.PI/180;
	return [[Math.cos(r), -Math.sin(r), 0, 0],
			[Math.sin(r), Math.cos(r), 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
	];
},

euler: function(x, y, z){
	return mx.mul( mx.mul(this.rz(z), this.rx(x)), this.ry(y));
},

t: function (x, y, z){
	return [[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[x, y, z, 1]];
},

proc: function(r){
	return [[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, r],
			[0, 0, 0, 1]];
},

scale: function(x, y, z){
	return [[x, 0, 0, 0],
			[0, y, 0, 0],
			[0, 0, z, 0],
			[0, 0, 0, 1]];
},

one: function(){
	return [[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]];
},

sdvig: function(pos, rotate){
	return mx.mul(mx.mul(mx.inverse(pos), rotate), pos);
}


};