const gameArea = {
  canvas: document.getElementById('minigame'),
  start: function() {
    this.context = this.canvas.getContext('2d');
  }
}

let totalAssets = 0;
let loadedAssets = 0;
let images = new Array();

let ground;
let runner;

function assetLoaded() {
  loadedAssets++;
  if (loadedAssets === totalAssets) {
    console.log(images);
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
     urls[1] = './assets/spritesheet.png';

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


function animate() {
   window.requestAnimationFrame( animate );
   gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);

   ground.draw();

   runner.update();
   runner.draw();
}

function startGame() {
  gameArea.start();

  ground = new Background(images[0], 1);
  runner = new Runner(images[1]);

  Background.prototype.context = gameArea.context;
	Background.prototype.canvasWidth = gameArea.width;
	Background.prototype.canvasHeight = gameArea.height;

  animate();
}

preloader();
