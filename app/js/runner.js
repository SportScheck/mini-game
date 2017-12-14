const RUNNER_HEIGHT = 72;
const RUNNER_WIDTH = 40;
const RUNNER_SPEED = 8;
const JUMP_TIME = 130;

class Runner {
  constructor(image, level) {
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
    this.jumpTime = JUMP_TIME - level * 10;
    // this.gravity   = 1;
    this.dy        = 0;
    this.jumpDy    = -2;
    this.isFalling = false;
    this.isJumping = false;
    this.isCrashed = false;
    this.x = 60;
    this.y = 220;

    this.increaseLevel = false;

    const self = this;

    window.addEventListener('keydown', function(e) {
      if (e.keyCode === 32 && !self.isFalling) {
        self.isJumping = true;
      }
    });
  }

  nextLevel(level) {
    this.level = level;
    this.increaseLevel = true;
  }

  updateLevel() {
    // console.log('update level', this.dy);
    this.jumpTime = JUMP_TIME - this.level * 10;
    this.jumpCounter = this.jumpTime;
    this.jumpDy = -2 - (this.level * 0.2);
  }

  jump() {
    if (this.isJumping) {
      this.dy += this.jumpDy;
      this.jumpCounter--;
      // console.log(this.jumpCounter, this.dy);
    }

    if (this.isFalling) {
      this.dy -= this.jumpDy;
      this.jumpCounter--;
      // console.log(this.jumpCounter, this.dy);
    }

    if (this.jumpCounter === this.jumpTime / 2) {
      // console.log(this.jumpCounter, this.jumpTime);
      this.isJumping = false;
      this.isFalling = true;
    }

    if (this.jumpCounter === 0) {
      this.isFalling = false;
      this.jumpCounter = this.jumpTime;
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
    gameArea.context.strokeRect(x, y + this.dy, frameWidth, frameHeight);
  };

  jumpingAnim(col, row, frameWidth, frameHeight, x, y) {
    gameArea.context.drawImage(
       this.image,
       frameWidth, 0,
       frameWidth, frameHeight,
       x, y + this.dy,
       frameWidth, frameHeight);
    gameArea.context.strokeRect(x, y + this.dy, frameWidth, frameHeight);
  };

  crashAnim(col, row, frameWidth, frameHeight, x, y) {
    gameArea.context.drawImage(
       this.image,
       frameWidth * 3, 0,
       frameWidth, frameHeight,
       x, y + this.dy,
       frameWidth, frameHeight);
    gameArea.context.strokeRect(x, y + this.dy, frameWidth, frameHeight);
  };

  crash() {
    this.isCrashed = true;
  }

  reset() {
    this.isCrashed = false;
    this.isJumping = false;
    this.isFalling = false;
    this.dy        = 0;
    this.jumpDy    = -2;
    this.currentFrame = 0;
    this.counter = 0;
    this.jumpTime = JUMP_TIME - level * 10;
    this.jumpCounter = this.jumpTime;
  }

  draw() {
      // get the row and col of the frame
      const row = Math.floor(this.currentFrame / this.framesPerRow);
      const col = Math.floor(this.currentFrame % this.framesPerRow);

      this.jump();

      if (this.isCrashed) {
        this.crashAnim(col, row, this.frameWidth, this.frameHeight, this.x, this.y)
      } else if (this.isJumping || this.isFalling) {
        this.jumpingAnim(col, row, this.frameWidth, this.frameHeight, this.x, this.y);
      } else {
        if (this.increaseLevel) {
          this.updateLevel();
          this.increaseLevel = false;
        }
        this.runningAnim(col, row, this.frameWidth, this.frameHeight, this.x, this.y);
      }
  };
}
