import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IAuthResponse } from '../interfaces/response/auth-response.interface';

export const API_ENDPOINT = 'http://localhost:5000/api';

export const transport = axios.create({
  withCredentials: true,
  baseURL: API_ENDPOINT
});

transport.interceptors.request.use(function (config: AxiosRequestConfig): AxiosRequestConfig {
  if (!config.headers) {
    config.headers = {};
  }

  config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

  return config;
});

transport.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;
    if (error.response.status === 401 && originalConfig && !originalConfig._isRetry) {
      try {
        originalConfig._isRetry = true;

        const response = await axios.get<IAuthResponse, AxiosResponse<IAuthResponse>>(
          `${API_ENDPOINT}/refresh`,
          { withCredentials: true }
        );

        localStorage.setItem('token', response.data.accessToken);

        return transport.request(originalConfig);
      } catch (e) {
        throw Error('User is not authorized');
      }

    }

    throw error;
  }
);
