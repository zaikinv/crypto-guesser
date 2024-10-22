import { createUser } from '../../api';
import { resetActiveGuess, setPrice, setScore, setUser } from '../../store';

export const login = async (userName: string) => {
  const { userId, name } = await createUser(userName);
  setUser(userId, name);
  localStorage.setItem('userId', userId);
  localStorage.setItem('name', name);
};

export const logout = () => {
  setUser(null, null);
  resetActiveGuess();
  setPrice(0);
  setScore(0);
  localStorage.removeItem('userId');
  localStorage.removeItem('name');
};
