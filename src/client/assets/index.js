import { settings } from 'pixi.js';

const res = settings.RESOLUTION;

let assets = [];

if (res > 1) {
  assets = [...assets, 'block@2x.png'];
} else {
  assets = [...assets, 'block.png'];
}

export default assets;
