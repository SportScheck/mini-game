function Drawable() {
	this.init = function(x, y) {
		// Default variables
		this.x = x;
		this.y = y;
	}

	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	// Define abstract function to be implemented in child objects
	this.draw = function() {
	};
}

function Background() {
	this.speed = 1; // Redefine speed of the background for panning
	// Implement abstract function
  var image = new Image();

  // calculate the number of frames in a row after the image loads
  image.onload = function() {
    // framesPerRow = Math.floor(image.width / frameWidth);
  };

  image.src = './assets/ground.png';

	this.draw = function() {
		// Pan background
		this.x -= this.speed;
		this.context.drawImage(image, this.x, this.y);

    this.context.drawImage(image, this.x - 600, this.y);
    console.log(image.width, this.x, this.canvasWidth);
		// If the image scrolled off the screen, reset
		if (Math.abs(this.x) >= image.width)
			this.x = 0;
	};
}

Background.prototype = new Drawable();
