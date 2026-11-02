import { useState, useEffect, useCallback } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingService } from './OnboardingService';
import { OnboardingScreen } from './OnboardingScreen';
import {
  BEGINNER_ACTIVITY_OPTION,
  type OnboardingFormErrors,
  type OnboardingFormValues,
  type OnboardingStep,
  type User,
  type UserSex,
} from './OnboardingTypes';

export function OnboardingContainer() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() =>
    onboardingService.getCurrentUser()
  );
  const [step, setStep] = useState<OnboardingStep>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<OnboardingFormErrors>({});

  const [values, setValues] = useState<OnboardingFormValues>(() => {
    const cached = onboardingService.getCurrentUser();
    const initialActivities = cached?.activityTypes?.filter(
      (act) => act !== BEGINNER_ACTIVITY_OPTION
    ) ?? [];

    return {
      birthDate: cached?.birthDate ?? '',
      height: cached?.height ? String(cached.height) : '',
      weight: cached?.weight ? String(cached.weight) : '',
      sex: cached?.sex ?? '',
      activityTypes: initialActivities,
      isBeginner: Boolean(cached?.isBeginner),
      exerciseFrequency: cached?.exerciseFrequency ?? '',
    };
  });

  useEffect(() => {
    let isMounted = true;
    const currentUser = onboardingService.getCurrentUser();
    const token = onboardingService.getToken();

    if (!currentUser || !token) {
      navigate('/', { replace: true });
      return;
    }

    setUser(currentUser);

    void onboardingService.verifySession().then(async (verifiedUser) => {
      if (!isMounted) return;
      if (!verifiedUser) {
        navigate('/', { replace: true });
        return;
      }

      setUser(verifiedUser);

      const profile = await onboardingService.getProfile(verifiedUser.id);
      if (!isMounted) return;

      if (profile) {
        const filteredActivities = (profile.activityTypes || []).filter(
          (act) => act !== BEGINNER_ACTIVITY_OPTION
        );
        setValues((prev) => ({
          birthDate: prev.birthDate || profile.birthDate || '',
          height: prev.height || (profile.height ? String(profile.height) : ''),
          weight: prev.weight || (profile.weight ? String(profile.weight) : ''),
          sex: prev.sex || profile.sex || '',
          activityTypes:
            prev.activityTypes.length > 0 ? prev.activityTypes : filteredActivities,
          isBeginner: prev.isBeginner || Boolean(profile.isBeginner),
          exerciseFrequency:
            prev.exerciseFrequency || profile.exerciseFrequency || '',
        }));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const validateStep2 = useCallback((): boolean => {
    const newErrors: OnboardingFormErrors = {};

    if (!values.birthDate) {
      newErrors.birthDate = 'Por favor, ingresa tu fecha de nacimiento.';
    } else {
      const parsed = new Date(values.birthDate + 'T00:00:00');
      const now = new Date();
      if (isNaN(parsed.getTime()) || parsed > now || parsed.getFullYear() < 1900) {
        newErrors.birthDate = 'Ingresa una fecha de nacimiento válida.';
      }
    }

    const heightNum = parseInt(values.height, 10);
    if (!values.height || isNaN(heightNum) || heightNum < 40 || heightNum > 280) {
      newErrors.height = 'Ingresa una estatura válida entre 40 y 280 cm (ej. 175).';
    }

    const weightNum = parseFloat(values.weight);
    if (!values.weight || isNaN(weightNum) || weightNum <= 0 || weightNum > 999.99) {
      newErrors.weight = 'Ingresa un peso válido en kg (ej. 75.5).';
    }

    if (!values.sex) {
      newErrors.sex = 'Selecciona tu sexo.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values.birthDate, values.height, values.weight, values.sex]);

  const validateStep4 = useCallback((): boolean => {
    if (!values.isBeginner && values.activityTypes.length === 0) {
      setErrors({
        activityTypes:
          'Selecciona al menos un tipo de actividad o indica que quieres comenzar desde cero.',
      });
      return false;
    }

    setErrors({});
    return true;
  }, [values.activityTypes.length, values.isBeginner]);

  const validateStep6 = useCallback((): boolean => {
    if (!values.exerciseFrequency) {
      setErrors({
        exerciseFrequency: 'Selecciona con qué frecuencia realizas o quieres realizar ejercicio.',
      });
      return false;
    }

    setErrors({});
    return true;
  }, [values.exerciseFrequency]);

  const handleNextStep = useCallback(() => {
    setErrors({});

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
      return;
    }

    if (step === 3) {
      setStep(4);
      return;
    }

    if (step === 4) {
      if (validateStep4()) {
        setStep(5);
      }
      return;
    }

    if (step === 5) {
      setStep(6);
      return;
    }
  }, [step, validateStep2, validateStep4]);

  const handlePrevStep = useCallback(() => {
    setErrors({});
    if (step > 1) {
      setStep((prev) => (prev - 1) as OnboardingStep);
    }
  }, [step]);

  const handleGoToStep = useCallback((targetStep: OnboardingStep) => {
    setErrors({});
    setStep(targetStep);
  }, []);

  const handlePhysicalFieldChange = (
    field: 'birthDate' | 'height' | 'weight' | 'sex',
    value: string
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || errors.general) {
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
    }
  };

  const handlePhysicalFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateStep2()) {
      setStep(3);
    }
  };

  const handleToggleActivity = (activityLabel: string) => {
    setValues((prev) => {
      const exists = prev.activityTypes.includes(activityLabel);
      const nextActivities = exists
        ? prev.activityTypes.filter((item) => item !== activityLabel)
        : [...prev.activityTypes, activityLabel];

      return {
        ...prev,
        activityTypes: nextActivities,
        isBeginner: false,
      };
    });

    if (errors.activityTypes || errors.general) {
      setErrors((prev) => ({
        ...prev,
        activityTypes: undefined,
        general: undefined,
      }));
    }
  };

  const handleSelectBeginner = () => {
    setValues((prev) => ({
      ...prev,
      isBeginner: !prev.isBeginner,
      activityTypes: !prev.isBeginner ? [] : prev.activityTypes,
    }));

    if (errors.activityTypes || errors.general) {
      setErrors((prev) => ({
        ...prev,
        activityTypes: undefined,
        general: undefined,
      }));
    }
  };

  const handleSelectFrequency = (frequencyLabel: string) => {
    setValues((prev) => ({
      ...prev,
      exerciseFrequency: frequencyLabel,
    }));

    if (errors.exerciseFrequency || errors.general) {
      setErrors((prev) => ({
        ...prev,
        exerciseFrequency: undefined,
        general: undefined,
      }));
    }
  };

  const handleFinalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateStep2()) {
      setStep(2);
      return;
    }

    if (!validateStep4()) {
      setStep(4);
      return;
    }

    if (!validateStep6()) {
      return;
    }

    if (!user?.id) {
      setErrors({
        general: 'No se encontró una sesión de usuario activa. Inicia sesión nuevamente.',
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payloadActivities = values.isBeginner
        ? [BEGINNER_ACTIVITY_OPTION]
        : values.activityTypes;

      await onboardingService.saveOnboarding({
        userId: user.id,
        birthDate: values.birthDate,
        height: parseInt(values.height, 10),
        weight: parseFloat(values.weight),
        sex: values.sex as UserSex,
        activityTypes: payloadActivities,
        isBeginner: values.isBeginner,
        exerciseFrequency: values.exerciseFrequency,
      });

      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      setErrors({
        general:
          err instanceof Error
            ? err.message
            : 'Ocurrió un error al guardar tu perfil de ejercicio.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismissError = () => {
    setErrors({});
  };

  return (
    <OnboardingScreen
      step={step}
      user={user}
      values={values}
      errors={errors}
      isSubmitting={isSubmitting}
      onNextStep={handleNextStep}
      onPrevStep={handlePrevStep}
      onGoToStep={handleGoToStep}
      onPhysicalFieldChange={handlePhysicalFieldChange}
      onPhysicalFormSubmit={handlePhysicalFormSubmit}
      onToggleActivity={handleToggleActivity}
      onSelectBeginner={handleSelectBeginner}
      onSelectFrequency={handleSelectFrequency}
      onFinalSubmit={handleFinalSubmit}
      onDismissError={handleDismissError}
    />
  );
}

export default OnboardingContainer;

