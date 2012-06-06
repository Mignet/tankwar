Map.prototype={
	//清除指定地点的地图
clean:function(dx,dy){
	j=Math.floor(dx/this.dw);
	i=Math.floor(dy/this.dw);
	this.mapElementArray[i][j].clean();
	//this.map_array[i][j]=0;
},
//清除全部地图
cleanAll:function(){
	context.fillStyle='#000000';
	context.fillRect(0,0,this.width,this.height);
},
//绘制指定地点的地图
draw:function(dx,dy){
	j=Math.floor(dx/this.dw);
	i=Math.floor(dy/this.dw);
	this.mapElementArray[i][j].draw();
},

//检测指定位置是什么地形
checkMap:function(dx,dy){
	j=Math.floor(dx/this.dw);
	i=Math.floor(dy/this.dw);
	return this.map_array[i][j];
}
}