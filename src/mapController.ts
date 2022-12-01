import { TILE_SIZE } from './constants';
import { defaultMap } from '../maps/map';

let collidables: TPoint[] = [];
let flag: TFlag | null = null;
const maps = {
  default: defaultMap,
};
let gameMap: number[][];

export function loadMap(mapName) {
  const map = maps[mapName];
  gameMap = map;
  collidables = [];
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === 1) {
        collidables.push({
          x: col * TILE_SIZE,
          y: row * TILE_SIZE,
        });
      }
      if (map[row][col] === 2) {
        flag = {
          x: col * TILE_SIZE,
          y: row * TILE_SIZE,
        } as TFlag;
      }
    }
  }
}

const PLAYER_SPAWN: TPoint = {
  x: 50,
  y: 50,
};

const GHOST_SPAWN: TPoint = {
  x: 500,
  y: 500,
};

export const getPlayerSpawn = () => PLAYER_SPAWN;
export const getGhostSpawn = () => GHOST_SPAWN;

export const getCollidables = () => collidables;
export const getGameMap = () => gameMap;
export const getFlag = () => flag;
