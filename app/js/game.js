const gameArea = {
  canvas: document.getElementById('minigame'),
  start: function() {
    this.context = this.canvas.getContext('2d');
  }
}

let background = new Background();
let runner = new Runner();
background.init();
runner.init();

function animate() {
   window.requestAnimationFrame( animate );
   gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);

   background.draw();

   runner.update();
   runner.draw(12.5, 12.5);
}

function startGame() {
  gameArea.start();

  Background.prototype.context = gameArea.context;
	Background.prototype.canvasWidth = gameArea.width;
	Background.prototype.canvasHeight = gameArea.height;

  animate();
}

startGame();
