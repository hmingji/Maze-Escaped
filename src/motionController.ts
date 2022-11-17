import { CONTROLS, PLAYER_SPEED } from './constants';
import { getControlsForPlayer } from './socketController';

function handlePlayerMovement(player: TPlayer, delta: number) {
  const playerControls = getControlsForPlayer(player.id);
  const speed = PLAYER_SPEED;

  if (playerControls[CONTROLS.RIGHT]) {
    player.x += speed * delta;
    player.facing = 'Right';
  } else if (playerControls[CONTROLS.LEFT]) {
    player.x -= speed * delta;
    player.facing = 'Left';
  } else if (playerControls[CONTROLS.UP]) {
    player.y -= speed * delta;
    player.facing = 'Up';
  } else if (playerControls[CONTROLS.DOWN]) {
    player.y += speed * delta;
    player.facing = 'Down';
  }
}

export function handleGameMotion(players: TPlayer[], delta: number) {
  for (const player of players) {
    handlePlayerMovement(player, delta);
  }
}
