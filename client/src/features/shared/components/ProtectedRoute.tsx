import { Navigate } from 'react-router';
import { useAppSelector } from '../../../app/hook';
import type { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAppSelector((state) => state.auth);

  console.log('Protected user ->', user);

  if (loading) {
    return <h1>Loading....</h1>;
  }

  if (!user) {
    return <Navigate to={'/login'} />;
  }

  return children;
};

export default ProtectedRoute;
