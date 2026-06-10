import { useEffect, useMemo, useState } from 'react';
import { getStats } from '../features/whitelist/services/whitelistService';
import type { WhitelistStats } from '../features/whitelist/types';
import { Spinner } from '../components/ui/Spinner';
import { useAuthStore } from '../features/auth/store/authStore';
import { getCoverageOverview } from '../features/coverage/services/coverageService';
import type { CoverageOverview } from '../features/coverage/types';
import { PeruCoverageMap } from '../features/coverage/components/PeruCoverageMap';
import { CoverageLegend } from '../features/coverage/components/CoverageLegend';
import { CoverageRegionList } from '../features/coverage/components/CoverageRegionList';
import { getStats as getBlacklistStats } from '../features/blacklist/services/blacklistService';
import type { BlacklistStats } from '../features/blacklist/types';

function MiniTrendBars({ values }: { values: number[] }) {
  const maxValue = Math.max(...values, 1);

  return (
    <div className="flex items-end gap-1.5">
      {values.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className="w-2.5 rounded-full bg-gradient-brand opacity-90"
          style={{ height: `${Math.max(16, (value / maxValue) * 52)}px` }}
        />
      ))}
    </div>
  );
}

export function DashboardPage() {
  const [stats, setStats] = useState<WhitelistStats | null>(null);
  const [blacklistStats, setBlacklistStats] = useState<BlacklistStats | null>(null);
  const [coverage, setCoverage] = useState<CoverageOverview | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsData, coverageData, blacklistData] = await Promise.all([
          getStats(),
          getCoverageOverview(),
          getBlacklistStats(),
        ]);
        setStats(statsData);
        setCoverage(coverageData);
        setBlacklistStats(blacklistData);
        setSelectedRegionId(coverageData.regions[0]?.id ?? null);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const selectedRegion = useMemo(
    () => coverage?.regions.find((region) => region.id === selectedRegionId) ?? coverage?.regions[0] ?? null,
    [coverage, selectedRegionId]
  );

  const regionShare = selectedRegion && coverage
    ? ((selectedRegion.activeIps / coverage.totalActiveIps) * 100).toFixed(1)
    : '0.0';

  const intensityLabel = selectedRegion
    ? selectedRegion.intensity >= 0.72
      ? 'Mucho movimiento hoy'
      : selectedRegion.intensity >= 0.4
        ? 'Movimiento estable'
        : 'Actividad ligera'
    : 'Sin datos';

  const topRegionValues = coverage?.regions.slice(0, 5).map((region) => region.activeIps) ?? [];

  if (isLoading || !stats || !coverage || !selectedRegion || !blacklistStats) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" className="text-gs-orange" />
      </div>
    );
  }

  const priorityCards = [
    {
      title: 'Whitelist activa',
      value: stats.totalActive,
      hint: 'IPs permitidas',
      accent: 'border-t-status-active',
      hintClassName: 'text-status-active',
    },
    {
      title: 'Registros hoy',
      value: stats.registeredToday,
      hint: 'Nuevos accesos',
      accent: 'border-t-mf-pink',
      hintClassName: 'text-mf-pink-light',
    },
    {
      title: 'Blacklist activa',
      value: blacklistStats.totalActive,
      hint: 'IPs bloqueadas',
      accent: 'border-t-status-expired',
      hintClassName: 'text-status-expired',
    },
    {
      title: 'Vencen pronto',
      value: blacklistStats.expiringSoon,
      hint: 'Por revisar',
      accent: 'border-t-status-pending',
      hintClassName: 'text-status-pending',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="section-label mb-2">Resumen operativo</p>
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">Hola, {user?.name}</h1>
          <p className="text-text-secondary mt-1 max-w-xl">Revisa en segundos dónde tienes más accesos activos y qué zonas necesitan atención.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[620px]">
          <div className="glass-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Zonas activas</p>
                <p className="mt-2 text-3xl font-bold text-text-primary">{coverage.activeRegions}</p>
              </div>
              <div className="rounded-2xl bg-mf-pink/12 p-2.5 text-mf-pink-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 11-8 11s-8-5-8-11a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Casos en seguimiento</p>
                <p className="mt-2 text-3xl font-bold text-text-primary">{coverage.totalTickets}</p>
              </div>
              <div className="rounded-2xl bg-gs-blue-mid/12 p-2.5 text-gs-blue-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Zona con más movimiento</p>
                <p className="mt-2 text-lg font-semibold text-gs-orange">{coverage.regions[0]?.name}</p>
              </div>
              <MiniTrendBars values={topRegionValues} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {priorityCards.map((card) => (
          <div key={card.title} className={`stat-card border-t-4 ${card.accent}`}>
            <p className="text-sm font-medium uppercase tracking-wider text-text-secondary">{card.title}</p>
            <div className="mt-1 flex items-end gap-2">
              <h3 className="text-4xl font-bold text-text-primary">{card.value}</h3>
              <span className={`mb-1 text-sm font-medium ${card.hintClassName}`}>{card.hint}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="glass-card p-5 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-label mb-2">Panorama por zona</p>
            <h2 className="text-2xl font-bold text-text-primary">Tus accesos en el mapa</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
              Descubre al instante dónde se concentra la actividad y qué zonas necesitan más atención.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:max-w-[420px]">
            <div className="rounded-2xl border border-border-subtle/60 bg-surface/50 p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Cobertura</p>
              <p className="mt-2 text-lg font-semibold text-text-primary">Mapa activo</p>
            </div>
            <div className="rounded-2xl border border-border-subtle/60 bg-surface/50 p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Seguimiento</p>
              <p className="mt-2 text-lg font-semibold text-text-primary">Tiempo real</p>
            </div>
            <div className="rounded-2xl border border-border-subtle/60 bg-surface/50 p-3 col-span-2 sm:col-span-1">
              <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Enfoque</p>
              <p className="mt-2 text-lg font-semibold text-text-primary">Por zona</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <PeruCoverageMap
            regions={coverage.regions}
            selectedRegionId={selectedRegion.id}
            onSelectRegion={setSelectedRegionId}
          />

          <div className="space-y-4">
            <div className="rounded-3xl border border-border-subtle/60 bg-surface/55 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="section-label mb-2">Zona destacada</p>
                  <h3 className="text-2xl font-bold text-text-primary">{selectedRegion.name}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{intensityLabel}. Hoy concentra {regionShare}% de las IPs activas visibles.</p>
                </div>
                <div className="rounded-2xl border border-gs-orange/20 bg-gs-orange/10 px-3 py-2 text-right">
                  <p className="text-xs uppercase tracking-[0.18em] text-gs-orange-light">Activas</p>
                  <p className="mt-1 text-2xl font-bold text-gs-orange">{selectedRegion.activeIps}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border-subtle/60 bg-mf-darker/45 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Tickets</p>
                  <p className="mt-2 text-xl font-semibold text-text-primary">{selectedRegion.tickets}</p>
                </div>
                <div className="rounded-2xl border border-border-subtle/60 bg-mf-darker/45 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Revocadas</p>
                  <p className="mt-2 text-xl font-semibold text-text-primary">{selectedRegion.revokedIps}</p>
                </div>
                <div className="rounded-2xl border border-border-subtle/60 bg-mf-darker/45 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Expiradas</p>
                  <p className="mt-2 text-xl font-semibold text-text-primary">{selectedRegion.expiredIps}</p>
                </div>
                <div className="rounded-2xl border border-border-subtle/60 bg-mf-darker/45 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Peso en el mapa</p>
                  <p className="mt-2 text-xl font-semibold text-text-primary">{Math.round(selectedRegion.intensity * 100)}%</p>
                </div>
              </div>
            </div>

            <CoverageLegend />
          </div>
        </div>

        <CoverageRegionList
          regions={coverage.regions}
          selectedRegionId={selectedRegion.id}
          onSelectRegion={setSelectedRegionId}
        />
      </section>

      {/* Info Banner */}
      <div className="bg-gs-blue-mid/10 border border-gs-blue-mid/20 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <div className="p-4 bg-gs-blue-mid/20 rounded-xl shrink-0 text-gs-blue-light">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-text-primary">Estado del sistema</h4>
          <p className="text-text-secondary mt-1 max-w-2xl text-sm leading-relaxed">
            Todo marcha con normalidad. Cuando autorizas una IP, el cambio puede reflejarse en hasta <strong>2 minutos</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
