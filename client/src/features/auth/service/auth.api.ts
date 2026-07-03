import { store } from '../../../app/app.store';
import globalApi from '../../shared/global.api';

const authApi = globalApi.create({
  baseURL: '/api/auth',
});

authApi.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;

    console.log('Access Token from store:', accessToken);

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await authApi.post('/refresh-token');
        const newAccessToken = refreshResponse.data.data;

        store.dispatch({ type: 'auth/setAccessToken', payload: newAccessToken });

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

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

export const getCurrentUser = async () => {
  const response = await authApi.get('/current-user');
  return response.data.data;
};
