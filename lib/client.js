var io = require('socket.io-client');

module.exports = {
  initialize: function () {
    var socket = io();
    return socket;
  }
};
