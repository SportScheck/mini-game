const SCORE_FONT = '"Press Start 2P"';
const SCORE_SIZE = 0.003;
const HEADLINE_SIZE = 0.006;
const SPACE = 40;
const MAX_TEXT = 1.4;
const MAX_HEADLINE = 2.5;

class Score {
  constructor(gameArea) {
     this.gameArea = gameArea;
     this.font = SCORE_FONT;
     this.size = SCORE_SIZE * this.gameArea.x;
     this.headlineSize = HEADLINE_SIZE * this.gameArea.x;
     this.speed = 3;
     this.color = 'black';
     this.distance = 0;
     this.calories = 0;
     this.x = this.gameArea.x / 2;
     this.y = 40;
   }

   _checkFontSize() {
    if (this.size > MAX_TEXT) {
      this.size = MAX_TEXT;
    };
    if(this.headlineSize > MAX_HEADLINE) {
      this.headlineSize = MAX_HEADLINE;
    };
  }

  onResize(newCanvasWidth) {
    this.x = newCanvasWidth / 2;
    this.size = SCORE_SIZE * (this.x * 2);
    this.headlineSize = HEADLINE_SIZE * (this.x * 2);
  }

  update() {
    const ctx = this.gameArea.context;

    this.distance = parseInt((this.gameArea.frameNo / 50) * this.speed);

    const text = 'GELAUFENE STRECKE: ' + this.distance + 'M';

    this._checkFontSize();

    ctx.font = this.size + 'em' + ' ' + this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign="center";
    ctx.fillText(text, this.x, this.y);
  }

  done() {
    const ctx = this.gameArea.context;

    this.calories = parseInt((this.gameArea.frameNo / 50) * 0.2);

    // text blocks
    const text = 'G A M E  O V E R';
    const text2 = 'DU HAST ' + this.calories + ' KCAL VERBRANNT!';
    const text3 = 'STARTEN & SPRINGEN MIT';
    const text4 = 'LEERTASTE ODER KLICK'

    // text positions
    const positionYText = SPACE * 2.5;
    const positionYText2 = SPACE * 3.5;
    const positionYText3 = SPACE * 4.5;
    const positionYText4 = SPACE * 5;

    // general text style
    ctx.fillStyle = this.color;
    ctx.textAlign = 'center';

    this._checkFontSize()

    // define size and set headline on canvas
    ctx.font = this.headlineSize + 'em' + ' ' + this.font;
    ctx.fillText(text, this.x, positionYText);

    if(this.size > MAX_TEXT) {
      this.size = MAX_TEXT;
    };

    // define size and set text on canvas
    ctx.font = this.size + 'em' + ' ' + this.font;
    ctx.fillText(text2, this.x, positionYText2);
    ctx.fillText(text3, this.x, positionYText3);
    ctx.fillText(text4, this.x, positionYText4);
  }
}

module.exports = Score;
