import 'pixi.js';
import 'pixi-sound';
// eslint-disable-next-line
import * as PixiPlugin from 'gsap/PixiPlugin';
import Game from 'client/modules/Game';
import app from './createApp';
import './style.css';

// eslint-disable-next-line
const game = new Game(app);
