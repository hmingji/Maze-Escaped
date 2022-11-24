import { CONTROLS, PLAYER_SPEED } from './constants';
import { getOffset, isCollidingWithMap } from './geom';
import { getCollidables } from './mapController';
import { getControlsForPlayer } from './socketController';

function handlePlayerMovement(player: TPlayer, delta: number) {
  const playerControls = getControlsForPlayer(player.id);
  const speed = PLAYER_SPEED;

  if (playerControls[CONTROLS.RIGHT]) {
    player.x += speed * delta;
    player.facing = 'Right';

    if (isCollidingWithMap(player, getCollidables(), 'Right')) {
      player.x -= getOffset().x;
    }
  } else if (playerControls[CONTROLS.LEFT]) {
    player.x -= speed * delta;
    player.facing = 'Left';

    if (isCollidingWithMap(player, getCollidables(), 'Left')) {
      player.x += getOffset().x;
    }
  } else if (playerControls[CONTROLS.UP]) {
    player.y -= speed * delta;
    player.facing = 'Up';

    if (isCollidingWithMap(player, getCollidables(), 'Up')) {
      player.y += getOffset().y;
    }
  } else if (playerControls[CONTROLS.DOWN]) {
    player.y += speed * delta;
    player.facing = 'Down';

    if (isCollidingWithMap(player, getCollidables(), 'Down')) {
      player.y -= getOffset().y;
    }
  }
}

export function handleGameMotion(players: TPlayer[], delta: number) {
  for (const player of players) {
    handlePlayerMovement(player, delta);
  }
}
