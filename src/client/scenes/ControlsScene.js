import { sound } from 'pixi.js';
import InputManager from 'client/managers/InputManager';
import Scene from 'client/modules/Scene';
import actions from 'client/constants/actions';
import scenes from 'client/constants/scenes';

class ControlsScene extends Scene {
  constructor({ id }) {
    super({ id });

    this.onAnyActionDown = this.onAnyActionDown.bind(this);

    this.init();

    // this.onTick = this.onTick.bind(this);
    // sceneManager.app.ticker.add(this.onTick);
  }

  init() {
    // TweenMax.to(this.background, 1, { alpha: 1 });
    // this.background.tint = MAIN_MENU_BACKGROUND_COLOR;
    // this.addControls();

    sound.play('bgm', { loop: true });

    // TODO: remove when ready
    setTimeout(() => {
      // this.onAnyActionDown();
    });

    this._actionListeners = [
      InputManager.getInstance().onActionDown(actions.ANY, this.onAnyActionDown)
    ];
  }

  onAnyActionDown() {
    this.sceneManager.loadScene(scenes.SOLO_GAME);
  }

  onExit(cb) {
    this._actionListeners.forEach(listener => listener());
    super.onExit(cb);
  }

  // addControls() {
  //   console.log(this);
  // }

  // onTick() {
  //   super.onTick();
  // }
}

export default ControlsScene;
