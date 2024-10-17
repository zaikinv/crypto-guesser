import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Login } from './index';
import { login } from '../../../services/user';

vi.mock('../../../services/user', () => ({
  login: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Login', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders login form and input field', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(screen.getByPlaceholderText('Enter your name')).toBeTruthy();
    expect(screen.getByRole('button', { name: /start game/i })).toBeTruthy();
  });

  it('calls login function with trimmed name on submit', async () => {
    const mockNavigate = vi.fn();
    // @ts-expect-error Cannot find namespace 'vi' glitch
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);
    // @ts-expect-error Cannot find namespace 'vi' glitch
    (login as vi.Mock).mockResolvedValue({});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: '  John  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /start game/i }));

    await waitFor(() => expect(login).toHaveBeenCalledWith('John'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/game'));
  });

  it('shows error message if login fails', async () => {
    const errorMessage = 'Network error';
    // @ts-expect-error Cannot find namespace 'vi' glitch
    (login as vi.Mock).mockRejectedValue(new Error(errorMessage));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: 'John' },
    });
    fireEvent.click(screen.getByRole('button', { name: /start game/i }));

    await waitFor(() => expect(login).toHaveBeenCalledWith('John'));
    await waitFor(() =>
      expect(
        screen.getByText(`Cannot login. Reason: ${errorMessage}`),
      ).toBeTruthy(),
    );
  });

  it('does not call login if name is empty or only spaces', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: '   ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /start game/i }));

    expect(login).not.toHaveBeenCalled();
  });
});
