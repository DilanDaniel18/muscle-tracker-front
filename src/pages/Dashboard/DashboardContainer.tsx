import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from './DashboardService';
import { DashboardScreen } from './DashboardScreen';
import type { User } from '../../types/user';

export function DashboardContainer() {
  const [user, setUser] = useState<User | null>(() => dashboardService.getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const currentUser = dashboardService.getCurrentUser();
    const token = dashboardService.getToken();

    if (!currentUser || !token) {
      dashboardService.logout();
      navigate('/', { replace: true });
      return;
    }

    setUser(currentUser);

    void dashboardService.verifySession().then((verifiedUser) => {
      if (!isMounted) return;
      if (verifiedUser) {
        setUser(verifiedUser);
      } else {
        navigate('/', { replace: true });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = () => {
    dashboardService.logout();
    setUser(null);
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/onboarding');
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
