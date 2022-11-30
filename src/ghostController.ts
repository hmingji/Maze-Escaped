import { handleBulletEffect } from './bulletController';
import { GHOST_SPEED } from './constants';
import { getGhosts } from './gameController';
import {
  isChangeDirectionAllowed,
  isCollidingWithGhosts,
  isCollidingWithMap,
} from './geom';
import { getCollidables } from './mapController';

function handleGhostMovement(ghost: TGhost, delta: number) {
  const speed = GHOST_SPEED;
  //console.log('in handle movement function, facing: ', ghost.facing);
  if (ghost.state !== 'Normal') return;

  if (ghost.facing === 'Right') {
    ghost.x += Math.trunc(speed * delta);
    const offset = isCollidingWithMap(ghost, getCollidables());
    //console.log('ghost offset: ', offset);
    if (offset) {
      ghost.x -= offset;
      ghost.facing = getRandomDirecton(ghost);
      return;
    }
    const directionToChange = isChangeDirectionAllowed(ghost, getCollidables());
    if (directionToChange) {
      directionToChange.push(ghost.facing);
      if (directionToChange.length === 2) {
        ghost.facing = directionToChange[Math.floor(Math.random() * 2)];
      } else {
        ghost.facing = directionToChange[Math.floor(Math.random() * 3)];
      }
    }

    return;
  } else if (ghost.facing === 'Left') {
    ghost.x -= Math.trunc(speed * delta);
    const offset = isCollidingWithMap(ghost, getCollidables());
    //console.log('ghost offset: ', offset);
    if (offset) {
      ghost.x += offset;
      ghost.facing = getRandomDirecton(ghost);
      return;
    }
    const directionToChange = isChangeDirectionAllowed(ghost, getCollidables());
    if (directionToChange) {
      directionToChange.push(ghost.facing);
      if (directionToChange.length === 2) {
        ghost.facing = directionToChange[Math.floor(Math.random() * 2)];
      } else {
        ghost.facing = directionToChange[Math.floor(Math.random() * 3)];
      }
    }
    return;
  } else if (ghost.facing === 'Up') {
    ghost.y -= Math.trunc(speed * delta);
    const offset = isCollidingWithMap(ghost, getCollidables());
    //console.log('ghost offset: ', offset);
    if (offset) {
      ghost.y += offset;
      ghost.facing = getRandomDirecton(ghost);
      return;
    }
    const directionToChange = isChangeDirectionAllowed(ghost, getCollidables());
    if (directionToChange) {
      directionToChange.push(ghost.facing);
      if (directionToChange.length === 2) {
        ghost.facing = directionToChange[Math.floor(Math.random() * 2)];
      } else {
        ghost.facing = directionToChange[Math.floor(Math.random() * 3)];
      }
    }
    return;
  } else if (ghost.facing === 'Down') {
    ghost.y += Math.trunc(speed * delta);
    const offset = isCollidingWithMap(ghost, getCollidables());
    //console.log('ghost offset: ', offset);
    if (offset) {
      ghost.y -= offset;
      ghost.facing = getRandomDirecton(ghost);
      return;
    }
    const directionToChange = isChangeDirectionAllowed(ghost, getCollidables());
    if (directionToChange) {
      directionToChange.push(ghost.facing);
      if (directionToChange.length === 2) {
        ghost.facing = directionToChange[Math.floor(Math.random() * 2)];
      } else {
        ghost.facing = directionToChange[Math.floor(Math.random() * 3)];
      }
    }
    return;
  }
}

function getRandomDirecton(ghost: TGhost) {
  const directions =
    ghost.facing === 'Left' || ghost.facing === 'Right'
      ? ['Up', 'Down']
      : ['Left', 'Right'];
  return directions[Math.floor(Math.random() * 2)] as Direction;
}

export function handleGhostEffect(player: TPlayer) {
  const ghosts = getGhosts();
  if (isCollidingWithGhosts(player, ghosts)) {
    player.state = 'Dead';
  }
}

export function handleGhostLogic(ghosts: TGhost[], delta: number) {
  for (const ghost of ghosts) {
    handleGhostMovement(ghost, delta);
    handleBulletEffect(ghost);
  }
}
