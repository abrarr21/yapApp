import { Provider } from 'react-redux';
import { store } from './app.store';
import { RouterProvider } from 'react-router';
import router from './app.routes';

const App = () => {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
};

export default App;
