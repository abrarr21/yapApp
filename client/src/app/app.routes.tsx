import { createBrowserRouter } from 'react-router';
import Register from '../features/auth/pages/Register';

const router = createBrowserRouter([
  {
    path: '/register',
    element: <Register />,
  },
]);

export default router;
