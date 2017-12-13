const gameArea = {
  canvas: document.getElementById('minigame'),
  start: function() {
    this.context = this.canvas.getContext('2d');
    this.frameNo = 0;
  },
  stop: function() {
    window.requestAnimationFrame();
  }
}

let totalAssets = 0;
let loadedAssets = 0;
let images = new Array();

let ground;
let clouds;
let skyline;
let runner;
let score;
let obstaclesArray = new Array();

function assetLoaded() {
  loadedAssets++;
  if (loadedAssets === totalAssets) {
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
  if (gameArea.frameNo == 1 || ((gameArea.frameNo / 150) % 1 == 0)) {
    obstaclesArray.push(new Obstacle(images[4], 1.5));
  }
}

function animate() {
   window.requestAnimationFrame(animate);
   gameArea.frameNo++;
   gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);

   skyline.draw();
   clouds.draw();
   ground.draw();

   runner.update();
   runner.draw();

   createObstacles();
   obstaclesArray.forEach((obstacle) => {
     // TODO: Dont forget to pop the obstacle of the array!!!!!!
     obstacle.update();
     obstacle.draw();
   });

   score.update();
}

function startGame() {
  gameArea.start();

  skyline = new Background(images[2], 0.3, 0, 40);
  clouds = new Background(images[1], 0.6, 0, 40);
  ground = new Background(images[0], 1.5, 0, 280);
  runner = new Runner(images[3]);
  score = new Score();

  Background.prototype.context = gameArea.context;
	Background.prototype.canvasWidth = gameArea.width;
	Background.prototype.canvasHeight = gameArea.height;

  animate();
}

preloader();
