import { Container, extras, sound } from 'pixi.js';
import { TweenMax } from 'gsap/all';
import { Expo } from 'gsap/src/uncompressed/easing/EasePack';
import colors from 'client/constants/colors';
import { SFX_VOLUME } from 'client/constants/game';

class CountdownOverlay extends Container {
  constructor() {
    super();

    this.addText();
    this.pivot.set(this.width / 2, this.height / 2);
  }

  addText() {
    const text = new extras.BitmapText('3', {
      align: 'center',
      font: {
        name: 'SF Alien Encounters',
        size: 64 * window.devicePixelRatio
      }
    });
    text.anchor.set(0.5);
    text.tint = colors.PINK;
    this.addChild(text);
    this._text = text;
  }

  positionText() {
    this._text.position.set(0);
  }

  count(cb) {
    this.stop();
    let count = 3;
    this._text.text = count;
    this.positionText();
    this._text.alpha = 0;
    this._text.scale.set(2);
    sound.play('count', { volume: SFX_VOLUME });
    this._countdownAnimation = TweenMax.to(this._text, 0.6, {
      alpha: 1,
      pixi: {
        scaleX: 1,
        scaleY: 1
      },
      ease: Expo.easeOut,
      repeat: 3,
      onRepeat: () => {
        if (count > 1) {
          count -= 1;
          this._text.text = count;
          this.positionText();
          sound.play('count', { volume: SFX_VOLUME });
        } else {
          cb();
        }
      }
    });
  }

  stop() {
    if (this._countdownAnimation) {
      this._countdownAnimation.kill();
    }
  }
}

export default CountdownOverlay;
