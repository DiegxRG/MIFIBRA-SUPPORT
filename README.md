# MiFibra Support

Panel interno de `MiFibra` para gestionar accesos temporales, bloqueos de IP y seguimiento operativo por zona.

## Resumen

La aplicación permite:

- iniciar sesión con usuarios internos mock
- registrar IPs en `Whitelist`
- enviar IPs a `Blacklist`
- revisar historial con filtros, paginación y exportación
- visualizar actividad geográfica en el dashboard

## Tecnologías

- `React`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `Zustand`
- `MSW` para datos mock

## Instalación

1. Instala dependencias:

```bash
npm install
```

2. Levanta el proyecto en desarrollo:

```bash
npm run dev
```

3. Abre la app en tu navegador:

```text
http://localhost:3000
```

## Credenciales de prueba

Puedes ingresar con cualquiera de estos usuarios mock:

### Usuario soporte

- Correo: `soporte@mifibra.pe`
- Contraseña: `password123`

### Usuario supervisor

- Correo: `admin@mifibra.pe`
- Contraseña: `password123`

## Scripts disponibles

```bash
npm run dev
```

Inicia el entorno de desarrollo.

```bash
npm run build
```

Genera la build de producción.

```bash
npm run preview
```

Sirve la build generada localmente.

```bash
npm run lint
```

Ejecuta validaciones de código.

## Funcionamiento breve

### Login

Permite el acceso al panel con cuentas internas `@mifibra.pe`.

### Dashboard

Muestra:

- resumen operativo
- métricas clave
- mapa de actividad por zona
- estado general del sistema

### Whitelist

Permite autorizar IPs por un tiempo definido o personalizado.

### Blacklist

Permite bloquear IPs temporalmente con motivo y ticket asociado.

### Historial y reportes

En `Whitelist` y `Blacklist` puedes:

- buscar por IP, ticket, agente o motivo
- filtrar por estado
- paginar resultados
- exportar a `Excel` y `PDF`

## Datos mock

Actualmente la app funciona con datos mock mediante `MSW`, por lo que puedes probar todo el flujo sin backend real.

## Estado del proyecto

Incluye actualmente:

- login interno
- dashboard con mapa de Perú
- gestión de whitelist
- gestión de blacklist
- exportación de reportes

## Créditos

Desarrollado por `TxDxSecure`.
