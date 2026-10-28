# SmartInventory — Frontend

Aplicación web para gestionar inventarios, proveedores y movimientos de productos. Se conecta a la API de SmartInventory y ofrece un panel con gráficos de transacciones y acceso según el rol del usuario.

## Funcionalidades

- Registro, inicio de sesión y consulta del perfil.
- Gestión de productos, categorías y proveedores para administradores.
- Registro de compras, ventas y devoluciones a proveedores.
- Consulta de transacciones, su detalle y estado.
- Panel de indicadores con gráficos de líneas, barras y distribución de transacciones.
- Rutas protegidas para usuarios con roles `ADMIN` y `MANAGER`.

## Tecnologías

React 19 · Vite 6 · Tailwind CSS 4 · React Router 7 · Axios · Recharts · CryptoJS

## Instalación y ejecución

Requiere **Node.js compatible con Vite 6**, **npm** y el [backend de SmartInventory](https://github.com/thoonidev/SmartInventory-Backend) configurado y en ejecución.

```bash
git clone https://github.com/thoonidev/SmartInventory-Frontend.git
cd SmartInventory-Frontend
npm ci
npm run dev
```

Abre la dirección que indique la terminal, normalmente `http://localhost:5173`. La pantalla de inicio muestra el formulario de acceso; también puedes registrar una cuenta en `/register`.

## Conexión con el backend

La dirección de la API está definida en `src/service/ApiService.js`:

```javascript
static BASE_URL = "http://localhost:5050/api";
```

Si tu backend utiliza otra dirección, modifica ese valor. Esta versión no utiliza variables `.env` para configurar la API.

El frontend conserva el token JWT y el rol en `localStorage` mediante CryptoJS y envía el token con `Authorization: Bearer <token>`. Las pantallas de productos, categorías y proveedores requieren una cuenta con rol `ADMIN`; el registro del backend asigna `MANAGER` de forma predeterminada.

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Genera la compilación de producción en `dist/`. |
| `npm run preview` | Permite revisar la compilación localmente. |
| `npm run lint` | Revisa el código con ESLint. |
