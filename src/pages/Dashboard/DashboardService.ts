import { loginService } from '../Login/LoginService';
import type { User } from '../../types/user';

export class DashboardService {
  getCurrentUser(): User | null {
    return loginService.getCurrentUser();
  }

  getToken(): string | null {
    return loginService.getToken();
  }

  verifySession(): Promise<User | null> {
    return loginService.verifySession();
  }

  logout(): void {
    void loginService.logout();
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
