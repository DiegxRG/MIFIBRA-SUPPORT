import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../../../lib/validators';
import { useLogin } from '../hooks/useLogin';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
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
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

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
      const session = await login(data);

      if (session.mustChangePassword) {
        toast.warning('Cambio de contraseña requerido', {
          description: 'Tu cuenta requiere actualizar la contraseña antes de continuar con normalidad.',
        });
      } else {
        toast.success('Bienvenido', { description: 'Tu panel ya está listo.' });
      }

      navigate('/dashboard');
    } catch (err) {
      // Error is handled by hook and displayed via UI
    }
  };

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((current) => !current)}
      className="inline-flex items-center justify-center rounded-lg p-1 text-text-muted transition-colors hover:text-text-primary"
      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    >
      {showPassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076A10.744 10.744 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.673 2.68"/><path d="m14.084 14.158-.001.001"/><path d="M17.479 17.499A10.75 10.75 0 0 1 12 19c-7 0-10-7-10-7a13.151 13.151 0 0 1 2.421-3.362"/><path d="m2 2 20 20"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
      )}
    </button>
  );

  return (
    <>
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
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message}
          icon={lockIcon}
          suffix={passwordToggle}
          autoComplete="current-password"
          {...register('password')}
        />

        <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_170px] sm:items-center">
          <Button
            type="submit"
            className="w-full rounded-2xl px-7 py-4 text-base shadow-[0_0_28px_rgba(243,24,143,0.35)] ring-1 ring-mf-pink/25"
            size="lg"
            isLoading={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            Ingresar
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full rounded-2xl border-mf-pink/20 bg-mf-pink/8 py-4 hover:border-mf-pink/40 hover:bg-mf-pink/12"
            size="lg"
            onClick={() => setIsRegisterOpen(true)}
          >
            Registrarse
          </Button>
        </div>

        <div className="mt-3 rounded-2xl border border-border-subtle/60 bg-surface/55 p-4 text-sm text-text-secondary">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-gs-blue-mid/12 p-2 text-gs-blue-light">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 11-8 11s-8-5-8-11a8 8 0 0 1 16 0Z"/><path d="M8 10h8"/><path d="M12 6v8"/></svg>
            </div>
            <div>
              <p className="font-medium text-text-primary">¿Necesitas ayuda?</p>
              <p className="mt-1 text-text-muted">Si no puedes ingresar, contacta a TI interno para validar tu acceso.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border-subtle/50 pt-4 text-center text-xs text-text-muted">
          <p>© 2026 MiFibra. Todos los derechos reservados.</p>
          <p>Desarrollado por <span className="font-semibold text-mf-pink-light">TxDxSecure</span></p>
        </div>
      </form>

      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Registro próximamente"
        description="El alta de nuevos usuarios aún no está habilitada en esta versión."
        footer={<Button variant="primary" onClick={() => setIsRegisterOpen(false)}>Entendido</Button>}
      >
        <div className="space-y-3 text-sm text-text-secondary">
          <p>Muy pronto podrás solicitar tu acceso desde esta misma pantalla.</p>
          <div className="rounded-xl border border-border-subtle/60 bg-surface/55 p-4">
            <p className="font-medium text-text-primary">Mientras tanto</p>
            <p className="mt-1">Pide la creación de tu usuario al equipo interno con tu correo corporativo y el área a la que perteneces.</p>
          </div>
        </div>
      </Modal>
    </>
  );
}
