import { FC, useEffect, useState } from 'react';
import { appConfig } from '../../config';
import { guess } from '../../store';
import './style.scss';

interface TimerProps {
  onComplete: () => void;
}

export const Timer: FC<TimerProps> = ({ onComplete }) => {
  const totalTime = appConfig.guessTimeout;
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    const currentTime = Date.now();

    // initial time left is either the remaining time from the last guess or the total time
    const initialTimeLeft = guess?.value?.timestamp.value
      ? Math.max(
          appConfig.guessTimeout -
            Math.floor((currentTime - guess.value.timestamp.value) / 1000),
          0,
        )
      : appConfig.guessTimeout;

    setTimeLeft(initialTimeLeft);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    // one second timer
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  const progress = (timeLeft / totalTime) * 100;

  return (
    <div className="timer-container" data-testid="timer">
      <div className="timer">
        <div className="progress-border">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="label">Time left: {timeLeft}s</p>
      </div>
    </div>
  );
};
