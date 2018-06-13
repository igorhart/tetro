import { Container } from 'pixi.js';
import Block from 'client/modules/Block';
import { BLOCK_SIZE, BLOCK_GAP } from 'client/constants';

export default class Tetromino extends Container {
  constructor({ type, size, pivotPoint, states }) {
    super();

    this._type = type;
    this._size = size;
    this._pivotPoint = pivotPoint;
    this._states = states;
    this._state = 0;

    this.addBlocks();
  }

  addBlocks() {
    // filter out empty rows
    const state = this._states[this._state].filter(row => row.length);

    for (let rowIndex = 0; rowIndex < state.length; rowIndex += 1) {
      for (let colIndex = 0; colIndex < state[rowIndex].length; colIndex += 1) {
        const value = state[rowIndex][colIndex];
        if (value === 1) {
          const block = new Block({ type: this._type });
          block.x = BLOCK_SIZE / 2 + colIndex * BLOCK_SIZE + colIndex * BLOCK_GAP;
          block.y = BLOCK_SIZE / 2 + rowIndex * BLOCK_SIZE + rowIndex * BLOCK_GAP;
          this.addChild(block);
        }
      }
    }

    this.pivot.set(...this._pivotPoint);
    this.cacheAsBitmap = true;
  }
}

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
  // O does not kick
};

// prettier-ignore
export const types = {
  I: {
    type: 'I',
    size: 4,
    pivotPoint: [BLOCK_SIZE * 2 + BLOCK_GAP * 1.5, BLOCK_SIZE + BLOCK_GAP * 0.5],
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
