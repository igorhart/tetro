import { Container, Graphics, Text } from 'pixi.js';

export default class Button extends Container {
  constructor({ backgroundColor, text, textColor, width, height } = {}) {
    super();

    this._backgroundColor = backgroundColor;
    this._text = text;
    this._textColor = textColor;
    this._width = width;
    this._height = height;

    this.init();
  }

  init() {
    this.createElements();
  }

  createElements() {
    this.interactive = true; // TODO: should be based on this._enabled property
    this.pivot.set();

    const background = new Graphics();
    background.beginFill(this._backgroundColor, 1);
    background.drawRect(0, 0, this._width, this._height);
    background.endFill();
    this.addChild(background);

    const textStyle = {
      fill: this._textColor,
      fontFamily: 'Helvetica',
      fontSize: 40,
      fontWeight: 'bold'
    };

    const textElement = new Text(this._text, textStyle);
    textElement.fontSize = 14;
    this._textElement = textElement;
    this.addChild(textElement);
  }

  update() {
    this._progressBar.clear();

    this._progressBar.beginFill(0xffffff, 1);
    this._progressBar.drawRect(
      0,
      60 - (60 / 100) * this._progress,
      90,
      (60 / 100) * this._progress
    );
    this._progressBar.endFill();
  }
}
