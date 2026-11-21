# Plan y resultado de pruebas — Tienda React Duoc

Las pruebas ejecutables del backend están en `backend/src/test/java/cl/tienda/api/ApiIntegrationTest.java`. Ejecuta desde la carpeta `backend`:

```powershell
.\mvnw.cmd test
```

## Cobertura automatizada backend

| Caso | Resultado esperado |
|---|---|
| Consultar catálogo y categorías sin token | `200`; productos iniciales y categorías disponibles. |
| Intentar crear producto sin autenticación | `401`. |
| Administrador ejecuta CRUD de producto | Crear `201`, consultar/actualizar `200`, eliminar `204`, luego consultar `404`. |
| Registrar cliente e iniciar sesión | `201` en registro; `200` en login con JWT, expiración y rol `CLIENTE`. |
| Cliente intenta modificar catálogo | `403`. |
| Cliente DUOC registra una compra | `201`; subtotal, descuento del 20%, total y detalle calculados con el precio de servidor. |
| Vendedor consulta boletas | `200` para listado y detalle; no puede actualizar productos (`403`). |

## Verificaciones frontend

En la raíz del proyecto:

```powershell
npm run build
npx eslint src/api src/auth src/components/NavbarTienda.jsx src/components/AdminSidebar.jsx src/views/CheckoutView.jsx src/views/PagoExitosoView.jsx src/views/LoginView.jsx src/views/admin src/views/seller src/App.jsx
```

El repositorio no configura actualmente un runner para las pruebas React antiguas. `npm run lint` global puede reportar los globals `describe`, `test` y `expect` en `src/components/ProductCard.spec.jsx`; ese archivo no forma parte de los tests automatizados descritos aquí.

## Pruebas manuales de aceptación

1. Abrir la tienda y verificar que el catálogo aparece desde Spring Boot.
2. Registrar e iniciar sesión como cliente; verificar que el token se guarda en `sessionStorage`.
3. Agregar productos al carrito y confirmar una compra. Revisar la respuesta `201` de `POST /api/v1/boletas` y la pantalla con el número de boleta.
4. Probar una cuenta DUOC y otra no DUOC; comparar el descuento que calcula el backend.
5. Iniciar sesión como administrador, completar CRUD de producto y revisar boletas.
6. Iniciar sesión como vendedor; comprobar consulta de productos/boletas y rechazo de escrituras.
7. Abrir `/swagger-ui/index.html` y verificar que se publica el contrato OpenAPI.
8. Reiniciar Spring Boot y comprobar que las boletas continúan en H2.

No compartas ni incluyas en evidencias contraseñas, tokens JWT, archivos de base H2 o claves SSH.