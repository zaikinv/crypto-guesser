import { FC } from 'react';
import './style.scss';
import { DIRECTION } from '../../types';

interface ControlProps {
  handleGuess: (guess: DIRECTION) => void;
}

export const Controls: FC<ControlProps> = ({ handleGuess }) => {
  return (
    <div className="controls-container">
      <button
        data-testid="guess-up"
        className="guess-button guess-up"
        onClick={() => handleGuess(DIRECTION.UP)}
      >
        ▲
      </button>
      <button
        data-testid="guess-down"
        className="guess-button guess-down"
        onClick={() => handleGuess(DIRECTION.DOWN)}
      >
        ▼
      </button>
    </div>
  );
};