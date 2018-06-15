import { Sprite, utils } from 'pixi.js';
import { colors, GRID_UNIT } from 'client/constants';
import { deg2rad } from 'client/utils';

export default class Block extends Sprite {
  constructor({ type }) {
    super(utils.TextureCache.block);

    this.tint = colors[type];
    this.anchor.set(0.5);
  }

  translate([x, y]) {
    this.x += x * GRID_UNIT;
    this.y += y * GRID_UNIT;
  }

  // clockwise
  rotateCW() {
    this.rotation += deg2rad(90);
  }

  // counter-clockwise
  rotateCCW() {
    this.rotation -= deg2rad(90);
  }
}
