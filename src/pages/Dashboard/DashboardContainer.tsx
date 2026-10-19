import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from './DashboardService';
import { DashboardScreen } from './DashboardScreen';
import type { User } from '../../types/user';

export function DashboardContainer() {
  const [user, setUser] = useState<User | null>(() => dashboardService.getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = dashboardService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    dashboardService.logout();
    setUser(null);
    navigate('/');
  };

  const handleProfileClick = () => {
    // Espacio para navegación o modal de perfil
  };

  const handleSettingsClick = () => {
    // Espacio para navegación o modal de ajustes
  };

  return (
    <DashboardScreen
      user={user}
      onLogout={handleLogout}
      onProfileClick={handleProfileClick}
      onSettingsClick={handleSettingsClick}
    />
  );
}

export default DashboardContainer;
