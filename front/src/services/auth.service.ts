import { AxiosResponse } from 'axios';
import { transport } from '../http';
import { IAuthResponse } from '../interfaces/response/auth-response.interface';

export class AuthService {
  static login(email: string, password: string): Promise<AxiosResponse<IAuthResponse>> {
    return transport.post('/login', { email, password });
  }
  static registration(email: string, password: string): Promise<AxiosResponse<IAuthResponse>> {
    return transport.post('/registration', { email, password });
  }
  static logout(): Promise<AxiosResponse<void>> {
    return transport.post('/logout');
  }
}
