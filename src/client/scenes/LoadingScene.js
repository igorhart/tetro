import { loader, sound } from 'pixi.js';
// import { SteppedEase, TweenMax } from 'gsap';
import Preloader from 'client/gui/Preloader';
import Scene from 'client/modules/Scene';
import { BGM_VOLUME } from 'client/constants/game';
import scenes from 'client/constants/scenes';
import assets from 'client/assets';

class LoadingScene extends Scene {
  constructor({ id }) {
    super({ id });

    this.init();
  }

  init() {
    this._preloader = this.addPreloader();
    this.loadAssets();
  }

  addPreloader() {
    const preloader = new Preloader();
    preloader.position.set(Math.floor(this.width / 2), Math.floor(this.height / 2));
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

    sound.add('bgm', {
      url: 'assets/audio/bgm.mp3',
      singleInstance: true,
      volume: BGM_VOLUME
    });

    loader
      .add(assets)
      .on('progress', () => {
        this._preloader.progress = loader.progress;
      })
      .on('complete', () => {
        this.sceneManager.loadScene(scenes.CONTROLS);
      })
      .load();
  }

  onExit(cb) {
    super.onExit(cb);
  }
}

export default LoadingScene;
