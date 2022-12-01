import { getPlayers, setWinner } from './gameController';
import { isPlayerCollidingWithFlag } from './geom';
import { emitWinner } from './socketController';

export function handleFlagLogic(flag: TFlag | null) {
  if (!flag) return;
  const players = getPlayers();
  for (const player of players) {
    if (isPlayerCollidingWithFlag(player, flag)) {
      //end game logic (game state)
      setWinner(player);
      emitWinner(player);
    }
  }
}
