import * as PIXI from 'pixi.js';
import './style.css';

const app = new PIXI.Application({
  antialias: true,
  transparent: false,
  resolution: window.devicePixelRatio
});

document.body.insertBefore(app.view, document.body.firstChild);

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

function step(dt) {
  console.log(dt);
}

PIXI.loader.add([]).load(() => {
  app.ticker.add(step);
});