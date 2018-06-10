// import { Container, Text } from 'pixi.js';
import Scene from 'client/modules/Scene';

export default class SoloGameScene extends Scene {
  constructor({ id, sceneManager }) {
    super({ id, sceneManager });

    console.log('SoloGameScene constructor()');
    console.log(id, sceneManager);
  }
}
