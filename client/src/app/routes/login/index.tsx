import { KeyboardEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../services/user';
import logo from '../../../assets/logo.png';
import './style.scss';

export const Login = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const trimmedName = name.trim();
    if (trimmedName) {
      try {
        await login(trimmedName);
        navigate('/game');
      } catch (error: unknown) {
        setError(
          error instanceof Error
            ? `Cannot login. Reason: ${error.message}`
            : 'Cannot login. Unknown error occurred.',
        );
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="login-logo" />
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="login-input"
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleLogin} className="login-button">
          Start Game
        </button>
      </div>
    </div>
  );
};
