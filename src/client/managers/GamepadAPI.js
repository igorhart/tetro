import { ticker, utils } from 'pixi.js';

class GamepadAPI extends utils.EventEmitter {
  constructor() {
    super();

    this._gamepadStates = [];

    this.createTicker();

    this.onGamepadConnected = this.onGamepadConnected.bind(this);
    this.onGamepadDisconnected = this.onGamepadDisconnected.bind(this);
    this.onTick = this.onTick.bind(this);

    this.addEventListeners();
  }

  createTicker() {
    this._ticker = new ticker.Ticker();
    this._ticker.add(this.onTick, this, 1);
  }

  onTick() {
    // TODO: check all gamepads in a loop
    const gamepad = navigator.getGamepads()[0];

    if (gamepad) {
      const prevGamepadState = this._gamepadStates[0];
      if (prevGamepadState) {
        this.diffGamepadStates(prevGamepadState, gamepad);
      }
      const gamepadState = {
        axes: gamepad.axes.slice(0),
        buttons: gamepad.buttons.map(({ pressed, value }) => ({
          pressed,
          value
        }))
      };
      this._gamepadStates[0] = gamepadState;
    }
  }

  diffGamepadStates(prevState, state) {
    state.buttons.forEach((b, i) => {
      if (b.pressed !== prevState.buttons[i].pressed) {
        if (b.pressed) {
          console.log(i);
          this.emit('gamepadbuttondown', {
            button: i,
            gamepad: state
          });
        } else {
          this.emit('gamepadbuttonup', {
            button: i,
            gamepad: state
          });
        }
      }
    });
  }

  addEventListeners() {
    window.addEventListener('gamepadconnected', this.onGamepadConnected);
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected);
  }

  onGamepadConnected() {
    if (!this._ticker.started) {
      this._ticker.start();
    }
  }

  onGamepadDisconnected() {
    if (!this._ticker.started) {
      this._ticker.stop();
    }
  }
}

export default GamepadAPI;
