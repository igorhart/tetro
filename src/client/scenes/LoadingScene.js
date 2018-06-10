import { loader } from 'pixi.js';
import { RoughEase, TweenMax } from 'gsap/all';
import Preloader from 'client/modules/Preloader';
import Scene from 'client/modules/Scene';
import assets from 'client/assets';

export default class LoadingScene extends Scene {
  constructor({ id, sceneManager }) {
    super({ id, sceneManager });

    this.init();

    this.onTick = this.onTick.bind(this);
    sceneManager.app.ticker.add(this.onTick);
  }

  init() {
    // optional scene background
    // this.background.alpha = 1;
    // this.background.tint = 0xff0000;
    this._preloader = this.addPreloader();
    this.loadAssets();
  }

  addPreloader() {
    const preloader = new Preloader();
    preloader.x = this.width / 2;
    preloader.y = this.height / 2;
    this.addChild(preloader);

    return preloader;
  }

  loadAssets() {
    // simulate loading
    // TweenMax.to(this._preloader, 5, {
    //   progress: 100,
    //   ease: SteppedEase.config(12),
    //   onComplete: () => {
    //     this._sceneManager.loadScene('soloGame');
    //   }
    // });

    if (assets.length) {
      loader
        .add(assets)
        .on('progress', () => {
          this._preloader.progress = loader.progress;
        })
        .on('complete', () => {
          // TODO: .loadScene('mainMenu') when ready
          this.sceneManager.loadScene('soloGame');
        })
        .load();
    } else {
      this._preloader.progress = 100;
      setTimeout(() => {
        // TODO: .loadScene('mainMenu') when ready
        this.sceneManager.loadScene('soloGame');
      });
    }
  }

  onTick() {
    super.onTick();
    // center preloader on the screen
    this._preloader.x = this.width / 2;
    this._preloader.y = this.height / 2;
  }

  onExit(cb) {
    // blink like broken neon
    TweenMax.to(this._preloader.progressBar, 0.5, {
      alpha: 0,
      ease: RoughEase.ease.config({ points: 20, strength: 10, randomize: true, clamp: true }),
      onComplete: () => {
        this.app.ticker.remove(this.onTick);
        super.onExit(cb);
      }
    });
  }
}
