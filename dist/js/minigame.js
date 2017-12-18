(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MiniGame = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Background = function () {
	function Background(gameArea, image, speed, x, y) {
		_classCallCheck(this, Background);

		this.gameArea = gameArea;
		this.x = x;
		this.y = y;
		this.image = image;
		this.speed = speed;
	}

	_createClass(Background, [{
		key: "draw",
		value: function draw() {
			// Pan background
			this.x -= this.speed;
			this.gameArea.context.drawImage(this.image, this.x, this.y);

			this.gameArea.context.drawImage(this.image, this.x + this.image.width, this.y);
			// If the image scrolled off the screen, reset
			if (Math.abs(this.x) >= this.image.width) this.x = 0;
		}
	}]);

	return Background;
}();

module.exports = Background;

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _background = require('./background');

var _background2 = _interopRequireDefault(_background);

var _obstacle = require('./obstacle');

var _obstacle2 = _interopRequireDefault(_obstacle);

var _runner = require('./runner');

var _runner2 = _interopRequireDefault(_runner);

var _score = require('./score');

var _score2 = _interopRequireDefault(_score);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GROUND_SPEED = 2;
var SCORE_SIZE = 0.003;
var HEADLINE_SIZE = 0.006;

var MiniGame = function () {
  function MiniGame() {
    _classCallCheck(this, MiniGame);

    var _this = this;
    this.gameArea = {
      canvas: document.getElementById('minigame'),
      start: function start() {
        _this._setCanvasWidth('initial');
        this.context = this.canvas.getContext('2d');
        this.frameNo = 0;
        this.canvas.classList.add('minigame--started');
      },
      stop: function stop() {
        window.cancelAnimationFrame(_this.myReq);
      }
    };

    this.myReq = null;
    this.isCrashed = false;
    this.splashScreen = false;
    this.initalStart = true;
    this.level = 0;
    this.obstacleSpeed = GROUND_SPEED;
    this.totalAssets = 0;
    this.loadedAssets = 0;
    this.images = new Array();

    this.ground = null;
    this.clouds = null;
    this.skyline = null;
    this.runner = null;
    this.score = null;
    this.obstaclesArray = new Array();

    this._preloader();
  }

  _createClass(MiniGame, [{
    key: '_setCanvasWidth',
    value: function _setCanvasWidth(type) {
      var clientWidth = document.getElementsByClassName('minigame-container')[0].clientWidth;
      var maxWidth = 600;
      var newCanvasWidth = clientWidth < maxWidth ? clientWidth : maxWidth;

      this.gameArea.canvas.width = newCanvasWidth;
      this.gameArea.x = newCanvasWidth;
      this.gameArea.canvas.height = 300;
      this.gameArea.y = 300;

      if (type === 'resize') {
        this.score.x = newCanvasWidth / 2;
        this.score.size = SCORE_SIZE * (this.score.x * 2);
        this.score.headlineSize = HEADLINE_SIZE * (this.score.x * 2);
      }
    }
  }, {
    key: '_debounce',
    value: function _debounce(func, wait, immediate) {
      var timeout = void 0;
      return function () {
        var context = this;
        var args = arguments;
        var later = function later() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }
  }, {
    key: '_endScreen',
    value: function _endScreen() {
      this.gameArea.context.font = '15px GameFont';
      this.gameArea.context.fillStyle = 'black';
      this.gameArea.context.textAlign = 'center';
      this.gameArea.context.fillText('this.text', 300, 60);
    }
  }, {
    key: '_assetLoaded',
    value: function _assetLoaded() {
      var _this2 = this;

      this.loadedAssets++;
      this.splashScreen = true;
      if (this.loadedAssets === this.totalAssets) {
        window.addEventListener('keydown', function (e) {
          if (e.keyCode == 32) {
            e.preventDefault();
            _this2._hideSplashscreen(_this2.splashScreen);
          }
        });
        window.addEventListener('click', function (e) {
          e.preventDefault();
          _this2._hideSplashscreen(_this2.splashScreen);
        });

        var canvasElement = document.querySelector('#minigame');

        canvasElement.addEventListener('touchstart', this._hideSplashscreen);
        canvasElement.addEventListener('click', this._hideSplashscreen);
      }
    }
  }, {
    key: '_hideSplashscreen',
    value: function _hideSplashscreen(e) {
      if (this.splashScreen === true) {
        this.splashScreen = false;
        document.getElementById('minigame').style.display = 'block';
        this._startGame();
      }
    }
  }, {
    key: '_loadFont',
    value: function _loadFont() {
      var head = document.getElementsByTagName('head')[0];

      var newStyle = document.createElement('link');
      newStyle.href = 'https://fonts.googleapis.com/css?family=Press+Start+2P';
      newStyle.rel = 'stylesheet';

      document.head.appendChild(newStyle);
    }
  }, {
    key: '_preloader',
    value: function _preloader() {
      // counter
      var i = 0;
      // set image list
      var urls = new Array();
      urls[0] = 'http://i1.adis.ws/i/sportscheck/minigame_ground';
      urls[1] = 'http://i1.adis.ws/i/sportscheck/minigame_clouds';
      urls[2] = 'http://i1.adis.ws/i/sportscheck/minigame_skyline';
      urls[3] = 'http://i1.adis.ws/i/sportscheck/minigame_runner_sprite';
      urls[4] = 'http://i1.adis.ws/i/sportscheck/minigame_fire_sprite';

      this.totalAssets = urls.length;
      // start preloading
      for (var i = 0; i < this.totalAssets; i++) {
        this.images[i] = new Image();
        this.images[i].onload = function () {
          this._assetLoaded();
        }.bind(this);
        this.images[i].src = urls[i];
      }

      this._loadFont();
    }
  }, {
    key: '_crash',
    value: function _crash(runner, obstacle) {
      var runnerLeft = runner.x;
      var runnerRight = runner.x + runner.frameWidth;
      var runnerTop = runner.y;
      var runnerBottom = runner.y + runner.dy + runner.frameHeight;
      var obstacleLeft = obstacle.x;
      var obstacleRight = obstacle.x + obstacle.frameWidth;
      var obstacleTop = obstacle.y;
      var obstacleBottom = obstacle.y + obstacle.frameHeight;
      if (runnerRight < obstacleLeft || runnerLeft > obstacleRight || runnerBottom < obstacleTop) {
        return;
      }
      this.isCrashed = true;
    }
  }, {
    key: '_animate',
    value: function _animate() {
      var _this3 = this;

      this.myReq = window.requestAnimationFrame(this._animate.bind(this));

      this.gameArea.context.clearRect(0, 0, this.gameArea.canvas.width, this.gameArea.canvas.height);

      this.obstaclesArray.forEach(function (obstacle) {
        _this3._crash(_this3.runner, obstacle);
      });

      this.skyline.draw();
      this.clouds.draw();
      this.ground.draw();

      if (this.isCrashed) {
        this.runner.crash();
      }
      this.runner.update();
      this.runner.draw();

      this._createObstacles();

      this.obstaclesArray.forEach(function (obstacle) {
        obstacle.update();
        obstacle.draw();

        var obstacleNo = _this3.obstaclesArray.length;

        if (obstacleNo > 6) {
          var i = 0;

          while (i < obstacleNo - 2) {
            i++;
            _this3.obstaclesArray.shift();
          }
        }
      });

      this.score.update();

      if (this.isCrashed) {
        this.runner.level = 0;
        this.runner.reset();
        this.ground.speed = GROUND_SPEED;
        this.obstacleSpeed = GROUND_SPEED;
        this.score.done();
        this.gameArea.stop();
        this.splashScreen = true;
      }

      this.gameArea.frameNo++;
      if (this.gameArea.frameNo % 500 === 0) {
        this._nextLevel();
      }
    }
  }, {
    key: '_createObstacles',
    value: function _createObstacles() {
      if (this.gameArea.frameNo == 1 || this.gameArea.frameNo / 130 % 1 == 0) {
        var randomFactor = Math.floor(Math.random() * (100 - 1) + 1);
        if (randomFactor % 2 === 0) {
          this.obstaclesArray.push(new _obstacle2.default(this.gameArea, this.images[4], this.obstacleSpeed, 600 + randomFactor));
        }
      }
    }
  }, {
    key: '_updateSpeed',
    value: function _updateSpeed(obstacles, newSpeed) {
      for (var i = 0; i < obstacles.length; i++) {
        obstacles[i].speed = newSpeed;
      }
    }
  }, {
    key: '_nextLevel',
    value: function _nextLevel() {
      this.level += 1;
      this.runner.nextLevel(this.level);
      this.ground.speed = GROUND_SPEED + this.level / 2;
      this.obstacleSpeed = GROUND_SPEED + this.level / 2;
      this._updateSpeed(this.obstaclesArray, this.obstacleSpeed);
    }
  }, {
    key: '_startGame',
    value: function _startGame() {
      if (this.initalStart) {
        this.initalStart = false;

        this.gameArea.start();

        this.skyline = new _background2.default(this.gameArea, this.images[2], 0.3, 0, 40);
        this.clouds = new _background2.default(this.gameArea, this.images[1], 0.6, 0, 40);
        this.ground = new _background2.default(this.gameArea, this.images[0], GROUND_SPEED, 0, 280);
        this.runner = new _runner2.default(this.gameArea, this.images[3], this.level);
        this.score = new _score2.default(this.gameArea);
      } else {
        this.gameArea.frameNo = 0;
        this.obstaclesArray = [];
        this.isCrashed = false;
        this.level = 0;
        this.runner.reset();
      }

      var myEfficientFn = this._debounce(function () {
        this._setCanvasWidth('resize');
        window.cancelAnimationFrame(this.myReq);
        this._animate();
      }.bind(this), 250);
      window.addEventListener('resize', myEfficientFn);

      this._animate();
    }
  }]);

  return MiniGame;
}();

module.exports = MiniGame;

},{"./background":1,"./obstacle":3,"./runner":4,"./score":5}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OBSTACLE_HEIGHT = 60;
var OBSTACLE_WIDTH = 52;
var OBSTACLE_SPEED = 8;

var Obstacle = function () {
  function Obstacle(gameArea, image, speed) {
    _classCallCheck(this, Obstacle);

    this.gameArea = gameArea;
    this.image = image;
    this.frameWidth = OBSTACLE_WIDTH;
    this.frameHeight = OBSTACLE_HEIGHT;
    this.endFrame = 4;
    this.frameSpeed = OBSTACLE_SPEED;
    this.framesPerRow = Math.floor(this.image.width / this.frameWidth);
    this.currentFrame = 0;
    this.counter = 0;
    this.x = 600;
    this.y = 230;
    this.speed = speed;
  }

  _createClass(Obstacle, [{
    key: "update",
    value: function update() {
      // update to the next frame if it is time
      if (this.counter == this.frameSpeed - 1) {
        this.currentFrame = (this.currentFrame + 1) % this.endFrame;
      }

      // update the counter
      this.counter = (this.counter + 1) % this.frameSpeed;
    }
  }, {
    key: "draw",
    value: function draw() {
      if (this.x < -this.image.width) return;
      // Pan background
      this.x -= this.speed;

      var row = Math.floor(this.currentFrame / this.framesPerRow);
      var col = Math.floor(this.currentFrame % this.framesPerRow);

      this.gameArea.context.drawImage(this.image, col * this.frameWidth, row * this.frameHeight, this.frameWidth, this.frameHeight, this.x, this.y, this.frameWidth, this.frameHeight);
    }
  }]);

  return Obstacle;
}();

module.exports = Obstacle;

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RUNNER_HEIGHT = 72;
var RUNNER_WIDTH = 40;
var RUNNER_SPEED = 8;
var JUMP_TIME = 130;

var Runner = function () {
  function Runner(gameArea, image, level) {
    _classCallCheck(this, Runner);

    this.gameArea = gameArea;
    this.level = level;
    this.image = image;
    this.frameWidth = RUNNER_WIDTH;
    this.frameHeight = RUNNER_HEIGHT;
    this.endFrame = 3;
    this.frameSpeed = RUNNER_SPEED;
    this.framesPerRow = Math.floor(this.image.width / this.frameWidth);
    this.currentFrame = 0;
    this.counter = 0;
    this.jumpCounter = JUMP_TIME;
    this.jumpTime = JUMP_TIME;
    this.dy = 0;
    this.isFalling = false;
    this.isJumping = false;
    this.isCrashed = false;
    this.x = 60;
    this.y = 220;

    this.increaseLevel = false;

    var self = this;

    var canvasElement = document.querySelector('#minigame');

    window.addEventListener('keydown', function (e) {
      if (e.keyCode === 32 && !self.isFalling) {
        self.isJumping = true;
      }
    });
    canvasElement.addEventListener('click', function (e) {
      if (!self.isFalling) {
        self.isJumping = true;
      }
    });
    canvasElement.addEventListener('touchstart', function (e) {
      if (!self.isFalling) {
        self.isJumping = true;
      }
    });
  }

  _createClass(Runner, [{
    key: 'nextLevel',
    value: function nextLevel(level) {
      this.level = level;
      this.increaseLevel = true;
    }
  }, {
    key: 'updateLevel',
    value: function updateLevel() {
      this.jumpTime = JUMP_TIME - this.level * 10;
      this.jumpCounter = this.jumpTime;
    }
  }, {
    key: 'jump',
    value: function jump() {
      if (this.isJumping) {
        this.dy -= this.calculateHeightChange(this.jumpTime - this.jumpCounter);
        this.jumpCounter--;
      }

      if (this.isFalling) {
        this.dy -= this.calculateHeightChange(this.jumpTime - this.jumpCounter);
        this.jumpCounter--;
      }

      if (this.jumpCounter === this.jumpTime / 2) {
        this.isJumping = false;
        this.isFalling = true;
      }

      if (this.jumpCounter === 0) {
        this.isFalling = false;
        this.jumpCounter = this.jumpTime;
      }
    }
  }, {
    key: 'update',
    value: function update() {
      // update to the next frame if it is time
      if (this.counter == this.frameSpeed - 1) {
        this.currentFrame = (this.currentFrame + 1) % this.endFrame;
      }

      // update the counter
      this.counter = (this.counter + 1) % this.frameSpeed;
    }
  }, {
    key: 'runningAnim',
    value: function runningAnim(col, row, frameWidth, frameHeight, x, y) {
      this.gameArea.context.drawImage(this.image, col * frameWidth, row * frameHeight, frameWidth, frameHeight, x, y + this.dy, frameWidth, frameHeight);
    }
  }, {
    key: 'jumpingAnim',
    value: function jumpingAnim(col, row, frameWidth, frameHeight, x, y) {
      this.gameArea.context.drawImage(this.image, frameWidth, 0, frameWidth, frameHeight, x, y + this.dy, frameWidth, frameHeight);
    }
  }, {
    key: 'crashAnim',
    value: function crashAnim(col, row, frameWidth, frameHeight, x, y) {
      this.gameArea.context.drawImage(this.image, frameWidth * 3, 0, frameWidth, frameHeight, x, y + this.dy, frameWidth, frameHeight);
    }
  }, {
    key: 'crash',
    value: function crash() {
      this.isCrashed = true;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.isCrashed = false;
      this.isJumping = false;
      this.isFalling = false;
      this.dy = 0;
      this.currentFrame = 0;
      this.counter = 0;
      this.jumpTime = JUMP_TIME - this.level * 15;
      this.jumpCounter = this.jumpTime;
    }
  }, {
    key: 'draw',
    value: function draw() {
      // get the row and col of the frame
      var row = Math.floor(this.currentFrame / this.framesPerRow);
      var col = Math.floor(this.currentFrame % this.framesPerRow);

      this.jump();

      if (this.isCrashed) {
        this.crashAnim(col, row, this.frameWidth, this.frameHeight, this.x, this.y);
      } else if (this.isJumping || this.isFalling) {
        this.jumpingAnim(col, row, this.frameWidth, this.frameHeight, this.x, this.y);
      } else {
        if (this.increaseLevel) {
          this.updateLevel();
          this.increaseLevel = false;
        }
        this.runningAnim(col, row, this.frameWidth, this.frameHeight, this.x, this.y);
      }
    }
  }, {
    key: 'calculateHeightChange',
    value: function calculateHeightChange(time) {
      var oldHeight = -450 * Math.pow(time / this.jumpTime - 0.5, 2);
      var newHeight = -450 * Math.pow((time + 1) / this.jumpTime - 0.5, 2);
      return newHeight - oldHeight;
    }
  }]);

  return Runner;
}();

module.exports = Runner;

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SCORE_FONT = '"Press Start 2P"';
var SCORE_SIZE = 0.003;
var HEADLINE_SIZE = 0.006;
var SPACE = 40;
var MAX_TEXT = 1.4;
var MAX_HEADLINE = 2.5;

var Score = function () {
  function Score(gameArea) {
    _classCallCheck(this, Score);

    this.gameArea = gameArea;
    this.font = SCORE_FONT;
    this.size = SCORE_SIZE * this.gameArea.x;
    this.headlineSize = HEADLINE_SIZE * this.gameArea.x;
    this.speed = 3;
    this.color = 'black';
    this.distance = 0;
    this.calories = 0;
    this.x = this.gameArea.x / 2;
    this.y = 40;
  }

  _createClass(Score, [{
    key: '_checkFontSize',
    value: function _checkFontSize() {
      if (this.size > MAX_TEXT) {
        this.size = MAX_TEXT;
      };
      if (this.headlineSize > MAX_HEADLINE) {
        this.headlineSize = MAX_HEADLINE;
      };
    }
  }, {
    key: 'update',
    value: function update() {
      var ctx = this.gameArea.context;

      this.distance = parseInt(this.gameArea.frameNo / 50 * this.speed);

      var text = 'GELAUFENE STRECKE: ' + this.distance + 'M';

      this._checkFontSize();

      ctx.font = this.size + 'em' + ' ' + this.font;
      ctx.fillStyle = this.color;
      ctx.textAlign = "center";
      ctx.fillText(text, this.x, this.y);
    }
  }, {
    key: 'done',
    value: function done() {
      var ctx = this.gameArea.context;

      this.calories = parseInt(this.gameArea.frameNo / 50 * 0.2);

      // text blocks
      var text = 'G A M E  O V E R';
      var text2 = 'DU HAST ' + this.calories + ' KCAL VERBRANNT!';
      var text3 = 'STARTEN & SPRINGEN MIT';
      var text4 = 'LEERTASTE ODER KLICK';

      // text positions
      var positionYText = SPACE * 2.5;
      var positionYText2 = SPACE * 3.5;
      var positionYText3 = SPACE * 4.5;
      var positionYText4 = SPACE * 5;

      // general text style
      ctx.fillStyle = this.color;
      ctx.textAlign = 'center';

      this._checkFontSize();

      // define size and set headline on canvas
      ctx.font = this.headlineSize + 'em' + ' ' + this.font;
      ctx.fillText(text, this.x, positionYText);

      if (this.size > MAX_TEXT) {
        this.size = MAX_TEXT;
      };

      // define size and set text on canvas
      ctx.font = this.size + 'em' + ' ' + this.font;
      ctx.fillText(text2, this.x, positionYText2);
      ctx.fillText(text3, this.x, positionYText3);
      ctx.fillText(text4, this.x, positionYText4);
    }
  }]);

  return Score;
}();

module.exports = Score;

},{}]},{},[2])(2)
});