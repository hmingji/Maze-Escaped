import bulletUrl from '../images/fireball_28.png';
import { getCanvasSize } from './canvas';
import { getGameState } from './game';
import { getMyPlayer, getPlayers } from './player';

let timeLeft = 0;
let gameMessage = '';

const hudOffsetY = 20;

const bulletImage = new Image();
bulletImage.src = bulletUrl;

export function setTimeLeft(newTimeLeft: number) {
  timeLeft = newTimeLeft;
}

export function setGameMessage(message: string) {
  gameMessage = message;
}

export function clearGameMessage() {
  gameMessage = '';
}

export function drawHud(ctx: CanvasRenderingContext2D) {
  const currentGameState = getGameState();
  const { width, height } = getCanvasSize();

  const players = getPlayers();
  const alivePlayer = players.filter((p) => p.state !== 'Dead').length;
  const myPlayer = getMyPlayer();

  if (currentGameState === 'PRE_START_GAME') clearGameMessage();

  ctx.fillStyle = '#000000';
  ctx.font = `24px Verdana`;
  ctx.textAlign = 'left';
  ctx.fillText(`Alive Player: ${alivePlayer}`, 20, height - hudOffsetY);

  ctx.drawImage(bulletImage, width / 2, height - hudOffsetY - 24, 28, 28);
  ctx.fillText(
    myPlayer?.gunState === 'Ready' ? `*${myPlayer?.bullet}` : 'Reloading...',
    width / 2 + 28,
    height - hudOffsetY
  );

  ctx.fillText(
    `Time Left: ${new Date(timeLeft * 1000).toISOString().substring(14, 19)}`,
    width - 300,
    height - hudOffsetY
  );

  ctx.textAlign = 'center';
  ctx.fillText(gameMessage, width / 2, 40);
}
