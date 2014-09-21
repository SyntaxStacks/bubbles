var _ = require('lodash');
var server = module.exports = {
  clients: {},
  initialize: function sockets (handle) {
    var io = require('socket.io')(handle);
    io.on('connection', function (socket) {
      var current_user = {
        id: socket.id
      };

      console.log('a user connected');
      socket.on('start', function (data) {
        console.log('init');
        current_user.pos = data.pos;
        current_user.lasors = data.lasors;
        server.clients[current_user.id] = current_user;
        console.log(_.omit(server.clients, current_user.id));
        socket.emit('init', {
          clients: _.omit(server.clients, current_user.id)
        });
        socket.broadcast.emit('update', current_user);
      });
      socket.on('update', function (data) {
        current_user.pos = data.pos;
        current_user.lasors = data.lasors;
        server.clients[current_user.id] = current_user;
        console.log(server.clients);
        socket.broadcast.emit('update', current_user);
      });
      socket.on('disconnect', function () {
        console.log('a user disconnected');
        socket.broadcast.emit('kill', current_user);
        server.clients = _.omit(server.clients, current_user.id);
      });
    });
    return io;
  }
};
