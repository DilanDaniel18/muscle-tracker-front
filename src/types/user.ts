export type UserSex = 'M' | 'F' | 'O';

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  birthDate?: string | null;
  weight?: number | null;
  height?: number | null;
  sex?: UserSex | null;
}
