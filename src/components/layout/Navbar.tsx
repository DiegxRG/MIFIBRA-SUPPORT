import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';
import logoMiFibra from '../../assets/images/logo-mifibra.png';

const userNavItems = [
  { to: '/dashboard', label: 'Mis solicitudes' },
];

const adminNavItems = [
  { to: '/admin/pending', label: 'Pendientes' },
  { to: '/admin/requests', label: 'Todas las solicitudes' },
  { to: '/admin/users', label: 'Usuarios' },
  { to: '/admin/firewall', label: 'Firewall' },
];

function getRoleLabel(role: string | undefined) {
  if (role === 'ADMIN') return 'Administrador';
  if (role === 'USER') return 'Usuario';
  return role ?? '';
}

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border-subtle/60 bg-mf-darker/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <img src={logoMiFibra} alt="MiFibra" className="h-9 sm:h-10" />
            <div className="hidden sm:block h-6 w-px bg-border-subtle/80 mx-1" />
            <div className="hidden sm:block">
              <span className="font-bold text-gradient text-lg tracking-tight">GeoShield</span>
              <p className="text-xs text-text-muted">{isAdmin ? 'NOC / Operación' : 'Call Center / Soporte'}</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-border-subtle/70 bg-surface/60 p-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-gs-orange/15 text-gs-orange' : 'text-text-secondary hover:text-text-primary'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-sm font-medium text-text-primary">{user?.name}</span>
              <span className="text-xs text-text-muted capitalize">{getRoleLabel(user?.role)}</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm shadow-glow-orange">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="hidden md:inline-flex items-center justify-center rounded-xl px-3 py-2 text-text-secondary hover:text-text-primary transition-colors"
              title="Cerrar Sesión"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-border-subtle/70 bg-surface/70 p-2 text-text-primary md:hidden"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-border-subtle/60 py-4 md:hidden animate-slide-down">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-gs-orange/40 bg-gs-orange/10 text-gs-orange'
                        : 'border-border-subtle/60 bg-surface/55 text-text-secondary'
                    }`}
                  >
                    {item.label}
                  </NavLink>
                );
              })}

              <div className="mt-2 rounded-2xl border border-border-subtle/60 bg-surface/55 p-4">
                <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                <p className="text-xs capitalize text-text-muted mt-1">{getRoleLabel(user?.role)}</p>
                <button onClick={handleLogout} className="btn-ghost mt-3 w-full justify-center">
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
