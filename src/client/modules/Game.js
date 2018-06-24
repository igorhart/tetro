import InputManager from 'client/managers/InputManager';
import SceneManager from 'client/managers/SceneManager';
import LoadingScene from 'client/scenes/LoadingScene';
import ControlsScene from 'client/scenes/ControlsScene';
import SoloGameScene from 'client/scenes/SoloGameScene';
import actions from 'client/constants/actions';
import buttons from 'client/constants/buttons';
import keys from 'client/constants/keys';
import scenes from 'client/constants/scenes';

class Game {
  constructor(app) {
    this._app = app;

    this._inputManager = new InputManager().addActions({
      [actions.ROTATE_CW]: [keys.ARROW_UP, keys.X, buttons.D_PAD_UP, buttons.R1],
      [actions.ROTATE_CCW]: [keys.Z, buttons.L1],
      [actions.SHIFT_LEFT]: [keys.ARROW_LEFT, buttons.D_PAD_LEFT],
      [actions.SHIFT_RIGHT]: [keys.ARROW_RIGHT, buttons.D_PAD_RIGHT],
      [actions.SOFT_DROP]: [keys.ARROW_DOWN, buttons.D_PAD_DOWN],
      [actions.HARD_DROP]: [keys.SPACE, buttons.CROSS],
      [actions.PAUSE]: [keys.P, buttons.OPTIONS],
      [actions.RETRY]: [keys.R, buttons.TRIANGLE],
      [actions.MUTE]: [keys.M, buttons.SQUARE]
    });

    this._sceneManager = new SceneManager({ app })
      .addScenes({
        [scenes.LOADING]: LoadingScene,
        [scenes.CONTROLS]: ControlsScene,
        [scenes.SOLO_GAME]: SoloGameScene
      })
      .loadScene(scenes.LOADING);
  }
}

export default Game;
