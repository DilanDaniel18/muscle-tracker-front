import {
  ACTIVITY_OPTIONS,
  BEGINNER_ACTIVITY_OPTION,
  FREQUENCY_OPTIONS,
  TOTAL_ONBOARDING_STEPS,
  type OnboardingScreenProps,
  type OnboardingStep,
  type UserSex,
} from './OnboardingTypes';
import './OnboardingScreen.css';

function DumbbellBoltIcon() {
  return (
    <svg
      className="mt-ob-brand-icon"
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

const SEX_OPTIONS: { value: UserSex; label: string; icon: string }[] = [
  { value: 'M', label: 'Masculino', icon: 'male' },
  { value: 'F', label: 'Femenino', icon: 'female' },
  { value: 'O', label: 'Otro', icon: 'transgender' },
];

export function OnboardingScreen({
  step,
  user,
  values,
  errors,
  isSubmitting,
  onNextStep,
  onPrevStep,
  onPhysicalFieldChange,
  onPhysicalFormSubmit,
  onToggleActivity,
  onSelectBeginner,
  onSelectFrequency,
  onFinalSubmit,
  onDismissError,
}: OnboardingScreenProps) {
  const isFullScreenStatement = step === 1 || step === 3 || step === 5;
  const progressPercentage = Math.round((step / TOTAL_ONBOARDING_STEPS) * 100);

  return (
    <div className="mt-ob-layout">
      {/* Ambient Background */}
      <div className="mt-ob-aurora glow-1" aria-hidden="true" />
      <div className="mt-ob-aurora glow-2" aria-hidden="true" />
      <div className="mt-ob-aurora glow-3" aria-hidden="true" />
      <div className="mt-ob-grid-overlay" aria-hidden="true" />

      {/* Top Progress & Brand Header */}
      <header className="mt-ob-header">
        <div className="mt-ob-header-inner">
          <div className="mt-ob-brand">
            <div className="mt-ob-brand-logo">
              <DumbbellBoltIcon />
            </div>
            <span className="mt-ob-brand-name">
              Muscle<span>Tracker</span>
            </span>
          </div>

          <div className="mt-ob-step-meta">
            <span className="mt-ob-step-badge">
              Paso {step} de {TOTAL_ONBOARDING_STEPS}
            </span>
            <div
              className="mt-ob-progress-track"
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progreso del onboarding: paso ${step} de ${TOTAL_ONBOARDING_STEPS}`}
            >
              <div
                className="mt-ob-progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className={`mt-ob-main ${
          isFullScreenStatement ? 'mt-ob-main-fullscreen' : 'mt-ob-main-form'
        }`}
      >
        {errors.general && (
          <div className="mt-ob-alert" role="alert">
            <div className="mt-ob-alert-content">
              <span className="material-symbols-outlined" aria-hidden="true">
                error
              </span>
              <span>{errors.general}</span>
            </div>
            <button
              type="button"
              className="mt-ob-alert-close"
              onClick={onDismissError}
              aria-label="Cerrar alerta"
            >
              ×
            </button>
          </div>
        )}

        {/* STEP 1: Full-screen intro statement */}
        {step === 1 && (
          <section
            key="step-1"
            className="mt-ob-statement-screen"
            aria-labelledby="ob-step1-heading"
          >
            <div className="mt-ob-statement-icon-ring">
              <span className="material-symbols-outlined mt-ob-statement-icon" aria-hidden="true">
                waving_hand
              </span>
            </div>

            {user?.name && (
              <p className="mt-ob-statement-eyebrow">
                ¡Bienvenido a bordo, {user.name}!
              </p>
            )}

            <h1 id="ob-step1-heading" className="mt-ob-statement-title">
              Comencemos conociéndote mejor
            </h1>

            <p className="mt-ob-statement-subtitle">
              Configuraremos tu perfil físico y de entrenamiento en unos segundos
              para personalizar tu experiencia en Muscle Tracker.
            </p>

            <div className="mt-ob-statement-actions">
              <button
                type="button"
                className="mt-ob-btn-primary mt-ob-btn-lg"
                onClick={onNextStep}
              >
                <span>Comenzar ahora</span>
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
            </div>
          </section>
        )}

        {/* STEP 2: Physical Data Form */}
        {step === 2 && (
          <section
            key="step-2"
            className="mt-ob-card mt-ob-card-narrow"
            aria-labelledby="ob-step2-heading"
          >
            <div className="mt-ob-card-header">
              <span className="mt-ob-section-pill">
                <span className="material-symbols-outlined" aria-hidden="true">
                  monitoring
                </span>
                Datos corporales
              </span>
              <h2 id="ob-step2-heading" className="mt-ob-card-title">
                Tu perfil físico
              </h2>
              <p className="mt-ob-card-subtitle">
                Estos datos nos permiten estimar tus métricas corporales y calibrar
                tus cargas de entrenamiento.
              </p>
            </div>

            <form className="mt-ob-form" onSubmit={onPhysicalFormSubmit} noValidate>
              {/* ¿Cuál es tu fecha de nacimiento? */}
              <div className="mt-ob-field-group">
                <label htmlFor="ob-birthdate" className="mt-ob-label">
                  ¿Cuál es tu fecha de nacimiento?
                </label>
                <div
                  className={`mt-ob-input-wrap ${
                    errors.birthDate ? 'has-error' : ''
                  }`}
                >
                  <span
                    className="material-symbols-outlined mt-ob-input-icon"
                    aria-hidden="true"
                  >
                    calendar_today
                  </span>
                  <input
                    id="ob-birthdate"
                    type="date"
                    className="mt-ob-input"
                    value={values.birthDate}
                    onChange={(e) =>
                      onPhysicalFieldChange('birthDate', e.target.value)
                    }
                    required
                  />
                </div>
                {errors.birthDate && (
                  <span className="mt-ob-error">{errors.birthDate}</span>
                )}
              </div>

              {/* Estatura & Peso */}
              <div className="mt-ob-field-row">
                <div className="mt-ob-field-group">
                  <label htmlFor="ob-height" className="mt-ob-label">
                    Estatura (cm)
                  </label>
                  <div
                    className={`mt-ob-input-wrap ${
                      errors.height ? 'has-error' : ''
                    }`}
                  >
                    <span
                      className="material-symbols-outlined mt-ob-input-icon"
                      aria-hidden="true"
                    >
                      straighten
                    </span>
                    <input
                      id="ob-height"
                      type="number"
                      step="1"
                      min="40"
                      max="280"
                      className="mt-ob-input"
                      placeholder="Ej. 175"
                      value={values.height}
                      onChange={(e) =>
                        onPhysicalFieldChange('height', e.target.value)
                      }
                      required
                    />
                  </div>
                  {errors.height && (
                    <span className="mt-ob-error">{errors.height}</span>
                  )}
                </div>

                <div className="mt-ob-field-group">
                  <label htmlFor="ob-weight" className="mt-ob-label">
                    Peso (kg)
                  </label>
                  <div
                    className={`mt-ob-input-wrap ${
                      errors.weight ? 'has-error' : ''
                    }`}
                  >
                    <span
                      className="material-symbols-outlined mt-ob-input-icon"
                      aria-hidden="true"
                    >
                      scale
                    </span>
                    <input
                      id="ob-weight"
                      type="number"
                      step="0.1"
                      min="1"
                      max="999"
                      className="mt-ob-input"
                      placeholder="Ej. 75.5"
                      value={values.weight}
                      onChange={(e) =>
                        onPhysicalFieldChange('weight', e.target.value)
                      }
                      required
                    />
                  </div>
                  {errors.weight && (
                    <span className="mt-ob-error">{errors.weight}</span>
                  )}
                </div>
              </div>

              {/* Sexo */}
              <div className="mt-ob-field-group">
                <span className="mt-ob-label">Sexo</span>
                <div
                  className="mt-ob-sex-grid"
                  role="radiogroup"
                  aria-label="Selecciona tu sexo"
                >
                  {SEX_OPTIONS.map((option) => {
                    const isSelected = values.sex === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`mt-ob-sex-card ${
                          isSelected ? 'selected' : ''
                        }`}
                        onClick={() =>
                          onPhysicalFieldChange('sex', option.value)
                        }
                      >
                        <span
                          className="material-symbols-outlined mt-ob-sex-icon"
                          aria-hidden="true"
                        >
                          {option.icon}
                        </span>
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.sex && (
                  <span className="mt-ob-error">{errors.sex}</span>
                )}
              </div>

              <div className="mt-ob-nav-actions">
                <button
                  type="button"
                  className="mt-ob-btn-secondary"
                  onClick={onPrevStep}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    arrow_back
                  </span>
                  <span>Anterior</span>
                </button>

                <button type="submit" className="mt-ob-btn-primary">
                  <span>Continuar</span>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    arrow_forward
                  </span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* STEP 3: Full-screen statement about daily activity */}
        {step === 3 && (
          <section
            key="step-3"
            className="mt-ob-statement-screen"
            aria-labelledby="ob-step3-heading"
          >
            <div className="mt-ob-statement-icon-ring">
              <span className="material-symbols-outlined mt-ob-statement-icon" aria-hidden="true">
                bolt
              </span>
            </div>

            <p className="mt-ob-statement-eyebrow">Hábitos de entrenamiento</p>

            <h1 id="ob-step3-heading" className="mt-ob-statement-title">
              Cuéntanos cuál es tu tipo de actividad diaria
            </h1>

            <p className="mt-ob-statement-subtitle">
              Conocer las disciplinas que practicas o te interesan nos ayudará a
              adaptar tus rutinas y el seguimiento de tu progreso.
            </p>

            <div className="mt-ob-statement-actions">
              <button
                type="button"
                className="mt-ob-btn-secondary"
                onClick={onPrevStep}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_back
                </span>
                <span>Anterior</span>
              </button>

              <button
                type="button"
                className="mt-ob-btn-primary mt-ob-btn-lg"
                onClick={onNextStep}
              >
                <span>Elegir actividades</span>
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
            </div>
          </section>
        )}

        {/* STEP 4: Multi-option selector of exercises + Beginner option */}
        {step === 4 && (
          <section
            key="step-4"
            className="mt-ob-card mt-ob-card-wide"
            aria-labelledby="ob-step4-heading"
          >
            <div className="mt-ob-card-header">
              <span className="mt-ob-section-pill">
                <span className="material-symbols-outlined" aria-hidden="true">
                  fitness_center
                </span>
                Selección múltiple
              </span>
              <h2 id="ob-step4-heading" className="mt-ob-card-title">
                Selecciona tus tipos de ejercicio
              </h2>
              <p className="mt-ob-card-subtitle">
                Puedes elegir una o varias disciplinas que practiques actualmente, o
                indicar debajo si estás por iniciar desde cero.
              </p>
            </div>

            <div
              className="mt-ob-activity-grid"
              role="group"
              aria-label="Opciones de tipos de ejercicio"
            >
              {ACTIVITY_OPTIONS.map((activity) => {
                const isSelected =
                  !values.isBeginner &&
                  values.activityTypes.includes(activity.label);

                return (
                  <button
                    key={activity.id}
                    type="button"
                    aria-pressed={isSelected}
                    className={`mt-ob-activity-card ${
                      isSelected ? 'selected' : ''
                    }`}
                    onClick={() => onToggleActivity(activity.label)}
                  >
                    <div className="mt-ob-activity-card-top">
                      <div className="mt-ob-activity-icon-wrap">
                        <span
                          className="material-symbols-outlined mt-ob-activity-icon"
                          aria-hidden="true"
                        >
                          {activity.icon}
                        </span>
                      </div>
                      <span
                        className={`mt-ob-check-indicator ${
                          isSelected ? 'checked' : ''
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && (
                          <span className="material-symbols-outlined">
                            check
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="mt-ob-activity-text">
                      <h3 className="mt-ob-activity-title">{activity.label}</h3>
                      <p className="mt-ob-activity-desc">
                        {activity.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Divider & Beginner Option below */}
            <div className="mt-ob-beginner-divider">
              <span>o si estás dando el primer paso</span>
            </div>

            <button
              type="button"
              aria-pressed={values.isBeginner}
              className={`mt-ob-beginner-btn ${
                values.isBeginner ? 'selected' : ''
              }`}
              onClick={onSelectBeginner}
            >
              <div className="mt-ob-beginner-left">
                <div className="mt-ob-beginner-icon-wrap">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    rocket_launch
                  </span>
                </div>
                <div className="mt-ob-beginner-copy">
                  <span className="mt-ob-beginner-title">
                    {BEGINNER_ACTIVITY_OPTION}
                  </span>
                  <span className="mt-ob-beginner-subtitle">
                    Diseñaremos una progresión gradual adaptada para principiantes
                  </span>
                </div>
              </div>

              <span
                className={`mt-ob-check-indicator ${
                  values.isBeginner ? 'checked' : ''
                }`}
                aria-hidden="true"
              >
                {values.isBeginner && (
                  <span className="material-symbols-outlined">check</span>
                )}
              </span>
            </button>

            {errors.activityTypes && (
              <div className="mt-ob-error-banner" role="alert">
                <span className="material-symbols-outlined" aria-hidden="true">
                  info
                </span>
                <span>{errors.activityTypes}</span>
              </div>
            )}

            <div className="mt-ob-nav-actions">
              <button
                type="button"
                className="mt-ob-btn-secondary"
                onClick={onPrevStep}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_back
                </span>
                <span>Anterior</span>
              </button>

              <button
                type="button"
                className="mt-ob-btn-primary"
                onClick={onNextStep}
              >
                <span>Continuar</span>
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
            </div>
          </section>
        )}

        {/* STEP 5: Full-screen statement about frequency */}
        {step === 5 && (
          <section
            key="step-5"
            className="mt-ob-statement-screen"
            aria-labelledby="ob-step5-heading"
          >
            <div className="mt-ob-statement-icon-ring">
              <span className="material-symbols-outlined mt-ob-statement-icon" aria-hidden="true">
                calendar_month
              </span>
            </div>

            <p className="mt-ob-statement-eyebrow">Constancia semanal</p>

            <h1 id="ob-step5-heading" className="mt-ob-statement-title">
              ¿Qué tan seguido realizas o quieres realizar ejercicios?
            </h1>

            <p className="mt-ob-statement-subtitle">
              Definir tu frecuencia semanal nos permite estructurar tu volumen de
              entrenamiento y tus días de descanso.
            </p>

            <div className="mt-ob-statement-actions">
              <button
                type="button"
                className="mt-ob-btn-secondary"
                onClick={onPrevStep}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_back
                </span>
                <span>Anterior</span>
              </button>

              <button
                type="button"
                className="mt-ob-btn-primary mt-ob-btn-lg"
                onClick={onNextStep}
              >
                <span>Seleccionar frecuencia</span>
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
            </div>
          </section>
        )}

        {/* STEP 6: Frequency selector & Final submit */}
        {step === 6 && (
          <section
            key="step-6"
            className="mt-ob-card mt-ob-card-medium"
            aria-labelledby="ob-step6-heading"
          >
            <div className="mt-ob-card-header">
              <span className="mt-ob-section-pill">
                <span className="material-symbols-outlined" aria-hidden="true">
                  schedule
                </span>
                Último paso
              </span>
              <h2 id="ob-step6-heading" className="mt-ob-card-title">
                Frecuencia de entrenamiento
              </h2>
              <p className="mt-ob-card-subtitle">
                Elige cuántos días por semana planeas dedicar a tus sesiones de
                ejercicio.
              </p>
            </div>

            <form onSubmit={onFinalSubmit} noValidate>
              <div
                className="mt-ob-frequency-list"
                role="radiogroup"
                aria-label="Frecuencia semanal de ejercicio"
              >
                {FREQUENCY_OPTIONS.map((option) => {
                  const isSelected = values.exerciseFrequency === option.label;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`mt-ob-frequency-card ${
                        isSelected ? 'selected' : ''
                      }`}
                      onClick={() => onSelectFrequency(option.label)}
                    >
                      <div className="mt-ob-frequency-icon-wrap">
                        <span
                          className="material-symbols-outlined mt-ob-frequency-icon"
                          aria-hidden="true"
                        >
                          {option.icon}
                        </span>
                      </div>

                      <div className="mt-ob-frequency-content">
                        <div className="mt-ob-frequency-title-row">
                          <h3 className="mt-ob-frequency-title">
                            {option.label}
                          </h3>
                          <span className="mt-ob-frequency-badge">
                            {option.badge}
                          </span>
                        </div>
                        <p className="mt-ob-frequency-subtitle">
                          {option.subtitle}
                        </p>
                      </div>

                      <span
                        className={`mt-ob-radio-dot ${
                          isSelected ? 'checked' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>

              {errors.exerciseFrequency && (
                <div className="mt-ob-error-banner" role="alert">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    info
                  </span>
                  <span>{errors.exerciseFrequency}</span>
                </div>
              )}

              <div className="mt-ob-nav-actions">
                <button
                  type="button"
                  className="mt-ob-btn-secondary"
                  onClick={onPrevStep}
                  disabled={isSubmitting}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    arrow_back
                  </span>
                  <span>Anterior</span>
                </button>

                <button
                  type="submit"
                  className="mt-ob-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mt-ob-spinner" aria-hidden="true" />
                      <span>Guardando perfil...</span>
                    </>
                  ) : (
                    <>
                      <span>Finalizar y guardar perfil</span>
                      <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>

      {/* Step Dots Footer */}
      <footer className="mt-ob-footer" aria-label="Indicador de pasos">
        <div className="mt-ob-dots">
          {([1, 2, 3, 4, 5, 6] as OnboardingStep[]).map((s) => (
            <span
              key={s}
              className={`mt-ob-dot ${
                s === step ? 'active' : s < step ? 'completed' : ''
              }`}
              aria-current={s === step ? 'step' : undefined}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}

export default OnboardingScreen;

