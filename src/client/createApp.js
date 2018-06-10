import { Application, settings } from 'pixi.js';
import { BACKGROUND_COLOR } from './constants';

settings.RESOLUTION = window.devicePixelRatio;

const app = new Application({
  antialias: true,
  backgroundColor: BACKGROUND_COLOR,
  transparent: false,
  resolution: settings.RESOLUTION
});

document.body.append(app.view);

app.renderer.view.style.display = 'block';
app.renderer.view.style.position = 'absolute';
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

export default app;
