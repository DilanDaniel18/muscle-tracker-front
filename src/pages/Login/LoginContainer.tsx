import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  AuthViewMode,
  FormErrors,
  NotificationState,
  RegisteredUser,
  User,
  UserSex,
} from './LoginTypes';
import { loginService } from './LoginService';
import { LoginScreen } from './LoginScreen';

export function LoginContainer() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pendingUser, setPendingUser] = useState<RegisteredUser | null>(null);
  const [mode, setMode] = useState<AuthViewMode>('login');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [loginValues, setLoginValues] = useState({
    email: '',
    password: '',
  });

  const [registerValues, setRegisterValues] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [additionalValues, setAdditionalValues] = useState<{
    birthDate: string;
    weight: string;
    height: string;
    sex: UserSex | '';
  }>({
    birthDate: '',
    weight: '',
    height: '',
    sex: '',
  });

  useEffect(() => {
    const user = loginService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setMode('welcome');
    }
  }, []);

  const handleModeChange = (newMode: AuthViewMode) => {
    setMode(newMode);
    setNotification(null);
    setErrors({});
  };

  const handleLoginChange = (field: 'email' | 'password', value: string) => {
    setLoginValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRegisterChange = (
    field: 'name' | 'lastName' | 'email' | 'password',
    value: string
  ) => {
    setRegisterValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAdditionalChange = (
    field: 'birthDate' | 'weight' | 'height' | 'sex',
    value: string
  ) => {
    setAdditionalValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDismissNotification = () => {
    setNotification(null);
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotification(null);
    const newErrors: FormErrors = {};

    if (!loginValues.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    }
    if (!loginValues.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginService.login(loginValues);
      setCurrentUser(user);
      navigate('/dashboard');
    } catch (err: unknown) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error al iniciar sesión.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotification(null);
    const newErrors: FormErrors = {};

    if (!registerValues.name.trim()) {
      newErrors.name = 'El nombre es obligatorio.';
    }
    if (!registerValues.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio.';
    }
    if (!registerValues.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    }
    if (!registerValues.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (registerValues.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginService.register(registerValues);
      setPendingUser(user);
      setMode('additional-data');
      setNotification({
        type: 'success',
        message: `¡Cuenta creada para ${user.name}! Por favor, completa tus medidas para calibrar la app.`,
      });
    } catch (err: unknown) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error al registrar la cuenta.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdditionalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pendingUser) {
      setNotification({
        type: 'error',
        message: 'No se encontró el ID de usuario registrado.',
      });
      return;
    }

    setNotification(null);
    const newErrors: FormErrors = {};

    if (!additionalValues.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria.';
    }
    const weightNum = parseFloat(additionalValues.weight);
    if (!additionalValues.weight || isNaN(weightNum) || weightNum <= 0) {
      newErrors.weight = 'Ingresa un peso válido en kg (ej. 75.5).';
    }
    const heightNum = parseInt(additionalValues.height, 10);
    if (!additionalValues.height || isNaN(heightNum) || heightNum < 50 || heightNum > 260) {
      newErrors.height = 'Ingresa una altura válida en cm (ej. 175).';
    }
    if (!additionalValues.sex) {
      newErrors.sex = 'Selecciona tu sexo biológico.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await loginService.updateAdditionalData({
        id: pendingUser.id,
        birthDate: additionalValues.birthDate,
        weight: weightNum,
        height: heightNum,
        sex: additionalValues.sex as UserSex,
      });

      setCurrentUser(updatedUser);
      setPendingUser(null);
      navigate('/dashboard');
    } catch (err: unknown) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error al guardar datos adicionales.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipAdditional = () => {
    if (pendingUser) {
      const basicUser: User = {
        id: pendingUser.id,
        name: pendingUser.name,
        lastName: pendingUser.lastName,
        email: pendingUser.email,
      };
      loginService.setCurrentUser(basicUser);
      setCurrentUser(basicUser);
      setPendingUser(null);
      navigate('/dashboard');
    } else {
      setMode('login');
    }
  };

  const handleLogout = () => {
    loginService.logout();
    setCurrentUser(null);
    setPendingUser(null);
    setMode('login');
    setNotification({
      type: 'info',
      message: 'Sesión finalizada correctamente.',
    });
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <LoginScreen
      mode={mode}
      isLoading={isLoading}
      notification={notification}
      errors={errors}
      currentUser={currentUser}
      pendingUser={pendingUser}
      loginValues={loginValues}
      registerValues={registerValues}
      additionalValues={additionalValues}
      onModeChange={handleModeChange}
      onLoginChange={handleLoginChange}
      onRegisterChange={handleRegisterChange}
      onAdditionalChange={handleAdditionalChange}
      onLoginSubmit={handleLoginSubmit}
      onRegisterSubmit={handleRegisterSubmit}
      onAdditionalSubmit={handleAdditionalSubmit}
      onSkipAdditional={handleSkipAdditional}
      onLogout={handleLogout}
      onDismissNotification={handleDismissNotification}
      onNavigateToDashboard={handleNavigateToDashboard}
    />
  );
}

export default LoginContainer;
