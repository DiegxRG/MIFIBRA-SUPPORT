import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { changePassword } from '../features/auth/services/authService';
import { useAuthStore } from '../features/auth/store/authStore';
import { changePasswordSchema, type ChangePasswordFormData } from '../lib/validators';

const lockIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="12" x="3" y="10" rx="2" />
    <path d="M7 10V7a5 5 0 0 1 10 0v3" />
  </svg>
);

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { detail?: string } } }).response;
    return response?.data?.detail || 'No se pudo actualizar la contraseña';
  }

  return 'No se pudo actualizar la contraseña';
}

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user, logout, markPasswordChanged } = useAuthStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      await changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      });
      markPasswordChanged();
      reset();
      toast.success('Contraseña actualizada', {
        description: 'Ya puedes continuar usando el sistema.',
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-dark bg-grid page-shell px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="ambient-orb left-[-8rem] top-[-6rem] h-72 w-72 bg-mf-pink/18" />
      <div className="ambient-orb right-[-6rem] top-[20%] h-64 w-64 bg-gs-blue-mid/16" />
      <div className="ambient-orb bottom-[-8rem] left-[20%] h-80 w-80 bg-gs-orange/12" />

      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-3xl items-center justify-center sm:min-h-[calc(100vh-3rem)]">
        <div className="glass-card w-full p-7 sm:p-8 lg:p-10">
          <div className="mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-status-pending/25 bg-status-pending/10 px-3 py-1.5 text-xs font-medium text-status-pending">
              <span className="h-2 w-2 rounded-full bg-status-pending" />
              Cambio obligatorio
            </div>
            <div>
              <p className="section-label mb-2">Seguridad de acceso</p>
              <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">Actualiza tu contraseña para continuar</h1>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
              Tu cuenta {user?.email ? `(${user.email})` : ''} requiere una nueva contraseña antes de usar el resto del sistema.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {serverError && (
              <div className="rounded-xl border border-status-expired/30 bg-status-expired/10 p-3 text-sm text-status-expired">
                {serverError}
              </div>
            )}

            <Input
              label="Contraseña actual"
              type={showCurrentPassword ? 'text' : 'password'}
              autoComplete="current-password"
              icon={lockIcon}
              error={errors.current_password?.message}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((value) => !value)}
                  className="inline-flex items-center justify-center rounded-lg p-1 text-text-muted transition-colors hover:text-text-primary"
                  aria-label={showCurrentPassword ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'}
                >
                  {showCurrentPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              }
              {...register('current_password')}
            />

            <Input
              label="Nueva contraseña"
              type={showNewPassword ? 'text' : 'password'}
              autoComplete="new-password"
              icon={lockIcon}
              error={errors.new_password?.message}
              helperText="Usa al menos 8 caracteres."
              suffix={
                <button
                  type="button"
                  onClick={() => setShowNewPassword((value) => !value)}
                  className="inline-flex items-center justify-center rounded-lg p-1 text-text-muted transition-colors hover:text-text-primary"
                  aria-label={showNewPassword ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'}
                >
                  {showNewPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              }
              {...register('new_password')}
            />

            <Input
              label="Confirmar nueva contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              icon={lockIcon}
              error={errors.confirm_password?.message}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="inline-flex items-center justify-center rounded-lg p-1 text-text-muted transition-colors hover:text-text-primary"
                  aria-label={showConfirmPassword ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
                >
                  {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              }
              {...register('confirm_password')}
            />

            <div className="rounded-2xl border border-border-subtle/60 bg-surface/55 p-4 text-sm text-text-secondary">
              Mientras `must_change_password` siga activo, la app bloqueará el resto de rutas por seguridad.
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
              <Button type="submit" size="lg" className="w-full rounded-2xl py-4" isLoading={isSubmitting}>
                Guardar nueva contraseña
              </Button>
              <Button type="button" variant="secondary" size="lg" className="w-full rounded-2xl py-4" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
