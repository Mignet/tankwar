var express =  require('express'),
    app = express.createServer(),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    mime = require('mime');

app.listen(process.env.VCAP_APP_PORT || 3000);
if(process.env.VMC_APP_PORT) {
io.set('transports', 
	[
		//'websocket',        
		'flashsocket',        
		'htmlfile',        
		'xhr-polling',        
		'jsonp-polling'    
	]
	);
}

app.get('/',function(req,res){
    var realpath = __dirname + '/index.html';
    //console.log(realpath);
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/jquery.min.js',function(req,res){
    var realpath = __dirname + '/jquery.min.js';
    //console.log(realpath);
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/css/default.css',function(req,res){
    var realpath = __dirname + '/css/default.css';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/favicon.ico',function(req,res){
    var realpath = __dirname + '/favicon.ico';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/apple-touch-icon.png',function(req,res){
    var realpath = __dirname + '/apple-touch-icon.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/TankManager.js',function(req,res){
    var realpath = __dirname + '/TankManager.js';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/background.jpg',function(req,res){
    var realpath = __dirname + '/images/background.jpg';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/Tank.png',function(req,res){
    var realpath = __dirname + '/images/Tank.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/Gunbarrel.png',function(req,res){
    var realpath = __dirname + '/images/Gunbarrel.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/Tank_.png',function(req,res){
    var realpath = __dirname + '/images/Tank_.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/Gunbarrel_.png',function(req,res){
    var realpath = __dirname + '/images/Gunbarrel_.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/bullet.png',function(req,res){
    var realpath = __dirname + '/images/bullet.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/explode.png',function(req,res){
    var realpath = __dirname + '/images/explode.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/explode001.png',function(req,res){
    var realpath = __dirname + '/images/explode001.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/explode002.png',function(req,res){
    var realpath = __dirname + '/images/explode002.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/explode003.png',function(req,res){
    var realpath = __dirname + '/images/explode003.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/explode004.png',function(req,res){
    var realpath = __dirname + '/images/explode004.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/explode005.png',function(req,res){
    var realpath = __dirname + '/images/explode005.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/frontground.png',function(req,res){
    var realpath = __dirname + '/images/frontground.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/Meed.png',function(req,res){
    var realpath = __dirname + '/images/Meed.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/button.png',function(req,res){
    var realpath = __dirname + '/images/button.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
app.get('/images/button_clicked.png',function(req,res){
    var realpath = __dirname + '/images/button_clicked.png';
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});
var uuid = 1000;
var getCurrTime = function(){
    var d  = new Date();
    return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
};
io.sockets.on('connection', function (socket) {
  socket.on('msg', function(msg){
     var data = {username:socket.name,time:getCurrTime(),msg:msg};
     socket.emit('msg',data);
     socket.broadcast.emit('msg',data);
  });
  //登录时，赋予uuid，分队伍(true/false)
  socket.on('login', function(username){
     socket.name = uuid;//服务器内客户端唯一标识
     var data = {username:'SYSTEM',time:getCurrTime(),msg:'Welcome '+username+'('+socket.name+') in...'};
     console.log('Welcome '+username+'('+socket.name+') in...')
     socket.broadcast.emit('msg',data);
     socket.emit('msg',data);
     //socket.emit('msg',data);
     if(uuid%2==0){
	     data = {uuid:uuid,x:200,y:200,dir:180,ptDir:0,good:true};
     }else{
	     data = {uuid:uuid,x:200,y:400,dir:0,ptDir:0,good:false};
     }
     console.log('new Tank '+username+'('+socket.name+') in...')
     socket.emit('new tank',data);
     socket.broadcast.emit('other tank',data);
     uuid++;
  });
  socket.on('other tank', function(tank){
     socket.name = tank.uuid;
	 var data = {uuid:tank.uuid,x:tank.x,y:tank.y,dir:tank.dir,ptDir:tank.ptDir,good:tank.good};
     console.log('other Tank v5Gamer('+socket.name+') bring in...')
     //socket.emit('new tank',data);
     socket.broadcast.emit('other tank',data);
  });
  socket.on('tank dead', function(tank){
     socket.name = tank.uuid;
	 var data = {uuid:tank.uuid};
     console.log('Tank v5Gamer('+socket.name+') dead...')
     socket.broadcast.emit('tank dead',data);
  });
  socket.on('tank move', function(tank){
     socket.name = tank.uuid;
	 var data = {uuid:tank.uuid,x:tank.x,y:tank.y,dir:tank.dir,ptDir:tank.ptDir};
     console.log('Tank v5Gamer('+socket.name+') move...')
     socket.broadcast.emit('tank move',data);
  });
  socket.on('new bullet', function(bullet){
	 var data = {uuid:bullet.uuid,id:bullet.id,x:bullet.x,y:bullet.y,good:bullet.good,dir:bullet.dir};
     socket.broadcast.emit('new bullet',data);
  });
  socket.on('bullet dead', function(bullet){
     socket.name = bullet.uuid;
	 var data = {uuid:bullet.uuid,id:bullet.id};
     socket.emit('bullet dead',data);
     socket.broadcast.emit('bullet dead',data);
  });
  socket.on('logout', function(username){
     var data = {username:'SYSTEM',time:getCurrTime(),msg:'bye, '+socket.name+' leave...'};
     socket.broadcast.emit('msg',data);
     socket.emit('msg',data);
  });
  socket.on('disconnect', function () {
        socket.send(getCurrTime()+' '+socket.name+ " out...");
  });
});