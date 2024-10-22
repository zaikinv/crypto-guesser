import { user, score as activeScore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/user';
import logo from '../../assets/logo.png';
import './style.scss';

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header" data-testid="header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="header-logo" />{' '}
      </div>
      <div className="header-right">
        <p>
          Welcome, <span className="strong">{user.value.userName.value}</span>!
        </p>
        <p>
          Score:{' '}
          <span className="strong" data-testid="user-score">
            {activeScore.value.score.value}
          </span>
        </p>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="header-right--mobile">
        <span className="score--mobile">{activeScore.value.score.value}</span>
        <button className="logout-button" onClick={handleLogout}>
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 16L21 12M21 12L17 8M21 12L7 12M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};
