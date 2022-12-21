import React, { useContext, useEffect, useState } from 'react';
import { LoginForm } from './components/login-form';
import { Context } from './index';
import { observer } from 'mobx-react-lite';
import { UserService } from './services';
import { IUser } from './interfaces/user.interface';


function App(): JSX.Element {
  const { store } = useContext(Context);

  const [users, setUsers] = useState<Array<IUser>>([]);

  async function getUsers() {
    try {
      const response = await UserService.getAllUsers();
      setUsers(response.data);
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, []);

  if (store.isLoading) {
    return (
      <div>Lading...</div>
    );
  }

  if (!store.isAuth) {
    return (
      <div>
        <h1>You are not authorized</h1>
        <LoginForm />
        <div>
          <button onClick={getUsers}>Get users</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>{`User ${store.user?.email} is authorized`}</h1>
      <h1>{store.user?.isActivated ? 'Account is approved' : 'Approve your account by email'}</h1>
      <button onClick={() => store.logout()}>Logout</button>
      <div>
        <button onClick={getUsers}>Get users</button>
      </div>
      <ul>
        {
          users.map(u => <li key={u.id}>{u.email}</li>)
        }
      </ul>
    </div>
  );
}

export default observer(App);
