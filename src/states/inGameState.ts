import { GAME_LENGTH } from '../constants';
import {
  clearGhosts,
  GAME_STATE,
  respawnPlayers,
  setGameState,
  spawnGhosts,
} from '../gameController';
import { isPlayerCollidingWithFlag } from '../geom';
import { emitTimeLeft } from '../socketController';
import { goToEndGameState } from './endGameState';

let timeLeft: number;
let timeLeftInterval: NodeJS.Timeout;

export function startGame() {
  timeLeft = GAME_LENGTH / 1000;
  emitTimeLeft(timeLeft);
  respawnPlayers();
  spawnGhosts(5);
  setGameState(GAME_STATE.InGame);

  const setTimeLeft = () => {
    timeLeft--;
    emitTimeLeft(timeLeft);
  };
  timeLeftInterval = setInterval(setTimeLeft, 1000);
}

export function handleInGameState(players: TPlayer[], flag: TFlag) {
  const alivePlayer = players.filter((p) => p.state !== 'Dead').length;
  for (const player of players) {
    if (isPlayerCollidingWithFlag(player, flag)) {
      endGame(player);
    }
  }
  if (timeLeft <= 0 || alivePlayer <= 0) endGame(null);
}

export function endGame(winner: TPlayer | null) {
  clearInterval(timeLeftInterval);
  clearGhosts();
  goToEndGameState(winner);
}
