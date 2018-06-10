// import { TweenMax } from 'gsap';
// import 'gsap/PixiPlugin';
import Scene from 'client/modules/Scene';
import Button from 'client/modules/Button';

export default class MainMenuScene extends Scene {
  constructor({ id, sceneManager }) {
    super({ id, sceneManager });

    this.init();

    // this.onTick = this.onTick.bind(this);
    // sceneManager.app.ticker.add(this.onTick);
  }

  init() {
    // TweenMax.to(this.background, 1, { alpha: 1 });
    // this.background.tint = MAIN_MENU_BACKGROUND_COLOR;

    this.createButtons();
  }

  createButtons() {
    const buttonOptions = {
      backgroundColor: 0xffffff,
      width: 400,
      height: 100
      // textColor: MAIN_MENU_BACKGROUND_COLOR
    };

    this._soloButton = new Button({
      ...buttonOptions,
      text: 'Solo'
    });

    this._duelButton = new Button({
      ...buttonOptions,
      text: 'Duel'
    });

    this._settingsButton = new Button({
      ...buttonOptions,
      text: 'Settings'
    });

    this.addChild(this._soloButton);
    this.addChild(this._duelButton);
    this.addChild(this._settingsButton);
  }

  // onTick() {
  //   super.onTick();
  // }
}
