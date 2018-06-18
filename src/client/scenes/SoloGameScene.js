import { Container, filters } from 'pixi.js';
import { TweenMax } from 'gsap/all';
import InputManager from 'client/managers/InputManager';
import Grid from 'client/gui/Grid';
import Bag from 'client/modules/Bag';
import Block from 'client/modules/Block';
import GridState from 'client/modules/GridState';
import CountdownOverlay from 'client/gui/CountdownOverlay';
import PauseOverlay from 'client/gui/PauseOverlay';
import Scene from 'client/modules/Scene';
import Tetromino from 'client/modules/Tetromino';
import { types } from 'client/tetrominoData';
import actions from 'client/constants/actions';
import { BLOCK_SIZE, GRID_COLS, GRID_ROWS, GRID_UNIT } from 'client/constants/dimensions';
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

    this.onAnyActionDown = this.onAnyActionDown.bind(this);
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
    this._locking = false;
    this._clearing = false;
    this._gameOver = false;

    this._bag = new Bag();
    this._gridState.clear();
    this._blocksContainer.removeChildren();

    this._tetromino = null;
    this._ghost = null;

    // this._nextTetrominoContainer.removeChildren();
    this._nextTetromino = null;

    this._linesCleared = 0;
    this._score = STARTING_SCORE;
    this._highScore = this.getHighScore(); // TODO: get it from LocalStorage or set to zero
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

  gameOver() {
    this._gameOver = true;
    // TODO: show gameOverOverlay (score info, flashing "Press any key to retry")
    // TODO: play game over sound
    // TODO: if score > highScore -> LocalStorage
  }

  getHighScore() {
    // TODO: retrieve high score from LocalStorage
    return 0;
  }

  spawnTetromino() {
    if (this._nextTetromino) {
      this._tetromino = this.getNewTetrominoOfType(this._nextTetromino.type);
      // TODO: clear nextTetromino
    } else {
      this._tetromino = this.getNewRandomTetromino();
    }
    // TODO: create ghost
    this._nextTetromino = this.getNewRandomTetromino();
    // this._ghost.alpha = GHOST_ALPHA;

    this._blocksContainer.addChild(this._tetromino);
    // TODO: add ghost
    this._tetromino._gridPosition = this._tetromino.type === types.I.type ? [0, -1] : [0, 0];
    // move to [0, 0]
    this._tetromino.position.set(this._tetromino.pivot.x, this._tetromino.pivot.y);
    // TODO: move ghost
    // move to initial spawn position
    if (!this.shiftTetromino(this._tetromino.spawnVector)) {
      this._tetromino.visible = false;
      this.gameOver();
    }
  }

  getNewTetrominoOfType(type) {
    return new Tetromino(types[type]);
  }

  getNewRandomTetromino() {
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

  rotateTetromino(direction) {
    const wallKicks = this._tetromino[`rotate${direction}`]();
    let canRotate = false;
    if (wallKicks.length) {
      for (let i = 0; i < wallKicks.length; i += 1) {
        const [x, y] = wallKicks[i];
        const vector = [x, -y]; // y has to be inverted because SRS has y axis increasing up
        if (this.shiftTetromino(vector)) {
          canRotate = true;
          break;
        }
      }
    } else {
      canRotate = true;
    }

    if (canRotate) {
      // TODO: rotate ghost
      // TODO: translate ghost
    } else {
      // rotation failed, rotate back
      if (direction === 'CW') {
        this._tetromino.rotateCCW();
      } else {
        this._tetromino.rotateCW();
      }
    }
  }

  dropTetromino() {
    this.resetDropCounter();
    if (!this.shiftTetromino([0, 1])) {
      this.lockTetromino(() => {
        this.clearLines(() => {
          this.spawnTetromino();
        });
      });
    }
  }

  lockTetromino(cb) {
    this._locking = true;
    const [gridX, gridY] = this._tetromino._gridPosition;
    const { size, state, type } = this._tetromino;
    this._gridState.mergeRect({ x: gridX, y: gridY, rect: state });

    const blocks = [];
    for (let rowIndex = 0; rowIndex < size; rowIndex += 1) {
      for (let colIndex = 0; colIndex < size; colIndex += 1) {
        const value = state[rowIndex][colIndex];
        if (value === 1) {
          const block = new Block({ type });
          block.x = BLOCK_SIZE / 2 + (gridX + colIndex) * GRID_UNIT;
          block.y = BLOCK_SIZE / 2 + (gridY + rowIndex) * GRID_UNIT;
          block.visible = false;
          block._gridPosition = [colIndex, rowIndex];
          this._blocksContainer.addChild(block);
          blocks.push(block);
        }
      }
    }

    // TODO: improve lock animation
    // TODO: play lock sound
    this._lockAnimation = TweenMax.to(this._tetromino, 0.1, {
      alpha: 0.5,
      yoyo: true,
      onComplete: () => {
        this._blocksContainer.removeChild(this._tetromino);
        this._tetromino = null;
        blocks.forEach(b => {
          b.visible = true;
        });
        this._locking = false;
        cb();
      }
    });
  }

  clearLines(cb) {
    this._clearing = true;
    // TODO: check if there are lines to clear
    // TODO: clear lines in data
    // TODO: clear blocks
    // TODO: play clearing sound
    // TODO: mark individual segments above cleared lines
    // TODO: collect segments' blocks into containers
    // TODO: drop segments in data
    // TODO: drop segments on the screen
    // TODO: repeat! recursive!
    // TODO: finish clearing by calling cb()
    console.log('LINES CLEARED', this);
    this._clearing = false;
    cb();
  }

  resetDropCounter() {
    this._dropCounter = FPS - Math.min(this._level, MAX_SPEED_LEVEL) * DROP_FRAMES_PER_LEVEL;
  }

  addActionListeners() {
    this._inputManager.onActionDown(actions.ANY, this.onAnyActionDown);
    this._inputManager.onActionDown(actions.ROTATE_CW, this.onRotateCWActionDown);
    this._inputManager.onActionDown(actions.ROTATE_CCW, this.onRotateCCWActionDown);
    this._inputManager.onActionDown(actions.SHIFT_LEFT, this.onShiftLeftActionDown);
    this._inputManager.onActionDown(actions.SHIFT_RIGHT, this.onShiftRightActionDown);
    this._inputManager.onActionDown(actions.SOFT_DROP, this.onSoftDropActionDown);
    this._inputManager.onActionDown(actions.HARD_DROP, this.onHardDropActionDown);
    this._inputManager.onActionDown(actions.PAUSE, this.onPauseActionDown);
    this._inputManager.onActionDown(actions.RETRY, this.onRetryActionDown);
  }

  actionsPrevented() {
    return this._paused || this._locking || this._clearing || this._gameOver;
  }

  onAnyActionDown() {
    if (this._gameOver) {
      // TODO: hide gameOverOverlay
      this.retry();
    }
  }

  onRotateCWActionDown() {
    if (this.actionsPrevented()) {
      return;
    }
    this.rotateTetromino('CW');
  }

  onRotateCCWActionDown() {
    if (this.actionsPrevented()) {
      return;
    }
    this.rotateTetromino('CCW');
  }

  onShiftLeftActionDown() {
    if (this.actionsPrevented()) {
      return;
    }
    this.shiftTetromino([-1, 0]);
  }

  onShiftRightActionDown() {
    if (this.actionsPrevented()) {
      return;
    }
    this.shiftTetromino([1, 0]);
  }

  onSoftDropActionDown() {
    if (this.actionsPrevented()) {
      return;
    }
    // +1 point for every pixel traveled
    this.dropTetromino();
  }

  onHardDropActionDown() {
    if (this.actionsPrevented()) {
      return;
    }
    console.log(this);
  }

  onPauseActionDown() {
    if (this._gameOver) {
      return;
    }
    if (this._counting) {
      this.pause();
    } else if (this._paused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  onRetryActionDown() {
    if (this._paused || this._gameOver) {
      return;
    }
    this.retry();
  }

  onTick(delta) {
    if (this.actionsPrevented()) {
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
