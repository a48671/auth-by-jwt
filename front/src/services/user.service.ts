import { AxiosResponse } from 'axios';
import { IUser } from '../interfaces/user.interface';
import { transport } from '../http';

export class UserService {
  static getAllUsers(): Promise<AxiosResponse<Array<IUser>>> {
    return transport.get('users');
  }
}
