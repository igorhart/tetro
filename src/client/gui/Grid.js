import { Container, extras, Sprite, utils } from 'pixi.js';
import { colors, GRID_UNIT } from 'client/constants';
import { radians } from 'client/utils';

export default class Grid extends Container {
  constructor() {
    super();

    this.createGrid();
  }

  createGrid() {
    const gridTop = new Sprite(utils.TextureCache.grid_outer);
    gridTop.tint = colors.GRID;
    this.addChild(gridTop);

    const rows = new extras.TilingSprite(utils.TextureCache.grid_inner, this.width, 17 * GRID_UNIT);
    rows.tint = colors.GRID;
    rows.y = this.height;
    this.addChild(rows);

    const gridBottom = new Sprite(utils.TextureCache.grid_outer);
    gridBottom.tint = colors.GRID;
    gridBottom.rotation = radians(180);
    gridBottom.x = gridBottom.width;
    gridBottom.y = this.height + 58;
    this.addChild(gridBottom);
  }
}
