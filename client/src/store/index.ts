import { signal } from '@preact/signals-react';
import { ActiveGuess } from '../types';

export const userId = signal<string | null>(null);
export const userName = signal<string | null>(null);
export const price = signal<number | null>(0);
export const score = signal<number | null>(0);
export const activeGuess = signal<ActiveGuess | null>(null);

export const setUserId = (id: string | null) => {
  userId.value = id;
};

export const setUserName = (name: string | null) => {
  userName.value = name;
};

export const setScore = (currentScore: number) => {
  score.value = currentScore;
};

export const setCurrentPrice = (currentPrice: number) => {
  price.value = currentPrice;
};

export const setActiveGuess = (guess: ActiveGuess | null) => {
  activeGuess.value = guess;
};
