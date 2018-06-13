import { Sprite, utils } from 'pixi.js';
import { colors } from 'client/constants';

export default class Block extends Sprite {
  constructor({ type }) {
    super(utils.TextureCache.block);

    this.tint = colors[type];
    this.anchor.set(0.5);
  }
}
