import { Container, extras, Sprite } from 'pixi.js';
import Tetromino from 'client/modules/Tetromino';
import { types } from 'client/tetrominoData';
import colors from 'client/constants/colors';

class TetrominoDisplay extends Container {
  constructor({ label = '', type }) {
    super();

    this._label = label;
    this._type = type;

    this.createElements();
  }

  createElements() {
    const background = new Sprite();
    background.width = 150;
    background.height = 120;
    this.addChild(background);

    const label = new extras.BitmapText(this._label, {
      align: 'center',
      font: {
        name: 'SF Alien Encounters',
        size: 24 * window.devicePixelRatio
      }
    });
    label.tint = colors.PURPLE;
    label.anchor.set(0, 0.5);
    label.position.set(0, Math.floor(20 + label.height / 2));
    this.addChild(label);
    this._labelText = label;

    if (this._type) {
      this.createTetromino();
    }
  }

  createTetromino() {
    if (this._tetromino) {
      this.removeChild(this._tetromino);
    }
    if (!this._type) {
      return;
    }
    const tetromino = new Tetromino(types[this._type]);
    tetromino.position.set(tetromino.pivot.x, tetromino.pivot.y);
    // tetromino.x = Math.floor(tetromino.width / 2);
    tetromino.y += this._labelText.y + this._labelText.height + 20;
    this.addChild(tetromino);
    this._tetromino = tetromino;
  }

  set label(label) {
    this._label = label;
    this._labelText.text = label;
  }

  set type(type) {
    this._type = type;
    this.createTetromino();
  }
}

export default TetrominoDisplay;
