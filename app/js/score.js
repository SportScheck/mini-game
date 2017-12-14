const SCORE_FONT = 'GameFont';
const SCORE_SIZE = 15;
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

    const text = 'Game Over';

    ctx.font = this.headlineSize + 'px' + ' ' + this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign = 'center';

    const positionYText = this.y + this.size + SPACE;
    ctx.fillText(text, this.x, positionYText);

    ctx.font = this.size + 'px' + ' ' + this.font;
    const text2 = 'Du hast ' + this.calories + ' kcal verbrannt!'
    const positionYText2 = positionYText + this.headlineSize + SPACE;
    ctx.fillText(text2, this.x, positionYText2);

    const text3 = 'Starten & Springen';
    const positionYText3 = positionYText2 + this.size * 2;
    ctx.fillText(text3, this.x, positionYText3);

    const text4 = 'mit Leertaste'
    const positionYText4 = positionYText3 + this.size * 2;
    ctx.fillText(text4, this.x, positionYText4);
  }
}
