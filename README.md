# Tienda React Duoc

Aplicación de tienda en React/Vite con API REST Spring Boot, autenticación JWT y base de datos relacional H2 en archivo.

## Requisitos

- Node.js 24.x y npm
- Java 21 para ejecutar o probar el backend

## Ejecutar localmente

### Backend

Desde PowerShell:

```powershell
cd backend
.\mvnw.cmd test
$env:ADMIN_EMAIL="admin@ejemplo.cl"
$env:ADMIN_INITIAL_PASSWORD="CAMBIA_POR_UNA_CLAVE_DE_12_CARACTERES"
$bytes = New-Object byte[] 48
$rng = [Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
.\mvnw.cmd spring-boot:run
```

La API escucha en `127.0.0.1:8080`. La base H2 queda bajo `backend\data\tienda` cuando se ejecuta desde esa carpeta. El administrador se crea solo si ese correo no existe; cambiar la variable de contraseña no modifica una cuenta existente.

Para crear un vendedor en un entorno nuevo, configura además `SELLER_EMAIL` y `SELLER_INITIAL_PASSWORD` (12 caracteres o más). No guardes contraseñas ni claves JWT en Git.

### Frontend

En otra terminal, desde la raíz:

```powershell
npm ci
npm run dev
```

Para usar el modo túnel del archivo `.env.tunel.local`:

```powershell
npm run dev -- --mode tunel
```

Ese modo espera el túnel SSH a `localhost:8081` descrito en [deploy/README.md](./deploy/README.md). La tienda consume el catálogo desde la API; el carrito se mantiene localmente hasta confirmar una compra, que se guarda como boleta en el backend.

## API y seguridad

- OpenAPI/Swagger: `http://127.0.0.1:8080/swagger-ui/index.html`
- Salud: `http://127.0.0.1:8080/api/health`
- Rutas principales: `/api/v1/auth`, `/api/v1/productos`, `/api/v1/categorias` y `/api/v1/boletas`
- Las rutas antiguas `/api/auth` y `/api/productos` siguen disponibles por compatibilidad.
- Roles: `ADMIN`, `VENDEDOR` y `CLIENTE`. Las operaciones de escritura de productos son solo de administrador; vendedor puede consultar productos y boletas.
- La compra queda confirmada en la base de datos, pero no se conecta a una pasarela ni procesa pagos reales.
- Los tokens JWT expiran según `JWT_EXPIRATION_SECONDS` (900 por defecto).

Consulta la [ERS actualizada](./docs/ERS_Parcial3.md), el [manual de usuario](./docs/Manual_Usuario.md), la [guía API/Postman](./docs/API_Postman.md) y la [guía de despliegue EC2](./deploy/README.md).

## Verificación

```powershell
cd backend
.\mvnw.cmd test
cd ..
npm run build
npx eslint src/api src/auth src/components/NavbarTienda.jsx src/components/AdminSidebar.jsx src/views/CheckoutView.jsx src/views/PagoExitosoView.jsx src/views/LoginView.jsx src/views/admin src/views/seller src/App.jsx
```
