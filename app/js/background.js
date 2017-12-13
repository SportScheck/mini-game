class Background {
	constructor(image, speed) {
		//super(600, 600, url, 0, 120);
		this.x = 0;
		this.y = 120;
		this.image = image;
		this.speed = speed; // Redefine speed of the background for panning
	}

	draw() {
		// Pan background
		this.x -= this.speed;
		this.context.drawImage(this.image, this.x, this.y);

    this.context.drawImage(this.image, this.x + this.image.width, this.y);
		// If the image scrolled off the screen, reset
		if (Math.abs(this.x) >= this.image.width)
			this.x = 0;
	}
}
