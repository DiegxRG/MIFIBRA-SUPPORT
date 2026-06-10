import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';
import { LoginForm } from '../features/auth/components/LoginForm';
import logoMiFibra from '../assets/images/logo-mifibra.png';

export function LoginPage() {
  const { isAuthenticated, mustChangePassword } = useAuthStore();

  if (isAuthenticated) {
    if (mustChangePassword) {
      return <Navigate to="/change-password" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-dark bg-grid page-shell px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="ambient-orb left-[-8rem] top-[-6rem] h-72 w-72 bg-mf-pink/18" />
      <div className="ambient-orb right-[-6rem] top-[20%] h-64 w-64 bg-gs-blue-mid/16" />
      <div className="ambient-orb bottom-[-8rem] left-[20%] h-80 w-80 bg-gs-orange/12" />

      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-6xl items-center justify-center sm:min-h-[calc(100vh-3rem)]">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="order-2 space-y-5 lg:order-1 lg:pr-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-mf-pink/20 bg-mf-pink/10 px-3 py-1.5 text-xs font-medium text-mf-pink-light">
              <span className="h-2 w-2 rounded-full bg-mf-pink" />
              Acceso interno MiFibra
            </div>

            <div className="space-y-3.5">
              <img src={logoMiFibra} alt="MiFibra" className="h-14 sm:h-16" />
              <div>
                <p className="section-label mb-3">Acceso rapido y seguro</p>
                <h1 className="max-w-xl text-balance text-4xl font-bold leading-[1.02] text-text-primary sm:text-5xl xl:text-[4rem]">
                  Gestiona accesos y zonas activas desde un solo lugar.
                </h1>
              </div>
              <p className="max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
                Entra, revisa tus accesos y sigue cada caso con una vista clara, rapida y ordenada.
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-3">
              <div className="glass-card p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Lista blanca</p>
                    <p className="mt-1.5 text-base font-semibold leading-6 text-text-primary">Autoriza IPs temporales</p>
                  </div>
                  <div className="rounded-xl bg-mf-pink/12 p-2 text-mf-pink-light">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-5 text-text-secondary">Habilita accesos por el tiempo necesario y con respaldo de ticket.</p>
              </div>
              <div className="glass-card p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Lista negra</p>
                    <p className="mt-1.5 text-base font-semibold leading-6 text-text-primary">Bloquea accesos de riesgo</p>
                  </div>
                  <div className="rounded-xl bg-status-expired/12 p-2 text-status-expired">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-5 text-text-secondary">Retira accesos sensibles y mantén el control de casos críticos.</p>
              </div>
              <div className="glass-card p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Cobertura</p>
                    <p className="mt-1.5 text-base font-semibold leading-6 text-text-primary">Visualiza actividad por zona</p>
                  </div>
                  <div className="rounded-xl bg-gs-blue-mid/12 p-2 text-gs-blue-light">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 11-8 11s-8-5-8-11a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-5 text-text-secondary">Ubica rápidamente dónde se concentra el movimiento y prioriza mejor.</p>
              </div>
            </div>
          </div>

          <div className="order-1 w-full max-w-md justify-self-center animate-slide-up lg:order-2 lg:max-w-none">
            <div className="glass-card p-7 sm:p-8 lg:p-9">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="section-label mb-2">Ingreso seguro</p>
                  <h2 className="text-3xl font-bold text-gradient">GeoShield Accesos</h2>
                </div>
                <div className="hidden h-12 w-12 rounded-2xl border border-mf-pink/20 bg-mf-pink/10 text-mf-pink sm:flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
              </div>

              <p className="mb-7 text-sm leading-6 text-text-secondary sm:text-base">
                Ingresa con tu cuenta MiFibra para continuar.
              </p>

              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
