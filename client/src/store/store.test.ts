import { describe, it, expect, beforeEach } from 'vitest';
import {
  user,
  score,
  price,
  guess,
  setUser,
  setPrice,
  setScore,
  setActiveGuess,
} from './index';
import { DIRECTION } from '../types';

describe('Store', () => {
  describe('User State', () => {
    beforeEach(() => {
      setUser(null, null);
    });

    it('should initialize with default values', () => {
      expect(user.value.userId.value).toBe(null);
      expect(user.value.userName.value).toBe(null);
    });

    it('should set userId and userName correctly', () => {
      setUser('12345', 'John Doe');
      expect(user.value.userId.value).toBe('12345');
      expect(user.value.userName.value).toBe('John Doe');
    });
  });

  describe('Score State', () => {
    beforeEach(() => {
      setScore(0);
    });

    it('should initialize with default value', () => {
      expect(score.value.score.value).toBe(0);
    });

    it('should set score correctly', () => {
      setScore(10);
      expect(score.value.score.value).toBe(10);
    });
  });

  describe('Price State', () => {
    beforeEach(() => {
      setPrice(0);
    });

    it('should initialize with default value', () => {
      expect(price.value.price.value).toBe(0);
    });

    it('should set current price correctly', () => {
      setPrice(100);
      expect(price.value.price.value).toBe(100);
    });
  });

  describe('Guess State', () => {
    beforeEach(() => {
      setActiveGuess('', '', 0, null, 0);
    });

    it('should initialize with default values', () => {
      expect(guess.value.guessId.value).toBe('');
      expect(guess.value.userId.value).toBe('');
      expect(guess.value.timestamp.value).toBe(0);
      expect(guess.value.direction.value).toBe(null);
      expect(guess.value.price.value).toBe(0);
    });

    it('should set active guess correctly', () => {
      setActiveGuess('abc123', 'user123', Date.now(), DIRECTION.UP, 5000);
      expect(guess.value.guessId.value).toBe('abc123');
      expect(guess.value.userId.value).toBe('user123');
      expect(guess.value.direction.value).toBe(DIRECTION.UP);
      expect(guess.value.price.value).toBe(5000);
    });

    it('should reset active guess correctly', () => {
      setActiveGuess('', '', 0, null, 0);
      expect(guess.value.guessId.value).toBe('');
      expect(guess.value.userId.value).toBe('');
      expect(guess.value.timestamp.value).toBe(0);
      expect(guess.value.direction.value).toBe(null);
      expect(guess.value.price.value).toBe(0);
    });
  });
});
