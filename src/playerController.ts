import { handleBulletEffect } from './bulletController';
import {
  BULLET_SPEED,
  CONTROLS,
  GHOST_SPEED,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  PLAYER_WIDTH,
} from './constants';
import { fireBullet, removeBullet } from './gameController';
import {
  isCollidingWithMap,
  isCollidingWithBullet,
  isBulletColliding,
  isPlayer,
  isChangeDirectionAllowed,
} from './geom';
import { getCollidables } from './mapController';
import { getControlsForPlayer } from './socketController';

let nextBulletId = 0;
export const canShoot: Record<number, boolean> = {};

function getNextBulletId() {
  return nextBulletId++;
}

function handlePlayerMovement(player: TPlayer, delta: number) {
  const playerControls = getControlsForPlayer(player.id);
  const speed = PLAYER_SPEED;
  if (player.state !== 'Normal') return;

  if (playerControls[CONTROLS.RIGHT]) {
    player.x += Math.trunc(speed * delta);
    player.facing = 'Right';

    const offset = isCollidingWithMap(player, getCollidables());
    if (offset) {
      player.x -= offset;
    }
  } else if (playerControls[CONTROLS.LEFT]) {
    player.x -= Math.trunc(speed * delta);
    player.facing = 'Left';

    const offset = isCollidingWithMap(player, getCollidables());
    if (offset) {
      player.x += offset;
    }
  } else if (playerControls[CONTROLS.UP]) {
    player.y -= Math.trunc(speed * delta);
    player.facing = 'Up';

    const offset = isCollidingWithMap(player, getCollidables());
    if (offset) {
      player.y += offset;
    }
  } else if (playerControls[CONTROLS.DOWN]) {
    player.y += Math.trunc(speed * delta);
    player.facing = 'Down';

    const offset = isCollidingWithMap(player, getCollidables());
    if (offset) {
      player.y -= offset;
    }
  }
}

function handlePlayerShoot(player: TPlayer) {
  const playerControls = getControlsForPlayer(player.id);
  if (playerControls[CONTROLS.SHOOT] && canShoot[player.id]) {
    canShoot[player.id] = false;
    fireBullet(getNextBulletId(), getBulletSpawn(player), player.facing);
    activateShoot(player.id);
  }
  playerControls[CONTROLS.SHOOT] = false;
}

function activateShoot(playerId: number) {
  if (!canShoot[playerId]) {
    setTimeout(() => {
      canShoot[playerId] = true;
    }, 1000);
  }
}

function getBulletSpawn(player: TPlayer) {
  switch (player.facing) {
    case 'Right':
      return {
        x: player.x + PLAYER_WIDTH,
        y: player.y + PLAYER_HEIGHT / 4,
      } as TPoint;
    case 'Left':
      return {
        x: player.x - PLAYER_WIDTH,
        y: player.y + PLAYER_HEIGHT / 4,
      } as TPoint;
    case 'Up':
      return {
        x: player.x + PLAYER_WIDTH / 4,
        y: player.y - PLAYER_HEIGHT,
      } as TPoint;
    case 'Down':
      return {
        x: player.x + PLAYER_WIDTH / 4,
        y: player.y + PLAYER_HEIGHT,
      } as TPoint;
  }
}

export function handleGamePhysics(players: TPlayer[], delta: number) {
  for (const player of players) {
    handlePlayerMovement(player, delta);
    handlePlayerShoot(player);
    handleBulletEffect(player);
  }
}
