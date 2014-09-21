var _ = require('lodash');
var moment = require('moment');

var bubble = {
  initialize:  function () {
    bubble.x = 100;
    bubble.y = 100;
    bubble.lastFire = moment().valueOf();
  },

  _eventActions: function  (input) {
    var eventActions = {};
    eventActions[input.keycode.right] = function () {
      bubble.x += 3;
    };
    eventActions[input.keycode.left] = function () {
      bubble.x -= 3;
    };
    eventActions[input.keycode.down] = function () {
      bubble.y += 3;
    };
    eventActions[input.keycode.up] = function () {
      bubble.y -= 3;
    };
    eventActions['D'] = function () {
      bubble.shoot({
        velocity: {
          x: 1,
          y: 0
        },
        pos: bubble.pos()
      });
    };
    eventActions['W'] = function () {
      bubble.shoot({
        velocity: {
          x: 0,
          y: -1
        },
        pos: bubble.pos()
      });
    };
    eventActions['S'] = function () {
      bubble.shoot({
        velocity: {
          x: 0,
          y: 1
        },
        pos: bubble.pos()
      });
    };
    eventActions['A'] = function () {
      bubble.shoot({
        velocity: {
          x: -1,
          y: 0
        },
        pos: bubble.pos()
      });
    };
    return eventActions;
  },

  _handleEvents: function handleEvents (events, deps) {
    var input = deps.input;
    var io = deps.io;

    var actions = bubble._eventActions(input);
    _.map(events, function (_event) {
      var e = actions[_event];
      if (_.isFunction(e)) {
        e();
        io.emit('update', bubble.info());
      }
    });
  },

  canFire: function () {
    var timeSinceLastFireInMS = moment().valueOf() - bubble.lastFire;

    if (timeSinceLastFireInMS > 200 && bubble.lasors.length < 3) {
      return true;
    }
    return false;
  },

  shoot: function  (opts) {
    if (bubble.canFire()) {
      bubble.lastFire = moment().valueOf();

      var lasor = _.pick(opts, ['velocity', 'pos']);
      bubble.lasors.push(lasor);
    }
  },

  pos: function () {
    return {
      x: bubble.x,
      y: bubble.y
    };
  },

  _updateLasors: function  () {
    bubble.lasors = _.compact(_.map(bubble.lasors, function updateLasors (lasor) {
      lasor.pos.x += lasor.velocity.x;
      lasor.pos.y += lasor.velocity.y;
      if (lasor.pos.x < 0 || lasor.pos.x > 600 ||
          lasor.pos.y < 0 || lasor.pos.y > 400) {
        return undefined;
      }
      return lasor;
    }));
  },

  update: function update(deps) {
    var input = deps.input;
    var events = input.get();

    bubble._handleEvents(events, deps);
    if (!_.isEmpty(bubble.lasors)) {
      bubble._updateLasors();
      deps.io.emit('update', bubble.info());
    }
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
    canvas.fillStyle = "#0F0";
    _.each(bubble.lasors, function drawLasors (lasor) {
      canvas.fillRect(lasor.pos.x, lasor.pos.y, 10, 10);
    });
    canvas.restore();
  },

  info: function () {
    return {
      lasors: bubble.lasors,
      pos: bubble.pos()
    };
  },

  lasors: []
}

module.exports = bubble;
