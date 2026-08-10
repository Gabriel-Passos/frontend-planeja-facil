import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // essencial: envia/recebe o cookie httpOnly do refresh token
});

// Access token vive só em memória — nunca em localStorage/sessionStorage
// (evita exposição a XSS). Se a página recarregar, ele se perde e
// precisa ser restaurado via /auth/refresh (isso é feito no AuthContext).
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let refreshQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null): void {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  refreshQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    const isUnauthorized = error.response?.status === 401;
    const isRefreshCall = originalRequest?.url?.includes('/auth/refresh');
    const alreadyRetried = originalRequest?._retry;

    if (!isUnauthorized || !originalRequest || isRefreshCall || alreadyRetried) {
      return Promise.reject(error);
    }

    // Se já tem um refresh em andamento, entra na fila em vez de
    // disparar outra chamada de refresh em paralelo.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.post<{ accessToken: string }>(
        '/auth/refresh',
      );

      setAccessToken(data.accessToken);
      processQueue(null, data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      setAccessToken(null);

      // Avisa o resto do app (AuthContext escuta esse evento) que a
      // sessão morreu de vez — refresh falhou, precisa logar de novo.
      window.dispatchEvent(new CustomEvent('auth:session-expired'));

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);