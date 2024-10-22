import {
  signal,
  computed,
  ReadonlySignal,
  Signal,
} from '@preact/signals-react';

type ScoreState = {
  score: Signal<number>;
};

const scoreState: Readonly<ScoreState> = {
  score: signal(0),
};

export const score: ReadonlySignal<Readonly<ScoreState>> = computed(
  () => scoreState,
);

export const setScore = (currentScore: number) => {
  scoreState.score.value = currentScore;
};
