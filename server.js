const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const logger = require('./logger');
const config = require('./config.json');

app.use(logger.visit());
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.use(logger.error());

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

http.listen(config.port, function(){
  console.log(`listening on ${config.port}`);
});