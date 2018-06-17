import { Sprite, Texture } from 'pixi.js';

class PauseOverlay extends Sprite {
  constructor() {
    super(Texture.WHITE);

    this.alpha = 0.1;
    this.tint = 0x000000;
    this.anchor.set(0.5);
  }

  show() {
    this.visible = true;
    // TODO: flash text
  }

  hide() {
    this.visible = false;
    // TODO: stop flashing text
  }
}

export default PauseOverlay;
