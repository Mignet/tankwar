//2d画布
var ctx;
//画布宽度
var screenWidth = 800;
//画布高度
var screenHeight = 600;
//运动速度
var speed = 4;
//旋转角度
var degree = 4.5;
//定义Tank
function Tank(uuid, x, y, dir,ptDir,good) {
	this.uuid = uuid;
	this.x = x;
	this.y = y;
	this.dir = dir;
	this.good = good;
	//360°
	this.image = new Image();
	this.pt = new Image();
	if(good){
		this.image.src = 'images/Tank.png';
		this.pt.src = 'images/Gunbarrel.png';
	}else{
		this.image.src = 'images/Tank_.png';
		this.pt.src = 'images/Gunbarrel_.png';
	}
	this.ptDir = dir;
	this.live = true;
	//活着
	this.moveType = 0;
	//if 0 meanings stop,and then 1 is move
	this.rotateType = 0;
	//if 0 stop,1 can right-clock rotate else -1 is rotate
	this.targetDir = 0;
};

Tank.prototype.fire = function() {
	var ox = this.x;
	var oy = this.y;
	var b = new Bullet(this.uuid,uid++,ox, oy, this.good, this.ptDir);
	bullets.push(b);
	var data = {uuid:this.uuid,id:uid,x:ox,y:oy,good:this.good,dir:this.ptDir};
	socket.emit('new bullet',data);
}
Tank.prototype.draw = function(ctx) {
	if(this.live) {
		//旋转
		ctx.translate(this.x, this.y);
		ctx.rotate(this.dir * Math.PI / 180);
		ctx.translate(-54, -54);
		//绘制坦克
		ctx.drawImage(this.image, 0, 0);
		ctx.fillText('    【'+this.uuid+'】',0,0);
		//平移
		ctx.translate(54, 54);
		//恢复旋转
		ctx.rotate(-this.dir * Math.PI / 180);
		//旋转
		ctx.rotate(this.ptDir * Math.PI / 180);
		ctx.translate(-33, -60);
		//绘制炮筒
		ctx.drawImage(this.pt, 0, 0);
		//ctx.fillText('pt:x='+this.x+',y='+this.y,0,0);
		ctx.translate(33, 60);
		//恢复旋转
		ctx.rotate(-this.ptDir * Math.PI / 180);
		//平移回(0,0)
		ctx.translate(-this.x, -this.y);
		this.move();
		//tank move at every ticks
		var data = {uuid:myTank.uuid,x:myTank.x,y:myTank.y,dir:myTank.dir,ptDir:myTank.ptDir};
		socket.emit('tank move',data);
	} else {
		tanks.remove(this);
	}
}
var uid = 1;
//定义子弹
function Bullet(uuid,id,x, y, good, dir) {
	this.uuid = uuid;
	this.x = x;
	this.y = y;
	this.good = good;
	this.dir = 180 - dir;
	this.image = new Image();
	this.image.src = 'images/bullet.png';
	this.live = true;
	this.id = id;
}

Bullet.prototype.hitTank = function(tank) {
	if(this.live && tank.live && this.good != tank.good && intersects(this.x, this.y, this.image.width, this.image.height, tank.x, tank.y, tank.image.width, tank.image.height)) {
		return true;
	}
	return false;
}
function intersects(tx, ty, tw, th, rx, ry, rw, rh) {
	if(rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
		return false;
	}
	rw += rx;
	rh += ry;
	tw += tx;
	th += ty;
	//      overflow || intersect
	return ((rw < rx || rw > tx) && (rh < ry || rh > ty) && (tw < tx || tw > rx) && (th < ty || th > ry));
}

