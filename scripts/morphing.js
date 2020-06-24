let mphStart = [];
let mphEnd = [];

let morphValue = 0;

$('#morph').on('input', function(e){
	morphValue = $(this).val()/100;
	$('#morphValue').text(morphValue);
	if(mphStart.length > 0 && mphEnd.length > 0){
		for(let i = 0; i < points.length; i++){
			points[i].x = mphStart[i].x+(mphEnd[i].x-mphStart[i].x)*morphValue;
			points[i].y = mphStart[i].y+(mphEnd[i].y-mphStart[i].y)*morphValue;
			points[i].z = mphStart[i].z+(mphEnd[i].z-mphStart[i].z)*morphValue;
		}
	}
	draw();
});

function morphStart(){
	mphStart = [];
	for(let i = 0; i < points.length; i++){
		mphStart[i] = {
			x: points[i].x,
			y: points[i].y,
			z: points[i].z,
		};
	}
	$('#morph').val(0);
	morphValue = 0;
	$('#morphValue').text(morphValue);
}

function morphEnd(){
	mphEnd = [];
	for(let i = 0; i < points.length; i++){
		mphEnd[i] = {
			x: points[i].x,
			y: points[i].y,
			z: points[i].z,
		};
	}
	$('#morph').val(100);
	morphValue = 1;
	$('#morphValue').text(morphValue);
}