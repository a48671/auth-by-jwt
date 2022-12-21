import { IUser } from '../interfaces/user.interface';
import { makeAutoObservable } from 'mobx';
import { AuthService } from '../services';
import axios, { AxiosResponse } from 'axios';
import { API_ENDPOINT } from '../http';

export class Store {
  user?: IUser;
  isAuth: boolean = false;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable<Store>(this);
  }

  setIsAuth(isAuth: boolean): void {
    this.isAuth = isAuth;
  }

  setIsLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  setUser(user?: IUser): void {
    this.user = user;
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await AuthService.login(email, password);
      console.log({ response });
      localStorage.setItem('token', response.data.accessToken);

      this.setIsAuth(true);

      this.setUser(response.data.user);
    } catch (e) {
      console.error(e);
    }
  }

  async registration(email: string, password: string): Promise<void> {
    try {
      const response = await AuthService.registration(email, password);
      console.log({ response });
      localStorage.setItem('token', response.data.accessToken);

      this.setIsAuth(true);

      this.setUser(response.data.user);
    } catch (e) {
      console.error(e);
    }
  }

  async logout(): Promise<void> {
    try {
      await AuthService.logout();

      localStorage.removeItem('token');

      this.setIsAuth(false);

      this.setUser(undefined);
    } catch (e) {
      console.error(e);
    }
  }

  async checkAuth(): Promise<void> {
    try {
      this.setIsLoading(true);
      const response = await axios.get(`${API_ENDPOINT}/refresh`, { withCredentials: true })
      console.log({ response });
      localStorage.setItem('token', response.data.accessToken);

      this.setIsAuth(true);

      this.setUser(response.data.user);
    } catch (e) {
      console.error(e);
    } finally {
      this.setIsLoading(false);
    }
  }
}
