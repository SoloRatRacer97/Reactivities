import { User, UserFormValues } from '../models/user';
import { makeAutoObservable } from 'mobx';

export default class UserStore {
      user: User | null = null;

      constructor() {
            makeAutoObservable(this)
      }

      get isLoggedIn() {
            return !!this.user;
      }

      login = async (creds: UserFormValues) => {
            
      }
}