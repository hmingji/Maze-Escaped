export const PORT = process.env.PORT || 3000;
export const LIMIT_IP = process.env.ENABLE_IP_LIMIT ? true : false;

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
