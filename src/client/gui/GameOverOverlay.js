import { Container, extras, Sprite, Texture } from 'pixi.js';
import { TweenMax } from 'gsap';
import colors from 'client/constants/colors';

class GameOverOverlay extends Container {
  constructor(parent) {
    super();

    this.addBackground(parent);
    this.addText();
  }

  addBackground(parent) {
    const background = new Sprite(Texture.WHITE);
    background.alpha = 0.1;
    background.tint = 0x000000;
    background.anchor.set(0.5);
    this.addChild(background);
    this._background = background;
    this.resizeBackground(parent);
  }

  addText() {
    const text = new extras.BitmapText('Game Over', {
      align: 'center',
      font: {
        name: 'SF Alien Encounters',
        size: 36 * window.devicePixelRatio
      }
    });
    text.tint = colors.RED;
    text.anchor.set(0.5);
    text.position.set(Math.floor(this.width / 2), Math.floor(this.height / 2));
    this.addChild(text);

    this._textAnimation = TweenMax.to(text, 0.5, {
      alpha: 0,
      yoyo: true,
      repeat: -1
    });

    const secondText = new extras.BitmapText('Press R to retry', {
      align: 'center',
      font: {
        name: 'SF Alien Encounters',
        size: 18 * window.devicePixelRatio
      }
    });
    secondText.tint = colors.RED;
    secondText.anchor.set(0.5);
    secondText.position.set(Math.floor(this.width / 2), Math.floor(this.height / 2) + 47);
    this.addChild(secondText);
  }

  resizeBackground(parent) {
    this._background.width = parent.width;
    this._background.height = parent.height;
    this._background.position.set(Math.floor(this.width / 2), Math.floor(this.height / 2));
  }

  show(parent) {
    this.resizeBackground(parent);
    this.visible = true;
    this._textAnimation.resume(0);
  }

  hide() {
    this.visible = false;
    this._textAnimation.pause();
  }
}

export default GameOverOverlay;
