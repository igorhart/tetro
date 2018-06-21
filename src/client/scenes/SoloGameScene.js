import { Container, filters, sound } from 'pixi.js';
import { TimelineMax, TweenMax } from 'gsap';
import InputManager from 'client/managers/InputManager';
import Grid from 'client/gui/Grid';
import Bag from 'client/modules/Bag';
import Block from 'client/modules/Block';
import GridState from 'client/modules/GridState';
import CountdownOverlay from 'client/gui/CountdownOverlay';
import GameOverOverlay from 'client/gui/GameOverOverlay';
import PauseOverlay from 'client/gui/PauseOverlay';
import NumericDisplay from 'client/gui/NumericDisplay';
import TetrominoDisplay from 'client/gui/TetrominoDisplay';
import Scene from 'client/modules/Scene';
import Tetromino from 'client/modules/Tetromino';
import { types } from 'client/tetrominoData';
import actions from 'client/constants/actions';
import { BLOCK_SIZE, GRID_COLS, GRID_ROWS, GRID_UNIT } from 'client/constants/dimensions';
import {
  DROP_FRAMES_PER_LEVEL,
  DROP_REPEAT_FRAMES,
  DROP_REPEAT_FIRST_TIME_EXTRA_FRAMES,
  SHIFT_REPEAT_FRAMES,
  SHIFT_REPEAT_FIRST_TIME_EXTRA_FRAMES,
  FPS,
  GHOST_ALPHA,
  LINES_TO_CLEAR_PER_LEVEL,
  MAX_SPEED_LEVEL,
  STARTING_LEVEL,
  STARTING_SCORE,
  SFX_VOLUME,
  SOFT_DROP_POINTS,
  HARD_DROP_POINTS,
  SINGLE_CLEAR_POINTS,
  DOUBLE_CLEAR_POINTS,
  TRIPLE_CLEAR_POINTS,
  TETRIS_CLEAR_POINTS
} from 'client/constants/game';
import { numericSort } from 'client/utils';