Bullet.prototype.draw = function(ctx) {
	if(this.live) {
		ctx.translate(this.x, this.y);
		ctx.rotate((-this.dir + 90) * Math.PI / 180);
		ctx.translate(60, -5);
		ctx.drawImage(this.image, 0, 0);
		ctx.translate(-60, 5);
		//ctx.fillText('bullet:im '+this.good,0,0);
		ctx.rotate((+this.dir - 90) * Math.PI / 180);
		ctx.translate(-this.x, -this.y);
		//move
		this.x += speed * Math.sin(this.dir * Math.PI / 180);
		this.y += speed * Math.cos(this.dir * Math.PI / 180);
		//
		if(this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) {
			this.live = false;
		}
	} else {
		bullets.remove(this);
	}
}
Array.prototype.clear = function() {
	this.length = 0;
}
Array.prototype.insertAt = function(index, obj) {
	this.splice(index, 0, obj);
}
Array.prototype.removeAt = function(index) {
	this.splice(index, 1);
}
Array.prototype.remove = function(obj) {
	var index = this.indexOf(obj);
	if(index >= 0) {
		this.removeAt(index);
	}
}
//定义背景
function Background(x, y) {
	this.x = x;
	this.y = y;
	this.image = new Image();
	this.image.src = 'images/background.jpg';
	//this.width = 800;
	//this.height = 600;
};

//定义地图元素
function MapItem(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.image = new Image();
	this.image.src = 'images/item_' + this.type + '.jpg';
};
//定义爆炸
function Explode(x, y) {
	this.x = x;
	this.y = y;
	this.live = true;
	this.image = new Image();
	this.image.src = 'images/explode.png';
	this.step = 1;
}

var images = new Array();
Explode.prototype.draw = function(ctx) {
	if(this.live) {
		ctx.drawImage(images[this.step], this.x, this.y);
		this.step++;
		if(this.step == 5) {
			this.live = false;
		}
	} else {
		explodes.remove(this);
	}
}
//坦克实例
var myTank;
var tanks = [];
var bullets = [];
var explodes = [];
//背景实例
var Bg;
// FPS
var previous = [];
var stats;
var canvas;
var socket;
var url = window.location.protocol + '//' + window.location.host;
//alert(url);
socket = io.connect(url);
//client-server
socket.on('msg', function(data) {
	showMsg(data);
});
var showMsg = function(data) {
	var time = $('<span style="color:red;"></span>').html(data.time + '&nbsp;&nbsp;');
	var username = $('<span style="color:blue;"></span>').html(data.username + '&nbsp;&nbsp;');
	var say = $('<span style="color:black;"></span>').html('say:&nbsp;&nbsp;');
	var msg = $('<span style="color:green;"></span>').text(data.msg);
	var div = $('<div style="display:none;"></div>').append(time).append(username).append(say).append(msg);
	div.insertAfter('#demo span:eq(0)').slideDown();
	//fadeIn();
	//div.appendTo('#demo').fadeIn();
}
socket.on('new tank', function(data) {
	var tTank = new Tank(data.uuid, data.x, data.y, data.dir,data.ptDir,data.good);
	if(myTank == null || myTank == undefined) {
		myTank = tTank;
		tanks.push(myTank);
	}
	if(myTank.uuid == data.uuid) {
		console.log("current tank's uuid:" + data.uuid);
		return;
	}
});
socket.on('other tank', function(data) {
	var tTank = new Tank(data.uuid, data.x, data.y, data.dir,data.ptDir,data.good);
	var exist = false;
	for(var i = 0; i < tanks.length; i++) {
		if(tanks[i].uuid == data.uuid) {
			exist = true;
			break;
		}
	}
	if(!exist) {
		var data = {uuid:myTank.uuid,x:myTank.x,y:myTank.y,dir:myTank.dir,ptDir:myTank.ptDir,good:myTank.good};
		socket.emit('other tank',data);
		tanks.push(tTank);
	}
});
socket.on('tank move', function(data) {
	//tank
	for(var i = 0; i < tanks.length; i++) {
		if(tanks[i].uuid == data.uuid) {
			tanks[i].x = data.x;
			tanks[i].y = data.y;
			tanks[i].dir = data.dir;
			tanks[i].ptDir = data.ptDir;
		}
	}
});
socket.on('new bullet',function(data){
	var tBullet = new Bullet(data.uuid,data.id,data.x,data.y,data.good,data.dir);
	bullets.push(tBullet);
})
socket.on('tank dead',function(data){
	for(var i = 0;i<tanks.length;i++){
		if(tanks[i].uuid==data.uuid){
			tanks.remove(tanks[i]);
		}
	}
})
socket.on('bullet dead',function(data){
	for(var i = 0;i<bullets.length;i++){
		if(bullets[i].uuid==data.uuid&&bullets[i].id==data.id){
			bullets.remove(bullets[i]);
		}
	}
})
//初始化
$(document).ready(function() {

	$('#butt_send').click(function() {
		if($('#message').val()!=''){
			socket.emit('msg', $('#message').val());
			$('#message').val();
		}
	});
	//连接到服务器
	socket.emit('login', 'v5Gamer');
	Bg = new Background(0, 0);

	for(var i = 1; i < 6; i++) {
		images[i] = new Image();
		images[i].src = "images/explode00" + i + ".png";
	}

	window.addEventListener('keydown', doKeyDown, true);
	window.addEventListener('keyup', doKeyUp, true);
	window.addEventListener('mouseup', doMouseUp, true);
	window.addEventListener('mousemove', directTo, true);
	// Getting canvas and context
	var canvas = document.getElementById("container");
	ctx = canvas.getContext('2d');
	stats = document.getElementById("stats");

	// Setting hardware scaling
	/*canvas.width = screenWidth;
	 canvas.style.width = (window.innerWidth-30) + 'px';
	 canvas.height = screenHeight;
	 canvas.style.height = (window.innerHeight-30) + 'px';*/

	computeFPS();
	// First render
	renderingLoop();
});

