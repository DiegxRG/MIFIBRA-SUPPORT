import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
import { createUser } from '@/api/users';
import type { UserCreateResponse } from '@/types/api';
import { toast } from 'sonner';

const schema = z.object({
  full_name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Enter a valid email'),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

interface Props {
  onClose: () => void;
  onCreated: (result: UserCreateResponse) => void;
}

export default function UserFormModal({ onClose, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof schema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: { full_name: '', email: '', role: 'USER' },
  });

  const onSubmit = async (data: z.input<typeof schema>) => {
    setLoading(true);
    try {
      const result = await createUser(data);
      onCreated(result);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response: { data: { detail: string } } }).response?.data?.detail ?? '')
          : 'Failed to create user';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass-card p-6 w-full max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-primary">
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold text-text-primary mb-5">Create User</h2>

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

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Role *</label>
            <select {...register('role')} className="input-base">
              <option value="USER">USER (Call Center)</option>
              <option value="ADMIN">ADMIN (NOC / Operación)</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
}
