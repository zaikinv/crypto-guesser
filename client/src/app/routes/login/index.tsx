import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import { login } from '../../../services/user';
import logo from '../../../assets/logo.png';

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
        if (error instanceof Error) {
          setError(`Cannot login. Reason: ${error.message}`);
        } else {
          setError('Cannot login. Unknown error occurred.');
        }
      }
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
