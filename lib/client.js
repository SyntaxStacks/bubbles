var io = require('socket.io-client');

module.exports = {
  initialize: function () {
    var socket = io('http://localhost:3000');
    return socket;
  }
};
