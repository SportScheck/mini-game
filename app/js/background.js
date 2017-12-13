function Background() {
	this.speed = 1; // Redefine speed of the background for panning
	// Implement abstract function

	this.draw = function() {
		// Pan background
		this.x -= this.speed;
		this.context.drawImage(this.image, this.x, this.y);

    this.context.drawImage(this.image, this.x + this.image.width, this.y);
		// If the image scrolled off the screen, reset
		if (Math.abs(this.x) >= this.image.width)
			this.x = 0;
	};
}

Background.prototype = new component(600, 600, './assets/ground.png', 'type', 0, 120);
