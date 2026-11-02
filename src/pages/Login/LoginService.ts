import type {
  ActiveSessionInfo,
  AdditionalUserData,
  AuthSession,
  LoginCredentials,
  RegisterCredentials,
  RegisteredUser,
  User,
} from './LoginTypes';

const API_BASE = '/api/users';
const STORAGE_KEY = 'muscle_tracker_current_user';
const TOKEN_STORAGE_KEY = 'muscle_tracker_session_token';
const SESSION_META_KEY = 'muscle_tracker_session_meta';

interface ApiResponse<T> {
  status: 'success' | 'error';
  code?: string;
  message: string;
  data?: T;
}

interface SessionMeta {
  expiresIn?: string;
  expiresAt?: string;
}

export class LoginService {
  getToken(): string | null {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!token) {
        return null;
      }

      const metaRaw = localStorage.getItem(SESSION_META_KEY);
      if (metaRaw) {
        const meta = JSON.parse(metaRaw) as SessionMeta;
        if (meta.expiresAt) {
          const expiresAtMs = new Date(meta.expiresAt).getTime();
          if (!Number.isNaN(expiresAtMs) && expiresAtMs <= Date.now()) {
            this.clearSession();
            return null;
          }
        }
      }

      return token;
    } catch {
      return null;
    }
  }

  setToken(token: string | null, meta?: SessionMeta): void {
    try {
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        if (meta) {
          localStorage.setItem(SESSION_META_KEY, JSON.stringify(meta));
        }
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(SESSION_META_KEY);
      }
    } catch {
      // Ignore storage quota errors
    }
  }

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? (JSON.parse(data) as User) : null;
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage quota errors
    }
  }

  setSession(session: AuthSession): void {
    this.setCurrentUser(session.user);
    this.setToken(session.token, {
      expiresIn: session.expiresIn,
      expiresAt: session.expiresAt,
    });
  }

  clearSession(): void {
    this.setCurrentUser(null);
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken() && this.getCurrentUser());
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
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
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        }),
      });

      const result = (await response.json()) as ApiResponse<RegisteredUser>;

      if (!response.ok || result.status !== 'success' || !result.data) {
        throw new Error(result.message || 'Error al registrar el usuario.');
      }

      if (result.data.token) {
        this.setToken(result.data.token, {
          expiresIn: result.data.expiresIn,
          expiresAt: result.data.expiresAt,
        });
      }

      this.setCurrentUser({
        id: result.data.id,
        name: result.data.name,
        lastName: result.data.lastName,
        email: result.data.email,
        onboardingCompleted: false,
      });

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
        headers: this.getAuthHeaders(),
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

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = (await response.json()) as ApiResponse<AuthSession>;

      if (!response.ok || result.status !== 'success' || !result.data) {
        throw new Error(result.message || 'Correo electrónico o contraseña incorrectos.');
      }

      this.setSession(result.data);
      return result.data.user;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('No se pudo establecer conexión con el servidor backend.');
    }
  }

  async verifySession(): Promise<User | null> {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE}/me`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (response.status === 401) {
        this.clearSession();
        return null;
      }

      const result = (await response.json()) as ApiResponse<ActiveSessionInfo>;
      if (!response.ok || result.status !== 'success' || !result.data?.user) {
        return this.getCurrentUser();
      }

      this.setCurrentUser(result.data.user);
      return result.data.user;
    } catch {
      return this.getCurrentUser();
    }
  }

  async logout(): Promise<void> {
    const token = this.getToken();
    this.clearSession();

    if (!token) {
      return;
    }

    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // La sesión local ya fue limpiada aunque el servidor no esté disponible
    }
  }
}

export const loginService = new LoginService();
export default loginService;
