import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import logoMiFibra from '../assets/images/logo-mifibra.png';

export function RouteErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const message = isRouteErrorResponse(error)
    ? error.statusText || 'No pudimos cargar esta pantalla.'
    : error instanceof Error
      ? error.message
      : 'Ocurrio un problema inesperado.';

  return (
    <div className="min-h-screen bg-gradient-dark bg-grid page-shell flex items-center justify-center px-4 py-8">
      <div className="ambient-orb left-[-8rem] top-[-6rem] h-72 w-72 bg-mf-pink/18" />
      <div className="ambient-orb right-[-6rem] bottom-[-6rem] h-72 w-72 bg-gs-blue-mid/14" />

      <div className="glass-card relative w-full max-w-xl p-8 sm:p-10 text-center">
        <img src={logoMiFibra} alt="MiFibra" className="mx-auto h-14" />
        <p className="section-label mt-6 mb-3">Algo salio mal</p>
        <h1 className="text-3xl font-bold text-text-primary">No pudimos abrir esta vista</h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">
          Intenta volver al panel principal. Si el problema continua, el equipo interno puede revisar el detalle tecnico.
        </p>

        <div className="mt-6 rounded-2xl border border-border-subtle/60 bg-surface/55 p-4 text-left text-sm text-text-secondary">
          {message}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => navigate('/dashboard')}>Ir al panel</Button>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Recargar
          </Button>
        </div>
      </div>
    </div>
  );
}
