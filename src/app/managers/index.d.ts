import Game from '@/Game';

export interface Manager {
  init(game: Game): void;
  update(time: number, deltaTime: number): void;
}
