import { FC, useEffect, useState } from 'react';
import { price, setCurrentPrice } from '../../store';
import { fetchPrice } from '../../api';
import { appConfig } from '../../config';
import './style.scss';

export const Price: FC = () => {
  const [timeLeft, setTimeLeft] = useState(appConfig.priceChangeTimeout / 1000);

  const updatePrice = async () => {
    try {
      const currentPrice = await fetchPrice();
      setCurrentPrice(currentPrice);
      setTimeLeft(appConfig.priceChangeTimeout / 1000);
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  const formatPrice = (value: number | null) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value ?? 0);
  };

  useEffect(() => {
    updatePrice();
    const priceInterval = setInterval(() => {
      updatePrice();
    }, appConfig.priceChangeTimeout);

    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <div className="price-container">
      <p className="price-container__label">Current BTC Price</p>
      <p className="price-container__price">{formatPrice(price.value)}</p>
      <p className="price-container__countdown">
        Next update in: {timeLeft} seconds
      </p>
    </div>
  );
};
