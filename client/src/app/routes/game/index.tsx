import { FC, useEffect, useState, useCallback } from 'react';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { Gameplay } from '../../../components/gameplay';
import { Error as ErrorModal } from '../../../components/error';
import {
  guess as activeGuess,
  price as currentPrice,
  resetActiveGuess,
  setScore,
} from '../../../store';
import { DIRECTION, GuessValidationResult } from '../../../types';
import { submitGuess, checkGuess, getScore } from '../../../api';

import './style.scss';

export const Game: FC = () => {
  const [guessId, setGuessId] = useState('');
  const [showTimer, setShowTimer] = useState(false);
  const [result, setResult] = useState<GuessValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const activeGuessId = activeGuess?.value?.guessId?.value;
    if (activeGuessId) {
      setGuessId(activeGuessId);
      setShowTimer(true);
    }
  }, []);

  const updateScore = useCallback(async () => {
    try {
      const score = await getScore();
      setScore(score);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Generic error: ${err}`);
    }
  }, []);

  const handleMakeGuess = useCallback(async (guess: DIRECTION) => {
    try {
      const { guessId } = await submitGuess(
        guess,
        currentPrice.value.price.value!,
      );
      setGuessId(guessId);
      setShowTimer(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Generic error: ${err}`);
    }
  }, []);

  const handleTimerComplete = useCallback(async () => {
    try {
      const validationResult = await checkGuess(guessId);
      setResult(validationResult);
      resetActiveGuess();
      setShowTimer(false);
      await updateScore();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Generic error: ${err}`);
    }
  }, [guessId, updateScore]);

  const handleCloseResult = () => setResult(null);

  return (
    <div className="container">
      <Header />
      <div className="content">
        {error ? (
          <ErrorModal message={error} />
        ) : (
          <Gameplay
            result={result}
            showTimer={showTimer}
            handleMakeGuess={handleMakeGuess}
            handleTimerComplete={handleTimerComplete}
            handleCloseResult={handleCloseResult}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};
