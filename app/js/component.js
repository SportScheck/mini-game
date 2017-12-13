class Component {
  constructor(width, height, url, x, y) {
    this.url = url;
    this.image = undefined;
    this.framesPerRow = 0;
    this.frameWidth = width;
  }

  init() {
    this.image = new Image();

    // calculate the number of frames in a row after the image loads
    this.image.onload = function() {
      this.framesPerRow = Math.floor(this.image.width / this.frameWidth);
    };

    this.image.src = this.url;
  }
}
