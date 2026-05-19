import type { UserDetails } from '@/models/user';

export interface LoginDetails {
  email: string;
  password: string;
}

export interface UserPrototype {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface AuthState {
  isAdmin: boolean;
  user: UserDetails | null;
}
