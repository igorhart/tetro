import { extras, sound, Sprite, utils } from 'pixi.js';
import { Elastic, TweenMax } from 'gsap/all';
import InputManager from 'client/managers/InputManager';
import Scene from 'client/modules/Scene';
import actions from 'client/constants/actions';
import colors from 'client/constants/colors';
import scenes from 'client/constants/scenes';

class ControlsScene extends Scene {
  constructor({ id }) {
    super({ id });

    this.onAnyActionDown = this.onAnyActionDown.bind(this);

    this.init();
  }

  init() {
    this.addControls();
    sound.play('bgm', { loop: true });

    this._actionListeners = [
      InputManager.getInstance().onActionDown(actions.ANY, this.onAnyActionDown)
    ];
  }

  addControls() {
    const controls = new Sprite(utils.TextureCache.controls);
    controls.anchor.set(0.5);
    controls.position.set(Math.floor(this.width / 2), Math.floor(this.height / 2));
    controls.alpha = 0;
    controls.scale.set(0.5);
    this.addChild(controls);

    TweenMax.to(controls, 1, { alpha: 1, pixi: { scaleX: 1, scaleY: 1 }, ease: Elastic.easeOut });

    const title = new extras.BitmapText('CONTROLS', {
      align: 'center',
      font: {
        name: 'SF Alien Encounters',
        size: 48 * window.devicePixelRatio
      }
    });
    title.tint = colors.CYAN;
    title.anchor.set(0.5);
    title.position.set(
      Math.floor(this.width / 2),
      Math.floor(this.height / 2) - controls.height - 64
    );
    this.addChild(title);

    const text = new extras.BitmapText('Press any key to continue', {
      align: 'center',
      font: {
        name: 'SF Alien Encounters',
        size: 18 * window.devicePixelRatio
      }
    });
    text.tint = colors.PINK;
    text.anchor.set(0.5);
    text.position.set(Math.floor(this.width / 2), Math.floor(this.height / 2) + controls.height);
    this.addChild(text);

    this._textAnimation = TweenMax.to(text, 0.5, {
      alpha: 0,
      yoyo: true,
      repeat: -1
    });
  }

  onAnyActionDown() {
    this.sceneManager.loadScene(scenes.SOLO_GAME);
  }

  onExit(cb) {
    this._textAnimation.kill();
    this.removeChildren();
    this._actionListeners.forEach(listener => listener());
    super.onExit(cb);
  }
}

export default ControlsScene;
