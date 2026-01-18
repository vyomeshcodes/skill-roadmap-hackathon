
import { User, DomainType } from '../types';

// Mocking a backend with localStorage persistence
const USERS_KEY = 'stratum_users';
const CURRENT_USER_KEY = 'stratum_session';

const getStoredUsers = (): any[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const authService = {
  signup: async (name: string, email: string, password: string, sector: DomainType): Promise<User> => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    
    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      sector,
      skills: [],
      roadmaps: [],
      createdAt: new Date().toISOString()
    };

    // In a real app, we'd hash the password here
    users.push({ ...newUser, password }); 
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    
    return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 800));
    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) throw new Error('Invalid credentials');
    
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword as User;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(CURRENT_USER_KEY);
    return session ? JSON.parse(session) : null;
  },

  updateUser: (updatedUser: User) => {
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
  }
};
