import { login, logout } from './index';
import { createUser } from '../../api';
import { resetActiveGuess, setPrice, setScore, setUser } from '../../store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../api', () => ({
  createUser: vi.fn(),
}));

vi.mock('../../store', () => ({
  setUser: vi.fn(),
  setPrice: vi.fn(),
  setScore: vi.fn(),
  resetActiveGuess: vi.fn(),
}));

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('user service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login function', () => {
    it('should login the user and store userId and name in localStorage', async () => {
      const mockUserId = '123';
      const mockName = 'John Doe';
      // @ts-expect-error Cannot find namespace 'vi' glitch
      (createUser as vi.Mock).mockResolvedValue({
        userId: mockUserId,
        name: mockName,
      });

      await login(mockName);

      expect(createUser).toHaveBeenCalledWith(mockName);
      expect(setUser).toHaveBeenCalledWith(mockUserId, mockName);
      expect(localStorage.setItem).toHaveBeenCalledWith('userId', mockUserId);
      expect(localStorage.setItem).toHaveBeenCalledWith('name', mockName);
    });

    it('should handle errors if createUser fails', async () => {
      // @ts-expect-error Cannot find namespace 'vi' glitch
      (createUser as vi.Mock).mockRejectedValue(
        new Error('Create user failed'),
      );

      await expect(login('John Doe')).rejects.toThrow('Create user failed');

      expect(setUser).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('logout function', () => {
    it('should clear user state, reset guess, score, and price, and remove user info from localStorage', () => {
      localStorage.setItem('userId', '123');
      localStorage.setItem('name', 'John Doe');

      logout();

      expect(setUser).toHaveBeenCalledWith(null, null);
      expect(resetActiveGuess).toHaveBeenCalled();
      expect(setPrice).toHaveBeenCalledWith(0);
      expect(setScore).toHaveBeenCalledWith(0);
      expect(localStorage.removeItem).toHaveBeenCalledWith('userId');
      expect(localStorage.removeItem).toHaveBeenCalledWith('name');
    });
  });
});
