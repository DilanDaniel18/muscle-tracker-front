import { TopBar } from '../../components/TopBar';
import type { User } from '../../types/user';
import './DashboardScreen.css';

export interface DashboardScreenProps {
  user: User | null;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

const SEX_LABELS: Record<string, string> = {
  M: 'Masculino',
  F: 'Femenino',
  O: 'Otro',
};

export function DashboardScreen({
  user,
  onLogout,
  onProfileClick,
  onSettingsClick,
}: DashboardScreenProps) {
  const hasProfileData = Boolean(
    user &&
      (user.onboardingCompleted ||
        user.birthDate ||
        user.height ||
        user.weight ||
        (user.activityTypes && user.activityTypes.length > 0) ||
        user.exerciseFrequency)
  );

  return (
    <div className="mt-dashboard-layout">
      <TopBar
        user={user}
        onLogout={onLogout}
        onProfileClick={onProfileClick}
        onSettingsClick={onSettingsClick}
      />

      <main className="mt-dashboard-main flex-1 w-full">
        <div className="mt-dashboard-container w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 flex flex-col gap-6 sm:gap-8 lg:gap-10">
          <section className="mt-dashboard-hero p-6 sm:p-8 lg:p-10">
            <div className="mt-dashboard-hero-row flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="mt-dashboard-hero-content flex flex-col gap-3 sm:gap-4 max-w-2xl">
                <div className="mt-dashboard-badge">
                  <span className="mt-badge-dot" />
                  <span>Panel Principal</span>
                </div>
                <h1 className="mt-dashboard-title text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                  ¡Hola{user?.name ? `, ${user.name}` : ''}!
                </h1>
                <p className="mt-dashboard-subtitle text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
                  Bienvenido a Muscle Tracker. Aquí podrás gestionar tus rutinas, registrar tus entrenamientos y visualizar tu progreso muscular.
                </p>
              </div>

              {onProfileClick && (
                <button
                  type="button"
                  className="mt-dashboard-onboarding-btn"
                  onClick={onProfileClick}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {hasProfileData ? 'tune' : 'rocket_launch'}
                  </span>
                  <span>
                    {hasProfileData
                      ? 'Actualizar perfil de ejercicio'
                      : 'Completar Onboarding'}
                  </span>
                </button>
              )}
            </div>
          </section>

          {hasProfileData && user && (
            <section
              className="mt-dashboard-profile-summary p-6 sm:p-7"
              aria-label="Resumen de perfil de ejercicio"
            >
              <div className="mt-profile-summary-header">
                <div className="mt-profile-summary-title-group">
                  <span
                    className="material-symbols-outlined mt-profile-summary-icon"
                    aria-hidden="true"
                  >
                    assignment_ind
                  </span>
                  <div>
                    <h2 className="mt-profile-summary-title">
                      Tu Perfil de Ejercicio
                    </h2>
                    <p className="mt-profile-summary-subtitle">
                      Datos calibrados durante tu proceso de onboarding
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-profile-metrics-grid">
                <div className="mt-profile-metric-box">
                  <span className="mt-profile-metric-label">Estatura</span>
                  <span className="mt-profile-metric-val">
                    {user.height ? `${user.height} cm` : '-'}
                  </span>
                </div>
                <div className="mt-profile-metric-box">
                  <span className="mt-profile-metric-label">Peso</span>
                  <span className="mt-profile-metric-val">
                    {user.weight ? `${user.weight} kg` : '-'}
                  </span>
                </div>
                <div className="mt-profile-metric-box">
                  <span className="mt-profile-metric-label">Sexo</span>
                  <span className="mt-profile-metric-val">
                    {user.sex ? SEX_LABELS[user.sex] || user.sex : '-'}
                  </span>
                </div>
                <div className="mt-profile-metric-box">
                  <span className="mt-profile-metric-label">Frecuencia semanal</span>
                  <span className="mt-profile-metric-val">
                    {user.exerciseFrequency || '-'}
                  </span>
                </div>
              </div>

              {user.activityTypes && user.activityTypes.length > 0 && (
                <div className="mt-profile-activities-wrap">
                  <span className="mt-profile-metric-label">
                    Actividad diaria seleccionada
                  </span>
                  <div className="mt-profile-activity-tags">
                    {user.activityTypes.map((activity) => (
                      <span key={activity} className="mt-profile-activity-tag">
                        <span
                          className="material-symbols-outlined"
                          aria-hidden="true"
                        >
                          check_circle
                        </span>
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          <section className="mt-dashboard-empty-state">
            <div className="mt-empty-card py-16 sm:py-20 lg:py-24 px-6 sm:px-12 flex flex-col items-center justify-center text-center gap-4 sm:gap-5">
              <div className="mt-empty-icon-wrap mb-1">
                <span className="material-symbols-outlined mt-empty-icon" aria-hidden="true">
                  fitness_center
                </span>
              </div>
              <h2 className="mt-empty-title text-xl sm:text-2xl font-bold tracking-tight">
                No hay entrenamientos activos
              </h2>
              <p className="mt-empty-description text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
                Aún no has configurado tu rutina semanal. Diseña tus ejercicios o selecciona una plantilla para comenzar a monitorear tu progreso.
              </p>
              <div className="mt-empty-status-tag mt-2">
                <span className="material-symbols-outlined mt-status-tag-icon" aria-hidden="true">
                  pending_actions
                </span>
                <span>Próximamente disponible</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default DashboardScreen;
