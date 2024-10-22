import { FC, MouseEvent, useState } from 'react';
import { Rules } from '../rules';
import './style.scss';

export const Footer: FC = () => {
  const [showRules, setShowRules] = useState(false);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowRules(true);
  };

  return (
    <div className="footer" data-testid="footer">
      {showRules && <Rules onContinue={() => setShowRules(false)} />}
      <div className="footer-left">
        <a data-testid="show-rules" href="/rules" onClick={handleClick}>
          Rules
        </a>
      </div>
      <div className="footer-right">
        <span>Crypto price by </span>
        <a
          href="https://developers.binance.com/docs/binance-spot-api-docs/rest-api"
          target="_blank"
          rel="noopener noreferrer"
        >
          Binance
        </a>
      </div>
    </div>
  );
};
