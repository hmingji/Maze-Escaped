import playerLUrl from '../images/player_left.png';
import playerRUrl from '../images/player_right.png';
import playerBUrl from '../images/player_back.png';
import playerFUrl from '../images/player_front.png';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from './constants';
import { getMyPlayerId } from './socket';
import { TICK_RATE } from '../../src/constants';
import { Camera } from './camera';

let players: TPlayer[] = [];

type TInterpolation = {
  x: number;
  y: number;
  t: number;
};

const interpolations: Record<number, TInterpolation> = {};

const playerImageL = new Image();
playerImageL.src = playerLUrl;
const playerImageR = new Image();
playerImageR.src = playerRUrl;
const playerImageB = new Image();
playerImageB.src = playerBUrl;
const playerImageF = new Image();
playerImageF.src = playerFUrl;

const playerImageMap = {
  Left: playerImageL,
  Right: playerImageR,
  Up: playerImageB,
  Down: playerImageF,
};

export function removePlayer(playerId: number) {
  const index = players.findIndex((p) => p.id === playerId);
  if (index >= 0) {
    players.splice(index, 1);
    delete interpolations[playerId];
  }
}

export function clearPlayers() {
  players.length = 0;
}

export function getInterpolations() {
  return interpolations;
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: TPlayer,
  camera: Camera
) {
  ctx.drawImage(
    playerImageMap[player.facing],
    0,
    0,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    player.x - camera.cx,
    player.y - camera.cy,
    PLAYER_WIDTH,
    PLAYER_HEIGHT
  );
}

export function drawPlayers(ctx: CanvasRenderingContext2D, camera: Camera) {
  for (let player of players) {
    drawPlayer(ctx, player, camera);
    ctx.fillStyle = '#00FF00';
    ctx.font = `16px Verdana`;
    ctx.textAlign = 'center';
    ctx.fillText(
      player.name,
      player.x + 15 - camera.cx,
      player.y - 10 - camera.cy
    );
  }
}

export function getMyPlayer() {
  return players.find((p) => p.id === getMyPlayerId());
}

export function getMyPlayers() {
  return players;
}

export function updatePlayers(delta: number) {
  for (let player of players) {
    const target = interpolations[player.id];
    if (!target) continue;
    const t = Math.min(1, target.t / (1000 / TICK_RATE));
    player.x = player.x * (1 - t) + t * target.x;
    player.y = player.y * (1 - t) + t * target.y;
    target.t += delta;
  }
}

export function refreshPlayersState(playerStateChanges: TPlayer[]) {
  // someone new joined
  for (const player of playerStateChanges) {
    if (!players.find((p) => p.id === player.id)) {
      players.push(player);
      interpolations[player.id] = {
        x: player.x ?? 0,
        y: player.y ?? 0,
        t: 0,
      };
    }
  }

  // sync players with server state
  for (const player of playerStateChanges) {
    const matchingPlayer = players.find((p) => p.id === player.id);
    if (!matchingPlayer) continue;
    const { id, x, y, ...props } = player;
    Object.assign(matchingPlayer, props);
    if (y) interpolations[player.id].y = y;
    if (x) interpolations[player.id].x = x;
    interpolations[player.id].t = 0;
  }
}
