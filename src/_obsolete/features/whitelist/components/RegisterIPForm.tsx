import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerIPSchema, type RegisterIPFormData, type RegisterIPFormInput } from '../../../lib/validators';
import { useWhitelistStore } from '../store/whitelistStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';

const presetOptions = [
  { value: 24, title: '24h', description: '1 día', accent: 'Rápido' },
  { value: 48, title: '48h', description: '2 días', accent: 'Estándar' },
  { value: 72, title: '72h', description: '3 días', accent: 'Extendido' },
] as const;

export function RegisterIPForm() {
  const { registerIP, isRegistering } = useWhitelistStore();
  const [confirmData, setConfirmData] = useState<RegisterIPFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterIPFormInput, unknown, RegisterIPFormData>({
    resolver: zodResolver(registerIPSchema),
    defaultValues: {
      clientIP: '',
      ticketId: '',
      exclusionHours: 24,
    },
  });

  const selectedHours = watch('exclusionHours');
  const isCustomDuration = !presetOptions.some((option) => option.value === selectedHours);

  const selectPreset = (hours: number) => {
    setValue('exclusionHours', hours, { shouldDirty: true, shouldValidate: true });
  };

  const activateCustomDuration = () => {
    if (!isCustomDuration) {
      setValue('exclusionHours', 96, { shouldDirty: true, shouldValidate: true });
    }
  };

  const onRequestSubmit = (data: RegisterIPFormData) => {
    setConfirmData(data); // Open confirmation modal
  };

  const handleConfirm = async () => {
    if (!confirmData) return;
    
    try {
      await registerIP(confirmData);
      toast.success('IP registrada exitosamente', {
        description: `La IP ${confirmData.clientIP} se ha añadido a la Whitelist.`,
      });
      reset();
      setConfirmData(null);
    } catch (err: any) {
      toast.error('Error de registro', {
        description: err.response?.data?.message || 'No se pudo registrar la IP.',
      });
      setConfirmData(null);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onRequestSubmit)} className="flex flex-col gap-5">
        <input type="hidden" {...register('exclusionHours', { valueAsNumber: true })} />

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                label="IP Pública del Cliente"
                placeholder="190.119.45.172"
                helperText="Solo IPs públicas válidas"
                error={errors.clientIP?.message}
                {...register('clientIP')}
              />

              <Input
                label="ID Ticket Soporte"
                placeholder="TK-2026-8849"
                helperText="Ticket que respalda la excepción"
                error={errors.ticketId?.message}
                {...register('ticketId')}
              />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <label className="text-sm font-medium text-text-secondary">Tiempo de exclusión</label>
                <p className="mt-1 text-xs text-text-muted">Usa un tiempo sugerido o ajusta uno personalizado.</p>
              </div>
              <div className="rounded-full border border-border-subtle/60 bg-surface/55 px-3 py-1.5 text-xs text-text-secondary">
                Hasta 168 horas
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {presetOptions.map((option) => {
                  const isSelected = selectedHours === option.value && !isCustomDuration;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => selectPreset(option.value)}
                      className={cn(
                        'group rounded-xl border p-3.5 text-left transition-all duration-200',
                        isSelected
                          ? 'border-mf-pink/50 bg-mf-pink/10 shadow-glow-pink/20'
                          : 'border-border-subtle/70 bg-surface/55 hover:border-mf-pink/30 hover:bg-surface-hover/55'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xl font-bold text-text-primary">{option.title}</p>
                          <p className="mt-1 text-xs text-text-secondary">{option.description}</p>
                        </div>
                        <span className={cn(
                          'rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
                          isSelected ? 'bg-mf-pink/15 text-mf-pink-light' : 'bg-mf-darker/70 text-text-muted'
                        )}>
                          {option.accent}
                        </span>
                      </div>
                    </button>
                  );
                })}

              <div
                className={cn(
                  'rounded-xl border p-3.5 transition-all duration-200',
                  isCustomDuration
                    ? 'border-gs-blue-mid/45 bg-gs-blue-mid/10 shadow-glow-blue/20'
                    : 'border-border-subtle/70 bg-surface/55'
                )}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Personalizado</p>
                    <p className="mt-1 text-[11px] text-text-muted">Tiempo exacto</p>
                  </div>
                  <button
                    type="button"
                    onClick={activateCustomDuration}
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
                      isCustomDuration ? 'bg-gs-blue-mid/15 text-gs-blue-light' : 'bg-mf-darker/70 text-text-muted'
                    )}
                  >
                    Horas
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-border-subtle/60 bg-mf-darker/55 px-3 py-2.5">
                  <input
                    type="number"
                    min={1}
                    max={168}
                    value={isCustomDuration && Number.isFinite(selectedHours) ? selectedHours : ''}
                    onFocus={activateCustomDuration}
                    onChange={(event) => {
                      const value = event.target.value;
                      setValue('exclusionHours', value === '' ? Number.NaN : Number(value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    className="w-full bg-transparent text-lg font-bold text-text-primary outline-none"
                    placeholder="96"
                  />
                  <span className="text-sm text-text-secondary">horas</span>
                </div>
              </div>
            </div>

            {errors.exclusionHours && (
              <p className="text-xs mt-0.5 text-status-expired">{errors.exclusionHours.message}</p>
            )}

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-text-secondary">Confirma solo accesos respaldados por ticket y por el tiempo necesario.</p>
              <Button
                type="submit"
                className="w-full sm:w-auto sm:shrink-0 rounded-2xl px-7 shadow-glow-orange ring-1 ring-mf-pink/20"
                size="lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                Registrar en Whitelist
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!confirmData}
        onClose={() => setConfirmData(null)}
        title="Confirmar Registro"
        description="Verifica los datos antes de aplicar la regla en el firewall GeoShield."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmData(null)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleConfirm} isLoading={isRegistering}>
              Confirmar Registro
            </Button>
          </>
        }
      >
        {confirmData && (
          <div className="space-y-4">
            <div className="bg-surface/50 p-4 rounded-xl border border-border-subtle/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider">IP Cliente</p>
                  <p className="text-lg font-mono text-text-primary mt-1">{confirmData.clientIP}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider">Ticket</p>
                  <p className="text-lg font-medium text-text-primary mt-1">{confirmData.ticketId}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-text-muted uppercase tracking-wider">Duración de Exclusión</p>
                  <p className="text-base font-medium text-gs-orange mt-1">
                    {confirmData.exclusionHours} horas
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-gs-orange/10 border border-gs-orange/20 rounded-lg flex gap-3 text-gs-orange text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
              <p>Esta acción abrirá la IP en el firewall para acceso a todos los servicios web. Asegúrate de que el ticket esté debidamente documentado.</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
