import { z } from 'zod';

// ===== IP Validation =====
const PRIVATE_IP_RANGES = [
  /^0\./,           // 0.0.0.0/8
  /^10\./,          // 10.0.0.0/8
  /^127\./,         // 127.0.0.0/8 (loopback)
  /^169\.254\./,    // 169.254.0.0/16 (link-local)
  /^172\.(1[6-9]|2\d|3[01])\./, // 172.16.0.0/12
  /^192\.168\./,    // 192.168.0.0/16
  /^255\.255\.255\.255$/, // broadcast
];

function isPrivateIP(ip: string): boolean {
  return PRIVATE_IP_RANGES.some((range) => range.test(ip));
}

export const ipv4Schema = z
  .string()
  .min(1, 'La IP es obligatoria')
  .regex(
    /^(\d{1,3}\.){3}\d{1,3}$/,
    'IP inválida. Formato esperado: 190.119.45.172'
  )
  .refine((ip) => ip.split('.').every((n) => parseInt(n) <= 255), {
    message: 'Cada octeto debe ser entre 0 y 255',
  })
  .refine((ip) => !isPrivateIP(ip), {
    message: 'Solo se permiten IPs públicas. Esta es una IP privada/reservada.',
  });

// ===== Ticket Validation =====
export const ticketIdSchema = z
  .string()
  .min(1, 'El ID del ticket es obligatorio')
  .regex(/^TK-\d{4}-\d{4}$/, 'Formato inválido. Esperado: TK-2026-8849');

// ===== Exclusion Time Validation =====
export const exclusionHoursSchema = z
  .number({ message: 'Selecciona un tiempo de exclusión válido' })
  .int('Usa horas completas')
  .min(1, 'El tiempo mínimo es 1 hora')
  .max(168, 'El tiempo máximo es 168 horas');

// ===== Register IP Form Schema =====
export const registerIPSchema = z.object({
  clientIP: ipv4Schema,
  ticketId: ticketIdSchema,
  exclusionHours: exclusionHoursSchema,
});

export const blacklistHoursSchema = z
  .number({ message: 'Selecciona una duracion valida' })
  .int('Usa horas completas')
  .min(1, 'El tiempo mínimo es 1 hora')
  .max(720, 'El tiempo máximo es 720 horas');

export const blacklistReasonSchema = z
  .string()
  .min(3, 'Ingresa un motivo valido')
  .max(120, 'Usa un motivo mas corto');

export const registerBlacklistSchema = z.object({
  clientIP: ipv4Schema,
  ticketId: ticketIdSchema,
  reason: blacklistReasonSchema,
  blockHours: blacklistHoursSchema,
});

// ===== Login Form Schema =====
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Email inválido')
    .refine((email) => email.endsWith('@mifibra.pe'), {
      message: 'Solo se permiten cuentas @mifibra.pe',
    }),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const changePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, 'La contraseña actual es obligatoria')
      .min(8, 'La contraseña actual debe tener al menos 8 caracteres'),
    new_password: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .max(128, 'La nueva contraseña es demasiado larga'),
    confirm_password: z
      .string()
      .min(1, 'Confirma la nueva contraseña'),
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: 'La nueva contraseña debe ser distinta a la actual',
    path: ['new_password'],
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type RegisterIPFormInput = z.input<typeof registerIPSchema>;
export type RegisterIPFormData = z.infer<typeof registerIPSchema>;
export type RegisterBlacklistFormInput = z.input<typeof registerBlacklistSchema>;
export type RegisterBlacklistFormData = z.infer<typeof registerBlacklistSchema>;
