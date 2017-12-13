const RUNNER_HEIGHT = 125;
const RUNNER_WIDTH = 125;
const RUNNER_SPEED = 4;
const JUMP_TIME = 20;

function Runner() {
  var frameWidth = RUNNER_WIDTH;
  var frameHeight = RUNNER_HEIGHT;
  var endFrame = 16;
  var frameSpeed = RUNNER_SPEED;
  var currentFrame = 0;  // the current frame to draw
  var counter = 0;

  var jumpCounter = JUMP_TIME;

  this.gravity   = 1;
  this.dy        = 0;
  this.jumpDy    = -10;
  this.isFalling = false;
  this.isJumping = false;

  let _this = this;

  this.jump = function() {
    if (this.isJumping) {
      this.dy += this.jumpDy;
      jumpCounter--;
    }

    if (this.isFalling) {
      this.dy -= this.jumpDy;
      jumpCounter--;
    }

    if (jumpCounter === JUMP_TIME / 2) {
      this.isJumping = false;
      this.isFalling = true;
    }

    if (jumpCounter === 0) {
      this.isFalling = false;
      jumpCounter = JUMP_TIME;
    }
  }

  this.update = function() {

    // update to the next frame if it is time
    if (counter == (frameSpeed - 1))
      currentFrame = (currentFrame + 1) % endFrame;

    // update the counter
    counter = (counter + 1) % frameSpeed;
  }

  this.draw = function(x, y) {
      var framesPerRow = Math.floor(this.image.width / frameWidth);

      // get the row and col of the frame
      var row = Math.floor(currentFrame / framesPerRow);
      var col = Math.floor(currentFrame % framesPerRow);

      this.jump();

      gameArea.context.drawImage(
         this.image,
         col * frameWidth, row * frameHeight,
         frameWidth, frameHeight,
         x, y + this.dy,
         frameWidth, frameHeight);
  };

  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 32 && !_this.isFalling) {
      _this.isJumping = true;
    }
  });
}

Runner.prototype = new component(RUNNER_WIDTH, RUNNER_HEIGHT, './assets/spritesheet.png', 'type', 12.5, 12.5);
