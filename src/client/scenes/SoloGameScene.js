import { Container } from 'pixi.js';
import Scene from 'client/modules/Scene';
import Grid from 'client/gui/Grid';

export default class SoloGameScene extends Scene {
  constructor({ id, sceneManager }) {
    super({ id, sceneManager });
    console.log('soloGame');
    // this.addBackground();
    this.addGUI();
  }

  // addBackground() {}

  addGUI() {
    // TODO: blur this._guiContainer when game paused
    // TODO: shake this._guiContainer when lines cleared (single = tiny shake, tetris = solid shake)
    const guiContainer = new Container();
    this._guiContainer = guiContainer;
    this.addChild(guiContainer);

    const gridContainer = new Container();
    guiContainer.addChild(gridContainer);

    const grid = new Grid();
    gridContainer.addChild(grid);

    const blocksContainer = new Container();
    gridContainer.addChild(blocksContainer);

    // const leftSidebarContainer = new Container();
    // guiContainer.addChild(leftSidebarContainer);
    //
    // const rightSidebarContainer = new Container();
    // guiContainer.addChild(rightSidebarContainer);

    guiContainer.pivot.set(guiContainer.width / 2, guiContainer.height / 2);
    guiContainer.position.set(this.width / 2, this.height / 2);
    // center guiContainer on the screen
  }
}
