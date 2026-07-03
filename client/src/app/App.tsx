import { Provider } from 'react-redux';
import { store } from './app.store';
import { RouterProvider } from 'react-router';
import router from './app.routes';
import useAuth from '../features/auth/hooks/useAuth';
import { useEffect } from 'react';

function Main() {
  const { handleGetCurrentUser } = useAuth();

  useEffect(() => {
    handleGetCurrentUser();
  }, []);

  return <RouterProvider router={router} />;
}

const App = () => {
  return (
    <>
      <Provider store={store}>
        <Main />
      </Provider>
    </>
  );
};

export default App;
