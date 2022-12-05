import { PLAYERS_NEEDED } from '../constants';
import { GAME_STATE, setGameState } from '../gameController';
import { startGame } from './inGameState';

export function handlePreStartState(players: TPlayer[]) {
  const shouldStartGame = players.length >= PLAYERS_NEEDED;
  if (shouldStartGame) {
    startGame();
  }
}

export function goToPreStartState() {
  setGameState(GAME_STATE.PreStartGame);
}
