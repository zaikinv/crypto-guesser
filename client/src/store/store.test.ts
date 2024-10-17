import { describe, it, expect, beforeEach } from 'vitest';
import {
  userId,
  userName,
  price,
  score,
  activeGuess,
  setUserId,
  setUserName,
  setScore,
  setCurrentPrice,
  setActiveGuess,
} from './index';
import { ActiveGuess, DIRECTION } from '../types';

describe('User Store', () => {
  beforeEach(() => {
    setUserId(null);
    setUserName(null);
    setScore(0);
    setCurrentPrice(0);
    setActiveGuess(null);
  });

  it('should initialize with default values', () => {
    expect(userId.value).toBe(null);
    expect(userName.value).toBe(null);
    expect(score.value).toBe(0);
    expect(price.value).toBe(0);
    expect(activeGuess.value).toBe(null);
  });

  it('should set userId correctly', () => {
    setUserId('12345');
    expect(userId.value).toBe('12345');
  });

  it('should set userName correctly', () => {
    setUserName('John Doe');
    expect(userName.value).toBe('John Doe');
  });

  it('should set score correctly', () => {
    setScore(10);
    expect(score.value).toBe(10);
  });

  it('should set current price correctly', () => {
    setCurrentPrice(100);
    expect(price.value).toBe(100);
  });

  it('should set active guess correctly', () => {
    const mockGuess: ActiveGuess = {
      guessId: 'abc123',
      userId: 'user123',
      timestamp: Date.now(),
      direction: DIRECTION.UP,
      price: 5000,
    };
    setActiveGuess(mockGuess);
    expect(activeGuess.value).toEqual(mockGuess);
  });

  it('should reset active guess correctly', () => {
    setActiveGuess(null);
    expect(activeGuess.value).toBe(null);
  });
});
