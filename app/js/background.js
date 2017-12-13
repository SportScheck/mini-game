class Background {
	constructor(image, speed, x, y) {
		this.x = x;
		this.y = y;
		this.image = image;
		this.speed = speed; // Redefine speed of the background for panning
	}

	draw() {
		// Pan background
		this.x -= this.speed;
		gameArea.context.drawImage(this.image, this.x, this.y);

    gameArea.context.drawImage(this.image, this.x + this.image.width, this.y);
		// If the image scrolled off the screen, reset
		if (Math.abs(this.x) >= this.image.width)
			this.x = 0;
	}
}
