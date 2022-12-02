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
import { goToPreStartState } from './preStartState';

let timeLeft: number;
let timeLeftInterval: NodeJS.Timeout;

export function startGame() {
  timeLeft = GAME_LENGTH / 1000;
  emitTimeLeft(timeLeft);
  respawnPlayers();
  spawnGhosts(1);
  setGameState(GAME_STATE.InGame);

  const setTimeLeft = () => {
    timeLeft--;
    emitTimeLeft(timeLeft);
  };
  timeLeftInterval = setInterval(setTimeLeft, 1000);
}

export function handleInGameState(players: TPlayer[], flag: TFlag) {
  for (const player of players) {
    if (isPlayerCollidingWithFlag(player, flag)) {
      endGame(player);
    }
  }
  if (timeLeft <= 0) endGame(null);
}

export function endGame(winner: TPlayer | null) {
  clearInterval(timeLeftInterval);
  emitTimeLeft(0);
  clearGhosts();
  goToPreStartState(winner);
}
