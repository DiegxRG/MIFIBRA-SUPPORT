import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
import { createUser, updateUser } from '@/api/users';
import type { UserCreateResponse, UserRead } from '@/types/api';
import { toast } from 'sonner';

const createSchema = z.object({
  full_name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Ingresa un correo valido'),
  password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
  is_active: z.boolean().default(true),
});

const editSchema = z.object({
  full_name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Ingresa un correo valido'),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
  is_active: z.boolean().default(true),
});

interface Props {
  onClose: () => void;
  onCreated?: (result: UserCreateResponse) => void;
  onUpdated?: () => void;
  user?: UserRead | null;
}

export default function UserFormModal({ onClose, onCreated, onUpdated, user }: Props) {
  const isEdit = Boolean(user);
  const [loading, setLoading] = useState(false);
  const schema = isEdit ? editSchema : createSchema;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof createSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: { full_name: '', email: '', password: '', role: 'USER', is_active: true },
  });

  useEffect(() => {
    if (!user) return;
    setValue('full_name', user.full_name);
    setValue('email', user.email);
    setValue('role', user.role);
    setValue('is_active', user.is_active);
  }, [user, setValue]);

  const onSubmit = async (data: z.input<typeof createSchema>) => {
    setLoading(true);
    try {
      if (isEdit && user) {
        await updateUser(user.id, {
          full_name: data.full_name,
          email: data.email,
          role: data.role,
          is_active: data.is_active,
        });
        toast.success('Usuario actualizado');
        onUpdated?.();
      } else {
        const result = await createUser(data);
        onCreated?.(result);
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response: { data: { detail: string } } }).response?.data?.detail ?? '')
          : `No se pudo ${isEdit ? 'actualizar' : 'crear'} el usuario`;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card p-6 w-full max-w-md mx-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-primary">
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold text-text-primary mb-5">{isEdit ? 'Editar usuario' : 'Crear usuario'}</h2>

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Nombre completo *</label>
            <input {...register('full_name')} placeholder="Juan Perez" className="input-base" />
            {errors.full_name && <p className="mt-1 text-xs text-status-expired">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Email *</label>
            <input {...register('email')} type="email" placeholder="user@example.com" className="input-base" />
            {errors.email && <p className="mt-1 text-xs text-status-expired">{errors.email.message}</p>}
          </div>

          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Contrasena *</label>
              <input {...register('password')} type="password" placeholder="Minimo 8 caracteres" className="input-base" />
              {errors.password && <p className="mt-1 text-xs text-status-expired">{errors.password.message}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Rol *</label>
            <select {...register('role')} className="input-base">
              <option value="USER">Usuario (Call Center)</option>
              <option value="ADMIN">Administrador (NOC / Operacion)</option>
            </select>
          </div>

          {isEdit && (
            <label className="flex items-center gap-2 text-sm text-text-primary">
              <input type="checkbox" {...register('is_active')} className="accent-gs-orange" />
              Usuario activo
            </label>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? (isEdit ? 'Guardando...' : 'Creando...') : (isEdit ? 'Guardar cambios' : 'Crear usuario')}
          </button>
        </form>
      </div>
    </div>
  );
}
