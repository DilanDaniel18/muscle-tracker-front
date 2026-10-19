import type {
  AdditionalUserData,
  LoginCredentials,
  RegisterCredentials,
  RegisteredUser,
  User,
} from './LoginTypes';

const API_BASE = '/api/users';
const STORAGE_KEY = 'muscle_tracker_current_user';

interface ApiResponse<T> {
  status: 'success' | 'error';
  code?: string;
  message: string;
  data?: T;
}

export class LoginService {
  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? (JSON.parse(data) as User) : null;
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  async register(credentials: RegisterCredentials): Promise<RegisteredUser> {
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: credentials.name.trim(),
          lastName: credentials.lastName.trim(),
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      });

      const result = (await response.json()) as ApiResponse<RegisteredUser>;

      if (!response.ok || result.status !== 'success' || !result.data) {
        throw new Error(result.message || 'Error al registrar el usuario.');
      }

      return result.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('No se pudo establecer conexión con el servidor backend.');
    }
  }

  async updateAdditionalData(data: AdditionalUserData): Promise<User> {
    try {
      const response = await fetch(`${API_BASE}/${data.id}/additional-data`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate: data.birthDate,
          weight: data.weight,
          height: data.height,
          sex: data.sex,
        }),
      });

      const result = (await response.json()) as ApiResponse<User>;

      if (!response.ok || result.status !== 'success' || !result.data) {
        throw new Error(result.message || 'Error al actualizar los datos adicionales.');
      }

      this.setCurrentUser(result.data);
      return result.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Error al conectar con el servidor.');
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    if (!email || !password) {
      throw new Error('Por favor, ingresa tu correo y contraseña.');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    const saved = this.getCurrentUser();
    if (saved && saved.email.toLowerCase() === email) {
      return saved;
    }

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0],
      lastName: '',
      email: email,
    };

    this.setCurrentUser(newUser);
    return newUser;
  }

  logout(): void {
    this.setCurrentUser(null);
  }
}

export const loginService = new LoginService();
export default loginService;
