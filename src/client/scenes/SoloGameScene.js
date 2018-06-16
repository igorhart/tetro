import { Container } from 'pixi.js';
import InputManager from 'client/managers/InputManager';
import Grid from 'client/gui/Grid';
import Bag from 'client/modules/Bag';
import Scene from 'client/modules/Scene';
import Tetromino from 'client/modules/Tetromino';
import { types } from 'client/modules/Tetromino';
import actions from 'client/constants/actions';

class SoloGameScene extends Scene {
  constructor({ id }) {
    super({ id });

    this.onRotateCWActionDown = this.onRotateCWActionDown.bind(this);
    this.onRotateCCWActionDown = this.onRotateCCWActionDown.bind(this);
    this.onShiftLeftActionDown = this.onShiftLeftActionDown.bind(this);
    this.onShiftRightActionDown = this.onShiftRightActionDown.bind(this);
    this.onSoftDropActionDown = this.onSoftDropActionDown.bind(this);
    this.onHardDropActionDown = this.onHardDropActionDown.bind(this);
    this.onPauseActionDown = this.onPauseActionDown.bind(this);
    this.onRetryActionDown = this.onRetryActionDown.bind(this);

    this._inputManager = InputManager.getInstance();
    this._gui = null;
    this._blocksContainer = null;
    this.addGUI();
    this.addActionListeners();

    this.reset();
    this.start();
  }

  reset() {
    this._bag = new Bag();

    // TODO: destroy() all of them
    this._tetromino = null;
    this._ghost = null;
    this._nextTetromino = null;

    this._score = 0;
    this._highScore = 0; // TODO: get it from LocalStorage or set to zero
    this._level = 0;
    this._paused = false;
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

  // gameOver() {
  //
  // }

  spawnTetromino() {
    if (this.nextTetromino) {
      this._tetromino = this.nextTetromino;
    } else {
      this._tetromino = this.getRandomTetromino();
    }
    this._nextTetromino = this.getRandomTetromino();

    this._blocksContainer.addChild(this._tetromino);
    this._tetrominoDataPosition = this._tetromino.type === types.I.type ? [0, -1] : [0, 0];
    // move to [0, 0]
    this._tetromino.position.set(this._tetromino.pivot.x, this._tetromino.pivot.y);
    // move to initial spawn position
    this.shiftTetromino(this._tetromino.spawnVector);
  }

  getRandomTetromino() {
    return new Tetromino(types[this._bag.pick()]);
  }

  shiftTetromino([x, y]) {
    const [dataX, dataY] = this._tetrominoDataPosition;
    this._tetrominoDataPosition = [dataX + x, dataY + y];
    this._tetromino.translate([x, y]);
  }

  rotateTetrominoCW() {
    this._tetromino.rotateCW();
  }

  rotateTetrominoCCW() {
    this._tetromino.rotateCCW();
  }

  dropTetromino() {
    this.shiftTetromino([0, 1]);
  }

  addActionListeners() {
    this._inputManager.onActionDown(actions.ROTATE_CW, this.onRotateCWActionDown);
    this._inputManager.onActionDown(actions.ROTATE_CCW, this.onRotateCCWActionDown);
    this._inputManager.onActionDown(actions.SHIFT_LEFT, this.onShiftLeftActionDown);
    this._inputManager.onActionDown(actions.SHIFT_RIGHT, this.onShiftRightActionDown);
    this._inputManager.onActionDown(actions.SOFT_DROP, this.onSoftDropActionDown);
    this._inputManager.onActionDown(actions.HARD_DROP, this.onHardDropActionDown);
    this._inputManager.onActionDown(actions.PAUSE, this.onPauseActionDown);
    this._inputManager.onActionDown(actions.RETRY, this.onRetryActionDown);
  }

  onRotateCWActionDown() {
    this.rotateTetrominoCW();
  }

  onRotateCCWActionDown() {
    this.rotateTetrominoCCW();
  }

  onShiftLeftActionDown() {
    this.shiftTetromino([-1, 0]);
  }

  onShiftRightActionDown() {
    this.shiftTetromino([1, 0]);
  }

  onSoftDropActionDown() {
    this.dropTetromino();
  }

  onHardDropActionDown() {
    console.log(this);
  }

  onPauseActionDown() {
    console.log(this);
  }

  onRetryActionDown() {
    console.log(this);
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
