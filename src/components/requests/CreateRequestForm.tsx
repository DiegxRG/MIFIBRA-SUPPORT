import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { SubmitHandler } from 'react-hook-form';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { checkIp } from '@/api/requests';

const REASON_MAX_LENGTH = 1000;

const schema = z.object({
  client_ip: z
    .string()
    .min(1, 'La IP es obligatoria')
    .regex(/^(\d{1,3}\.){3}\d{1,3}$/, 'Ingresa una IPv4 valida (ej. 181.65.120.55)'),
  client_name: z.string().optional().default(''),
  ticket_support: z.string().optional().default(''),
  reason: z
    .string()
    .min(10, 'Describe el motivo con al menos 10 caracteres')
    .max(REASON_MAX_LENGTH, `Maximo ${REASON_MAX_LENGTH} caracteres`),
  access_type: z.enum(['TEMPORARY', 'PERMANENT']),
  requested_duration_minutes: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().gt(0, 'Debe ser mayor a 0').optional()
  ),
}).superRefine((data, ctx) => {
  if (data.access_type === 'TEMPORARY' && !data.requested_duration_minutes) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['requested_duration_minutes'], message: 'La duracion es obligatoria para acceso temporal' });
  }
});

export type CreateRequestFormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: CreateRequestFormData) => Promise<void>;
  loading?: boolean;
}

export default function CreateRequestForm({ onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof schema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      client_ip: '',
      client_name: '',
      ticket_support: '',
      reason: '',
      access_type: 'TEMPORARY',
      requested_duration_minutes: undefined,
    },
  });

  const accessType = watch('access_type');
  const reason = watch('reason') || '';
  const clientIp = watch('client_ip');

  const [ipWarning, setIpWarning] = useState<string | null>(null);
  const [ipChecking, setIpChecking] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (accessType === 'PERMANENT') {
      setValue('requested_duration_minutes', undefined);
    }
  }, [accessType, setValue]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const ip = clientIp?.trim();
    if (!ip || !/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
      setIpWarning(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIpChecking(true);
      try {
        const result = await checkIp(ip);
        if (!result.available) {
          setIpWarning(result.message);
        } else {
          setIpWarning(null);
        }
      } catch {
        setIpWarning(null);
      } finally {
        setIpChecking(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [clientIp]);

  const submitHandler: SubmitHandler<z.input<typeof schema>> = (data) => {
    if (ipWarning) return;
    onSubmit(data as CreateRequestFormData);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">IP del cliente *</label>
        <input {...register('client_ip')} placeholder="Ej: 181.65.120.55" className="input-base" />
        <p className="mt-1 text-xs text-text-muted">Debe ser una IPv4 publica valida.</p>
        <p className="mt-1 text-xs text-text-muted">No se permite RFC1918, loopback, multicast ni reserved.</p>
        {errors.client_ip && <p className="mt-1 text-xs text-status-expired">{errors.client_ip.message}</p>}
        {ipWarning && (
          <p className="mt-1 text-xs text-status-pending flex items-center gap-1">
            <AlertTriangle size={12} />
            {ipWarning}
          </p>
        )}
        {ipChecking && (
          <p className="mt-1 text-xs text-text-muted">Verificando IP...</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Nombre del titular</label>
          <input {...register('client_name')} placeholder="Opcional" className="input-base" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Ticket de soporte</label>
          <input {...register('ticket_support')} placeholder="Ej: MF-2026-000123" className="input-base" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Motivo *</label>
        <textarea
          {...register('reason')}
          rows={4}
          placeholder={'Cliente reporta bloqueo incorrecto en MiFibraTV.\nValidado por soporte.\nSolicita acceso temporal.'}
          className="input-base resize-none"
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.reason ? <p className="text-xs text-status-expired">{errors.reason.message}</p> : <span />}
          <p className="text-xs text-text-muted">{reason.length}/{REASON_MAX_LENGTH}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Tipo de acceso *</label>
        <div className="flex gap-3">
          {(['TEMPORARY', 'PERMANENT'] as const).map((t) => (
            <label
              key={t}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-subtle cursor-pointer has-[:checked]:bg-gs-orange/10 has-[:checked]:border-gs-orange has-[:checked]:text-gs-orange transition-all"
            >
              <input type="radio" value={t} {...register('access_type')} className="accent-gs-orange" />
              {t === 'TEMPORARY' ? 'Temporal' : 'Permanente'}
            </label>
          ))}
        </div>
      </div>

      {accessType === 'TEMPORARY' && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Duracion (minutos) *</label>
          <input {...register('requested_duration_minutes')} type="number" min={1} placeholder="Ej. 60" className="input-base" />
          <p className="mt-1 text-xs text-text-muted">Ej: 60 minutos. 1440 minutos = 1 dia.</p>
          {errors.requested_duration_minutes && <p className="mt-1 text-xs text-status-expired">{errors.requested_duration_minutes.message}</p>}
        </div>
      )}

      <div className="rounded-xl border border-status-pending/30 bg-status-pending/10 p-4">
        <p className="text-sm font-semibold text-text-primary mb-1">IMPORTANTE</p>
        <p className="text-xs text-text-secondary">Solo deben registrarse solicitudes para clientes legitimos.</p>
        <p className="text-xs text-text-secondary">Todas las solicitudes son auditadas por el NOC.</p>
      </div>

      <button type="submit" disabled={loading || !!ipWarning} className="btn-primary w-full justify-center flex items-center gap-2">
        {loading && <Loader2 className="animate-spin" size={18} />}
        {loading ? 'Enviando...' : 'Enviar solicitud'}
      </button>
    </form>
  );
}
