import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  registerBlacklistSchema,
  type RegisterBlacklistFormData,
  type RegisterBlacklistFormInput,
} from '../../../lib/validators';
import { useBlacklistStore } from '../store/blacklistStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';

const presetOptions = [
  { value: 24, title: '24h', description: 'Bloqueo breve', accent: 'Rápido' },
  { value: 72, title: '72h', description: 'Seguimiento', accent: 'Estándar' },
  { value: 168, title: '7d', description: 'Semana completa', accent: 'Extendido' },
] as const;

export function RegisterBlockForm() {
  const { registerBlock, isRegistering } = useBlacklistStore();
  const [confirmData, setConfirmData] = useState<RegisterBlacklistFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterBlacklistFormInput, unknown, RegisterBlacklistFormData>({
    resolver: zodResolver(registerBlacklistSchema),
    defaultValues: {
      clientIP: '',
      ticketId: '',
      reason: '',
      blockHours: 24,
    },
  });

  const selectedHours = watch('blockHours');
  const isCustomDuration = !presetOptions.some((option) => option.value === selectedHours);

  const selectPreset = (hours: number) => {
    setValue('blockHours', hours, { shouldDirty: true, shouldValidate: true });
  };

  const activateCustomDuration = () => {
    if (!isCustomDuration) {
      setValue('blockHours', 240, { shouldDirty: true, shouldValidate: true });
    }
  };

  const onRequestSubmit = (data: RegisterBlacklistFormData) => {
    setConfirmData(data);
  };

  const handleConfirm = async () => {
    if (!confirmData) return;

    try {
      await registerBlock(confirmData);
      toast.success('Bloqueo aplicado', {
        description: `La IP ${confirmData.clientIP} ya fue enviada a blacklist.`,
      });
      reset();
      setConfirmData(null);
    } catch (err: any) {
      toast.error('No pudimos bloquear', {
        description: err.response?.data?.message || 'Intenta nuevamente.',
      });
      setConfirmData(null);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onRequestSubmit)} className="flex flex-col gap-5">
        <input type="hidden" {...register('blockHours', { valueAsNumber: true })} />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                label="IP a bloquear"
                placeholder="190.119.45.172"
                helperText="Solo IPs públicas válidas"
                error={errors.clientIP?.message}
                {...register('clientIP')}
              />

              <Input
                label="Ticket asociado"
                placeholder="TK-2026-8912"
                helperText="Caso que respalda el bloqueo"
                error={errors.ticketId?.message}
                {...register('ticketId')}
              />
            </div>

            <Input
              label="Motivo"
              placeholder="Ej. acceso fuera de política"
              helperText="Describe por qué esta IP debe bloquearse"
              error={errors.reason?.message}
              {...register('reason')}
            />

            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Tiempo de bloqueo</label>
                  <p className="mt-1 text-xs text-text-muted">Usa un tiempo sugerido o ajusta uno personalizado.</p>
                </div>
                <div className="rounded-full border border-border-subtle/60 bg-surface/55 px-3 py-1.5 text-xs text-text-secondary">
                  Hasta 720 horas
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
                          ? 'border-status-expired/50 bg-status-expired/10 shadow-card'
                          : 'border-border-subtle/70 bg-surface/55 hover:border-status-expired/30 hover:bg-surface-hover/55'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xl font-bold text-text-primary">{option.title}</p>
                          <p className="mt-1 text-xs text-text-secondary">{option.description}</p>
                        </div>
                        <span className={cn(
                          'rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
                          isSelected ? 'bg-status-expired/15 text-status-expired' : 'bg-mf-darker/70 text-text-muted'
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
                      max={720}
                      value={isCustomDuration && Number.isFinite(selectedHours) ? selectedHours : ''}
                      onFocus={activateCustomDuration}
                      onChange={(event) => {
                        const value = event.target.value;
                        setValue('blockHours', value === '' ? Number.NaN : Number(value), {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                      className="w-full bg-transparent text-lg font-bold text-text-primary outline-none"
                      placeholder="240"
                    />
                    <span className="text-sm text-text-secondary">horas</span>
                  </div>
                </div>
              </div>

              {errors.blockHours && <p className="text-xs mt-0.5 text-status-expired">{errors.blockHours.message}</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-status-expired/20 bg-gradient-to-br from-status-expired/10 via-transparent to-gs-blue-mid/10 p-4">
            <p className="section-label mb-3">Vista rápida</p>
            <div className="space-y-3.5">
              <div>
                <p className="text-sm text-text-secondary">Tiempo seleccionado</p>
                <p className="mt-1.5 text-2xl font-bold text-text-primary">{Number.isFinite(selectedHours) ? selectedHours : '--'}h</p>
              </div>

              <div className="rounded-xl border border-border-subtle/60 bg-mf-darker/60 p-3.5 text-sm text-text-secondary">
                <p className="font-semibold text-text-primary">Qué hace este bloqueo</p>
                <p className="mt-1.5 leading-5">Envía la IP a blacklist para impedir el acceso temporalmente hasta que venza o se retire.</p>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-xl border border-border-subtle/60 bg-surface/50 p-3.5">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Uso común</p>
                  <p className="mt-1.5 text-sm font-semibold text-text-primary">24h o 72h</p>
                </div>
                <div className="rounded-xl border border-border-subtle/60 bg-surface/50 p-3.5">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Límite</p>
                  <p className="mt-1.5 text-sm font-semibold text-text-primary">Hasta 30 días</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border-subtle/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-secondary">Aplica bloqueos solo cuando el caso y el motivo estén claramente documentados.</p>
          <Button type="submit" className="w-full sm:w-auto" size="lg">
            Enviar a Blacklist
          </Button>
        </div>
      </form>

      <Modal
        isOpen={!!confirmData}
        onClose={() => setConfirmData(null)}
        title="Confirmar bloqueo"
        description="Revisa los datos antes de aplicar el bloqueo temporal."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmData(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirm} isLoading={isRegistering}>
              Confirmar bloqueo
            </Button>
          </>
        }
      >
        {confirmData && (
          <div className="space-y-4">
            <div className="bg-surface/50 p-4 rounded-xl border border-border-subtle/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider">IP</p>
                  <p className="text-lg font-mono text-text-primary mt-1">{confirmData.clientIP}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider">Ticket</p>
                  <p className="text-lg font-medium text-text-primary mt-1">{confirmData.ticketId}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider">Motivo</p>
                  <p className="text-base font-medium text-text-primary mt-1">{confirmData.reason}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider">Duracion</p>
                  <p className="text-base font-medium text-status-expired mt-1">{confirmData.blockHours} horas</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-status-expired/10 border border-status-expired/20 rounded-lg flex gap-3 text-status-expired text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
              <p>Durante este tiempo la IP quedara marcada como no permitida hasta que venza o la retires manualmente.</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
