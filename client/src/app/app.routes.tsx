import { createBrowserRouter } from 'react-router';
import Register from '../features/auth/pages/Register';
import ProtectedRoute from '../features/shared/components/ProtectedRoute';
import Login from '../features/auth/pages/Login';

const router = createBrowserRouter([
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <h1>Home</h1>
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

export default router;
