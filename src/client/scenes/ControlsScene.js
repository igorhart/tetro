import Scene from 'client/modules/Scene';

export default class ControlsScene extends Scene {
  constructor({ id, sceneManager }) {
    super({ id, sceneManager });

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
      this.sceneManager.loadScene('soloGame');
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
