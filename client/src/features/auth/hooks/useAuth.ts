import { useAppDispatch } from '../../../app/hook';
import { loginUser, registerUser } from '../service/auth.api';
import { setAccessToken, setUser } from '../state/auth.slice';

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
    dispatch(setAccessToken(data.AccessToken));
  };

  const login = async ({ email, password }: { email: string; password: string }) => {
    const data = await loginUser({ email, password });
    dispatch(setUser(data));
    dispatch(setAccessToken(data.AccessToken));
  };

  return { register, login };
};

export default useAuth;
