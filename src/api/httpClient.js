import axios from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export function clearStoredSession() {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('tokenType');
  sessionStorage.removeItem('expiresAt');
  sessionStorage.removeItem('usuarioSesion');
}

httpClient.interceptors.request.use((config) => {
  const isLoginRequest = config.url?.replace(/\/+$/, '').endsWith('/auth/login');
  const token = sessionStorage.getItem('accessToken');

  if (token && !isLoginRequest) {
    config.headers.Authorization = `${sessionStorage.getItem('tokenType') || 'Bearer'} ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredSession();
      window.dispatchEvent(new Event('auth:session-expired'));
    }

    return Promise.reject(error);
  }
);
