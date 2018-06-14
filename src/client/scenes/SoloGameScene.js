import { Container } from 'pixi.js';
import Grid from 'client/gui/Grid';
import Bag from 'client/modules/Bag';
import Scene from 'client/modules/Scene';
import Tetromino from 'client/modules/Tetromino';
import { types } from 'client/modules/Tetromino';

export default class SoloGameScene extends Scene {
  constructor({ id, sceneManager }) {
    super({ id, sceneManager });

    this._bag = new Bag();

    // this.addBackground();
    this.addGUI();
    this.spawn();
  }

  // TODO
  // addBackground() {}

  addGUI() {
    // TODO: blur this._guiContainer when game paused
    // TODO: shake this._guiContainer when lines cleared (single = tiny shake, tetris = solid shake)
    const guiContainer = new Container();
    this._guiContainer = guiContainer;
    this.addChild(guiContainer);

    const grid = new Grid();
    this._grid = grid;
    guiContainer.addChild(grid);

    const blocksContainer = new Container();
    this._blocksContainer = blocksContainer;
    blocksContainer.x = 12;
    blocksContainer.y = 12;
    grid.addChild(blocksContainer);

    this._guiContainer.position.set(
      Math.floor(this.width / 2 - this._guiContainer.width / 2),
      Math.floor(this.height / 2 - this._guiContainer.height / 2)
    );
  }

  spawn() {
    const tetromino = new Tetromino(types[this._bag.pick()]);
    tetromino.position.set(tetromino.pivot.x, tetromino.pivot.y); // move to [0, 0]
    tetromino.translate(tetromino.spawnVector); // move to initial spawn position
    this._blocksContainer.addChild(tetromino);

    // const ghost = tetromino.clone();
    // this._ghost = ghost;
    // ghost.alpha = 0.5;
    // this.addChild(ghost);
  }
}
