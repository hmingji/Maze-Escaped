import brickwallUrl from '../images/brickWall.png';
import { TILE_SIZE } from './constants';

let map: number[][] | null = null;

const mapImage = new Image();
mapImage.src = brickwallUrl;

export function setMap(newMap: number[][]) {
  map = newMap;
}

export function drawMap(ctx: CanvasRenderingContext2D) {
  if (!map) return;

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const tileType = map[row][col];
      if (tileType === 1) {
        ctx.drawImage(
          mapImage,
          col * TILE_SIZE,
          row * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        );
      }
    }
  }
}
