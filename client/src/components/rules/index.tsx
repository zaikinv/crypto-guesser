import { FC } from 'react';
import './style.scss';

interface RulesProps {
  onContinue: () => void;
}

export const Rules: FC<RulesProps> = ({ onContinue }) => {
  return (
    <div className="modal-overlay" data-testid="game-rules">
      <div className="rules-container">
        <h3>Game Rules</h3>
        <ul>
          <li>You can choose to enter a guess of either "up" or "down."</li>
          <li>
            After a guess is entered, you cannot make new guesses until the
            existing guess is resolved.
          </li>
          <li>The guess is resolved in 60 seconds</li>
          <li>
            If the guess is correct, you get 1 point added. If the guess is
            incorrect, you lose 1 point.
          </li>
          <li>One guess at a time.</li>
          <li>Start with a score of 0.</li>
        </ul>
        <button className="continue-button" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};
