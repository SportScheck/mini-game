const OBSTACLE_HEIGHT = 60;
const OBSTACLE_WIDTH = 52;
const OBSTACLE_SPEED = 8;

class Obstacle {
	constructor(gameArea, image, speed) {
		this.gameArea = gameArea;
    this.image = image;
    this.frameWidth = OBSTACLE_WIDTH;
    this.frameHeight = OBSTACLE_HEIGHT;
    this.endFrame = 4;
    this.frameSpeed = OBSTACLE_SPEED;
    this.framesPerRow = Math.floor(this.image.width / this.frameWidth);
    this.currentFrame = 0;
    this.counter = 0;
		this.x = 600;
		this.y = 230;
		this.speed = speed;
	}

	updateSpeed(newSpeed) {
		this.speed = newSpeed;
	}

  update() {
    // update to the next frame if it is time
    if (this.counter == (this.frameSpeed - 1)) {
      this.currentFrame = (this.currentFrame + 1) % this.endFrame;
    }

    // update the counter
    this.counter = (this.counter + 1) % this.frameSpeed;
  };


	draw() {
    if (this.x < -this.image.width) return;
		// Pan background
		this.x -= this.speed;

    const row = Math.floor(this.currentFrame / this.framesPerRow);
    const col = Math.floor(this.currentFrame % this.framesPerRow);

    this.gameArea.context.drawImage(
       this.image,
       col * this.frameWidth, row * this.frameHeight,
       this.frameWidth, this.frameHeight,
       this.x, this.y,
       this.frameWidth, this.frameHeight);
	}
}

module.exports = Obstacle;
