import { Container, Graphics } from 'pixi.js';

class Preloader extends Container {
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
    this.pivot.set(45, 30);

    const progressBackground = new Graphics();
    progressBackground.beginFill(0x000000, 0.2);
    progressBackground.drawRect(0, 0, 90, 30);
    progressBackground.drawRect(30, 30, 30, 30);
    progressBackground.endFill();
    this.addChild(progressBackground);

    const progressContainer = new Container();
    this.addChild(progressContainer);

    const mask = new Graphics();
    mask.beginFill(0x000000, 1);
    mask.drawRect(0, 0, 90, 30);
    mask.drawRect(30, 30, 30, 30);
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
      60 - (60 / 100) * this._progress,
      90,
      (60 / 100) * this._progress
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

export default Preloader;