function mousePos(event) {
	var px, py;
	//ie兼容
	if(!event) {
		event = window.event;
	}
	if(document.all) {// is ie
		px = event.clientX;
		py = event.clientY;
		px += document.documentElement.scrollLeft;
		py += document.documentElement.scrollTop;
	} else {
		px = event.pageX;
		py = event.pageY;
	}
	//alert(px+"___" + py);
	return {
		x : px,
		y : py
	};
};

var intervalID = -1;
var QueueNewFrame = function() {
	if(window.requestAnimationFrame)
		window.requestAnimationFrame(renderingLoop);
	else if(window.msRequestAnimationFrame)
		window.msRequestAnimationFrame(renderingLoop);
	else if(window.webkitRequestAnimationFrame)
		window.webkitRequestAnimationFrame(renderingLoop);
	else if(window.mozRequestAnimationFrame)
		window.mozRequestAnimationFrame(renderingLoop);
	else if(window.oRequestAnimationFrame)
		window.oRequestAnimationFrame(renderingLoop);
	else {
		QueueNewFrame = function() {
		};
		intervalID = window.setInterval(renderingLoop, 16.7);
	}
};
//游戏中
var render = true;
//循环描绘物体
function renderingLoop() {
	var textureIndex;
	var radius, u, v, w;
	// Compute FPS
	if(render) {
		computeFPS();
	}
	paint(ctx);
	//ctx.drawImage
	if(render) {
		QueueNewFrame();
	}
}

window.console = window.console || {};
console.log || (console.log = opera.postError);
function paint(ctx) {
	//清除屏幕
	ctx.clearRect(0, 0, screenWidth, screenHeight);
	ctx.save();
	//绘制背景
	ctx.drawImage(Bg.image, -Bg.x, -Bg.y);
	//绘制Tank
	for(var i = 0; i < tanks.length; i++) {
		tanks[i].draw(ctx);
	}
	//绘制子弹
	for(var i = 0; i < bullets.length; i++) {
		var b = bullets[i];
		if(b.hitTank(myTank)) {
			bullets.remove(b);
			tanks.remove(myTank);
			myTank.live = false;
			var e = new Explode(b.x, b.y);
			explodes.push(e);
			var data = {uuid:myTank.uuid};
			socket.emit('tank dead',data);
			data = {uuid:b.uuid,id:b.id};
			socket.emit('bullet dead',data);
		}
		b.draw(ctx);
	}
	//绘制Explodes
	for(var i = 0; i < explodes.length; i++) {
		explodes[i].draw(ctx);
	}
	//绘制前景
	//ctx.drawImage(Bg.image_, -Bg.x, -Bg.y);
	ctx.restore();
}

