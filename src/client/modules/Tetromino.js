import { Container } from 'pixi.js';
import Block from 'client/modules/Block';
import { BLOCK_SIZE, BLOCK_GAP, GRID_UNIT } from 'client/constants';
import { deg2rad } from 'client/utils';

export default class Tetromino extends Container {
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
          block.x = BLOCK_SIZE / 2 + colIndex * BLOCK_SIZE + colIndex * BLOCK_GAP;
          block.y = BLOCK_SIZE / 2 + rowIndex * BLOCK_SIZE + rowIndex * BLOCK_GAP;
          block.rotation = deg2rad(this.children.length * 90);
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
    this._stateIndex += 1;
    if (this._stateIndex > 3) {
      this.stateIndex = 0;
    }
    this.rotation = deg2rad(this._stateIndex * 90);
  }

  // counter-clockwise
  rotateCCW() {
    this._stateIndex -= 1;
    if (this._stateIndex < 0) {
      this.stateIndex = 3;
    }
    this.rotation = deg2rad(this._stateIndex * 90);
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
}

// prettier-ignore
export const types = {
  I: {
    type: 'I',
    size: 4,
    pivotPoint: [BLOCK_SIZE * 2 + BLOCK_GAP * 1.5, BLOCK_SIZE + BLOCK_GAP * 0.5],
    spawnVector: [3, 1],
    states: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
      ]
    ]
  },
  J: {
    type: 'J',
    size: 3,
    pivotPoint: [BLOCK_SIZE * 1.5 + BLOCK_GAP, BLOCK_SIZE * 1.5 + BLOCK_GAP],
    spawnVector: [3, 0],
    states: [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
      ]
    ]
  },
  L: {
    type: 'L',
    size: 3,
    pivotPoint: [BLOCK_SIZE * 1.5 + BLOCK_GAP, BLOCK_SIZE * 1.5 + BLOCK_GAP],
    spawnVector: [3, 0],
    states: [
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ]
    ]
  },
  O: {
    type: 'O',
    size: 2,
    pivotPoint: [BLOCK_SIZE + BLOCK_GAP * 0.5, BLOCK_SIZE + BLOCK_GAP * 0.5],
    spawnVector: [4, 0],
    states: [
      [
        [1, 1],
        [1, 1]
      ],
      [
        [1, 1],
        [1, 1]
      ],
      [
        [1, 1],
        [1, 1]
      ],
      [
        [1, 1],
        [1, 1]
      ]
    ]
  },
  S: {
    type: 'S',
    size: 3,
    pivotPoint: [BLOCK_SIZE * 1.5 + BLOCK_GAP, BLOCK_SIZE * 1.5 + BLOCK_GAP],
    spawnVector: [3, 0],
    states: [
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
      ],
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
      ],
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
      ]
    ]
  },
  T: {
    type: 'T',
    size: 3,
    pivotPoint: [BLOCK_SIZE * 1.5 + BLOCK_GAP, BLOCK_SIZE * 1.5 + BLOCK_GAP],
    spawnVector: [3, 0],
    states: [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
      ]
    ]
  },
  Z: {
    type: 'Z',
    size: 3,
    pivotPoint: [BLOCK_SIZE * 1.5 + BLOCK_GAP, BLOCK_SIZE * 1.5 + BLOCK_GAP],
    spawnVector: [3, 0],
    states: [
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
      ]
    ]
  }
};

/*
  translations to test when rotating
  usage: wallKicks[tetromino.size][tetromino.state][newState]
  returns array of translations to test
  based on http://tetris.wikia.com/wiki/SRS
  O does not kick :(
*/
export const wallKicks = {
  // J, L, S, T, Z
  3: {
    0: {
      1: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
      3: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]
    },
    1: {
      0: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
      2: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]
    },
    2: {
      1: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
      3: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]
    },
    3: {
      0: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
      2: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]
    }
  },
  // I
  4: {
    0: {
      1: [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
      3: [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]
    },
    1: {
      0: [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
      2: [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]
    },
    2: {
      1: [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
      3: [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]]
    },
    3: {
      0: [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
      2: [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]]
    }
  }
};
