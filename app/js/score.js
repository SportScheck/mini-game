const SCORE_FONT = 'Arial';
const SCORE_SIZE = '15px';


class Score {
  constructor() {
     this.font = SCORE_FONT;
     this.size = SCORE_SIZE;
     this.speed = 3;
     this.color = 'black';
     this.distance = 0;
     this.calories = 0;
     this.x = 400;
     this.y = 40;
   }

  update() {
    const ctx = gameArea.context;
    gameArea.frameNo += 1;

    this.distance = parseInt((gameArea.frameNo / 50) * this.speed);
    this.calories = parseInt((gameArea.frameNo / 50) * 0.2);

    score.text = 'DISTANZ: ' + this.distance + 'm ' + 'KALORIEN: ' + this.calories;

    ctx.font = this.size + " " + this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
  }
}
