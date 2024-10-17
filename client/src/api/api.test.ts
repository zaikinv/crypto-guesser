import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  submitGuess,
  checkGuess,
  getScore,
  createUser,
  fetchPrice,
  getActiveGuess,
} from './index';
import {
  DIRECTION,
  SubmitGuessResponse,
  GuessValidationResult,
  CreateUserResponse,
  ActiveGuess,
} from '../types';
import { appConfig } from '../config';

const mockFetch = vi.spyOn(global, 'fetch');
const mockGetItem = vi.spyOn(Storage.prototype, 'getItem');

describe('API Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetItem.mockReturnValue('dummy-user-id');
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    } as unknown as Response);
  });

  it('should submit a guess successfully', async () => {
    const mockResponse: SubmitGuessResponse = {
      message: 'Success',
      guessId: 'guess123',
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as Response);

    const response = await submitGuess(DIRECTION.UP, 5000);

    expect(mockFetch).toHaveBeenCalledWith(
      `${appConfig.apiBaseUrl}/guess/submit`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          userId: 'dummy-user-id',
          direction: DIRECTION.UP,
          price: 5000,
        }),
      }),
    );
    expect(response).toEqual(mockResponse);
  });

  it('should throw an error if submitGuess fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    } as unknown as Response);

    await expect(submitGuess(DIRECTION.DOWN, 4000)).rejects.toThrow(
      'Error: 400 Bad Request',
    );
  });

  it('should check a guess validation successfully', async () => {
    const mockValidationResult: GuessValidationResult = {
      currentPrice: 5100,
      guessPrice: 5000,
      direction: DIRECTION.UP,
      isCorrectGuess: true,
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockValidationResult),
    } as unknown as Response);

    const response = await checkGuess('guess123');

    expect(mockFetch).toHaveBeenCalledWith(
      `${appConfig.apiBaseUrl}/guess/validate/guess123`,
      expect.objectContaining({
        method: 'PATCH',
      }),
    );
    expect(response).toEqual(mockValidationResult);
  });

  it('should get user score successfully', async () => {
    const mockScoreResponse = { score: 42 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockScoreResponse),
    } as unknown as Response);

    const score = await getScore();

    expect(mockFetch).toHaveBeenCalledWith(
      `${appConfig.apiBaseUrl}/users/dummy-user-id/score`,
      expect.objectContaining({
        method: 'GET',
      }),
    );
    expect(score).toBe(42);
  });

  it('should create a user successfully', async () => {
    const mockCreateUserResponse: CreateUserResponse = {
      userId: 'user123',
      name: 'John Doe',
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockCreateUserResponse),
    } as unknown as Response);

    const response = await createUser('John Doe');

    expect(mockFetch).toHaveBeenCalledWith(
      `${appConfig.apiBaseUrl}/users/create`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'John Doe' }),
      }),
    );
    expect(response).toEqual(mockCreateUserResponse);
  });

  it('should fetch current price successfully', async () => {
    const mockPriceResponse = { price: 10000 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockPriceResponse),
    } as unknown as Response);

    const price = await fetchPrice();

    expect(mockFetch).toHaveBeenCalledWith(
      `${appConfig.apiBaseUrl}/price/current`,
      expect.objectContaining({
        method: 'GET',
      }),
    );
    expect(price).toBe(10000);
  });

  it('should get active guess successfully', async () => {
    const mockActiveGuess: ActiveGuess = {
      guessId: 'guess123',
      userId: 'dummy-user-id',
      timestamp: Date.now(),
      direction: DIRECTION.UP,
      price: 5000,
      correct: true,
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockActiveGuess),
    } as unknown as Response);

    const response = await getActiveGuess();

    expect(mockFetch).toHaveBeenCalledWith(
      `${appConfig.apiBaseUrl}/guess/active/dummy-user-id`,
      expect.objectContaining({
        method: 'GET',
      }),
    );
    expect(response).toEqual(mockActiveGuess);
  });
});
