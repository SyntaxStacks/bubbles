var path = require('path');
var express = require('express');
var app = express()
var game = function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../index.html'));
};
app.use(express.static(path.resolve(__dirname + '/../')));
app.get('/', game);
//app.get('*', game);
var server = require('http').Server(app);
var io = require('./gameSockets');
io.initialize(server);

server.listen(80);
// var MemoryStore = express.session.MemoryStore;
// var Session = require('connect').middleware.session.Session;
// var parseCookie = require('connect').utils.parseCookie;
// var sessionStore = new MemoryStore();
// app.configure(function () {
//   app.use(express.cookieParser());
//   app.use(express.session({
//     store: sessionStore,
//     secret: 'secret',
//     key: 'express.sid'
//   }));
//   app.use(function (res, req) {
//     res.end('Hello!');
//   });
// });

// app.listen(4000);
// var sio = io.listen(app);

// sio.sockets.on('connection', function (socket) {
//   var hs = socket.handshake;
//   console.log('a socket(' + hs.sessionID + ') connected');
//   var intervalID = setInterval(function () {
//     hs.session.reload( function () { 
//       hs.session.touch().save();
//     });
//   }, 60 * 1000);
//   socket.on('disconnect', function () {
//     console.log('A socket with sessionID ' + hs.sessionID + ' disconnected!');
//     clearInterval(intervalID);
//   });
// });

// sio.set('authorization', function (data, accept) {
//     if (data.headers.cookie) {
//         data.cookie = parseCookie(data.headers.cookie);
//         data.sessionID = data.cookie['express.sid'];
//         data.sessionStore = sessionStore;
//         sessionStore.get(data.sessionID, function (err, session) {
//           if (err || !session) {
//             accept('Error', false);
//           } else {
//             data.session = new Session(data, session);
//             accept(null, true);
//           }
//         });
//     } else {
//        return accept('No cookie transmitted.', false);
//     }
//     accept(null, true);
// });
