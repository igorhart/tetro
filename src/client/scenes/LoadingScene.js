import { loader } from 'pixi.js';
// import { RoughEase, TweenMax } from 'gsap/all';
import Preloader from 'client/gui/Preloader';
import Scene from 'client/modules/Scene';
import scenes from 'client/constants/scenes';
import assets from 'client/assets';

class LoadingScene extends Scene {
  constructor({ id }) {
    super({ id });

    this.init();

    this.onTick = this.onTick.bind(this);
    this.sceneManager.app.ticker.add(this.onTick);
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
    //   ease: SteppedEase.config(10),
    //   onComplete: () => {
    //     this.sceneManager.loadScene(scenes.CONTROLS);
    //   }
    // });

    if (assets.length) {
      // TODO: move loader logic into AssetManager singleton and call AssetManager.load(() => ...)
      loader
        .add(assets)
        .on('progress', () => {
          this._preloader.progress = loader.progress;
        })
        .on('complete', () => {
          // TODO: prepare audio files with sound.js before continuing
          this.sceneManager.loadScene(scenes.CONTROLS);
        })
        .load();
    } else {
      this._preloader.progress = 100;
      setTimeout(() => {
        this.sceneManager.loadScene(scenes.CONTROLS);
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

    this.app.ticker.remove(this.onTick);
    super.onExit(cb);

    // TweenMax.to(this._preloader.progressBar, 0.5, {
    //   alpha: 0,
    //   ease: RoughEase.ease.config({ points: 20, strength: 10, randomize: true, clamp: true }),
    //   delay: 0.5,
    //   onComplete: () => {
    //     this.app.ticker.remove(this.onTick);
    //     super.onExit(cb);
    //   }
    // });
  }
}

export default LoadingScene;
