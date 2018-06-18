import { types } from 'client/tetrominoData';
import { randomInt } from 'client/utils';

class Bag {
  constructor() {
    this._types = [];
  }

  pick() {
    if (!this._types.length) {
      this.refill();
    }
    return this._types.splice(randomInt(0, this._types.length - 1), 1)[0];
  }

  refill() {
    this._types = Object.keys(types);
  }
}

export default Bag;
