import { BULLET_SPEED, CONTROLS, PLAYER_SPEED } from './constants';
import { bullets } from './gameController';
import { isCollidingWithMap, isCollidingWithBullet } from './geom';
import { getCollidables } from './mapController';
import { getControlsForPlayer } from './socketController';

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

function handleBulletMovement(bullet: TBullet, delta: number) {
  const speed = BULLET_SPEED;
  switch (bullet.travelTo) {
    case 'Right':
      bullet.x += speed * delta;
  }
}

export function handleGameMotion(
  players: TPlayer[],
  bullets: TBullet[],
  delta: number
) {
  for (const player of players) {
    handlePlayerMovement(player, delta);
    if (isCollidingWithBullet(player, bullets)) {
    }
  }
}
