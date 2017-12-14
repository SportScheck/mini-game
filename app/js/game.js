let myReq;
let isCrashed = false;
let splashScreen = false;
let initalStart = true;
let level = 0;
const GROUND_SPEED = 2;
let obstacleSpeed = GROUND_SPEED;

const gameArea = {
  canvas: document.getElementById('minigame'),
  prestart: function() {
  },
  start: function() {
    setCanvasWidth('initial');
    this.context = this.canvas.getContext('2d');
    this.frameNo = 0;
  },
  stop: function() {
    window.cancelAnimationFrame(myReq);
  }
}

function setCanvasWidth(type) {
  const clientWidth = document.getElementsByClassName('minigame-container')[0].clientWidth;
  const maxWidth = 600;
  const newCanvasWidth = clientWidth < maxWidth ? clientWidth : maxWidth;

  gameArea.canvas.width = newCanvasWidth;
  gameArea.x = newCanvasWidth;
  gameArea.canvas.height = 400;
  gameArea.y = 400;

  if (type === 'resize') {
    score.x = newCanvasWidth / 2;
  }
}

function debounce(func, wait, immediate) {
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
};

let totalAssets = 0;
let loadedAssets = 0;
let images = new Array();

let ground;
let clouds;
let skyline;
let runner;
let score;
let obstaclesArray = new Array();

function endScreen() {
  gameArea.context.font = '15px GameFont';
  gameArea.context.fillStyle = 'black';
  gameArea.context.textAlign = 'center';
  gameArea.context.fillText('this.text', 300, 60);
}

function assetLoaded() {
  loadedAssets++;
  splashScreen = true;
  if (loadedAssets === totalAssets) {
    window.addEventListener('keydown', e => {
      if(e.keyCode == 32) {
        hideSplashscreen(splashScreen);
      }
    });
    window.addEventListener('touchstart', hideSplashscreen);

    let myEfficientFn = debounce(function() {
    	setCanvasWidth('resize');
      window.cancelAnimationFrame(myReq);
      animate();
    }, 250);
    window.addEventListener('resize', myEfficientFn);
  }
}

function hideSplashscreen(e) {

  if(splashScreen === true) {
    document.getElementById('splashScreen').style.display = 'none';
    document.getElementById('minigame').style.display = 'block';
    splashScreen = false;
    startGame();
  }

}

function preloader() {
  // counter
  var i = 0;
  // create object
  imageObj = new Image();
  // set image list
  urls = new Array();
  urls[0] = './assets/ground.png';
  urls[1] = './assets/clouds.png';
  urls[2] = './assets/skyline.png';
  urls[3] = './assets/runner_sprite.png';
  urls[4] = './assets/fire_sprite.png';

  totalAssets = urls.length;

  // start preloading
  for(var i = 0; i < totalAssets; i++) {
    images[i] = new Image();
    images[i].onload = function() {
      assetLoaded();
    }
    images[i].src = urls[i];
  }
}

function createObstacles() {
  if (gameArea.frameNo == 1 || (gameArea.frameNo / 130 % 1 == 0)) {
    const randomFactor = Math.floor(Math.random() * (100 - 1) + 1);
    if (randomFactor % 2 === 0) {
      obstaclesArray.push(new Obstacle(images[4], obstacleSpeed, 600 + randomFactor));
    }
  }
}

function crash(runner, obstacle) {
  var runnerLeft = runner.x;
  var runnerRight = runner.x + (runner.frameWidth);
  var runnerTop = runner.y;
  var runnerBottom = runner.y + runner.dy + (runner.frameHeight);
  var obstacleLeft = obstacle.x;
  var obstacleRight = obstacle.x + (obstacle.frameWidth);
  var obstacleTop = obstacle.y;
  var obstacleBottom = obstacle.y + (obstacle.frameHeight);
  if ((runnerRight < obstacleLeft) || (runnerLeft > obstacleRight) || (runnerBottom < obstacleTop)) {
     return;
  }
  isCrashed = true;
}

function animate() {
   myReq = window.requestAnimationFrame(animate);

   gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);

   obstaclesArray.forEach((obstacle) => {
     crash(runner, obstacle);
   });


   skyline.draw();
   clouds.draw();
   ground.draw();

   if (isCrashed) {
     runner.crash();
   }
   runner.update();
   runner.draw();

   createObstacles();
    obstaclesArray.forEach((obstacle) => {
      obstacle.update();
      obstacle.draw();

      let obstacleNo = obstaclesArray.length;

      if (obstacleNo > 5) {
        for (i = 0; i < obstacleNo - 2; i++) {
          obstaclesArray.shift();
        }
      }
    });

   score.update();

   if (isCrashed) {
     runner.level = 0;
     runner.reset();
     ground.speed = GROUND_SPEED;
     obstacleSpeed = GROUND_SPEED;
     score.done();
     gameArea.stop();
     splashScreen = true;
   }

   gameArea.frameNo++;
   if (gameArea.frameNo % 500 === 0) {
     nextLevel();
   }
}

function updateSpeed(obstacles, newSpeed) {
  for (i = 0; i < obstacles.length; i++) {
    obstacles[i].speed = newSpeed;
  }
}

function nextLevel() {
  level += 1;
  runner.nextLevel(level);
  ground.speed = GROUND_SPEED + level / 2;
  obstacleSpeed = GROUND_SPEED + level / 2;
  updateSpeed(obstaclesArray, obstacleSpeed);
}

function startGame() {
  if (initalStart) {
    initalStart = false;

    gameArea.start();

    skyline = new Background(images[2], 0.3, 0, 40);
    clouds = new Background(images[1], 0.6, 0, 40);
    ground = new Background(images[0], GROUND_SPEED, 0, 280);
    runner = new Runner(images[3], level);
    score = new Score();
  } else {
    gameArea.frameNo = 0;
    obstaclesArray = [];
    isCrashed = false;
    level = 0;
    runner.reset();
  }

  animate();
}

preloader();
