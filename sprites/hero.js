var _ = require('lodash');

var bubble = {
  initialize:  function () {
    bubble.x = 100;
    bubble.y = 100;
  },

  _handleEvents: function handleEvents (events, deps) {
    var input = deps.input;
    var io = deps.io;
    var eventActions = {};
    eventActions[input.keycode.right] = function () {
      bubble.x += 3;
      io.emit('update', { x: bubble.x, y: bubble.y} );
    };
    eventActions[input.keycode.left] = function () {
      bubble.x -= 3;
      io.emit('update', { x: bubble.x, y: bubble.y} );
    };

    _.map( events, function( _event ) {
      var e = eventActions[_event];
      if(_.isFunction(e)) {
        e();
      }
    });
  },

  update: function update(deps) {
    var input = deps.input;
    var events = input.get()

    bubble._handleEvents(events, deps);
  },

  draw: function draw(canvas, style) {
    canvas.save();
    bubble._drawBubble(canvas);
    canvas.restore();
    return canvas;
  },

  _drawBubble: function drawBubble(canvas) {
    canvas.save();
    canvas.fillStyle = "#FFF";
    canvas.fillRect(bubble.x, bubble.y, 10, 10);
    canvas.restore();
  }
}

module.exports = bubble;
