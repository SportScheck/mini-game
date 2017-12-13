const gameArea = {
  canvas: document.getElementById('minigame'),
  start: function() {
    this.context = this.canvas.getContext('2d');
  }
}

let spritesheet = new SpriteSheet('./assets/spritesheet.png', 125, 125, 4, 16);
let background = new Background();
background.init(0,0);

function animate() {
   window.requestAnimationFrame( animate );
   gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);
   spritesheet.update();
   spritesheet.draw(12.5, 12.5);

   background.draw();
}

function startGame() {
  gameArea.start();

  Background.prototype.context = gameArea.context;
	Background.prototype.canvasWidth = gameArea.width;
	Background.prototype.canvasHeight = gameArea.height;

  animate();
}

startGame();
