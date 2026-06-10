import { RegisterIPForm } from '../features/whitelist/components/RegisterIPForm';
import { WhitelistTable } from '../features/whitelist/components/WhitelistTable';

export function WhitelistPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Gestión de Whitelist</h1>
        <p className="text-text-secondary mt-1">Autoriza accesos, revisa el historial y exporta reportes con una vista más clara.</p>
      </div>

      {/* Registration Form Card */}
      <div className="glass-card p-5 md:p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gs-orange"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
          Nuevo Registro IP
        </h2>
        <RegisterIPForm />
      </div>

      {/* History Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">Historial Reciente</h2>
        <WhitelistTable />
      </div>
    </div>
  );
}
