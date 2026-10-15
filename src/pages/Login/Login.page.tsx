import type { LoginPageProps, UserSex } from './Login.types.ts';
import './Login.css';

function DumbbellBoltIcon() {
  return (
    <svg
      className="mt-brand-icon"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g transform="rotate(-30 32 32)">
        <rect x="8" y="22" width="3.5" height="20" rx="1.75" fill="currentColor" opacity="0.7" />
        <rect x="13.5" y="17" width="5" height="30" rx="2.5" fill="currentColor" />
        <rect x="19.5" y="25" width="2.5" height="14" rx="1" fill="currentColor" opacity="0.8" />
        <rect x="22" y="28" width="20" height="8" rx="2" fill="currentColor" opacity="0.9" />
        <rect x="42" y="25" width="2.5" height="14" rx="1" fill="currentColor" opacity="0.8" />
        <rect x="45.5" y="17" width="5" height="30" rx="2.5" fill="currentColor" />
        <rect x="52.5" y="22" width="3.5" height="20" rx="1.75" fill="currentColor" opacity="0.7" />

        <path
          d="M33.5 20L27 32H33L30.5 44L38 31H32L33.5 20Z"
          fill="#38bdf8"
          stroke="#091122"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 13.7) % 96}%`,
  top: `${(i * 17.3) % 94}%`,
  size: `${(i % 3) * 1.5 + 2}px`,
  delay: `${(i * 0.4) % 6}s`,
  duration: `${4 + ((i * 0.7) % 5)}s`,
  opacity: 0.2 + ((i % 5) * 0.15),
}));

export function LoginPage({
  mode,
  isLoading,
  notification,
  errors,
  currentUser,
  pendingUser,
  loginValues,
  registerValues,
  additionalValues,
  onModeChange,
  onLoginChange,
  onRegisterChange,
  onAdditionalChange,
  onLoginSubmit,
  onRegisterSubmit,
  onAdditionalSubmit,
  onSkipAdditional,
  onLogout,
  onDismissNotification,
}: LoginPageProps) {
  return (
    <div className="mt-login-layout">
      <section className="mt-brand-panel" aria-label="Identidad de la marca">
        <div className="mt-aurora-glow glow-1" aria-hidden="true" />
        <div className="mt-aurora-glow glow-2" aria-hidden="true" />
        <div className="mt-aurora-glow glow-3" aria-hidden="true" />
        <div className="mt-aurora-wave" aria-hidden="true" />

        <div className="mt-particles-container" aria-hidden="true">
          {PARTICLES.map((p) => (
            <span
              key={p.id}
              className="mt-particle"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>

        <div className="mt-brand-content">
          <div className="mt-brand-title-wrap">
            <h1 className="mt-brand-title">
              <span className="mt-brand-title-row">
                Muscle
                <DumbbellBoltIcon />
              </span>
              <span className="mt-brand-title-row">
                Tracker
              </span>
            </h1>
          </div>
          <p className="mt-brand-subtitle">
            Control y seguimiento de tus
            <br />
            entrenamientos, de manera sencilla.
          </p>
        </div>
      </section>

      <main className="mt-auth-panel" aria-label="Formulario de inicio y registro">
        <div className="mt-auth-container">
          {notification && (
            <div
              className={`mt-notification ${notification.type}`}
              role="alert"
              aria-live="polite"
            >
              <div className="mt-notification-content">
                <span className="mt-notification-indicator" />
                <span>{notification.message}</span>
              </div>
              <button
                type="button"
                className="mt-notification-close"
                onClick={onDismissNotification}
                aria-label="Cerrar notificación"
              >
                ×
              </button>
            </div>
          )}

          {mode === 'login' && (
            <>
              <div className="mt-auth-header">
                <h2 className="mt-auth-welcome">Bienvenido</h2>
                <h3 className="mt-auth-section-title">Iniciar sesión</h3>
              </div>

              <form className="mt-form" onSubmit={onLoginSubmit} noValidate>
                <div className="mt-form-group">
                  <label htmlFor="login-email" className="mt-label">
                    Correo electrónico
                  </label>
                  <div className={`mt-input-wrapper ${errors.email ? 'has-error' : ''}`}>
                    <span className="material-symbols-outlined mt-field-icon" aria-hidden="true">mail</span>
                    <input
                      id="login-email"
                      type="email"
                      className="mt-input"
                      placeholder="Ingresar correo electrónico"
                      value={loginValues.email}
                      onChange={(e) => onLoginChange('email', e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  {errors.email && <span className="mt-error-text">{errors.email}</span>}
                </div>

                <div className="mt-form-group">
                  <label htmlFor="login-password" className="mt-label">
                    Contraseña
                  </label>
                  <div className={`mt-input-wrapper ${errors.password ? 'has-error' : ''}`}>
                    <span className="material-symbols-outlined mt-field-icon" aria-hidden="true">lock</span>
                    <input
                      id="login-password"
                      type="password"
                      className="mt-input"
                      placeholder="Ingresar contraseña"
                      value={loginValues.password}
                      onChange={(e) => onLoginChange('password', e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                  {errors.password && <span className="mt-error-text">{errors.password}</span>}
                </div>

                <button
                  type="submit"
                  className="mt-btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mt-spinner" aria-hidden="true" />
                      <span>Iniciando sesión...</span>
                    </>
                  ) : (
                    'Iniciar sesión'
                  )}
                </button>
              </form>

              <div className="mt-auth-footer">
                <span>¿No tienes una cuenta?</span>
                <button
                  type="button"
                  className="mt-link-btn"
                  onClick={() => onModeChange('register')}
                >
                  Regístrate
                </button>
              </div>
            </>
          )}

          {mode === 'register' && (
            <>
              <div className="mt-auth-header">
                <h2 className="mt-auth-welcome">Bienvenido</h2>
                <h3 className="mt-auth-section-title">Crear cuenta</h3>
              </div>

              <form className="mt-form" onSubmit={onRegisterSubmit} noValidate>
                <div className="mt-form-row">
                  <div className="mt-form-group">
                    <label htmlFor="register-name" className="mt-label">
                      Nombre
                    </label>
                    <div className={`mt-input-wrapper ${errors.name ? 'has-error' : ''}`}>
                      <span className="material-symbols-outlined mt-field-icon" aria-hidden="true">person</span>
                      <input
                        id="register-name"
                        type="text"
                        className="mt-input"
                        placeholder="Tu nombre"
                        value={registerValues.name}
                        onChange={(e) => onRegisterChange('name', e.target.value)}
                        required
                      />
                    </div>
                    {errors.name && <span className="mt-error-text">{errors.name}</span>}
                  </div>

                  <div className="mt-form-group">
                    <label htmlFor="register-lastname" className="mt-label">
                      Apellido
                    </label>
                    <div className={`mt-input-wrapper ${errors.lastName ? 'has-error' : ''}`}>
                      <span className="material-symbols-outlined mt-field-icon" aria-hidden="true">person</span>
                      <input
                        id="register-lastname"
                        type="text"
                        className="mt-input"
                        placeholder="Tu apellido"
                        value={registerValues.lastName}
                        onChange={(e) => onRegisterChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                    {errors.lastName && <span className="mt-error-text">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="mt-form-group">
                  <label htmlFor="register-email" className="mt-label">
                    Correo electrónico
                  </label>
                  <div className={`mt-input-wrapper ${errors.email ? 'has-error' : ''}`}>
                    <span className="material-symbols-outlined mt-field-icon" aria-hidden="true">mail</span>
                    <input
                      id="register-email"
                      type="email"
                      className="mt-input"
                      placeholder="Ingresar correo electrónico"
                      value={registerValues.email}
                      onChange={(e) => onRegisterChange('email', e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  {errors.email && <span className="mt-error-text">{errors.email}</span>}
                </div>

                <div className="mt-form-group">
                  <label htmlFor="register-password" className="mt-label">
                    Contraseña
                  </label>
                  <div className={`mt-input-wrapper ${errors.password ? 'has-error' : ''}`}>
                    <span className="material-symbols-outlined mt-field-icon" aria-hidden="true">lock</span>
                    <input
                      id="register-password"
                      type="password"
                      className="mt-input"
                      placeholder="Mínimo 6 caracteres"
                      value={registerValues.password}
                      onChange={(e) => onRegisterChange('password', e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  {errors.password && <span className="mt-error-text">{errors.password}</span>}
                </div>

                <button
                  type="submit"
                  className="mt-btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mt-spinner" aria-hidden="true" />
                      <span>Creando cuenta...</span>
                    </>
                  ) : (
                    'Registrarme'
                  )}
                </button>
              </form>

              <div className="mt-auth-footer">
                <span>¿Ya tienes una cuenta?</span>
                <button
                  type="button"
                  className="mt-link-btn"
                  onClick={() => onModeChange('login')}
                >
                  Iniciar sesión
                </button>
              </div>
            </>
          )}

          {mode === 'additional-data' && (
            <>
              <div className="mt-auth-header">
                <h2 className="mt-auth-welcome">Casi listo</h2>
                <h3 className="mt-auth-section-title">Datos adicionales</h3>
                <p className="mt-auth-hint">
                  {pendingUser ? `Hola ${pendingUser.name}, ingresa ` : 'Ingresa '}
                  tus medidas para calcular tus cargas y sobrecarga progresiva.
                </p>
              </div>

              <form className="mt-form" onSubmit={onAdditionalSubmit} noValidate>
                <div className="mt-form-group">
                  <label htmlFor="add-birthdate" className="mt-label">
                    Fecha de nacimiento
                  </label>
                  <div className={`mt-input-wrapper ${errors.birthDate ? 'has-error' : ''}`}>
                    <span className="material-symbols-outlined mt-field-icon" aria-hidden="true">calendar_today</span>
                    <input
                      id="add-birthdate"
                      type="date"
                      className="mt-input"
                      value={additionalValues.birthDate}
                      onChange={(e) => onAdditionalChange('birthDate', e.target.value)}
                      required
                    />
                  </div>
                  {errors.birthDate && (
                    <span className="mt-error-text">{errors.birthDate}</span>
                  )}
                </div>

                <div className="mt-form-row">
                  <div className="mt-form-group">
                    <label htmlFor="add-weight" className="mt-label">
                      Peso (kg)
                    </label>
                    <div className={`mt-input-wrapper ${errors.weight ? 'has-error' : ''}`}>
                      <span className="material-symbols-outlined mt-field-icon" aria-hidden="true">scale</span>
                      <input
                        id="add-weight"
                        type="number"
                        step="0.1"
                        className="mt-input"
                        placeholder="Ej. 75.5"
                        value={additionalValues.weight}
                        onChange={(e) => onAdditionalChange('weight', e.target.value)}
                        required
                      />
                    </div>
                    {errors.weight && <span className="mt-error-text">{errors.weight}</span>}
                  </div>

                  <div className="mt-form-group">
                    <label htmlFor="add-height" className="mt-label">
                      Altura (cm)
                    </label>
                    <div className={`mt-input-wrapper ${errors.height ? 'has-error' : ''}`}>
                      <span className="material-symbols-outlined mt-field-icon" aria-hidden="true">straighten</span>
                      <input
                        id="add-height"
                        type="number"
                        step="1"
                        className="mt-input"
                        placeholder="Ej. 175"
                        value={additionalValues.height}
                        onChange={(e) => onAdditionalChange('height', e.target.value)}
                        required
                      />
                    </div>
                    {errors.height && <span className="mt-error-text">{errors.height}</span>}
                  </div>
                </div>

                <div className="mt-form-group">
                  <label className="mt-label">Sexo biológico</label>
                  <div className="mt-sex-selector">
                    {(['M', 'F', 'O'] as UserSex[]).map((sexKey) => {
                      const labels: Record<UserSex, string> = {
                        M: 'Masculino',
                        F: 'Femenino',
                        O: 'Otro',
                      };
                      const isSelected = additionalValues.sex === sexKey;
                      return (
                        <button
                          key={sexKey}
                          type="button"
                          className={`mt-sex-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => onAdditionalChange('sex', sexKey)}
                        >
                          {labels[sexKey]}
                        </button>
                      );
                    })}
                  </div>
                  {errors.sex && <span className="mt-error-text">{errors.sex}</span>}
                </div>

                <button
                  type="submit"
                  className="mt-btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mt-spinner" aria-hidden="true" />
                      <span>Guardando datos...</span>
                    </>
                  ) : (
                    'Guardar datos'
                  )}
                </button>

                <button
                  type="button"
                  className="mt-btn-skip"
                  onClick={onSkipAdditional}
                >
                  Omitir por ahora
                </button>
              </form>
            </>
          )}

          {mode === 'welcome' && currentUser && (
            <>
              <div className="mt-auth-header">
                <h2 className="mt-auth-welcome">¡Hola de nuevo!</h2>
                <h3 className="mt-auth-section-title">Sesión activa</h3>
              </div>

              <div className="mt-welcome-card">
                <div className="mt-user-header">
                  <div className="mt-avatar-circle">
                    {(currentUser.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="mt-user-meta">
                    <h4>{`${currentUser.name} ${currentUser.lastName || ''}`}</h4>
                    <p>{currentUser.email}</p>
                  </div>
                </div>

                {(currentUser.weight || currentUser.height || currentUser.sex) && (
                  <div className="mt-stats-grid">
                    <div className="mt-stat-item">
                      <span className="mt-stat-label">Peso</span>
                      <span className="mt-stat-value">
                        {currentUser.weight ? `${currentUser.weight} kg` : '-'}
                      </span>
                    </div>
                    <div className="mt-stat-item">
                      <span className="mt-stat-label">Altura</span>
                      <span className="mt-stat-value">
                        {currentUser.height ? `${currentUser.height} cm` : '-'}
                      </span>
                    </div>
                    <div className="mt-stat-item">
                      <span className="mt-stat-label">Sexo</span>
                      <span className="mt-stat-value">{currentUser.sex || '-'}</span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="mt-btn-primary"
                  onClick={() => alert('¡Listo para registrar tus entrenamientos!')}
                >
                  Ir a Mis Entrenamientos
                </button>

                <button
                  type="button"
                  className="mt-btn-outline"
                  onClick={onLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
