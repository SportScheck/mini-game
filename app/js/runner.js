const RUNNER_HEIGHT = 72;
const RUNNER_WIDTH = 40;
const RUNNER_SPEED = 8;
const JUMP_TIME = 120;

class Runner {
  constructor(image) {
    this.image = image;
    this.frameWidth = RUNNER_WIDTH;
    this.frameHeight = RUNNER_HEIGHT;
    this.endFrame = 3;
    this.frameSpeed = RUNNER_SPEED;
    this.framesPerRow = Math.floor(this.image.width / this.frameWidth);
    this.currentFrame = 0;
    this.counter = 0;
    this.jumpCounter = JUMP_TIME;
    // this.gravity   = 1;
    this.dy        = 0;
    this.jumpDy    = -2;
    this.isFalling = false;
    this.isJumping = false;
    this.x = 60;
    this.y = 220;

    const self = this;

    window.addEventListener('keydown', function(e) {
      if (e.keyCode === 32 && !self.isFalling) {
        self.isJumping = true;
      }
    });
  }

  jump() {
    if (this.isJumping) {
      this.dy += this.jumpDy;
      this.jumpCounter--;
    }

    if (this.isFalling) {
      this.dy -= this.jumpDy;
      this.jumpCounter--;
    }

    if (this.jumpCounter === JUMP_TIME / 2) {
      this.isJumping = false;
      this.isFalling = true;
    }

    if (this.jumpCounter === 0) {
      this.isFalling = false;
      this.jumpCounter = JUMP_TIME;
    }
  }

  update() {
    // update to the next frame if it is time
    if (this.counter == (this.frameSpeed - 1)) {
      this.currentFrame = (this.currentFrame + 1) % this.endFrame;
    }

    // update the counter
    this.counter = (this.counter + 1) % this.frameSpeed;
  };

  runningAnim(col, row, frameWidth, frameHeight, x, y) {
    gameArea.context.drawImage(
       this.image,
       col * frameWidth, row * frameHeight,
       frameWidth, frameHeight,
       x, y + this.dy,
       frameWidth, frameHeight);
  };

  jumpingAnim(col, row, frameWidth, frameHeight, x, y) {
    gameArea.context.drawImage(
       this.image,
       frameWidth, 0,
       frameWidth, frameHeight,
       x, y + this.dy,
       frameWidth, frameHeight);
  };

  draw() {
      // get the row and col of the frame
      const row = Math.floor(this.currentFrame / this.framesPerRow);
      const col = Math.floor(this.currentFrame % this.framesPerRow);

      this.jump();

      if (this.isJumping || this.isFalling) {
        this.jumpingAnim(col, row, this.frameWidth, this.frameHeight, this.x, this.y);
      } else {
        this.runningAnim(col, row, this.frameWidth, this.frameHeight, this.x, this.y);
      }

  };
}
