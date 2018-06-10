import SceneManager from 'client/modules/SceneManager';
import LoadingScene from 'client/scenes/LoadingScene';
import MainMenuScene from 'client/scenes/MainMenuScene';
import SoloGameScene from 'client/scenes/SoloGameScene';

export default class Game {
  constructor(app) {
    this._app = app;
    this._sceneManager = new SceneManager({ app: this._app });

    this._sceneManager.addScene({ id: 'loading', constructor: LoadingScene });
    this._sceneManager.addScene({ id: 'mainMenu', constructor: MainMenuScene });
    this._sceneManager.addScene({ id: 'soloGame', constructor: SoloGameScene });
    // this._sceneManager.addScene({ id: 'duelGame', constructor: DuelGameScene });

    this._sceneManager.loadScene('loading');
  }
}
