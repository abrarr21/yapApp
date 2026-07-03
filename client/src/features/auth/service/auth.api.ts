import globalApi from '../../shared/global.api';

const authApi = globalApi.create({
  baseURL: '/api/auth',
});

export const registerUser = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await authApi.post('/register', { username, email, password });
  return response.data.data;
};

export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  const response = await authApi.post('/login', { email, password });
  return response.data.data;
};
