module.exports = server = {
  clients: {},
  initialize: function sockets (handle) {
    var io = require('socket.io')(handle);
    io.on('connection', function (socket) {
      var current_user = server.clients[socket.id] = {
        id: socket.id
      };
      console.log('a user connected');
      socket.on('update', function (data) {
        console.log('update');
        current_user.x = data.x;
        current_user.y = data.y; 
        socket.broadcast.emit('update', current_user);
      });
      socket.on('disconnect', function () {
        console.log('a user disconnected');
        current_user = undefined;
      });
    });
    return io;
  }
}
