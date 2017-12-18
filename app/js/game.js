import Background from './background';
import Obstacle from './obstacle';
import Runner from './runner';
import Score from './score';

const GROUND_SPEED = 2;
const SCORE_SIZE = 0.003;
const HEADLINE_SIZE = 0.006;

class MiniGame {
    constructor() {
      const _this = this;
      this.gameArea = {
        canvas: document.getElementById('minigame'),
        start: function() {
          _this._setCanvasWidth('initial');
          this.context = this.canvas.getContext('2d');
          this.frameNo = 0;
          this.canvas.classList.add('minigame--started');
        },
        stop: function() {
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

    _setCanvasWidth(type) {
      const clientWidth = document.getElementsByClassName('minigame-container')[0].clientWidth;
      const maxWidth = 600;
      const newCanvasWidth = clientWidth < maxWidth ? clientWidth : maxWidth;

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

    _debounce(func, wait, immediate) {
    	let timeout;
    	return function() {
    		let context = this;
        let args = arguments;
    		let later = function() {
    			timeout = null;
    			if (!immediate) func.apply(context, args);
    		};
    		let callNow = immediate && !timeout;
    		clearTimeout(timeout);
    		timeout = setTimeout(later, wait);
    		if (callNow) func.apply(context, args);
    	};
    }

    _endScreen() {
      this.gameArea.context.font = '15px GameFont';
      this.gameArea.context.fillStyle = 'black';
      this.gameArea.context.textAlign = 'center';
      this.gameArea.context.fillText('this.text', 300, 60);
    }

    _assetLoaded() {
      this.loadedAssets++;
      this.splashScreen = true;
      if (this.loadedAssets === this.totalAssets) {
        window.addEventListener('keydown', e => {
          if(e.keyCode == 32) {
            e.preventDefault();
            this._hideSplashscreen(this.splashScreen);
          }
        });
        window.addEventListener('click', e => {
          e.preventDefault();
          this._hideSplashscreen(this.splashScreen);
        });

        const canvasElement = document.querySelector('#minigame');

        canvasElement.addEventListener('touchstart', this._hideSplashscreen);
        canvasElement.addEventListener('click', this._hideSplashscreen);

        let myEfficientFn = this._debounce(function() {
        	this._setCanvasWidth('resize');
          window.cancelAnimationFrame(this.myReq);
          this._animate();
        }.bind(this), 250);
        window.addEventListener('resize', myEfficientFn);
      }
    }

    _hideSplashscreen(e) {
      if(document.getElementById('splashScreen')) {
        document.getElementById('splashScreen').style.display = 'none';
      }

      if(this.splashScreen === true) {
        this.splashScreen = false;
        document.getElementById('minigame').style.display = 'block';
        this._startGame();
      }
    }

    _loadFont() {
      let head = document.getElementsByTagName('head')[0];

      let newStyle = document.createElement('link');
      newStyle.href = 'https://fonts.googleapis.com/css?family=Press+Start+2P';
      newStyle.rel = 'stylesheet';

      document.head.appendChild(newStyle);
    }

    _preloader() {
      // counter
      var i = 0;
      // set image list
      let urls = new Array();
      urls[0] = 'http://i1.adis.ws/i/sportscheck/minigame_ground';
      urls[1] = 'http://i1.adis.ws/i/sportscheck/minigame_clouds';
      urls[2] = 'http://i1.adis.ws/i/sportscheck/minigame_skyline';
      urls[3] = 'http://i1.adis.ws/i/sportscheck/minigame_runner_sprite';
      urls[4] = 'http://i1.adis.ws/i/sportscheck/minigame_fire_sprite';

      this.totalAssets = urls.length;
      // start preloading
      for(var i = 0; i < this.totalAssets; i++) {
        this.images[i] = new Image();
        this.images[i].onload = function() {
          this._assetLoaded();
        }.bind(this);
        this.images[i].src = urls[i];
      }

      this._loadFont();
    }

    _crash(runner, obstacle) {
      const runnerLeft = runner.x;
      const runnerRight = runner.x + (runner.frameWidth);
      const runnerTop = runner.y;
      const runnerBottom = runner.y + runner.dy + (runner.frameHeight);
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + (obstacle.frameWidth);
      const obstacleTop = obstacle.y;
      const obstacleBottom = obstacle.y + (obstacle.frameHeight);
      if ((runnerRight < obstacleLeft) || (runnerLeft > obstacleRight) || (runnerBottom < obstacleTop)) {
         return;
      }
      this.isCrashed = true;
    }

    _animate() {
       this.myReq = window.requestAnimationFrame(this._animate.bind(this));

       this.gameArea.context.clearRect(0, 0, this.gameArea.canvas.width, this.gameArea.canvas.height);

       this.obstaclesArray.forEach((obstacle) => {
         this._crash(this.runner, obstacle);
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

       this.obstaclesArray.forEach((obstacle) => {
         obstacle.update();
         obstacle.draw();

         let obstacleNo = this.obstaclesArray.length;

         if (obstacleNo > 5) {
           let i = 0;

           while (i < obstacleNo - 2) {
             i++;
             this.obstaclesArray.shift();
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

    _createObstacles() {
      if (this.gameArea.frameNo == 1 || (this.gameArea.frameNo / 130 % 1 == 0)) {
        const randomFactor = Math.floor(Math.random() * (100 - 1) + 1);
        if (randomFactor % 2 === 0) {
          this.obstaclesArray.push(new Obstacle(this.gameArea, this.images[4], this.obstacleSpeed, 600 + randomFactor));
        }
      }
    }

    _updateSpeed(obstacles, newSpeed) {
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].speed = newSpeed;
      }
    }

    _nextLevel() {
      this.level += 1;
      this.runner.nextLevel(this.level);
      this.ground.speed = GROUND_SPEED + this.level / 2;
      this.obstacleSpeed = GROUND_SPEED + this.level / 2;
      this._updateSpeed(this.obstaclesArray, this.obstacleSpeed);
    }

    _startGame() {
      if (this.initalStart) {
        this.initalStart = false;

        this.gameArea.start();

        this.skyline = new Background(this.gameArea, this.images[2], 0.3, 0, 40);
        this.clouds = new Background(this.gameArea, this.images[1], 0.6, 0, 40);
        this.ground = new Background(this.gameArea, this.images[0], GROUND_SPEED, 0, 280);
        this.runner = new Runner(this.gameArea, this.images[3], this.level);
        this.score = new Score(this.gameArea);
      } else {
        this.gameArea.frameNo = 0;
        this.obstaclesArray = [];
        this.isCrashed = false;
        this.level = 0;
        this.runner.reset();
      }

      this._animate();
    }
}

module.exports = MiniGame;
