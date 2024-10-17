import {
  GuessValidationResult,
  GetScoreResponse,
  DIRECTION,
  SubmitGuessResponse,
  CreateUserResponse,
  ActiveGuess,
} from '../types';
import { appConfig } from '../config';

const isProduction = process.env.NODE_ENV === 'production';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

const getUserId = (): string | null => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('User ID not found in local storage');
  }
  return userId;
};

const getApiKey = (): string | null => {
  if (isProduction) {
    const apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
      throw new Error('API key not found in local storage');
    }
    return apiKey;
  }
  return 'dummy';
};

export const submitGuess = async (
  direction: DIRECTION,
  price: number,
): Promise<SubmitGuessResponse> => {
  const userId = getUserId();
  const apiKey = getApiKey();

  const response = await fetch(`${appConfig.apiBaseUrl}/guess/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey!,
    },
    body: JSON.stringify({ userId, direction, price }),
  });

  return handleResponse(response);
};

export const checkGuess = async (
  guessId: string,
): Promise<GuessValidationResult> => {
  const apiKey = getApiKey();

  const response = await fetch(
    `${appConfig.apiBaseUrl}/guess/validate/${guessId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey!,
      },
    },
  );

  return handleResponse(response);
};

export const getScore = async (): Promise<number> => {
  const userId = getUserId();
  const apiKey = getApiKey();

  const response = await fetch(
    `${appConfig.apiBaseUrl}/users/${userId}/score`,
    {
      method: 'GET',
      headers: {
        'x-api-key': apiKey!,
      },
    },
  );

  const result: GetScoreResponse = await handleResponse(response);
  return result.score;
};

export const createUser = async (name: string): Promise<CreateUserResponse> => {
  const apiKey = getApiKey();

  const response = await fetch(`${appConfig.apiBaseUrl}/users/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey!,
    },
    body: JSON.stringify({ name }),
  });

  return handleResponse(response);
};

export const fetchPrice = async (): Promise<number> => {
  const apiKey = getApiKey();

  const response = await fetch(`${appConfig.apiBaseUrl}/price/current`, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey!,
    },
  });

  const result = await handleResponse(response);
  return result.price;
};

export const getActiveGuess = async (): Promise<ActiveGuess | null> => {
  const userId = getUserId();
  const apiKey = getApiKey();

  const response = await fetch(
    `${appConfig.apiBaseUrl}/guess/active/${userId}`,
    {
      method: 'GET',
      headers: {
        'x-api-key': apiKey!,
      },
    },
  );

  return handleResponse(response);
};
