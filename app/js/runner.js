const RUNNER_HEIGHT = 72;
const RUNNER_WIDTH = 40;
const RUNNER_SPEED = 8;
const JUMP_TIME = 130;

class Runner {
  constructor(gameArea, image, level) {
    this.gameArea = gameArea;
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
    this.jumpTime = JUMP_TIME;
    this.dy = 0;
    this.isFalling = false;
    this.isJumping = false;
    this.isCrashed = false;
    this.x = 60;
    this.y = 220;

    this.increaseLevel = false;

    const self = this;

    const canvasElement = document.querySelector('#minigame');

    window.addEventListener('keydown', function(e) {
      if (e.keyCode === 32 && !self.isFalling) {
        self.isJumping = true;
      }
    });
    canvasElement.addEventListener('mousedown', function(e) {
      if(!self.isFalling) {
        self.isJumping = true;
      }
    });
    canvasElement.addEventListener('touchstart', function(e) {
      if(!self.isFalling) {
        self.isJumping = true;
      }
    });
  }

  _updateLevel() {
    this.jumpTime = JUMP_TIME - this.level * 10;
    this.jumpCounter = this.jumpTime;
  }

  _calculateHeightChange(time) {
    let oldHeight = - 450 * Math.pow((time/this.jumpTime - 0.5), 2);
    let newHeight = - 450 * Math.pow(((time + 1)/this.jumpTime - 0.5), 2);
    return newHeight - oldHeight;
  }

  _jump() {
    if (this.isJumping) {
      this.dy -= this._calculateHeightChange(this.jumpTime - this.jumpCounter);
      this.jumpCounter--;
    }

    if (this.isFalling) {
      this.dy -= this._calculateHeightChange(this.jumpTime - this.jumpCounter);
      this.jumpCounter--;
    }

    if (this.jumpCounter === this.jumpTime / 2) {
      this.isJumping = false;
      this.isFalling = true;
    }

    if (this.jumpCounter === 0) {
      this.isFalling = false;
      this.jumpCounter = this.jumpTime;
    }
  }

  _runningAnim(col, row, frameWidth, frameHeight, x, y) {
    this.gameArea.context.drawImage(
       this.image,
       col * frameWidth, row * frameHeight,
       frameWidth, frameHeight,
       x, y + this.dy,
       frameWidth, frameHeight);
  }

  _jumpingAnim(col, row, frameWidth, frameHeight, x, y) {
    this.gameArea.context.drawImage(
       this.image,
       frameWidth, 0,
       frameWidth, frameHeight,
       x, y + this.dy,
       frameWidth, frameHeight);
  }

  _crashAnim(col, row, frameWidth, frameHeight, x, y) {
    this.gameArea.context.drawImage(
       this.image,
       frameWidth * 3, 0,
       frameWidth, frameHeight,
       x, y + this.dy,
       frameWidth, frameHeight);
  }

  nextLevel(level) {
    this.level = level;
    this.increaseLevel = true;
  }

  crash() {
    this.isCrashed = true;
  }

  update() {
    // update to the next frame if it is time
    if (this.counter == (this.frameSpeed - 1)) {
      this.currentFrame = (this.currentFrame + 1) % this.endFrame;
    }

    // update the counter
    this.counter = (this.counter + 1) % this.frameSpeed;
  }

  reset() {
    this.isCrashed = false;
    this.isJumping = false;
    this.isFalling = false;
    this.level = 0;
    this.dy = 0;
    this.currentFrame = 0;
    this.counter = 0;
    this.jumpTime = JUMP_TIME - this.level * 15;
    this.jumpCounter = this.jumpTime;
  }

  draw() {
      // get the row and col of the frame
      const row = Math.floor(this.currentFrame / this.framesPerRow);
      const col = Math.floor(this.currentFrame % this.framesPerRow);

      this._jump();

      if (this.isCrashed) {
        this._crashAnim(col, row, this.frameWidth, this.frameHeight, this.x, this.y)
      } else if (this.isJumping || this.isFalling) {
        this._jumpingAnim(col, row, this.frameWidth, this.frameHeight, this.x, this.y);
      } else {
        if (this.increaseLevel) {
          this._updateLevel();
          this.increaseLevel = false;
        }
        this._runningAnim(col, row, this.frameWidth, this.frameHeight, this.x, this.y);
      }
  }
}

module.exports = Runner;
