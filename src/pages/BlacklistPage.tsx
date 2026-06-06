import { RegisterBlockForm } from '../features/blacklist/components/RegisterBlockForm';
import { BlacklistTable } from '../features/blacklist/components/BlacklistTable';

export function BlacklistPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Gestión de Blacklist</h1>
        <p className="text-text-secondary mt-1">Bloquea IPs de forma temporal, sigue el motivo y retira accesos cuando corresponda.</p>
      </div>

      <div className="glass-card p-5 md:p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-status-expired"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
          Nuevo Bloqueo IP
        </h2>
        <RegisterBlockForm />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">Historial de Bloqueos</h2>
        <BlacklistTable />
      </div>
    </div>
  );
}
