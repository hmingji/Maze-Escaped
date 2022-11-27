import {
  BULLET_SPEED,
  CONTROLS,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  PLAYER_WIDTH,
} from './constants';
import { fireBullet, removeBullet } from './gameController';
import {
  isCollidingWithMap,
  isCollidingWithBullet,
  isBulletColliding,
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

  if (playerControls[CONTROLS.RIGHT]) {
    player.x += speed * delta;
    player.facing = 'Right';

    const offset = isCollidingWithMap(player, getCollidables());
    if (offset) {
      player.x -= offset;
    }
  } else if (playerControls[CONTROLS.LEFT]) {
    player.x -= speed * delta;
    player.facing = 'Left';

    const offset = isCollidingWithMap(player, getCollidables());
    if (offset) {
      player.x += offset;
    }
  } else if (playerControls[CONTROLS.UP]) {
    player.y -= speed * delta;
    player.facing = 'Up';

    const offset = isCollidingWithMap(player, getCollidables());
    if (offset) {
      player.y += offset;
    }
  } else if (playerControls[CONTROLS.DOWN]) {
    player.y += speed * delta;
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

function handleBulletMovement(bullet: TBullet, delta: number) {
  const speed = BULLET_SPEED;
  switch (bullet.travelTo) {
    case 'Right':
      bullet.x += speed * delta;
      break;
    case 'Left':
      bullet.x -= speed * delta;
      break;
    case 'Up':
      bullet.y -= speed * delta;
      break;
    case 'Down':
      bullet.y += speed * delta;
      break;
  }
}

export function handleGamePhysics(
  players: TPlayer[],
  bullets: TBullet[],
  delta: number
) {
  for (const player of players) {
    handlePlayerMovement(player, delta);
    if (isCollidingWithBullet(player, bullets)) {
      //to update player status into stunned.
    }
    handlePlayerShoot(player);
  }

  for (const bullet of bullets) {
    handleBulletMovement(bullet, delta);
    if (isBulletColliding(bullet, getCollidables(), players)) {
      removeBullet(bullet);
    }
  }
}