function computeFPS() {
	if(previous.length > 60) {
		previous.splice(0, 1);
	}
	var start = (new Date).getTime();
	previous.push(start);
	var sum = 0;

	for(var id = 0; id < previous.length - 1; id++) {
		sum += previous[id + 1] - previous[id];
	}

	var diff = 1000.0 / (sum / previous.length);

	stats.innerHTML = diff.toFixed() + " fps";
}

function doMouseUp() {
	if(myTank == null || myTank == undefined)
		return;
	if(myTank.live) {
		myTank.fire();
	}
}

function doKeyUp(evt) {
	switch (evt.keyCode) {
		case 38:
			/* Up arrow  was released */
			up = false;
			break;
		case 40:
			/* Down arrow  was released */
			down = false;
			break;
		case 37:
			/* Left arrow was released */
			left = false;
			break;
		case 39:
			/* Right arrow was released */
			right = false;
			break;
	}
}

//炮筒指向鼠标
function directTo(e) {
	if(myTank == null || myTank == undefined)
		return;
	if(myTank.live) {
		myTank.ptDir = 180 * (Math.atan2(mousePos(e).y - myTank.y, mousePos(e).x - myTank.x)) / Math.PI + 90;
		//var data = {uuid:myTank.uuid,x:myTank.x,y:myTank.y,dir:myTank.dir,ptDir:myTank.ptDir};
		//socket.emit('tank move',data);
	}
}

