import { Container, Graphics, settings } from 'pixi.js';
import { GlowFilter } from 'pixi-filters';
import { BLOCK_SIZE, BLOCK_GAP, colors, GRID_COLS, GRID_ROWS } from 'client/constants';

export default class Grid extends Container {
  constructor() {
    super();

    this.createGrid();
  }

  createGrid() {
    const res = settings.RESOLUTION;
    const glowFilter = new GlowFilter(10 * res, 1, 0, colors.GRID, 1);

    const lines = new Graphics();
    lines.beginFill(colors.GRID, 1);
    lines.drawRect(0, 0, BLOCK_GAP * 2, GRID_ROWS * (BLOCK_SIZE + BLOCK_GAP) + BLOCK_GAP);
    lines.drawRect(
      GRID_COLS * (BLOCK_SIZE + BLOCK_GAP) + BLOCK_GAP,
      0,
      BLOCK_GAP * 2,
      GRID_ROWS * (BLOCK_SIZE + BLOCK_GAP) + BLOCK_GAP * 2
    );
    for (let i = 1; i < GRID_COLS; i += 1) {
      lines.drawRect(
        i * (BLOCK_SIZE + BLOCK_GAP) + BLOCK_GAP,
        1,
        BLOCK_GAP,
        GRID_ROWS * (BLOCK_SIZE + BLOCK_GAP) + BLOCK_GAP
      );
    }
    for (let i = 1; i < GRID_ROWS; i += 1) {
      lines.drawRect(
        1,
        i * (BLOCK_SIZE + BLOCK_GAP) + BLOCK_GAP,
        GRID_COLS * (BLOCK_SIZE + BLOCK_GAP) + BLOCK_GAP,
        BLOCK_GAP
      );
    }
    lines.drawRect(0, 0, GRID_COLS * (BLOCK_SIZE + BLOCK_GAP) + BLOCK_GAP * 2, BLOCK_GAP * 2);
    lines.drawRect(
      0,
      GRID_ROWS * (BLOCK_SIZE + BLOCK_GAP) + BLOCK_GAP,
      GRID_COLS * (BLOCK_SIZE + BLOCK_GAP) + BLOCK_GAP * 3,
      BLOCK_GAP * 2
    );
    lines.endFill();
    this.addChild(lines);

    const spacer = new Graphics();
    spacer.position.set(-20, -20);
    spacer.beginFill(0x000000, 0);
    spacer.drawRect(0, 0, this.width + 40, this.height + 40);
    spacer.endFill();
    this.addChild(spacer);

    this.filters = [glowFilter];
    this.cacheAsBitmap = true;
    this.pivot.set(this.width / 2, this.height / 2);
  }
}
