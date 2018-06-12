import SceneManager from 'client/managers/SceneManager';
import LoadingScene from 'client/scenes/LoadingScene';
import ControlsScene from 'client/scenes/ControlsScene';
import SoloGameScene from 'client/scenes/SoloGameScene';

export default class Game {
  constructor(app) {
    this._app = app;

    // TODO: this._audioManager = new AudioManager(); (make it a singleton)
    // TODO: this._inputManager = new InputManager(); (make it a singleton)

    // TODO: make SceneManager a singleton
    this._sceneManager = new SceneManager({ app: this._app })
      .addScene({ id: 'loading', constructor: LoadingScene })
      .addScene({ id: 'controls', constructor: ControlsScene })
      .addScene({ id: 'soloGame', constructor: SoloGameScene })
      // .addScene({ id: 'duelGame', constructor: DuelGameScene }) // someday... :)
      .loadScene('loading');
  }
}
