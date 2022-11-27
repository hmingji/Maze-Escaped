export const PORT = process.env.PORT || 3000;
export const LIMIT_IP = process.env.ENABLE_IP_LIMIT ? true : false;
export const TICK_RATE = 30;
export const PLAYER_SPEED = 0.5;
export const BULLET_SPEED = 0.8;
export const PLAYER_WIDTH = 32;
export const PLAYER_HEIGHT = 48;
export const TILE_SIZE = 60;
export const BULLET_SIZE = 24;

export enum CONTROLS {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
  SHOOT = 'shoot',
  RELOAD = 'reload',
}

export type TControlMap = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shoot: boolean;
  reload: boolean;
};