class SoloGameScene extends Scene {
  constructor({ id }) {
    super({ id });

    this.onRotateCWActionDown = this.onRotateCWActionDown.bind(this);
    this.onRotateCCWActionDown = this.onRotateCCWActionDown.bind(this);
    this.onShiftLeftActionDown = this.onShiftLeftActionDown.bind(this);
    this.onShiftLeftActionUp = this.onShiftLeftActionUp.bind(this);
    this.onShiftRightActionDown = this.onShiftRightActionDown.bind(this);
    this.onShiftRightActionUp = this.onShiftRightActionUp.bind(this);
    this.onSoftDropActionDown = this.onSoftDropActionDown.bind(this);
    this.onHardDropActionDown = this.onHardDropActionDown.bind(this);
    this.onPauseActionDown = this.onPauseActionDown.bind(this);
    this.onRetryActionDown = this.onRetryActionDown.bind(this);
    this.onMuteActionDown = this.onMuteActionDown.bind(this);
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
    this._nextTetromino = null;

    this._linesCleared = 0;
    this._level = STARTING_LEVEL;
    this._score = STARTING_SCORE;
    this._highScore = this.getHighScore();

    this._levelDisplay.value = this._level;
    this._scoreDisplay.value = this._score;
    this._highScoreDisplay.value = this._highScore;
    this._nextDisplay.type = null;

    this.resetDropCounter();
    this.resetDropRepeatCounter();
    this.resetShiftRepeatCounter();
    this._shiftRepeatActionsByPriority = [actions.SHIFT_LEFT, actions.SHIFT_RIGHT];
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
    sound.play('pause', { volume: SFX_VOLUME });
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
    this.hideGameOverOverlay();
    this.hidePauseOverlay();
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

  showGameOverOverlay() {
    this._gameOverOverlay.show(this);
  }

  hideGameOverOverlay() {
    this._gameOverOverlay.hide();
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
    this.hideBlocks();
    this.blurGUI();
    sound.play('game_over', { volume: SFX_VOLUME });
    this.showGameOverOverlay();
    if (this._score > this.getHighScore()) {
      this.setHighScore(this._score);
    }
  }

  loadGameStats() {
    let gameStats = localStorage.getItem('tetro');
    if (gameStats) {
      gameStats = JSON.parse(gameStats);
    } else {
      gameStats = { highScore: 0 };
      localStorage.setItem('tetro', JSON.stringify(gameStats));
    }
    return gameStats;
  }

  saveGameStats(stats) {
    localStorage.setItem('tetro', JSON.stringify(stats));
  }

  getHighScore() {
    const gameStats = this.loadGameStats();
    return gameStats.highScore;
  }

  setHighScore(newHighScore) {
    const gameStats = this.loadGameStats();
    gameStats.highScore = newHighScore;
    this.saveGameStats(gameStats);
  }

  spawnTetromino() {
    if (this._nextTetromino) {
      this._tetromino = this.getNewTetrominoOfType(this._nextTetromino.type);
      this._nextTetromino = null;
    } else {
      this._tetromino = this.getNewRandomTetromino();
    }
    this._nextTetromino = this.getNewRandomTetromino();
    this._nextDisplay.type = this._nextTetromino.type;

    this._ghost = this.getNewTetrominoOfType(this._tetromino.type);
    this._ghost.alpha = GHOST_ALPHA;

    this._blocksContainer.addChild(this._tetromino);
    this._blocksContainer.addChild(this._ghost);

    const initialGridPosition = this._tetromino.type === types.I.type ? [0, -1] : [0, 0];
    this._tetromino._gridPosition = initialGridPosition;
    this._ghost._gridPosition = initialGridPosition;
    // move to [0, 0]
    this._tetromino.position.set(this._tetromino.pivot.x, this._tetromino.pivot.y);
    this._ghost.position.set(this._ghost.pivot.x, this._ghost.pivot.y);

    // move to initial spawn position
    if (!this.shiftTetromino(this._tetromino.spawnVector)) {
      this._tetromino.visible = false;
      this._ghost.visible = false;
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
    const ghostY = this._ghost._gridPosition[1];

    // check if shift is possible
    if (
      !this._gridState.isCollision({
        x: newPos[0],
        y: newPos[1],
        size: this._tetromino.size,
        other: this._tetromino.state
      })
    ) {
      this._tetromino._gridPosition = newPos;
      this._ghost._gridPosition = newPos;
      this._tetromino.translate([x, y]);
      this._ghost.translate([x, -(ghostY - newPos[1])]);

      const ghostX = this._ghost._gridPosition[0];
      let newGhostY = this._ghost._gridPosition[1] + 1;
      while (
        !this._gridState.isCollision({
          x: ghostX,
          y: newGhostY,
          size: this._ghost.size,
          other: this._ghost.state
        })
      ) {
        this._ghost._gridPosition = [ghostX, newGhostY];
        this._ghost.translate([0, 1]);
        newGhostY += 1;
      }
      return true;
    }
    return false;
  }

  rotateTetromino(direction) {
    const wallKicks = this._tetromino[`rotate${direction}`]();
    this._ghost[`rotate${direction}`]();
    let canRotate = false;
    if (wallKicks.length) {
      for (let i = 0; i < wallKicks.length; i += 1) {
        const [x, y] = wallKicks[i];
        const vector = [x, -y]; // y has to be inverted because SRS has y axis pointing up
        if (this.shiftTetromino(vector)) {
          canRotate = true;
          break;
        }
      }
    } else {
      canRotate = true;
    }

    // rotation impossible, rotate back :(
    if (!canRotate) {
      if (direction === 'CW') {
        this._tetromino.rotateCCW();
        this._ghost.rotateCCW();
      } else {
        this._tetromino.rotateCW();
        this._ghost.rotateCW();
      }
      // translate in place to update ghost
      this.shiftTetromino([0, 0]);
    } else {
      sound.play('rotate', { volume: SFX_VOLUME });
    }
  }

  dropTetromino() {
    this.resetDropCounter();
    if (!this.shiftTetromino([0, 1])) {
      this.lockTetromino(() => {
        this.clearLines(() => {
          this.resetDropCounter();
          this.spawnTetromino();
        });
      });
      return false;
    }
    return true;
  }

  hardDropTetromino(cb) {
    this.resetDropCounter();
    const y = this._tetromino._gridPosition[1];
    const ghostY = this._ghost._gridPosition[1];
    const distance = ghostY - y;
    if (this.shiftTetromino([0, distance])) {
      // TODO: display ray from above after quick fall
      this.lockTetromino(() => {
        this.clearLines(() => {
          this.resetDropCounter();
          this.spawnTetromino();
          cb(distance);
        });
      });
    } else {
      cb();
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
          block._gridPosition = [gridX + colIndex, gridY + rowIndex];
          this._blocksContainer.addChild(block);
          blocks.push(block);
        }
      }
    }

    sound.play('lock', { volume: SFX_VOLUME });
    this._lockAnimation = TweenMax.to(this._tetromino, 0.1, {
      alpha: 0.5,
      yoyo: true,
      onComplete: () => {
        this._blocksContainer.removeChild(this._tetromino);
        this._tetromino = null;
        this._blocksContainer.removeChild(this._ghost);
        this._ghost = null;
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

    const fullRowIndexes = this._gridState.getFullRowIndexes();
    if (fullRowIndexes.length) {
      this._gridState.clearRowsAt(fullRowIndexes);
      const blocksToClear = [];
      this._blocksContainer.children.forEach(child => {
        if (child instanceof Block && fullRowIndexes.indexOf(child._gridPosition[1]) !== -1) {
          blocksToClear.push(child);
        }
      });

      sound.play('clear', { volume: SFX_VOLUME });

      const tl = new TimelineMax({
        onComplete: () => {
          blocksToClear.forEach(block => {
            this._blocksContainer.removeChild(block);
          });

          this._gridState.removeRowsAt(fullRowIndexes);

          this._blocksContainer.children.forEach(child => {
            if (child instanceof Block) {
              const [x, y] = child._gridPosition;
              const rowsToShiftDown = numericSort([y, ...fullRowIndexes])
                .reverse()
                .indexOf(y);
              child._gridPosition = [x, y + rowsToShiftDown];
              child.y += GRID_UNIT * rowsToShiftDown;
            }
          });
          this.addLinesCleared(fullRowIndexes.length);
          this._clearing = false;
          cb();
        }
      });
      blocksToClear.forEach(block => {
        tl.to(block, 0.1, { alpha: 0.5 }, 0);
      });
    } else {
      this._clearing = false;
      cb();
    }
  }

  addScorePoints(points) {
    this._score += points;
    this._scoreDisplay.value = this._score;
  }

  addLinesCleared(count) {
    const prevLevel = this._level;
    this._linesCleared += count;
    this._level = Math.floor(this._linesCleared / LINES_TO_CLEAR_PER_LEVEL);
    this._levelDisplay.value = this._level;

    if (prevLevel < this._level) {
      sound.play('level_up', { volume: SFX_VOLUME });
      // TODO: show lvl up effect
    }

    let pointsToAdd = 0;
    switch (count) {
      case 1:
        pointsToAdd = SINGLE_CLEAR_POINTS * (this._level || 1);
        break;
      case 2:
        pointsToAdd = DOUBLE_CLEAR_POINTS * (this._level || 1);
        break;
      case 3:
        pointsToAdd = TRIPLE_CLEAR_POINTS * (this._level || 1);
        break;
      case 4:
        pointsToAdd = TETRIS_CLEAR_POINTS * (this._level || 1);
    }

    this.addScorePoints(pointsToAdd);
  }

  resetDropCounter() {
    this._dropCounter = FPS - Math.min(this._level, MAX_SPEED_LEVEL) * DROP_FRAMES_PER_LEVEL;
  }

  resetDropRepeatCounter(extraFrames = 0) {
    this._dropRepeatCounter = DROP_REPEAT_FRAMES + extraFrames;
  }

  resetShiftRepeatCounter(extraFrames = 0) {
    this._shiftRepeatCounter = SHIFT_REPEAT_FRAMES + extraFrames;
  }

  addActionListeners() {
    this._inputManager.onActionDown(actions.ROTATE_CW, this.onRotateCWActionDown);
    this._inputManager.onActionDown(actions.ROTATE_CCW, this.onRotateCCWActionDown);
    this._inputManager.onActionDown(actions.SHIFT_LEFT, this.onShiftLeftActionDown);
    this._inputManager.onActionUp(actions.SHIFT_LEFT, this.onShiftLeftActionUp);
    this._inputManager.onActionDown(actions.SHIFT_RIGHT, this.onShiftRightActionDown);
    this._inputManager.onActionUp(actions.SHIFT_RIGHT, this.onShiftRightActionUp);
    this._inputManager.onActionDown(actions.SOFT_DROP, this.onSoftDropActionDown);
    this._inputManager.onActionDown(actions.HARD_DROP, this.onHardDropActionDown);
    this._inputManager.onActionDown(actions.PAUSE, this.onPauseActionDown);
    this._inputManager.onActionDown(actions.RETRY, this.onRetryActionDown);
    this._inputManager.onActionDown(actions.MUTE, this.onMuteActionDown);
  }

  actionsPrevented() {
    return this._paused || this._locking || this._clearing || this._gameOver;
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
    this.resetShiftRepeatCounter(SHIFT_REPEAT_FIRST_TIME_EXTRA_FRAMES);
    this._shiftRepeatActionsByPriority = [actions.SHIFT_LEFT, actions.SHIFT_RIGHT];
    if (this.shiftTetromino([-1, 0])) {
      sound.play('shift', { volume: SFX_VOLUME });
    }
  }

  onShiftLeftActionUp() {
    this._shiftRepeatActionsByPriority = [actions.SHIFT_RIGHT, actions.SHIFT_LEFT];
  }

  onShiftRightActionDown() {
    if (this.actionsPrevented()) {
      return;
    }
    this.resetShiftRepeatCounter(SHIFT_REPEAT_FIRST_TIME_EXTRA_FRAMES);
    this._shiftRepeatActionsByPriority = [actions.SHIFT_RIGHT, actions.SHIFT_LEFT];
    if (this.shiftTetromino([1, 0])) {
      sound.play('shift', { volume: SFX_VOLUME });
    }
  }

  onShiftRightActionUp() {
    this._shiftRepeatActionsByPriority = [actions.SHIFT_LEFT, actions.SHIFT_RIGHT];
  }

  onSoftDropActionDown() {
    if (this.actionsPrevented()) {
      return;
    }

    this.resetDropRepeatCounter(DROP_REPEAT_FIRST_TIME_EXTRA_FRAMES);
    if (this.dropTetromino()) {
      sound.play('shift', { volume: SFX_VOLUME });
      this.addScorePoints(SOFT_DROP_POINTS);
    }
  }

  onHardDropActionDown() {
    if (this.actionsPrevented()) {
      return;
    }
    this.hardDropTetromino(distance => {
      if (distance) {
        this.addScorePoints(HARD_DROP_POINTS * distance);
      }
    });
  }

  onPauseActionDown() {
    if (this._gameOver || this._counting) {
      return;
    }
    if (this._paused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  onRetryActionDown() {
    if (this._counting) {
      return;
    }
    this.retry();
  }

  onMuteActionDown() {
    if (this._muted) {
      sound.find('bgm').resume();
      this._muted = false;
    } else {
      sound.find('bgm').pause();
      this._muted = true;
    }
  }

  onTick(delta) {
    if (this.actionsPrevented()) {
      return;
    }
    if (InputManager.getInstance().isActionDown(actions.SOFT_DROP)) {
      if (this._dropRepeatCounter <= 0) {
        this.resetDropRepeatCounter();
        if (this.dropTetromino()) {
          sound.play('shift', { volume: SFX_VOLUME });
          this.addScorePoints(SOFT_DROP_POINTS);
        }
      } else {
        this._dropRepeatCounter -= delta;
      }
    }
    const shiftAction = this._shiftRepeatActionsByPriority[0];
    if (InputManager.getInstance().isActionDown(shiftAction)) {
      if (this._shiftRepeatCounter <= 0) {
        this.resetShiftRepeatCounter();
        if (shiftAction === actions.SHIFT_LEFT) {
          if (this.shiftTetromino([-1, 0])) {
            sound.play('shift', { volume: SFX_VOLUME });
          }
        } else {
          if (this.shiftTetromino([1, 0])) {
            sound.play('shift', { volume: SFX_VOLUME });
          }
        }
      } else {
        this._shiftRepeatCounter -= delta;
      }
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

    const rightSidebar = new Container();
    rightSidebar.x = grid.x + grid.width + 20;
    gui.addChild(rightSidebar);

    const nextDisplay = new TetrominoDisplay({
      label: 'Next'
    });
    rightSidebar.addChild(nextDisplay);
    nextDisplay.y = 7;
    this._nextDisplay = nextDisplay;

    const levelDisplay = new NumericDisplay({
      label: 'Level'
    });
    rightSidebar.addChild(levelDisplay);
    levelDisplay.y = nextDisplay.y + nextDisplay.height + 20;
    this._levelDisplay = levelDisplay;

    const scoreDisplay = new NumericDisplay({
      label: 'Score',
      valueSize: 24
    });
    scoreDisplay.y = levelDisplay.y + levelDisplay.height + 20;
    rightSidebar.addChild(scoreDisplay);
    this._scoreDisplay = scoreDisplay;

    const highScoreDisplay = new NumericDisplay({
      label: 'High score',
      valueSize: 24
    });
    highScoreDisplay.y = scoreDisplay.y + scoreDisplay.height + 20;
    rightSidebar.addChild(highScoreDisplay);
    this._highScoreDisplay = highScoreDisplay;

    // TODO: center gui on emitted resize event
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

    const gameOverOverlay = new GameOverOverlay(this);
    this._gameOverOverlay = gameOverOverlay;
    gameOverOverlay.position.set(
      Math.floor(this.width / 2 - gameOverOverlay.width / 2),
      Math.floor(this.height / 2 - gameOverOverlay.height / 2)
    );
    this.addChild(gameOverOverlay);
    gameOverOverlay.hide();

    const countdownOverlay = new CountdownOverlay();
    this._countdownOverlay = countdownOverlay;
    this.addChild(countdownOverlay);
    countdownOverlay.position.set(Math.floor(this.width / 2), Math.floor(this.height / 2));
    countdownOverlay.visible = false;
  }
}

export default SoloGameScene;
