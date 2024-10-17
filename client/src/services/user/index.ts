import { createUser } from '../../api';
import { setUserId, setUserName } from '../../store';

export const login = async (userName: string) => {
  const { userId, name } = await createUser(userName);
  setUserId(userId);
  setUserName(name);
  localStorage.setItem('userId', userId);
  localStorage.setItem('name', name);
};

export const logout = () => {
  setUserId(null);
  setUserName(null);
  localStorage.removeItem('userId');
  localStorage.removeItem('name');
};
