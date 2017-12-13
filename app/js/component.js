(function() {
  function component(width, height, url, type, x, y) {
      this.width = width;
      this.height = height;
      this.speedX = 0;
      this.speedY = 0;
      this.x = x;
      this.y = y;
      this.image = undefined;

      this.init = function() {
        this.image = new Image();

        // calculate the number of frames in a row after the image loads
        this.image.onload = function() {
          // framesPerRow = Math.floor(image.width / frameWidth);
        };

        this.image.src = url;
      }

      this.update = function() {
          ctx = myGameArea.context;
          ctx.fillStyle = color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
      }

      this.newPos = function() {
          this.x += this.speedX;
          this.y += this.speedY;
      }
  }

  window.component = component;
})();
