let _instance = null;

class SceneManager {
  constructor({ app }) {
    if (!_instance) {
      _instance = this;
    }
    this._app = app;
    this._scenes = {};
    this._currentScene = null;
    return _instance;
  }

  static getInstance() {
    if (!_instance) {
      _instance = new SceneManager();
    }
    return _instance;
  }

  get app() {
    return this._app;
  }

  addScenes(scenes) {
    this._scenes = scenes;
    return this;
  }

  loadScene(sceneId) {
    if (!this._scenes[sceneId]) {
      throw new Error(`Unknown scene: ${sceneId}`);
    }

    // destroy current scene
    if (this._currentScene !== null) {
      const prevScene = this._currentScene;
      prevScene.onExit(() => {
        prevScene.destroy(true);
      });
    }

    // instatiate next scene
    const nextScene = new this._scenes[sceneId]({ id: sceneId });
    this._app.stage.addChild(nextScene);
    this._currentScene = nextScene;

    return this;
  }
}

export default SceneManager;
