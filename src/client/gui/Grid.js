import { Container, extras, Graphics, Sprite, utils } from 'pixi.js';
import colors from 'client/constants/colors';
import {
  BLOCK_GAP,
  GLOW_PADDING,
  GRID_COLS,
  GRID_ROWS,
  GRID_UNIT
} from 'client/constants/dimensions';
import { deg2rad } from 'client/utils';

class Grid extends Container {
  constructor() {
    super();

    this.createGrid();
    this.addBlocksContainer();
  }

  createGrid() {
    const borderTop = new Sprite(utils.TextureCache.grid_outer);
    borderTop.tint = colors.PURPLE;
    this.addChild(borderTop);

    const borders = new extras.TilingSprite(
      utils.TextureCache.grid_inner,
      this.width,
      GRID_UNIT * GRID_ROWS - GLOW_PADDING * 2 - BLOCK_GAP
    );
    borders.tint = colors.PURPLE;
    borders.y = this.height;
    this.addChild(borders);

    const borderBottom = new Sprite(utils.TextureCache.grid_outer);
    borderBottom.tint = colors.PURPLE;
    borderBottom.rotation = deg2rad(180);
    borderBottom.x = borderBottom.width;
    borderBottom.y = this.height + borderBottom.height;
    this.addChild(borderBottom);

    const lines = new Graphics();
    lines.beginFill(colors.PURPLE, 1);
    for (let i = 0; i < GRID_COLS; i += 1) {
      lines.drawRect(i * GRID_UNIT - BLOCK_GAP, 0, BLOCK_GAP, GRID_ROWS * GRID_UNIT - BLOCK_GAP);
    }
    for (let i = 0; i < GRID_ROWS; i += 1) {
      lines.drawRect(0, i * GRID_UNIT - BLOCK_GAP, GRID_COLS * GRID_UNIT - BLOCK_GAP, BLOCK_GAP);
    }
    lines.endFill();
    lines.x = GLOW_PADDING + BLOCK_GAP * 2;
    lines.y = GLOW_PADDING + BLOCK_GAP * 2;
    this.addChild(lines);
  }

  addBlocksContainer() {
    const blocksContainer = new Container();
    this._blocksContainer = blocksContainer;
    blocksContainer.x = GLOW_PADDING + BLOCK_GAP * 2;
    blocksContainer.y = GLOW_PADDING + BLOCK_GAP * 2;
    this.addChild(blocksContainer);
  }

  getBlocksContainer() {
    return this._blocksContainer;
  }
}

export default Grid;
