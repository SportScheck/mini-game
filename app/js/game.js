import Background from './background';
import Obstacle from './obstacle';
import Runner from './runner';
import Score from './score';

const GROUND_SPEED = 2;

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

      this.totalAssets = 0;
      this.loadedAssets = 0;
      this.splashScreen = false;
      this.initalStart = true;

      this.myReq = null;
      this.level = 0;

      this.isCrashed = false;

      this.images = {};
      this.ground = null;
      this.clouds = null;
      this.skyline = null;
      this.runner = null;
      this.score = null;
      this.obstaclesArray = new Array();
      this.referenceSpeed = GROUND_SPEED;

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
        this.score.onResize(newCanvasWidth)
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
      }
    }

    _hideSplashscreen(e) {
      if (this.splashScreen === true) {
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
      // set image list
      let urls = {
        'ground': 'http://i1.adis.ws/i/sportscheck/minigame_ground',
        'clouds': 'http://i1.adis.ws/i/sportscheck/minigame_clouds',
        'skyline': 'http://i1.adis.ws/i/sportscheck/minigame_skyline',
        'runner': 'http://i1.adis.ws/i/sportscheck/minigame_runner_sprite',
        'fire': 'http://i1.adis.ws/i/sportscheck/minigame_fire_sprite'
      };

      this.totalAssets = Object.keys(urls).length;
      // start preloading
      Object.entries(urls).forEach(
        ([key, value]) => {
          this.images[key] = new Image();
          this.images[key].onload = function() {
            this._assetLoaded();
          }.bind(this);
          this.images[key].src = value;
        }
      );

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

         if (obstacleNo > 6) {
           let i = 0;

           while (i < obstacleNo - 2) {
             i++;
             this.obstaclesArray.shift();
           }
         }
       });

       this.score.update();

       if (this.isCrashed) {
         this.runner.reset();
         this.ground.updateSpeed(GROUND_SPEED);

         this.referenceSpeed = GROUND_SPEED;
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
      if (this.gameArea.frameNo == 1 || (this.gameArea.frameNo / (130 - (this.level * 5)) % 1 == 0)) {
        const randomFactor = Math.floor(Math.random() * (100 - 1) + 1);
        if (randomFactor % 2 === 0) {
          this.obstaclesArray.push(new Obstacle(this.gameArea, this.images.fire, this.referenceSpeed, 600 + randomFactor));
        }
      }
    }

    _updateObstaclesSpeed(obstacles, newSpeed) {
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].updateSpeed(newSpeed);
      }
    }

    _nextLevel() {
      this.level += 1;
      this.referenceSpeed = GROUND_SPEED + this.level / 2;
      this.runner.nextLevel(this.level);
      this.ground.updateSpeed(this.referenceSpeed);
      this._updateObstaclesSpeed(this.obstaclesArray, this.referenceSpeed);
    }

    _startGame() {
      if (this.initalStart) {
        this.initalStart = false;

        this.gameArea.start();

        this.skyline = new Background(this.gameArea, this.images.skyline, 0.3, 0, 40);
        this.clouds = new Background(this.gameArea, this.images.clouds, 0.6, 0, 40);
        this.ground = new Background(this.gameArea, this.images.ground, GROUND_SPEED, 0, 280);
        this.runner = new Runner(this.gameArea, this.images.runner, this.level);
        this.score = new Score(this.gameArea);
      } else {
        this.gameArea.frameNo = 0;
        this.obstaclesArray = [];
        this.isCrashed = false;
        this.level = 0;
        this.runner.reset();
      }

      let myEfficientFn = this._debounce(function() {
        this._setCanvasWidth('resize');
        window.cancelAnimationFrame(this.myReq);
        this._animate();
      }.bind(this), 250);
      window.addEventListener('resize', myEfficientFn);

      this._animate();
    }
}

module.exports = MiniGame;
