var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const port = process.env.PORT || 3001;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.broadcast.emit('connected to server');

    console.log(`${socket.id} ${socket.handshake.time} user ${socket.request.connection.remoteAddress} connected (${JSON.stringify(socket.handshake.headers)})`);
    socket.on('disconnect', function(){
      console.log(`${socket.id} user disconnected`);
    });
    socket.on('chat message', function(msg){
      console.log(`${socket.id} message: ${msg}`);
      io.emit('chat message', msg);
    });
  });

http.listen(port, function(){
  console.log(`listening on ${port}`);
});