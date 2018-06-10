import { Container, Sprite, Texture } from 'pixi.js';

export default class Scene extends Container {
  constructor({ id, sceneManager }) {
    super();

    this._id = id;
    this._sceneManager = sceneManager;
    this._background = this.addBackground();

    this.onTick = this.onTick.bind(this);
  }

  get sceneManager() {
    return this._sceneManager;
  }

  get app() {
    return this._sceneManager.app;
  }

  get background() {
    return this._background;
  }

  addBackground() {
    const { screen } = this.app;
    const background = new Sprite(Texture.WHITE);
    background.alpha = 0;
    background.width = screen.width;
    background.height = screen.height;
    background.tint = 0x000000;
    this.addChild(background);
    return background;
  }

  onTick() {
    const { screen } = this.app;
    this._background.width = screen.width;
    this._background.height = screen.height;
  }

  onExit(cb) {
    cb(this._id);
  }
}
