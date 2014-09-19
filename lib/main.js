var engine = require('./engine');
var menu = require('../scenes/menu');
var shooter = require('../scenes/shooter');
var config = require('../config');

var scenes = {
    menu: newMenuScene,
    game: newShooterScene
};


function newMenuScene() {
    var menuScene = new menu(config);
    engine.run(menuScene, done);
}

function newShooterScene() {
    var shooterScene = new shooter(config);
    engine.run(shooterScene, done);
}

function done(scene) {
    if(scene == 'running') return;
    nextScene = scenes[scene] || newMenuScene;
    nextScene();
}

var main = {

    initialize: function init (config) {
        engine.initialize(config);
    },

    play: function play() {
        var menu = newMenuScene();
    }
}

main.initialize(config);
main.play();

