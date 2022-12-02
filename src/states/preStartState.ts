import { PLAYERS_NEEDED } from '../constants';
import { GAME_STATE, setGameState, setWinner } from '../gameController';
import { emitWinner } from '../socketController';
import { startGame } from './inGameState';

export function handlePreStartState(players: TPlayer[]) {
  const shouldStartGame = players.length >= PLAYERS_NEEDED;
  if (shouldStartGame) {
    startGame();
  }
}

export function goToPreStartState(winner: TPlayer | null) {
  setGameState(GAME_STATE.PreStartGame);
  setWinner(winner);
  emitWinner(winner);
}
