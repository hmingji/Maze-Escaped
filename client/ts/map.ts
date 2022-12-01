import brickwallUrl from '../images/brickWall.png';
import flagUrl from '../images/flagGreen.png';
import { Camera } from './camera';
import { TILE_SIZE } from './constants';

let map: number[][] | null = null;

const mapImage = new Image();
mapImage.src = brickwallUrl;
const flagImage = new Image();
flagImage.src = flagUrl;

export function setMap(newMap: number[][]) {
  map = newMap;
}

export function drawMap(ctx: CanvasRenderingContext2D, camera: Camera) {
  if (!map) return;

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const tileType = map[row][col];
      if (tileType === 1) {
        ctx.drawImage(
          mapImage,
          0,
          0,
          TILE_SIZE,
          TILE_SIZE,
          Math.floor(col * TILE_SIZE - camera.cx),
          Math.floor(row * TILE_SIZE - camera.cy),
          TILE_SIZE,
          TILE_SIZE
        );
      }
      if (tileType === 2) {
        ctx.drawImage(
          flagImage,
          0,
          0,
          TILE_SIZE,
          TILE_SIZE,
          Math.floor(col * TILE_SIZE - camera.cx),
          Math.floor(row * TILE_SIZE - camera.cy),
          TILE_SIZE,
          TILE_SIZE
        );
      }
    }
  }
}
