import { fill2d, isDefined, numericSort } from 'client/utils';

class GridState {
  constructor(w, h) {
    this._w = w;
    this._h = h;

    this.clear();
  }

  clear() {
    this._state = fill2d(this._w, this._h, 0);
  }

  clearRowsAt(indexes) {
    indexes.forEach(i => {
      this._state[i] = Array(this._w).fill(0);
    });
  }

  removeRowsAt(indexes) {
    const sortedIndexes = numericSort(indexes);
    sortedIndexes.forEach(i => {
      this._state.splice(i, 1);
      this._state.unshift(Array(this._w).fill(0));
    });
  }

  getRect({ x, y, size }) {
    let h = size;
    let yPos = y;
    let fullRowsToAdd = 0;
    let rect = [];

    if (y < 0) {
      rect = fill2d(size, Math.abs(yPos), 1);
      h = size - Math.abs(yPos);
      yPos = 0;
    }

    if (y + size > this._h) {
      h = size - (y + size - this._h);
      if (h < 0) {
        h = 0;
      }
      fullRowsToAdd = size - h;
      if (fullRowsToAdd > size) {
        fullRowsToAdd = size;
      }
    }

    for (let i = 0; i < h; i += 1) {
      const row = [];
      for (let j = 0; j < size; j += 1) {
        const value = this._state[yPos + i][x + j];
        if (!isDefined(value)) {
          row.push(1);
        } else {
          row.push(value);
        }
      }
      rect.push(row);
    }

    if (fullRowsToAdd > 0) {
      rect = rect.concat(fill2d(size, fullRowsToAdd, 1));
    }

    return rect;
  }

  isCollision({ x, y, size, other }) {
    const rect = this.getRect({ x, y, size });
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

  getFullRowIndexes() {
    const indexes = [];
    for (let i = 0; i < this._h; i += 1) {
      if (this._state[i].every(value => value === 1)) {
        indexes.push(i);
      }
    }
    return indexes;
  }

  get state() {
    return this._state;
  }
}

export default GridState;
