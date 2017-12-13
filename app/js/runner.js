const player = (function (myGameArea) {

  const playerSprite = new Image();
  playerSprite.src = '../assets/normal_walk.png';

  this.width = 30;
  this.height = 30;
  this.x = 10;
  this.y = 10;

  let ctx = myGameArea.context;
  ctx.fillStyle = 'red';
  ctx.fillRect(this.x, this.y, this.width, this.height);
  // player.width = 10;
  // player.height = 18;
  //
  // player.isJumping = false;
  // player.isFalling = false;
  //
  // player.sheet = new SpriteSheet('../assets/normal_walk.png', player.width, player.height);
  // player.walkingAnim  = new Animation(player.sheet, 4, 0, 15);
  // player.jumpingAnim  = new Animation(player.sheet, 4, 15, 15);
  // player.fallingAnim  = new Animation(player.sheet, 4, 11, 11);
  //
  // player.reset = function() {
  //   player.x = 10;
  //   player.y = 10;
  // }

  return ctx;
});
