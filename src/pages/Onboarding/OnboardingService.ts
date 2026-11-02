import { loginService } from '../Login/LoginService';
import type {
  OnboardingProfile,
  SaveOnboardingPayload,
  SaveOnboardingResult,
  User,
} from './OnboardingTypes';

const ONBOARDING_API_BASE = '/api/onboarding';

interface ApiResponse<T> {
  status: 'success' | 'error';
  code?: string;
  message: string;
  data?: T;
}

export class OnboardingService {
  getCurrentUser(): User | null {
    return loginService.getCurrentUser();
  }

  getToken(): string | null {
    return loginService.getToken();
  }

  verifySession(): Promise<User | null> {
    return loginService.verifySession();
  }

  async getProfile(userId: string): Promise<OnboardingProfile | null> {
    try {
      const response = await fetch(`${ONBOARDING_API_BASE}/${userId}`, {
        method: 'GET',
        headers: loginService.getAuthHeaders(),
      });

      if (!response.ok) {
        return null;
      }

      const result = (await response.json()) as ApiResponse<OnboardingProfile | null>;
      if (result.status !== 'success') {
        return null;
      }

      return result.data ?? null;
    } catch {
      return null;
    }
  }

  async saveOnboarding(payload: SaveOnboardingPayload): Promise<SaveOnboardingResult> {
    try {
      const response = await fetch(ONBOARDING_API_BASE, {
        method: 'POST',
        headers: loginService.getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as ApiResponse<SaveOnboardingResult>;

      if (!response.ok || result.status !== 'success' || !result.data) {
        throw new Error(
          result.message || 'No se pudo guardar la información del onboarding.'
        );
      }

      loginService.setCurrentUser(result.data.user);
      return result.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Error de conexión con el servidor al guardar el perfil.');
    }
  }
}

export const onboardingService = new OnboardingService();
export default onboardingService;

