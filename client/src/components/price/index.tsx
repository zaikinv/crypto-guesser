import { FC, useEffect, useState } from 'react';
import { price as currentPrice, setPrice } from '../../store';
import { fetchPrice } from '../../api';
import { appConfig } from '../../config';
import { Error as ErrorModal } from '../error';
import './style.scss';

export const Price: FC = () => {
  const priceChangeTimeout = appConfig.priceChangeTimeout / 1000;
  const [timeLeft, setTimeLeft] = useState(priceChangeTimeout);
  const [error, setError] = useState<string | null>(null);

  const updatePrice = async () => {
    try {
      const price = await fetchPrice();
      setPrice(price);
      setTimeLeft(priceChangeTimeout);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Generic error: ${err}`);
    }
  };

  const formatPrice = (value: number | null) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: appConfig.currency,
      minimumFractionDigits: 2,
    }).format(value ?? 0);
  };

  useEffect(() => {
    updatePrice();

    // update price periodically
    const priceInterval = setInterval(() => {
      updatePrice();
    }, appConfig.priceChangeTimeout);

    // update countdown timer
    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <>
      <div className="price-container">
        <p className="price-container__label">Current BTC Price</p>
        <p className="price-container__price">
          {formatPrice(currentPrice.value.price.value)}
        </p>
        <p className="price-container__countdown">
          Next update in: {timeLeft} seconds
        </p>
      </div>
      {error && <ErrorModal message={error} />}
    </>
  );
};
