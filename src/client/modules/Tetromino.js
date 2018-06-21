import { Container } from 'pixi.js';
import Block from 'client/modules/Block';
import { BLOCK_SIZE, GRID_UNIT } from 'client/constants/dimensions';
import { wallKicks } from 'client/tetrominoData';
import { deg2rad } from 'client/utils';

class Tetromino extends Container {
  constructor({ type, size, pivotPoint, spawnVector, states }) {
    super();

    this._type = type;
    this._size = size;
    this._pivotPoint = pivotPoint;
    this._spawnVector = spawnVector;
    this._states = states;
    this._stateIndex = 0;

    this.addBlocks();
  }

  addBlocks() {
    // filter out empty rows
    const state = this.state.filter(row => row.some(cell => cell === 1));

    for (let rowIndex = 0; rowIndex < state.length; rowIndex += 1) {
      for (let colIndex = 0; colIndex < state[rowIndex].length; colIndex += 1) {
        const value = state[rowIndex][colIndex];
        if (value === 1) {
          const block = new Block({ type: this._type });
          block.x = BLOCK_SIZE / 2 + colIndex * GRID_UNIT;
          block.y = BLOCK_SIZE / 2 + rowIndex * GRID_UNIT;
          this.addChild(block);
        }
      }
    }

    this.pivot.set(...this._pivotPoint);
  }

  translate([x, y]) {
    this.x += x * GRID_UNIT;
    this.y += y * GRID_UNIT;
  }

  // clockwise
  rotateCW() {
    const fromState = this._stateIndex;
    this._stateIndex += 1;
    if (this._stateIndex > 3) {
      this._stateIndex = 0;
    }
    this.rotation = deg2rad(this._stateIndex * 90);
    this.children.forEach(block => block.rotateCCW());

    return this._size > 2 ? wallKicks[this._size][fromState][this._stateIndex] : [];
  }

  // counter-clockwise
  rotateCCW() {
    const fromState = this._stateIndex;
    this._stateIndex -= 1;
    if (this._stateIndex < 0) {
      this._stateIndex = 3;
    }
    this.rotation = deg2rad(this._stateIndex * 90);
    this.children.forEach(block => block.rotateCW());

    return this._size > 2 ? wallKicks[this._size][fromState][this._stateIndex] : [];
  }

  get type() {
    return this._type;
  }

  get size() {
    return this._size;
  }

  get spawnVector() {
    return this._spawnVector;
  }

  get state() {
    return this._states[this._stateIndex];
  }

  get stateIndex() {
    return this._stateIndex;
  }
}

export default Tetromino;