var up = false;
var down = false;
var left = false;
var right = false;
Tank.prototype.move = function() {
	if(this.moveType != 0) {
		if(up) {
			if(Bg.y <= 0) {
				//reach to top
				Bg.y = 0;
				if(this.y > 0) {
					this.x += Math.abs(speed * Math.sin(this.dir * Math.PI / 180));
					this.y -= Math.abs(speed * Math.cos(this.dir * Math.PI / 180));
				}
			} else {
				//not reach to top:
				if(this.y > screenHeight / 2) {
					this.x += Math.abs(speed * Math.sin(this.dir * Math.PI / 180));
					this.y -= Math.abs(speed * Math.cos(this.dir * Math.PI / 180));
				} else {
					Bg.y -= speed;
				}
			}
		}
		if(down) {
			if(Bg.y >= Bg.image.height - screenHeight) {
				Bg.y = Bg.image.height - screenHeight;
				if(this.y < screenHeight) {
					this.x -= Math.abs(speed * Math.sin(this.dir * Math.PI / 180));
					this.y += Math.abs(speed * Math.cos(this.dir * Math.PI / 180));
				}
			} else {
				if(this.y < screenHeight / 2) {
					this.x -= Math.abs(speed * Math.sin(this.dir * Math.PI / 180));
					this.y += Math.abs(speed * Math.cos(this.dir * Math.PI / 180));
				} else {
					Bg.y += speed;
				}
			}
		}
		if(left) {
			if(Bg.x <= 0) {
				//reach to left
				Bg.x = 0;
				if(this.x > 0) {
					this.x -= Math.abs(speed * Math.sin(this.dir * Math.PI / 180));
					this.y += Math.abs(speed * Math.cos(this.dir * Math.PI / 180));
				}
			} else {
				//not reach to left:
				if(this.x > screenWidth / 2) {
					this.x -= Math.abs(speed * Math.sin(this.dir * Math.PI / 180));
					this.y += Math.abs(speed * Math.cos(this.dir * Math.PI / 180));
				} else {
					Bg.x -= speed;
				}
			}
		}
		if(right) {
			if(Bg.x >= Bg.image.width - screenWidth) {
				Bg.x = Bg.image.width - screenWidth;
				if(this.x < screenWidth) {
					this.x += Math.abs(speed * Math.sin(this.dir * Math.PI / 180));
					this.y -= Math.abs(speed * Math.cos(this.dir * Math.PI / 180));
				}
			} else {
				if(this.x < screenWidth / 2) {
					this.x += Math.abs(speed * Math.sin(this.dir * Math.PI / 180));
					this.y -= Math.abs(speed * Math.cos(this.dir * Math.PI / 180));
				} else {
					Bg.x += speed;
				}
			}
		}
	}
	if(this.rotateType != 0) {
		if(Math.abs(this.targetDir - this.dir) < degree) {
			this.dir = this.targetDir;
		}
		if(this.targetDir != this.dir) {
			this.dir += this.rotateType * degree;
		}
		if(this.dir >= 270) {
			this.dir = -90;
		}
		if(this.dir <= -90) {
			this.dir = 270
		}
	}
	if(!up && !down && !left && !right) {
		this.moveType = 0;
		this.rotateType = 0;
	}
}
//事件处理-只控制方向
function doKeyDown(evt) {
	if (evt.keyCode == 13)	//Enter -- x0D
	{
		$('#butt_send').click();
	}
	if(myTank == null || myTank == undefined)
		return;
	switch (evt.keyCode) {
		case 38:
			/* Up arrow was pressed */
			if(myTank.dir == 0 || myTank.dir == 180) {
				myTank.moveType = 1;
			} else {
				if(myTank.dir == 270)
					myTank.dir = -90;
				var dir = myTank.dir;
				if(-90 <= dir && dir < 0) {
					myTank.targetDir = 0;
					myTank.rotateType = 1;
				}
				if(0 < dir && dir <= 90) {
					myTank.targetDir = 0;
					myTank.rotateType = -1;
				}
				if(90 < dir && dir < 180) {
					myTank.targetDir = 180;
					myTank.rotateType = 1;
				}
				if(180 < dir && dir < 270) {
					myTank.targetDir = 180;
					myTank.rotateType = -1;
				}
			}
			up = true;
			break;
		case 40:
			/* Down arrow was pressed */
			if(myTank.dir == 0 || myTank.dir == 180) {
				myTank.moveType = 1;
			} else {
				if(myTank.dir == -90)
					myTank.dir = 270;
				var dir = myTank.dir;
				if(-90 < dir && dir < 0) {
					myTank.targetDir = 0;
					myTank.rotateType = 1;
				}
				if(0 < dir && dir < 90) {
					myTank.targetDir = 0;
					myTank.rotateType = -1;
				}
				if(90 <= dir && dir < 180) {
					myTank.targetDir = 180;
					myTank.rotateType = 1;
				}
				if(180 < dir && dir <= 270) {
					myTank.targetDir = 180;
					myTank.rotateType = -1;
				}
			}
			down = true;
			break;
		case 37:
			//left
			if(myTank.dir == 90 || myTank.dir == 270) {
				myTank.moveType = 1;
			} else {
				var dir = myTank.dir;
				if(-90 < dir && dir <= 0) {
					myTank.targetDir = -90;
					myTank.rotateType = -1;
				}
				if(0 < dir && dir < 90) {
					myTank.targetDir = 90;
					myTank.rotateType = 1;
				}
				if(90 < dir && dir < 180) {
					myTank.targetDir = 90;
					myTank.rotateType = -1;
				}
				if(180 <= dir && dir < 270) {
					myTank.targetDir = 270;
					myTank.rotateType = 1;
				}
			}
			left = true;
			break;
		case 39:
			//right
			if(myTank.dir == 90 || myTank.dir == 270) {
				myTank.moveType = 1;
			} else {
				var dir = myTank.dir;
				if(-90 < dir && dir < 0) {
					myTank.targetDir = -90;
					myTank.rotateType = -1;
				}
				if(0 <= dir && dir < 90) {
					myTank.targetDir = 90;
					myTank.rotateType = 1;
				}
				if(90 < dir && dir <= 180) {
					myTank.targetDir = 90;
					myTank.rotateType = -1;
				}
				if(180 < dir && dir < 270) {
					myTank.targetDir = 270;
					myTank.rotateType = 1;
				}
			}
			right = true;
			break;
	}
}