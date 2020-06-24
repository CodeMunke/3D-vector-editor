let masGroup = [];

function rnd(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


class myGroup{
	constructor(gr){
		this.group = [];
		this.name = 'Группа ';
		for(let i = 0; i < gr.length; i++){
			this.group.push(gr[i]);
		}
		this.color =  "rgb("+rnd(0, 255)+", "+ rnd(0, 255) + ", "+ rnd(0, 255) + ")";
	}

	recalc(){
		for(let i = 0; i < this.group.length; i++){
			if(!points.includes(this.group[i]))
				this.group.splice(i--, 1);
		}
	}
}
let nowGroup = -1;
$('.groups').on('contextmenu', 'li',  function(e){
	e.preventDefault();
	$('#group-menu').css({
		display: 'block',
		top: e.clientY,
		left: e.clientX
	});
	nowGroup = $(e.target).data('id');
	$(document).one('click', function(){
		$('#group-menu').css('display', '');
	});
});

$('.groups').on('click', 'li', function(e){
	e.preventDefault();
	let n = $(e.target).data('id');
	if(n >= 0){
		group = [];
		_group = [];
		masGroup[n].group.forEach(function(item){
			group.push(item);
		});
	}
	$('.points').trigger('changePoints');
	_draw();
});

$('.groups').on('change', function(e){
	let _this = $(this);
	_this.empty();
	masGroup.forEach(function(item, i){
		_this.append($('<li>').text(item.name + ' ('+item.group.length+')').data('id', i).css('color', item.color));
	});

});

function makeGroup(){
	if(group.length > 0){
		let m = new myGroup(group);
		m.group.forEach(function(item){
			item.color = m.color;
		});
		masGroup.push(m);
	}

	$('.groups').trigger('change');
	draw();
}

$(canvas).on('deletePoints', function(){
	masGroup.forEach(function(item){
		item.recalc();
	});
	$('.groups').trigger('change');
});


function deleteGroup(){
	if(nowGroup >= 0){
		masGroup.splice(nowGroup, 1);
		$('.groups').trigger('change');
	}
}

function renameGroup(){
	var resultPrompt = prompt('Введите новое название для группы', '');
	if(resultPrompt && nowGroup >= 0){
		masGroup[nowGroup].name = resultPrompt;
	}
	$('.groups').trigger('change');
}

function colorGroup(){
	var resultPrompt = prompt('Введите новый цвет группы в формате #CCC или #CCCCCC или rgb(c, c, c)', '');
	if(nowGroup >= 0){
		masGroup[nowGroup].color = resultPrompt;
		masGroup[nowGroup].group.forEach(function(item){
			item.color = resultPrompt;
		});
	}
	draw();
	$('.groups').trigger('change');
}