import { FC } from 'react';
import './style.scss';

interface ErrorProps {
  message?: string;
}

export const Error: FC<ErrorProps> = ({
  message = 'An unexpected error occurred. Please try again later.',
}) => {
  const handleClick = () => {
    window.location.reload();
  };

  return (
    <div className="modal-overlay">
      <div className="error-container">
        <b>Ooops, something went wrong :(</b>
        <p>{message}</p>
        <button className="reload-button" onClick={handleClick}>
          Reload the page
        </button>
      </div>
    </div>
  );
};
