import { TopBar } from '../../components/TopBar';
import type { User } from '../../types/user';
import './DashboardScreen.css';

export interface DashboardScreenProps {
  user: User | null;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

export function DashboardScreen({
  user,
  onLogout,
  onProfileClick,
  onSettingsClick,
}: DashboardScreenProps) {
  return (
    <div className="mt-dashboard-layout">
      <TopBar
        user={user}
        onLogout={onLogout}
        onProfileClick={onProfileClick}
        onSettingsClick={onSettingsClick}
      />

      <main className="mt-dashboard-main">
        <div className="mt-dashboard-container">

          <h1>Nothing to see here...</h1>
          <h2>WORK IN PROGRESS</h2>
          <h3>IM TRASH AS A UX DESIGNER</h3>

        </div>
      </main>
    </div>
  );
}

export default DashboardScreen;
