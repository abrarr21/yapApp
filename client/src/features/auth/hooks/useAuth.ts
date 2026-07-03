import { useAppDispatch } from '../../../app/hook';
import { getCurrentUser, loginUser, registerUser } from '../service/auth.api';
import { setAccessToken, setLoading, setUser } from '../state/auth.slice';

const useAuth = () => {
  const dispatch = useAppDispatch();

  const register = async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    const data = await registerUser({ username, email, password });
    dispatch(setUser(data));
    dispatch(setAccessToken(data.accessToken));
  };

  const login = async ({ email, password }: { email: string; password: string }) => {
    const data = await loginUser({ email, password });
    dispatch(setUser(data));
    dispatch(setAccessToken(data.accessToken));
  };

  const handleGetCurrentUser = async () => {
    try {
      const data = await getCurrentUser();
      console.log('current user data -> ', data);
      dispatch(setUser(data));
    } catch (error) {
      console.log(`Error fetching current user:  ${error}`);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { register, login, handleGetCurrentUser };
};

export default useAuth;
