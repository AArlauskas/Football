import type { Points } from '@/models/points';

export interface UserDetails {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  points: Points;
  roles: string[];
}
