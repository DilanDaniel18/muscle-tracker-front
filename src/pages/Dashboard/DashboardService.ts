import { loginService } from '../Login/LoginService';
import type { User } from '../../types/user';

export class DashboardService {
  getCurrentUser(): User | null {
    return loginService.getCurrentUser();
  }

  logout(): void {
    loginService.logout();
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
