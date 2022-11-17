export enum CTR_ACTIONS {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
  SHOOT = 'shoot',
  RELOAD = 'reload',
}

export type KeyMap = Record<string, CTR_ACTIONS>;

let keyMap: KeyMap = {};
export const defaultKeymap: KeyMap = {
  w: CTR_ACTIONS.UP,
  s: CTR_ACTIONS.DOWN,
  a: CTR_ACTIONS.LEFT,
  d: CTR_ACTIONS.RIGHT,
  q: CTR_ACTIONS.RELOAD,
  ' ': CTR_ACTIONS.SHOOT,
  ArrowUp: CTR_ACTIONS.UP,
  ArrowDown: CTR_ACTIONS.DOWN,
  ArrowLeft: CTR_ACTIONS.LEFT,
  ArrowRight: CTR_ACTIONS.RIGHT,
};

export const activeControls = {
  up: false,
  down: false,
  left: false,
  right: false,
  shoot: false,
  reload: false,
};

document.addEventListener('keydown', (e) => {
  activeControls[keyMap[e.key]] = true;
});

document.addEventListener('keyup', (e) => {
  activeControls[keyMap[e.key]] = false;
});

export function setKeymap(map: KeyMap) {
  keyMap = map;
}

export function getKeymap(): KeyMap {
  return { ...keyMap };
}

export function isCommandDown(command: CTR_ACTIONS) {
  return !!activeControls[command];
}
