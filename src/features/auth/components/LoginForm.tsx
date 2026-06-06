import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../../../lib/validators';
import { useLogin } from '../hooks/useLogin';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const mailIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7" />
  </svg>
);

const lockIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="12" x="3" y="10" rx="2" />
    <path d="M7 10V7a5 5 0 0 1 10 0v3" />
  </svg>
);

export function LoginForm() {
  const { login, isLoading, error } = useLogin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success('Bienvenido', { description: 'Tu panel ya está listo.' });
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by hook and displayed via UI
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
      {error && (
        <div className="rounded-xl border border-status-expired/30 bg-status-expired/10 p-3 text-sm text-status-expired">
          {error}
        </div>
      )}

      <Input
        label="Correo corporativo"
        type="email"
        placeholder="usuario@mifibra.pe"
        error={errors.email?.message}
        icon={mailIcon}
        autoComplete="email"
        {...register('email')}
      />

      <Input
        label="Clave de acceso"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        icon={lockIcon}
        autoComplete="current-password"
        {...register('password')}
      />

      <Button type="submit" className="mt-2 w-full" size="lg" isLoading={isLoading}>
        Ingresar
      </Button>

      <div className="mt-3 rounded-xl border border-border-subtle/60 bg-surface/55 p-4 text-sm text-text-secondary">
        <p className="font-medium text-text-primary">¿Necesitas ayuda?</p>
        <p className="mt-1 text-text-muted">Si no puedes ingresar, contacta a TI interno.</p>
      </div>
    </form>
  );
}
