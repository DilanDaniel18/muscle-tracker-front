import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '../../types/user';
import { loginService } from '../../pages/Login/LoginService';
import './TopBar.css';

export interface TopBarProps {
  user?: User | null;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

function DumbbellBoltIcon() {
  return (
    <svg
      className="mt-topbar-logo-icon"
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

export function TopBar({
  user: initialUser,
  onLogout,
  onProfileClick,
  onSettingsClick,
}: TopBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // If user prop is not provided, read from local storage service
  const [currentUser, setCurrentUser] = useState<User | null>(
    () => initialUser ?? loginService.getCurrentUser()
  );

  useEffect(() => {
    if (initialUser !== undefined) {
      setCurrentUser(initialUser);
    } else {
      setCurrentUser(loginService.getCurrentUser());
    }
  }, [initialUser]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (action?: () => void) => {
    setIsOpen(false);
    if (action) {
      action();
    }
  };

  const handleLogoutAction = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      loginService.logout();
      navigate('/');
    }
  };

  const userInitial = currentUser?.name
    ? currentUser.name.charAt(0).toUpperCase()
    : null;

  return (
    <header className="mt-topbar" role="banner">
      <div className="mt-topbar-container">
        {/* Left: Brand hyperlink to /dashboard */}
        <div className="mt-topbar-left">
          <Link
            to="/dashboard"
            className="mt-topbar-brand"
            aria-label="MuscleTracker - Ir al Dashboard"
          >
            <div className="mt-topbar-brand-icon-wrapper">
              <DumbbellBoltIcon />
            </div>
            <div className="mt-topbar-brand-text">
              <span className="mt-brand-word-muscle">Muscle</span>
              <span className="mt-brand-word-tracker">Tracker</span>
            </div>
          </Link>
        </div>

        {/* Right: User Menu */}
        <div className="mt-topbar-right" ref={dropdownRef}>
          <button
            type="button"
            className={`mt-topbar-user-btn ${isOpen ? 'active' : ''}`}
            onClick={handleToggleDropdown}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-label="Menú de usuario"
          >
            <div className="mt-topbar-avatar">
              {userInitial ? (
                <span className="mt-avatar-letter">{userInitial}</span>
              ) : (
                <span className="material-symbols-outlined mt-avatar-icon" aria-hidden="true">
                  person
                </span>
              )}
            </div>
            {currentUser?.name && (
              <span className="mt-topbar-username">{currentUser.name}</span>
            )}
            <span
              className={`material-symbols-outlined mt-topbar-chevron ${
                isOpen ? 'rotate' : ''
              }`}
              aria-hidden="true"
            >
              expand_more
            </span>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              className="mt-topbar-dropdown"
              role="menu"
              aria-label="Opciones de cuenta"
            >
              {currentUser && (
                <div className="mt-dropdown-header">
                  <div className="mt-dropdown-user-info">
                    <p className="mt-dropdown-fullname">
                      {currentUser.name} {currentUser.lastName || ''}
                    </p>
                    <p className="mt-dropdown-email">{currentUser.email}</p>
                  </div>
                </div>
              )}

              <div className="mt-dropdown-menu-items">
                <button
                  type="button"
                  className="mt-dropdown-item"
                  role="menuitem"
                  onClick={() => handleItemClick(onProfileClick)}
                >
                  <span className="material-symbols-outlined mt-dropdown-icon" aria-hidden="true">
                    account_circle
                  </span>
                  <span>Perfil</span>
                </button>

                <button
                  type="button"
                  className="mt-dropdown-item"
                  role="menuitem"
                  onClick={() => handleItemClick(onSettingsClick)}
                >
                  <span className="material-symbols-outlined mt-dropdown-icon" aria-hidden="true">
                    settings
                  </span>
                  <span>Ajustes de la aplicación</span>
                </button>

                <div className="mt-dropdown-divider" role="separator" />

                <button
                  type="button"
                  className="mt-dropdown-item mt-dropdown-item-danger"
                  role="menuitem"
                  onClick={handleLogoutAction}
                >
                  <span className="material-symbols-outlined mt-dropdown-icon" aria-hidden="true">
                    logout
                  </span>
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
