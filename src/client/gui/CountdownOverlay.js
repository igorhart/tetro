import { Container, extras, sound } from 'pixi.js';
import { Expo, TweenMax } from 'gsap/all';
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

    // PixiPlugin doesn't work on production, that's why...
    const tweenProps = {
      alpha: 0,
      scale: 2
    };

    this._countdownAnimation = TweenMax.to(tweenProps, 0.6, {
      alpha: 1,
      scale: 1,
      ease: Expo.easeOut,
      repeat: 3,
      onUpdate: () => {
        this._text.alpha = tweenProps.alpha;
        this._text.scale.set(tweenProps.scale);
      },
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
