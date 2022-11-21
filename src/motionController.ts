import { CONTROLS, PLAYER_SPEED } from './constants';
import { isCollidingWithMap } from './geom';
import { getCollidables } from './mapController';
import { getControlsForPlayer } from './socketController';

function handlePlayerMovement(player: TPlayer, delta: number) {
  const playerControls = getControlsForPlayer(player.id);
  const speed = PLAYER_SPEED;

  if (playerControls[CONTROLS.RIGHT]) {
    player.x += speed * delta;
    player.facing = 'Right';

    if (isCollidingWithMap(player, getCollidables())) {
      player.x -= speed * delta;
    }
  } else if (playerControls[CONTROLS.LEFT]) {
    player.x -= speed * delta;
    player.facing = 'Left';

    if (isCollidingWithMap(player, getCollidables())) {
      player.x += speed * delta;
    }
  } else if (playerControls[CONTROLS.UP]) {
    player.y -= speed * delta;
    player.facing = 'Up';

    if (isCollidingWithMap(player, getCollidables())) {
      player.y += speed * delta;
    }
  } else if (playerControls[CONTROLS.DOWN]) {
    player.y += speed * delta;
    player.facing = 'Down';

    if (isCollidingWithMap(player, getCollidables())) {
      player.y -= speed * delta;
    }
  }
}

export function handleGameMotion(players: TPlayer[], delta: number) {
  for (const player of players) {
    handlePlayerMovement(player, delta);
  }
}
