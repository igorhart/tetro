import inputActions from 'client/constants/actions';

let _instance = null;

class InputManager {
  constructor() {
    if (!_instance) {
      _instance = this;

      this._keyMap = {};
      this._actionsDown = [];
      this._listeners = [];

      this.onKeyDown = this.onKeyDown.bind(this);
      this.onKeyUp = this.onKeyUp.bind(this);

      this.addEventListeners();
    }
    return _instance;
  }

  static getInstance() {
    if (!_instance) {
      _instance = new InputManager();
    }
    return _instance;
  }

  addActions(actions) {
    const keyMap = {};
    Object.keys(actions).forEach(action => {
      actions[action].forEach(key => {
        keyMap[key] = action;
      });
    });
    this._keyMap = keyMap;
    return this;
  }

  onActionDown(action, cb) {
    const listener = {
      type: 'down',
      action,
      cb
    };
    this.addListener(listener);

    const unbind = () => {
      this.removeListener(listener);
    };
    return unbind;
  }

  onActionUp(action, cb) {
    const listener = {
      type: 'up',
      action,
      cb
    };
    this.addListener(listener);

    const unbind = () => {
      this.removeListener(listener);
    };
    return unbind;
  }

  addListener(listener) {
    this._listeners.push(listener);
  }

  removeListener(listener) {
    this._listeners = this._listeners.filter(l => l !== listener);
  }

  onKeyDown(event) {
    const action = this.keyToAction(event.keyCode);
    const type = 'down';

    if (!this.isActionDown(action)) {
      this._actionsDown.push(action);
      this.runListeners(action, type);
    }
  }

  onKeyUp(event) {
    const action = this.keyToAction(event.keyCode);
    const type = 'up';

    this._actionsDown = this._actionsDown.filter(a => a !== action);
    this.runListeners(action, type);
  }

  keyToAction(key) {
    if (this._keyMap[key]) {
      return this._keyMap[key];
    }
    return inputActions.ANY;
  }

  isActionDown(action) {
    return this._actionsDown.indexOf(action) !== -1;
  }

  runListeners(action, type) {
    this._listeners.forEach(listener => {
      if (
        (listener.action === action && listener.type === type) ||
        (listener.action === inputActions.ANY && listener.type === type)
      ) {
        listener.cb();
      }
    });
  }

  addEventListeners() {
    // keyboard
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }
}

export default InputManager;
