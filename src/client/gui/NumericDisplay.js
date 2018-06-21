import { Container, extras, Sprite } from 'pixi.js';
import colors from 'client/constants/colors';

class NumericDisplay extends Container {
  constructor({ label = '', value = 0, valueSize = 48 }) {
    super();

    this._label = label;
    this._value = value;
    this._valueSize = valueSize;

    this.createElements();
  }

  createElements() {
    const background = new Sprite();
    background.width = 150;
    background.height = 100;
    this.addChild(background);

    const label = new extras.BitmapText(this._label, {
      align: 'center',
      font: {
        name: 'SF Alien Encounters',
        size: 24 * window.devicePixelRatio
      }
    });
    label.tint = colors.GRID;
    label.anchor.set(0, 0.5);
    label.position.set(0, Math.floor(20 + label.height / 2));
    this.addChild(label);
    this._labelText = label;

    const value = new extras.BitmapText(this._value.toString(), {
      align: 'center',
      font: {
        name: 'SF Alien Encounters',
        size: this._valueSize * window.devicePixelRatio
      }
    });
    value.tint = colors.CYAN;
    value.anchor.set(0, 0.5);
    value.position.set(0, Math.floor(label.y + label.height + 20 + value.height / 2));
    this.addChild(value);
    this._valueText = value;
  }

  set label(label) {
    this._label = label;
    this._labelText.text = label;
  }

  set value(value) {
    this._value = value;
    this._valueText.text = value.toString();
  }
}

export default NumericDisplay;
