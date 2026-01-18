
import { User } from '../types';

const STORAGE_KEY = 'stratum_persistence_layer';

export const userStore = {
  saveProfile: (user: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },
  
  getProfile: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
