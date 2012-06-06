Tank.prototype={
//生成一个新坦克
birth:function(dx,dy,map){
	var startSound=new Sound('start');
	startSound.play();
	this.dx=dx;
	this.dy=dy;
	this.map=map;
	this.maxWidth=map.width;
	this.maxHeight=map.height;
	this.drawTank(this.dx,this.dy);
},
//改变坦克的朝向
changeDirection:function(direction){
	switch(direction){
		case 'up':
		this.sx=this.up;
		break;
		case 'down':
		this.sx=this.down;
		break;
		case 'left':
		this.sx=this.left;
		break;
		case 'right':
		this.sx=this.right;
		break;
	}
	this.drawTank(this.dx,this.dy);
}
}