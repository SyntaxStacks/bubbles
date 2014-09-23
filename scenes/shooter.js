var ui = require('./ui');
var enemy = require('../sprites/enemy');
var hero = require('../sprites/hero');
var _ = require('lodash');

function Shooter(config) {

    var scoreboard      = new ui(config);
    var enemyList       = {};
    var heroId = '';

    //these variables need to be arranged into a properties object
    var FRAMEHEIGHT     = config.frameHeight;
    var FRAMEWIDTH      = config.frameWidth;
    var ENEMYSCOREVALUE = 100;
    var gameover        = false;
    var drawStyle       = '2D';
    var delay           = 10;
    hero.initialize(config);
    var ship = hero;
    var status = 'running';

    this.enemies        = getEnemies;
    this.run            = run;
    this.draw           = draw;
    this.drawEnemies = drawEnemies;
    this.initialize = initialize;
    function initialize(deps) { 
      var io = deps.io;
      io.on('update', updatePlayer); 
      io.on('init', function (data) {
        console.log(data);
        enemyList = data.clients;
        heroId = data.id;
      }); 
      io.on('kill', function (player) {
        enemyList = _.omit(enemyList, player.id);
        if (player.id == heroId) {
          return goToMenu();
        }
      }); 
      io.emit('start', ship.info());
    }
    function getEnemies()    {
      return _.transform(enemyList, function (res, enemy, key) {
          res.push(enemyList[key]);
          return res;
      }, []); 
    }
    function getShip()       { return ship; }
    function getShipLasors() { return getShip().lasors(); }
    function getShipBombs() { return getShip().bombs(); }
    function setDrawStyle(style)      { drawStyle = style; }
    function updatePlayer(player) {
      enemyList[player.id] = player;
    }
    function draw(canvas) {
        canvas.rotate(0);
        canvas.translate(0,0);
        canvas.save();

        drawGameScreen(canvas);
        canvas.restore();
    }

    function drawGameScreen(canvas) {

        canvas.save();
        
        canvas.fillSytle = '#000';
        canvas.fillRect(0,0,FRAMEWIDTH,FRAMEHEIGHT);

        getShip().draw(canvas, drawStyle);
        canvas.restore();
        var enemies = getEnemies();
        canvas.save();
        _.map(enemies, function (enemy) {
            canvas.fillStyle = "#00F";
            canvas.fillRect(enemy.pos.x, enemy.pos.y, 10, 10);
            canvas.fillStyle = "#0F0";
            _.each(enemy.lasors, function drawLasors (lasor) {
              canvas.fillRect(lasor.pos.x, lasor.pos.y, 10, 10);
            });
            
        });
        canvas.restore();
    }


    function drawEnemies(canvas, drawStyle) {
    }

    function getEnemyLasors() {
        var lasors = [];
        var enemies = getEnemies();
        _.forEach (enemies, function (enemy) {
            var enemyLasors = enemy.lasors();
            if (_.isEmpty(enemyLasors)) {
                return;
            }
            _.forEach (enemyLasors, function (lasor) {
                lasors.push(lasor);
            });
        });

        return lasors;
    }

    function collides(obj1, obj2) {
        if(obj1.pos.y >= obj2.pos.y && obj1.pos.y <= obj2.pos.y + 10) {
            if(obj1.pos.x >= obj2.pos.x && obj1.pos.x <= obj2.pos.x + 10) {
              return true;
            }
        }  

        return false;
    }

    function checkForHit(deps) {
        var lasors = ship.lasors;
        var enemies = getEnemies();

        _.map(enemies, function( enemy ) {
            _.map(lasors, function( lasor ) {
                if(collides(lasor, enemy)) {
                    console.log(enemy);
                    enemyList = _.omit(enemyList, enemy.id);
                    deps.io.emit('kill', enemy);
                }
            });
        });
    }

    function startGame() {
        scoreboard.reset();
        status = 'running';
    }

    function goToMenu() {
        status = 'menu';
    }

    function endGame() {
        goToMenu();
        enemyList = [];
    }

    function createNewLevel() {
        scoreboard.addLevel();
        if(scoreboard.level() >= 5) drawStyle = '2D';
        getShip().replenishBombs();
        for(var i = 0; i < scoreboard.level()*2; i++) {
            newEnemy = new enemy(config);
            newEnemy.setLocationX(-50*i);
            enemyList.push(newEnemy);
        }
    }

    function updateSprites(deps) {
        getShip().update(deps);

        // var enemies = getEnemies();
        // _.map (enemies, function (currentEnemy) {
        //     currentEnemy.update(deps, getShip());
        // });
    }

    function removeDestroyedObjects(){
        var enemies = getEnemies();

        enemies = _.map( enemies, function( currentEnemy ) {
            if( _.isUndefined( currentEnemy ) || currentEnemy.isDestroyed() ) { return null; }
            return currentEnemy;
        });

        enemies = _.compact(enemies);
        setEnemies(enemies);
    }

    function updateUI() {
        scoreboard.setBombs(getShip().bombCount());
    }

    function checkForRestart() {
        events = input.get();

        _.map( events, function( event ) {
            if(event.input == "SPACE" || (event.input == "LEFT" && event.input == "RIGHT") )
                startGame();
            if(event.input == "e") {
                startGame();
                for(var i = 0; i <100; i++)
                    scoreboard.addLevel();
                enemyList = [];
            }
        });
    }

    function run(deps, callback) {
        updateSprites(deps);
        checkForHit(deps);
        // removeDestroyedObjects();
        // updateUI();
        

        deps.canvas.render(draw);
        callback(status);
    }
}

module.exports = Shooter;
