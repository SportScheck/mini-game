class Background {
	constructor(gameArea, image, speed, x, y) {
		this.gameArea = gameArea;
		this.x = x;
		this.y = y;
		this.image = image;
		this.speed = speed;
	}

	draw() {
		// Pan background
		this.x -= this.speed;
		this.gameArea.context.drawImage(this.image, this.x, this.y);

    this.gameArea.context.drawImage(this.image, this.x + this.image.width, this.y);
		// If the image scrolled off the screen, reset
		if (Math.abs(this.x) >= this.image.width)
			this.x = 0;
	}
}

module.exports = Background;
