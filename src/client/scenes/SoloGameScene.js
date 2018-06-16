import { Container } from 'pixi.js';
import Grid from 'client/gui/Grid';
import Bag from 'client/modules/Bag';
import Scene from 'client/modules/Scene';
import Tetromino from 'client/modules/Tetromino';
import { types } from 'client/modules/Tetromino';

class SoloGameScene extends Scene {
  constructor({ id }) {
    super({ id });

    this._gui = null;
    this._blocksContainer = null;
    this.addGUI();
    this.reset();

    this.start();
  }

  start() {
    // TODO: count down 3, 2, 1...
    this.spawnTetromino();
    // TODO:
  }

  pause() {
    this.paused = true;
    // TODO: blur this._gui
    // TODO: show pause overlay
  }

  resume() {
    // TODO: hide pause overlay
    // TODO: count down 3, 2, 1...
    // TODO: unblur this._gui
    this.paused = false;
  }

  retry() {
    this.reset();
    this.start();
  }

  reset() {
    this._bag = new Bag();

    // TODO: destroy() all of them
    this._tetromino = null;
    this._tetrominoGhost = null;
    this._nextTetromino = null;

    this._score = 0;
    this.highScore = 0; // TODO: get it from LocalStorage or set to zero
    this._level = 0;
    this._paused = false;
  }

  // gameOver() {
  //
  // }

  spawnTetromino() {
    if (this.nextTetromino) {
      this._tetromino = this.nextTetromino;
    } else {
      this._tetromino = this.getRandomTetromino();
    }
    this._tetrominoGhost = this._tetromino.clone();
    this._nextTetromino = this.getRandomTetromino();

    this._blocksContainer.addChild(this._tetromino);
    this._blocksContainer.addChild(this._nextTetromino);
    this._nextContainer.addChild(this._nextTetromino);

    this.moveTetromino(this._tetromino.spawnVector); // move to initial spawn position
  }

  getRandomTetromino() {
    const tetromino = new Tetromino(types[this._bag.pick()]);
    tetromino.position.set(tetromino.pivot.x, tetromino.pivot.y); // move to [0, 0]
    return tetromino;
  }

  addGUI() {
    // TODO: blur this._guiContainer when game paused
    // TODO: shake this._guiContainer when lines cleared (single = tiny shake, tetris = solid shake)
    const gui = new Container();
    this._gui = gui;
    this.addChild(gui);

    const grid = new Grid();
    this._grid = grid;
    gui.addChild(grid);

    this._blocksContainer = grid.getBlocksContainer();

    // TODO: add left sidebar
    // TODO: add right sidebar
    // TODO: center gui on window resize event

    // center gui on the screen
    this._gui.position.set(
      Math.floor(this.width / 2 - this._gui.width / 2),
      Math.floor(this.height / 2 - this._gui.height / 2)
    );
  }
}

export default SoloGameScene;
