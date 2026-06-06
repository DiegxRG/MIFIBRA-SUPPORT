import type { CoverageRegionMetric } from '../types';
import { cn } from '../../../lib/utils';

interface CoverageRegionListProps {
  regions: CoverageRegionMetric[];
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
}

export function CoverageRegionList({ regions, selectedRegionId, onSelectRegion }: CoverageRegionListProps) {
  const highlightedRegions = regions.slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label mb-2">Zonas destacadas</p>
          <h3 className="text-xl font-bold text-text-primary">Donde hoy tienes mas movimiento</h3>
        </div>
        <p className="text-sm text-text-secondary">Tambien puedes tocar una tarjeta para cambiar la vista.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {highlightedRegions.map((region) => {
          const isSelected = region.id === selectedRegionId;

          return (
            <button
              key={region.id}
              type="button"
              onClick={() => onSelectRegion(region.id)}
              className={cn(
                'rounded-3xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-gs-orange/40 hover:bg-surface-hover/60',
                isSelected
                  ? 'border-gs-orange/40 bg-gs-orange/10 shadow-glow-orange/20'
                  : 'border-border-subtle/60 bg-surface/50'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{region.name}</p>
                  <p className="mt-1 text-xs text-text-muted">{region.tickets} tickets asociados</p>
                </div>
                <div className="rounded-2xl bg-mf-darker/60 px-3 py-2 text-right">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Activas</p>
                  <p className="mt-1 text-lg font-bold text-gs-orange">{region.activeIps}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
                <span>Revocadas: {region.revokedIps}</span>
                <span>Expiradas: {region.expiredIps}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
