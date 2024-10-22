import {
  signal,
  computed,
  ReadonlySignal,
  Signal,
} from '@preact/signals-react';
import { DIRECTION } from '../types';

type GuessState = {
  guessId: Signal<string | null>;
  userId: Signal<string>;
  timestamp: Signal<number>;
  direction: Signal<DIRECTION | null>;
  price: Signal<number>;
  correct?: Signal<boolean>;
};

const guessState: Readonly<GuessState> = {
  guessId: signal(null),
  userId: signal(''),
  timestamp: signal(0),
  direction: signal(null),
  price: signal(0),
};

export const guess: ReadonlySignal<Readonly<GuessState>> = computed(
  () => guessState,
);

export const setActiveGuess = (
  guessId: string | null,
  userId: string,
  timestamp: number,
  direction: DIRECTION | null,
  price: number,
) => {
  guessState.guessId.value = guessId;
  guessState.userId.value = userId;
  guessState.timestamp.value = timestamp;
  guessState.direction.value = direction;
  guessState.price.value = price;
};

export const resetActiveGuess = () => {
  setActiveGuess(null, '', 0, null, 0);
};
