const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

http.listen(process.env.PORT, () => console.log(`listening on ${process.env.PORT}`));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
io.on('connection', (socket) => {
  io.emit('chat message', `user connected, ${io.engine.clientsCount} current users`);
  console.log(`${socket.id} ${socket.handshake.time} user ${socket.request.connection.remoteAddress} connected (${JSON.stringify(socket.handshake.headers)})`);
  socket.on('disconnect', () => io.emit('chat message', `user disconnected, ${io.engine.clientsCount} current users`));
  socket.on('chat message', (msg) => {
    console.log(`${socket.id} message: ${msg}`);
    io.emit('chat message', msg);
  });
});
