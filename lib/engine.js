var canvas = require('./gameCanvas');
var input = require('./gameInput');
// var assets = require('./gameAssets');
var sockets = require('./client');

module.exports = engine = {
  initialize: function init (config) {
    canvas.initialize(config, null);// assets.images);
    
  },

  dependencies: {
        canvas: canvas, 
        input: input, 
        // assets: assets,
        io: sockets.initialize()
  },

  animFrame: window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame    ||
             window.oRequestAnimationFrame      ||
             window.msRequestAnimationFrame     ||
             null,

  run: function run (scene, callback) {
    scene.initialize(engine.dependencies);

    var recursiveAnim =  function() {
      scene.run(engine.dependencies, function(status) {
        if(status != 'running') {
          callback(status);
          return;
        }
        // assets.sounds.play();
        engine.animFrame.call(window, recursiveAnim );
      });
    };

    engine.animFrame.call(window, recursiveAnim );
  }
}

