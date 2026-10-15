export type UserSex = 'M' | 'F' | 'O';

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  birthDate?: string | null;
  weight?: number | null;
  height?: number | null;
  sex?: UserSex | null;
}

export interface RegisteredUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AdditionalUserData {
  id: string;
  birthDate: string;
  weight: number;
  height: number;
  sex: UserSex;
}

export type AuthViewMode = 'login' | 'register' | 'additional-data' | 'welcome';

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface NotificationState {
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface LoginPageProps {
  mode: AuthViewMode;
  isLoading: boolean;
  notification: NotificationState | null;
  errors: FormErrors;
  currentUser: User | null;
  pendingUser: RegisteredUser | null;

  // Form value
  loginValues: {
    email: string;
    password: string;
  };
  registerValues: {
    name: string;
    lastName: string;
    email: string;
    password: string;
  };
  additionalValues: {
    birthDate: string;
    weight: string;
    height: string;
    sex: UserSex | '';
  };

  onModeChange: (mode: AuthViewMode) => void;
  onLoginChange: (field: 'email' | 'password', value: string) => void;
  onRegisterChange: (field: 'name' | 'lastName' | 'email' | 'password', value: string) => void;
  onAdditionalChange: (field: 'birthDate' | 'weight' | 'height' | 'sex', value: string) => void;
  onLoginSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onRegisterSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onAdditionalSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSkipAdditional: () => void;
  onLogout: () => void;
  onDismissNotification: () => void;
}
