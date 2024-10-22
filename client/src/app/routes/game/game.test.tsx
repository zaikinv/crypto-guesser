import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Game } from './index.tsx';
import { submitGuess, checkGuess, getScore } from '../../../api';
import { DIRECTION, GuessValidationResult } from '../../../types';

vi.mock('js-confetti', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      addConfetti: vi.fn(),
    })),
  };
});

vi.mock('../../../store', () => ({
  price: {
    value: {
      price: {
        value: 100,
      },
    },
  },
  score: {
    value: {
      score: {
        value: 0,
      },
    },
  },
  setScore: vi.fn(),
  setPrice: vi.fn(),
  user: {
    value: { userId: { value: '123' }, userName: { value: 'John Doe' } },
  },
  setUser: vi.fn(),
  guess: {
    value: null,
  },
  setActiveGuess: vi.fn(),
  resetActiveGuess: vi.fn(),
}));

vi.mock('../../../config', () => ({
  appConfig: {
    apiBaseUrl: 'http://localhost:8080/api',
    priceChangeTimeout: 30000,
    guessTimeout: 1,
    currency: 'USD',
  },
}));

vi.mock('../../../api', () => ({
  submitGuess: vi.fn(),
  checkGuess: vi.fn(),
  getScore: vi.fn(),
  fetchPrice: vi.fn(),
}));

describe('Game', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Header, Gameplay, and Footer components', () => {
    render(
      <BrowserRouter>
        <Game />
      </BrowserRouter>,
    );
    expect(screen.getByTestId('header')).toBeTruthy();
    expect(screen.getByTestId('footer')).toBeTruthy();
  });

  it('handles making a guess', async () => {
    const mockGuessId = 'guess123';
    // @ts-expect-error Cannot find namespace 'vi' glitch
    (submitGuess as vi.Mock).mockResolvedValue({ guessId: mockGuessId });

    render(
      <BrowserRouter>
        <Game />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByTestId('guess-up'));

    await waitFor(() =>
      expect(submitGuess).toHaveBeenCalledWith(DIRECTION.UP, 100),
    );
    await waitFor(() => expect(screen.getByTestId('timer')).toBeTruthy());
  });

  it('handles timer completion and shows result', async () => {
    const mockValidationResult: GuessValidationResult = {
      currentPrice: 105,
      guessPrice: 100,
      direction: DIRECTION.UP,
      isCorrectGuess: true,
    };
    // @ts-expect-error Cannot find namespace 'vi' glitch
    (checkGuess as vi.Mock).mockResolvedValue(mockValidationResult);
    // @ts-expect-error Cannot find namespace 'vi' glitch
    (getScore as vi.Mock).mockResolvedValue(10);

    render(
      <BrowserRouter>
        <Game />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByTestId('guess-up'));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await waitFor(() => expect(checkGuess).toHaveBeenCalledWith('guess123'));
    await waitFor(() =>
      expect(screen.getByTestId('guess-result')).toBeTruthy(),
    );
  });

  it('closes result', async () => {
    render(
      <BrowserRouter>
        <Game />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByTestId('guess-up'));

    await new Promise((resolve) => setTimeout(resolve, 2000));

    fireEvent.click(screen.getByTestId('close-result'));

    await waitFor(
      () => expect(screen.queryByTestId('guess-result')).to.be.null,
    );
  });
});
