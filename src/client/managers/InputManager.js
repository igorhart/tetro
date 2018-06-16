let _instance = null;

class InputManager {
  constructor() {
    if (!_instance) {
      _instance = this;
    }
    this._keyMap = {};
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
}

export default InputManager;
