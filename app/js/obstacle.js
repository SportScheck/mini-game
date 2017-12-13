class Obstacle {
	constructor(image, speed) {
    console.log(image);
		this.x = 610;
		this.y = 200;
		this.image = image;
		this.speed = speed; // Redefine speed of the background for panning
	}

	draw() {
    if (this.x < -this.image.width) return;
		// Pan background
		this.x -= this.speed;
		gameArea.context.drawImage(this.image, this.x, this.y);
	}
}
