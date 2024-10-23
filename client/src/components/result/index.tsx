import { FC, useEffect } from 'react';
import JSConfetti from 'js-confetti';
import type { GuessValidationResult } from '../../types';
import './style.scss';

interface ResultProps {
  result: GuessValidationResult;
  onClose: () => void;
}

export const Result: FC<ResultProps> = ({ result, onClose }) => {
  const priceIncreased = result.currentPrice > result.guessPrice;
  const priceDecreased = result.currentPrice < result.guessPrice;
  const priceUnchanged = result.currentPrice === result.guessPrice;
  const correctnessClass = result.isCorrectGuess ? 'correct' : 'incorrect';
  const priceChangeIndicator = priceIncreased ? '▲' : priceDecreased ? '▼' : '';

  useEffect(() => {
    if (result.isCorrectGuess) {
      // some fancy confetti :-)
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        emojis: ['🪙'],
      });
    }
  }, [result.isCorrectGuess]);

  return (
    <div className="result-container" data-testid="guess-result">
      <div className="result-content">
        <h2 className="result-guess">
          {priceUnchanged ? (
            <span>The price didn't change.</span>
          ) : (
            <>
              Your guess was
              <span className={`result ${correctnessClass}`}>
                {result.isCorrectGuess ? ' correct!' : ' incorrect.'}
              </span>
            </>
          )}
        </h2>
        <p className="result-price">
          <span>{result.guessPrice}</span> → <span>{result.currentPrice}</span>{' '}
          {priceUnchanged ? null : <span>{priceChangeIndicator}</span>}
        </p>
        <button
          className="result-button"
          onClick={onClose}
          data-testid="close-result"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
