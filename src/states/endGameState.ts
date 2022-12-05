import {
  GAME_STATE,
  getGameState,
  getPlayers,
  setGameState,
  setWinner,
} from '../gameController';
import { emitWinner } from '../socketController';
import { goToPreStartState } from './preStartState';

export function goToEndGameState(winner: TPlayer | null) {
  setWinner(winner);
  emitWinner(winner);
  setGameState(GAME_STATE.EndGame);

  const players = getPlayers();
  if (players.length <= 0) {
    goToPreStartState();
  } else {
    setTimeout(() => {
      const currentGameState = getGameState();
      if (currentGameState === GAME_STATE.EndGame) goToPreStartState();
    }, 3000);
  }
}
