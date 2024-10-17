import { FC } from 'react';
import { Price } from '../price';
import { Controls } from '../controls';
import { Timer } from '../timer';
import { Result } from '../result';
import { DIRECTION, GuessValidationResult } from '../../types';

interface GameplayProps {
  result: GuessValidationResult | null;
  showTimer: boolean;
  handleMakeGuess: (guess: DIRECTION) => Promise<void>;
  handleTimerComplete: () => Promise<void>;
  handleCloseResult: () => void;
}

export const Gameplay: FC<GameplayProps> = ({
  result,
  showTimer,
  handleMakeGuess,
  handleTimerComplete,
  handleCloseResult,
}) => {
  if (result) {
    return <Result result={result} onClose={handleCloseResult} />;
  }

  if (showTimer) {
    return <Timer onComplete={handleTimerComplete} />;
  }

  return (
    <>
      <Price />
      <Controls handleGuess={handleMakeGuess} />
    </>
  );
};
