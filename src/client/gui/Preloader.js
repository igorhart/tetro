import { Container, Graphics, settings } from 'pixi.js';
import { GlowFilter } from 'pixi-filters';
import { colors, GLOW_PADDING } from 'client/constants';

export default class Preloader extends Container {
  constructor({ progress } = { progress: 0 }) {
    super();

    this._progress = progress;
    this.init();
  }

  init() {
    this.createProgressBar();
    this.update();
  }

  createProgressBar() {
    const res = settings.RESOLUTION;
    const glowFilter = new GlowFilter(10 * res, 1, 0, colors.PRELOADER, 1);
    this.pivot.set(48, 32);

    const progressBackground = new Graphics();
    progressBackground.beginFill(0x000000, 0.2);
    progressBackground.drawRect(0, 0, 96, 32);
    progressBackground.drawRect(32, 32, 32, 32);
    progressBackground.endFill();
    this.addChild(progressBackground);

    const progressContainer = new Container();
    progressContainer.filters = [glowFilter];
    this.addChild(progressContainer);

    // because otherwise glow filter is clipped by the container... :/
    const spacer = new Graphics();
    spacer.position.set(-GLOW_PADDING, -GLOW_PADDING);
    spacer.beginFill(0x000000, 0);
    spacer.drawRect(0, 0, 96 + GLOW_PADDING * 2, 64 + GLOW_PADDING * 2);
    spacer.endFill();
    progressContainer.addChild(spacer);

    const mask = new Graphics();
    mask.beginFill(0x000000, 1);
    mask.drawRect(1, 1, 30, 30);
    mask.drawRect(33, 1, 30, 30);
    mask.drawRect(65, 1, 30, 30);
    mask.drawRect(33, 33, 30, 30);
    mask.endFill();
    progressContainer.addChild(mask);

    const progressBar = new Graphics();
    progressBar.mask = mask;
    this._progressBar = progressBar;
    progressContainer.addChild(progressBar);
  }

  update() {
    this._progressBar.clear();
    this._progressBar.beginFill(0xfe2880, 1);
    this._progressBar.drawRect(
      0,
      64 - (64 / 100) * this._progress,
      96,
      (64 / 100) * this._progress
    );
    this._progressBar.endFill();
  }

  get progress() {
    return this._progress;
  }

  set progress(progress) {
    this._progress = progress;
    this.update();
  }

  get progressBar() {
    return this._progressBar;
  }
}
