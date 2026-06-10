import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
import { createUser, updateUser } from '@/api/users';
import type { UserCreateResponse, UserRead } from '@/types/api';
import { toast } from 'sonner';

const createSchema = z.object({
  full_name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
  is_active: z.boolean().default(true),
});

const editSchema = z.object({
  full_name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Enter a valid email'),
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
        toast.success('User updated');
        onUpdated?.();
      } else {
        const result = await createUser(data);
        onCreated?.(result);
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response: { data: { detail: string } } }).response?.data?.detail ?? '')
          : `Failed to ${isEdit ? 'update' : 'create'} user`;
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
        <h2 className="text-lg font-semibold text-text-primary mb-5">{isEdit ? 'Edit User' : 'Create User'}</h2>

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Full Name *</label>
            <input {...register('full_name')} placeholder="John Doe" className="input-base" />
            {errors.full_name && <p className="mt-1 text-xs text-status-expired">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Email *</label>
            <input {...register('email')} type="email" placeholder="user@example.com" className="input-base" />
            {errors.email && <p className="mt-1 text-xs text-status-expired">{errors.email.message}</p>}
          </div>

          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Password *</label>
              <input {...register('password')} type="password" placeholder="Minimum 8 characters" className="input-base" />
              {errors.password && <p className="mt-1 text-xs text-status-expired">{errors.password.message}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Role *</label>
            <select {...register('role')} className="input-base">
              <option value="USER">USER (Call Center)</option>
              <option value="ADMIN">ADMIN (NOC / Operación)</option>
            </select>
          </div>

          {isEdit && (
            <label className="flex items-center gap-2 text-sm text-text-primary">
              <input type="checkbox" {...register('is_active')} className="accent-gs-orange" />
              Active user
            </label>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create User')}
          </button>
        </form>
      </div>
    </div>
  );
}
