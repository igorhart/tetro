import Scene from 'client/modules/Scene';
import scenes from 'client/constants/scenes';

class ControlsScene extends Scene {
  constructor({ id }) {
    super({ id });

    this.init();

    // this.onTick = this.onTick.bind(this);
    // sceneManager.app.ticker.add(this.onTick);
  }

  init() {
    // TweenMax.to(this.background, 1, { alpha: 1 });
    // this.background.tint = MAIN_MENU_BACKGROUND_COLOR;
    this.addControls();

    // InputManager.instance.onKeyPress(() => {
    // on any key press
    // TODO: remove setTimeout() when ready
    setTimeout(() => {
      this.sceneManager.loadScene(scenes.SOLO_GAME);
      // SceneManager.instance.loadScene('soloGame');
    });
    // });
  }

  addControls() {
    console.log(this);
  }

  // onTick() {
  //   super.onTick();
  // }
}

export default ControlsScene;
