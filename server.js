const app = require('express')();
const cloudflare = require('cloudflare-express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const logger = require('./logger');

app.use(cloudflare.restore({update_on_start:true}));
app.use(logger.visit());
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.use(logger.error());

io.on('connection', function(socket){
    io.emit('chat message', `user connected, ${io.engine.clientsCount} current users`);

    console.log(`${socket.id} ${socket.handshake.time} user ${socket.request.connection.remoteAddress} connected (${JSON.stringify(socket.handshake.headers)})`);
    socket.on('disconnect', function(){
      io.emit('chat message', `user disconnected, ${io.engine.clientsCount} current users`);
    });
    socket.on('chat message', function(msg){
      console.log(`${socket.id} message: ${msg}`);
      io.emit('chat message', msg);
    });
  });

http.listen(process.env.PORT, function(){
  console.log(`listening on ${process.env.PORT}`);
});