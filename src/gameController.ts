import random from 'random-name';
import { handleBulletLogic } from './bulletController';
import { TICK_RATE } from './constants';
import { handleGhostLogic } from './ghostController';
import { getFlag, loadMap } from './mapController';
import { canReload, canShoot, handlePlayerLogic } from './playerController';
import {
  emitBulletRemoved,
  emitBullets,
  emitGameState,
  emitGhosts,
  emitPlayers,
} from './socketController';
import { handleInGameState } from './states/inGameState';
import { handlePreStartState } from './states/preStartState';

export enum GAME_STATE {
  PreStartGame = 'PRE_START_GAME',
  InGame = 'IN_GAME',
}

export let players: TPlayer[] = [];
export let bullets: TBullet[] = [];
export let ghosts: TGhost[] = [];
export let flag: TFlag | null = null;
export let winner: TPlayer | null = null;
let gameState: GAME_STATE = GAME_STATE.PreStartGame;

export const removePlayer = (id: number) => {
  players = players.filter((player) => player.id !== id);
};

export const getPlayer = (id: number) => {
  return players.find((item) => item.id === id);
};

export function setWinner(player: TPlayer | null) {
  winner = player;
}

export function getWinner() {
  return winner;
}

export function createPlayer(id: number) {
  const player: TPlayer = {
    x: 70,
    y: 70,
    score: 0,
    name: random.first(),
    id,
    color: `#${Math.floor(Math.random() * (0xffffff + 1)).toString(16)}`,
    facing: 'Right',
    bullet: 3,
    gunState: 'Ready',
    state: 'Normal',
  };
  players.push(player);
  canShoot[player.id] = true;
  canReload[player.id] = true;
  return player;
}

export function createGhost(id: number) {
  const ghost: TGhost = {
    id,
    x: 500,
    y: 150,
    score: 0,
    color: `#${Math.floor(Math.random() * (0xffffff + 1)).toString(16)}`,
    facing: 'Right',
    state: 'Normal',
  };
  ghosts.push(ghost);
  return ghost;
}

export function spawnGhosts(quantity: number) {
  for (let i = 0; i < quantity; i++) {
    createGhost(i);
  }
}

export function fireBullet(
  id: number,
  spawnPoint: TPoint,
  fireDirection: Direction
) {
  const bullet: TBullet = {
    id,
    x: spawnPoint.x,
    y: spawnPoint.y,
    travelTo: fireDirection,
  };
  bullets.push(bullet);
  return bullet;
}

export function getPlayers() {
  return players;
}

export function respawnPlayers() {
  for (const player of players) {
    const spawnPoint = { x: 70, y: 70 };
    player.x = spawnPoint.x;
    player.y = spawnPoint.y;
  }
}

export function getBullets() {
  return bullets;
}

export function getGhosts() {
  return ghosts;
}

export function clearGhosts() {
  ghosts = [];
}

export function removeBullet(bullet: TBullet) {
  bullets = bullets.filter((item) => item !== bullet);
  emitBulletRemoved(bullet);
}

export function getGameState() {
  return gameState;
}

export function setGameState(newState: GAME_STATE) {
  gameState = newState;
  emitGameState(gameState);
}

function getProcessMs() {
  const hrTime = process.hrtime();
  return (hrTime[0] * 1e9 + hrTime[1]) / 1e6;
}

function tick(delta: number) {
  handleGhostLogic(ghosts, delta);
  handlePlayerLogic(players, delta);
  handleBulletLogic(bullets, delta);

  if (gameState === GAME_STATE.PreStartGame) {
    handlePreStartState(players);
  } else if (gameState === GAME_STATE.InGame) {
    handleInGameState(players, getFlag()!);
  }

  emitPlayers(players);
  emitBullets(bullets);
  emitGhosts(ghosts);
}

let lastUpdate = getProcessMs();
let tickNumber = 0;

loadMap('default');

setInterval(() => {
  const now = getProcessMs();
  const delta = now - lastUpdate;
  tick(delta);
  lastUpdate = now;
  tickNumber++;
}, 1000 / TICK_RATE);
