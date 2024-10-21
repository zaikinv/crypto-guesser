import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import { setScore, setUserId, setUserName, setActiveGuess } from '../store';
import { getScore, getActiveGuess } from '../api';
import { Error } from '../components/error';

const isLocalEnv = process.env.NODE_ENV !== 'production';

export const App = () => {
  // @ts-ignore
  const router = createBrowserRouter([
    {
      path: '/',
      loader: () => {
        const apiKey = localStorage.getItem('apiKey');
        return apiKey ? redirect('/game') : redirect('/login');
      },
      errorElement: <Error />,
    },
    {
      path: '/login',
      loader: ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        if (token) {
          localStorage.setItem('apiKey', token);
          const newUrl = `${url.pathname}`;
          window.history.replaceState({}, '', newUrl);
        }

        return null;
      },
      lazy: async () => {
        const { Login } = await import('./routes/login');
        return { Component: Login };
      },
      errorElement: <Error />,
    },
    {
      path: '/game',
      loader: async () => {
        const apiKey = localStorage.getItem('apiKey');
        if (apiKey || isLocalEnv) {
          const userId = localStorage.getItem('userId');
          const name = localStorage.getItem('name');
          if (userId) {
            const score = await getScore();
            setScore(score);

            const activeGuess = await getActiveGuess();
            setActiveGuess(activeGuess);

            setUserId(userId);
            setUserName(name);

            return null;
          }
        }
        return redirect('/login');
      },
      lazy: async () => {
        const { Game } = await import('./routes/game');
        return { Component: Game };
      },
      errorElement: <Error />,
    },
    {
      path: '*',
      loader: () => redirect('/'),
      errorElement: <Error />,
    },
  ]);

  return <RouterProvider router={router} />;
};
