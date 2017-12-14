const SCORE_FONT = 'GameFont';
const SCORE_SIZE = 20;
const HEADLINE_SIZE = 50;
const SPACE = 40;

class Score {
  constructor() {
     this.font = SCORE_FONT;
     this.size = SCORE_SIZE;
     this.headlineSize = HEADLINE_SIZE;
     this.speed = 3;
     this.color = 'black';
     this.distance = 0;
     this.calories = 0;
     this.x = 300;
     this.y = 40;
   }

  update() {
    const ctx = gameArea.context;

    this.distance = parseInt((gameArea.frameNo / 50) * this.speed);

    const text = 'Gelaufene Strecke: ' + this.distance + 'm ';

    ctx.font = this.size + 'px' + ' ' + this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign="center";
    ctx.fillText(text, this.x, this.y);
  }

  done() {
    const ctx = gameArea.context;

    this.calories = parseInt((gameArea.frameNo / 50) * 0.2);

    // text blocks
    const text = 'Game Over';
    const text2 = 'Du hast ' + this.calories + ' kcal verbrannt!';
    const text3 = 'Starten & Springen';
    const text4 = 'mit Leertaste'

    // text positions
    const positionYText = SPACE * 3;
    const positionYText2 = SPACE * 4;
    const positionYText3 = SPACE * 5;
    const positionYText4 = SPACE * 5.5;

    // general text style
    ctx.fillStyle = this.color;
    ctx.textAlign = 'center';

    // define size and set headline on canvas
    ctx.font = this.headlineSize + 'px' + ' ' + this.font;
    ctx.fillText(text, this.x, positionYText);

    // define size and set text on canvas
    ctx.font = this.size + 'px' + ' ' + this.font;
    ctx.fillText(text2, this.x, positionYText2);
    ctx.fillText(text3, this.x, positionYText3);
    ctx.fillText(text4, this.x, positionYText4);
  }
}
