export default class SceneManager {
  constructor({ app }) {
    this._app = app;
    this._scenes = {};
    this._currentScene = null;
  }

  get app() {
    return this._app;
  }

  addScene(scene) {
    this._scenes[scene.id] = scene;
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
    const nextScene = new this._scenes[sceneId].constructor({ id: sceneId, sceneManager: this });
    this._app.stage.addChild(nextScene);
    this._currentScene = nextScene;
    // ???
    // nextScene.onEnter();
  }
}
