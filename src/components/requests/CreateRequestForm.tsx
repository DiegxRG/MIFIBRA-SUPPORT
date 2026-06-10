import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { SubmitHandler } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  client_ip: z
    .string()
    .min(1, 'La IP es obligatoria')
    .regex(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, 'Ingresa una IP valida (ej. 192.168.1.1)'),
  port: z.coerce.number().int().min(1).max(65535),
  protocol: z.enum(['TCP', 'UDP']),
  client_name: z.string().optional().default(''),
  client_document: z.string().optional().default(''),
  reason: z.string().min(10, 'Describe el motivo con al menos 10 caracteres'),
  access_type: z.enum(['TEMPORARY', 'PERMANENT']),
  requested_duration_minutes: z.coerce.number().int().min(1).optional(),
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
    formState: { errors },
  } = useForm<z.input<typeof schema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      client_ip: '',
      port: undefined,
      protocol: 'TCP',
      client_name: '',
      client_document: '',
      reason: '',
      access_type: 'TEMPORARY',
      requested_duration_minutes: undefined,
    },
  });

  const accessType = watch('access_type');

  const submitHandler: SubmitHandler<z.input<typeof schema>> = (data) => onSubmit(data as CreateRequestFormData);

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">IP del cliente *</label>
        <input {...register('client_ip')} placeholder="192.168.1.100" className="input-base" />
        {errors.client_ip && <p className="mt-1 text-xs text-status-expired">{errors.client_ip.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Port *</label>
          <input {...register('port')} type="number" placeholder="8080" className="input-base" />
          {errors.port && <p className="mt-1 text-xs text-status-expired">{errors.port.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Protocolo *</label>
          <select {...register('protocol')} className="input-base">
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Nombre del cliente</label>
          <input {...register('client_name')} placeholder="Opcional" className="input-base" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Documento del cliente</label>
          <input {...register('client_document')} placeholder="Opcional" className="input-base" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Motivo *</label>
        <textarea
          {...register('reason')}
          rows={3}
          placeholder="Describe por que se necesita este acceso..."
          className="input-base resize-none"
        />
        {errors.reason && <p className="mt-1 text-xs text-status-expired">{errors.reason.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Tipo de acceso *</label>
        <div className="flex gap-3">
          {(['TEMPORARY', 'PERMANENT'] as const).map((t) => (
            <label
              key={t}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-subtle cursor-pointer
                         has-[:checked]:bg-gs-orange/10 has-[:checked]:border-gs-orange has-[:checked]:text-gs-orange
                         transition-all"
            >
              <input
                type="radio"
                value={t}
                {...register('access_type')}
                className="accent-gs-orange"
              />
              {t === 'TEMPORARY' ? 'Temporal' : 'Permanente'}
            </label>
          ))}
        </div>
      </div>

      {accessType === 'TEMPORARY' && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Duracion (minutos) *</label>
          <input
            {...register('requested_duration_minutes')}
            type="number"
            min={1}
            placeholder="Ej. 60"
            className="input-base"
          />
          {errors.requested_duration_minutes && (
            <p className="mt-1 text-xs text-status-expired">{errors.requested_duration_minutes.message}</p>
          )}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2">
        {loading && <Loader2 className="animate-spin" size={18} />}
        {loading ? 'Enviando...' : 'Enviar solicitud'}
      </button>
    </form>
  );
}
