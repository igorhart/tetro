import { GRID_COLS, GRID_ROWS } from 'client/constants/dimensions';
import { zeroFill2d } from 'client/utils';

class GridState {
  constructor() {
    this.clear();
  }

  clear() {
    this._state = zeroFill2d(GRID_COLS, GRID_ROWS);
    this.mergeRect({
      x: 3,
      y: 0,
      rect: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]
    });
    console.log(this._state);
    // console.log(this.getRect({ x: 1, y: 0, size: 2 }));
  }

  getRect({ x, y, size }) {
    const rect = [];
    for (let i = 0; i < size; i += 1) {
      rect.push(this._state[y + i].slice(x, x + size));
    }
    return rect;
  }

  isCollision({ x, y, size, other }) {
    const rect = this.getRect({ x, y, size });
    // TODO: compare two rects
    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        if (rect[i][j] === 1 && other[i][j] === 1) {
          return true;
        }
      }
    }
    return false;
  }

  mergeRect({ x, y, rect }) {
    for (let i = 0; i < rect.length; i += 1) {
      for (let j = 0; j < rect[i].length; j += 1) {
        if (rect[i][j] === 1) {
          this._state[y + i][x + j] = 1;
        }
      }
    }
  }
}

export default GridState;
