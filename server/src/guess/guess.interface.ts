export interface Guess {
  guessId: string;
  userId: string;
  timestamp: number;
  direction: DIRECTION;
  price: number;
  correct?: boolean;
}

export enum DIRECTION {
  UP = 'up',
  DOWN = 'down',
}
