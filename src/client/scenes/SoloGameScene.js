import { Container, filters } from 'pixi.js';
import InputManager from 'client/managers/InputManager';
import Grid from 'client/gui/Grid';
import Bag from 'client/modules/Bag';
import GridState from 'client/modules/GridState';
import CountdownOverlay from 'client/gui/CountdownOverlay';
import PauseOverlay from 'client/gui/PauseOverlay';
import Scene from 'client/modules/Scene';
import Tetromino from 'client/modules/Tetromino';
import { types } from 'client/modules/Tetromino';
import actions from 'client/constants/actions';
import { GRID_COLS, GRID_ROWS } from 'client/constants/dimensions';
import {
  DROP_FRAMES_PER_LEVEL,
  FPS,
  // GHOST_ALPHA,
  // LINES_TO_CLEAR_PER_LEVEL,
  MAX_SPEED_LEVEL,
  STARTING_LEVEL,
  STARTING_SCORE
} from 'client/constants/game';

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
    this.onTick = this.onTick.bind(this);

    this._inputManager = InputManager.getInstance();
    this._gridState = new GridState(GRID_COLS, GRID_ROWS);
    this._gui = null;
    this._blocksContainer = null;
    this.addGUI();
    this.addActionListeners();

    this.reset();
    this.start();
    this.sceneManager.app.ticker.add(this.onTick);
  }

  reset() {
    this._paused = true;
    this._bag = new Bag();
    this._gridState.clear();
    this._blocksContainer.removeChildren();

    this._tetromino = null;
    this._ghost = null;

    if (this._nextTetromino) {
      // this._nextTetrominoContainer.removeChildren();
      // this._nextTetromino.destroy(true);
      this._nextTetromino = null;
    }

    this._linesCleared = 0;
    this._score = STARTING_SCORE;
    this._highScore = 0; // TODO: get it from LocalStorage or set to zero
    this._level = STARTING_LEVEL;
    this.resetDropCounter();
    this.blurGUI();
  }

  start() {
    this.startCountdown(() => {
      this.unblurGUI();
      this.showBlocks();
      this.spawnTetromino();
      this._paused = false;
    });
  }

  pause() {
    this.stopCountdown();
    this._paused = true;
    this.hideBlocks();
    this.blurGUI();
    this.showPauseOverlay();
  }

  resume() {
    this.hidePauseOverlay();
    this.startCountdown(() => {
      this.unblurGUI();
      this.showBlocks();
      this._paused = false;
    });
  }

  retry() {
    this.reset();
    this.start();
  }

  blurGUI() {
    this._gui.filters = [this._guiBlurFilter];
    this._gui.cacheAsBitmap = true;
  }

  unblurGUI() {
    this._gui.filters = null;
    this._gui.cacheAsBitmap = false;
  }

  showBlocks() {
    this._blocksContainer.visible = true;
  }

  hideBlocks() {
    this._blocksContainer.visible = false;
  }

  showPauseOverlay() {
    this._pauseOverlay.show(this);
  }

  hidePauseOverlay() {
    this._pauseOverlay.hide();
  }

  startCountdown(cb) {
    this._counting = true;
    this._countdownOverlay.visible = true;
    this._countdownOverlay.count(() => {
      this._countdownOverlay.visible = false;
      this._counting = false;
      cb();
    });
  }

  stopCountdown() {
    this._counting = false;
    this._countdownOverlay.visible = false;
    this._countdownOverlay.stop();
  }

  // gameOver() {
  //
  // }

  spawnTetromino() {
    if (this._nextTetromino) {
      console.log('use next');
      this._tetromino = this._nextTetromino;
    } else {
      this._tetromino = this.getRandomTetromino();
    }
    this._nextTetromino = this.getRandomTetromino();
    // this._ghost.alpha = GHOST_ALPHA;

    this._blocksContainer.addChild(this._tetromino);
    this._tetromino._gridPosition = this._tetromino.type === types.I.type ? [0, -1] : [0, 0];
    // move to [0, 0]
    this._tetromino.position.set(this._tetromino.pivot.x, this._tetromino.pivot.y);
    // move to initial spawn position
    this.shiftTetromino(this._tetromino.spawnVector);
  }

  getRandomTetromino() {
    return new Tetromino(types[this._bag.pick()]);
  }

  shiftTetromino([x, y]) {
    const [gridX, gridY] = this._tetromino._gridPosition;
    const newPos = [gridX + x, gridY + y];

    if (
      !this._gridState.isCollision({
        x: newPos[0],
        y: newPos[1],
        size: this._tetromino.size,
        other: this._tetromino.state
      })
    ) {
      this._tetromino._gridPosition = newPos;
      this._tetromino.translate([x, y]);
      return true;
    }
    return false;
  }

  rotateTetrominoCW() {
    this._tetromino.rotateCW();
  }

  rotateTetrominoCCW() {
    this._tetromino.rotateCCW();
  }

  dropTetromino() {
    this.resetDropCounter();
    if (!this.shiftTetromino([0, 1])) {
      this.lockTetromino();
    }
  }

  lockTetromino() {
    console.log(this);
  }

  resetDropCounter() {
    this._dropCounter = FPS - Math.min(this._level, MAX_SPEED_LEVEL) * DROP_FRAMES_PER_LEVEL;
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
    if (this._paused) {
      return;
    }
    this.rotateTetrominoCW();
  }

  onRotateCCWActionDown() {
    if (this._paused) {
      return;
    }
    this.rotateTetrominoCCW();
  }

  onShiftLeftActionDown() {
    if (this._paused) {
      return;
    }
    this.shiftTetromino([-1, 0]);
  }

  onShiftRightActionDown() {
    if (this._paused) {
      return;
    }
    this.shiftTetromino([1, 0]);
  }

  onSoftDropActionDown() {
    if (this._paused) {
      return;
    }
    // +1 point for every pixel traveled
    this.dropTetromino();
  }

  onHardDropActionDown() {
    if (this._paused) {
      return;
    }
    console.log(this);
  }

  onPauseActionDown() {
    if (this._counting) {
      this.pause();
    } else if (this._paused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  onRetryActionDown() {
    if (this._paused) {
      return;
    }
    this.retry();
  }

  onTick(delta) {
    if (this._paused) {
      return;
    }
    if (this._dropCounter <= 0) {
      this.dropTetromino();
    }
    this._dropCounter -= delta;
  }

  addGUI() {
    const blur = new filters.BlurFilter();
    blur.blur = 20;
    this._guiBlurFilter = blur;

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

    const pauseOverlay = new PauseOverlay(this);
    this._pauseOverlay = pauseOverlay;

    pauseOverlay.position.set(
      Math.floor(this.width / 2 - pauseOverlay.width / 2),
      Math.floor(this.height / 2 - pauseOverlay.height / 2)
    );
    this.addChild(pauseOverlay);
    pauseOverlay.hide();

    const countdownOverlay = new CountdownOverlay();
    this._countdownOverlay = countdownOverlay;
    this.addChild(countdownOverlay);
    countdownOverlay.position.set(Math.floor(this.width / 2), Math.floor(this.height / 2));
    countdownOverlay.visible = false;
  }
}

export default SoloGameScene;
