export enum DIRECTION {
  UP = 'up',
  DOWN = 'down',
}

export type GuessValidationResult = {
  currentPrice: number;
  guessPrice: number;
  direction: DIRECTION;
  isCorrectGuess: boolean;
};

export type GetScoreResponse = {
  score: number;
};

export type SubmitGuessResponse = {
  message: string;
  guessId: string;
};

export type CreateUserResponse = {
  userId: string;
  name: string;
};

export interface ActiveGuess {
  guessId: string;
  userId: string;
  timestamp: number;
  direction: DIRECTION;
  price: number;
  correct?: boolean;
}
