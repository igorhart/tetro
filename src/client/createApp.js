import { Application, settings } from 'pixi.js';
import colors from 'client/constants/colors';

settings.RESOLUTION = window.devicePixelRatio;

const app = new Application({
  antialias: true,
  backgroundColor: colors.BACKGROUND,
  resolution: settings.RESOLUTION,
  transparent: false
});

document.body.append(app.view);

app.renderer.view.style.display = 'block';
app.renderer.view.style.position = 'absolute';
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  // TODO: emit 'resize' event
});

export default app;
