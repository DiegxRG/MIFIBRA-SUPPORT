export function CoverageLegend() {
  return (
    <div className="rounded-3xl border border-border-subtle/60 bg-surface/55 p-5">
      <p className="section-label mb-3">Como leerlo</p>
      <div className="space-y-4">
        <div>
          <div className="h-3 rounded-full bg-gradient-brand" />
          <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
            <span>Menos movimiento</span>
            <span>Mas movimiento</span>
          </div>
        </div>

        <div className="grid gap-2 text-sm text-text-secondary">
          <p><span className="font-semibold text-text-primary">Color:</span> cuantas IPs activas ves en cada zona.</p>
          <p><span className="font-semibold text-text-primary">Circulo:</span> el peso visual de esa actividad.</p>
          <p><span className="font-semibold text-text-primary">Toca el mapa:</span> y revisa el detalle al instante.</p>
        </div>
      </div>
    </div>
  );
}
